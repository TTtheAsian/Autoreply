# 🔗 API 整合使用指南

本指南將幫助您設定和使用 AutoReply Tool 的實際社群平台 API 整合功能。

## 📋 目錄

1. [前置需求](#前置需求)
2. [平台支援](#平台支援)
3. [設定步驟](#設定步驟)
4. [使用方式](#使用方式)
5. [安全注意事項](#安全注意事項)
6. [故障排除](#故障排除)

---

## 🔧 前置需求

### 基本需求
- 現代瀏覽器（Chrome 80+、Firefox 75+、Safari 13+、Edge 80+）
- 支援 LocalStorage 的瀏覽器環境
- 穩定的網路連線

### 開發者帳號
您需要以下平台的開發者帳號：
- **Instagram**: Meta for Developers 帳號
- **Facebook**: Meta for Developers 帳號
- **LINE**: LINE Developers 帳號
- **Twitter**: Twitter Developer Portal 帳號
- **Telegram**: BotFather 帳號
- **WhatsApp**: WhatsApp Business API 帳號

---

## 📱 平台支援

| 平台 | 支援狀態 | 主要功能 | 限制 |
|------|----------|----------|------|
| Instagram | ✅ 完整支援 | 評論回覆、私訊 | API 限制較嚴格 |
| Facebook | ✅ 完整支援 | 頁面貼文、評論、Messenger | 需要頁面管理權限 |
| LINE | ✅ 完整支援 | 訊息回覆、Rich Menu | 需要 LINE Bot 帳號 |
| Twitter | ✅ 完整支援 | 推文回覆、私訊 | API 付費限制 |
| Telegram | ✅ 完整支援 | Bot 訊息、頻道貼文 | 需要 Bot Token |
| WhatsApp | ✅ 完整支援 | 商業訊息 | 需要商業 API 帳號 |

---

## ⚙️ 設定步驟

### 1. 配置 API 設定

編輯 `config/api-config.js` 檔案，填入您的 API 憑證：

```javascript
const API_CONFIG = {
    instagram: {
        clientId: 'your_instagram_client_id',
        clientSecret: 'your_instagram_client_secret',
        redirectUri: 'http://localhost:8000/oauth-callback.html'
    },
    facebook: {
        clientId: 'your_facebook_client_id',
        clientSecret: 'your_facebook_client_secret',
        redirectUri: 'http://localhost:8000/oauth-callback.html'
    }
    // ... 其他平台設定
};
```

### 2. 設定環境變數（推薦）

為了安全起見，建議使用環境變數：

```bash
# .env 檔案
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
```

### 3. 平台特定設定

#### Instagram
1. 前往 [Meta for Developers](https://developers.facebook.com/)
2. 建立新應用程式
3. 新增 Instagram Basic Display 產品
4. 設定 OAuth 回調 URL
5. 取得 Client ID 和 Client Secret

#### Facebook
1. 前往 [Meta for Developers](https://developers.facebook.com/)
2. 建立新應用程式
3. 新增 Facebook Login 產品
4. 設定 OAuth 回調 URL
5. 取得 Client ID 和 Client Secret

#### LINE
1. 前往 [LINE Developers](https://developers.line.biz/)
2. 建立新的 Provider
3. 建立新的 Channel
4. 取得 Channel ID 和 Channel Secret

---

## 🚀 使用方式

### 1. 新增帳號

1. 開啟 AutoReply Tool
2. 前往「自動回覆」頁面
3. 點擊「帳號管理」標籤
4. 點擊「新增帳號」按鈕
5. 填寫帳號資訊：
   - 選擇平台
   - 輸入帳號名稱
   - 點擊「新增帳號」

### 2. 連接實際帳號

1. 在帳號列表中，點擊「🔗 連接」按鈕
2. 系統會開啟認證視窗
3. 登入您的社群平台帳號
4. 授權應用程式存取權限
5. 認證成功後，帳號狀態會變更為「已連接」

### 3. 設定自動回覆規則

1. 前往「回覆規則」標籤
2. 點擊「新增規則」
3. 設定規則內容：
   - 規則名稱
   - 觸發關鍵字
   - 回覆內容
   - 適用平台
4. 儲存規則

### 4. 測試自動回覆

1. 確保帳號已連接
2. 在對應平台發送包含關鍵字的訊息
3. 系統會自動觸發回覆規則
4. 查看「回覆統計」頁面的記錄

---

## 🔒 安全注意事項

### API 金鑰安全
- **永遠不要**在程式碼中硬編碼 API 金鑰
- 使用環境變數或安全的配置管理系統
- 定期輪換 API 金鑰
- 監控 API 使用情況

### 權限管理
- 只請求必要的權限範圍
- 定期檢視和撤銷不需要的權限
- 使用最小權限原則

### 資料保護
- 所有敏感資料都經過加密儲存
- 使用 HTTPS 進行所有 API 通訊
- 定期備份重要資料

### 速率限制
- 遵守各平台的 API 速率限制
- 實作適當的重試機制
- 監控 API 使用量

---

## 🛠️ 故障排除

### 常見問題

#### 1. 認證失敗
**症狀**: 點擊連接按鈕後認證失敗

**解決方案**:
- 檢查 Client ID 和 Client Secret 是否正確
- 確認回調 URL 設定正確
- 檢查瀏覽器是否阻擋彈出視窗

#### 2. Token 過期
**症狀**: 帳號顯示「Token 已過期」

**解決方案**:
- 系統會自動嘗試重新整理 Token
- 如果失敗，請重新連接帳號
- 檢查 API 金鑰是否有效

#### 3. 速率限制錯誤
**症狀**: 收到「已達到速率限制」錯誤

**解決方案**:
- 等待一段時間後再試
- 檢查 API 使用量
- 考慮升級 API 方案

#### 4. 回覆未發送
**症狀**: 規則觸發但回覆未發送

**解決方案**:
- 檢查帳號連接狀態
- 確認規則設定正確
- 查看錯誤日誌

### 除錯模式

啟用除錯模式以獲取詳細資訊：

```javascript
// 在瀏覽器控制台執行
window.DEV_CONFIG.debug.enabled = true;
window.DEV_CONFIG.debug.logLevel = 'debug';
```

### 日誌查看

在瀏覽器開發者工具的 Console 中查看詳細日誌：
- API 呼叫記錄
- 錯誤訊息
- 認證流程狀態

---

## 📞 技術支援

如果您遇到問題，請：

1. 查看本指南的故障排除部分
2. 檢查瀏覽器控制台的錯誤訊息
3. 確認 API 設定是否正確
4. 聯繫技術支援團隊

### 有用的連結

- [Meta for Developers](https://developers.facebook.com/)
- [LINE Developers](https://developers.line.biz/)
- [Twitter Developer Portal](https://developer.twitter.com/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)

---

## 📝 更新日誌

### v1.1.0 (最新)
- ✅ 新增 OAuth 2.0 認證支援
- ✅ 實作多平台 API 整合
- ✅ 新增速率限制管理
- ✅ 改善錯誤處理機制
- ✅ 新增安全 Token 儲存

### v1.0.0
- ✅ 基礎自動回覆功能
- ✅ 本地資料儲存
- ✅ 基本 UI 介面

---

**注意**: 本工具僅供學習和開發測試使用。在生產環境中使用前，請確保符合各平台的使用條款和政策。 