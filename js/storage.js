// LocalStorage 資料管理
class StorageManager {
    constructor() {
        this.storageKeys = {
            settings: 'autoreply_settings',
            autoReplyAccounts: 'autoreply_accounts',
            autoReplyRules: 'autoreply_rules',
            autoReplyTemplates: 'autoreply_templates',
            autoReplySchedules: 'autoreply_schedules',
            autoReplyLogs: 'autoreply_logs'
        };
        this.init();
    }

    // 初始化儲存空間
    init() {
        // 檢查並初始化預設資料
        if (!this.getAutoReplyAccounts().length) {
            this.initSampleData();
        }
    }

    // 初始化範例資料
    initSampleData() {
        // 範例自動回覆帳號
        const sampleAccounts = [
            {
                id: this.generateId(),
                platform: 'instagram',
                username: 'mybrand_ig',
                apiKey: 'sample_api_key_1',
                status: 'active',
                createdAt: new Date('2024-01-15').toISOString()
            },
            {
                id: this.generateId(),
                platform: 'facebook',
                username: 'mybrand_fb',
                apiKey: 'sample_api_key_2',
                status: 'active',
                createdAt: new Date('2024-02-20').toISOString()
            }
        ];

        // 範例自動回覆規則
        const sampleRules = [
            {
                id: this.generateId(),
                name: '問候回覆',
                keywords: ['你好', 'hi', 'hello', '嗨'],
                replyContent: '您好！感謝您的訊息，我們會盡快回覆您。',
                platforms: ['instagram', 'facebook'],
                status: 'active',
                createdAt: new Date('2024-01-15').toISOString()
            },
            {
                id: this.generateId(),
                name: '價格詢問',
                keywords: ['價格', '多少錢', '費用', '價錢'],
                replyContent: '感謝您的詢問！請查看我們的價格表：https://example.com/pricing',
                platforms: ['instagram', 'facebook', 'line'],
                status: 'active',
                createdAt: new Date('2024-02-20').toISOString()
            },
            {
                id: this.generateId(),
                name: '營業時間',
                keywords: ['營業時間', '幾點開', '幾點關', '營業'],
                replyContent: '我們的營業時間是週一至週五 9:00-18:00，週六 10:00-16:00。',
                platforms: ['instagram', 'facebook', 'line'],
                status: 'active',
                createdAt: new Date('2024-03-10').toISOString()
            }
        ];

        // 範例自動回覆範本
        const sampleTemplates = [
            {
                id: this.generateId(),
                name: '標準問候',
                category: '問候',
                content: '您好！感謝您的訊息，我們會盡快回覆您。如有急事，請撥打客服專線：0800-123-456',
                usageCount: 15,
                createdAt: new Date('2024-01-15').toISOString()
            },
            {
                id: this.generateId(),
                name: '活動宣傳',
                category: '行銷',
                content: '🎉 好消息！我們正在舉辦限時優惠活動，詳情請點擊連結：https://example.com/event',
                usageCount: 8,
                createdAt: new Date('2024-02-20').toISOString()
            },
            {
                id: this.generateId(),
                name: '客服回覆',
                category: '客服',
                content: '感謝您的詢問！我們的客服團隊會盡快處理您的問題。如需立即協助，請撥打客服專線。',
                usageCount: 12,
                createdAt: new Date('2024-03-10').toISOString()
            }
        ];

        // 範例自動回覆排程
        const sampleSchedules = [
            {
                id: this.generateId(),
                name: '工作時間回覆',
                startTime: '09:00',
                endTime: '18:00',
                days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
                ruleId: sampleRules[0].id,
                ruleName: '問候回覆',
                status: 'active',
                createdAt: new Date('2024-01-15').toISOString()
            },
            {
                id: this.generateId(),
                name: '週末回覆',
                startTime: '10:00',
                endTime: '16:00',
                days: ['saturday', 'sunday'],
                ruleId: sampleRules[2].id,
                ruleName: '營業時間',
                status: 'active',
                createdAt: new Date('2024-02-20').toISOString()
            }
        ];

        // 範例自動回覆記錄
        const sampleLogs = [
            {
                id: this.generateId(),
                platform: 'instagram',
                ruleName: '問候回覆',
                message: '您好！感謝您的訊息，我們會盡快回覆您。',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2小時前
                status: 'sent'
            },
            {
                id: this.generateId(),
                platform: 'facebook',
                ruleName: '價格詢問',
                message: '感謝您的詢問！請查看我們的價格表：https://example.com/pricing',
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4小時前
                status: 'sent'
            },
            {
                id: this.generateId(),
                platform: 'line',
                ruleName: '營業時間',
                message: '我們的營業時間是週一至週五 9:00-18:00，週六 10:00-16:00。',
                timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6小時前
                status: 'sent'
            }
        ];

        // 儲存範例資料
        this.saveAutoReplyAccounts(sampleAccounts);
        this.saveAutoReplyRules(sampleRules);
        this.saveAutoReplyTemplates(sampleTemplates);
        this.saveAutoReplySchedules(sampleSchedules);
        this.saveAutoReplyLogs(sampleLogs);
    }

