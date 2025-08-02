// 速率限制管理器 - 處理各平台 API 速率限制
class RateLimiter {
    constructor() {
        this.rateLimitTrackers = new Map();
        this.globalRateLimit = {
            requests: 1000,
            window: 3600, // 1小時
            currentRequests: 0,
            resetTime: Date.now() + 3600000
        };
    }

    // 檢查是否超過速率限制
    checkRateLimit(accountId, platform) {
        const tracker = this.getOrCreateTracker(accountId, platform);
        const now = Date.now();
        
        // 檢查是否需要重置計數器
        if (now >= tracker.resetTime) {
            this.resetTracker(tracker);
        }
        
        // 檢查是否超過限制
        if (tracker.currentRequests >= tracker.limit) {
            const remainingTime = Math.ceil((tracker.resetTime - now) / 1000);
            throw new Error(`速率限制已達上限，請等待 ${remainingTime} 秒後再試`);
        }
        
        // 檢查全域速率限制
        if (now >= this.globalRateLimit.resetTime) {
            this.resetGlobalRateLimit();
        }
        
        if (this.globalRateLimit.currentRequests >= this.globalRateLimit.requests) {
            const remainingTime = Math.ceil((this.globalRateLimit.resetTime - now) / 1000);
            throw new Error(`全域速率限制已達上限，請等待 ${remainingTime} 秒後再試`);
        }
        
        return true;
    }

    // 記錄 API 請求
    recordRequest(accountId, platform) {
        const tracker = this.getOrCreateTracker(accountId, platform);
        const now = Date.now();
        
        // 檢查是否需要重置計數器
        if (now >= tracker.resetTime) {
            this.resetTracker(tracker);
        }
        
        // 增加請求計數
        tracker.currentRequests++;
        tracker.lastRequestTime = now;
        
        // 更新全域計數
        if (now >= this.globalRateLimit.resetTime) {
            this.resetGlobalRateLimit();
        }
        this.globalRateLimit.currentRequests++;
        
        console.log(`📊 速率限制更新: ${platform} (${tracker.currentRequests}/${tracker.limit})`);
    }

    // 獲取或創建速率限制追蹤器
    getOrCreateTracker(accountId, platform) {
        const key = `${accountId}_${platform}`;
        
        if (!this.rateLimitTrackers.has(key)) {
            const platformConfig = this.getPlatformRateLimit(platform);
            const tracker = {
                accountId,
                platform,
                limit: platformConfig.requests,
                window: platformConfig.window,
                currentRequests: 0,
                resetTime: Date.now() + platformConfig.window * 1000,
                lastRequestTime: null
            };
            
            this.rateLimitTrackers.set(key, tracker);
        }
        
        return this.rateLimitTrackers.get(key);
    }

    // 重置追蹤器
    resetTracker(tracker) {
        tracker.currentRequests = 0;
        tracker.resetTime = Date.now() + tracker.window * 1000;
        console.log(`🔄 ${tracker.platform} 速率限制已重置`);
    }

    // 重置全域速率限制
    resetGlobalRateLimit() {
        this.globalRateLimit.currentRequests = 0;
        this.globalRateLimit.resetTime = Date.now() + this.globalRateLimit.window * 1000;
        console.log('🔄 全域速率限制已重置');
    }

    // 獲取平台速率限制配置
    getPlatformRateLimit(platform) {
        const configs = {
            instagram: {
                requests: 200,
                window: 3600 // 1小時
            },
            facebook: {
                requests: 200,
                window: 3600
            },
            line: {
                requests: 1000,
                window: 3600
            },
            twitter: {
                requests: 300,
                window: 900 // 15分鐘
            },
            telegram: {
                requests: 30,
                window: 1 // 1秒
            },
            whatsapp: {
                requests: 1000,
                window: 3600
            }
        };
        
        return configs[platform] || {
            requests: 100,
            window: 3600
        };
    }

    // 獲取剩餘請求次數
    getRemainingRequests(accountId, platform) {
        const tracker = this.getOrCreateTracker(accountId, platform);
        const now = Date.now();
        
        if (now >= tracker.resetTime) {
            this.resetTracker(tracker);
        }
        
        return {
            remaining: tracker.limit - tracker.currentRequests,
            resetTime: tracker.resetTime,
            platform: platform
        };
    }

    // 獲取全域剩餘請求次數
    getGlobalRemainingRequests() {
        const now = Date.now();
        
        if (now >= this.globalRateLimit.resetTime) {
            this.resetGlobalRateLimit();
        }
        
        return {
            remaining: this.globalRateLimit.requests - this.globalRateLimit.currentRequests,
            resetTime: this.globalRateLimit.resetTime
        };
    }

