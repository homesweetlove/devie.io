// 메인 JavaScript 파일
document.addEventListener('DOMContentLoaded', function() {
    // 초기화
    initializeApp();
    loadSavedTheme();
    
    // 로딩 화면 처리
    setTimeout(() => {
        hideLoadingScreen();
    }, 1000);
});

window.addEventListener('load', function() {
    // 페이지 완전 로드 후 애니메이션 시작
    initializeAnimations();
});

// 앱 초기화
function initializeApp() {
    console.log('대구가톨릭대학교 학생포털 초기화 중...');
    
    // 이벤트 리스너 등록
    setupEventListeners();
    
    // 실시간 데이터 업데이트
    updateRealTimeData();
    
    // 주기적 업데이트 (30초마다)
    setInterval(updateRealTimeData, 30000);
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 스크롤 이벤트
    window.addEventListener('scroll', handleScroll);
    
    // 리사이즈 이벤트
    window.addEventListener('resize', handleResize);
    
    // 클릭 이벤트 (리플 효과)
    document.addEventListener('click', createRipple);
    
    // 네비게이션 링크 활성화
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 외부 링크인 경우 기본 동작 유지
            if (this.getAttribute('href').startsWith('pages/')) {
                return;
            }
            
            // 내부 링크인 경우 활성화 처리
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 빠른 링크 카드 애니메이션
    const quickCards = document.querySelectorAll('.quick-link-card');
    quickCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 서비스 카드 클릭 이벤트
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('.service-title').textContent;
            showServiceInfo(title);
        });
    });
}

// 스크롤 처리
function handleScroll() {
    updateProgressBar();
    handleScrollAnimations();
}

// 리사이즈 처리
function handleResize() {
    // 파티클 시스템 리사이즈는 particles.js에서 처리
}

// 프로그레스 바 업데이트
function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    if (progressBar) {
        progressBar.style.width = Math.min(100, Math.max(0, scrollPercent)) + '%';
    }
}

// 스크롤 애니메이션 처리
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    const windowHeight = window.innerHeight;
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - 50) {
            element.classList.add('visible');
        }
    });
}

// 애니메이션 초기화
function initializeAnimations() {
    // 모든 애니메이션 가능한 요소에 fade-in 클래스 추가
    const animatableElements = document.querySelectorAll('.card, .quick-link-card, .service-card');
    animatableElements.forEach((element, index) => {
        element.classList.add('fade-in');
        // 순차적 애니메이션을 위한 지연
        setTimeout(() => {
            element.classList.add('visible');
        }, index * 100);
    });
}

// 로딩 화면 숨기기
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// 리플 효과 생성
function createRipple(e) {
    // 클릭 가능한 요소에서만 리플 효과 생성
    const clickableElements = ['button', 'a', '.card', '.quick-link-card', '.service-card'];
    const isClickable = clickableElements.some(selector => 
        e.target.closest(selector)
    );
    
    if (!isClickable) return;
    
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    
    const size = 60;
    ripple.style.width = size + 'px';
    ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - size / 2) + 'px';
    ripple.style.top = (e.clientY - size / 2) + 'px';
    
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// 실시간 데이터 업데이트
function updateRealTimeData() {
    // 시뮬레이션된 실시간 데이터
    updateStatistics();
    updateServiceStatus();
    updatePopularClubs();
}

// 통계 업데이트
function updateStatistics() {
    const stats = {
        newClubs: Math.floor(Math.random() * 10) + 10,
        scholarships: Math.floor(Math.random() * 5) + 5,
        weekEvents: Math.floor(Math.random() * 15) + 15,
        foodRating: (Math.random() * 1 + 3.5).toFixed(1)
    };
    
    // 애니메이션과 함께 숫자 업데이트
    animateNumber('newClubs', stats.newClubs);
    animateNumber('scholarships', stats.scholarships);
    animateNumber('weekEvents', stats.weekEvents);
    
    const foodRatingElement = document.getElementById('foodRating');
    if (foodRatingElement) {
        foodRatingElement.textContent = stats.foodRating;
    }
}

// 숫자 애니메이션
function animateNumber(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const currentValue = parseInt(element.textContent) || 0;
    const increment = targetValue > currentValue ? 1 : -1;
    const duration = 1000; // 1초
    const steps = Math.abs(targetValue - currentValue);
    const stepDuration = duration / Math.max(steps, 1);
    
    let current = currentValue;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        
        if (current === targetValue) {
            clearInterval(timer);
        }
    }, stepDuration);
}

