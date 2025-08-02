// API 管理器 - 處理實際社群平台整合
class APIManager {
    constructor() {
        this.securityManager = new SecurityManager();
        this.rateLimiter = new RateLimiter();
        this.errorHandler = new ErrorHandler();
        this.platforms = {
            instagram: {
                name: 'Instagram',
                apiEndpoint: 'https://graph.instagram.com/v12.0',
                authEndpoint: 'https://api.instagram.com/oauth/authorize',
                tokenEndpoint: 'https://api.instagram.com/oauth/access_token',
                scopes: ['basic', 'comments', 'relationships'],
                rateLimit: {
                    requests: 200,
                    window: 3600 // 1小時
                }
            },
            facebook: {
                name: 'Facebook',
                apiEndpoint: 'https://graph.facebook.com/v18.0',
                authEndpoint: 'https://www.facebook.com/v18.0/dialog/oauth',
                tokenEndpoint: 'https://graph.facebook.com/v18.0/oauth/access_token',
                scopes: ['pages_manage_posts', 'pages_read_engagement', 'pages_manage_metadata'],
                rateLimit: {
                    requests: 200,
                    window: 3600
                }
            },
            line: {
                name: 'LINE',
                apiEndpoint: 'https://api.line.me/v2',
                authEndpoint: 'https://access.line.me/oauth2/v2.1/authorize',
                tokenEndpoint: 'https://api.line.me/oauth2/v2.1/token',
                scopes: ['profile', 'openid', 'chat_message.write'],
                rateLimit: {
                    requests: 1000,
                    window: 3600
                }
            }
        };
        
        this.activeConnections = new Map();
    }

    // 初始化 API 管理器
    async init() {
        console.log('🔌 API 管理器初始化中...');
        
        // 初始化安全管理器
        await this.securityManager.init();
        
        await this.loadStoredConnections();
        await this.validateStoredTokens();
    }

    // 載入已儲存的連接
    async loadStoredConnections() {
        const storage = new StorageManager();
        const accounts = storage.getAutoreplyAccounts();
        
        for (const account of accounts) {
            // 從安全儲存獲取 Token
            const secureToken = await this.securityManager.secureGetToken(account.id);
            
            if (secureToken && secureToken.accessToken) {
                this.activeConnections.set(account.id, {
                    platform: account.platform,
                    username: account.username,
                    accessToken: secureToken.accessToken,
                    refreshToken: secureToken.refreshToken,
                    expiresAt: secureToken.expiresAt
                });
            }
        }
    }

    // 驗證已儲存的 Token
    async validateStoredTokens() {
        for (const [accountId, connection] of this.activeConnections) {
            if (this.securityManager.isTokenExpired(connection)) {
                await this.refreshAccessToken(accountId, connection);
            }
        }
    }

    // 開始 OAuth 認證流程
    async startOAuthFlow(platform, accountId) {
        const platformConfig = this.platforms[platform];
        if (!platformConfig) {
            throw new Error(`不支援的平台: ${platform}`);
        }

        const state = this.generateState();
        const authUrl = this.buildAuthUrl(platformConfig, state);
        
        // 儲存認證狀態
        sessionStorage.setItem('oauth_state', state);
        sessionStorage.setItem('oauth_platform', platform);
        sessionStorage.setItem('oauth_account_id', accountId);

        // 開啟認證視窗
        const authWindow = window.open(
            authUrl,
            'oauth_auth',
            'width=600,height=700,scrollbars=yes,resizable=yes'
        );

        return new Promise((resolve, reject) => {
            const checkClosed = setInterval(() => {
                if (authWindow.closed) {
                    clearInterval(checkClosed);
                    const code = sessionStorage.getItem('oauth_code');
                    if (code) {
                        this.handleOAuthCallback(code, platform, accountId)
                            .then(resolve)
                            .catch(reject);
                    } else {
                        reject(new Error('認證流程被取消'));
                    }
                }
            }, 1000);
        });
    }

