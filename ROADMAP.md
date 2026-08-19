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
- 2026-07-16：**主站迁移 Vercel → Cloudflare**——①Spaceship NS 改指 Cloudflare（maxine/peyton.ns.cloudflare.com），9 条 DNS 记录先在 Cloudflare 原样复制后切换，注册局与公共 DNS 均已验证生效；②Email Routing 接管 `@` 收件（MX 换 route1/2/3.mx.cloudflare.net，删除 Spaceship efwd 旧 MX/SPF），目标地址 Gmail 已验证，`hello@` 规则活跃；Resend 发信记录（send MX/SPF、DKIM）原值保留并 dig 验证；③Cloudflare Pages 项目连接本仓库（`npx hexo generate` / `public` / NODE_VERSION=22），pages.dev 预览与主站内容一致（7 篇文章、custom.css/main.css 均 200）后绑定 www 自定义域，边缘节点验证 `server: cloudflare` 返回 200；④裸域 301 重定向规则（通配符 `https://listenergao.com/*` → `https://www.listenergao.com/${1}`，保留查询串）验证通过，http 裸域为 308 升 HTTPS + 301 到 www 两跳
- 2026-07-14：全站视觉优化「清爽极简风」——`_config.fluid.yml` 覆盖配色（#fafafa 底 + teal #0d9488 强调色，浅/暗两套）、系统无衬线字体栈、代码高亮换 github/github-dark；新增 `source/img/banner.svg`（浅色渐变头图替换默认深色风景图，各页面 banner 高度压缩）和 `source/css/custom.css`（正文 17px/1.85 行距、标题节奏、代码块/引用块/导航栏/主面板细节、首屏入场动画：导航下滑/头图缩放沉降/标语与主面板上浮，respect prefers-reduced-motion；主题自带 .fade-in-up 缺时长实际不动已补齐）。配色约束：全站 ≤4 色（白底/灰黑文字/teal 强调/浅灰线），无紫色与彩虹渐变。本地构建通过 + 用户预览确认后发布

- 2026-07-28：修复 Google Search Console「网页会自动重定向」告警——sitemap 中关于页 URL 为 `/about/index.html`，而 Cloudflare Pages 会把它 308 规范化到 `/about/`，Google 抓到重定向便不予索引（其余 15 条 sitemap URL 均 200，不受影响）。根因是 `_config.yml` 的 `pretty_urls.trailing_index: true` 让 page 类型 permalink 保留 index.html，已改为 `false`。本地 `hexo clean && hexo generate` 验证：sitemap.xml / atom.xml 中 index.html 出现次数为 0，关于页 loc 变为 `https://www.listenergao.com/about/`，页面内链无 index.html 残留
- 2026-08-19：`_config.fluid.yml` 开启 `canonical.enable: true`（主题默认 false），全站页面 head 输出 `<link rel="canonical">`。动机是归并带查询参数的重复 URL——实测 `https://www.listenergao.com/about/?utm_source=test` 返回 200，Google 可能当独立页面收录。Fluid 模板 `node_modules/hexo-theme-fluid/layout/_partials/head.ejs:22` 用 `page.canonical_path` 去掉 index.html 再拼 `config.url`，输出形式与 sitemap 完全一致。本地 `hexo clean && hexo generate` 通过，六类页面 canonical 均正确（首页 / `/about/` / `/archives/` / 文章页 / `/tags/Android/` / `/404.html`），当前文章数未触发分页故无 page/2。**此项解决不了「网页会自动重定向」告警**（Google 抓 `/about/index.html` 拿到 308，读不到 head）。上线验证待办

## 阻塞

- 无

## 进行中

- 无

## 待办

- 站点信息完善（slogan、关于页正文、about.intro 等占位内容待用户自定义）
- 旧站「友链」页未恢复（旧站有 /links/，如需要用 `hexo new page links` 创建）

## 域名与部署架构（2026-07-16 更新）

