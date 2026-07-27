---
title: 同一套 Hexo 源码如何同时部署到 GitHub Pages 和 Vercel
date: 2026-07-27 18:00:00
description: 复盘一个 Hexo 博客如何处理 GitHub Pages 子路径与 Vercel 根路径差异，避免重复 root、错误 canonical、静态 robots 和部署分支问题。
tags:
  - 工程实践
  - Hexo
  - CI/CD
  - Vercel
  - GitHub Pages
categories:
  - 工程实践
cover: /images/hero.jpg
---

同一个 Hexo 博客同时部署到 GitHub Pages 和 Vercel，看起来只是多跑一次构建。

真正开始做后，会发现两套环境最关键的差异不是平台，而是 URL 结构：

- GitHub Pages 地址位于 `/ryuho/` 子路径。
- Vercel 站点位于 `/` 根路径。

如果模板、生成器或静态文件中任何一处写死路径，同一份源码就很难在两边都正确工作。

这个项目最终保留两套很薄的配置覆盖，共享全部主题、文章、生成器和审计规则。部署差异只留在 `url`、`root` 和平台运行方式里。

## 两种部署的 URL 模型

GitHub Pages 主配置是：

```yaml
url: https://ghost-author.github.io/ryuho
root: /ryuho/
```

Vercel 覆盖配置是：

```yaml
url: https://ryuho-kappa.vercel.app
root: /
```

Hexo 的 `url` 负责站点绝对地址，`root` 负责站点相对域名的挂载位置。

在 GitHub Pages 中，CSS 地址应该是：

```text
/ryuho/css/style.css
```

在 Vercel 中，同一个资源应该是：

```text
/css/style.css
```

这意味着模板里不能手工拼接 `/ryuho/`，生成器也不能假设站点永远部署在根路径。

## 为什么模板统一使用 Hexo URL helper

主题模板中的站内资源使用 `url_for`：

```ejs
<link rel="stylesheet" href="<%= url_for('css/style.css') %>">
```

需要绝对 URL 的 SEO 信息使用 `full_url_for` 或文章 permalink：

- canonical
- Open Graph URL
- RSS 地址
- 分享图片

这样当前构建配置会决定最终路径。

如果直接使用字符串拼接，例如：

```text
config.url + root + path
```

就很容易在 `url` 已经包含 `/ryuho` 时再追加一次 root。

## 真实踩过的重复 root 问题

动态生成 `robots.txt` 时，早期实现把站点 URL 和 root 直接拼接。

GitHub Pages 的 `url` 本身已经是：

```text
https://ghost-author.github.io/ryuho
```

再追加 `/ryuho/sitemap.xml` 后，结果变成：

```text
https://ghost-author.github.io/ryuho/ryuho/sitemap.xml
```

基础文件存在检查不会发现这个问题，因为 `robots.txt` 确实生成了，里面也确实包含 `Sitemap:`。

修复方式是在生成绝对地址时先判断 `url` 是否已经以当前 root 结尾：

- 已包含 root：只追加文件名。
- 未包含 root：追加 root 和文件名。

修复之后，又把“robots sitemap 不得重复 root”加入审计。一次人工发现的问题，变成了以后自动守住的边界。

## 为什么 robots 和 manifest 必须动态生成

最初的 `robots.txt` 与 `site.webmanifest` 是 source 目录中的静态文件。

静态文件只能写一种路径：

- 写 `/ryuho/`，Vercel 错。
- 写 `/`，GitHub Pages 错。

最终把它们改成 Hexo generator，根据当前配置生成：

### robots.txt

- sitemap 使用当前站点绝对地址。
- 自动处理 url 是否已经包含 root。

### site.webmanifest

- `start_url` 使用当前 root。
- `scope` 使用当前 root。
- 图标地址通过当前 root 生成。

同一个生成器在 GitHub Pages 构建时输出 `/ryuho/`，在 Vercel 构建时输出 `/`。

## service worker 也必须知道 root

service worker 预缓存首页、专题、项目页、搜索索引、静态资源和最新文章。

这些路径如果写死，安装阶段的 `cache.addAll` 会因资源 404 失败。

因此 service worker 同样由 Hexo 构建生成：

