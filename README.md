# ryuho

一个基于 Hexo 的个人博客项目，包含本地主题、RSS、站点地图、归档、标签、分类和日记脚手架。

## 特性

- 🎨 现代化响应式设计，支持暗色模式
- 🔍 本地搜索功能（基于 Lunr.js）
- 📱 PWA 支持，离线可访问
- 🚀 性能优化：懒加载图片、阅读进度指示器
- ♿ 可访问性友好：键盘导航、屏幕阅读器支持
- 📊 SEO 优化：结构化数据、Open Graph、Twitter Cards
- 💻 代码高亮和复制功能
- 📝 自动化日记生成工具
- 🔧 完整的构建和审计流程

## Development

```bash
npm install
npm run server
```

常用命令：

```bash
npm run daily   # 创建当天日记
npm run build   # 生成静态站点
npm run clean   # 清理 public 与缓存
npm run audit   # 检查生成后的站点产物
npm run check   # 使用 GitHub Pages 配置清理、生成并审计
npm run check:vercel # 使用 Vercel 根路径配置清理、生成并审计
npm run build:vercel # Vercel 构建命令
```

## Writing

新文章可以使用：

```bash
npm run new "文章标题"
```

普通文章、草稿和页面的脚手架都已经包含 `description`、`categories`、`tags`、`cover` 等常用字段，方便生成更完整的 SEO 摘要和首页卡片信息。

## Features

### 搜索功能
访问 `/search/` 页面使用本地搜索，无需外部服务。

### 代码块增强
- 语法高亮（Highlight.js）
- 一键复制代码
- 响应式表格滚动

### 性能优化
- 图片懒加载
- 静态资源缓存优化
- 最小化 CSS/JS

### 可访问性
- 键盘导航支持
- 屏幕阅读器优化
- 高对比度主题切换

## Deploy

Push 到 `main` 后，GitHub Actions 会使用 `npm ci` 安装锁定依赖、运行 `npm run check` 生成并审计站点，然后发布 `public` 到 GitHub Pages。

Vercel 部署使用 `npm run build:vercel`，会合并 `_config.yml` 和 `_config.vercel.yml`，并在生成后运行站点审计。

Vercel 项目必须连接源码分支 `main`，不要选择 `gh-pages`。`gh-pages` 是 GitHub Actions 发布后的静态产物分支，不包含 `package.json`、`vercel.json` 和 Hexo 源文件；如果 Vercel 克隆 `gh-pages`，会出现 `No Output Directory named "public"` 这类构建错误。

推荐 Vercel 设置：

```text
Production Branch: main
Install Command: npm ci
Build Command: npm run build:vercel
Output Directory: public
```

`robots.txt` 和 `site.webmanifest` 会根据当前 Hexo 的 `url/root` 自动生成，因此 GitHub Pages 子路径和 Vercel 根路径都能得到正确的地址。

提交前建议运行：

```bash
npm run check
```

这个命令会重新生成站点并审计关键产物：主页 SEO、404 noindex、RSS、sitemap、manifest、canonical、内部链接、静态资源引用，以及 HTML 中是否出现 `undefined`/`null` 这类模板泄漏。

## Theme

当前主题位于 `themes/minimal`，重点优化了：

- 完整的 SEO meta、Open Graph 与结构化数据
- RSS、sitemap、robots 基础支持
- 首页搜索、精选文章、时间线和阅读时长
- 文章页目录、封面图、更新日期、上一篇/下一篇
- 深色模式、404 页面、Web App Manifest
- 文章复制链接、外链安全处理、图片懒加载、表格横向滚动
- 代码块、引用、表格、列表等 Markdown 阅读样式
- 键盘焦点、跳到正文、减弱动画偏好等可访问性体验
