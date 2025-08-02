// Autoreply 主要應用程式
class AutoreplyTool {
    constructor() {
        this.currentPage = 'dashboard';
    }

    async init() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupEventListeners();
        
        // 初始化 API 管理器
        try {
            await window.apiManager.init();
            console.log('✅ API 管理器初始化完成');
        } catch (error) {
            console.warn('⚠️ API 管理器初始化失敗:', error);
        }
        
        // 設定初始按鈕狀態
        this.setupInitialButtonState();
        
        this.loadDashboardData();
    }

    // 設定初始按鈕狀態
    setupInitialButtonState() {
        const storage = new StorageManager();
        const accounts = storage.getAutoreplyAccounts();
        const rules = storage.getAutoreplyRules();
        const hasData = accounts.length > 0 || rules.length > 0;
        
        const loadSampleBtn = document.getElementById('load-sample-btn');
        const clearDataBtn = document.getElementById('clear-data-btn');
        
        if (loadSampleBtn) {
            loadSampleBtn.style.display = hasData ? 'none' : 'inline-block';
        }
        if (clearDataBtn) {
            clearDataBtn.style.display = hasData ? 'inline-block' : 'none';
        }
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageName = link.getAttribute('data-page');
                this.navigateToPage(pageName);
            });
        });

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    navigateToPage(pageName) {
        // 隱藏所有頁面
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));

        // 移除所有導航連結的 active 狀態
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));

        // 顯示目標頁面
        const targetPage = document.getElementById(pageName);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // 設定導航連結的 active 狀態
        const activeLink = document.querySelector(`[data-page="${pageName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        this.currentPage = pageName;
        this.loadPageData(pageName);
    }

    loadPageData(pageName) {
        switch (pageName) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'auto-reply':
                this.loadAutoreplyData();
                break;
        }
    }

    // 載入儀表板資料
    loadDashboardData() {
        const storage = new StorageManager();
        
        // 取得自動回覆統計資料
        const accounts = storage.getAutoreplyAccounts();
        const rules = storage.getAutoreplyRules();
        const logs = storage.getAutoreplyLogs();

        // 檢查是否有資料
        const hasData = accounts.length > 0 || rules.length > 0 || logs.length > 0;
        
        if (!hasData) {
            this.showEmptyState();
            return;
        }

        // 更新儀表板數字
        document.getElementById('connected-accounts').textContent = accounts.length;
        document.getElementById('active-rules').textContent = rules.filter(r => r.status === 'active').length;
        
        // 計算今日回覆數
        const today = new Date().toDateString();
        const todayReplies = logs.filter(log => 
            new Date(log.timestamp).toDateString() === today
        ).length;
        document.getElementById('today-replies').textContent = todayReplies;
        
        // 計算回覆率（模擬數據）
        const replyRate = todayReplies > 0 ? Math.min(95, 60 + Math.random() * 35) : 0;
        document.getElementById('reply-rate').textContent = `${Math.round(replyRate)}%`;
        
        // 更新趨勢顯示
        document.getElementById('accounts-trend').textContent = accounts.length > 0 ? '+2 本月' : '開始新增';
        document.getElementById('rules-trend').textContent = rules.length > 0 ? '5 個待處理' : '開始建立';
        document.getElementById('replies-trend').textContent = todayReplies > 0 ? '+15% 較昨日' : '開始回覆';
        document.getElementById('rate-trend').textContent = replyRate > 0 ? '+5% 成長率' : '開始追蹤';
        
        // 載入最近活動
        this.loadRecentActivities();
        
        // 載入系統通知
        this.loadSystemNotifications();
    }

    // 顯示空狀態
    showEmptyState() {
        // 隱藏統計卡片
        const dashboardGrid = document.querySelector('.dashboard-grid');
        if (dashboardGrid) {
            dashboardGrid.style.display = 'none';
        }

        // 隱藏主要內容區域
        const dashboardMain = document.querySelector('.dashboard-main');
        if (dashboardMain) {
            dashboardMain.style.display = 'none';
        }

        // 顯示空狀態訊息
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <div class="empty-state-content">
                    <div class="empty-state-icon">🤖</div>
                    <h3>歡迎使用 Autoreply！</h3>
                    <p>您還沒有任何資料。請開始建立您的第一個自動回覆規則，或載入範例資料來體驗功能。</p>
                    <div class="empty-state-actions">
                        <button class="btn btn-primary" onclick="showAddAccountModal()">
                            📱 新增第一個帳號
                        </button>
                        <button class="btn btn-secondary" onclick="loadSampleData()">
                            🧪 載入範例資料
                        </button>
                    </div>
                </div>
            `;
            pageHeader.appendChild(emptyState);
        }
    }

    // 清除空狀態並顯示正常內容
    clearEmptyState() {
        // 移除空狀態元素
        const emptyState = document.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }

        // 顯示統計卡片
        const dashboardGrid = document.querySelector('.dashboard-grid');
        if (dashboardGrid) {
            dashboardGrid.style.display = 'grid';
        }

        // 顯示主要內容區域
        const dashboardMain = document.querySelector('.dashboard-main');
        if (dashboardMain) {
            dashboardMain.style.display = 'block';
        }
    }

    // 載入最近活動
    loadRecentActivities() {
        const storage = new StorageManager();
        const accounts = storage.getAutoreplyAccounts();
        const rules = storage.getAutoreplyRules();
        const logs = storage.getAutoreplyLogs();
        
        // 合併所有活動並按時間排序
        const activities = [];
        
        // 新增帳號活動
        accounts.slice(0, 3).forEach(account => {
            activities.push({
                type: 'account',
                icon: '📱',
                title: '帳號連接',
                description: `${account.platform} 帳號已連接`,
                time: account.createdAt
            });
        });
        
        // 新增規則活動
        rules.slice(0, 3).forEach(rule => {
            activities.push({
                type: 'rule',
                icon: '🤖',
                title: '規則建立',
                description: `規則「${rule.name}」已建立`,
                time: rule.createdAt
            });
        });
        
        // 新增回覆記錄
        logs.slice(0, 5).forEach(log => {
            activities.push({
                type: 'reply',
                icon: '💬',
                title: '自動回覆',
                description: `回覆了 ${log.platform} 訊息`,
                time: log.timestamp
            });
        });
        
        // 按時間排序並只取最近 8 個
        activities.sort((a, b) => new Date(b.time) - new Date(a.time));
        const recentActivities = activities.slice(0, 8);
        
        const container = document.getElementById('recent-activities-list');
        if (!container) return;
        
        if (recentActivities.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); font-size: 0.875rem; padding: var(--spacing-md);">尚無活動記錄</p>';
            return;
        }
        
        container.innerHTML = recentActivities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-content">
                    <h5>${activity.title}</h5>
                    <p>${activity.description}</p>
                </div>
                <div class="activity-time">${this.formatTime(activity.time)}</div>
            </div>
        `).join('');
    }

    // 載入系統通知
    loadSystemNotifications() {
        const storage = new StorageManager();
        const accounts = storage.getAutoreplyAccounts();
        const rules = storage.getAutoreplyRules();
        
        // 檢查是否有實際資料，如果沒有則不顯示模擬通知
        const hasData = accounts.length > 0 || rules.length > 0;
        
        let notifications = [];
        
        if (hasData) {
            // 只有在有實際資料時才顯示系統通知
            notifications = [
                {
                    type: 'info',
                    icon: 'ℹ️',
                    title: '系統更新',
                    description: '新版本已發布，包含效能優化',
                    time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2小時前
                },
                {
                    type: 'warning',
                    icon: '⚠️',
                    title: '資料備份提醒',
                    description: '建議定期備份重要資料',
                    time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4小時前
                },
                {
                    type: 'success',
                    icon: '✅',
                    title: '自動回覆啟用',
                    description: 'Instagram 自動回覆功能已啟用',
                    time: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6小時前
                }
            ];
        }
        
        const container = document.getElementById('notifications-list');
        if (!container) return;
        
        if (notifications.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); font-size: 0.875rem; padding: var(--spacing-md);">尚無系統通知</p>';
            return;
        }
        
        container.innerHTML = notifications.map(notification => `
            <div class="notification-item">
                <div class="notification-icon">${notification.icon}</div>
                <div class="notification-content">
                    <h5>${notification.title}</h5>
                    <p>${notification.description}</p>
                </div>
                <div class="notification-time">${this.formatTime(notification.time)}</div>
            </div>
        `).join('');
    }

    // 格式化時間
    formatTime(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now - time;
        
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (minutes < 60) {
            return `${minutes}分鐘前`;
        } else if (hours < 24) {
            return `${hours}小時前`;
        } else if (days < 7) {
            return `${days}天前`;
        } else {
            return time.toLocaleDateString();
        }
    }

    // 載入自動回覆資料
    loadAutoreplyData() {
        this.loadAutoreplyAccounts();
        this.loadAutoreplyRules();
        this.loadAutoreplyTemplates();
        this.loadAutoreplySchedules();
        this.loadAutoreplyAnalytics();
    }

    // 載入自動回覆帳號
    loadAutoreplyAccounts() {
        const storage = new StorageManager();
        const accounts = storage.getAutoreplyAccounts();
        
        const container = document.getElementById('accounts-list');
        if (!container) return;
        
        if (accounts.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="min-height: 200px;">
                    <div class="empty-state-content">
                        <div class="empty-state-icon">📱</div>
                        <h3>尚無連接的帳號</h3>
                        <p>您還沒有連接任何社群平台帳號。請點擊下方按鈕開始新增您的第一個帳號。</p>
                        <div class="empty-state-actions">
                            <button class="btn btn-primary" onclick="showAddAccountModal()">
                                📱 新增帳號
                            </button>
                        </div>
                    </div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = accounts.map(account => {
            const connectionStatus = window.apiManager.getConnectionStatus(account.id);
            const statusClass = connectionStatus.connected ? 'connected' : 'disconnected';
            const statusText = connectionStatus.connected ? '已連接' : '未連接';
            
            return `
                <div class="account-item">
                    <div class="account-info">
                        <div class="account-icon">${this.getPlatformIcon(account.platform)}</div>
                        <div class="account-details">
                            <h4>${account.username}</h4>
                            <p>${account.platform} • ${statusText}</p>
                            ${account.accessToken ? `<p class="connection-info">🔗 API 已連接</p>` : ''}
                        </div>
                    </div>
                    <div class="account-actions">
                        ${!connectionStatus.connected ? 
                            `<button class="btn btn-sm btn-success" onclick="connectAccount('${account.id}')">
                                🔗 連接
                            </button>` : 
                            `<button class="btn btn-sm btn-warning" onclick="disconnectAccount('${account.id}')">
                                🔌 斷開
                            </button>`
                        }
                        <button class="btn btn-sm btn-outline" onclick="editAccount('${account.id}')">
                            編輯
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteAccount('${account.id}')">
                            刪除
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // 載入自動回覆規則
    loadAutoreplyRules() {
        const storage = new StorageManager();
        const rules = storage.getAutoreplyRules();
        
        const container = document.getElementById('rules-list');
        if (!container) return;
        
        if (rules.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="min-height: 200px;">
                    <div class="empty-state-content">
                        <div class="empty-state-icon">🤖</div>
                        <h3>尚無回覆規則</h3>
                        <p>您還沒有建立任何自動回覆規則。請點擊下方按鈕開始建立您的第一個規則。</p>
                        <div class="empty-state-actions">
                            <button class="btn btn-primary" onclick="showAddRuleModal()">
                                🤖 新增規則
                            </button>
                        </div>
                    </div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = rules.map(rule => `
            <div class="rule-item">
                <div class="rule-header">
                    <div class="rule-info">
                        <h4>${rule.name}</h4>
                        <p>關鍵字: ${rule.keywords.join(', ')}</p>
                    </div>
                    <div class="rule-status">
                        <span class="status-badge ${rule.status}">${rule.status === 'active' ? '啟用' : '停用'}</span>
                    </div>
                </div>
                <div class="rule-content">
                    <p><strong>回覆內容:</strong> ${rule.replyContent.substring(0, 100)}${rule.replyContent.length > 100 ? '...' : ''}</p>
                    <p><strong>適用平台:</strong> ${rule.platforms.join(', ')}</p>
                </div>
                <div class="rule-actions">
                    <button class="btn btn-sm ${rule.status === 'active' ? 'btn-warning' : 'btn-success'}" 
                            onclick="toggleRuleStatus('${rule.id}')">
                        ${rule.status === 'active' ? '停用' : '啟用'}
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="editRule('${rule.id}')">
                        編輯
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteRule('${rule.id}')">
                        刪除
                    </button>
                </div>
            </div>
        `).join('');
    }

    // 載入自動回覆範本
    loadAutoreplyTemplates() {
        const storage = new StorageManager();
        const templates = storage.getAutoreplyTemplates();
        
        const container = document.getElementById('templates-list');
        if (!container) return;
        
        if (templates.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="min-height: 200px;">
                    <div class="empty-state-content">
                        <div class="empty-state-icon">📝</div>
                        <h3>尚無回覆範本</h3>
                        <p>您還沒有建立任何回覆範本。請點擊下方按鈕開始建立您的第一個範本。</p>
                        <div class="empty-state-actions">
                            <button class="btn btn-primary" onclick="showAddTemplateModal()">
                                📝 新增範本
                            </button>
                        </div>
                    </div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = templates.map(template => `
            <div class="template-item">
                <div class="template-header">
                    <div class="template-info">
                        <h4>${template.name}</h4>
                        <p>分類: ${template.category}</p>
                    </div>
                    <div class="template-usage">
                        <span class="usage-count">使用 ${template.usageCount} 次</span>
                    </div>
                </div>
                <div class="template-content">
                    <p>${template.content.substring(0, 150)}${template.content.length > 150 ? '...' : ''}</p>
                </div>
                <div class="template-actions">
                    <button class="btn btn-sm btn-primary" onclick="useTemplate('${template.id}')">
                        使用
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="editTemplate('${template.id}')">
                        編輯
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTemplate('${template.id}')">
                        刪除
                    </button>
                </div>
            </div>
        `).join('');
    }

    // 載入自動回覆排程
    loadAutoreplySchedules() {
        const storage = new StorageManager();
        const schedules = storage.getAutoreplySchedules();
        
        const container = document.getElementById('schedule-list');
        if (!container) return;
        
        if (schedules.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="min-height: 200px;">
                    <div class="empty-state-content">
                        <div class="empty-state-icon">⏰</div>
                        <h3>尚無排程設定</h3>
                        <p>您還沒有設定任何自動回覆排程。請點擊下方按鈕開始設定您的第一個排程。</p>
                        <div class="empty-state-actions">
                            <button class="btn btn-primary" onclick="showAddScheduleModal()">
                                ⏰ 新增排程
                            </button>
                        </div>
                    </div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = schedules.map(schedule => `
            <div class="schedule-item">
                <div class="schedule-header">
                    <div class="schedule-info">
                        <h4>${schedule.name}</h4>
                        <p>${schedule.startTime} - ${schedule.endTime}</p>
                    </div>
                    <div class="schedule-status">
                        <span class="status-badge ${schedule.status}">${schedule.status === 'active' ? '啟用' : '停用'}</span>
                    </div>
                </div>
                <div class="schedule-content">
                    <p><strong>適用日期:</strong> ${schedule.days.join(', ')}</p>
                    <p><strong>回覆規則:</strong> ${schedule.ruleName}</p>
                </div>
                <div class="schedule-actions">
                    <button class="btn btn-sm ${schedule.status === 'active' ? 'btn-warning' : 'btn-success'}" 
                            onclick="toggleScheduleStatus('${schedule.id}')">
                        ${schedule.status === 'active' ? '停用' : '啟用'}
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="editSchedule('${schedule.id}')">
                        編輯
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteSchedule('${schedule.id}')">
                        刪除
                    </button>
                </div>
            </div>
        `).join('');
    }

    // 載入自動回覆統計
    loadAutoreplyAnalytics() {
        const storage = new StorageManager();
        const logs = storage.getAutoreplyLogs();
        
        // 更新詳細統計
        const accounts = storage.getAutoreplyAccounts();
        const rules = storage.getAutoreplyRules();
        
        document.getElementById('connected-accounts-detail').textContent = accounts.length;
        document.getElementById('active-rules-detail').textContent = rules.filter(r => r.status === 'active').length;
        
        // 計算今日回覆數
        const today = new Date().toDateString();
        const todayReplies = logs.filter(log => 
            new Date(log.timestamp).toDateString() === today
        ).length;
        document.getElementById('today-replies-detail').textContent = todayReplies;
        
        // 計算回覆率
        const replyRate = todayReplies > 0 ? Math.min(95, 60 + Math.random() * 35) : 0;
        document.getElementById('reply-rate-detail').textContent = `${Math.round(replyRate)}%`;
        
        // 載入最近回覆記錄
        this.loadRecentReplies();
    }

    // 載入最近回覆記錄
    loadRecentReplies() {
        const storage = new StorageManager();
        const logs = storage.getAutoreplyLogs();
        
        const container = document.getElementById('recent-replies-list');
        if (!container) return;
        
        const recentLogs = logs.slice(0, 10);
        
        if (recentLogs.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: var(--spacing-lg);">尚無回覆記錄</p>';
            return;
        }
        
        container.innerHTML = recentLogs.map(log => `
            <div class="reply-item">
                <div class="reply-icon">${this.getPlatformIcon(log.platform)}</div>
                <div class="reply-content">
                    <h5>${log.platform} 回覆</h5>
                    <p>${log.message.substring(0, 50)}${log.message.length > 50 ? '...' : ''}</p>
                </div>
                <div class="reply-time">${this.formatTime(log.timestamp)}</div>
            </div>
        `).join('');
    }

    // 取得平台圖示
    getPlatformIcon(platform) {
        const icons = {
            'instagram': '📷',
            'facebook': '📘',
            'twitter': '🐦',
            'line': '💬',
            'telegram': '📱',
            'whatsapp': '📞'
        };
        return icons[platform.toLowerCase()] || '📱';
    }

    setupEventListeners() {
        // 全域事件監聽器
        document.addEventListener('DOMContentLoaded', () => {
            this.init();
        });

        // 鍵盤快捷鍵
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        this.navigateToPage('dashboard');
                        break;
                    case '2':
                        e.preventDefault();
                        this.navigateToPage('auto-reply');
                        break;
                }
            }
        });
    }

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        const container = document.getElementById('notification-container');
        container.appendChild(notification);

        // 顯示動畫
        setTimeout(() => notification.classList.add('show'), 100);

        // 關閉按鈕事件
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.hideNotification(notification));

        // 自動關閉
        setTimeout(() => this.hideNotification(notification), duration);
    }

    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    showModal(content, title = '') {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;

        const container = document.getElementById('modal-container');
        container.appendChild(modal);

        // 顯示動畫
        setTimeout(() => modal.classList.add('active'), 10);

        // 關閉事件
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.closeModal(modal));

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });

        return modal;
    }

    closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

