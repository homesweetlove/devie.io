// 동아리 페이지 JavaScript
class ClubsManager {
    constructor() {
        this.clubs = [];
        this.filteredClubs = [];
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.currentCategory = 'all';
        this.currentSort = 'name';
        this.searchQuery = '';
        
        this.init();
    }
    
    async init() {
        console.log('동아리 페이지 초기화 중...');
        
        // DOM 요소 캐싱
        this.cacheElements();
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
        
        // 데이터 로드
        await this.loadClubs();
        
        // 초기 렌더링
        this.render();
        
        // 애니메이션 시작
        this.startAnimations();
        
        console.log('동아리 페이지 초기화 완료');
    }
    
    cacheElements() {
        this.elements = {
            clubsGrid: document.getElementById('clubsGrid'),
            loadingClubs: document.getElementById('loadingClubs'),
            emptyState: document.getElementById('emptyState'),
            searchBox: document.getElementById('clubSearch'),
            sortSelect: document.getElementById('sortSelect'),
            filterTabs: document.getElementById('filterTabs'),
            pagination: document.getElementById('pagination'),
            pageNumbers: document.getElementById('pageNumbers'),
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn'),
            totalClubs: document.getElementById('totalClubs'),
            recruitingClubs: document.getElementById('recruitingClubs'),
            totalMembers: document.getElementById('totalMembers'),
            categories: document.getElementById('categories')
        };
    }
    