    // 處理 OAuth 回調
    async handleOAuthCallback(code, platform, accountId) {
        try {
            const platformConfig = this.platforms[platform];
            const tokenResponse = await this.exchangeCodeForToken(code, platformConfig);
            
            // 儲存連接資訊
            const connection = {
                platform,
                accessToken: tokenResponse.access_token,
                refreshToken: tokenResponse.refresh_token,
                expiresAt: new Date(Date.now() + tokenResponse.expires_in * 1000).toISOString()
            };

            this.activeConnections.set(accountId, connection);

            // 安全儲存 Token
            await this.securityManager.secureStoreToken(accountId, {
                accessToken: connection.accessToken,
                refreshToken: connection.refreshToken,
                expiresAt: connection.expiresAt
            });
            
            // 更新儲存中的帳號資訊
            const storage = new StorageManager();
            const accounts = storage.getAutoreplyAccounts();
            const accountIndex = accounts.findIndex(acc => acc.id === accountId);
            
            if (accountIndex !== -1) {
                accounts[accountIndex] = {
                    ...accounts[accountIndex],
                    status: 'connected'
                };
                storage.saveAutoreplyAccounts(accounts);
            }

            // 清理 session storage
            sessionStorage.removeItem('oauth_code');
            sessionStorage.removeItem('oauth_state');
            sessionStorage.removeItem('oauth_platform');
            sessionStorage.removeItem('oauth_account_id');

            return { success: true, message: '帳號連接成功！' };
        } catch (error) {
            console.error('OAuth 回調處理失敗:', error);
            throw new Error('認證失敗: ' + error.message);
        }
    }