// 全域函數

// 連接帳號到實際平台
async function connectAccount(accountId) {
    try {
        const storage = new StorageManager();
        const accounts = storage.getAutoreplyAccounts();
        const account = accounts.find(acc => acc.id === accountId);
        
        if (!account) {
            app.showNotification('找不到指定的帳號', 'error');
            return;
        }

        app.showNotification('正在啟動認證流程...', 'info');
        
        // 開始 OAuth 認證流程
        const result = await window.apiManager.startOAuthFlow(account.platform, accountId);
        
        if (result.success) {
            app.showNotification('帳號連接成功！', 'success');
            app.loadAutoreplyAccounts(); // 重新載入帳號列表
            app.loadDashboardData(); // 更新儀表板
        } else {
            app.showNotification('帳號連接失敗: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('連接帳號失敗:', error);
        app.showNotification('連接失敗: ' + error.message, 'error');
    }
}

// 斷開帳號連接
async function disconnectAccount(accountId) {
    try {
        if (confirm('確定要斷開此帳號的連接嗎？')) {
            window.apiManager.disconnectAccount(accountId);
            app.showNotification('帳號已斷開連接', 'success');
            app.loadAutoreplyAccounts(); // 重新載入帳號列表
            app.loadDashboardData(); // 更新儀表板
        }
    } catch (error) {
        console.error('斷開帳號失敗:', error);
        app.showNotification('斷開失敗: ' + error.message, 'error');
    }
}

function showAddAccountModal() {
    const content = `
        <form id="add-account-form">
            <div class="form-group">
                <label class="form-label">平台</label>
                <select class="form-select" name="platform" required>
                    <option value="">選擇平台</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="twitter">Twitter</option>
                    <option value="line">Line</option>
                    <option value="telegram">Telegram</option>
                    <option value="whatsapp">WhatsApp</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">帳號名稱</label>
                <input type="text" class="form-input" name="username" required>
            </div>
            <div class="form-group">
                <label class="form-label">API 金鑰</label>
                <input type="password" class="form-input" name="apiKey" required>
            </div>
            <div class="form-group">
                <label class="form-label">狀態</label>
                <select class="form-select" name="status">
                    <option value="active">啟用</option>
                    <option value="inactive">停用</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">新增帳號</button>
                <button type="button" class="btn btn-secondary" onclick="app.closeModal(document.querySelector('.modal'))">取消</button>
            </div>
        </form>
    `;

    const modal = app.showModal(content, '新增社群帳號');
    
    const form = modal.querySelector('#add-account-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const accountData = {
            id: Date.now().toString(),
            platform: formData.get('platform'),
            username: formData.get('username'),
            apiKey: formData.get('apiKey'),
            status: formData.get('status'),
            createdAt: new Date().toISOString()
        };

        const storage = new StorageManager();
        storage.addAutoreplyAccount(accountData);
        
        app.closeModal(modal);
        app.showNotification('帳號新增成功', 'success');
        app.loadAutoreplyAccounts();
        app.loadDashboardData();
    });
}

