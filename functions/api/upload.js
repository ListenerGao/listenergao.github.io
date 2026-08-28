// Cloudflare Pages Functions — 图片上传接口
// 依赖 Pages 项目侧配置：R2 绑定 IMG_BUCKET → 存储桶 img
//
// 鉴权完全由 Cloudflare Access 在边缘承担，这里不再自行校验身份。
//
// ⚠️ 安全边界：Access 应用「图片上传」的目标必须同时覆盖这两条路径，
//    www.listenergao.com/upload-img*  和  www.listenergao.com/api/*
//    漏掉后者，这个接口就是公开可写的。改 Access 配置后务必验证：
//      curl -o /dev/null -w '%{http_code}\n' -X POST https://www.listenergao.com/api/upload
//    未登录状态下必须是 302（被拦到登录页），不能是 4xx/5xx。
//
// 注：曾尝试在此校验 Access 注入的 Cf-Access-Authenticated-User-Email 头作为兜底，
//    实测该头不会传到 Pages Functions（请求已过 Access 却读不到，导致正常上传被拒）。
//    只检查 CF_Authorization cookie 存在与否等于没检查（可伪造），要做就得完整校验
//    JWT 签名与 AUD，成本高于收益，故移除。
//
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