    // 等待速率限制重置
    async waitForReset(accountId, platform) {
        const tracker = this.getOrCreateTracker(accountId, platform);
        const now = Date.now();
        
        if (now < tracker.resetTime) {
            const waitTime = tracker.resetTime - now;
            console.log(`⏳ 等待速率限制重置，剩餘 ${Math.ceil(waitTime / 1000)} 秒`);
            
            return new Promise(resolve => {
                setTimeout(() => {
                    this.resetTracker(tracker);
                    resolve();
                }, waitTime);
            });
        }
        
        return Promise.resolve();
    }

    // 獲取速率限制狀態
    getRateLimitStatus(accountId = null) {
        const status = {
            global: this.getGlobalRemainingRequests(),
            platforms: {}
        };
        
        if (accountId) {
            // 獲取特定帳號的狀態
            const platforms = ['instagram', 'facebook', 'line', 'twitter', 'telegram', 'whatsapp'];
            platforms.forEach(platform => {
                try {
                    status.platforms[platform] = this.getRemainingRequests(accountId, platform);
                } catch (error) {
                    status.platforms[platform] = {
                        remaining: 0,
                        resetTime: Date.now(),
                        platform: platform
                    };
                }
            });
        } else {
            // 獲取所有追蹤器的狀態
            for (const [key, tracker] of this.rateLimitTrackers) {
                const [trackerAccountId, platform] = key.split('_');
                if (!status.platforms[platform]) {
                    status.platforms[platform] = {};
                }
                status.platforms[platform][trackerAccountId] = {
                    remaining: tracker.limit - tracker.currentRequests,
                    resetTime: tracker.resetTime,
                    platform: platform
                };
            }
        }
        
        return status;
    }

    // 清除特定帳號的速率限制追蹤
    clearAccountTracker(accountId) {
        const keysToRemove = [];
        
        for (const [key, tracker] of this.rateLimitTrackers) {
            if (tracker.accountId === accountId) {
                keysToRemove.push(key);
            }
        }
        
        keysToRemove.forEach(key => {
            this.rateLimitTrackers.delete(key);
        });
        
        console.log(`🗑️ 已清除帳號 ${accountId} 的速率限制追蹤`);
    }

    // 清除所有速率限制追蹤
    clearAllTrackers() {
        this.rateLimitTrackers.clear();
        this.resetGlobalRateLimit();
        console.log('🗑️ 已清除所有速率限制追蹤');
    }

    // 模擬 API 延遲（用於測試）
    async simulateApiDelay(platform) {
        const delays = {
            instagram: 1000,
            facebook: 800,
            line: 500,
            twitter: 1200,
            telegram: 200,
            whatsapp: 600
        };
        
        const delay = delays[platform] || 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    // 檢查是否需要延遲請求
    shouldDelayRequest(accountId, platform) {
        const tracker = this.getOrCreateTracker(accountId, platform);
        const now = Date.now();
        
        // 如果接近限制，增加延遲
        const usageRatio = tracker.currentRequests / tracker.limit;
        
        if (usageRatio > 0.8) {
            return true;
        }
        
        // 如果最近有請求，增加延遲
        if (tracker.lastRequestTime) {
            const timeSinceLastRequest = now - tracker.lastRequestTime;
            const minInterval = this.getMinRequestInterval(platform);
            
            if (timeSinceLastRequest < minInterval) {
                return true;
            }
        }
        
        return false;
    }

    // 獲取最小請求間隔
    getMinRequestInterval(platform) {
        const intervals = {
            instagram: 5000, // 5秒
            facebook: 3000,  // 3秒
            line: 1000,      // 1秒
            twitter: 2000,   // 2秒
            telegram: 100,   // 0.1秒
            whatsapp: 2000   // 2秒
        };
        
        return intervals[platform] || 1000;
    }

    // 計算建議的延遲時間
    calculateSuggestedDelay(accountId, platform) {
        const tracker = this.getOrCreateTracker(accountId, platform);
        const usageRatio = tracker.currentRequests / tracker.limit;
        const baseDelay = this.getMinRequestInterval(platform);
        
        // 根據使用率調整延遲
        if (usageRatio > 0.9) {
            return baseDelay * 3;
        } else if (usageRatio > 0.7) {
            return baseDelay * 2;
        } else if (usageRatio > 0.5) {
            return baseDelay * 1.5;
        }
        
        return baseDelay;
    }
}

// 匯出 RateLimiter
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RateLimiter;
} else {
    window.RateLimiter = RateLimiter;
} 