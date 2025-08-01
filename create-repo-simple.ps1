# 簡化版 GitHub 倉庫創建腳本
param(
    [string]$Token = ""
)

Write-Host "🚀 自動創建 GitHub 倉庫" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

if (-not $Token) {
    Write-Host "❌ 需要 GitHub Personal Access Token" -ForegroundColor Red
    Write-Host "請前往 https://github.com/settings/tokens 創建 Token" -ForegroundColor Yellow
    Write-Host "然後執行: .\create-repo-simple.ps1 -Token 'your_token'" -ForegroundColor Cyan
    exit 1
}

$headers = @{
    "Authorization" = "token $Token"
    "Accept" = "application/vnd.github.v3+json"
    "Content-Type" = "application/json"
}

$body = @{
    name = "autoreply-tool"
    description = "🤖 智能社群自動回覆工具"
    private = $false
    auto_init = $false
} | ConvertTo-Json

Write-Host "📝 正在創建倉庫..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method POST -Headers $headers -Body $body
    Write-Host "✅ 倉庫創建成功！" -ForegroundColor Green
    Write-Host "🌐 網址：$($response.html_url)" -ForegroundColor Cyan
    
    git remote set-url origin $response.clone_url
    git push -u origin main
    
    Write-Host "🎉 部署完成！" -ForegroundColor Green
    Write-Host "訪問：https://TTtheAsian.github.io/autoreply-tool" -ForegroundColor Yellow
} catch {
    Write-Host "❌ 失敗：$($_.Exception.Message)" -ForegroundColor Red
} 