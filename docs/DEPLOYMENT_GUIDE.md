# 🚀 GitHub 部署指南

本指南將幫助您將 AutoReply Tool 部署到 GitHub Pages。

## 📋 前置需求

1. **GitHub 帳號**：確保您有一個 GitHub 帳號
2. **Git 客戶端**：安裝 Git 並設定好
3. **專案檔案**：確保所有專案檔案都已準備就緒

## 🔧 部署步驟

### 1. 初始化 Git 倉庫

```bash
# 初始化 Git 倉庫
git init

# 添加所有檔案
git add .

# 提交初始版本
git commit -m "🎉 初始版本：AutoReply Tool v1.1.0"
```

### 2. 創建 GitHub 倉庫

1. 前往 [GitHub](https://github.com)
2. 點擊 "New repository"
3. 設定倉庫名稱：`autoreply-tool`
4. 選擇 "Public" 或 "Private"
5. **不要**勾選 "Initialize this repository with a README"
6. 點擊 "Create repository"

### 3. 連接本地倉庫到 GitHub

```bash
# 添加遠端倉庫（請替換 YOUR_USERNAME 為您的 GitHub 用戶名）
git remote add origin https://github.com/YOUR_USERNAME/autoreply-tool.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 4. 啟用 GitHub Pages

1. 前往您的 GitHub 倉庫頁面
2. 點擊 "Settings" 標籤
3. 在左側選單中找到 "Pages"
4. 在 "Source" 部分選擇 "Deploy from a branch"
5. 選擇 "gh-pages" 分支
6. 點擊 "Save"

### 5. 自動部署設定

專案已包含 GitHub Actions 工作流程，會自動部署到 GitHub Pages：

- 工作流程檔案：`.github/workflows/deploy.yml`
- 觸發條件：推送到 `main` 或 `master` 分支
- 部署分支：`gh-pages`

## 🌐 訪問您的應用

部署完成後，您的應用將可通過以下網址訪問：

```
https://YOUR_USERNAME.github.io/autoreply-tool
```

## 🔄 更新部署

每次推送新版本到 `main` 分支時，GitHub Actions 會自動重新部署：

```bash
# 修改檔案後
git add .
git commit -m "📝 更新：描述您的更改"
git push origin main
```

## ⚠️ 注意事項

### API 配置

在生產環境中，請確保：

1. **更新 API 配置**：修改 `config/api-config.js` 中的重定向 URI
2. **設定環境變數**：在 GitHub 倉庫設定中添加環境變數
3. **更新 OAuth 回調 URL**：在各平台開發者控制台中更新回調 URL

### 安全考量

1. **不要提交敏感資訊**：確保 API 金鑰等敏感資訊不會被提交到倉庫
2. **使用環境變數**：在生產環境中使用環境變數管理敏感資訊
3. **定期更新**：定期更新依賴和 API 配置

## 🛠️ 故障排除

### 常見問題

1. **部署失敗**
   - 檢查 GitHub Actions 日誌
   - 確保所有檔案路徑正確
   - 驗證 `package.json` 配置

2. **頁面無法載入**
   - 檢查 GitHub Pages 設定
   - 確認 `index.html` 在根目錄
   - 驗證所有資源檔案路徑

3. **API 整合問題**
   - 檢查 CORS 設定
   - 驗證 OAuth 回調 URL
   - 確認 API 金鑰設定

### 獲取幫助

如果遇到問題，請：

1. 檢查 [GitHub Pages 文檔](https://pages.github.com/)
2. 查看 [GitHub Actions 文檔](https://docs.github.com/en/actions)
3. 在專案 Issues 中提出問題

## 📈 監控和維護

### 監控部署狀態

- 前往倉庫的 "Actions" 標籤查看部署狀態
- 設定部署通知
- 定期檢查應用功能

### 維護建議

- 定期更新依賴
- 監控 API 使用量
- 備份重要配置
- 更新文檔

---

🎉 **恭喜！您的 AutoReply Tool 已成功部署到 GitHub Pages！** 