    setupEventListeners() {
        // 검색
        this.elements.searchBox.addEventListener('input', 
            this.debounce((e) => this.handleSearch(e.target.value), 300)
        );
        
        // 정렬
        this.elements.sortSelect.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.applyFilters();
        });
        
        // 카테고리 필터
        this.elements.filterTabs.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-tab')) {
                this.handleCategoryFilter(e.target);
            }
        });
        
        // 스크롤 애니메이션
        window.addEventListener('scroll', () => this.handleScroll());
        
        // 키보드 단축키
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    async loadClubs() {
        try {
            // 실제 환경에서는 API 호출
            // const response = await fetch('../data/clubs.json');
            // this.clubs = await response.json();
            
            // 시뮬레이션 데이터
            this.clubs = this.generateMockData();
            this.filteredClubs = [...this.clubs];
            
            this.updateStats();
            
        } catch (error) {
            console.error('동아리 데이터 로드 실패:', error);
            this.showError();
        }
    }
    
    generateMockData() {
        const categories = ['academic', 'arts', 'sports', 'volunteer', 'hobby'];
        const categoryNames = {
            'academic': '학술/교육',
            'arts': '예술/문화', 
            'sports': '체육/스포츠',
            'volunteer': '봉사/종교',
            'hobby': '취미/여가'
        };
        
        const clubData = [
            {
                id: 1,
                name: '농구동아리 DUNK',
                category: 'sports',
                icon: '🏀',
                description: '농구를 사랑하는 사람들이 모여 실력을 향상시키고 친목을 도모하는 동아리입니다. 정기 경기와 대회 참가를 통해 팀워크를 기릅니다.',
                members: 38,
                schedule: '매주 월, 수, 금 18:00',
                location: '체육관 농구장',
                contact: 'dunk@cu.ac.kr',
                activities: ['농구 경기', '대회 참가', '스킬 훈련'],
                recruiting: true,
                established: 2013,
                requirements: ['농구 관심', '체력']
            },
            {
                id: 9,
                name: '연극동아리 무대',
                category: 'arts',
                icon: '🎭',
                description: '연극 공연을 통해 표현력과 창의성을 키우는 연극 동아리입니다. 정기 공연과 소극장 공연을 진행합니다.',
                members: 42,
                schedule: '매주 수, 금 19:00',
                location: '예술관 소극장',
                contact: 'theater@cu.ac.kr',
                activities: ['연극 공연', '연기 훈련', '무대 제작'],
                recruiting: true,
                established: 2016,
                requirements: ['연기 관심', '표현력']
            },
            {
                id: 10,
                name: '요리동아리 맛나',
                category: 'hobby',
                icon: '🍳',
                description: '다양한 요리를 배우고 맛있는 음식을 나누는 요리 동아리입니다. 세계 각국의 요리를 체험할 수 있습니다.',
                members: 29,
                schedule: '매주 수 18:00',
                location: '생활관 조리실',
                contact: 'cooking@cu.ac.kr',
                activities: ['요리 실습', '레시피 개발', '맛집 탐방'],
                recruiting: false,
                established: 2019,
                requirements: ['요리 관심', '위생 관념']
            },
            {
                id: 11,
                name: '환경지킴이',
                category: 'volunteer',
                icon: '🌱',
                description: '환경보호 캠페인과 친환경 활동을 실천하는 환경 동아리입니다. 지속가능한 미래를 만들어가는 활동을 합니다.',
                members: 56,
                schedule: '매주 일 14:00',
                location: '생명과학관 회의실',
                contact: 'green@cu.ac.kr',
                activities: ['환경 캠페인', '정화 활동', '에코 프로젝트'],
                recruiting: true,
                established: 2018,
                requirements: ['환경 의식', '실천력']
            },
            {
                id: 12,
                name: '클라이밍동아리',
                category: 'sports',
                icon: '🧗',
                description: '실내 클라이밍과 자연암벽 등반을 즐기는 클라이밍 동아리입니다. 안전한 등반 기술을 익히고 도전 정신을 기릅니다.',
                members: 31,
                schedule: '매주 토 10:00',
                location: '체육관 클라이밍장',
                contact: 'climbing@cu.ac.kr',
                activities: ['실내 클라이밍', '야외 등반', '기술 훈련'],
                recruiting: true,
                established: 2021,
                requirements: ['체력', '도전 정신']
            }
        ];
        
        // 각 동아리에 카테고리 이름 추가
        return clubData.map(club => ({
            ...club,
            categoryName: categoryNames[club.category]
        }));
    }
    
    updateStats() {
        const totalClubs = this.clubs.length;
        const recruitingClubs = this.clubs.filter(club => club.recruiting).length;
        const totalMembers = this.clubs.reduce((sum, club) => sum + club.members, 0);
        const categories = [...new Set(this.clubs.map(club => club.category))].length;
        
        // 애니메이션과 함께 숫자 업데이트
        this.animateNumber(this.elements.totalClubs, totalClubs);
        this.animateNumber(this.elements.recruitingClubs, recruitingClubs);
        this.animateNumber(this.elements.totalMembers, totalMembers);
        this.animateNumber(this.elements.categories, categories);
    }
    
    animateNumber(element, targetValue, duration = 1000) {
        const startValue = parseInt(element.textContent) || 0;
        const increment = (targetValue - startValue) / (duration / 16);
        let currentValue = startValue;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if ((increment > 0 && currentValue >= targetValue) || 
                (increment < 0 && currentValue <= targetValue)) {
                element.textContent = targetValue.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentValue).toLocaleString();
            }
        }, 16);
    }
    
    handleSearch(query) {
        this.searchQuery = query.toLowerCase();
        this.currentPage = 1;
        this.applyFilters();
    }
    
    handleCategoryFilter(tab) {
        // 활성 탭 변경
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        this.currentCategory = tab.dataset.category;
        this.currentPage = 1;
        this.applyFilters();
    }
    
    handleKeyboard(e) {
        // 검색 박스 포커스 (Ctrl + K)
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            this.elements.searchBox.focus();
        }
        
        // 페이지 이동 (화살표 키)
        if (e.key === 'ArrowLeft' && e.ctrlKey) {
            e.preventDefault();
            this.changePage(-1);
        } else if (e.key === 'ArrowRight' && e.ctrlKey) {
            e.preventDefault();
            this.changePage(1);
        }
    }
    
    applyFilters() {
        let filtered = [...this.clubs];
        
        // 검색 필터
        if (this.searchQuery) {
            filtered = filtered.filter(club => 
                club.name.toLowerCase().includes(this.searchQuery) ||
                club.description.toLowerCase().includes(this.searchQuery) ||
                club.activities.some(activity => 
                    activity.toLowerCase().includes(this.searchQuery)
                )
            );
        }
        
        // 카테고리 필터
        if (this.currentCategory !== 'all') {
            if (this.currentCategory === 'recruiting') {
                filtered = filtered.filter(club => club.recruiting);
            } else {
                filtered = filtered.filter(club => club.category === this.currentCategory);
            }
        }
        
        // 정렬
        filtered.sort((a, b) => {
            switch (this.currentSort) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'members':
                    return b.members - a.members;
                case 'category':
                    return a.categoryName.localeCompare(b.categoryName);
                case 'newest':
                    return b.established - a.established;
                default:
                    return 0;
            }
        });
        
        this.filteredClubs = filtered;
        this.render();
    }
    
    render() {
        this.hideLoading();
        
        if (this.filteredClubs.length === 0) {
            this.showEmptyState();
            return;
        }
        
        this.hideEmptyState();
        this.renderClubs();
        this.renderPagination();
    }
    
    renderClubs() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const clubsToShow = this.filteredClubs.slice(startIndex, endIndex);
        
        this.elements.clubsGrid.innerHTML = clubsToShow.map(club => 
            this.createClubCard(club)
        ).join('');
        
        // 애니메이션 적용
        this.animateCards();
    }
    
    createClubCard(club) {
        const recruitingBadge = club.recruiting ? 
            '<div class="recruiting-badge">모집중</div>' : 
            '<div class="recruiting-badge closed">모집마감</div>';
        
        return `
            <div class="club-card fade-in-up" data-club-id="${club.id}">
                ${recruitingBadge}
                
                <div class="club-header">
                    <div class="club-icon">${club.icon}</div>
                    <div class="club-info">
                        <div class="club-name">${club.name}</div>
                        <div class="club-category">${club.categoryName}</div>
                    </div>
                </div>
                
                <div class="club-description">${club.description}</div>
                
                <div class="club-details">
                    <div class="club-detail">
                        <span class="club-detail-icon">👥</span>
                        <span>${club.members}명</span>
                    </div>
                    <div class="club-detail">
                        <span class="club-detail-icon">📅</span>
                        <span>${club.schedule}</span>
                    </div>
                    <div class="club-detail">
                        <span class="club-detail-icon">📍</span>
                        <span>${club.location}</span>
                    </div>
                    <div class="club-detail">
                        <span class="club-detail-icon">📧</span>
                        <span>${club.contact}</span>
                    </div>
                </div>
                
                <div class="club-tags">
                    ${club.activities.map(activity => 
                        `<span class="club-tag">${activity}</span>`
                    ).join('')}
                </div>
                
                <div class="club-actions">
                    <button class="club-btn btn-primary" onclick="clubsManager.joinClub(${club.id})">
                        ${club.recruiting ? '가입 신청' : '대기 신청'}
                    </button>
                    <button class="club-btn btn-secondary" onclick="clubsManager.showClubDetail(${club.id})">
                        자세히 보기
                    </button>
                </div>
            </div>
        `;
    }
    
    renderPagination() {
        const totalPages = Math.ceil(this.filteredClubs.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            this.elements.pagination.style.display = 'none';
            return;
        }
        
        this.elements.pagination.style.display = 'flex';
        
        // 이전/다음 버튼 상태
        this.elements.prevBtn.disabled = this.currentPage === 1;
        this.elements.nextBtn.disabled = this.currentPage === totalPages;
        
        // 페이지 번호 생성
        this.elements.pageNumbers.innerHTML = this.generatePageNumbers(totalPages);
    }
    
    generatePageNumbers(totalPages) {
        let pages = [];
        const current = this.currentPage;
        
        // 항상 첫 페이지
        pages.push(1);
        
        // 현재 페이지 주변 페이지들
        for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) {
            if (!pages.includes(i)) {
                pages.push(i);
            }
        }
        
        // 항상 마지막 페이지
        if (totalPages > 1 && !pages.includes(totalPages)) {
            pages.push(totalPages);
        }
        
        return pages.map(page => {
            const isActive = page === current ? 'active' : '';
            return `<button class="pagination-btn ${isActive}" onclick="clubsManager.goToPage(${page})">${page}</button>`;
        }).join('');
    }
    
    changePage(direction) {
        const totalPages = Math.ceil(this.filteredClubs.length / this.itemsPerPage);
        const newPage = this.currentPage + direction;
        
        if (newPage >= 1 && newPage <= totalPages) {
            this.currentPage = newPage;
            this.render();
            this.scrollToTop();
        }
    }
    
    goToPage(page) {
        const totalPages = Math.ceil(this.filteredClubs.length / this.itemsPerPage);
        
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.render();
            this.scrollToTop();
        }
    }
    
    scrollToTop() {
        this.elements.clubsGrid.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
    
    joinClub(clubId) {
        const club = this.clubs.find(c => c.id === clubId);
        if (!club) return;
        
        if (club.recruiting) {
            alert(`${club.name}에 가입 신청이 완료되었습니다!\n담당자가 연락드릴 예정입니다.`);
        } else {
            alert(`${club.name}은 현재 모집이 마감되었습니다.\n다음 모집 시기에 다시 신청해주세요.`);
        }
        
        // 실제 환경에서는 API 호출
        console.log(`동아리 가입 신청: ${club.name}`);
    }
    
    showClubDetail(clubId) {
        const club = this.clubs.find(c => c.id === clubId);
        if (!club) return;
        
        const modalHTML = `
            <div class="modal-overlay" onclick="clubsManager.closeModal()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h2>${club.icon} ${club.name}</h2>
                        <button class="modal-close" onclick="clubsManager.closeModal()">✕</button>
                    </div>
                    <div class="modal-body">
                        <div class="club-detail-grid">
                            <div class="detail-section">
                                <h3>동아리 소개</h3>
                                <p>${club.description}</p>
                            </div>
                            <div class="detail-section">
                                <h3>활동 정보</h3>
                                <ul>
                                    <li><strong>카테고리:</strong> ${club.categoryName}</li>
                                    <li><strong>설립연도:</strong> ${club.established}년</li>
                                    <li><strong>현재 멤버:</strong> ${club.members}명</li>
                                    <li><strong>모집 상태:</strong> ${club.recruiting ? '모집중' : '모집마감'}</li>
                                </ul>
                            </div>
                            <div class="detail-section">
                                <h3>활동 시간 및 장소</h3>
                                <ul>
                                    <li><strong>정기 모임:</strong> ${club.schedule}</li>
                                    <li><strong>활동 장소:</strong> ${club.location}</li>
                                    <li><strong>연락처:</strong> ${club.contact}</li>
                                </ul>
                            </div>
                            <div class="detail-section">
                                <h3>주요 활동</h3>
                                <div class="activities-tags">
                                    ${club.activities.map(activity => 
                                        `<span class="activity-tag">${activity}</span>`
                                    ).join('')}
                                </div>
                            </div>
                            <div class="detail-section">
                                <h3>가입 요건</h3>
                                <ul>
                                    ${club.requirements.map(req => `<li>${req}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                        <div class="modal-actions">
                            <button class="club-btn btn-primary" onclick="clubsManager.joinClub(${club.id})">
                                ${club.recruiting ? '가입 신청하기' : '대기 신청하기'}
                            </button>
                            <button class="club-btn btn-secondary" onclick="clubsManager.closeModal()">
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 모달 스타일 추가
        if (!document.getElementById('modal-styles')) {
            const modalStyles = document.createElement('style');
            modalStyles.id = 'modal-styles';
            modalStyles.textContent = `
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    padding: 20px;
                }
                .modal-content {
                    background: var(--bg-primary);
                    border: 1px solid var(--glass-border);
                    border-radius: 20px;
                    max-width: 800px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                    animation: modalSlideIn 0.3s ease;
                }
                @keyframes modalSlideIn {
                    from { opacity: 0; transform: scale(0.9) translateY(-20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 30px 30px 20px 30px;
                    border-bottom: 1px solid var(--glass-border);
                }
                .modal-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    color: var(--text-secondary);
                    cursor: pointer;
                }
                .modal-body { padding: 30px; }
                .detail-section {
                    margin-bottom: 30px;
                }
                .detail-section h3 {
                    color: var(--accent-color);
                    margin-bottom: 15px;
                    font-size: 18px;
                }
                .detail-section ul {
                    list-style: none;
                    padding: 0;
                }
                .detail-section li {
                    padding: 5px 0;
                    color: var(--text-secondary);
                }
                .activities-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                }
                .activity-tag {
                    background: var(--card-hover);
                    color: var(--accent-color);
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 500;
                }
                .modal-actions {
                    display: flex;
                    gap: 15px;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid var(--glass-border);
                }
            `;
            document.head.appendChild(modalStyles);
        }
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    }
    
    hideLoading() {
        this.elements.loadingClubs.style.display = 'none';
    }
    
    showEmptyState() {
        this.elements.emptyState.style.display = 'block';
        this.elements.pagination.style.display = 'none';
    }
    
    hideEmptyState() {
        this.elements.emptyState.style.display = 'none';
    }
    
    showError() {
        this.elements.clubsGrid.innerHTML = `
            <div class="error-state">
                <div class="error-icon">⚠️</div>
                <h3>데이터를 불러올 수 없습니다</h3>
                <p>잠시 후 다시 시도해주세요.</p>
                <button class="club-btn btn-primary" onclick="location.reload()">새로고침</button>
            </div>
        `;
    }
    
    animateCards() {
        const cards = document.querySelectorAll('.club-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 100);
        });
    }
    
    startAnimations() {
        // 통계 카드 애니메이션
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 200);
        });
        
        // 검색 필터 애니메이션
        setTimeout(() => {
            document.querySelector('.search-filter-container').classList.add('visible');
        }, 500);
    }
    
    handleScroll() {
        const elements = document.querySelectorAll('.fade-in-up:not(.visible)');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - 50) {
                element.classList.add('visible');
            }
        });
    }
    
    debounce(func, wait) {
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
}

