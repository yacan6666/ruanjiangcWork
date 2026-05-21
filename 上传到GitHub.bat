@echo off
chcp 65001 >nul
echo ====================================
echo    校园外卖专送系统 - 上传脚本
echo ====================================
echo.

echo [1/5] 检查 Git 是否安装...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git 未安装！
    echo.
    echo 请先下载安装 Git: https://git-scm.com/download/win
    echo 安装后重启电脑，重新运行此脚本
    echo.
    pause
    exit
)
echo ✅ Git 已安装
echo.

echo [2/5] 初始化 Git 仓库...
git init >nul 2>&1
echo ✅ 初始化完成
echo.

echo [3/5] 添加文件...
git add .
echo ✅ 文件已添加
echo.

echo [4/5] 提交文件...
git commit -m "Initial commit: 校园外卖专送系统" >nul 2>&1
echo ✅ 提交完成
echo.

echo ====================================
echo 📋 下一步：
echo ====================================
echo.
echo 1. 请在 GitHub 上创建新仓库
echo    访问：https://github.com/new
echo.
echo 2. 创建仓库后，将以下两行命令中的地址替换为您的仓库地址，
echo    然后在 Git Bash 中运行：
echo.
echo    git remote add origin https://github.com/您的用户名/仓库名.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo ====================================
echo.
echo 💡 或者使用 GitHub Desktop 更简单！
echo    下载：https://desktop.github.com
echo.
echo 📖 详细教程请查看：快速上传.md
echo.
pause
