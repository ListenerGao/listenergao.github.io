// Cloudflare Pages Functions — 图片上传接口
// 依赖 Pages 项目侧配置：R2 绑定 IMG_BUCKET → 存储桶 img
//
// 鉴权由 Cloudflare Access 承担：Access 应用必须同时覆盖 /upload-img* 和 /api/*，
// 未认证请求在边缘就被拦下，根本到不了这里。下面对认证头的检查是兜底——
// 万一 Access 的路径配漏了 /api/*，这里仍然拒绝，而不是让接口裸奔。
// 公开访问地址由 PUBLIC_BASE 拼出，图片实际由 img.listenergao.com 提供

const PUBLIC_BASE = 'https://img.listenergao.com'
const MAX_SIZE = 20 * 1024 * 1024

const ALLOWED_TYPES = new Set([
  'image/png', 'image/jpeg', 'image/gif', 'image/webp',
  'image/svg+xml', 'image/avif',
])

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json;charset=UTF-8' },
  })

// 与命令行脚本 ~/.config/r2/r2img.mjs 的 cleanName 保持一致
function cleanName(name) {
  const dot = name.lastIndexOf('.')
  const ext = dot > 0 ? name.slice(dot).toLowerCase() : ''
  const stem = (dot > 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^\w一-龥-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return (stem || 'file') + ext
}

const cleanSlug = slug =>
  slug.toLowerCase().replace(/[^\w一-龥-]+/g, '-').replace(/^-+|-+$/g, '')

export async function onRequestPost({ request, env }) {
  if (!env.IMG_BUCKET) return json({ error: '服务端未绑定 IMG_BUCKET' }, 500)

  // Access 认证通过后会注入这个头，具体放行哪些邮箱由 Access 策略决定
  if (!request.headers.get('Cf-Access-Authenticated-User-Email')) {
    return json({ error: '未经 Cloudflare Access 认证' }, 401)
  }

  let form
  try {
    form = await request.formData()
  } catch {
    return json({ error: '请求格式错误' }, 400)
  }

  const file = form.get('file')
  if (!file || typeof file === 'string') return json({ error: '没有收到文件' }, 400)
  if (!ALLOWED_TYPES.has(file.type)) return json({ error: `不支持的类型: ${file.type || '未知'}` }, 415)
  if (file.size > MAX_SIZE) return json({ error: `文件超过 ${MAX_SIZE / 1024 / 1024} MB` }, 413)

  const now = new Date()
  const slug = cleanSlug(String(form.get('slug') || ''))
  const dir = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), slug]
    .filter(Boolean).join('/')

  let key = `${dir}/${cleanName(file.name || 'image.png')}`
  // 同名不覆盖：已存在就在文件名后加随机后缀
  if (await env.IMG_BUCKET.head(key)) {
    const dot = key.lastIndexOf('.')
    const suffix = Math.random().toString(36).slice(2, 6)
    key = dot > 0 ? `${key.slice(0, dot)}-${suffix}${key.slice(dot)}` : `${key}-${suffix}`
  }

  await env.IMG_BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType: file.type, cacheControl: 'public, max-age=31536000, immutable' },
  })

  return json({ key, size: file.size, url: `${PUBLIC_BASE}/${key}` })
}
