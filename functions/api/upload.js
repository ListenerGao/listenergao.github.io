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

// 兼作类型白名单和扩展名来源：文件名取毫秒时间戳，后缀由 MIME 决定，
// 不依赖原文件名（剪贴板截图往往没有可靠的文件名）
const EXT_BY_TYPE = new Map([
  ['image/png', '.png'],
  ['image/jpeg', '.jpg'],
  ['image/gif', '.gif'],
  ['image/webp', '.webp'],
  ['image/svg+xml', '.svg'],
  ['image/avif', '.avif'],
])

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json;charset=UTF-8' },
  })

const cleanSlug = slug =>
  slug.toLowerCase().replace(/[^\w一-龥-]+/g, '-').replace(/^-+|-+$/g, '')

// Workers 运行在 UTC，直接用 new Date() 会让北京时间晚 8 点后上传的图落到前一天的目录。
// 固定按 Asia/Shanghai 取年月日，与站点 _config.yml 的 timezone 保持一致。
const todayParts = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date()).split('-')

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
  const ext = EXT_BY_TYPE.get(file.type)
  if (!ext) return json({ error: `不支持的类型: ${file.type || '未知'}` }, 415)
  if (file.size > MAX_SIZE) return json({ error: `文件超过 ${MAX_SIZE / 1024 / 1024} MB` }, 413)

  const slug = cleanSlug(String(form.get('slug') || ''))
  const dir = [...todayParts(), slug].filter(Boolean).join('/')

  let key = `${dir}/${Date.now()}${ext}`
  // 同一毫秒内并发上传会撞名，撞了就加随机后缀，绝不覆盖已有对象
  if (await env.IMG_BUCKET.head(key)) {
    key = `${dir}/${Date.now()}-${Math.random().toString(36).slice(2, 6)}${ext}`
  }

  await env.IMG_BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType: file.type, cacheControl: 'public, max-age=31536000, immutable' },
  })

  return json({ key, size: file.size, url: `${PUBLIC_BASE}/${key}` })
}