// 전역 변수로 내보내기
let clubsManager;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    clubsManager = new ClubsManager();
});

// 전역 함수들
function changePage(direction) {
    if (clubsManager) {
        clubsManager.changePage(direction);
    }
}

function goToPage(page) {
    if (clubsManager) {
        clubsManager.goToPage(page);
    }
}

// 스크롤 진행률 업데이트
function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    if (progressBar) {
        progressBar.style.width = Math.min(100, Math.max(0, scrollPercent)) + '%';
    }
}

window.addEventListener('scroll', updateProgressBar);

// 키보드 단축키 안내
document.addEventListener('keydown', function(e) {
    if (e.key === '?' && e.shiftKey) {
        alert(`동아리 페이지 단축키:
        
• Ctrl + K: 검색 박스 포커스
• Ctrl + ←/→: 페이지 이동
• Shift + ?: 이 도움말 보기`);
    }
});

console.log('동아리 페이지 스크립트 로드 완료'); '멋쟁이사자처럼',
                category: 'academic',
                icon: '💻',
                description: '프로그래밍과 웹 개발을 배우고 실제 서비스를 만드는 개발 동아리입니다. React, Node.js 등 최신 기술을 활용한 프로젝트를 진행합니다.',
                members: 152,
                schedule: '매주 화, 목 19:00',
                location: '공학관 301호',
                contact: 'likelion@cu.ac.kr',
                activities: ['웹 개발', '앱 개발', '해커톤'],
                recruiting: true,
                established: 2018,
                requirements: ['프로그래밍 기초', '협업 의지']
            },
            {
                id: 2,
                name: '밴드동아리 ECHO',
                category: 'arts',
                icon: '🎵',
                description: '다양한 장르의 음악을 연주하고 공연하는 밴드 동아리입니다. 정기 공연과 축제 참여를 통해 실력을 향상시킵니다.',
                members: 89,
                schedule: '매주 화, 목, 토 20:00',
                location: '학생회관 지하 연습실',
                contact: 'echo@cu.ac.kr',
                activities: ['정기 공연', '버스킹', '음악 축제'],
                recruiting: true,
                established: 2015,
                requirements: ['악기 연주 가능', '음악 열정']
            },
            {
                id: 3,
                name: '사진동아리 렌즈',
                category: 'arts',
                icon: '📸',
                description: '사진 촬영 기법을 배우고 전시회를 개최하는 사진 동아리입니다. 인물, 풍경, 스트리트 포토그래피 등 다양한 분야를 다룹니다.',
                members: 76,
                schedule: '매주 일 14:00',
                location: '예술관 스튜디오',
                contact: 'lens@cu.ac.kr',
                activities: ['출사', '전시회', '포토 워크샵'],
                recruiting: false,
                established: 2019,
                requirements: ['카메라 보유', '사진 관심']
            },
            {
                id: 4,
                name: '러닝크루',
                category: 'sports',
                icon: '🏃',
                description: '건강한 러닝 문화를 만들고 마라톤 대회 참가를 목표로 하는 동아리입니다. 초보자부터 숙련자까지 모두 환영합니다.',
                members: 64,
                schedule: '매주 화, 목 06:30',
                location: '캠퍼스 운동장',
                contact: 'running@cu.ac.kr',
                activities: ['러닝', '마라톤 대회', '트레이닝'],
                recruiting: true,
                established: 2020,
                requirements: ['기본 체력', '꾸준함']
            },
            {
                id: 5,
                name: '청년봉사단',
                category: 'volunteer',
                icon: '🤝',
                description: '지역사회 봉사활동과 사회적 가치 실현을 위한 봉사 동아리입니다. 다양한 봉사 프로그램에 참여할 수 있습니다.',
                members: 93,
                schedule: '매주 토 09:00',
                location: '학생회관 회의실',
                contact: 'volunteer@cu.ac.kr',
                activities: ['지역 봉사', '해외 봉사', '캠페인'],
                recruiting: true,
                established: 2016,
                requirements: ['봉사 정신', '책임감']
            },
            {
                id: 6,
                name: '게임동아리 PLAY',
                category: 'hobby',
                icon: '🎮',
                description: '다양한 게임을 즐기고 e스포츠 대회 참가를 목표로 하는 게임 동아리입니다. PC게임부터 보드게임까지 다룹니다.',
                members: 78,
                schedule: '매주 목, 토 19:00',
                location: '학생회관 게임룸',
                contact: 'play@cu.ac.kr',
                activities: ['게임 대회', 'e스포츠', '보드게임'],
                recruiting: true,
                established: 2017,
                requirements: ['게임 관심', '팀워크']
            },
            {
                id: 7,
                name: '영어토론동아리',
                category: 'academic',
                icon: '🗣️',
                description: '영어 실력 향상과 논리적 사고력 개발을 위한 토론 동아리입니다. 다양한 주제로 토론하며 글로벌 역량을 기릅니다.',
                members: 45,
                schedule: '매주 금 19:30',
                location: '어학관 토론실',
                contact: 'debate@cu.ac.kr',
                activities: ['영어 토론', '프레젠테이션', '모의 유엔'],
                recruiting: false,
                established: 2014,
                requirements: ['영어 중급 이상', '토론 관심']
            },
            {
                id: 8,
                name:
