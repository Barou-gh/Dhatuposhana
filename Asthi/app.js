/* ==========================================================================
   Asthi Dhatu — Interactive Viewport & Anatomical Data Logic
   ========================================================================== */

// State Management
let currentView = 'front'; // 'front' | 'back'
let currentRenderMode = 'natural';
let zoomLevel = 1;
let panX = 0;
let panY = 0;
let isDragging = false;
let startX = 0;
let startY = 0;
let showHotspots = true;

// Hotspot Data Coordinates (percentages relative to image container)
const hotspotData = {
    front: [
        {
            id: 'skull',
            x: 50,
            y: 7,
            title: 'Cranium & Facial Skeleton (Kapala Asthi)',
            anatomy: 'Skull composed of 22 bones (8 cranial, 14 facial). Features coronal and sagittal sutures, maxilla, zygomatic arches, orbital cavities, and mandible.',
            ayurveda: 'Kapala Asthi protecting the Shiras (head), considered the primary Prana Ayatana (seat of vital life force) and Uttamanga.'
        },
        {
            id: 'spine-cervical',
            x: 50,
            y: 15,
            title: 'Cervical Vertebrae (Griva Grivasthi)',
            anatomy: '7 cervical vertebrae (C1 Atlas, C2 Axis to C7) supporting skull articulation and cervical lordotic curve.',
            ayurveda: 'Supports Manyasthambha region, facilitating Vata flow to sensory apparatus (Indriyas).'
        },
        {
            id: 'clavicle-ribcage',
            x: 50,
            y: 24,
            title: 'Thoracic Cage & Sternum (Uras & Parsuka Asthi)',
            anatomy: 'Sternum (manubrium, body, xiphoid), 12 pairs of ribs with costal cartilage articulating with thoracic vertebrae.',
            ayurveda: 'Encloses the Hridaya (cardiac center) and Phupfusa (lungs), key seat of Prana Vayu and Rasa Dhatu.'
        },
        {
            id: 'shoulder-girdle',
            x: 35,
            y: 20,
            title: 'Pectoral Girdle & Shoulder Joint (Amsa Asthi)',
            anatomy: 'Clavicle and scapula articulating with the humerus head forming a multi-axial ball-and-socket synovial joint.',
            ayurveda: 'Amsa Marma region providing structural stability for arm motility (Karmendriya).'
        },
        {
            id: 'pelvis',
            x: 50,
            y: 43,
            title: 'Pelvic Girdle (Sroni / Katikasthi)',
            anatomy: 'Ilium, Ischium, Pubis fused into os coxae, acetabulum articulating with femoral head, anterior pubic symphysis.',
            ayurveda: 'Jaghana & Sroni — primary root origin (Mula) of Asthivaha Srotas and seat of Apana Vayu.'
        },
        {
            id: 'femur',
            x: 42,
            y: 58,
            title: 'Femur & Upper Leg (Uru Asthi)',
            anatomy: 'Longest long bone with cortical shaft, head, neck, greater trochanter, and distal condyles.',
            ayurveda: 'Uru Asthi containing dense red/yellow bone marrow (Majja Dhatu).'
        },
        {
            id: 'knee',
            x: 43,
            y: 69,
            title: 'Patella & Knee Joint (Janu Asthi & Marma)',
            anatomy: 'Sesamoid patella housed in quadriceps tendon, tibiofemoral and patellofemoral synovial joint with menisci.',
            ayurveda: 'Janu Marma — vital structural joint junction protecting Vata mobility.'
        },
        {
            id: 'tibia-fibula',
            x: 43,
            y: 81,
            title: 'Tibia & Fibula (Jangha Asthi)',
            anatomy: 'Medial weight-bearing tibia and lateral supportive fibula articulating with the talus at the ankle.',
            ayurveda: 'Jangha region essential for stability (Sthirata) and body support (Dharana).'
        },
        {
            id: 'feet',
            x: 43,
            y: 93,
            title: 'Tarsals & Foot Bones (Pada Asthi)',
            anatomy: 'Calcaneus, talus, navicular, cuneiforms, cuboid, 5 metatarsals, and 14 phalanges.',
            ayurveda: 'Pada Asthi forming the base of support for whole-body posture.'
        }
    ],
    back: [
        {
            id: 'cranial-back',
            x: 50,
            y: 7,
            title: 'Occipital Cranium (Kapala Paschat)',
            anatomy: 'Occipital bone, lambdoid suture, external occipital protuberance, and cervical muscle attachments.',
            ayurveda: 'Protects posterior cranial fossa and brain stem articulation.'
        },
        {
            id: 'scapula',
            x: 35,
            y: 22,
            title: 'Scapular Spine & Blade (Amsaphalaka)',
            anatomy: 'Triangular flat scapular blade, spine of scapula, acromion, and infraspinous fossa.',
            ayurveda: 'Amsaphalaka Asthi giving broad muscle origin for upper limb movement.'
        },
        {
            id: 'spine-thoracic-lumbar',
            x: 50,
            y: 33,
            title: 'Vertebral Column & Spinous Processes (Prshthasthi)',
            anatomy: '12 thoracic vertebrae with rib facets, 5 robust lumbar vertebrae with lumbar lordosis and intervertebral discs.',
            ayurveda: 'Merudanda — central axis of physiological support and Nadi subtle energetic channel corridor.'
        },
        {
            id: 'sacrum-coccyx',
            x: 50,
            y: 45,
            title: 'Sacrum & Coccyx (Trikasthi)',
            anatomy: '5 fused sacral vertebrae forming posterior pelvic wall and terminal coccyx articulating with pelvis.',
            ayurveda: 'Trika Marma region located at the sacral base, crucial junction of spinal nerve roots.'
        },
        {
            id: 'posterior-pelvis',
            x: 38,
            y: 43,
            title: 'Posterior Iliac Crest & Ischium',
            anatomy: 'Posterior superior iliac spine (PSIS), ischial tuberosity, and greater sciatic notch.',
            ayurveda: 'Supports weight distribution in sitting posture and anchors gluteal attachments.'
        }
    ]
};