function showAddRuleModal() {
    const content = `
        <form id="add-rule-form">
            <div class="form-group">
                <label class="form-label">規則名稱</label>
                <input type="text" class="form-input" name="name" required>
            </div>
            <div class="form-group">
                <label class="form-label">關鍵字</label>
                <input type="text" class="form-input" name="keywords" placeholder="用逗號分隔多個關鍵字" required>
            </div>
            <div class="form-group">
                <label class="form-label">回覆內容</label>
                <textarea class="form-textarea" name="replyContent" rows="4" required></textarea>
            </div>
            <div class="form-group">
                <label class="form-label">適用平台</label>
                <select class="form-select" name="platforms" multiple required>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="twitter">Twitter</option>
                    <option value="line">Line</option>
                    <option value="telegram">Telegram</option>
                    <option value="whatsapp">WhatsApp</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">狀態</label>
                <select class="form-select" name="status">
                    <option value="active">啟用</option>
                    <option value="inactive">停用</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">新增規則</button>
                <button type="button" class="btn btn-secondary" onclick="app.closeModal(document.querySelector('.modal'))">取消</button>
            </div>
        </form>
    `;

    const modal = app.showModal(content, '新增回覆規則');
    
    const form = modal.querySelector('#add-rule-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const ruleData = {
            id: Date.now().toString(),
            name: formData.get('name'),
            keywords: formData.get('keywords').split(',').map(k => k.trim()),
            replyContent: formData.get('replyContent'),
            platforms: Array.from(form.querySelector('select[name="platforms"]').selectedOptions).map(opt => opt.value),
            status: formData.get('status'),
            createdAt: new Date().toISOString()
        };

        const storage = new StorageManager();
        storage.addAutoreplyRule(ruleData);
        
        app.closeModal(modal);
        app.showNotification('規則新增成功', 'success');
        app.loadAutoreplyRules();
        app.loadDashboardData();
    });
}

