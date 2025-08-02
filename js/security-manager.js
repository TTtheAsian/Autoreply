// 安全管理器 - 處理 API 金鑰加密和安全儲存
class SecurityManager {
    constructor() {
        this.encryptionKey = null;
        this.init();
    }

    // 初始化安全管理器
    async init() {
        try {
            // 嘗試從 LocalStorage 獲取加密金鑰
            this.encryptionKey = this.getStoredEncryptionKey();
            
            if (!this.encryptionKey) {
                // 生成新的加密金鑰
                this.encryptionKey = await this.generateEncryptionKey();
                this.storeEncryptionKey(this.encryptionKey);
            }
            
            console.log('🔐 安全管理器初始化完成');
        } catch (error) {
            console.error('❌ 安全管理器初始化失敗:', error);
            throw error;
        }
    }

    // 生成加密金鑰
    async generateEncryptionKey() {
        try {
            // 使用 Web Crypto API 生成隨機金鑰
            const key = await window.crypto.subtle.generateKey(
                {
                    name: 'AES-GCM',
                    length: 256
                },
                true,
                ['encrypt', 'decrypt']
            );
            
            // 匯出金鑰為 ArrayBuffer
            const exportedKey = await window.crypto.subtle.exportKey('raw', key);
            
            // 轉換為 Base64 字串
            return this.arrayBufferToBase64(exportedKey);
        } catch (error) {
            console.error('❌ 生成加密金鑰失敗:', error);
            throw error;
        }
    }

    // 加密敏感資料
    async encryptData(data) {
        try {
            if (!this.encryptionKey) {
                throw new Error('加密金鑰未初始化');
            }

            // 將資料轉換為字串
            const dataString = typeof data === 'string' ? data : JSON.stringify(data);
            
            // 生成隨機 IV
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            
            // 匯入加密金鑰
            const key = await this.importEncryptionKey(this.encryptionKey);
            
            // 加密資料
            const encodedData = new TextEncoder().encode(dataString);
            const encryptedData = await window.crypto.subtle.encrypt(
                {
                    name: 'AES-GCM',
                    iv: iv
                },
                key,
                encodedData
            );
            
            // 組合 IV 和加密資料
            const combined = new Uint8Array(iv.length + encryptedData.byteLength);
            combined.set(iv);
            combined.set(new Uint8Array(encryptedData), iv.length);
            
            // 轉換為 Base64
            return this.arrayBufferToBase64(combined.buffer);
        } catch (error) {
            console.error('❌ 加密資料失敗:', error);
            throw error;
        }
    }

    // 解密敏感資料
    async decryptData(encryptedData) {
        try {
            if (!this.encryptionKey) {
                throw new Error('加密金鑰未初始化');
            }

            // 轉換 Base64 為 ArrayBuffer
            const combined = this.base64ToArrayBuffer(encryptedData);
            const combinedArray = new Uint8Array(combined);
            
            // 分離 IV 和加密資料
            const iv = combinedArray.slice(0, 12);
            const data = combinedArray.slice(12);
            
            // 匯入加密金鑰
            const key = await this.importEncryptionKey(this.encryptionKey);
            
            // 解密資料
            const decryptedData = await window.crypto.subtle.decrypt(
                {
                    name: 'AES-GCM',
                    iv: iv
                },
                key,
                data
            );
            
            // 轉換為字串
            const decryptedString = new TextDecoder().decode(decryptedData);
            
            // 嘗試解析為 JSON
            try {
                return JSON.parse(decryptedString);
            } catch {
                return decryptedString;
            }
        } catch (error) {
            console.error('❌ 解密資料失敗:', error);
            throw error;
        }
    }

    // 安全儲存 API 金鑰
    async secureStoreAPIKey(platform, apiKey) {
        try {
            const encryptedKey = await this.encryptData(apiKey);
            const storageKey = `secure_api_key_${platform}`;
            
            localStorage.setItem(storageKey, encryptedKey);
            console.log(`🔐 ${platform} API 金鑰已安全儲存`);
            
            return true;
        } catch (error) {
            console.error(`❌ 儲存 ${platform} API 金鑰失敗:`, error);
            throw error;
        }
    }

    // 安全獲取 API 金鑰
    async secureGetAPIKey(platform) {
        try {
            const storageKey = `secure_api_key_${platform}`;
            const encryptedKey = localStorage.getItem(storageKey);
            
            if (!encryptedKey) {
                return null;
            }
            
            const decryptedKey = await this.decryptData(encryptedKey);
            return decryptedKey;
        } catch (error) {
            console.error(`❌ 獲取 ${platform} API 金鑰失敗:`, error);
            throw error;
        }
    }

    // 安全儲存 Access Token
    async secureStoreToken(accountId, tokenData) {
        try {
            const encryptedToken = await this.encryptData(tokenData);
            const storageKey = `secure_token_${accountId}`;
            
            localStorage.setItem(storageKey, encryptedToken);
            console.log(`🔐 帳號 ${accountId} 的 Token 已安全儲存`);
            
            return true;
        } catch (error) {
            console.error(`❌ 儲存帳號 ${accountId} Token 失敗:`, error);
            throw error;
        }
    }

