// API 配置檔案
// 注意：實際使用時請將這些敏感資訊移到環境變數中

const API_CONFIG = {
    // Instagram API 配置
    instagram: {
        clientId: process.env.INSTAGRAM_CLIENT_ID || 'your_instagram_client_id',
        clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || 'your_instagram_client_secret',
        redirectUri: process.env.INSTAGRAM_REDIRECT_URI || 'http://localhost:8000/oauth-callback.html',
        scopes: ['basic', 'comments', 'relationships'],
        apiVersion: 'v12.0',
        rateLimit: {
            requests: 200,
            window: 3600 // 1小時
        }
    },

    // Facebook API 配置
    facebook: {
        clientId: process.env.FACEBOOK_CLIENT_ID || 'your_facebook_client_id',
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET || 'your_facebook_client_secret',
        redirectUri: process.env.FACEBOOK_REDIRECT_URI || 'http://localhost:8000/oauth-callback.html',
        scopes: ['pages_manage_posts', 'pages_read_engagement', 'pages_manage_metadata'],
        apiVersion: 'v18.0',
        rateLimit: {
            requests: 200,
            window: 3600
        }
    },

    // LINE API 配置
    line: {
        clientId: process.env.LINE_CLIENT_ID || 'your_line_client_id',
        clientSecret: process.env.LINE_CLIENT_SECRET || 'your_line_client_secret',
        redirectUri: process.env.LINE_REDIRECT_URI || 'http://localhost:8000/oauth-callback.html',
        scopes: ['profile', 'openid', 'chat_message.write'],
        apiVersion: 'v2',
        rateLimit: {
            requests: 1000,
            window: 3600
        }
    },

    // Twitter API 配置
    twitter: {
        clientId: process.env.TWITTER_CLIENT_ID || 'your_twitter_client_id',
        clientSecret: process.env.TWITTER_CLIENT_SECRET || 'your_twitter_client_secret',
        redirectUri: process.env.TWITTER_REDIRECT_URI || 'http://localhost:8000/oauth-callback.html',
        scopes: ['tweet.read', 'tweet.write', 'users.read'],
        apiVersion: 'v2',
        rateLimit: {
            requests: 300,
            window: 900 // 15分鐘
        }
    },

    // Telegram Bot API 配置
    telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN || 'your_telegram_bot_token',
        apiVersion: 'v6',
        rateLimit: {
            requests: 30,
            window: 1 // 1秒
        }
    },

    // WhatsApp Business API 配置
    whatsapp: {
        accessToken: process.env.WHATSAPP_ACCESS_TOKEN || 'your_whatsapp_access_token',
        phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || 'your_whatsapp_phone_number_id',
        apiVersion: 'v17.0',
        rateLimit: {
            requests: 1000,
            window: 3600
        }
    }
};

// 平台支援狀態
const PLATFORM_SUPPORT = {
    instagram: {
        name: 'Instagram',
        icon: '📷',
        supported: true,
        features: ['comments', 'direct_messages', 'stories'],
        limitations: ['API 限制較嚴格', '需要商業帳號']
    },
    facebook: {
        name: 'Facebook',
        icon: '📘',
        supported: true,
        features: ['page_posts', 'comments', 'messenger'],
        limitations: ['需要頁面管理權限']
    },
    line: {
        name: 'LINE',
        icon: '💬',
        supported: true,
        features: ['messaging', 'rich_menu', 'flex_messages'],
        limitations: ['需要 LINE Bot 帳號']
    },
    twitter: {
        name: 'Twitter',
        icon: '🐦',
        supported: true,
        features: ['tweets', 'direct_messages', 'mentions'],
        limitations: ['API 付費限制', '需要開發者帳號']
    },
    telegram: {
        name: 'Telegram',
        icon: '📱',
        supported: true,
        features: ['bot_messages', 'channel_posts', 'group_chats'],
        limitations: ['需要 Bot Token']
    },
    whatsapp: {
        name: 'WhatsApp',
        icon: '📞',
        supported: true,
        features: ['business_messaging', 'media_sharing'],
        limitations: ['需要商業 API 帳號', '付費服務']
    }
};

// 安全配置
const SECURITY_CONFIG = {
    // Token 加密設定
    tokenEncryption: {
        algorithm: 'AES-256-GCM',
        keyLength: 32,
        ivLength: 16
    },

    // 會話管理
    session: {
        timeout: 3600000, // 1小時
        refreshThreshold: 300000 // 5分鐘前重新整理
    },

    // 速率限制
    globalRateLimit: {
        requests: 1000,
        window: 3600
    },

    // 錯誤處理
    errorHandling: {
        maxRetries: 3,
        retryDelay: 1000,
        exponentialBackoff: true
    }
};

// 開發環境配置
const DEV_CONFIG = {
    // 模擬模式
    simulationMode: {
        enabled: true, // 預設啟用模擬模式
        delay: 1000, // 模擬 API 延遲
        successRate: 0.95 // 模擬成功率
    },

    // 除錯模式
    debug: {
        enabled: false,
        logLevel: 'info', // 'debug', 'info', 'warn', 'error'
        logApiCalls: true
    },

    // 測試配置
    testing: {
        mockData: true,
        mockDelay: 500
    }
};

// 匯出配置
if (typeof module !== 'undefined' && module.exports) {
    // Node.js 環境
    module.exports = {
        API_CONFIG,
        PLATFORM_SUPPORT,
        SECURITY_CONFIG,
        DEV_CONFIG
    };
} else {
    // 瀏覽器環境
    window.API_CONFIG = API_CONFIG;
    window.PLATFORM_SUPPORT = PLATFORM_SUPPORT;
    window.SECURITY_CONFIG = SECURITY_CONFIG;
    window.DEV_CONFIG = DEV_CONFIG;
} 