function showAddTemplateModal() {
    const content = `
        <form id="add-template-form">
            <div class="form-group">
                <label class="form-label">範本名稱</label>
                <input type="text" class="form-input" name="name" required>
            </div>
            <div class="form-group">
                <label class="form-label">分類</label>
                <select class="form-select" name="category" required>
                    <option value="">選擇分類</option>
                    <option value="問候">問候</option>
                    <option value="客服">客服</option>
                    <option value="行銷">行銷</option>
                    <option value="活動">活動</option>
                    <option value="其他">其他</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">回覆內容</label>
                <textarea class="form-textarea" name="content" rows="6" required></textarea>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">新增範本</button>
                <button type="button" class="btn btn-secondary" onclick="app.closeModal(document.querySelector('.modal'))">取消</button>
            </div>
        </form>
    `;

    const modal = app.showModal(content, '新增回覆範本');
    
    const form = modal.querySelector('#add-template-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const templateData = {
            id: Date.now().toString(),
            name: formData.get('name'),
            category: formData.get('category'),
            content: formData.get('content'),
            usageCount: 0,
            createdAt: new Date().toISOString()
        };

        const storage = new StorageManager();
        storage.addAutoreplyTemplate(templateData);
        
        app.closeModal(modal);
        app.showNotification('範本新增成功', 'success');
        app.loadAutoreplyTemplates();
    });
}

