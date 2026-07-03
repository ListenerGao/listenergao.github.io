# ListenerGao's Blog

个人博客源码仓库。**源码即仓库**——文章、配置、部署流水线全部在 main 分支，push 即发布。

- **主站**：https://www.listenergao.com （Vercel 构建与托管）
- **备份站**：https://listenergao.github.io （GitHub Actions 构建，部署到 GitHub Pages）

## 技术栈

- [Hexo 8](https://hexo.io/) 静态站点生成器
- [Fluid](https://github.com/fluid-dev/hexo-theme-fluid) 主题（npm 方式安装）
- 评论：[Utterances](https://utteranc.es/)（基于 GitHub Issues）
- 统计：[不蒜子](https://busuanzi.ibruce.info/)（页脚访问量 + 文章阅读数）

## 部署架构

```
push 到 main ─┬─→ Vercel 自动构建 ──→ www.listenergao.com（主站，DNS 指向 Vercel）
              └─→ GitHub Actions（.github/workflows/pages.yml）──→ listenergao.github.io（备份）
```

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
| `source/img/` | 站点图片（头像、favicon、微信二维码） |
| `_config.yml` | Hexo 站点配置 |
| `_config.fluid.yml` | Fluid 主题覆盖配置 |
| `.github/workflows/pages.yml` | GitHub Pages 部署流水线 |
| `ROADMAP.md` | 项目进度与踩坑记录 |
| `source/google*.html` | Search Console 所有权验证文件，**不可删除** |