- 核心路由统一加当前 root。
- 文章地址读取 Hexo permalink。
- 注册地址通过 `url_for('/sw.js')` 输出。

双部署审计会确认两套生成结果都包含正确核心路由，并验证所有内部资源真实存在。

## 搜索页为什么使用相对路径

搜索页位于 `/search/`，索引位于站点根目录。

它使用：

```text
../search-index.json
```

而不是 `/search-index.json` 或 `/ryuho/search-index.json`。

浏览器会基于当前搜索页地址解析：

- `/ryuho/search/` → `/ryuho/search-index.json`
- `/search/` → `/search-index.json`

文章结果链接也采用相同思路。

相对路径不是所有场景的唯一答案，但对一个需要同时适配不同 root 的独立页面，它比写死部署前缀更稳定。

## GitHub Pages 的发布链路

GitHub Actions 只监听 `main`：

1. Checkout 源码。
2. 使用 Node.js 20。
3. 通过 `npm ci` 安装锁定依赖。
4. 运行 `npm run check`。
5. 把 `public` 发布到 `gh-pages`。

`npm run check` 不只是生成页面，还会：

- 清理旧产物。
- 生成 GitHub Pages 子路径版本。
- 优化图片。
- 运行完整站点与内容审计。

只有检查通过，部署步骤才会执行。

## Vercel 为什么必须连接 main

Vercel 曾经出现过：

```text
No Output Directory named "public"
```

原因不是 Hexo 没有生成 public，而是 Vercel 项目连接到了 `gh-pages` 分支。

`gh-pages` 是 GitHub Actions 发布后的静态产物分支，只包含生成结果，不包含：

- package.json
- vercel.json
- Hexo 配置
- source
- themes
- 构建脚本

Vercel 无法从这个分支重新构建源码。

正确配置是：

```text
Production Branch: main
Install Command: npm ci
Build Command: npm run build:vercel
Output Directory: public
```

源码分支和发布产物分支承担不同职责，部署平台必须连接源码分支。

## Vercel 构建如何覆盖配置

Vercel 命令使用两份配置：

```bash
hexo generate --config _config.yml,_config.vercel.yml
```

第二份配置只覆盖：

```yaml
url: https://ryuho-kappa.vercel.app
root: /
```

其余站点信息、主题配置、文章和生成器全部共享。

覆盖文件越薄，两个环境漂移的机会越少。没有必要复制一整份 Hexo 配置。

Vercel 还通过 `vercel.json` 增加：

- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`
- 图片、CSS 和 JavaScript 的长期缓存头

这些属于平台能力，不需要污染 GitHub Pages 构建逻辑。

## 如何验证两种配置没有分叉

项目提供两条本地检查命令：

```bash
npm run check
npm run check:vercel
```

两条命令使用不同配置生成 public，但最终运行同一个审计脚本。

检查包括：

- canonical、description 和 Open Graph URL
- robots、manifest 与 sitemap
- service worker 预缓存路径
- 搜索索引与专题入口
- 内部链接和静态资源
- 图片真实格式与尺寸
- 文章元数据与正文质量

目前两套配置都通过 49 项规则。

这种验证比“两个网址都点开看过”更可靠。人工浏览仍然重要，但不应该承担所有路径回归。

## 为什么不只保留一个部署平台

对一个个人博客来说，只保留一个平台完全合理。

这里保留双部署有三个实际价值：

- GitHub Pages 与源码仓库天然关联。
- Vercel 提供根路径域名和响应头配置。
- 两种 root 迫使主题和生成器真正摆脱硬编码。

第三点对项目本身最有价值。双部署不是为了追求高可用，而是成为路径可移植性的持续测试。

如果未来维护成本超过收益，删除其中一条部署链路也应该是可接受的决定。

## 最后的判断

多环境部署最危险的不是配置文件多，而是部署差异散落在模板、文章、脚本和静态文件里。

这个项目把差异收敛到两项配置：

- url
- root

主题使用 Hexo helper，robots、manifest 和 service worker 按配置生成，搜索使用可移植相对路径，两套构建最后经过同一个审计。

当平台差异被集中表达，其余代码就能保持一致。

这比维护两份站点源码更可靠，也让每一次发布都能回答一个明确问题：这份内容在子路径和根路径下，是否都真的可用？
