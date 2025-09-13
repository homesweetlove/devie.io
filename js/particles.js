// 파티클 시스템 클래스
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.colors = ['#2563eb', '#1d4ed8', '#ffffff'];
        this.isActive = true;
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        this.resize();
        this.createInitialParticles();
    }
    
    setupEventListeners() {
        // 리사이즈 이벤트
        window.addEventListener('resize', () => this.resize());
        
        // 마우스 이벤트
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('click', (e) => this.handleClick(e));
        
        // 성능 최적화를 위한 가시성 API
        document.addEventListener('visibilitychange', () => {
            this.isActive = !document.hidden;
        });
    }
    
    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        this.ctx.scale(dpr, dpr);
    }
    
    createInitialParticles() {
        const particleCount = Math.min(50, Math.floor((window.innerWidth * window.innerHeight) / 20000));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    createParticle(x = null, y = null) {
        return {
            x: x !== null ? x : Math.random() * window.innerWidth,
            y: y !== null ? y : Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
            size: Math.random() * 2 + 1,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            life: 1,
            decay: Math.random() * 0.01 + 0.005,
            opacity: Math.random() * 0.5 + 0.3
        };
    }
    
    handleMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        
        // 마우스 근처에 파티클 생성 (확률적)
        if (Math.random() < 0.1 && this.particles.length < 100) {
            this.addParticle(e.clientX, e.clientY);
        }
    }
    
    handleClick(e) {
        // 클릭 시 여러 파티클 생성
        for (let i = 0; i < 5; i++) {
            const offsetX = (Math.random() - 0.5) * 50;
            const offsetY = (Math.random() - 0.5) * 50;
            this.addParticle(e.clientX + offsetX, e.clientY + offsetY);
        }
    }
    
    addParticle(x, y) {
        if (this.particles.length < 150) {
            const particle = this.createParticle(x, y);
            // 클릭으로 생성된 파티클은 더 큰 초기 속도
            particle.vx = (Math.random() - 0.5) * 3;
            particle.vy = (Math.random() - 0.5) * 3;
            this.particles.push(particle);
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // 마우스와의 상호작용
            this.handleMouseInteraction(particle);
            
            // 위치 업데이트
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // 마찰 적용
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            
            // 경계 처리 (래핑)
            this.handleBoundaries(particle);
            
            // 생명주기 관리
            particle.life -= particle.decay;
            
            // 파티클 제거
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // 최소 파티클 수 유지
        const minParticles = Math.min(30, Math.floor(window.innerWidth / 50));
        while (this.particles.length < minParticles) {
            this.particles.push(this.createParticle());
        }
    }
    
    handleMouseInteraction(particle) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            const force = (100 - distance) / 100;
            particle.vx += (dx / distance) * force * 0.3;
            particle.vy += (dy / distance) * force * 0.3;
        }
    }
    
    handleBoundaries(particle) {
        if (particle.x < -10) particle.x = window.innerWidth + 10;
        if (particle.x > window.innerWidth + 10) particle.x = -10;
        if (particle.y < -10) particle.y = window.innerHeight + 10;
        if (particle.y > window.innerHeight + 10) particle.y = -10;
    }
    
    drawParticles() {
        // 캔버스 클리어
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        
        // 파티클 그리기
        for (const particle of this.particles) {
            this.drawParticle(particle);
        }
        
        // 연결선 그리기 (성능을 위해 제한)
        if (this.particles.length < 80) {
            this.drawConnections();
        }
    }
    
    drawParticle(particle) {
        this.ctx.save();
        this.ctx.globalAlpha = particle.life * particle.opacity;
        this.ctx.fillStyle = particle.color;
        this.ctx.shadowBlur = 5;
        this.ctx.shadowColor = particle.color;
        
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }
    
    drawConnections() {
        this.ctx.strokeStyle = 'rgba(37, 99, 235, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const particle1 = this.particles[i];
                const particle2 = this.particles[j];
                
                const dx = particle1.x - particle2.x;
                const dy = particle1.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 80) {
                    this.ctx.save();
                    this.ctx.globalAlpha = (80 - distance) / 80 * 0.3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle1.x, particle1.y);
                    this.ctx.lineTo(particle2.x, particle2.y);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            }
        }
    }
    
    animate() {
        if (this.isActive) {
            this.updateParticles();
            this.drawParticles();
        }
        
        requestAnimationFrame(() => this.animate());
    }
    
    // 테마 변경 시 색상 업데이트
    updateColors(newColors) {
        this.colors = newColors;
        // 기존 파티클들의 색상도 업데이트
        this.particles.forEach(particle => {
            particle.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        });
    }
    
    // 파티클 시스템 일시 정지/재시작
    pause() {
        this.isActive = false;
    }
    
    resume() {
        this.isActive = true;
    }
    
    // 파티클 시스템 정리
    destroy() {
        this.particles = [];
        window.removeEventListener('resize', this.resize);
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('click', this.handleClick);
    }
}

// 파티클 시스템 매니저
class ParticleManager {
    constructor() {
        this.system = null;
        this.isEnabled = true;
    }
    
    init() {
        const canvas = document.getElementById('particleCanvas');
        if (canvas && this.isEnabled) {
            this.system = new ParticleSystem(canvas);
            console.log('파티클 시스템이 초기화되었습니다.');
        }
    }
    
    updateTheme(isDark) {
        if (this.system) {
            const colors = isDark 
                ? ['#2563eb', '#1d4ed8', '#ffffff']
                : ['#2563eb', '#1d4ed8', '#333333'];
            this.system.updateColors(colors);
        }
    }
    
    toggle() {
        if (this.system) {
            this.isEnabled = !this.isEnabled;
            if (this.isEnabled) {
                this.system.resume();
            } else {
                this.system.pause();
            }
        }
    }
    
    destroy() {
        if (this.system) {
            this.system.destroy();
            this.system = null;
        }
    }
}

// 전역 파티클 매니저 인스턴스
const particleManager = new ParticleManager();

// 페이지 로드 시 파티클 시스템 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 성능을 고려하여 지연 초기화
    setTimeout(() => {
        particleManager.init();
    }, 500);
});

// 성능 최적화를 위한 설정
const performanceConfig = {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    lowEndDevice: navigator.hardwareConcurrency < 4 || navigator.deviceMemory < 4
};

// 저사양 기기에서는 파티클 수 제한
if (performanceConfig.lowEndDevice) {
    console.log('저사양 기기 감지: 파티클 효과를 최적화합니다.');
}

// 전역 접근을 위한 export
window.ParticleManager = particleManager;
