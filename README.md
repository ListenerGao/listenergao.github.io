# ListenerGao's Blog

个人博客源码仓库。**源码即仓库**——文章、配置、部署流水线全部在 main 分支，push 即发布。

- **主站**：https://www.listenergao.com （Cloudflare Pages 构建与托管，DNS 托管在 Cloudflare）
- **备份部署**：https://listenergao.github.io （GitHub Actions 构建，部署到 GitHub Pages；对外全站 301 跳转到主站，避免双域名重复内容影响 SEO）

## 技术栈

- [Hexo 8](https://hexo.io/) 静态站点生成器
- [Fluid](https://github.com/fluid-dev/hexo-theme-fluid) 主题（npm 方式安装）
- 评论：[Utterances](https://utteranc.es/)（基于 GitHub Issues）
- 统计：[不蒜子](https://busuanzi.ibruce.info/)（页脚访问量 + 文章阅读数）

## 视觉定制

清爽极简风，全站不超过 4 个颜色角色：白/近白底、灰黑文字、青蓝强调色（`#0d9488`，暗色模式 `#2dd4bf`）、浅灰分隔线。改动分两层：

- `_config.fluid.yml`：配色（浅/暗两套）、系统无衬线字体栈（不引入 webfont）、代码高亮 github / github-dark、各页面头图与高度
- `source/css/custom.css`：主题配置覆盖不到的细节——正文排版（17px / 1.85 行距 / 标题节奏）、代码块与引用块样式、导航栏与主面板阴影、首屏入场动画（遵循 `prefers-reduced-motion`）

头图是手写的浅色单色渐变 SVG（`source/img/banner.svg`），暗色模式下由 custom.css 叠加深色蒙版。调整视觉只需动这三个文件，不要改 `node_modules` 里的主题源码。

## 部署架构

```
push 到 main ─┬─→ Cloudflare Pages 自动构建 ──→ www.listenergao.com（主站）
              └─→ GitHub Actions（.github/workflows/pages.yml）──→ listenergao.github.io
                  （备份部署；Pages 设置绑定了自定义域名，使 github.io 301 跳转到主站。
                   DNS 未指向 GitHub，设置页的 DNS check 警告属预期，勿动）
```

域名 listenergao.com 注册在 Spaceship，NS 指向 Cloudflare（2026-07-16 迁移，此前为 Vercel 构建托管）：

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

## 目录说明

| 路径 | 说明 |
|------|------|
| `source/_posts/` | 文章（Markdown） |
| `source/about/` | 关于页 |
| `source/img/` | 站点图片（头像、favicon、微信二维码、头图 banner.svg） |
| `source/css/custom.css` | 自定义样式（排版细节、首屏动画） |
| `_config.yml` | Hexo 站点配置 |
| `_config.fluid.yml` | Fluid 主题覆盖配置（配色、字体、头图） |
| `.github/workflows/pages.yml` | GitHub Pages 部署流水线 |
| `ROADMAP.md` | 项目进度与踩坑记录 |
| `source/google*.html` | Search Console 所有权验证文件，**不可删除** |
