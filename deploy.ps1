# AutoReply Tool 部署腳本

Write-Host "AutoReply Tool 自動部署" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green

# 設定遠端倉庫
Write-Host "設定遠端倉庫..." -ForegroundColor Yellow
git remote set-url origin https://github.com/TTtheAsian/autoreply-tool.git

# 檢查遠端倉庫
Write-Host "檢查遠端倉庫..." -ForegroundColor Yellow
git remote -v

# 推送程式碼
Write-Host "推送程式碼到 GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "推送成功！" -ForegroundColor Green
    Write-Host "請前往 https://github.com/TTtheAsian/autoreply-tool" -ForegroundColor Cyan
    Write-Host "然後啟用 GitHub Pages" -ForegroundColor Cyan
} else {
    Write-Host "推送失敗" -ForegroundColor Red
} 