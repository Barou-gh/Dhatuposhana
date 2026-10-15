/**
 * SHUKRA DHATU 3D MEDICAL VISUALIZER & ANATOMICAL INSPECTOR
 * Interactive logic for Front/Back views, Canvas overlays, Hotspots, Flow simulation & Inspector
 */

document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // ANATOMICAL STRUCTURE DATABASE (FRONT & BACK VIEWS)
    // =========================================================================
    const structuresData = [
        {
            id: 'testes',
            name: 'Testes (Vrishana)',
            sanskrit: 'वृषण (Vrishana)',
            category: 'Primary Reproductive Gland',
            type: 'Primary Sex Organ / Gland',
            location: 'Scrotal Sac (Pelvic Superior Origin)',
            secretion: 'Spermatozoa & Testosterone',
            srotas: 'Shukravaha Srotas Mula',
            quality: 'Ivory-Pearlescent, Soft, Glandular',
            vessels: 'Testicular Artery & Pampiniform Plexus',
            views: ['front', 'back'],
            frontHotspot: { x: 500, y: 775, radius: 26, label: 'Testes (Vrishana)' },
            backHotspot: { x: 500, y: 765, radius: 26, label: 'Testes (Posterior)' },
            anatomyDesc: 'Pair of ovoid glandular organs enclosed within the scrotal sac. Covered by tunica albuginea and tunica vaginalis. Internally divided into 200–300 testicular lobules containing 1–4 highly coiled seminiferous tubules responsible for spermatogenesis.',
            shukraDesc: 'Recognized in Ayurveda as the root locus (Mula) of Shukra-Vaha Srotas. Here, the metabolic essence of Majja Dhatu is refined by Shukra-Agni into potent sperm cells and reproductive fluid.',
            ductPath: [
                'Seminiferous Tubules (Spermatogenesis)',
                'Straight Tubules (Tubuli Recti) & Rete Testis',
                'Efferent Ductules leading to Epididymis'
            ]
        },
        {
            id: 'epididymis',
            name: 'Epididymis (Head, Body, Tail)',
            sanskrit: 'शुक्र-परिपक्वता कोश (Epididymis)',
            category: 'Ductal Maturation System',
            type: 'Convoluted Ductal Organ',
            location: 'Posterolateral Aspect of Each Testis',
            secretion: 'Maturation Factors & Glycoproteins',
            srotas: 'Shukravaha Marga',
            quality: 'Dense Coiled Tubule, Off-White',
            vessels: 'Epididymal Branches of Testicular Artery',
            views: ['front', 'back'],
            frontHotspot: { x: 440, y: 760, radius: 18, label: 'Epididymis' },
            backHotspot: { x: 440, y: 750, radius: 18, label: 'Epididymis (Posterior)' },
            anatomyDesc: 'Crescent-shaped organ approximately 6 cm in length, tightly packed with a 6-meter convoluted duct. Divided into Caput (Head), Corpus (Body), and Cauda (Tail). Serves as the site for sperm storage and functional maturation (acquisition of forward motility).',
            shukraDesc: 'Acts as the maturation vessel for Shukra Dhatu, where immature immotile sperm gain full reproductive potency (Samartha Shukra) prior to transit.',
            ductPath: [
                'Receives sperm from Efferent Ductules at Caput',
                '12–14 day transit through Corpus for motility maturation',
                'Storage in Cauda until muscular peristaltic propulsion during ejaculation'
            ]
        },
        {
            id: 'vas_deferens',
            name: 'Vas Deferens (Reto-Vahi Dhamani)',
            sanskrit: 'रेतोवाही धमनी (Vas Deferens)',
            category: 'Reproductive Duct System',
            type: 'Thick Muscular Conduction Duct',
            location: 'Extends from Scrotum through Inguinal Canal to Pelvis',
            secretion: 'Peristaltic Sperm Transport',
            srotas: 'Shukravaha Srotas Channel',
            quality: 'Firm Cord-like Muscular Tube',
            vessels: 'Artery to Vas Deferens (from Superior Vesical)',
            views: ['front', 'back'],
            frontHotspot: { x: 450, y: 640, radius: 18, label: 'Vas Deferens' },
            backHotspot: { x: 450, y: 630, radius: 18, label: 'Vas Deferens (Posterior)' },
            anatomyDesc: 'Thick-walled muscular tube approximately 45 cm long. Travels upward in the spermatic cord through the inguinal canal, loops over the ureter, and expands into the Ampulla behind the urinary bladder.',
            shukraDesc: 'The primary anatomical passage of Shukravaha Srotas, providing rapid peristaltic propulsion of refined Shukra fluid into the ejaculatory apparatus.',
            ductPath: [
                'Cauda Epididymis &rarr; Spermatic Cord',
                'Inguinal Canal &rarr; Pelvic Cavity',
                'Joins Seminal Vesicle Duct at Ampulla'
            ]
        },
        {
            id: 'seminal_vesicles',
            name: 'Seminal Vesicles (Shukrashaya)',
            sanskrit: 'शुक्राशय (Seminal Vesicles)',
            category: 'Accessory Reproductive Gland',
            type: 'Pair of Sacculated Tubular Glands',
            location: 'Posterior to Urinary Bladder, Superior to Prostate',
            secretion: 'Fructose-rich Alkaline Seminal Fluid (60% volume)',
            srotas: 'Shukra Nourishment Gland',
            quality: 'Lobulated, Warm Creamy-White',
            vessels: 'Inferior Vesical & Middle Rectal Arteries',
            views: ['front', 'back'],
            frontHotspot: { x: 480, y: 600, radius: 18, label: 'Seminal Vesicles' },
            backHotspot: { x: 500, y: 600, radius: 20, label: 'Seminal Vesicles (Back)' },
            anatomyDesc: 'Pair of elongated, lobulated pouch-like glands (5 cm long) situated between the base of the bladder and the rectum. Produces an alkaline, fructose-rich fluid containing prostaglandins and clotting proteins.',
            shukraDesc: 'Provides the nutritive matrix (Madhura Rasa) for sperm survival, neutralizing vaginal acidity and supplying energy for flagellar motility.',
            ductPath: [
                'Excretory Duct joins Vas Deferens Ampulla',
                'Forms Ejaculatory Duct penetrating Prostate gland'
            ]
        },
        {
            id: 'prostate',
            name: 'Prostate Gland (Preshtha / Paurusha Granthi)',
            sanskrit: 'पौरुष ग्रन्थि / प्रेष्ट (Prostate Gland)',
            category: 'Accessory Pelvic Gland',
            type: 'Fibromuscular Glandular Organ',
            location: 'Inferior to Bladder Neck, Encircling Prostatic Urethra',
            secretion: 'Proteolytic Enzymes, Zinc, Citric Acid, PSA (30% volume)',
            srotas: 'Pelvic Glandular Complex',
            quality: 'Firm Chestnut-Sized Organ, Soft Warm Pink-Ivory',
            vessels: 'Internal Pudendal & Inferior Vesical Arteries',
            views: ['front', 'back'],
            frontHotspot: { x: 500, y: 650, radius: 22, label: 'Prostate Gland' },
            backHotspot: { x: 500, y: 660, radius: 22, label: 'Prostate Gland (Back)' },
            anatomyDesc: 'Chestnut-sized muscular and glandular organ located directly beneath the bladder neck. Contains 30–50 tubuloalveolar glands secreting thin, milky fluid essential for seminal liquefaction and sperm activation.',
            shukraDesc: 'Ensures optimal fluidity (Dravata) and enzymatic activation of Shukra essence, allowing swift migration through the female tract.',
            ductPath: [
                'Prostatic ducts open directly into the Prostatic Urethra',
                'Combines with ampullary and seminal vesicle fluids during emission'
            ]
        },
        {
            id: 'urethra',
            name: 'Urethra & Ejaculatory Ducts',
            sanskrit: 'मूत्र-शुक्र मार्ग (Urethra)',
            category: 'Urogenital Conduction Canal',
            type: 'Musculo-Membranous Tube',
            location: 'Extends from Bladder Neck through Prostate & Penis',
            secretion: 'Conduction of Urine & Seminal Ejaculate',
            srotas: 'Smitanta (Opening)',
            quality: 'Smooth Mucosal Lining with Sphincter Controls',
            vessels: 'Urethral Artery & Internal Pudendal Plexus',
            views: ['front', 'back'],
            frontHotspot: { x: 500, y: 700, radius: 16, label: 'Urethra & Duct' },
            backHotspot: { x: 500, y: 705, radius: 16, label: 'Prostatic Canal' },
            anatomyDesc: 'Terminal urogenital duct divided into Prostatic, Membranous, and Spongy (Penile) sections. Ejaculatory ducts enter at the verumontanum in the prostatic urethra.',
            shukraDesc: 'The final shared highway (Srotas Mukha) transmitting Shukra out of the body for Garbhadhana (Conception).',
            ductPath: [
                'Prostatic Urethra &rarr; Membranous Urethra',
                'Spongy Penile Urethra &rarr; External Urethral Meatus'
            ]
        },
        {
            id: 'pelvis',
            name: 'Pelvic Skeleton (Asthi Ring)',
            sanskrit: 'श्रोणि अस्थि (Pelvic Bone)',
            category: 'Osteo-Skeletal Structural Framework',
            type: 'Cortical Bone Ring',
            location: 'Inferior Trunk / Pelvic Basin',
            secretion: 'Bone Marrow (Majja Dhatu Context)',
            srotas: 'Asthivaha & Majjavaha Srotas',
            quality: 'Off-White Ivory, Dense Cortical Surface',
            vessels: 'Internal Iliac Artery & Pelvic Vascular Network',
            views: ['front', 'back'],
            frontHotspot: { x: 410, y: 580, radius: 24, label: 'Pelvic Ilium' },
            backHotspot: { x: 410, y: 570, radius: 24, label: 'Pelvic Sacrum' },
            anatomyDesc: 'Composed of paired Os Coxae (Ilium, Ischium, Pubis) connected anteriorly at the Pubic Symphysis and posteriorly to the Sacrum. Encloses and protects the reproductive glands, pelvic plexus, and urinary bladder.',
            shukraDesc: 'Provides the rigid protective basin (Asthi container) holding the delicate Shukra-generating glands and spermatic cord pathways.',
            ductPath: [
                'Pubic Rami anchor Urogenital Diaphragm',
                'Ischial Tuberosities support Pelvic Floor Muscles'
            ]
        },
        {
            id: 'kidneys',
            name: 'Kidneys & Adrenals (Vrikka)',
            sanskrit: 'वृक्क (Kidneys)',
            category: 'Upper Retroperitoneal Organs',
            type: 'Bean-shaped Excretory Glands',
            location: 'Retroperitoneal T12–L3',
            secretion: 'Urine & Hormones (Renin, Erythropoietin)',
            srotas: 'Mutravaha & Udakavaha Srotas',
            quality: 'Deep Red-Brown Parenchyma, Translucent Capsule',
            vessels: 'Renal Arteries & Renal Veins',
            views: ['front', 'back'],
            frontHotspot: { x: 440, y: 440, radius: 22, label: 'Left Kidney' },
            backHotspot: { x: 440, y: 430, radius: 22, label: 'Left Kidney (Posterior)' },
            anatomyDesc: 'Paired retroperitoneal organs positioned at T12–L3. Filters metabolic waste, regulates fluid balance, and connects via Ureters down into the Pelvic Bladder.',
            shukraDesc: 'Maintains fluid balance (Udaka) and systemic homeostasis essential for unctuous Shukra Dhatu formation.',
            ductPath: [
                'Renal Pyramids &rarr; Major Calyces &rarr; Renal Pelvis',
                'Ureters descend down to Urinary Bladder base'
            ]
        }
    ];

    // =========================================================================
    // STATE MANAGEMENT
    // =========================================================================
    let currentView = 'front'; // 'front' or 'back'
    let currentStructure = null;
    let isMagnifierActive = false;
    let isFlowActive = true;
    let showHotspots = true;
    let zoomLevel = 1.0;
    let panX = 0, panY = 0;
    let isDragging = false;
    let startX = 0, startY = 0;

    // DOM References
    const imgFront = document.getElementById('imgFront');
    const imgBack = document.getElementById('imgBack');
    const btnFrontView = document.getElementById('btnFrontView');
    const btnBackView = document.getElementById('btnBackView');
    const hotspotSvg = document.getElementById('hotspotSvg');
    const flowCanvas = document.getElementById('flowCanvas');
    const magnifierCanvas = document.getElementById('magnifierCanvas');
    const lensIndicator = document.getElementById('lensIndicator');
    const canvasWrapper = document.getElementById('canvasWrapper');
    const viewportContainer = document.getElementById('viewportContainer');

    const hudViewBadge = document.getElementById('hudViewBadge');
    const hudZoomIndicator = document.getElementById('hudZoomIndicator');

    const btnResetView = document.getElementById('btnResetView');
    const btnToggleMagnifier = document.getElementById('btnToggleMagnifier');
    const btnToggleFlow = document.getElementById('btnToggleFlow');
    const btnZoomIn = document.getElementById('btnZoomIn');
    const btnZoomOut = document.getElementById('btnZoomOut');
    const btnFit = document.getElementById('btnFit');
    const btnHotspotsToggle = document.getElementById('btnHotspotsToggle');

    const layerShukra = document.getElementById('layerShukra');
    const layerSkeletal = document.getElementById('layerSkeletal');
    const layerVascular = document.getElementById('layerVascular');
    const layerSrotasFlow = document.getElementById('layerSrotasFlow');

    const structureSearch = document.getElementById('structureSearch');
    const structureList = document.getElementById('structureList');

    const inspectorEmpty = document.getElementById('inspectorEmpty');
    const inspectorDetails = document.getElementById('inspectorDetails');

    // Inspector detail elements
    const detailTitle = document.getElementById('detailTitle');
    const detailSanskrit = document.getElementById('detailSanskrit');
    const detailCategory = document.getElementById('detailCategory');
    const detailType = document.getElementById('detailType');
    const detailLocation = document.getElementById('detailLocation');
    const detailAnatomyDesc = document.getElementById('detailAnatomyDesc');
    const detailShukraDesc = document.getElementById('detailShukraDesc');
    const detailSecretion = document.getElementById('detailSecretion');
    const detailSrotas = document.getElementById('detailSrotas');
    const detailQuality = document.getElementById('detailQuality');
    const detailVessels = document.getElementById('detailVessels');
    const detailDuctPath = document.getElementById('detailDuctPath');

    // Tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Setup Canvas contexts
    const flowCtx = flowCanvas.getContext('2d');
    const magCtx = magnifierCanvas.getContext('2d');

    // Resize canvases to fit container
    function resizeCanvases() {
        const rect = viewportContainer.getBoundingClientRect();
        flowCanvas.width = rect.width;
        flowCanvas.height = rect.height;
        magnifierCanvas.width = rect.width;
        magnifierCanvas.height = rect.height;
    }
    window.addEventListener('resize', resizeCanvases);
    resizeCanvases();

    // =========================================================================
    // PARTICLE ESSENCE FLOW SIMULATION
    // =========================================================================
    class EssenceParticle {
        constructor() {
            this.reset();
        }

        reset() {
            // Flow along pelvic duct coordinates
            const isLeft = Math.random() > 0.5;
            this.progress = Math.random();
            this.speed = 0.0015 + Math.random() * 0.002;
            this.size = 1.5 + Math.random() * 2.5;
            this.alpha = 0.3 + Math.random() * 0.6;
            this.side = isLeft ? -1 : 1;

            // Duct path keypoints (normalized % of canvas)
            this.path = [
                { x: 0.5 + 0.05 * this.side, y: 0.77 }, // Testis
                { x: 0.5 + 0.06 * this.side, y: 0.73 }, // Epididymis
                { x: 0.5 + 0.04 * this.side, y: 0.62 }, // Vas Deferens
                { x: 0.5 + 0.02 * this.side, y: 0.59 }, // Ampulla
                { x: 0.5, y: 0.64 },                   // Prostate/Ejaculatory
                { x: 0.5, y: 0.72 }                    // Urethra
            ];
        }

        update() {
            this.progress += this.speed;
            if (this.progress >= 1) {
                this.reset();
                this.progress = 0;
            }
        }

        getPosition(width, height) {
            const numSegments = this.path.length - 1;
            const scaledProgress = this.progress * numSegments;
            const index = Math.floor(scaledProgress);
            const t = scaledProgress - index;

            const p1 = this.path[index];
            const p2 = this.path[Math.min(index + 1, numSegments)];

            return {
                x: (p1.x + (p2.x - p1.x) * t) * width,
                y: (p1.y + (p2.y - p1.y) * t) * height
            };
        }

        draw(ctx, width, height) {
            const pos = this.getPosition(width, height);
            ctx.save();
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, this.size, 0, Math.PI * 2);

            // Pearlescent golden-white glow gradient
            const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, this.size * 3);
            grad.addColorStop(0, `rgba(255, 253, 245, ${this.alpha})`);
            grad.addColorStop(0.5, `rgba(226, 202, 146, ${this.alpha * 0.7})`);
            grad.addColorStop(1, 'rgba(226, 202, 146, 0)');

            ctx.fillStyle = grad;
            ctx.fill();
            ctx.restore();
        }
    }

    const particles = Array.from({ length: 60 }, () => new EssenceParticle());

    function animateParticles() {
        flowCtx.clearRect(0, 0, flowCanvas.width, flowCanvas.height);

        if (isFlowActive && layerSrotasFlow.checked) {
            particles.forEach(p => {
                p.update();
                p.draw(flowCtx, flowCanvas.width, flowCanvas.height);
            });
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // =========================================================================
    // VIEWPORT SWITCHING & CAMERA PAN/ZOOM
    // =========================================================================
    function setView(view) {
        currentView = view;

        if (view === 'front') {
            imgFront.classList.add('active');
            imgBack.classList.remove('active');
            btnFrontView.classList.add('active');
            btnBackView.classList.remove('active');
            hudViewBadge.textContent = 'Anterior View (Front)';
        } else {
            imgFront.classList.remove('active');
            imgBack.classList.add('active');
            btnFrontView.classList.remove('active');
            btnBackView.classList.add('active');
            hudViewBadge.textContent = 'Posterior View (Back)';
        }

        renderHotspots();
    }

    btnFrontView.addEventListener('click', () => setView('front'));
    btnBackView.addEventListener('click', () => setView('back'));

    function updateTransform() {
        canvasWrapper.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
        hudZoomIndicator.textContent = `Zoom: ${Math.round(zoomLevel * 100)}%`;
    }

    function resetView() {
        zoomLevel = 1.0;
        panX = 0;
        panY = 0;
        updateTransform();
    }

    btnResetView.addEventListener('click', resetView);
    btnFit.addEventListener('click', resetView);

    btnZoomIn.addEventListener('click', () => {
        zoomLevel = Math.min(zoomLevel + 0.25, 3.5);
        updateTransform();
    });

    btnZoomOut.addEventListener('click', () => {
        zoomLevel = Math.max(zoomLevel - 0.25, 0.75);
        updateTransform();
    });

    // Mouse drag pan support
    viewportContainer.addEventListener('mousedown', (e) => {
        if (e.target.closest('.hotspot-group') || isMagnifierActive) return;
        isDragging = true;
        startX = e.clientX - panX;
        startY = e.clientY - panY;
        viewportContainer.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        panX = e.clientX - startX;
        panY = e.clientY - startY;
        updateTransform();
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        viewportContainer.style.cursor = 'default';
    });

    viewportContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.1 : -0.1;
        zoomLevel = Math.min(Math.max(zoomLevel + delta, 0.75), 3.5);
        updateTransform();
    }, { passive: false });

    // =========================================================================
    // HOTSPOTS RENDER & INTERACTION
    // =========================================================================
    function renderHotspots() {
        hotspotSvg.innerHTML = '';
        if (!showHotspots) return;

        structuresData.forEach(struct => {
            if (!struct.views.includes(currentView)) return;

            const hotspotConfig = currentView === 'front' ? struct.frontHotspot : struct.backHotspot;
            if (!hotspotConfig) return;

            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.setAttribute('class', `hotspot-group ${currentStructure && currentStructure.id === struct.id ? 'active' : ''}`);
            group.setAttribute('data-id', struct.id);

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', hotspotConfig.x);
            circle.setAttribute('cy', hotspotConfig.y);
            circle.setAttribute('r', hotspotConfig.radius || 18);
            circle.setAttribute('class', 'hotspot-circle');

            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', hotspotConfig.x + (hotspotConfig.radius || 18) + 10);
            label.setAttribute('y', hotspotConfig.y + 4);
            label.setAttribute('class', 'hotspot-label');
            label.textContent = struct.name.split(' (')[0];

            group.appendChild(circle);
            group.appendChild(label);

            group.addEventListener('click', (e) => {
                e.stopPropagation();
                selectStructure(struct);
            });

            hotspotSvg.appendChild(group);
        });
    }

    btnHotspotsToggle.addEventListener('click', () => {
        showHotspots = !showHotspots;
        btnHotspotsToggle.classList.toggle('active', showHotspots);
        renderHotspots();
    });

    // =========================================================================
    // STRUCTURE INSPECTOR SELECTION
    // =========================================================================
    function selectStructure(struct) {
        currentStructure = struct;

        // Update active class on structure list
        document.querySelectorAll('.struct-item').forEach(item => {
            item.classList.toggle('active', item.dataset.id === struct.id);
        });

        // Update active class on SVG hotspots
        document.querySelectorAll('.hotspot-group').forEach(group => {
            group.classList.toggle('active', group.dataset.id === struct.id);
        });

        // Fill inspector panel
        detailTitle.textContent = struct.name;
        detailSanskrit.textContent = struct.sanskrit;
        detailCategory.textContent = struct.category;
        detailType.textContent = struct.type;
        detailLocation.textContent = struct.location;
        detailAnatomyDesc.textContent = struct.anatomyDesc;
        detailShukraDesc.textContent = struct.shukraDesc;
        detailSecretion.textContent = struct.secretion;
        detailSrotas.textContent = struct.srotas;
        detailQuality.textContent = struct.quality;
        detailVessels.textContent = struct.vessels;

        // Render duct path list
        detailDuctPath.innerHTML = struct.ductPath.map(step => `<li>${step}</li>`).join('');

        // Show details, hide empty state
        inspectorEmpty.classList.add('hidden');
        inspectorDetails.classList.remove('hidden');

        // Switch right sidebar tab to inspector
        switchTab('inspectorTab');
    }

    // Populate structure search index
    function populateStructureList() {
        structureList.innerHTML = '';
        structuresData.forEach(struct => {
            const item = document.createElement('div');
            item.className = 'struct-item';
            item.dataset.id = struct.id;
            item.innerHTML = `
                <span class="struct-name">${struct.name}</span>
                <span class="struct-tag">${struct.category.split(' ')[0]}</span>
            `;
            item.addEventListener('click', () => selectStructure(struct));
            structureList.appendChild(item);
        });
    }

    // Structure search filter
    structureSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll('.struct-item').forEach(item => {
            const struct = structuresData.find(s => s.id === item.dataset.id);
            const match = struct.name.toLowerCase().includes(query) ||
                          struct.sanskrit.toLowerCase().includes(query) ||
                          struct.category.toLowerCase().includes(query);
            item.style.display = match ? 'flex' : 'none';
        });
    });

    // =========================================================================
    // LAYER CONTROLS (SHUKRA, SKELETON, VASCULAR, FLOW)
    // =========================================================================
    function applyLayerFilters() {
        const activeImg = currentView === 'front' ? imgFront : imgBack;

        let brightness = 100;
        let contrast = 100;
        let saturate = 100;
        let hueRotate = 0;

        if (!layerSkeletal.checked) {
            // De-emphasize bones
            contrast += 20;
        }

        if (layerShukra.checked) {
            // Enhanced pearlescent warm contrast
            brightness += 5;
        }

        activeImg.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) drop-shadow(0 0 35px rgba(255, 245, 220, 0.2))`;
    }

    layerShukra.addEventListener('change', applyLayerFilters);
    layerSkeletal.addEventListener('change', applyLayerFilters);
    layerVascular.addEventListener('change', applyLayerFilters);
    layerSrotasFlow.addEventListener('change', () => {
        isFlowActive = layerSrotasFlow.checked;
    });

    btnToggleFlow.addEventListener('click', () => {
        isFlowActive = !isFlowActive;
        layerSrotasFlow.checked = isFlowActive;
        btnToggleFlow.classList.toggle('active', isFlowActive);
    });

    // =========================================================================
    // MAGNIFIER LENS TOOL
    // =========================================================================
    btnToggleMagnifier.addEventListener('click', () => {
        isMagnifierActive = !isMagnifierActive;
        btnToggleMagnifier.classList.toggle('active', isMagnifierActive);
        lensIndicator.style.display = isMagnifierActive ? 'block' : 'none';

        if (!isMagnifierActive) {
            magCtx.clearRect(0, 0, magnifierCanvas.width, magnifierCanvas.height);
        }
    });

    viewportContainer.addEventListener('mousemove', (e) => {
        if (!isMagnifierActive) return;

        const rect = viewportContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        lensIndicator.style.left = `${mouseX}px`;
        lensIndicator.style.top = `${mouseY}px`;

        // Render magnified region into magCtx
        magCtx.clearRect(0, 0, magnifierCanvas.width, magnifierCanvas.height);

        const zoomFactor = 2.5;
        const lensRadius = 70;

        const activeImg = currentView === 'front' ? imgFront : imgBack;
        const imgRect = activeImg.getBoundingClientRect();

        magCtx.save();
        magCtx.beginPath();
        magCtx.arc(mouseX, mouseY, lensRadius, 0, Math.PI * 2);
        magCtx.clip();

        // Draw image magnified inside lens
        const sourceX = (mouseX - (imgRect.left - rect.left)) * (activeImg.naturalWidth / imgRect.width);
        const sourceY = (mouseY - (imgRect.top - rect.top)) * (activeImg.naturalHeight / imgRect.height);

        magCtx.drawImage(
            activeImg,
            sourceX - lensRadius / zoomFactor,
            sourceY - lensRadius / zoomFactor,
            (lensRadius * 2) / zoomFactor,
            (lensRadius * 2) / zoomFactor,
            mouseX - lensRadius,
            mouseY - lensRadius,
            lensRadius * 2,
            lensRadius * 2
        );

        // Add soft inner glow border to magnifier
        magCtx.lineWidth = 3;
        magCtx.strokeStyle = 'rgba(226, 202, 146, 0.8)';
        magCtx.stroke();
        magCtx.restore();
    });

    // =========================================================================
    // TAB SWITCHING (RIGHT SIDEBAR)
    // =========================================================================
    function switchTab(tabId) {
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        tabContents.forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // =========================================================================
    // INITIALIZATION
    // =========================================================================
    populateStructureList();
    renderHotspots();
});
