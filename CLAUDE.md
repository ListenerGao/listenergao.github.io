# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 仓库性质

ListenerGao 的个人博客**源码仓库**：Hexo 8 + Fluid 主题（npm 安装，非 git clone）。push 到 main 分支后由 GitHub Actions（`.github/workflows/pages.yml`）自动构建并发布到 https://listenergao.github.io（GitHub Pages，build_type=workflow 模式）。

**push 到 main = 发布到线上**，push 前必须经用户确认。

## 常用命令

Hexo 未全局安装，一律通过 npx 调用：

- `npx hexo new "文章标题"` — 新建文章（生成到 `source/_posts/`）
- `npx hexo server` — 本地预览，http://localhost:4000
- `npx hexo generate` — 构建到 `public/`（验证构建是否通过）
- `npx hexo clean` — 清除缓存和 public/（构建结果异常时先跑这个）

## 目录约定

- `source/_posts/*.md` — 文章，front-matter 含 title/date/tags
- `_config.yml` — Hexo 站点配置
- `_config.fluid.yml` — Fluid 主题覆盖配置（只写需覆盖的项，完整默认值见 `node_modules/hexo-theme-fluid/_config.yml`；不要直接改 node_modules 里的主题文件）
- `scaffolds/` — 文章模板
- `public/`、`node_modules/` — 生成物和依赖，已 gitignore，不进版本库

## 验证

改动后跑 `npx hexo generate` 确认构建无报错；涉及外观的改动用 `npx hexo server` 本地预览确认。
