#!/bin/bash

# AutoReply Tool 部署腳本
# 使用方法: ./deploy.sh [commit_message]

echo "🚀 AutoReply Tool 部署腳本"
echo "================================"

# 檢查是否在 Git 倉庫中
if [ ! -d ".git" ]; then
    echo "❌ 錯誤：當前目錄不是 Git 倉庫"
    echo "請先執行：git init"
    exit 1
fi

# 檢查是否有未提交的變更
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 發現未提交的變更，正在添加..."
    git add .
    
    # 使用提供的提交訊息或預設訊息
    COMMIT_MSG=${1:-"📝 更新：AutoReply Tool"}
    echo "💾 提交變更：$COMMIT_MSG"
    git commit -m "$COMMIT_MSG"
else
    echo "✅ 沒有未提交的變更"
fi

# 檢查是否有遠端倉庫
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ 錯誤：未設定遠端倉庫"
    echo "請先執行：git remote add origin https://github.com/YOUR_USERNAME/autoreply-tool.git"
    exit 1
fi

# 推送到 GitHub
echo "🚀 推送到 GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ 推送成功！"
    echo ""
    echo "📋 下一步："
    echo "1. 前往您的 GitHub 倉庫頁面"
    echo "2. 點擊 Settings > Pages"
    echo "3. 選擇 'Deploy from a branch'"
    echo "4. 選擇 'gh-pages' 分支"
    echo "5. 點擊 'Save'"
    echo ""
    echo "🌐 部署完成後，您的應用將可通過以下網址訪問："
    echo "https://YOUR_USERNAME.github.io/autoreply-tool"
else
    echo "❌ 推送失敗，請檢查您的網路連接和 GitHub 設定"
    exit 1
fi

echo ""
echo "🎉 部署流程完成！" 