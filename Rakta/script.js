/* ==========================================================================
   RAKTA DHATU 3D MEDICAL VISUALIZATION INTERACTIVE ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const btnFrontView = document.getElementById('btn-front-view');
    const btnBackView = document.getElementById('btn-back-view');
    const modelImgFront = document.getElementById('model-image-front');
    const modelImgBack = document.getElementById('model-image-back');
    const imageViewer = document.getElementById('image-viewer');
    const viewportWrapper = document.getElementById('viewport-wrapper');
    const canvas = document.getElementById('blood-particle-canvas');
    const ctx = canvas.getContext('2d');

    // Controls
    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');
    const btnReset = document.getElementById('btn-reset');
    const btnParticles = document.getElementById('btn-particles');
    const btnPulse = document.getElementById('btn-pulse');

    // Mode Pills
    const modePills = document.querySelectorAll('.mode-pill');
    
    // Tab Buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Hotspot Pins
    const frontHotspots = document.querySelectorAll('.front-hotspot');
    const backHotspots = document.querySelectorAll('.back-hotspot');

    // Meters
    const valOxy = document.getElementById('val-oxy');
    const valFlow = document.getElementById('val-flow');

    // State Variables
    let currentView = 'front';
    let currentMode = 'all';
    let zoomLevel = 1;
    let panX = 0;
    let panY = 0;
    let isDragging = false;
    let startX, startY;
    let particlesEnabled = true;
    let pulseActive = false;
    let animationFrameId;

    /* --------------------------------------------------------------------------
       1. View Switching (Anterior Front / Posterior Back)
       -------------------------------------------------------------------------- */
    function setView(view) {
        currentView = view;
        if (view === 'front') {
            btnFrontView.classList.add('active');
            btnBackView.classList.remove('active');
            modelImgFront.classList.add('active');
            modelImgBack.classList.remove('active');

            frontHotspots.forEach(h => h.classList.remove('hidden'));
            backHotspots.forEach(h => h.classList.add('hidden'));
        } else {
            btnBackView.classList.add('active');
            btnFrontView.classList.remove('active');
            modelImgBack.classList.add('active');
            modelImgFront.classList.remove('active');

            backHotspots.forEach(h => h.classList.remove('hidden'));
            frontHotspots.forEach(h => h.classList.add('hidden'));
        }
    }

    btnFrontView.addEventListener('click', () => setView('front'));
    btnBackView.addEventListener('click', () => setView('back'));

    /* --------------------------------------------------------------------------
       2. Render Filters / Layer Modes
       -------------------------------------------------------------------------- */
    modePills.forEach(pill => {
        pill.addEventListener('click', () => {
            modePills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentMode = pill.id.replace('mode-', '');
            applyRenderFilters();
        });
    });

    function applyRenderFilters() {
        const activeImg = currentView === 'front' ? modelImgFront : modelImgBack;
        
        switch (currentMode) {
            case 'all':
                modelImgFront.style.filter = 'none';
                modelImgBack.style.filter = 'none';
                break;
            case 'rakta':
                // Enhance crimson red vascular contrast
                activeImg.style.filter = 'contrast(1.35) saturate(1.8) brightness(1.05)';
                break;
            case 'heart':
                // Focus on thoracic cardiac & aortic arch region
                activeImg.style.filter = 'contrast(1.2) saturate(1.5) drop-shadow(0 0 15px rgba(255,23,68,0.8))';
                break;
            case 'skeleton':
                // Subdue red hue to emphasize bone structure
                activeImg.style.filter = 'saturate(0.35) contrast(1.2) brightness(1.1)';
                break;
        }
    }

    /* --------------------------------------------------------------------------
       3. Zoom & Pan Interactive Viewport
       -------------------------------------------------------------------------- */
    function updateTransform() {
        imageViewer.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
    }

    btnZoomIn.addEventListener('click', () => {
        zoomLevel = Math.min(zoomLevel + 0.25, 2.8);
        updateTransform();
    });

    btnZoomOut.addEventListener('click', () => {
        zoomLevel = Math.max(zoomLevel - 0.25, 0.8);
        updateTransform();
    });

    btnReset.addEventListener('click', () => {
        zoomLevel = 1;
        panX = 0;
        panY = 0;
        updateTransform();
    });

    viewportWrapper.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        zoomLevel = Math.min(Math.max(zoomLevel + delta, 0.8), 2.8);
        updateTransform();
    });

    viewportWrapper.addEventListener('mousedown', (e) => {
        if (e.target.closest('.hud-controls') || e.target.closest('.pin')) return;
        isDragging = true;
        startX = e.clientX - panX;
        startY = e.clientY - panY;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        panX = e.clientX - startX;
        panY = e.clientY - startY;
        updateTransform();
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    /* --------------------------------------------------------------------------
       4. Heartbeat Pulse & Particle Controls
       -------------------------------------------------------------------------- */
    btnPulse.addEventListener('click', () => {
        pulseActive = !pulseActive;
        btnPulse.classList.toggle('active', pulseActive);
        if (pulseActive) {
            valFlow.textContent = "2.4 m/s (Systolic)";
            valOxy.textContent = "99.4%";
            modelImgFront.style.animation = "heartPulse 1.2s infinite ease-in-out";
        } else {
            valFlow.textContent = "1.2 m/s";
            valOxy.textContent = "98.2%";
            modelImgFront.style.animation = "none";
        }
    });

    btnParticles.addEventListener('click', () => {
        particlesEnabled = !particlesEnabled;
        btnParticles.classList.toggle('active', particlesEnabled);
        canvas.style.display = particlesEnabled ? 'block' : 'none';
    });

    /* --------------------------------------------------------------------------
       5. Clinical Tabs Switcher
       -------------------------------------------------------------------------- */
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const tabId = `tab-${btn.dataset.tab}`;
            document.getElementById(tabId).classList.add('active');
        });
    });

    /* --------------------------------------------------------------------------
       6. HTML5 Micro Blood Cell Particle Canvas Simulation
       -------------------------------------------------------------------------- */
    function resizeCanvas() {
        canvas.width = viewportWrapper.clientWidth;
        canvas.height = viewportWrapper.clientHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class BloodParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = canvas.width / 2 + (Math.random() - 0.5) * (canvas.width * 0.3);
            this.y = canvas.height * 0.15 + Math.random() * (canvas.height * 0.7);
            this.radius = Math.random() * 2 + 1;
            this.speedY = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.6;
            this.alpha = Math.random() * 0.7 + 0.3;
            this.pulsePhase = Math.random() * Math.PI * 2;
        }

        update() {
            const currentSpeed = pulseActive ? this.speedY * 2.2 : this.speedY;
            this.y += currentSpeed;
            this.x += this.speedX + Math.sin(this.y * 0.02) * 0.4;
            this.pulsePhase += 0.05;

            // Reset when reaching bottom or edges
            if (this.y > canvas.height * 0.9 || this.x < 0 || this.x > canvas.width) {
                this.reset();
                this.y = canvas.height * 0.15;
            }
        }

        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2);
            gradient.addColorStop(0, `rgba(255, 82, 82, ${this.alpha})`);
            gradient.addColorStop(0.6, `rgba(255, 23, 68, ${this.alpha * 0.8})`);
            gradient.addColorStop(1, 'rgba(198, 40, 40, 0)');
            
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.restore();
        }
    }

    const particles = Array.from({ length: 65 }, () => new BloodParticle());

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (particlesEnabled) {
            particles.forEach(p => {
                p.update();
                p.draw();
            });
        }
        
        animationFrameId = requestAnimationFrame(animateParticles);
    }

    animateParticles();
});
