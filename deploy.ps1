# AutoReply Tool 部署腳本 (PowerShell)
# 使用方法: .\deploy.ps1 [commit_message]

param(
    [string]$CommitMessage = "📝 更新：AutoReply Tool"
)

Write-Host "🚀 AutoReply Tool 部署腳本" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# 檢查是否在 Git 倉庫中
if (-not (Test-Path ".git")) {
    Write-Host "❌ 錯誤：當前目錄不是 Git 倉庫" -ForegroundColor Red
    Write-Host "請先執行：git init" -ForegroundColor Yellow
    exit 1
}

# 檢查是否有未提交的變更
$status = git status --porcelain
if ($status) {
    Write-Host "📝 發現未提交的變更，正在添加..." -ForegroundColor Yellow
    git add .
    
    Write-Host "💾 提交變更：$CommitMessage" -ForegroundColor Cyan
    git commit -m $CommitMessage
} else {
    Write-Host "✅ 沒有未提交的變更" -ForegroundColor Green
}

# 檢查是否有遠端倉庫
try {
    $remote = git remote get-url origin 2>$null
    if (-not $remote) {
        throw "No remote found"
    }
} catch {
    Write-Host "❌ 錯誤：未設定遠端倉庫" -ForegroundColor Red
    Write-Host "請先執行：git remote add origin https://github.com/YOUR_USERNAME/autoreply-tool.git" -ForegroundColor Yellow
    exit 1
}

# 推送到 GitHub
Write-Host "🚀 推送到 GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 推送成功！" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 下一步：" -ForegroundColor Cyan
    Write-Host "1. 前往您的 GitHub 倉庫頁面" -ForegroundColor White
    Write-Host "2. 點擊 Settings > Pages" -ForegroundColor White
    Write-Host "3. 選擇 'Deploy from a branch'" -ForegroundColor White
    Write-Host "4. 選擇 'gh-pages' 分支" -ForegroundColor White
    Write-Host "5. 點擊 'Save'" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 部署完成後，您的應用將可通過以下網址訪問：" -ForegroundColor Cyan
    Write-Host "https://YOUR_USERNAME.github.io/autoreply-tool" -ForegroundColor Yellow
} else {
    Write-Host "❌ 推送失敗，請檢查您的網路連接和 GitHub 設定" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 部署流程完成！" -ForegroundColor Green 