    // 安全獲取 Access Token
    async secureGetToken(accountId) {
        try {
            const storageKey = `secure_token_${accountId}`;
            const encryptedToken = localStorage.getItem(storageKey);
            
            if (!encryptedToken) {
                return null;
            }
            
            const decryptedToken = await this.decryptData(encryptedToken);
            return decryptedToken;
        } catch (error) {
            console.error(`❌ 獲取帳號 ${accountId} Token 失敗:`, error);
            throw error;
        }
    }

    // 清除安全儲存的資料
    async clearSecureData(accountId = null) {
        try {
            if (accountId) {
                // 清除特定帳號的資料
                localStorage.removeItem(`secure_token_${accountId}`);
                console.log(`🗑️ 帳號 ${accountId} 的安全資料已清除`);
            } else {
                // 清除所有安全資料
                const keys = Object.keys(localStorage);
                const secureKeys = keys.filter(key => 
                    key.startsWith('secure_api_key_') || 
                    key.startsWith('secure_token_')
                );
                
                secureKeys.forEach(key => localStorage.removeItem(key));
                console.log('🗑️ 所有安全資料已清除');
            }
            
            return true;
        } catch (error) {
            console.error('❌ 清除安全資料失敗:', error);
            throw error;
        }
    }

    // 驗證 Token 是否過期
    isTokenExpired(tokenData) {
        if (!tokenData || !tokenData.expiresAt) {
            return true;
        }
        
        const now = new Date();
        const expiresAt = new Date(tokenData.expiresAt);
        
        // 提前 5 分鐘視為過期
        const bufferTime = 5 * 60 * 1000; // 5 分鐘
        return now.getTime() + bufferTime >= expiresAt.getTime();
    }

    // 生成安全的隨機字串
    generateSecureRandomString(length = 32) {
        const array = new Uint8Array(length);
        window.crypto.getRandomValues(array);
        return this.arrayBufferToBase64(array.buffer);
    }

    // 雜湊密碼（用於本地驗證）
    async hashPassword(password) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hash = await window.crypto.subtle.digest('SHA-256', data);
            return this.arrayBufferToBase64(hash);
        } catch (error) {
            console.error('❌ 密碼雜湊失敗:', error);
            throw error;
        }
    }

    // 驗證密碼
    async verifyPassword(password, hashedPassword) {
        try {
            const hashedInput = await this.hashPassword(password);
            return hashedInput === hashedPassword;
        } catch (error) {
            console.error('❌ 密碼驗證失敗:', error);
            return false;
        }
    }

    // 工具方法：ArrayBuffer 轉 Base64
    arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    // 工具方法：Base64 轉 ArrayBuffer
    base64ToArrayBuffer(base64) {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    // 匯入加密金鑰
    async importEncryptionKey(keyString) {
        try {
            const keyData = this.base64ToArrayBuffer(keyString);
            return await window.crypto.subtle.importKey(
                'raw',
                keyData,
                {
                    name: 'AES-GCM',
                    length: 256
                },
                false,
                ['encrypt', 'decrypt']
            );
        } catch (error) {
            console.error('❌ 匯入加密金鑰失敗:', error);
            throw error;
        }
    }

    // 儲存加密金鑰
    storeEncryptionKey(key) {
        try {
            // 使用簡單的混淆儲存（實際應用中應該使用更安全的方式）
            const obfuscatedKey = btoa(key + '_obfuscated');
            localStorage.setItem('encryption_key', obfuscatedKey);
        } catch (error) {
            console.error('❌ 儲存加密金鑰失敗:', error);
            throw error;
        }
    }

    // 獲取儲存的加密金鑰
    getStoredEncryptionKey() {
        try {
            const obfuscatedKey = localStorage.getItem('encryption_key');
            if (!obfuscatedKey) {
                return null;
            }
            
            // 解混淆
            const keyWithSuffix = atob(obfuscatedKey);
            return keyWithSuffix.replace('_obfuscated', '');
        } catch (error) {
            console.error('❌ 獲取儲存的加密金鑰失敗:', error);
            return null;
        }
    }

    // 檢查瀏覽器支援
    checkBrowserSupport() {
        const required = [
            'crypto',
            'crypto.subtle',
            'crypto.getRandomValues',
            'TextEncoder',
            'TextDecoder'
        ];
        
        const missing = required.filter(feature => {
            if (feature.includes('.')) {
                const parts = feature.split('.');
                return !window[parts[0]] || !window[parts[0]][parts[1]];
            }
            return !window[feature];
        });
        
        if (missing.length > 0) {
            console.warn('⚠️ 瀏覽器缺少必要的安全功能:', missing);
            return false;
        }
        
        return true;
    }

    // 獲取安全狀態報告
    getSecurityStatus() {
        return {
            encryptionKeyExists: !!this.encryptionKey,
            browserSupport: this.checkBrowserSupport(),
            secureStorageCount: this.getSecureStorageCount(),
            lastActivity: new Date().toISOString()
        };
    }

    // 獲取安全儲存數量
    getSecureStorageCount() {
        const keys = Object.keys(localStorage);
        const secureKeys = keys.filter(key => 
            key.startsWith('secure_api_key_') || 
            key.startsWith('secure_token_')
        );
        return secureKeys.length;
    }
}

// 匯出 SecurityManager
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityManager;
} else {
    window.SecurityManager = SecurityManager;
} 