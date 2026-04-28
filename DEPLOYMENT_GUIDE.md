# 🚀 个人博客部署指南

## 方法一：通过 Vercel + GitHub 部署（推荐）

### 第一步：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名填写：`personal-blog`
3. 选择 **Public**（私有仓库 Vercel 也能用，但免费版有限制）
4. **不要**勾选 "Initialize this repository with a README"
5. 点击 **Create repository**

### 第二步：推送代码到 GitHub

复制 GitHub 提供的仓库地址（类似 `https://github.com/5945Zwj/personal-blog.git`），然后在终端执行：

```bash
cd d:/WUDownloadCache/personal-blog
git remote add origin https://github.com/5945Zwj/personal-blog.git
git branch -M main
git push -u origin main
```

> 推送时需要输入 GitHub 用户名和密码（或 Token）

### 第三步：部署到 Vercel

1. 访问 https://vercel.com/signup 注册/登录（可以用 GitHub 账号登录）
2. 登录后点击 **Add New...** → **Project**
3. 选择刚才推送的 `personal-blog` 仓库
4. 配置环境变量（见下方）
5. 点击 **Deploy**

---

## 方法二：Vercel CLI 直接部署（无需 GitHub）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署
cd d:/WUDownloadCache/personal-blog
vercel --prod
```

---

## ⚙️ Vercel 环境变量配置

在 Vercel 部署页面（或 Project Settings → Environment Variables）添加以下变量：

| 变量名 | 说明 | 获取方式 |
|--------|------|---------|
| `MONGODB_URI` | MongoDB 连接字符串 | 见下方 MongoDB 配置 |
| `NEXTAUTH_SECRET` | NextAuth 加密密钥 | 运行 `openssl rand -base64 32` 生成 |
| `NEXTAUTH_URL` | 你的域名 | 部署后自动生成，如 `https://your-blog.vercel.app` |
| `ADMIN_EMAIL` | 管理员邮箱 | 填写你的邮箱，如 `1513064928@qq.com` |
| `ADMIN_PASSWORD` | 管理员密码 | 设置一个安全的密码 |

---

## 🗄️ MongoDB Atlas 免费数据库配置

1. 访问 https://www.mongodb.com/atlas/register 注册（免费）
2. 创建 **M0 FREE** 集群
3. 在 **Security → Database Access** 创建数据库用户（记录用户名和密码）
4. 在 **Security → Network Access** 添加 IP 地址：`0.0.0.0/0`（允许任意 IP 访问）
5. 在 **Clusters** 页面点击 **Connect** → **Drivers**
6. 复制连接字符串，替换 `<password>` 为你的数据库密码
7. 将连接字符串填入 Vercel 的 `MONGODB_URI` 环境变量

连接字符串格式：
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/personal-blog?retryWrites=true&w=majority
```

---

## ✅ 部署完成后

1. 访问你的博客：`https://your-blog.vercel.app`
2. 点击登录，使用 `ADMIN_EMAIL` 和 `ADMIN_PASSWORD` 登录
3. 进入 `/admin` 开始写文章！

---

## 🔑 生成 NEXTAUTH_SECRET

在终端运行：
```bash
openssl rand -base64 32
```

复制输出结果，作为 `NEXTAUTH_SECRET` 的值。
