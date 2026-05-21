# 校园外卖专送系统 - 部署指南

## 项目概述

这是一个校园外卖专送系统，包含：
- **前端**：HTML + CSS + JavaScript（静态网站）
- **后端**：Node.js + Express（API服务）

## 部署架构

由于 Netlify 主要用于静态网站托管，我们需要：
- **前端**：部署到 Netlify
- **后端**：部署到支持 Node.js 的平台（如 Vercel、Render、Railway 等）

---

## 第一步：部署后端

### 选择后端部署平台

推荐以下免费/低成本平台：

#### 选项1：Vercel
1. 访问 [vercel.com](https://vercel.com) 并注册账号
2. 创建 `vercel.json` 配置文件：

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

3. 使用 Vercel CLI 部署或连接 GitHub 仓库自动部署

#### 选项2：Render
1. 访问 [render.com](https://render.com) 并注册账号
2. 创建新的 "Web Service"
3. 连接您的 GitHub 仓库
4. 配置：
   - 构建命令：`npm install`
   - 启动命令：`node server.js`
   - 环境：Node

#### 选项3：Railway
1. 访问 [railway.app](https://railway.app) 并注册账号
2. 新建项目并选择 "Deploy from repo"
3. 连接您的 GitHub 仓库
4. 自动部署

### 获取后端 URL

部署成功后，您会获得一个后端地址，例如：
`https://your-backend-name.vercel.app`

---

## 第二步：更新前端 API 地址

更新前端文件中的 `API_URL` 配置：

### 修改 `js/student.js`
```javascript
const API_URL = 'https://your-backend-name.vercel.app/api'; // 替换为实际的后端地址
```

### 修改 `js/canteen.js`
```javascript
const API_URL = 'https://your-backend-name.vercel.app/api'; // 替换为实际的后端地址
```

### 修改 `js/deliveryman.js`
```javascript
const API_URL = 'https://your-backend-name.vercel.app/api'; // 替换为实际的后端地址
```

---

## 第三步：部署前端到 Netlify

### 方法1：使用 Netlify 网站部署（推荐）

1. 访问 [netlify.com](https://netlify.com) 并注册账号
2. 点击 "New site from Git"
3. 连接您的 GitHub 仓库
4. 配置部署设置：
   - Build command: 留空
   - Publish directory: `.`
5. 点击 "Deploy site"

### 方法2：使用 Netlify CLI 部署

1. 安装 Netlify CLI：
```bash
npm install -g netlify-cli
```

2. 登录：
```bash
netlify login
```

3. 初始化项目：
```bash
netlify init
```

4. 部署：
```bash
netlify deploy --prod
```

### 方法3：拖拽部署

1. 在项目目录中选择所有文件（不要包含 `node_modules`）
2. 访问 [app.netlify.com/drop](https://app.netlify.com/drop)
3. 将文件拖拽到页面上

---

## 第四步：更新 `package.json`（可选）

如果需要，确保 `package.json` 包含以下内容：

```json
{
  "name": "campus-delivery",
  "version": "1.0.0",
  "description": "Campus Food Delivery System",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "body-parser": "^1.20.2"
  },
  "keywords": ["campus", "delivery", "food"],
  "author": "",
  "license": "MIT"
}
```

---

## 测试账号

部署后可以使用以下测试账号：

### 学生端
- 学号：`2024001`
- 密码：`123456`

### 食堂端
- 用户名：`canteen1`
- 密码：`canteen123`

### 配送员端
- ID：`d001`
- 密码：`delivery123`

---

## 文件结构

```
your-project/
├── index.html          # 学生端首页
├── canteen.html        # 食堂管理页面
├── deliveryman.html    # 配送员页面
├── server.js           # 后端服务
├── netlify.toml        # Netlify 配置
├── package.json        # 项目配置
├── css/
│   └── style.css       # 样式文件
├── js/
│   ├── student.js      # 学生端脚本
│   ├── canteen.js      # 食堂端脚本
│   └── deliveryman.js  # 配送员脚本
└── DEPLOYMENT.md       # 本文档
```

---

## 常见问题

### 1. 前后端连接问题
- 确保后端 URL 正确配置在所有 JS 文件中
- 检查后端是否正常运行
- 确保后端 CORS 配置正确（已在 `server.js` 中配置）

### 2. Netlify 部署失败
- 确保 `node_modules` 已被忽略
- 检查 `netlify.toml` 配置是否正确
- 查看 Netlify 部署日志

### 3. 图片资源加载问题
- 使用 HTTPS 链接的图片
- 确保图片链接可访问

---

## 后续优化建议

1. **数据库**：当前使用内存存储，建议添加真实数据库（如 MongoDB、PostgreSQL）
2. **环境变量**：使用 `.env` 文件管理敏感信息
3. **安全**：添加用户认证和权限控制
4. **移动端优化**：进一步优化移动端体验
5. **订单通知**：添加实时通知功能

---

## 技术支持

如有问题，请检查：
- 浏览器控制台错误
- 后端服务日志
- Netlify 部署日志