// Elements
const mainRender = document.getElementById('main-render');
const hotspotLayer = document.getElementById('hotspot-layer');
const viewportContainer = document.getElementById('viewport-container');
const canvasWrapper = document.getElementById('canvas-wrapper');
const viewIndicator = document.getElementById('view-indicator');
const zoomVal = document.getElementById('zoom-val');
const zoomRange = document.getElementById('zoom-range');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderHotspots();
    setupPanZoom();
});

// View Switching (Front/Back)
function switchView(view) {
    if (currentView === view) return;
    currentView = view;
    
    // Update button UI
    document.getElementById('btn-front').classList.toggle('active', view === 'front');
    document.getElementById('btn-front').setAttribute('aria-selected', view === 'front');
    document.getElementById('btn-back').classList.toggle('active', view === 'back');
    document.getElementById('btn-back').setAttribute('aria-selected', view === 'back');
    
    // Update render image source
    if (view === 'front') {
        mainRender.src = 'asthi_dhatu_front.png';
        viewIndicator.innerText = 'ANTERIOR VIEW (FRONT)';
    } else {
        mainRender.src = 'asthi_dhatu_back.png';
        viewIndicator.innerText = 'POSTERIOR VIEW (BACK)';
    }
    
    // Re-render hotspots for view
    renderHotspots();
    resetViewport();
}

// Render Mode Filter Setting
function setRenderMode(mode) {
    currentRenderMode = mode;
    
    // Update active button state
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    // Set image class filter
    mainRender.className = `render-img ${mode}`;
}

// Render Hotspots
function renderHotspots() {
    hotspotLayer.innerHTML = '';
    if (!showHotspots) return;

    const data = hotspotData[currentView] || [];
    data.forEach(hs => {
        const elem = document.createElement('div');
        elem.className = 'hotspot';
        elem.style.left = `${hs.x}%`;
        elem.style.top = `${hs.y}%`;
        elem.title = hs.title;
        elem.onclick = (e) => {
            e.stopPropagation();
            selectHotspot(hs);
        };
        hotspotLayer.appendChild(elem);
    });
}

// Toggle Hotspots Visibility
function toggleHotspots() {
    showHotspots = !showHotspots;
    const btn = document.getElementById('btn-hotspots');
    btn.style.opacity = showHotspots ? '1' : '0.5';
    renderHotspots();
}

// Select Hotspot & Display Information
function selectHotspot(hs) {
    // Switch right panel tab to modern anatomy or ayurveda
    switchInfoTab('anatomy');
    
    const titleElem = document.getElementById('structure-title');
    const descElem = document.getElementById('structure-desc');
    const detailBox = document.getElementById('hotspot-detail-content');
    
    titleElem.innerText = hs.title;
    descElem.innerHTML = `<strong>Ayurvedic Perspective:</strong> ${hs.ayurveda}`;
    
    detailBox.innerHTML = `
        <div style="margin-top: 8px;">
            <p><strong>🔬 Anatomical Features:</strong> ${hs.anatomy}</p>
            <p style="margin-top: 6px; color: var(--accent-bone);"><strong>🌿 Dhatu Correlation:</strong> Integrated Asthi Dhatu layer providing bone structural density & housing internal Majja Dhatu.</p>
        </div>
    `;
}

// Focus Specific Anatomical Region
function focusRegion(regionId) {
    resetViewport();
    let targetY = 0;
    let targetZoom = 1.8;
    
    switch (regionId) {
        case 'skull':
            targetY = 150;
            targetZoom = 2.0;
            break;
        case 'spine':
            targetY = 40;
            targetZoom = 1.6;
            break;
        case 'thorax':
            targetY = 80;
            targetZoom = 1.8;
            break;
        case 'pelvis':
            targetY = -50;
            targetZoom = 1.9;
            break;
        case 'limbs':
            targetY = -150;
            targetZoom = 1.6;
            break;
    }
    
    zoomLevel = targetZoom;
    panY = targetY;
    panX = 0;
    updateTransform();
    zoomRange.value = Math.round(targetZoom * 100);
    zoomVal.innerText = `${zoomRange.value}%`;
    
    // Highlight matching hotspot
    const data = hotspotData[currentView] || [];
    const match = data.find(d => d.id.includes(regionId));
    if (match) selectHotspot(match);
}

// Setup Viewport Drag & Zoom Controls
function setupPanZoom() {
    viewportContainer.addEventListener('mousedown', (e) => {
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

    viewportContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.15 : 0.15;
        zoomLevel = Math.min(Math.max(1, zoomLevel + delta), 3.0);
        updateTransform();
        zoomRange.value = Math.round(zoomLevel * 100);
        zoomVal.innerText = `${zoomRange.value}%`;
    }, { passive: false });
}

function handleZoomSlider(val) {
    zoomLevel = val / 100;
    zoomVal.innerText = `${val}%`;
    updateTransform();
}

function updateTransform() {
    canvasWrapper.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
}

function resetViewport() {
    zoomLevel = 1;
    panX = 0;
    panY = 0;
    updateTransform();
    zoomRange.value = 100;
    zoomVal.innerText = '100%';
}

// Info Tabs Switching
function switchInfoTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    if (tabName === 'ayurveda') {
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
        document.getElementById('tab-ayurveda').classList.add('active');
    } else {
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
        document.getElementById('tab-anatomy').classList.add('active');
    }
}
