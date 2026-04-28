# Personal Blog

一个基于 Next.js 的个人博客网站，支持 Markdown 文章编辑、分类标签管理、评论功能，需要登录才能访问。

## 功能特性

- 🔐 用户认证登录（必须登录才能访问）
- 📝 Markdown 文章编辑（支持实时预览）
- 🏷️ 文章分类与标签管理
- 💬 评论功能
- 📱 响应式设计，支持跨端访问
- 🎨 现代简约设计风格

## 技术栈

- **前端框架**: Next.js 14+ (App Router)
- **样式方案**: Tailwind CSS
- **身份认证**: NextAuth.js v5
- **数据库**: MongoDB Atlas（云数据库）
- **Markdown 处理**: React Markdown
- **部署平台**: Vercel

## 安装运行

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd personal-blog
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.local.example` 到 `.env.local` 并填写实际值：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`：

```env
# MongoDB 连接字符串（使用 MongoDB Atlas 免费云数据库）
MONGODB_URI=your_mongodb_atlas_connection_string

# NextAuth 配置
AUTH_SECRET=your_secure_secret_key

# 管理员账号
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_password
```

### 4. 运行开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看网站。

## 部署到 Vercel

### 方法一：通过 Vercel 网站部署（推荐）

1. 将代码推送到 GitHub/GitLab/Bitbucket
2. 登录 [Vercel](https://vercel.com)
3. 点击 "New Project"
4. 导入你的仓库
5. 配置环境变量（在 Vercel 项目设置中添加）
6. 点击 "Deploy"

### 方法二：通过 Vercel CLI 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 生产环境部署
vercel --prod
```

### 环境变量配置（Vercel）

在 Vercel 项目设置 → Environment Variables 中添加：

- `MONGODB_URI`: MongoDB Atlas 连接字符串
- `AUTH_SECRET`: 随机生成的密钥（可以使用 `openssl rand -base64 32` 生成）
- `ADMIN_EMAIL`: 管理员邮箱
- `ADMIN_PASSWORD`: 管理员密码

## MongoDB Atlas 设置

1. 注册 [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. 创建免费集群（M0 层级）
3. 创建数据库用户
4. 配置网络访问（允许所有 IP 访问：0.0.0.0/0）
5. 获取连接字符串并替换 `<password>` 为你的数据库密码

## 项目结构

```
personal-blog/
├── src/
│   ├── app/
│   │   ├── api/           # API 路由
│   │   ├── admin/         # 管理后台页面
│   │   ├── posts/         # 文章详情页
│   │   ├── category/      # 分类页面
│   │   ├── tag/           # 标签页面
│   │   ├── about/         # 关于我页面
│   │   └── login/         # 登录页面
│   ├── components/        # React 组件
│   ├── lib/              # 工具函数
│   ├── types/            # TypeScript 类型定义
│   └── models/           # 数据模型
├── public/               # 静态资源
└── ...配置文件
```

## 使用说明

### 管理员操作

1. 访问 `/login` 登录
2. 访问 `/admin` 进入管理后台
3. 点击"写新文章"创建文章
4. 使用 Markdown 编辑器编写内容
5. 预览并发布文章

### 博客访问

1. 登录后访问首页查看文章列表
2. 点击文章卡片查看详情
3. 在文章详情页发表评论

## 许可证

MIT License