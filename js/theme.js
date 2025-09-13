// 테마 관리 시스템
class ThemeManager {
    constructor() {
        this.currentTheme = 'dark';
        this.themeToggle = null;
        this.observers = [];
        
        this.init();
    }
    
    init() {
        this.themeToggle = document.getElementById('themeToggle');
        this.loadSavedTheme();
        this.setupEventListeners();
        this.detectSystemTheme();
    }
    
    setupEventListeners() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // 시스템 테마 변경 감지
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('dcu-theme-preference')) {
                this.setTheme(e.matches ? 'dark' : 'light', false);
            }
        });
        
        // 키보드 단축키 (Alt + T)
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key.toLowerCase() === 't') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }
    
    detectSystemTheme() {
        // 저장된 테마 설정이 없으면 시스템 테마 사용
        if (!localStorage.getItem('dcu-theme-preference')) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.setTheme(prefersDark ? 'dark' : 'light', false);
        }
    }
    
    loadSavedTheme() {
        const savedTheme = localStorage.getItem('dcu-theme-preference');
        if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
            this.setTheme(savedTheme, false);
        }
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme, true);
    }
    
    setTheme(theme, savePreference = true) {
        if (!['light', 'dark'].includes(theme)) {
            console.warn('유효하지 않은 테마:', theme);
            return;
        }
        
        const oldTheme = this.currentTheme;
        this.currentTheme = theme;
        
        // DOM 업데이트
        this.updateDOM(theme);
        
        // 토글 버튼 업데이트
        this.updateToggleButton(theme);
        
        // 로컬 스토리지 저장
        if (savePreference) {
            localStorage.setItem('dcu-theme-preference', theme);
        }
        
        // 관찰자들에게 테마 변경 알림
        this.notifyObservers(theme, oldTheme);
        
        // 애니메이션 효과
        this.animateThemeChange();
        
        console.log(`테마가 ${theme}로 변경되었습니다.`);
    }
    
    updateDOM(theme) {
        const body = document.body;
        
        if (theme === 'light') {
            body.setAttribute('data-theme', 'light');
        } else {
            body.removeAttribute('data-theme');
        }
        
        // 메타 테마 컬러 업데이트 (모바일 브라우저용)
        this.updateMetaThemeColor(theme);
    }
    
    updateToggleButton(theme) {
        if (this.themeToggle) {
            this.themeToggle.textContent = theme === 'dark' ? '🌞' : '🌙';
            this.themeToggle.setAttribute('aria-label', 
                theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'
            );
        }
    }
    
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = theme === 'dark' ? '#000000' : '#ffffff';
    }
    
    animateThemeChange() {
        // 테마 변경 시 부드러운 전환 효과
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
    
    // 관찰자 패턴 구현
    addObserver(callback) {
        if (typeof callback === 'function') {
            this.observers.push(callback);
        }
    }
    
    removeObserver(callback) {
        this.observers = this.observers.filter(obs => obs !== callback);
    }
    
    notifyObservers(newTheme, oldTheme) {
        this.observers.forEach(callback => {
            try {
                callback(newTheme, oldTheme);
            } catch (error) {
                console.error('테마 관찰자 콜백 에러:', error);
            }
        });
    }
    
    // 현재 테마 반환
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    // 다크 모드 여부 확인
    isDarkMode() {
        return this.currentTheme === 'dark';
    }
    
    // 시스템 테마 기본 설정으로 리셋
    resetToSystemTheme() {
        localStorage.removeItem('dcu-theme-preference');
        this.detectSystemTheme();
    }
    
    // 테마별 CSS 변수 값 가져오기
    getThemeColors() {
        const computedStyle = getComputedStyle(document.documentElement);
        return {
            primary: computedStyle.getPropertyValue('--bg-primary').trim(),
            secondary: computedStyle.getPropertyValue('--bg-secondary').trim(),
            textPrimary: computedStyle.getPropertyValue('--text-primary').trim(),
            textSecondary: computedStyle.getPropertyValue('--text-secondary').trim(),
            accent: computedStyle.getPropertyValue('--accent-color').trim(),
            accentSecondary: computedStyle.getPropertyValue('--accent-secondary').trim()
        };
    }
}

// 전역 테마 매니저 인스턴스
const themeManager = new ThemeManager();

// 파티클 시스템과 테마 연동
themeManager.addObserver((newTheme) => {
    // 파티클 시스템에 테마 변경 알림
    if (window.ParticleManager) {
        window.ParticleManager.updateTheme(newTheme === 'dark');
    }
});

// 전역 테마 관련 함수들
function toggleTheme() {
    themeManager.toggleTheme();
}

function setTheme(theme) {
    themeManager.setTheme(theme, true);
}

function getCurrentTheme() {
    return themeManager.getCurrentTheme();
}

function isDarkMode() {
    return themeManager.isDarkMode();
}

function loadSavedTheme() {
    themeManager.loadSavedTheme();
}

// 테마 관련 유틸리티
const ThemeUtils = {
    // 테마에 적합한 이미지 URL 반환
    getThemedImage: function(lightUrl, darkUrl) {
        return themeManager.isDarkMode() ? darkUrl : lightUrl;
    },
    
    // 테마에 적합한 색상 반환
    getThemedColor: function(lightColor, darkColor) {
        return themeManager.isDarkMode() ? darkColor : lightColor;
    },
    
    // 테마 변경 애니메이션
    animateElement: function(element, property, lightValue, darkValue, duration = 300) {
        const targetValue = themeManager.isDarkMode() ? darkValue : lightValue;
        
        element.style.transition = `${property} ${duration}ms ease`;
        element.style[property] = targetValue;
        
        setTimeout(() => {
            element.style.transition = '';
        }, duration);
    },
    
    // 접근성을 위한 고대비 모드 감지
    isHighContrast: function() {
        return window.matchMedia('(prefers-contrast: high)').matches;
    },
    
    // 애니메이션 감소 설정 감지
    prefersReducedMotion: function() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
};

// 접근성 관련 설정
document.addEventListener('DOMContentLoaded', function() {
    // 고대비 모드 감지
    if (ThemeUtils.isHighContrast()) {
        document.body.classList.add('high-contrast');
        console.log('고대비 모드가 감지되었습니다.');
    }
    
    // 애니메이션 감소 설정 감지
    if (ThemeUtils.prefersReducedMotion()) {
        document.body.classList.add('reduce-motion');
        console.log('애니메이션 감소 설정이 감지되었습니다.');
    }
});

// 테마별 스타일 동적 적용
const DynamicStyles = {
    // 테마에 따른 그림자 효과
    applyThemedShadow: function(element) {
        const shadowColor = themeManager.isDarkMode() 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)';
        
        element.style.boxShadow = `0 4px 20px ${shadowColor}`;
    },
    
    // 테마에 따른 보더 색상
    applyThemedBorder: function(element) {
        const borderColor = themeManager.isDarkMode() 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)';
        
        element.style.borderColor = borderColor;
    }
};

// 전역으로 내보내기
window.themeManager = themeManager;
window.ThemeUtils = ThemeUtils;
window.DynamicStyles = DynamicStyles;

// 테마 변경 이벤트 발생
document.addEventListener('themechange', function(e) {
    console.log('테마 변경 이벤트:', e.detail);
});

// 개발자를 위한 디버그 함수
if (process?.env?.NODE_ENV === 'development') {
    window.debugTheme = {
        manager: themeManager,
        utils: ThemeUtils,
        styles: DynamicStyles,
        toggleTheme,
        setTheme,
        getCurrentTheme
    };
}