function showAddScheduleModal() {
    const content = `
        <form id="add-schedule-form">
            <div class="form-group">
                <label class="form-label">排程名稱</label>
                <input type="text" class="form-input" name="name" required>
            </div>
            <div class="form-group">
                <label class="form-label">開始時間</label>
                <input type="time" class="form-input" name="startTime" required>
            </div>
            <div class="form-group">
                <label class="form-label">結束時間</label>
                <input type="time" class="form-input" name="endTime" required>
            </div>
            <div class="form-group">
                <label class="form-label">適用日期</label>
                <div class="checkbox-group">
                    <label><input type="checkbox" name="days" value="monday"> 週一</label>
                    <label><input type="checkbox" name="days" value="tuesday"> 週二</label>
                    <label><input type="checkbox" name="days" value="wednesday"> 週三</label>
                    <label><input type="checkbox" name="days" value="thursday"> 週四</label>
                    <label><input type="checkbox" name="days" value="friday"> 週五</label>
                    <label><input type="checkbox" name="days" value="saturday"> 週六</label>
                    <label><input type="checkbox" name="days" value="sunday"> 週日</label>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">回覆規則</label>
                <select class="form-select" name="ruleId" required>
                    <option value="">選擇規則</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">狀態</label>
                <select class="form-select" name="status">
                    <option value="active">啟用</option>
                    <option value="inactive">停用</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">新增排程</button>
                <button type="button" class="btn btn-secondary" onclick="app.closeModal(document.querySelector('.modal'))">取消</button>
            </div>
        </form>
    `;

    const modal = app.showModal(content, '新增排程');
    
    // 載入規則選項
    const storage = new StorageManager();
    const rules = storage.getAutoreplyRules();
    const ruleSelect = modal.querySelector('select[name="ruleId"]');
    rules.forEach(rule => {
        const option = document.createElement('option');
        option.value = rule.id;
        option.textContent = rule.name;
        ruleSelect.appendChild(option);
    });
    
    const form = modal.querySelector('#add-schedule-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const selectedDays = Array.from(form.querySelectorAll('input[name="days"]:checked')).map(cb => cb.value);
        const selectedRule = rules.find(r => r.id === formData.get('ruleId'));
        
        const scheduleData = {
            id: Date.now().toString(),
            name: formData.get('name'),
            startTime: formData.get('startTime'),
            endTime: formData.get('endTime'),
            days: selectedDays,
            ruleId: formData.get('ruleId'),
            ruleName: selectedRule ? selectedRule.name : '',
            status: formData.get('status'),
            createdAt: new Date().toISOString()
        };

        storage.addAutoreplySchedule(scheduleData);
        
        app.closeModal(modal);
        app.showNotification('排程新增成功', 'success');
        app.loadAutoreplySchedules();
    });
}