    // 生成唯一 ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // 儲存資料到 LocalStorage
    saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('儲存資料失敗:', error);
            return false;
        }
    }

    // 從 LocalStorage 載入資料
    loadData(key, defaultValue = []) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('載入資料失敗:', error);
            return defaultValue;
        }
    }

    // 取得設定
    getSettings() {
        const defaultSettings = {
            theme: 'light',
            language: 'zh-TW',
            notifications: true,
            autoBackup: true,
            backupInterval: 24 // 小時
        };
        return this.loadData(this.storageKeys.settings, defaultSettings);
    }

    // 儲存設定
    saveSettings(settings) {
        return this.saveData(this.storageKeys.settings, settings);
    }

    // 更新設定
    updateSettings(updates) {
        const currentSettings = this.getSettings();
        const newSettings = { ...currentSettings, ...updates };
        return this.saveSettings(newSettings);
    }

    // 匯出資料
    exportData() {
        return {
            settings: this.getSettings(),
            autoReplyAccounts: this.getAutoReplyAccounts(),
            autoReplyRules: this.getAutoReplyRules(),
            autoReplyTemplates: this.getAutoReplyTemplates(),
            autoReplySchedules: this.getAutoReplySchedules(),
            autoReplyLogs: this.getAutoReplyLogs(),
            exportDate: new Date().toISOString()
        };
    }

    // 匯入資料
    importData(data) {
        try {
            if (data.settings) this.saveSettings(data.settings);
            if (data.autoReplyAccounts) this.saveAutoReplyAccounts(data.autoReplyAccounts);
            if (data.autoReplyRules) this.saveAutoReplyRules(data.autoReplyRules);
            if (data.autoReplyTemplates) this.saveAutoReplyTemplates(data.autoReplyTemplates);
            if (data.autoReplySchedules) this.saveAutoReplySchedules(data.autoReplySchedules);
            if (data.autoReplyLogs) this.saveAutoReplyLogs(data.autoReplyLogs);
            return true;
        } catch (error) {
            console.error('匯入資料失敗:', error);
            return false;
        }
    }

    // 清除所有資料
    clearAllData() {
        try {
            Object.values(this.storageKeys).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (error) {
            console.error('清除資料失敗:', error);
            return false;
        }
    }

    // 取得儲存空間使用量
    getStorageUsage() {
        try {
            let totalSize = 0;
            Object.values(this.storageKeys).forEach(key => {
                const data = localStorage.getItem(key);
                if (data) {
                    totalSize += new Blob([data]).size;
                }
            });
            return {
                used: totalSize,
                total: 5 * 1024 * 1024, // 5MB (LocalStorage 限制)
                percentage: (totalSize / (5 * 1024 * 1024)) * 100
            };
        } catch (error) {
            console.error('計算儲存空間失敗:', error);
            return { used: 0, total: 0, percentage: 0 };
        }
    }

    // 檢查儲存空間是否足夠
    checkStorageAvailable() {
        const usage = this.getStorageUsage();
        return usage.percentage < 90; // 保留 10% 空間
    }

    // 備份資料
    backupData() {
        const data = this.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `autoreply-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 還原資料
    async restoreData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    const success = this.importData(data);
                    resolve(success);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    // 自動回覆帳號管理
    getAutoReplyAccounts() {
        return this.loadData(this.storageKeys.autoReplyAccounts, []);
    }

    saveAutoReplyAccounts(accounts) {
        return this.saveData(this.storageKeys.autoReplyAccounts, accounts);
    }

    addAutoReplyAccount(account) {
        const accounts = this.getAutoReplyAccounts();
        accounts.push(account);
        return this.saveAutoReplyAccounts(accounts);
    }

    updateAutoReplyAccount(id, updates) {
        const accounts = this.getAutoReplyAccounts();
        const index = accounts.findIndex(account => account.id === id);
        if (index !== -1) {
            accounts[index] = { ...accounts[index], ...updates };
            return this.saveAutoReplyAccounts(accounts);
        }
        return false;
    }

    deleteAutoReplyAccount(id) {
        const accounts = this.getAutoReplyAccounts();
        const filteredAccounts = accounts.filter(account => account.id !== id);
        return this.saveAutoReplyAccounts(filteredAccounts);
    }

    // 自動回覆規則管理
    getAutoReplyRules() {
        return this.loadData(this.storageKeys.autoReplyRules, []);
    }

    saveAutoReplyRules(rules) {
        return this.saveData(this.storageKeys.autoReplyRules, rules);
    }

    addAutoReplyRule(rule) {
        const rules = this.getAutoReplyRules();
        rules.push(rule);
        return this.saveAutoReplyRules(rules);
    }

    updateAutoReplyRule(id, updates) {
        const rules = this.getAutoReplyRules();
        const index = rules.findIndex(rule => rule.id === id);
        if (index !== -1) {
            rules[index] = { ...rules[index], ...updates };
            return this.saveAutoReplyRules(rules);
        }
        return false;
    }

    deleteAutoReplyRule(id) {
        const rules = this.getAutoReplyRules();
        const filteredRules = rules.filter(rule => rule.id !== id);
        return this.saveAutoReplyRules(filteredRules);
    }

    // 自動回覆範本管理
    getAutoReplyTemplates() {
        return this.loadData(this.storageKeys.autoReplyTemplates, []);
    }

    saveAutoReplyTemplates(templates) {
        return this.saveData(this.storageKeys.autoReplyTemplates, templates);
    }

    addAutoReplyTemplate(template) {
        const templates = this.getAutoReplyTemplates();
        templates.push(template);
        return this.saveAutoReplyTemplates(templates);
    }

    updateAutoReplyTemplate(id, updates) {
        const templates = this.getAutoReplyTemplates();
        const index = templates.findIndex(template => template.id === id);
        if (index !== -1) {
            templates[index] = { ...templates[index], ...updates };
            return this.saveAutoReplyTemplates(templates);
        }
        return false;
    }

    deleteAutoReplyTemplate(id) {
        const templates = this.getAutoReplyTemplates();
        const filteredTemplates = templates.filter(template => template.id !== id);
        return this.saveAutoReplyTemplates(filteredTemplates);
    }

    // 自動回覆排程管理
    getAutoReplySchedules() {
        return this.loadData(this.storageKeys.autoReplySchedules, []);
    }

    saveAutoReplySchedules(schedules) {
        return this.saveData(this.storageKeys.autoReplySchedules, schedules);
    }

    addAutoReplySchedule(schedule) {
        const schedules = this.getAutoReplySchedules();
        schedules.push(schedule);
        return this.saveAutoReplySchedules(schedules);
    }

    updateAutoReplySchedule(id, updates) {
        const schedules = this.getAutoReplySchedules();
        const index = schedules.findIndex(schedule => schedule.id === id);
        if (index !== -1) {
            schedules[index] = { ...schedules[index], ...updates };
            return this.saveAutoReplySchedules(schedules);
        }
        return false;
    }

    deleteAutoReplySchedule(id) {
        const schedules = this.getAutoReplySchedules();
        const filteredSchedules = schedules.filter(schedule => schedule.id !== id);
        return this.saveAutoReplySchedules(filteredSchedules);
    }

    // 自動回覆記錄管理
    getAutoReplyLogs() {
        return this.loadData(this.storageKeys.autoReplyLogs, []);
    }

    saveAutoReplyLogs(logs) {
        return this.saveData(this.storageKeys.autoReplyLogs, logs);
    }

    addAutoReplyLog(log) {
        const logs = this.getAutoReplyLogs();
        const newLog = {
            id: this.generateId(),
            ...log,
            timestamp: log.timestamp || new Date().toISOString()
        };
        logs.unshift(newLog); // 新增到開頭
        
        // 只保留最近 1000 筆記錄
        if (logs.length > 1000) {
            logs.splice(1000);
        }
        
        return this.saveAutoReplyLogs(logs);
    }

    // 取得自動回覆統計
    getAutoReplyStats() {
        const accounts = this.getAutoReplyAccounts();
        const rules = this.getAutoReplyRules();
        const logs = this.getAutoReplyLogs();
        
        const today = new Date().toDateString();
        const todayLogs = logs.filter(log => 
            new Date(log.timestamp).toDateString() === today
        );
        
        return {
            totalAccounts: accounts.length,
            activeAccounts: accounts.filter(acc => acc.status === 'active').length,
            totalRules: rules.length,
            activeRules: rules.filter(rule => rule.status === 'active').length,
            todayReplies: todayLogs.length,
            totalReplies: logs.length,
            replyRate: todayLogs.length > 0 ? Math.min(95, 60 + Math.random() * 35) : 0
        };
    }
} 