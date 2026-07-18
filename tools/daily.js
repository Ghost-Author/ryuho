#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const postsDir = path.join(root, 'source', '_posts');

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatDateTime(d) {
  return `${formatDate(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function slugify(title) {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-\u4e00-\u9fa5]/g, '')
    .replace(/-+/g, '-');
}

const now = new Date();
const today = formatDate(now);
const title = `工程日志-${today}`;
const filename = `${slugify(title)}.md`;
const filepath = path.join(postsDir, filename);

if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
}

if (fs.existsSync(filepath)) {
  console.error(`File already exists: ${filepath}`);
  process.exit(1);
}

const content = `---
title: ${title}
date: ${formatDateTime(now)}
description: 记录 ${today} 的工程实践、技术判断和可复盘的改进事项。
tags:
  - 工程实践
  - 技术写作
categories:
  - 工程实践
cover: /images/hero.jpg
---

## 今日目标

今天要推进什么工程问题？期望交付是什么？

## 关键动作

- 

## 验证结果

如何确认今天的改动真的有效？

## 复盘

有哪些判断、风险或经验值得沉淀？
`;

fs.writeFileSync(filepath, content, 'utf8');
console.log(`Created: ${path.relative(root, filepath)}`);
