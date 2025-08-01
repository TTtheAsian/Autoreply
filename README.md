# 🤖 AutoReply Tool - 自動回覆工具

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Web-orange.svg)
![Storage](https://img.shields.io/badge/storage-LocalStorage-yellow.svg)

**專為社群平台設計的智能自動回覆管理工具**

[🚀 開始使用](#快速開始) • [📖 功能特色](#功能特色) • [🛠️ 技術架構](#技術架構) • [📊 開發進度](#開發進度)

</div>

---

## 📋 專案簡介

**AutoReply Tool** 是一個專為社群平台設計的智能自動回覆管理工具，幫助您輕鬆管理多個社群平台的自動回覆功能。透過直觀的介面和強大的規則引擎，讓您的社群互動更加高效和專業。

### 🎯 主要特色

- **📱 多平台支援**：支援 Instagram、Facebook、Twitter、Line、Telegram、WhatsApp 等主流社群平台
- **🔗 實際帳號綁定**：透過 OAuth 2.0 安全連接實際社群平台帳號
- **🤖 智能規則引擎**：基於關鍵字的智能回覆規則，自動化處理常見問題
- **📝 範本管理**：豐富的回覆範本庫，快速建立專業回覆內容
- **⏰ 排程控制**：靈活的時間排程，確保在適當時間進行自動回覆
- **📊 數據分析**：詳細的回覆統計和分析報告
- **💾 本地儲存**：所有資料安全儲存在本地，保護您的隱私
- **🔌 API 整合**：完整的社群平台 API 整合架構

---

## 🚀 快速開始

### 系統需求

- 現代瀏覽器（Chrome 80+、Firefox 75+、Safari 13+、Edge 80+）
- 支援 LocalStorage 的瀏覽器環境

### 安裝與使用

1. **下載專案**
   ```bash
   git clone https://github.com/your-username/autoreply-tool.git
   cd autoreply-tool
   ```

2. **開啟應用程式**
   - 直接開啟 `index.html` 檔案
   - 或使用本地伺服器：
     ```bash
     # 使用 Python
     python -m http.server 8000
     
     # 使用 Node.js
     npx serve .
     ```

3. **開始使用**
   - 訪問 `http://localhost:8000`
   - 開始設定您的自動回覆規則

---

## 🛠️ 技術架構

### 前端技術

- **HTML5**：語義化標籤，無障礙設計
- **CSS3**：現代化樣式，響應式設計
- **JavaScript (ES6+)**：模組化架構，現代化語法
- **LocalStorage**：本地資料持久化

### 專案結構

```
autoreply-tool/
├── index.html              # 主頁面
├── css/
│   └── style.css          # 樣式檔案
├── js/
│   ├── app.js             # 主要應用邏輯
│   ├── storage.js         # 資料儲存管理
│   └── ui.js              # UI 元件
├── README.md              # 專案說明
└── RULES.json             # AI 助手規則
```

### 核心模組

- **AutoReplyTool**：主要應用程式類別
- **StorageManager**：LocalStorage 資料管理
- **UIHelper**：動態 UI 元件生成

---

## 📊 核心功能與開發進度

| 功能名稱 | 狀態 | 進度 | 備註 |
| :--- | :--- | :--- | :--- |
| 🏗️ 專案初始化 | ✅ 已完成 | 100% | 建立基本檔案結構 |
| 🎨 主頁面設計 | ✅ 已完成 | 100% | 現代化響應式儀表板設計 |
| 📱 帳號管理 | ✅ 已完成 | 100% | 多平台帳號連接管理 |
| 🤖 回覆規則 | ✅ 已完成 | 100% | 智能關鍵字觸發規則 |
| 📝 範本管理 | ✅ 已完成 | 100% | 回覆內容範本系統 |
| ⏰ 排程管理 | ✅ 已完成 | 100% | 時間控制排程功能 |
| 📈 統計分析 | ✅ 已完成 | 100% | 回覆數據統計儀表板 |
| 🔄 專案重構 | ✅ 已完成 | 100% | 從 SocialManager 重構為 AutoReply Tool |

---

## 🎯 功能特色詳解

### 📱 帳號管理
- **多平台支援**：Instagram、Facebook、Twitter、Line、Telegram、WhatsApp
- **OAuth 2.0 認證**：安全的第三方認證流程
- **API 金鑰管理**：安全的 API 金鑰儲存
- **狀態監控**：即時監控帳號連接狀態
- **連接管理**：一鍵連接/斷開實際社群平台帳號
- **Token 自動更新**：自動處理過期 Token 的重新整理

### 🤖 回覆規則
- **關鍵字觸發**：支援多個關鍵字組合
- **平台選擇**：可選擇適用的社群平台
- **優先級設定**：規則優先級管理
- **狀態控制**：啟用/停用規則

### 📝 範本管理
- **分類管理**：問候、客服、行銷、活動等分類
- **使用統計**：範本使用次數追蹤
- **快速套用**：一鍵套用範本到規則
- **內容預覽**：即時預覽範本內容

### ⏰ 排程管理
- **時間設定**：精確的開始和結束時間
- **日期選擇**：支援週一到週日的靈活選擇
- **規則關聯**：與回覆規則的關聯設定
- **狀態控制**：排程啟用/停用管理

### 📈 統計分析
- **回覆趨勢**：圖表化顯示回覆趨勢
- **平台分布**：各平台回覆數據分析
- **最近記錄**：即時回覆記錄查看
- **效能指標**：回覆率和效率統計

### 🔗 實際 API 整合
- **OAuth 2.0 認證**：安全的第三方平台認證
- **多平台 API**：Instagram、Facebook、LINE 等平台 API 整合
- **速率限制管理**：自動處理各平台的 API 速率限制
- **錯誤處理**：完善的錯誤處理和重試機制
- **安全儲存**：Token 和敏感資訊的安全加密儲存

---

## 🔧 開發指南

### 🚀 快速開始

#### 本地開發

1. **克隆專案**
   ```bash
   git clone https://github.com/your-username/autoreply-tool.git
   cd autoreply-tool
   ```

2. **啟動開發伺服器**
   ```bash
   # 使用 Python
   python -m http.server 8000
   
   # 或使用 Node.js
   npx serve .
   
   # 或使用 npm 腳本
   npm start
   ```

3. **開啟瀏覽器**
   - 訪問 `http://localhost:8000`
   - 開始開發和測試

#### 部署到 GitHub Pages

1. **初始化 Git 倉庫**
   ```bash
   git init
   git add .
   git commit -m "🎉 初始版本：AutoReply Tool v1.1.0"
   ```

2. **推送到 GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/autoreply-tool.git
   git branch -M main
   git push -u origin main
   ```

3. **啟用 GitHub Pages**
   - 前往倉庫 Settings > Pages
   - 選擇 "Deploy from a branch"
   - 選擇 "gh-pages" 分支
   - 點擊 "Save"

4. **自動部署**
   - 專案已包含 GitHub Actions 工作流程
   - 推送到 `main` 分支會自動部署
   - 訪問：`https://YOUR_USERNAME.github.io/autoreply-tool`

詳細部署指南請參考：[📖 部署指南](docs/DEPLOYMENT_GUIDE.md)

### 程式碼結構

- **模組化設計**：每個功能模組獨立開發
- **事件驅動**：使用事件驅動架構
- **響應式設計**：支援各種螢幕尺寸
- **無障礙設計**：符合 WCAG 2.1 標準

---

## 📝 開發日誌

### 最新更新 (v1.1.0)
- 🚀 [GitHub 部署] 新增 GitHub Pages 自動部署功能
- 🔗 [API 整合] 新增實際社群平台 API 整合功能
- 🔐 [OAuth 認證] 實作 OAuth 2.0 安全認證流程
- 📱 [帳號連接] 支援實際帳號綁定和連接管理
- ⚡ [速率限制] 實作 API 速率限制管理機制
- 🔄 [專案重構] 從 SocialManager 重構為 AutoReply Tool
- 🎨 [主頁面設計] 完成現代化響應式儀表板設計
- 📊 [儀表板優化] 實作統計卡片與趨勢指標
- 🚀 [快速操作] 建立卡片式快速操作介面
- 📋 [活動追蹤] 實作最近活動與系統通知功能
- 📱 [響應式設計] 優化行動裝置使用體驗
- 📱 [帳號管理] 完成多平台帳號連接功能
- 🤖 [規則設定] 建立關鍵字觸發回覆規則
- 📝 [範本管理] 實作回覆內容範本系統
- ⏰ [排程管理] 建立時間控制排程功能
- 📊 [統計分析] 完成回覆數據統計儀表板

---

## 🤝 貢獻指南

我們歡迎所有形式的貢獻！

### 如何貢獻

1. **Fork 專案**
2. **建立功能分支** (`git checkout -b feature/AmazingFeature`)
3. **提交變更** (`git commit -m 'Add some AmazingFeature'`)
4. **推送到分支** (`git push origin feature/AmazingFeature`)
5. **開啟 Pull Request**

### 開發規範

- 遵循現有的程式碼風格
- 新增適當的註解和文件
- 確保所有功能都有測試覆蓋
- 更新相關的文件和 README

---

## 📄 授權條款

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案

---

## 📞 聯絡資訊

- **專案維護者**：[Your Name](mailto:your.email@example.com)
- **專案網址**：https://github.com/your-username/autoreply-tool
- **問題回報**：https://github.com/your-username/autoreply-tool/issues

---

<div align="center">

**⭐ 如果這個專案對您有幫助，請給我們一個星標！**

Made with ❤️ by [TT]

</div> 