- 主域名 https://www.listenergao.com 由 **Cloudflare Pages** 服务（连接本仓库自动构建），DNS 托管在 Cloudflare，裸域 301 跳 www（Cloudflare 重定向规则）。域名注册在 Spaceship
- 2026-07-16 之前为 Vercel 构建托管 + Spaceship DNS（裸域 308 跳 www），迁移过程见「已完成」。当天四大公共解析器（114/阿里/DNSPod/Google）确认收敛后，Vercel 项目、域名绑定与账户域名已全部删除，push main 现只触发 Cloudflare Pages 和 GitHub Actions 两个构建
- https://listenergao.github.io 由 GitHub Actions + Pages 继续部署，作为免费冗余
- 2026-07-07：GitHub Pages 侧已通过 `gh api` 绑定自定义域名 `www.listenergao.com`（**DNS 未改、仍指向 Vercel**），目的只有一个：让 github.io 全站 301 跳转到主域名，消除双域名重复内容对 SEO 的影响。已验证首页/文章页/sitemap 均 301 生效。**注意：GitHub Pages 设置页会显示 DNS check unsuccessful 警告，属预期，不要移除该域名或去“修复”DNS**
- `_config.yml` url 已改为主域名；安装 hexo-generator-sitemap / hexo-generator-feed 生成 /sitemap.xml 和 /atom.xml
- favicon（icon_tab.png）已改为圆形（PIL 圆形遮罩 + 抗锯齿，原方图在 git 历史）
- 2026-07-03：Google Search Console 已接入——网址前缀资源 `https://www.listenergao.com/`，HTML 文件验证（`source/googlef66ea2b3d8b6ae1d.html`，_config.yml 已配 skip_render，此文件不可删），sitemap.xml 已提交成功，等待 Google 抓取收录

## 内容记录

- 2026-07-03：首批 6 篇文章上线，源自私有仓库 personal-development 的笔记加工：adb 速查（精选重写并注明参考 awesome-adb）、Android 混淆、颜色透明度对照表、Android 工具箱（合并 3 篇笔记）、Mac 软件清单（合并 2 篇，JDK 配置更新为 zsh）、编程字体。按用户反馈统一调整为幽默风趣的文风（该偏好已存入记忆）。Git 命令笔记因内容过薄且含真实邮箱未发布；Mac软件激活码.md 按用户要求忽略。

## CI 踩坑记录（2026-07-03 发布时）

1. **package-lock.json 锁了公司内网镜像**：本地 npm registry 是 `registry.m.jd.com`（京东内网），lockfile 里 245 个 resolved URL GitHub runner 访问不到，`npm ci` 卡 8 分钟后以 npm 自身 bug（"Exit handler never called"，且退出码为 0）的形式崩掉。修复：`rm -rf node_modules package-lock.json && npm install --registry=https://registry.npmjs.org/` 重新生成。**以后更新依赖后必须检查 lockfile 里没有 jd.com 地址再提交。**
2. **Pages 部署偶发秒失败（"Deployment failed, try again later"，无错误详情）**：GitHub Pages 后端问题，首次尝试大概率失败、重跑即成功（当天复现 3 次；一度误判为 legacy→workflow 切换导致，后经对照实验排除）。修复：workflow 的 deploy 步骤加 `continue-on-error` + 失败时自动重试一次，流水线自愈，已验证生效。
3. workflow 用 Node 22（Node 20 在 runner 上已弃用）。

- 2026-07-03：**发布上线**。commit `48ba7a8`（重建）+ `f8fc260`（Node 22）+ `c133b4b`（lockfile 换官方源），Actions 构建部署成功

## 最近验证

