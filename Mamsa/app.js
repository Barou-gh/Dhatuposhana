/**
 * Mamsa Dhatu 3D Medical Visualizer - Application Script
 * Interactive anatomical hotspot navigation, view switching, and fiber lens logic.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const primaryImg = document.getElementById('primaryImage');
    const primaryFrame = document.getElementById('primaryFrame');
    const secondaryFrame = document.getElementById('secondaryFrame');
    const viewportContainer = document.getElementById('viewportContainer');
    const viewTag = document.getElementById('viewTag');
    const hotspotsLayer = document.getElementById('hotspotsLayer');
    const magnifierLens = document.getElementById('magnifierLens');

    // Controls
    const viewBtns = document.querySelectorAll('.view-btn');
    const contrastRange = document.getElementById('contrastRange');
    const saturationRange = document.getElementById('saturationRange');
    const glowRange = document.getElementById('glowRange');
    const toggleFiberHighlight = document.getElementById('toggleFiberHighlight');
    const toggleTendonHighlight = document.getElementById('toggleTendonHighlight');
    const toggleHotspots = document.getElementById('toggleHotspots');
    const toggleMagnifier = document.getElementById('toggleMagnifier');

    // Zoom Buttons
    const btnZoomIn = document.getElementById('btnZoomIn');
    const btnZoomOut = document.getElementById('btnZoomOut');
    const btnResetZoom = document.getElementById('btnResetZoom');
    const btnToggleLighting = document.getElementById('btnToggleLighting');

    // Info Modal Controls
    const btnInfoModal = document.getElementById('btnInfoModal');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const infoModal = document.getElementById('infoModal');

    // Detail Panel Elements
    const muscleTitle = document.getElementById('muscleTitle');
    const muscleDesc = document.getElementById('muscleDesc');
    const statLayer = document.getElementById('statLayer');
    const statFiber = document.getElementById('statFiber');
    const statAction = document.getElementById('statAction');
    const statUpadhatu = document.getElementById('statUpadhatu');
    const ayurvedaInsight = document.getElementById('ayurvedaInsight');

    // State Variables
    let currentView = 'front'; // 'front', 'back', 'split'
    let currentScale = 1;
    let isLightingCinematic = true;

    // Anatomical Hotspot Data
    const anatomicalData = {
        front: [
            {
                id: 'pectoralis',
                name: 'Pectoralis Major (Chest)',
                x: 46, y: 22,
                layer: 'Superficial',
                fiber: 'Fan-shaped / Convergent',
                action: 'Arm Adduction & Internal Rotation',
                upadhatu: 'Mamsa Peshana (Thoracic)',
                desc: 'Large fan-shaped muscle spanning chest wall. Fibers converge toward upper humerus with clear sternal and clavicular heads naturally attached to ribcage skeleton.',
                ayurveda: 'In Ayurveda, thoracic Mamsa protects the Hridaya (Heart Marma) and creates respiratory expansion support.'
            },
            {
                id: 'deltoid_front',
                name: 'Anterior Deltoid (Shoulder Cap)',
                x: 34, y: 20,
                layer: 'Superficial',
                fiber: 'Multipennate',
                action: 'Shoulder Abduction & Flexion',
                upadhatu: 'Bahuka Peshana',
                desc: 'Rounded contour shoulder cap muscle attached to clavicle and acromion, inserting into deltoid tuberosity with glistening pale tendon.',
                ayurveda: 'Maintains shoulder joint integrity (Amsa Sandhi) and enables locomotive arm movements.'
            },
            {
                id: 'biceps',
                name: 'Biceps Brachii (Upper Arm)',
                x: 32, y: 28,
                layer: 'Superficial',
                fiber: 'Fusiform Parallel',
                action: 'Elbow Flexion & Forearm Supination',
                upadhatu: 'Bahuvaha Mamsa',
                desc: 'Two-headed upper arm muscle originating from scapula, forming a distinct fusiform belly that terminates in distal tendon at radius.',
                ayurveda: 'Essential muscle group for lifting and pulling actions, directly fed by Raktavahi Dhamani.'
            },
            {
                id: 'rectus_abdominis',
                name: 'Rectus Abdominis (Abdominal Core)',
                x: 50, y: 34,
                layer: 'Superficial',
                fiber: 'Parallel Striated (Tendinous Intersections)',
                action: 'Trunk Flexion & Intra-abdominal Pressure',
                upadhatu: 'Udara Mamsa',
                desc: 'Segmented vertical muscle flexors divided by tendinous intersections (linea alba) spanning ribcage down to pubic bone.',
                ayurveda: 'Forms Udara Mamsa wall shielding the Mahasrotas (digestive tract) and maintaining Agni heat balance.'
            },
            {
                id: 'quadriceps',
                name: 'Quadriceps Femoris (Thigh)',
                x: 42, y: 55,
                layer: 'Superficial & Deep',
                fiber: 'Pennate / Bipennate',
                action: 'Knee Extension & Hip Flexion',
                upadhatu: 'Uru Mamsa',
                desc: 'Four-headed massive anterior thigh muscle group (rectus femoris, vastus lateralis, vastus medialis) anchoring into patellar tendon.',
                ayurveda: 'The foundational Mamsa Dhatu layer supporting weight-bearing upright posture (Deha Dharna).'
            },
            {
                id: 'tibialis_anterior',
                name: 'Tibialis Anterior (Shin Muscle)',
                x: 42, y: 78,
                layer: 'Superficial',
                fiber: 'Pennate',
                action: 'Ankle Dorsiflexion & Foot Inversion',
                upadhatu: 'Jangha Mamsa',
                desc: 'Fusiform muscle lying along anterior tibia bone, extending down via long shiny white tendon into foot arch.',
                ayurveda: 'Maintains balance during walking and stabilizes Gulpha Sandhi (ankle joint).'
            }
        ],
        back: [
            {
                id: 'trapezius',
                name: 'Trapezius (Upper Back & Neck)',
                x: 50, y: 16,
                layer: 'Superficial',
                fiber: 'Convergent / Triangular',
                action: 'Scapular Elevation, Retraction & Rotation',
                upadhatu: 'Griva Mamsa',
                desc: 'Large diamond-shaped posterior superficial muscle extending from occipital skull to thoracic spine and scapular spine.',
                ayurveda: 'Supports head weight and cervical posture, protecting Manya and Nila Marmas.'
            },
            {
                id: 'latissimus_dorsi',
                name: 'Latissimus Dorsi (Mid/Lower Back)',
                x: 36, y: 28,
                layer: 'Superficial',
                fiber: 'Sheet Convergent',
                action: 'Arm Extension & Adduction',
                upadhatu: 'Pristha Mamsa',
                desc: 'Broad flat muscle sweeping from thoracolumbar fascia to upper arm bone, creating V-shaped posterior silhouette.',
                ayurveda: 'Provides powerful thoracic back wall plastering (Lepana) and vertebral protection.'
            },
            {
                id: 'triceps_back',
                name: 'Triceps Brachii (Posterior Arm)',
                x: 30, y: 26,
                layer: 'Superficial',
                fiber: 'Bipennate',
                action: 'Elbow Extension',
                upadhatu: 'Bahupristha Mamsa',
                desc: 'Three-headed muscle covering posterior arm, inserting into olecranon bone of elbow via prominent broad white aponeurosis.',
                ayurveda: 'Provides pushing force and balances biceps flexion in arm dynamics.'
            },
            {
                id: 'gluteus_maximus',
                name: 'Gluteus Maximus (Gluteal Region)',
                x: 44, y: 44,
                layer: 'Superficial (Coarse Fibers)',
                fiber: 'Coarse Parallel Bundles',
                action: 'Hip Extension & Lateral Rotation',
                upadhatu: 'Sphik Mamsa',
                desc: 'Thick volumetric coarse-fibered muscle group covering pelvic girdle, anchoring into iliotibial band and femur.',
                ayurveda: 'Major reservoir of Mamsa Dhatu bulk (Sphik), crucial for upright bipedal stability.'
            },
            {
                id: 'hamstrings',
                name: 'Hamstrings (Posterior Thigh)',
                x: 42, y: 58,
                layer: 'Superficial & Deep',
                fiber: 'Parallel Fusiform',
                action: 'Knee Flexion & Hip Extension',
                upadhatu: 'Urupristha Mamsa',
                desc: 'Biceps femoris, semitendinosus, and semimembranosus muscle bundle running down back of thigh into knee joint tendons.',
                ayurveda: 'Enables leg contraction and stride movement during locomotion.'
            },
            {
                id: 'gastrocnemius',
                name: 'Gastrocnemius & Achilles (Calf)',
                x: 42, y: 76,
                layer: 'Superficial',
                fiber: 'Bipennate',
                action: 'Plantar Flexion & Heel Elevation',
                upadhatu: 'Pindika Mamsa',
                desc: 'Two-bellied muscular calf mass converging into thick ivory Achilles tendon (Snayu) attached to calcaneus heel bone.',
                ayurveda: 'Known as Pindika Mamsa in Ayurveda; functions as peripheral muscle pump aiding circulation.'
            }
        ]
    };

    // Initialize Hotspots
    function renderHotspots() {
        hotspotsLayer.innerHTML = '';
        if (!toggleHotspots.checked || currentView === 'split') return;

        const currentSet = anatomicalData[currentView] || [];
        currentSet.forEach(data => {
            const spot = document.createElement('div');
            spot.className = 'hotspot';
            spot.style.left = `${data.x}%`;
            spot.style.top = `${data.y}%`;
            spot.dataset.id = data.id;

            const tooltip = document.createElement('div');
            tooltip.className = 'hotspot-tooltip';
            tooltip.textContent = data.name;
            spot.appendChild(tooltip);

            spot.addEventListener('click', (e) => {
                e.stopPropagation();
                selectMuscle(data, spot);
            });

            hotspotsLayer.appendChild(spot);
        });
    }

    // Select Muscle & Update Right Sidebar
    function selectMuscle(data, spotEl) {
        document.querySelectorAll('.hotspot').forEach(h => h.classList.remove('active'));
        if (spotEl) spotEl.classList.add('active');

        muscleTitle.textContent = data.name;
        muscleDesc.textContent = data.desc;
        statLayer.textContent = data.layer;
        statFiber.textContent = data.fiber;
        statAction.textContent = data.action;
        statUpadhatu.textContent = data.upadhatu;
        ayurvedaInsight.innerHTML = `<strong>Ayurvedic Dynamics:</strong> ${data.ayurveda}`;
    }

    // View Switcher Handler
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentView = btn.dataset.view;
            updateViewMode();
        });
    });

    function updateViewMode() {
        if (currentView === 'front') {
            viewportContainer.className = 'viewport-container single-view';
            primaryImg.src = 'mamsa_dhatu_front_3d.jpg';
            primaryFrame.classList.remove('hidden');
            secondaryFrame.classList.add('hidden');
            viewTag.textContent = 'ANTERIOR (FRONT VIEW)';
        } else if (currentView === 'back') {
            viewportContainer.className = 'viewport-container single-view';
            primaryImg.src = 'mamsa_dhatu_back_3d.jpg';
            primaryFrame.classList.remove('hidden');
            secondaryFrame.classList.add('hidden');
            viewTag.textContent = 'POSTERIOR (BACK VIEW)';
        } else if (currentView === 'split') {
            viewportContainer.className = 'viewport-container split-view';
            primaryImg.src = 'mamsa_dhatu_front_3d.jpg';
            primaryFrame.classList.remove('hidden');
            secondaryFrame.classList.remove('hidden');
            viewTag.textContent = 'ANTERIOR (FRONT VIEW)';
        }
        renderHotspots();
    }

    // Filter Sliders
    function applyShaderFilters() {
        const contrast = contrastRange.value;
        const saturation = saturationRange.value;
        let extraFilter = '';

        if (toggleFiberHighlight.checked) {
            extraFilter += ' drop-shadow(0 0 6px rgba(230,57,70,0.3))';
        }
        if (toggleTendonHighlight.checked) {
            extraFilter += ' brightness(110%)';
        }

        const filterString = `contrast(${contrast}%) saturate(${saturation}%)${extraFilter}`;
        primaryImg.style.filter = filterString;
        const secondaryImg = secondaryFrame.querySelector('img');
        if (secondaryImg) secondaryImg.style.filter = filterString;
    }

    contrastRange.addEventListener('input', applyShaderFilters);
    saturationRange.addEventListener('input', applyShaderFilters);
    toggleFiberHighlight.addEventListener('change', applyShaderFilters);
    toggleTendonHighlight.addEventListener('change', applyShaderFilters);

    toggleHotspots.addEventListener('change', renderHotspots);

    // Rim Lighting Toggle
    btnToggleLighting.addEventListener('click', () => {
        isLightingCinematic = !isLightingCinematic;
        viewportContainer.style.backgroundImage = isLightingCinematic 
            ? 'radial-gradient(circle at center, rgba(230, 57, 70, 0.08) 0%, transparent 70%), radial-gradient(circle at 50% 100%, rgba(20, 20, 28, 0.8) 0%, #000 100%)'
            : 'none';
        btnToggleLighting.style.color = isLightingCinematic ? 'var(--accent-red)' : 'var(--text-secondary)';
    });

    // Zoom Controls
    btnZoomIn.addEventListener('click', () => {
        if (currentScale < 2.2) {
            currentScale += 0.25;
            applyZoom();
        }
    });

    btnZoomOut.addEventListener('click', () => {
        if (currentScale > 0.8) {
            currentScale -= 0.25;
            applyZoom();
        }
    });

    btnResetZoom.addEventListener('click', () => {
        currentScale = 1;
        applyZoom();
    });

    function applyZoom() {
        primaryFrame.style.transform = `scale(${currentScale})`;
        secondaryFrame.style.transform = `scale(${currentScale})`;
    }

    // Microscope Lens Magnifier
    toggleMagnifier.addEventListener('change', () => {
        magnifierLens.style.display = toggleMagnifier.checked ? 'block' : 'none';
    });

    primaryFrame.addEventListener('mousemove', (e) => {
        if (!toggleMagnifier.checked) return;

        const rect = primaryImg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
            magnifierLens.style.display = 'none';
            return;
        }

        magnifierLens.style.display = 'block';
        magnifierLens.style.left = `${x - 80}px`;
        magnifierLens.style.top = `${y - 80}px`;

        const bgX = (x / rect.width) * 100;
        const bgY = (y / rect.height) * 100;

        magnifierLens.style.backgroundImage = `url(${primaryImg.src})`;
        magnifierLens.style.backgroundSize = `${rect.width * 2.5}px ${rect.height * 2.5}px`;
        magnifierLens.style.backgroundPosition = `${bgX}% ${bgY}%`;
    });

    primaryFrame.addEventListener('mouseleave', () => {
        if (toggleMagnifier.checked) magnifierLens.style.display = 'none';
    });

    // Info Modal Events
    btnInfoModal.addEventListener('click', () => infoModal.classList.remove('hidden'));
    btnCloseModal.addEventListener('click', () => infoModal.classList.add('hidden'));
    infoModal.addEventListener('click', (e) => {
        if (e.target === infoModal) infoModal.classList.add('hidden');
    });

    // Fullscreen Toggle
    document.getElementById('btnFullscreen').addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
        }
    });

    // Initial Render
    updateViewMode();
});
