# ListenerGao's Blog

个人博客源码仓库。**源码即仓库**——文章、配置、部署流水线全部在 main 分支，push 即发布。

- **主站**：https://www.listenergao.com （Cloudflare Pages 构建与托管，DNS 托管在 Cloudflare）
- **备份部署**：https://listenergao.github.io （GitHub Actions 构建，部署到 GitHub Pages；对外全站 301 跳转到主站，避免双域名重复内容影响 SEO）

## 技术栈

- [Hexo 8](https://hexo.io/) 静态站点生成器
- [Fluid](https://github.com/fluid-dev/hexo-theme-fluid) 主题（npm 方式安装）
- 评论：[Utterances](https://utteranc.es/)（基于 GitHub Issues）
- 统计：[不蒜子](https://busuanzi.ibruce.info/)（页脚访问量 + 文章阅读数）
- 图床上传页：Cloudflare Pages Functions + R2，鉴权走 Cloudflare Access（见「图床上传页」一节）

## 视觉定制

清爽极简风，全站不超过 4 个颜色角色：白/近白底、灰黑文字、青蓝强调色（`#0d9488`，暗色模式 `#2dd4bf`）、浅灰分隔线。改动分两层：

- `_config.fluid.yml`：配色（浅/暗两套）、系统无衬线字体栈（不引入 webfont）、代码高亮 github / github-dark、各页面头图与高度
- `source/css/custom.css`：主题配置覆盖不到的细节——正文排版（17px / 1.85 行距 / 标题节奏）、代码块与引用块样式、导航栏与主面板阴影、首屏入场动画（遵循 `prefers-reduced-motion`）

头图是手写的浅色单色渐变 SVG（`source/img/banner.svg`），暗色模式下由 custom.css 叠加深色蒙版。调整视觉只需动这三个文件，不要改 `node_modules` 里的主题源码。

## 部署架构

```
push 到 main ─┬─→ Cloudflare Pages 自动构建 ──→ www.listenergao.com（主站）
              │   ├─ public/        ← hexo generate 的静态产物
              │   └─ functions/     ← Pages Functions，提供 /api/upload
              └─→ GitHub Actions（.github/workflows/pages.yml）──→ listenergao.github.io
                  （备份部署；Pages 设置绑定了自定义域名，使 github.io 301 跳转到主站。
                   DNS 未指向 GitHub，设置页的 DNS check 警告属预期，勿动。
                   此路径不含 Functions，故备份站没有上传接口）
```

域名 listenergao.com 注册在 Spaceship，NS 记录指向 Cloudflare（即 DNS 托管在 Cloudflare，2026-07-16 迁移，此前为 Vercel 构建托管）。当前 NS 为 `maxine.ns.cloudflare.com` / `peyton.ns.cloudflare.com`，可用 `dig +short NS listenergao.com` 复核：

- DNS、CDN、裸域 301 跳 www（重定向规则）均由 Cloudflare 承担
- Cloudflare Pages 构建参数：构建命令 `npx hexo generate`，输出目录 `public`，环境变量 `NODE_VERSION=22`
- `@listenergao.com` 收件转发用 Cloudflare Email Routing；Resend 发信记录（`send` 子域 MX/SPF、`resend._domainkey` DKIM）在 Cloudflare DNS 中维持原值

## 本地开发

```bash
npm install              # 安装依赖（更新依赖请用官方源，见 CLAUDE.md）
npx hexo new "文章标题"   # 新建文章，生成到 source/_posts/
npx hexo server          # 本地预览 http://localhost:4000
npx hexo generate        # 构建，验证无报错
npx hexo clean           # 构建异常时清缓存
```

## 图床上传页

https://www.listenergao.com/upload-img/ ——拖拽、Cmd+V 粘贴或选文件上传图片，返回公开链接与 Markdown 引用。图片存在 Cloudflare R2（桶 `img`），通过 `img.listenergao.com` 对外提供，出口流量免费。

```
浏览器 /upload-img/ ──POST /api/upload──→ functions/api/upload.js ──R2 binding──→ 桶 img
                                                                                    ↓
                                                    https://img.listenergao.com/年/月/日/[目录/]时间戳.png
```

- **鉴权走 Cloudflare Access**，在边缘拦截，代码里不存在任何凭证。⚠️ Access 应用的目标必须**同时**覆盖 `www.listenergao.com/upload-img*` 和 `www.listenergao.com/api/*`；漏掉后者，上传接口就是公开可写的。改完 Access 配置务必复验，未登录下应为 302：

  ```bash
  curl -o /dev/null -w '%{http_code}\n' -X POST https://www.listenergao.com/api/upload
  ```

- **Pages 项目需要一个 R2 绑定**：变量名 `IMG_BUCKET` → 桶 `img`。缺了接口会返回「服务端未绑定 IMG_BUCKET」
- 文件名用毫秒时间戳，后缀由 MIME 决定；路径日期固定按 `Asia/Shanghai` 计算（Workers 跑在 UTC，不固定会串天）
- **本地调试 Functions**：`npx wrangler pages dev public --r2 IMG_BUCKET --compatibility-date=2026-08-11`，需 node 22
- **命令行入口**：`node ~/.config/r2/r2img.mjs put <图片> [目录]`（全局工具，不在本仓库，凭证在 `~/.config/r2/img.env`）。两个入口的路径与命名规则一致，改一侧要同步另一侧

## 目录说明

| 路径 | 说明 |
|------|------|
| `source/_posts/` | 文章（Markdown） |
| `source/about/` | 关于页 |
| `source/img/` | 站点图片（头像、favicon、微信二维码、头图 banner.svg） |
| `source/css/custom.css` | 自定义样式（排版细节、首屏动画） |
| `source/upload-img/index.html` | 图床上传页（纯静态，走 `skip_render` 原样输出） |
| `functions/api/upload.js` | Pages Functions 上传接口，写入 R2 |
| `_config.yml` | Hexo 站点配置 |
| `_config.fluid.yml` | Fluid 主题覆盖配置（配色、字体、头图） |
| `.github/workflows/pages.yml` | GitHub Pages 部署流水线 |
| `ROADMAP.md` | 项目进度与踩坑记录 |
| `source/google*.html` | Search Console 所有权验证文件，**不可删除** |