function switchTab(tabName) {
    // 移除所有標籤頁的 active 狀態
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // 設定目標標籤頁為 active
    const targetContent = document.getElementById(tabName);
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
    const targetButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (targetButton) {
        targetButton.classList.add('active');
    }
}

// 主頁面功能
function refreshDashboard() {
    app.loadDashboardData();
    app.showNotification('儀表板已重新整理', 'success');
}

function exportData() {
    const storage = new StorageManager();
    const data = {
        autoreplyAccounts: storage.getAutoreplyAccounts(),
        autoreplyRules: storage.getAutoreplyRules(),
        autoreplyTemplates: storage.getAutoreplyTemplates(),
        autoreplySchedules: storage.getAutoreplySchedules(),
        autoreplyLogs: storage.getAutoreplyLogs(),
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autoreply-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    app.showNotification('資料匯出成功', 'success');
}

function viewAllActivities() {
    app.navigateToPage('auto-reply');
    app.showNotification('已跳轉到自動回覆管理頁面', 'info');
}

function markAllAsRead() {
    const notifications = document.querySelectorAll('.notification-item');
    notifications.forEach(notification => {
        notification.style.opacity = '0.6';
    });
    app.showNotification('已標記所有通知為已讀', 'success');
}

function navigateToPage(pageName) {
    app.navigateToPage(pageName);
}

// 帳號管理函數
function editAccount(accountId) {
    const storage = new StorageManager();
    const accounts = storage.getAutoreplyAccounts();
    const account = accounts.find(acc => acc.id === accountId);
    
    if (!account) {
        app.showNotification('找不到指定的帳號', 'error');
        return;
    }

    const content = `
        <form id="edit-account-form">
            <div class="form-group">
                <label class="form-label">平台</label>
                <select class="form-select" name="platform" required>
                    <option value="instagram" ${account.platform === 'instagram' ? 'selected' : ''}>Instagram</option>
                    <option value="facebook" ${account.platform === 'facebook' ? 'selected' : ''}>Facebook</option>
                    <option value="twitter" ${account.platform === 'twitter' ? 'selected' : ''}>Twitter</option>
                    <option value="line" ${account.platform === 'line' ? 'selected' : ''}>Line</option>
                    <option value="telegram" ${account.platform === 'telegram' ? 'selected' : ''}>Telegram</option>
                    <option value="whatsapp" ${account.platform === 'whatsapp' ? 'selected' : ''}>WhatsApp</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">帳號名稱</label>
                <input type="text" class="form-input" name="username" value="${account.username}" required>
            </div>
            <div class="form-group">
                <label class="form-label">API 金鑰</label>
                <input type="password" class="form-input" name="apiKey" value="${account.apiKey || ''}" required>
            </div>
            <div class="form-group">
                <label class="form-label">狀態</label>
                <select class="form-select" name="status">
                    <option value="active" ${account.status === 'active' ? 'selected' : ''}>啟用</option>
                    <option value="inactive" ${account.status === 'inactive' ? 'selected' : ''}>停用</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">更新帳號</button>
                <button type="button" class="btn btn-secondary" onclick="app.closeModal(document.querySelector('.modal'))">取消</button>
            </div>
        </form>
    `;

    const modal = app.showModal(content, '編輯社群帳號');
    
    const form = modal.querySelector('#edit-account-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        
        const updatedAccount = {
            ...account,
            platform: formData.get('platform'),
            username: formData.get('username'),
            apiKey: formData.get('apiKey'),
            status: formData.get('status'),
            updatedAt: new Date().toISOString()
        };

        storage.updateAutoreplyAccount(accountId, updatedAccount);
        
        app.closeModal(modal);
        app.showNotification('帳號更新成功', 'success');
        app.loadAutoreplyAccounts();
    });
}

