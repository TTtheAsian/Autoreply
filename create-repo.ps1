# 自動創建 GitHub 倉庫腳本
# 使用方法: .\create-repo.ps1

param(
    [string]$Token = "",
    [string]$RepoName = "autoreply-tool",
    [string]$Description = "🤖 智能社群自動回覆工具 - 支援多平台 API 整合",
    [string]$Visibility = "public"
)

Write-Host "🚀 自動創建 GitHub 倉庫" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# 檢查是否提供 Token
if (-not $Token) {
    Write-Host "❌ 錯誤：需要 GitHub Personal Access Token" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 如何獲取 Token：" -ForegroundColor Yellow
    Write-Host "1. 前往 https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "2. 點擊 'Generate new token (classic)'" -ForegroundColor White
    Write-Host "3. 選擇 'repo' 權限" -ForegroundColor White
    Write-Host "4. 複製生成的 Token" -ForegroundColor White
    Write-Host ""
    Write-Host "然後執行：" -ForegroundColor Yellow
    Write-Host ".\create-repo.ps1 -Token 'your_token_here'" -ForegroundColor Cyan
    exit 1
}

# 準備請求資料
$headers = @{
    "Authorization" = "token $Token"
    "Accept" = "application/vnd.github.v3+json"
    "Content-Type" = "application/json"
}

$body = @{
    name = $RepoName
    description = $Description
    private = ($Visibility -eq "private")
    auto_init = $false
} | ConvertTo-Json

Write-Host "📝 正在創建倉庫：$RepoName" -ForegroundColor Yellow

try {
    # 發送 API 請求
    $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method POST -Headers $headers -Body $body
    
    Write-Host "✅ 倉庫創建成功！" -ForegroundColor Green
    Write-Host "🌐 倉庫網址：$($response.html_url)" -ForegroundColor Cyan
    Write-Host "📁 克隆網址：$($response.clone_url)" -ForegroundColor Cyan
    
    # 更新遠端倉庫 URL
    Write-Host ""
    Write-Host "🔄 更新本地遠端倉庫..." -ForegroundColor Yellow
    git remote set-url origin $response.clone_url
    
    # 推送程式碼
    Write-Host "📤 推送程式碼到 GitHub..." -ForegroundColor Yellow
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 推送成功！" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎉 下一步：" -ForegroundColor Cyan
        Write-Host "1. 前往 $($response.html_url)" -ForegroundColor White
        Write-Host "2. 點擊 Settings > Pages" -ForegroundColor White
        Write-Host "3. 選擇 'Deploy from a branch'" -ForegroundColor White
        Write-Host "4. 選擇 'main' 分支" -ForegroundColor White
        Write-Host "5. 點擊 'Save'" -ForegroundColor White
        Write-Host ""
        Write-Host "🌐 您的應用將可通過以下網址訪問：" -ForegroundColor Cyan
        Write-Host "https://TTtheAsian.github.io/$RepoName" -ForegroundColor Yellow
    } else {
        Write-Host "❌ 推送失敗" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ 創建倉庫失敗：" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response.StatusCode -eq 422) {
        Write-Host "💡 提示：倉庫可能已經存在" -ForegroundColor Yellow
    }
} 