// 서비스 상태 업데이트
function updateServiceStatus() {
    // 시뮬레이션된 서비스 상태
    const services = {
        library: Math.floor(Math.random() * 100) + 250,
        parking: Math.floor(Math.random() * 50) + 20,
        shuttle: Math.floor(Math.random() * 10) + 1,
        food: (Math.random() * 1 + 3.5).toFixed(1)
    };
    
    // 도서관 좌석 상태 업데이트
    const libraryCard = document.querySelector('.service-card .service-title');
    if (libraryCard && libraryCard.textContent === '도서관') {
        const statusNumber = libraryCard.parentElement.querySelector('.status-number');
        if (statusNumber) {
            statusNumber.textContent = `${services.library}/400`;
            
            // 상태에 따른 색상 변경
            if (services.library > 300) {
                statusNumber.style.color = 'var(--success-color)';
            } else if (services.library > 150) {
                statusNumber.style.color = 'var(--warning-color)';
            } else {
                statusNumber.style.color = 'var(--danger-color)';
            }
        }
    }
}

// 인기 동아리 업데이트
function updatePopularClubs() {
    const clubsData = [
        { name: '💻 멋쟁이사자처럼', members: Math.floor(Math.random() * 20) + 140 },
        { name: '🎵 밴드동아리 ECHO', members: Math.floor(Math.random() * 20) + 80 },
        { name: '📸 사진동아리 렌즈', members: Math.floor(Math.random() * 20) + 70 },
        { name: '🏃 러닝크루', members: Math.floor(Math.random() * 20) + 60 }
    ];
    
    const popularClubsList = document.getElementById('popularClubsList');
    if (popularClubsList) {
        popularClubsList.innerHTML = '';
        
        clubsData.forEach(club => {
            const clubItem = document.createElement('div');
            clubItem.className = 'popular-club-item';
            clubItem.innerHTML = `
                <span>${club.name}</span>
                <span style="color: var(--accent-color); font-weight: 600;">${club.members}명</span>
            `;
            popularClubsList.appendChild(clubItem);
        });
    }
}

// 서비스 정보 표시
function showServiceInfo(serviceName) {
    const messages = {
        '도서관': '도서관 실시간 좌석 현황을 확인할 수 있습니다.\n24시간 운영하는 열람실도 있습니다.',
        '주차장': '캠퍼스 내 주차장 실시간 현황입니다.\n대중교통 이용을 권장합니다.',
        '셔틀버스': '지하철역과 캠퍼스를 연결하는 무료 셔틀버스입니다.\n15분 간격으로 운행됩니다.',
        '학생식당': '오늘의 메뉴와 평점을 확인하세요.\n학생증 지참 필수입니다.'
    };
    
    const message = messages[serviceName] || '서비스 정보를 준비 중입니다.';
    alert(message);
}

// 유틸리티 함수들
const utils = {
    // 시간 포맷팅
    formatTime: function(date) {
        return date.toLocaleTimeString('ko-KR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    },
    
    // 날짜 포맷팅
    formatDate: function(date) {
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    // 로컬 스토리지 헬퍼
    storage: {
        get: function(key) {
            try {
                return JSON.parse(localStorage.getItem(key));
            } catch (e) {
                return null;
            }
        },
        
        set: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                return false;
            }
        },
        
        remove: function(key) {
            localStorage.removeItem(key);
        }
    },
    
    // 디바운스 함수
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// 전역으로 사용할 함수들 내보내기
window.DCU = {
    updateRealTimeData,
    showServiceInfo,
    utils
};

// 콘솔 환영 메시지
console.log(`
🎓 대구가톨릭대학교 학생포털에 오신 것을 환영합니다!

주요 기능:
- 실시간 캠퍼스 정보
- 동아리 및 장학금 안내
- 행사/이벤트 일정
- 편의시설 현황

개발자 도구를 통해 다양한 기능을 확인해보세요!
`);

// 에러 핸들링
window.addEventListener('error', function(e) {
    console.error('앱 에러:', e.error);
    // 프로덕션에서는 에러 리포팅 서비스로 전송
});

// 성능 모니터링
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`페이지 로드 시간: ${loadTime.toFixed(2)}ms`);
});
