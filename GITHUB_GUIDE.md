# GitHub 上传指南

本指南将帮助您将代码推送到 GitHub 仓库。

---

## 前置条件

在开始之前，请确保：
1. 已在电脑上安装 Git
2. 已注册 GitHub 账号
3. 已在 GitHub 上创建新仓库

---

## 第一步：准备工作

### 1.1 检查 Git 是否已安装

打开命令行（Windows 使用 PowerShell 或 CMD，Mac/Linux 使用终端），运行：
```bash
git --version
```

如果显示版本号，说明已安装；如果没有，请下载安装：https://git-scm.com/downloads

### 1.2 配置 Git 用户信息（首次使用需要）

```bash
git config --global user.name "您的名字"
git config --global user.email "您的邮箱@example.com"
```

---

## 第二步：在 GitHub 上创建新仓库

1. 登录 GitHub：https://github.com
2. 点击右上角的 "+" 号 → "New repository"
3. 填写仓库信息：
   - Repository name: `campus-delivery-system` (或您喜欢的名字)
   - Description: `校园外卖专送系统` (可选)
   - 选择 Public 或 Private（推荐 Public 以便部署）
   - **不要**勾选 "Initialize this repository with a README"（我们已经有了）
4. 点击 "Create repository"

---

## 第三步：初始化本地 Git 仓库

在项目目录下打开命令行，依次执行：

### 3.1 初始化 Git
```bash
git init
```

### 3.2 添加文件到暂存区
```bash
git add .
```

### 3.3 提交文件
```bash
git commit -m "Initial commit: 校园外卖专送系统"
```

### 3.4 连接到 GitHub 仓库

将命令中的 `your-username` 替换为您的 GitHub 用户名，`your-repo-name` 替换为您的仓库名：

```bash
git remote add origin https://github.com/your-username/your-repo-name.git
```

### 3.5 推送到 GitHub

```bash
git branch -M main
git push -u origin main
```

---

## 常见问题

### 问题1：提示需要认证
如果提示需要输入用户名和密码，请使用 GitHub Personal Access Token：

1. 在 GitHub 上点击头像 → Settings → Developer settings → Personal access tokens
2. 点击 "Generate new token"
3. 勾选 `repo` 权限
4. 生成并复制 token
5. 在命令行提示输入密码时，粘贴这个 token

### 问题2：冲突或错误
如果遇到问题，可以尝试：
```bash
git pull origin main --rebase
git push origin main
```

---

## 后续修改和提交

当您修改了代码后，使用以下命令更新：

```bash
git add .
git commit -m "描述您的修改"
git push origin main
```

---

## 一键脚本

我为您准备了一个快速初始化脚本，您也可以直接运行：

```bash
# 请先替换以下变量
GITHUB_USERNAME="your-username"
REPO_NAME="campus-delivery-system"

# 执行以下命令
git init
git add .
git commit -m "Initial commit: 校园外卖专送系统"
git branch -M main
git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git
git push -u origin main
```

---

## 下一步

代码成功推送到 GitHub 后，您可以：
1. 按照 [DEPLOYMENT.md](DEPLOYMENT.md) 部署到 Netlify 和 Vercel
2. 继续开发和提交更新

---

## 快速链接

- GitHub: https://github.com
- Git 下载: https://git-scm.com/downloads
- GitHub 文档: https://docs.github.com
