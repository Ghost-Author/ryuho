# ryuho

一个基于 Hexo 的个人博客项目，包含本地主题、RSS、站点地图、归档、标签、分类和日记脚手架。

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
npm run check   # 清理后重新生成，用于提交前检查
```

## Writing

新文章可以使用：

```bash
npm run new "文章标题"
```

普通文章、草稿和页面的脚手架都已经包含 `description`、`categories`、`tags`、`cover` 等常用字段，方便生成更完整的 SEO 摘要和首页卡片信息。

## Deploy

Push 到 `main` 后，GitHub Actions 会使用 `npm ci` 安装锁定依赖、运行 `npm run build` 生成站点，并发布 `public` 到 GitHub Pages。

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
