document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const btnFront = document.getElementById('btn-front-view');
    const btnBack = document.getElementById('btn-back-view');
    const imgFront = document.getElementById('model-image-front');
    const imgBack = document.getElementById('model-image-back');
    const imageViewer = document.getElementById('image-viewer');

    const modePills = document.querySelectorAll('.mode-pill');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');
    const btnReset = document.getElementById('btn-reset');
    const btnParticles = document.getElementById('btn-particles');

    const canvas = document.getElementById('fluid-particle-canvas');
    const ctx = canvas.getContext('2d');

    // State
    let currentView = 'front'; // 'front' | 'back'
    let currentMode = 'all';  // 'all' | 'rasa' | 'skeleton'
    let zoomLevel = 1.0;
    let particlesEnabled = true;

    // View Switching
    function setView(view) {
        if (currentView === view) return;
        currentView = view;

        if (view === 'front') {
            btnFront.classList.add('active');
            btnBack.classList.remove('active');
            imgFront.classList.add('active');
            imgBack.classList.remove('active');
        } else {
            btnBack.classList.add('active');
            btnFront.classList.remove('active');
            imgBack.classList.add('active');
            imgFront.classList.remove('active');
        }
    }

    btnFront.addEventListener('click', () => setView('front'));
    btnBack.addEventListener('click', () => setView('back'));

    // Mode Switching (Filter effects)
    modePills.forEach(pill => {
        pill.addEventListener('click', () => {
            modePills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentMode = pill.id.replace('mode-', '');

            const activeImg = currentView === 'front' ? imgFront : imgBack;

            if (currentMode === 'rasa') {
                imgFront.style.filter = 'drop-shadow(0 0 35px #00f0ff) saturate(1.8) hue-rotate(5deg)';
                imgBack.style.filter = 'drop-shadow(0 0 35px #00f0ff) saturate(1.8) hue-rotate(5deg)';
            } else if (currentMode === 'skeleton') {
                imgFront.style.filter = 'contrast(1.4) brightness(1.2) grayscale(0.5)';
                imgBack.style.filter = 'contrast(1.4) brightness(1.2) grayscale(0.5)';
            } else {
                imgFront.style.filter = 'drop-shadow(0 0 25px rgba(0, 240, 255, 0.25))';
                imgBack.style.filter = 'drop-shadow(0 0 25px rgba(0, 240, 255, 0.25))';
            }
        });
    });

    // Zoom Controls
    function updateTransform() {
        imageViewer.style.transform = `scale(${zoomLevel})`;
    }

    btnZoomIn.addEventListener('click', () => {
        if (zoomLevel < 2.2) {
            zoomLevel += 0.2;
            updateTransform();
        }
    });

    btnZoomOut.addEventListener('click', () => {
        if (zoomLevel > 0.7) {
            zoomLevel -= 0.2;
            updateTransform();
        }
    });

    btnReset.addEventListener('click', () => {
        zoomLevel = 1.0;
        updateTransform();
    });

    // Clinical Tabs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetId = `tab-${btn.getAttribute('data-tab')}`;
            const targetTab = document.getElementById(targetId);
            if (targetTab) targetTab.classList.add('active');
        });
    });

    // Particle Overlay Animation
    let particles = [];
    const particleCount = 60;

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = canvas.width * (0.35 + Math.random() * 0.3); // constrained around body silhouette center
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * 1.8 + 0.5;
            this.speedY = -(Math.random() * 0.8 + 0.2); // upward flow like chyle/plasma movement
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.alpha = Math.random() * 0.6 + 0.2;
            this.pulse = Math.random() * 0.02;
        }

        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.y * 0.02) * 0.5 + this.speedX;
            this.alpha += Math.sin(Date.now() * 0.003 + this.x) * 0.005;

            if (this.y < 0 || this.alpha <= 0) {
                this.reset();
                this.y = canvas.height;
            }
        }

        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 240, 255, ${Math.max(0.1, Math.min(0.9, this.alpha))})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00f0ff';
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (particlesEnabled) {
            particles.forEach(p => {
                p.update();
                p.draw();
            });
        }

        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    btnParticles.addEventListener('click', () => {
        particlesEnabled = !particlesEnabled;
        btnParticles.style.opacity = particlesEnabled ? '1' : '0.4';
    });
});
