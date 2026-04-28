---
title: "Next.js 入门教程"
slug: "nextjs-tutorial"
excerpt: "学习 Next.js 的基础知识"
coverImage: ""
category: "教程"
tags: ["Next.js", "React", "前端"]
published: true
createdAt: "2026-04-27"
---

# Next.js 入门教程

Next.js 是一个基于 React 的全栈框架。

## 为什么选择 Next.js？

1. **服务端渲染（SSR）**
2. **静态生成（SSG）**
3. **API 路由**
4. **零配置**

## 快速开始

```bash
npx create-next-app@latest my-app
cd my-app
npm run dev
```

打开 http://localhost:3000 查看结果。

## 核心概念

### 文件系统路由

Next.js 使用文件系统路由，在 `app/` 目录下创建文件即可创建路由。

### 数据获取

- `getStaticProps` - 静态生成
- `getServerSideProps` - 服务端渲染
- `getStaticPaths` - 动态路由

## 总结

Next.js 让全栈开发变得简单！
