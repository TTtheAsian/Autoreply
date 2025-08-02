// 錯誤處理器 - 處理 API 錯誤和重試機制
class ErrorHandler {
    constructor() {
        this.errorLog = [];
        this.retryConfig = {
            maxRetries: 3,
            baseDelay: 1000,
            maxDelay: 10000,
            exponentialBackoff: true
        };
        this.errorTypes = {
            NETWORK_ERROR: 'NETWORK_ERROR',
            RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
            AUTH_ERROR: 'AUTH_ERROR',
            API_ERROR: 'API_ERROR',
            VALIDATION_ERROR: 'VALIDATION_ERROR',
            UNKNOWN_ERROR: 'UNKNOWN_ERROR'
        };
    }

    // 處理 API 錯誤
    async handleApiError(error, context = {}) {
        const errorInfo = this.analyzeError(error);
        this.logError(errorInfo, context);

        // 根據錯誤類型決定處理策略
        switch (errorInfo.type) {
            case this.errorTypes.RATE_LIMIT_ERROR:
                return await this.handleRateLimitError(errorInfo, context);
            case this.errorTypes.AUTH_ERROR:
                return await this.handleAuthError(errorInfo, context);
            case this.errorTypes.NETWORK_ERROR:
                return await this.handleNetworkError(errorInfo, context);
            case this.errorTypes.API_ERROR:
                return await this.handleApiError(errorInfo, context);
            default:
                return await this.handleUnknownError(errorInfo, context);
        }
    }

    // 分析錯誤類型
    analyzeError(error) {
        const errorInfo = {
            message: error.message || '未知錯誤',
            type: this.errorTypes.UNKNOWN_ERROR,
            statusCode: null,
            retryable: false,
            timestamp: new Date().toISOString()
        };

        // 檢查網路錯誤
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorInfo.type = this.errorTypes.NETWORK_ERROR;
            errorInfo.retryable = true;
        }

        // 檢查 HTTP 狀態碼
        if (error.status) {
            errorInfo.statusCode = error.status;
            
            switch (error.status) {
                case 401:
                case 403:
                    errorInfo.type = this.errorTypes.AUTH_ERROR;
                    errorInfo.retryable = false;
                    break;
                case 429:
                    errorInfo.type = this.errorTypes.RATE_LIMIT_ERROR;
                    errorInfo.retryable = true;
                    break;
                case 400:
                case 422:
                    errorInfo.type = this.errorTypes.VALIDATION_ERROR;
                    errorInfo.retryable = false;
                    break;
                case 500:
                case 502:
                case 503:
                case 504:
                    errorInfo.type = this.errorTypes.API_ERROR;
                    errorInfo.retryable = true;
                    break;
                default:
                    errorInfo.type = this.errorTypes.API_ERROR;
                    errorInfo.retryable = error.status >= 500;
            }
        }

        // 檢查特定錯誤訊息
        if (error.message.includes('rate limit') || error.message.includes('quota')) {
            errorInfo.type = this.errorTypes.RATE_LIMIT_ERROR;
            errorInfo.retryable = true;
        }

        if (error.message.includes('unauthorized') || error.message.includes('invalid token')) {
            errorInfo.type = this.errorTypes.AUTH_ERROR;
            errorInfo.retryable = false;
        }