    // 交換授權碼為存取 Token
    async exchangeCodeForToken(code, platformConfig) {
        const response = await fetch(platformConfig.tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                client_id: this.getClientId(platformConfig.name),
                client_secret: this.getClientSecret(platformConfig.name),
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: this.getRedirectUri()
            })
        });

        if (!response.ok) {
            throw new Error(`Token 交換失敗: ${response.status}`);
        }

        return await response.json();
    }

    // 重新整理存取 Token
    async refreshAccessToken(accountId, connection) {
        try {
            const platformConfig = this.platforms[connection.platform];
            const response = await fetch(platformConfig.tokenEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    client_id: this.getClientId(platformConfig.name),
                    client_secret: this.getClientSecret(platformConfig.name),
                    refresh_token: connection.refreshToken,
                    grant_type: 'refresh_token'
                })
            });

            if (!response.ok) {
                throw new Error(`Token 重新整理失敗: ${response.status}`);
            }

            const tokenResponse = await response.json();
            
            // 更新連接資訊
            connection.accessToken = tokenResponse.access_token;
            connection.expiresAt = new Date(Date.now() + tokenResponse.expires_in * 1000).toISOString();
            
            if (tokenResponse.refresh_token) {
                connection.refreshToken = tokenResponse.refresh_token;
            }

            this.activeConnections.set(accountId, connection);

            // 安全儲存更新的 Token
            await this.securityManager.secureStoreToken(accountId, {
                accessToken: connection.accessToken,
                refreshToken: connection.refreshToken,
                expiresAt: connection.expiresAt
            });
            
            // 更新儲存中的帳號狀態
            const storage = new StorageManager();
            const accounts = storage.getAutoreplyAccounts();
            const accountIndex = accounts.findIndex(acc => acc.id === accountId);
            
            if (accountIndex !== -1) {
                accounts[accountIndex] = {
                    ...accounts[accountIndex],
                    status: 'connected'
                };
                storage.saveAutoreplyAccounts(accounts);
            }

            return true;
        } catch (error) {
            console.error('Token 重新整理失敗:', error);
            // 移除無效連接
            this.activeConnections.delete(accountId);
            return false;
        }
    }

    // 發送自動回覆訊息
    async sendAutoreply(accountId, message, recipientId = null) {
        const connection = this.activeConnections.get(accountId);
        if (!connection) {
            throw new Error('帳號未連接');
        }

        // 檢查速率限制
        this.rateLimiter.checkRateLimit(accountId, connection.platform);

        const platformConfig = this.platforms[connection.platform];
        
        return await this.errorHandler.retryApiCall(async () => {
            let response;
            
            switch (connection.platform) {
                case 'instagram':
                    response = await this.sendInstagramReply(connection, message, recipientId);
                    break;
                case 'facebook':
                    response = await this.sendFacebookReply(connection, message, recipientId);
                    break;
                case 'line':
                    response = await this.sendLineReply(connection, message, recipientId);
                    break;
                default:
                    throw new Error(`不支援的平台: ${connection.platform}`);
            }

            // 記錄成功發送
            this.rateLimiter.recordRequest(accountId, connection.platform);
            
            return {
                success: true,
                messageId: response.id,
                platform: connection.platform,
                timestamp: new Date().toISOString()
            };
        }, { accountId, platform: connection.platform, action: 'sendAutoreply' });
    }

    // 發送 Instagram 回覆
    async sendInstagramReply(connection, message, recipientId) {
        const endpoint = `${this.platforms.instagram.apiEndpoint}/me/media`;
        
        // 注意：Instagram API 限制較多，實際實現需要根據具體需求調整
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${connection.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                recipient_id: recipientId
            })
        });

        if (!response.ok) {
            throw new Error(`Instagram API 錯誤: ${response.status}`);
        }

        return await response.json();
    }

    // 發送 Facebook 回覆
    async sendFacebookReply(connection, message, recipientId) {
        const endpoint = `${this.platforms.facebook.apiEndpoint}/me/messages`;
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${connection.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                recipient: { id: recipientId },
                message: { text: message }
            })
        });

        if (!response.ok) {
            throw new Error(`Facebook API 錯誤: ${response.status}`);
        }

        return await response.json();
    }

    // 發送 LINE 回覆
    async sendLineReply(connection, message, recipientId) {
        const endpoint = `${this.platforms.line.apiEndpoint}/bot/message/push`;
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${connection.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: recipientId,
                messages: [{ type: 'text', text: message }]
            })
        });

        if (!response.ok) {
            throw new Error(`LINE API 錯誤: ${response.status}`);
        }

        return await response.json();
    }

    // 檢查速率限制


    // 斷開帳號連接
    async disconnectAccount(accountId) {
        this.activeConnections.delete(accountId);
        this.rateLimiter.clearAccountTracker(accountId);
        
        // 清除安全儲存的 Token
        await this.securityManager.clearSecureData(accountId);
        
        // 更新儲存中的帳號狀態
        const storage = new StorageManager();
        const accounts = storage.getAutoreplyAccounts();
        const accountIndex = accounts.findIndex(acc => acc.id === accountId);
        
        if (accountIndex !== -1) {
            accounts[accountIndex].status = 'disconnected';
            storage.saveAutoreplyAccounts(accounts);
        }
    }

    // 獲取連接狀態
    getConnectionStatus(accountId) {
        const connection = this.activeConnections.get(accountId);
        if (!connection) {
            return { connected: false, message: '未連接' };
        }

        if (connection.expiresAt && new Date(connection.expiresAt) <= new Date()) {
            return { connected: false, message: 'Token 已過期' };
        }

        return { connected: true, message: '已連接' };
    }

    // 工具方法
    generateState() {
        return Math.random().toString(36).substring(2, 15);
    }

    buildAuthUrl(platformConfig, state) {
        const params = new URLSearchParams({
            client_id: this.getClientId(platformConfig.name),
            redirect_uri: this.getRedirectUri(),
            scope: platformConfig.scopes.join(','),
            response_type: 'code',
            state: state
        });

        return `${platformConfig.authEndpoint}?${params.toString()}`;
    }

    getClientId(platform) {
        // 實際應用中，這些應該從環境變數或配置檔案中讀取
        const clientIds = {
            'Instagram': 'your_instagram_client_id',
            'Facebook': 'your_facebook_client_id',
            'LINE': 'your_line_client_id'
        };
        return clientIds[platform] || '';
    }

    getClientSecret(platform) {
        // 實際應用中，這些應該從環境變數或配置檔案中讀取
        const clientSecrets = {
            'Instagram': 'your_instagram_client_secret',
            'Facebook': 'your_facebook_client_secret',
            'LINE': 'your_line_client_secret'
        };
        return clientSecrets[platform] || '';
    }

    getRedirectUri() {
        // 實際應用中，這應該是您的應用程式回調 URL
        return window.location.origin + '/oauth-callback.html';
    }
}

// 全域 API 管理器實例
window.apiManager = new APIManager(); 