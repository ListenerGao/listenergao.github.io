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

- 无

## 待办

- 站点信息完善（slogan、关于页正文、about.intro 等占位内容待用户自定义）
- 旧站「友链」页未恢复（旧站有 /links/，如需要用 `hexo new page links` 创建）

## 域名与部署架构（2026-07-03 确认）

- 主域名 https://www.listenergao.com 由 **Vercel** 服务（用户在 Vercel 连接本仓库自动构建，DNS 指向 Vercel；裸域名 308 跳 www）
- https://listenergao.github.io 由 GitHub Actions + Pages 继续部署，作为免费冗余，GitHub Pages 侧未绑定自定义域名
- `_config.yml` url 已改为主域名；安装 hexo-generator-sitemap / hexo-generator-feed 生成 /sitemap.xml 和 /atom.xml
- favicon（icon_tab.png）已改为圆形（PIL 圆形遮罩 + 抗锯齿，原方图在 git 历史）

## 内容记录

- 2026-07-03：首批 6 篇文章上线，源自私有仓库 personal-development 的笔记加工：adb 速查（精选重写并注明参考 awesome-adb）、Android 混淆、颜色透明度对照表、Android 工具箱（合并 3 篇笔记）、Mac 软件清单（合并 2 篇，JDK 配置更新为 zsh）、编程字体。按用户反馈统一调整为幽默风趣的文风（该偏好已存入记忆）。Git 命令笔记因内容过薄且含真实邮箱未发布；Mac软件激活码.md 按用户要求忽略。

## CI 踩坑记录（2026-07-03 发布时）

1. **package-lock.json 锁了公司内网镜像**：本地 npm registry 是 `registry.m.jd.com`（京东内网），lockfile 里 245 个 resolved URL GitHub runner 访问不到，`npm ci` 卡 8 分钟后以 npm 自身 bug（"Exit handler never called"，且退出码为 0）的形式崩掉。修复：`rm -rf node_modules package-lock.json && npm install --registry=https://registry.npmjs.org/` 重新生成。**以后更新依赖后必须检查 lockfile 里没有 jd.com 地址再提交。**
2. **Pages 部署偶发秒失败（"Deployment failed, try again later"，无错误详情）**：GitHub Pages 后端问题，首次尝试大概率失败、重跑即成功（当天复现 3 次；一度误判为 legacy→workflow 切换导致，后经对照实验排除）。修复：workflow 的 deploy 步骤加 `continue-on-error` + 失败时自动重试一次，流水线自愈，已验证生效。
3. workflow 用 Node 22（Node 20 在 runner 上已弃用）。

- 2026-07-03：**发布上线**。commit `48ba7a8`（重建）+ `f8fc260`（Node 22）+ `c133b4b`（lockfile 换官方源），Actions 构建部署成功

## 最近验证

- 2026-07-03：线上验证通过——首页/关于/文章/归档均返回 200，标题和中文语言正确，关于页截图确认头像、微信/GitHub 图标正常渲染
