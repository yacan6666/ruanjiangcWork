# Render 部署指南

Render 是一个免费的 Node.js 后端部署平台，比 Vercel 更适合部署 Express 应用！

---

## 第一步：注册 Render 账号

1. 访问 https://render.com
2. 点击 "Get Started" 或 "Sign Up"
3. 使用 GitHub 账号登录（推荐，最简单）

---

## 第二步：创建 Web Service

### 2.1 点击 "New +"

在 Render 控制台首页，点击绿色的 **"New +"** 按钮

### 2.2 选择 "Web Service"

点击 **"Web Service"**

### 2.3 连接 GitHub 仓库

1. 在 "Connect a repository" 页面
2. 找到并选择您的仓库：`ruanjiangcWork`
3. 点击 "Connect"

### 2.4 配置 Web Service

在配置页面填写：

```
Name: campus-delivery-api

Region: Singapore（亚洲地区，速度快）

Branch: main

Root Directory: （留空）

Runtime: Node

Build Command: npm install

Start Command: node server.js

Plan: Free
```

### 2.5 点击 "Create Web Service"

---

## 第三步：等待部署

1. Render 会自动开始部署
2. 等待 1-3 分钟
3. 看到绿色的 "Live" 状态表示部署成功！

---

## 第四步：获取后端地址

部署成功后，页面上会显示：
```
Your service is live at:
https://campus-delivery-api.onrender.com
```

这就是您的后端地址！

---

## 第五步：更新前端 API 地址

复制您的 Render 后端地址，然后更新三个前端文件：

把：
```javascript
const API_URL = 'https://ruanjiangc-work.vercel.app/api';
```

改成（替换为您实际的地址）：
```javascript
const API_URL = 'https://campus-delivery-api.onrender.com/api';
```

---

## 第六步：提交并推送代码

```bash
git add .
git commit -m "Update API URL to Render"
git push
```

Render 会自动重新部署！

---

## 第七步：部署前端到 Netlify

1. 访问 https://app.netlify.com
2. 点击 "Add new site" → "Import an existing project"
3. 选择您的 GitHub 仓库
4. 配置：
   - Build command: （留空）
   - Publish directory: `.`
5. 点击 "Deploy site"

---

## 🎉 完成！

部署成功后会得到：
- **后端**：`https://campus-delivery-api.onrender.com`
- **前端**：`https://xxx.netlify.app`

访问前端地址就可以使用啦！

---

## 📋 Render 部署检查清单

- [ ] 注册 Render 账号
- [ ] 连接 GitHub 仓库
- [ ] 创建 Web Service
- [ ] 配置 Start Command 为 `node server.js`
- [ ] 等待部署成功
- [ ] 获取后端 URL
- [ ] 更新前端 API 地址
- [ ] 推送到 GitHub
- [ ] 部署前端到 Netlify

---

## ⚠️ 注意事项

1. **Render 免费版**：
   - 30秒无响应会休眠（15分钟不访问）
   - 首次访问可能需要等待几秒启动
   - 休眠后会再启动

2. **如果部署失败**：
   - 检查 Build 日志
   - 常见问题：`package.json` 没有正确的依赖

3. **保持 Render 活跃**：
   - 每月至少访问一次，防止休眠

---

## 🆘 遇到问题？

查看 Render 控制台的 "Logs" 标签页，会显示详细的错误信息。

常见问题：
- **Build 失败**：检查 `package.json` 的 `dependencies`
- **启动失败**：检查 `server.js` 是否有语法错误
