# 自動部署腳本
# 假設 GitHub 倉庫已經創建

Write-Host "🚀 AutoReply Tool 自動部署" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# 檢查 Git 狀態
Write-Host "📋 檢查 Git 狀態..." -ForegroundColor Yellow
git status

# 確保遠端倉庫設定正確
Write-Host ""
Write-Host "🔗 設定遠端倉庫..." -ForegroundColor Yellow
git remote set-url origin https://github.com/TTtheAsian/autoreply-tool.git

# 檢查遠端倉庫
Write-Host "📡 檢查遠端倉庫..." -ForegroundColor Yellow
git remote -v

# 推送程式碼
Write-Host ""
Write-Host "📤 推送程式碼到 GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ 推送成功！" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 下一步：" -ForegroundColor Cyan
    Write-Host "1. 前往 https://github.com/TTtheAsian/autoreply-tool" -ForegroundColor White
    Write-Host "2. 點擊 Settings > Pages" -ForegroundColor White
    Write-Host "3. 選擇 'Deploy from a branch'" -ForegroundColor White
    Write-Host "4. 選擇 'main' 分支" -ForegroundColor White
    Write-Host "5. 點擊 'Save'" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 您的應用將可通過以下網址訪問：" -ForegroundColor Cyan
    Write-Host "https://TTtheAsian.github.io/autoreply-tool" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📱 或者直接開啟本地版本：" -ForegroundColor Cyan
    Write-Host "http://localhost:8000" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ 推送失敗" -ForegroundColor Red
    Write-Host "請確保：" -ForegroundColor Yellow
    Write-Host "1. GitHub 倉庫已創建" -ForegroundColor White
    Write-Host "2. 您有推送權限" -ForegroundColor White
    Write-Host "3. 網路連接正常" -ForegroundColor White
}

Write-Host ""
Write-Host "🎯 完成！" -ForegroundColor Green 