        return errorInfo;
    }

    // 處理速率限制錯誤
    async handleRateLimitError(errorInfo, context) {
        console.warn('⚠️ 速率限制錯誤:', errorInfo.message);
        
        // 通知用戶
        this.showUserNotification('速率限制已達上限，請稍後再試', 'warning');
        
        // 等待一段時間後重試
        const waitTime = this.extractWaitTimeFromError(errorInfo.message) || 60000; // 預設 1 分鐘
        await this.wait(waitTime);
        
        return {
            success: false,
            error: errorInfo,
            shouldRetry: true,
            retryAfter: waitTime
        };
    }

    // 處理認證錯誤
    async handleAuthError(errorInfo, context) {
        console.error('🔐 認證錯誤:', errorInfo.message);
        
        // 通知用戶需要重新認證
        this.showUserNotification('認證已過期，請重新登入', 'error');
        
        // 清除相關的認證資料
        if (context.accountId) {
            await this.clearAuthData(context.accountId);
        }
        
        return {
            success: false,
            error: errorInfo,
            shouldRetry: false,
            requiresReauth: true
        };
    }

    // 處理網路錯誤
    async handleNetworkError(errorInfo, context) {
        console.warn('🌐 網路錯誤:', errorInfo.message);
        
        // 通知用戶
        this.showUserNotification('網路連接問題，正在重試...', 'warning');
        
        return {
            success: false,
            error: errorInfo,
            shouldRetry: true,
            retryAfter: this.retryConfig.baseDelay
        };
    }

    // 處理 API 錯誤
    async handleApiError(errorInfo, context) {
        console.error('🔧 API 錯誤:', errorInfo.message);
        
        // 通知用戶
        this.showUserNotification('服務暫時不可用，正在重試...', 'warning');
        
        return {
            success: false,
            error: errorInfo,
            shouldRetry: errorInfo.retryable,
            retryAfter: this.retryConfig.baseDelay
        };
    }

    // 處理未知錯誤
    async handleUnknownError(errorInfo, context) {
        console.error('❓ 未知錯誤:', errorInfo.message);
        
        // 通知用戶
        this.showUserNotification('發生未知錯誤，請稍後再試', 'error');
        
        return {
            success: false,
            error: errorInfo,
            shouldRetry: false
        };
    }

    // 帶重試的 API 調用
    async retryApiCall(apiCall, context = {}) {
        let lastError;
        
        for (let attempt = 1; attempt <= this.retryConfig.maxRetries; attempt++) {
            try {
                const result = await apiCall();
                return result;
            } catch (error) {
                lastError = error;
                const errorInfo = this.analyzeError(error);
                
                console.log(`🔄 重試 ${attempt}/${this.retryConfig.maxRetries}:`, errorInfo.message);
                
                // 如果錯誤不可重試，直接拋出
                if (!errorInfo.retryable) {
                    throw error;
                }
                
                // 如果是最後一次嘗試，拋出錯誤
                if (attempt === this.retryConfig.maxRetries) {
                    throw error;
                }
                
                // 計算延遲時間
                const delay = this.calculateRetryDelay(attempt);
                console.log(`⏳ 等待 ${delay}ms 後重試`);
                await this.wait(delay);
            }
        }
        
        throw lastError;
    }

    // 計算重試延遲
    calculateRetryDelay(attempt) {
        if (this.retryConfig.exponentialBackoff) {
            const delay = this.retryConfig.baseDelay * Math.pow(2, attempt - 1);
            return Math.min(delay, this.retryConfig.maxDelay);
        } else {
            return this.retryConfig.baseDelay;
        }
    }

    // 從錯誤訊息中提取等待時間
    extractWaitTimeFromError(message) {
        const waitTimeMatch = message.match(/(\d+)\s*秒/);
        if (waitTimeMatch) {
            return parseInt(waitTimeMatch[1]) * 1000;
        }
        
        const minuteMatch = message.match(/(\d+)\s*分鐘/);
        if (minuteMatch) {
            return parseInt(minuteMatch[1]) * 60 * 1000;
        }
        
        return null;
    }

    // 清除認證資料
    async clearAuthData(accountId) {
        try {
            // 清除安全儲存的 Token
            if (window.securityManager) {
                await window.securityManager.clearSecureData(accountId);
            }
            
            // 清除 API 管理器中的連接
            if (window.apiManager) {
                await window.apiManager.disconnectAccount(accountId);
            }
            
            console.log(`🗑️ 已清除帳號 ${accountId} 的認證資料`);
        } catch (error) {
            console.error('清除認證資料失敗:', error);
        }
    }

    // 顯示用戶通知
    showUserNotification(message, type = 'info') {
        // 如果應用程式有通知系統，使用它
        if (window.app && window.app.showNotification) {
            window.app.showNotification(message, type);
        } else {
            // 否則使用瀏覽器原生通知
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }

    // 記錄錯誤
    logError(errorInfo, context) {
        const logEntry = {
            ...errorInfo,
            context,
            timestamp: new Date().toISOString()
        };
        
        this.errorLog.push(logEntry);
        
        // 限制錯誤日誌大小
        if (this.errorLog.length > 100) {
            this.errorLog = this.errorLog.slice(-50);
        }
        
        // 儲存到 LocalStorage
        try {
            localStorage.setItem('error_log', JSON.stringify(this.errorLog));
        } catch (error) {
            console.warn('無法儲存錯誤日誌:', error);
        }
    }

    // 獲取錯誤日誌
    getErrorLog(limit = 50) {
        return this.errorLog.slice(-limit);
    }

    // 清除錯誤日誌
    clearErrorLog() {
        this.errorLog = [];
        localStorage.removeItem('error_log');
    }

    // 獲取錯誤統計
    getErrorStats() {
        const stats = {
            total: this.errorLog.length,
            byType: {},
            byDate: {},
            recent: this.errorLog.slice(-10)
        };
        
        this.errorLog.forEach(entry => {
            // 按類型統計
            stats.byType[entry.type] = (stats.byType[entry.type] || 0) + 1;
            
            // 按日期統計
            const date = entry.timestamp.split('T')[0];
            stats.byDate[date] = (stats.byDate[date] || 0) + 1;
        });
        
        return stats;
    }

    // 工具方法：等待
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 驗證 API 回應
    validateApiResponse(response) {
        if (!response) {
            throw new Error('API 回應為空');
        }
        
        if (!response.ok) {
            const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
            error.status = response.status;
            throw error;
        }
        
        return response;
    }

    // 處理 API 回應
    async handleApiResponse(response) {
        try {
            this.validateApiResponse(response);
            return await response.json();
        } catch (error) {
            if (error.status) {
                throw error;
            }
            throw new Error('無法解析 API 回應');
        }
    }

    // 設定重試配置
    setRetryConfig(config) {
        this.retryConfig = { ...this.retryConfig, ...config };
    }

    // 獲取當前配置
    getRetryConfig() {
        return { ...this.retryConfig };
    }
}

// 匯出 ErrorHandler
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandler;
} else {
    window.ErrorHandler = ErrorHandler;
} 