function deleteAccount(accountId) {
    if (confirm('確定要刪除此帳號嗎？此操作無法復原。')) {
        const storage = new StorageManager();
        storage.deleteAutoreplyAccount(accountId);
        app.showNotification('帳號已刪除', 'success');
        app.loadAutoreplyAccounts();
        app.loadDashboardData();
    }
}

// 規則管理函數
function toggleRuleStatus(ruleId) {
    const storage = new StorageManager();
    const rules = storage.getAutoreplyRules();
    const rule = rules.find(r => r.id === ruleId);
    
    if (!rule) {
        app.showNotification('找不到指定的規則', 'error');
        return;
    }

    const updatedRule = {
        ...rule,
        status: rule.status === 'active' ? 'inactive' : 'active',
        updatedAt: new Date().toISOString()
    };

    storage.updateAutoreplyRule(ruleId, updatedRule);
    app.showNotification(`規則已${updatedRule.status === 'active' ? '啟用' : '停用'}`, 'success');
    app.loadAutoreplyRules();
}

function editRule(ruleId) {
    const storage = new StorageManager();
    const rules = storage.getAutoreplyRules();
    const rule = rules.find(r => r.id === ruleId);
    
    if (!rule) {
        app.showNotification('找不到指定的規則', 'error');
        return;
    }

    const content = `
        <form id="edit-rule-form">
            <div class="form-group">
                <label class="form-label">規則名稱</label>
                <input type="text" class="form-input" name="name" value="${rule.name}" required>
            </div>
            <div class="form-group">
                <label class="form-label">關鍵字（用逗號分隔）</label>
                <input type="text" class="form-input" name="keywords" value="${rule.keywords.join(', ')}" required>
            </div>
            <div class="form-group">
                <label class="form-label">回覆內容</label>
                <textarea class="form-textarea" name="replyContent" rows="4" required>${rule.replyContent}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">適用平台</label>
                <div class="checkbox-group">
                    <label><input type="checkbox" name="platforms" value="instagram" ${rule.platforms.includes('instagram') ? 'checked' : ''}> Instagram</label>
                    <label><input type="checkbox" name="platforms" value="facebook" ${rule.platforms.includes('facebook') ? 'checked' : ''}> Facebook</label>
                    <label><input type="checkbox" name="platforms" value="twitter" ${rule.platforms.includes('twitter') ? 'checked' : ''}> Twitter</label>
                    <label><input type="checkbox" name="platforms" value="line" ${rule.platforms.includes('line') ? 'checked' : ''}> Line</label>
                    <label><input type="checkbox" name="platforms" value="telegram" ${rule.platforms.includes('telegram') ? 'checked' : ''}> Telegram</label>
                    <label><input type="checkbox" name="platforms" value="whatsapp" ${rule.platforms.includes('whatsapp') ? 'checked' : ''}> WhatsApp</label>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">狀態</label>
                <select class="form-select" name="status">
                    <option value="active" ${rule.status === 'active' ? 'selected' : ''}>啟用</option>
                    <option value="inactive" ${rule.status === 'inactive' ? 'selected' : ''}>停用</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">更新規則</button>
                <button type="button" class="btn btn-secondary" onclick="app.closeModal(document.querySelector('.modal'))">取消</button>
            </div>
        </form>
    `;

    const modal = app.showModal(content, '編輯回覆規則');
    
    const form = modal.querySelector('#edit-rule-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const selectedPlatforms = Array.from(form.querySelectorAll('input[name="platforms"]:checked')).map(cb => cb.value);
        
        const updatedRule = {
            ...rule,
            name: formData.get('name'),
            keywords: formData.get('keywords').split(',').map(k => k.trim()).filter(k => k),
            replyContent: formData.get('replyContent'),
            platforms: selectedPlatforms,
            status: formData.get('status'),
            updatedAt: new Date().toISOString()
        };

        storage.updateAutoreplyRule(ruleId, updatedRule);
        
        app.closeModal(modal);
        app.showNotification('規則更新成功', 'success');
        app.loadAutoreplyRules();
    });
}

