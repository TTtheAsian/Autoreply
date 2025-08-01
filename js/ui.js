// UI 工具類別
class UIHelper {
    constructor() {
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupAnimations();
    }

    // 主題設定
    setupTheme() {
        const settings = new StorageManager().getSettings();
        document.documentElement.setAttribute('data-theme', settings.theme);
    }

    // 動畫設定
    setupAnimations() {
        // 添加頁面載入動畫
        document.addEventListener('DOMContentLoaded', () => {
            document.body.classList.add('loaded');
        });
    }

    // 格式化日期
    formatDate(dateString, format = 'full') {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (format) {
            case 'short':
                return date.toLocaleDateString('zh-TW');
            case 'time':
                return date.toLocaleTimeString('zh-TW', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
            case 'relative':
                if (diffDays === 0) return '今天';
                if (diffDays === 1) return '昨天';
                if (diffDays < 7) return `${diffDays} 天前`;
                return date.toLocaleDateString('zh-TW');
            case 'full':
            default:
                return date.toLocaleString('zh-TW');
        }
    }

    // 格式化數字
    formatNumber(number, options = {}) {
        const defaults = {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        };
        return number.toLocaleString('zh-TW', { ...defaults, ...options });
    }

    // 生成進度條
    createProgressBar(percentage, color = 'primary') {
        return `
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%; background-color: var(--${color}-color);"></div>
            </div>
        `;
    }

    // 生成徽章
    createBadge(text, type = 'default') {
        const colors = {
            default: 'secondary',
            success: 'success',
            warning: 'warning',
            danger: 'danger',
            info: 'info'
        };
        return `<span class="badge badge-${colors[type] || 'default'}">${text}</span>`;
    }

    // 生成卡片
    createCard(title, content, options = {}) {
        const { icon, actions, footer } = options;
        return `
            <div class="card">
                ${icon ? `<div class="card-icon">${icon}</div>` : ''}
                <div class="card-content">
                    <h3 class="card-title">${title}</h3>
                    <div class="card-body">${content}</div>
                    ${footer ? `<div class="card-footer">${footer}</div>` : ''}
                </div>
                ${actions ? `<div class="card-actions">${actions}</div>` : ''}
            </div>
        `;
    }

    // 生成表格
    createTable(headers, data, options = {}) {
        const { sortable = false, searchable = false, pagination = false } = options;
        
        let tableHTML = `
            <div class="table-container">
                ${searchable ? '<input type="text" class="table-search" placeholder="搜尋...">' : ''}
                <table class="table">
                    <thead>
                        <tr>
                            ${headers.map(header => `<th>${header}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(row => `
                            <tr>
                                ${row.map(cell => `<td>${cell}</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        return tableHTML;
    }

    // 生成分頁
    createPagination(currentPage, totalPages, onPageChange) {
        const pages = [];
        const maxVisible = 5;
        
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }
        
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        
        return `
            <div class="pagination">
                ${currentPage > 1 ? `<button class="btn btn-secondary" onclick="onPageChange(${currentPage - 1})">上一頁</button>` : ''}
                ${pages.map(page => `
                    <button class="btn ${page === currentPage ? 'btn-primary' : 'btn-secondary'}" 
                            onclick="onPageChange(${page})">${page}</button>
                `).join('')}
                ${currentPage < totalPages ? `<button class="btn btn-secondary" onclick="onPageChange(${currentPage + 1})">下一頁</button>` : ''}
            </div>
        `;
    }

    // 生成搜尋框
    createSearchBox(placeholder = '搜尋...', onSearch) {
        return `
            <div class="search-box">
                <input type="text" class="search-input" placeholder="${placeholder}">
                <button class="search-btn" onclick="onSearch(this.previousElementSibling.value)">
                    🔍
                </button>
            </div>
        `;
    }

    // 生成篩選器
    createFilter(options, selectedValue, onChange) {
        return `
            <select class="form-select" onchange="onChange(this.value)">
                ${options.map(option => `
                    <option value="${option.value}" ${option.value === selectedValue ? 'selected' : ''}>
                        ${option.label}
                    </option>
                `).join('')}
            </select>
        `;
    }

    // 生成載入動畫
    createLoadingSpinner(size = 'medium') {
        const sizes = {
            small: '1rem',
            medium: '2rem',
            large: '3rem'
        };
        
        return `
            <div class="loading-spinner" style="width: ${sizes[size]}; height: ${sizes[size]};">
                <div class="spinner"></div>
            </div>
        `;
    }

    // 生成空狀態
    createEmptyState(icon, title, description, action = null) {
        return `
            <div class="empty-state">
                <div class="empty-icon">${icon}</div>
                <h3 class="empty-title">${title}</h3>
                <p class="empty-description">${description}</p>
                ${action ? `<div class="empty-action">${action}</div>` : ''}
            </div>
        `;
    }

    // 生成確認對話框
    showConfirmDialog(message, onConfirm, onCancel) {
        const content = `
            <div class="confirm-dialog">
                <p>${message}</p>
                <div class="dialog-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">取消</button>
                    <button class="btn btn-danger" onclick="onConfirm(); this.closest('.modal').remove()">確認</button>
                </div>
            </div>
        `;
        
        return app.showModal(content, '確認操作');
    }

    // 生成檔案上傳
    createFileUpload(accept, onUpload, multiple = false) {
        return `
            <div class="file-upload">
                <input type="file" 
                       class="file-input" 
                       accept="${accept}" 
                       ${multiple ? 'multiple' : ''}
                       onchange="onUpload(this.files)">
                <div class="file-drop-zone">
                    <div class="file-icon">📁</div>
                    <p>拖拽檔案到這裡或點擊選擇檔案</p>
                </div>
            </div>
        `;
    }

    // 生成圖表容器
    createChartContainer(id, title, type = 'line') {
        return `
            <div class="chart-container">
                <h3 class="chart-title">${title}</h3>
                <canvas id="${id}" width="400" height="200"></canvas>
            </div>
        `;
    }

    // 生成統計卡片
    createStatCard(icon, title, value, change = null, changeType = 'positive') {
        const changeHTML = change ? `
            <div class="stat-change ${changeType}">
                ${changeType === 'positive' ? '↗' : '↘'} ${change}
            </div>
        ` : '';
        
        return `
            <div class="stat-card">
                <div class="stat-icon">${icon}</div>
                <div class="stat-content">
                    <h3 class="stat-title">${title}</h3>
                    <div class="stat-value">${value}</div>
                    ${changeHTML}
                </div>
            </div>
        `;
    }

    // 生成時間軸
    createTimeline(events) {
        return `
            <div class="timeline">
                ${events.map(event => `
                    <div class="timeline-item">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <h4 class="timeline-title">${event.title}</h4>
                            <p class="timeline-description">${event.description}</p>
                            <div class="timeline-date">${this.formatDate(event.date, 'relative')}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // 生成標籤
    createTags(tags, removable = false, onRemove = null) {
        return `
            <div class="tags">
                ${tags.map(tag => `
                    <span class="tag">
                        ${tag}
                        ${removable ? `<button class="tag-remove" onclick="onRemove('${tag}')">&times;</button>` : ''}
                    </span>
                `).join('')}
            </div>
        `;
    }

    // 生成評分
    createRating(value, max = 5, readonly = false, onChange = null) {
        const stars = [];
        for (let i = 1; i <= max; i++) {
            const filled = i <= value;
            stars.push(`
                <span class="star ${filled ? 'filled' : ''}" 
                      ${!readonly ? `onclick="onChange(${i})"` : ''}>
                    ${filled ? '★' : '☆'}
                </span>
            `);
        }
        
        return `<div class="rating">${stars.join('')}</div>`;
    }

    // 生成工具提示
    createTooltip(element, text, position = 'top') {
        element.setAttribute('data-tooltip', text);
        element.setAttribute('data-tooltip-position', position);
        element.classList.add('tooltip-trigger');
    }

    // 生成下拉選單
    createDropdown(trigger, items, position = 'bottom') {
        return `
            <div class="dropdown">
                <button class="dropdown-trigger">${trigger}</button>
                <div class="dropdown-menu">
                    ${items.map(item => `
                        <button class="dropdown-item" onclick="${item.onClick}">
                            ${item.icon ? `<span class="dropdown-icon">${item.icon}</span>` : ''}
                            ${item.label}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // 生成標籤頁
    createTabs(tabs, activeTab = 0) {
        const tabButtons = tabs.map((tab, index) => `
            <button class="tab-button ${index === activeTab ? 'active' : ''}" 
                    onclick="switchTab(${index})">
                ${tab.icon ? `<span class="tab-icon">${tab.icon}</span>` : ''}
                ${tab.label}
            </button>
        `).join('');
        
        const tabContents = tabs.map((tab, index) => `
            <div class="tab-content ${index === activeTab ? 'active' : ''}">
                ${tab.content}
            </div>
        `).join('');
        
        return `
            <div class="tabs">
                <div class="tab-buttons">${tabButtons}</div>
                <div class="tab-contents">${tabContents}</div>
            </div>
        `;
    }

    // 生成手風琴
    createAccordion(items) {
        return `
            <div class="accordion">
                ${items.map((item, index) => `
                    <div class="accordion-item">
                        <button class="accordion-header" onclick="toggleAccordion(${index})">
                            ${item.icon ? `<span class="accordion-icon">${item.icon}</span>` : ''}
                            ${item.title}
                            <span class="accordion-arrow">▼</span>
                        </button>
                        <div class="accordion-content">
                            ${item.content}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// 全域 UI 工具實例
const ui = new UIHelper();

// 全域函數
function switchTab(index) {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });
    
    tabContents.forEach((content, i) => {
        content.classList.toggle('active', i === index);
    });
}

function toggleAccordion(index) {
    const accordionItem = document.querySelectorAll('.accordion-item')[index];
    const content = accordionItem.querySelector('.accordion-content');
    const arrow = accordionItem.querySelector('.accordion-arrow');
    
    content.style.display = content.style.display === 'none' ? 'block' : 'none';
    arrow.style.transform = content.style.display === 'none' ? 'rotate(0deg)' : 'rotate(180deg)';
} 