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
const title = `日记-${today}`;
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
tags:
  - 日记
categories:
  - 日常
cover: /ryuho/images/hero.jpg
---

今日一句：

今日小事：

今日感受：

明天想做的事：
`;

fs.writeFileSync(filepath, content, 'utf8');
console.log(`Created: ${path.relative(root, filepath)}`);
