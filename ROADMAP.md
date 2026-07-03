# ROADMAP

## 当前阶段

博客重建：Hexo 8 + Fluid + GitHub Actions 部署（2026-07-03 开始）

## 已完成

- 2026-07-03：清理 main 分支旧 Hexo 构建产物（旧文件在 git 历史 `b6ce677..7244016` 中可找回）
- 2026-07-03：初始化 Hexo 8.1.2 项目（npm 管理，package-lock.json 已入库）
- 2026-07-03：安装 Fluid 主题（hexo-theme-fluid via npm），配置 `_config.yml`（zh-CN / url / theme）和 `_config.fluid.yml`
- 2026-07-03：创建 GitHub Actions 部署 workflow（`.github/workflows/pages.yml`）
- 2026-07-03：GitHub Pages 构建模式已切换为 workflow（gh api 确认生效）
- 2026-07-03：首篇文章 `source/_posts/Hello-Hexo.md`
- 2026-07-03：创建关于页 `source/about/index.md`（layout: about），`_config.fluid.yml` 补充 about 配置（名字/简介/GitHub 图标，参考旧站），本地已验证 /about/ 返回 200 且内容正确
- 2026-07-03：从 git 历史恢复旧站自定义头像和微信二维码图（`source/img/avatar.jpg`、`source/img/wechat.png`），关于页图标补齐微信悬浮二维码；头像不能叫 avatar.png（会被主题同名默认资源覆盖），已用 checksum 验证生成产物与旧站文件一致，截图验证渲染正常

- 2026-07-03：恢复旧站 favicon（`source/img/icon_tab.png`，旧站实际引用的是它而非 favicon.png）
- 2026-07-03：恢复评论系统 Utterances（仓库 `ListenerGao/blog-commit-utterances`，已确认仓库存在且开放 issues），本地截图验证评论框正常渲染
- 2026-07-03：统计功能启用（页脚总访问量/总访客数 + 文章阅读次数），数据源用不蒜子 busuanzi。最初恢复了旧站 LeanCloud 配置，但实测该应用已被归档且 LeanCloud 将于 2027 年停服，经用户确认改用 busuanzi（计数从零开始，无历史数据迁移）。本地截图验证页脚计数正常显示（本地数字异常偏大是 busuanzi 已知现象，部署后正常）

## 阻塞

- 无

## 进行中

- 本地验证（`npx hexo generate` + `npx hexo server` 预览）

## 待办

- 用户确认后 push 发布，验证 Actions 构建和线上站点
- 站点信息完善（title/slogan/头像等占位内容待用户自定义）

## 最近验证

- 2026-07-03：Pages build_type 已确认为 workflow（gh api 返回）
- 构建和线上部署尚未验证
