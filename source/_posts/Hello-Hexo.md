---
title: Hello Hexo
date: 2026-07-03 16:16:15
tags:
  - 博客
---

博客重新搭建完成：Hexo + Fluid 主题，源码托管在 GitHub main 分支，GitHub Actions 自动构建并发布到 GitHub Pages。

这次源码就是仓库本身，不会再丢了。

<!-- more -->

## 日常写作流程

整个流程只有三步：写、看、推。

### 1. 新建文章

```bash
npx hexo new "文章标题"
```

会在 `source/_posts/` 下生成对应的 Markdown 文件，头部自带 front-matter：

```yaml
---
title: 文章标题
date: 2026-07-03 16:16:15
tags:
  - 标签名
---
```

正文直接写 Markdown。想控制首页摘要截断位置，在正文中插入 `<!-- more -->` 即可。

### 2. 本地预览

```bash
npx hexo server
```

浏览器打开 http://localhost:4000 实时预览，文章内容保存后自动刷新（改配置文件需要重启）。

### 3. 发布

```bash
git add .
git commit -m "post: 文章标题"
git push
```

push 到 main 分支后，GitHub Actions 会自动构建并部署，一两分钟后文章就出现在线上了。构建状态可以在仓库的 Actions 页面查看。

## 常用命令速查

| 命令 | 作用 |
|------|------|
| `npx hexo new "标题"` | 新建文章 |
| `npx hexo new page 页面名` | 新建独立页面（如关于页） |
| `npx hexo server` | 本地预览 |
| `npx hexo generate` | 手动构建（验证有没有报错） |
| `npx hexo clean` | 清缓存，构建结果异常时先跑这个 |

## 配置文件说明

- `_config.yml`：Hexo 站点配置（站点标题、语言、URL 等）
- `_config.fluid.yml`：Fluid 主题配置（导航栏、头像、评论、统计等），只写需要覆盖的项
- 换电脑后只需 `git clone` + `npm install`，环境就恢复了——这正是源码进仓库的意义。