- 2026-08-19：Search Console「网页会自动重定向」显示**验证失败**（开始 08-10 / 失败 08-15，受影响 1 页 `/about/index.html`，末次抓取 08-14）——**08-10 记录里「GSC 侧点验证修正情况即可」的判断有误，这个验证永远不会通过**：GSC 的验证方式是重新抓取旧 URL 看它还重不重定向，而 `/about/index.html` 按 Cloudflare Pages 的目录规范化必然 308 → `/about/`。本次线上实测配置侧全部正确：sitemap.xml 中 index.html 计数为 0、about 仅 `/about/` 一条，`/about/index.html` 返回 308、`/about/` 返回 200，首页内链为 `href="/about/"` 无旧写法。该项在 GSC 里是灰色信息类报告（非红色错误），含义只是「这些 URL 因跳转未被索引」，而跳转目标 `/about/` 已于 07-29 确认收录。唯一正确动作是**不再点「验证修复」**，等 Google 停止回抓旧 URL 自然消退。顺带实测域名跳转均正常：裸域 301 → www；`listenergao.github.io` 301 → `http://www.listenergao.com`（跳的是 http 会再多一跳升 https，属 GitHub Pages 固有行为不可配置，影响可忽略）
- 2026-08-19：Search Console「未找到 (404)」同样显示**验证失败**（开始 08-10 / 失败 08-15，受影响 1 页 `https://www.listenergao.com/2022/03/11/hello-world/`，末次抓取 08-14），与上一条是同一机制：GSC 验证 404 的方式是重抓该 URL 看是否变 200，而这篇 2022 年旧站示例文的内容确已不存在，返回 404 才是正确信号，点一次验证失败一次。实测：旧 URL 404 无重定向，线上 sitemap 中 hello-world 计数 0，`grep -rn "hello-world" source/` 无内链。维持 08-10 结论——不为单个 URL 配 410 规则（语义更强但收益接近零），等其自然掉出索引。**通用教训：GSC 中灰色 ⓘ 信息类报告（自动重定向 / 404 / 已抓取未编入索引）不要点「验证修复」，其验证逻辑是重抓旧 URL 期待状态改变，而这些 URL 的当前状态本就是正确的，验证必然失败**
- 2026-08-10：Search Console 三条告警复查，均无需改代码——①**新增「未找到 404」1 页为 `https://www.listenergao.com/2022/03/11/hello-world/`**，旧站遗留 URL，当前 `source/_posts/` 无此文、线上 sitemap 16 条中无它、`grep -rn "hello-world" source/` 无任何内链，Google 系回查 2022 年旧索引发现（首次检测 08-05，末次抓取 07-30），内容已不存在返回 404 即正确信号，等其自然掉出索引，不为单个 URL 配 410 规则；②「网页会自动重定向」`/about/index.html` 是 07-28 修复前的历史数据（图表数据截止 07-28），实测仍 308 → `/about/` 属正确规范化，GSC 侧点「验证修正情况」即可；③「已抓取 - 尚未编入索引」`/atom.xml` 实测 200，feed 非网页内容不予索引，长期挂在报告中属正常，忽略
- 2026-07-29：**关于页收录成功**——GSC 网址检查 `https://www.listenergao.com/about/` 显示「网址已收录到 Google / 网页已编入索引 / 网页采用 HTTPS 协议」，距 07-28 请求编入索引仅 1 天。「网页会自动重定向」告警闭环，无后续动作
- 2026-07-28：Search Console 索引报告三条「未编入索引」原因已全部定性，其中两条属预期无需处理——①「网页会自动重定向」1 页为 `/about/index.html`，修复后 sitemap 不再提交它，该 URL 本身保持 308 是正确的规范化；②「已抓取 - 尚未编入索引」1 页为 `https://www.listenergao.com/atom.xml`，RSS 源经页面 head 的 alternate link 被发现，非网页内容不予索引属正确行为，sitemap 中本就未提交；③「已发现 - 尚未编入索引」为 0 页
- 2026-07-28：`trailing_index: false` 上线验证——commit `8d12068` push 后 Cloudflare Pages 构建生效，线上 sitemap.xml 全文件无 index.html，关于页 loc 为 `https://www.listenergao.com/about/`，该 URL 直连返回 200 无重定向。Search Console 侧已由用户重新提交 sitemap.xml 并对 `/about/` 请求编入索引，收录结果待观察

- 2026-07-16（傍晚）：Vercel 下线后全链路复测——www 经 Cloudflare 返回 200，裸域带路径 301 到 www 正确，github.io 备份 301 依旧；下线前 dig 确认 114/阿里/DNSPod/Google 四家解析器的 NS/www/MX 已全部收敛到 Cloudflare
- 2026-07-16（下午）：邮件转发实测通过——163 → `hello@listenergao.com` → Gmail 收到（首测退信系 114DNS 缓存旧 Spaceship MX，缓存过期后自愈）；Catch-all 规则已启用（任意前缀转发到 Gmail）。另确认：经 Resend 发信时 163 显示「由 xxx@send.listenergao.com 代发」是收件方客户端对信封发件人（SES VERP 地址）与 From 不一致的固定展示，发件方无法消除，SPF/DKIM/DMARC 对齐不影响投递，暂不处理
- 2026-07-16：Cloudflare 迁移验证——注册局 NS 已指 maxine/peyton.ns.cloudflare.com；www 经 Cloudflare 边缘返回 200（`server: cloudflare`，内容与迁移前一致）；裸域带路径/查询串 301 到 www 正确；MX 为 route1/2/3.mx.cloudflare.net、SPF 指 Cloudflare，Resend 记录原值在线。本机及部分国内解析器（114DNS）尚有旧缓存，Vercel 兜底中
- 2026-07-14：视觉优化上线验证——commit `c4f5b1f` push 后 GitHub Actions Deploy Pages 成功（40s）；Vercel 主域名侧 www.listenergao.com 已生效：/css/custom.css 与 /img/banner.svg 均 200，首页 HTML 已引用新资源，custom.css 含入场动画规则
- 2026-07-10：Google 收录确认——Search Console「网址检查」显示文章页（/2026/07/03/android-proguard-r8/）已编入索引，HTTPS 正常，收录待办关闭。`site:` 搜索暂查不到属该运算符的正常滞后，以 Search Console 为准
- 2026-07-07：github.io → www 301 跳转验证通过（首页、文章页、sitemap.xml 均 301 至 www.listenergao.com，Fastly 缓存过期后全量生效）；www.listenergao.com 返回 200 不受影响
- 2026-07-03：线上验证通过——首页/关于/文章/归档均返回 200，标题和中文语言正确，关于页截图确认头像、微信/GitHub 图标正常渲染