function deleteRule(ruleId) {
    if (confirm('確定要刪除此規則嗎？此操作無法復原。')) {
        const storage = new StorageManager();
        storage.deleteAutoreplyRule(ruleId);
        app.showNotification('規則已刪除', 'success');
        app.loadAutoreplyRules();
    }
}

// 載入範例資料函數
function loadSampleData() {
    if (confirm('確定要載入範例資料嗎？這將新增一些測試用的帳號、規則和範本。')) {
        const storage = new StorageManager();
        storage.loadSampleData();
        
        // 清除空狀態並重新載入儀表板
        app.clearEmptyState();
        app.loadDashboardData();
        
        // 隱藏載入範例資料按鈕，顯示清除資料按鈕
        const loadSampleBtn = document.getElementById('load-sample-btn');
        const clearDataBtn = document.getElementById('clear-data-btn');
        if (loadSampleBtn) {
            loadSampleBtn.style.display = 'none';
        }
        if (clearDataBtn) {
            clearDataBtn.style.display = 'inline-block';
        }
    }
}

// 清除所有資料函數
function clearAllData() {
    if (confirm('確定要清除所有資料嗎？此操作無法復原，所有帳號、規則、範本和記錄都將被刪除。')) {
        const storage = new StorageManager();
        storage.clearAllData();
        
        // 重新載入儀表板，顯示空狀態
        app.loadDashboardData();
        
        // 顯示載入範例資料按鈕，隱藏清除資料按鈕
        const loadSampleBtn = document.getElementById('load-sample-btn');
        const clearDataBtn = document.getElementById('clear-data-btn');
        if (loadSampleBtn) {
            loadSampleBtn.style.display = 'inline-block';
        }
        if (clearDataBtn) {
            clearDataBtn.style.display = 'none';
        }
        
        app.showNotification('✅ 所有資料已清除', 'success');
    }
}

// 初始化應用程式
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new AutoreplyTool();
    app.init();
}); 