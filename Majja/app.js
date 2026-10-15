// Interactive 3D Canvas Engine for Majja Dhatu Visualization

// State Management
const state = {
  currentView: 'front', // 'front' or 'back'
  scale: 1,
  panX: 0,
  panY: 0,
  isDragging: false,
  dragStartX: 0,
  dragStartY: 0,
  activeHotspot: 'all',
  activeTab: 'ayurveda',
  renderMode: 'natural', // 'natural', 'marrow-focus', 'xray'
  layers: {
    marrow: true,
    neural: true,
    skeleton: true
  },
  transparency: 70, // 10 to 100
  glow: 100, // 20 to 200
  isComparisonMode: false
};

// Image Assets
const images = {
  front: new Image(),
  back: new Image()
};

images.front.src = 'assets/majja_front_view.png';
images.back.src = 'assets/majja_back_view.png';

let canvas, ctx;
let isLoaded = false;

// Anatomical Hotspots Coordinates (percent of image height/width)
const hotspotsData = {
  front: [
    { id: 'cranium', name: 'Skull & Cranial Marrow', x: 0.50, y: 0.08, category: 'Axial Skeleton', tag: 'Cranial Marrow' },
    { id: 'spine', name: 'Cervical & Spinal Canal', x: 0.50, y: 0.18, category: 'Central Nervous System', tag: 'Neural Canal' },
    { id: 'sternum', name: 'Sternum & Ribcage Marrow', x: 0.50, y: 0.28, category: 'Thoracic Marrow', tag: 'Red Marrow' },
    { id: 'pelvis', name: 'Pelvic Iliac Cancellous Bone', x: 0.50, y: 0.44, category: 'Pelvic Girdle', tag: 'High Hematopoiesis' },
    { id: 'femur', name: 'Femoral & Tibial Cavities', x: 0.40, y: 0.60, category: 'Appendicular Skeleton', tag: 'Marrow Shafts' }
  ],
  back: [
    { id: 'cranium', name: 'Posterior Skull & Cerebellum', x: 0.50, y: 0.07, category: 'Cerebellar Region', tag: 'Brain Stem' },
    { id: 'spine', name: 'Vertebral Column & Spinal Cord', x: 0.50, y: 0.28, category: 'Spinal Canal', tag: 'Neural Trunk' },
    { id: 'sternum', name: 'Scapulae & Thoracic Spine', x: 0.38, y: 0.20, category: 'Posterior Ribcage', tag: 'Trabecular Marrow' },
    { id: 'pelvis', name: 'Sacrum & Posterior Ilium', x: 0.50, y: 0.44, category: 'Pelvic Cavity', tag: 'Sacral Plexus' },
    { id: 'femur', name: 'Posterior Femur & Popliteal Nerves', x: 0.41, y: 0.62, category: 'Sciatic Pathway', tag: 'Lower Limb Nerves' }
  ]
};

// Information Database for Right Sidebar
const infoDatabase = {
  all: {
    title: 'Majja Dhatu (Bone Marrow & Neural Matrix)',
    subtitle: 'The 6th Dhatu in Ayurvedic Physiology — Complete Anatomical Visualizer',
    ayurveda: `
      <h3><i data-lucide="sparkles" style="color: var(--neural-amber);"></i> Ayurvedic Concept & Definition</h3>
      <p>In Ayurvedic science, <strong>Majja Dhatu</strong> refers to the vital unctuous tissue that fills the internal cavities of the bones (<em>Asthi-Guhasu</em>). Derived as the refined essence of <em>Asthi Dhatu</em> (bone tissue) under the action of <em>Majja Agni</em>, it represents both the cellular <strong>Bone Marrow</strong> and the primary <strong>Central Nervous System</strong> (Brain & Spinal Cord).</p>
      
      <div class="stat-grid">
        <div class="stat-box">
          <div class="stat-val">Puran</div>
          <div class="stat-key">Primary Action (Filling Cavities)</div>
        </div>
        <div class="stat-box">
          <div class="stat-val">Snehan</div>
          <div class="stat-key">Unctuousness & Lubrication</div>
        </div>
        <div class="stat-box">
          <div class="stat-val">Asthi Pusti</div>
          <div class="stat-key">Bone Tissue Maintenance</div>
        </div>
        <div class="stat-box">
          <div class="stat-val">Bala</div>
          <div class="stat-key">Vital Strength & Immunity</div>
        </div>
      </div>

      <div class="detail-card" style="margin-top: 14px;">
        <h3><i data-lucide="user-check"></i> Majja Sara Purusha (Optimal Majja Signs)</h3>
        <p>Individuals with optimal Majja Dhatu exhibit soft, radiant skin, deep melodious voice, thick robust joints, high intellectual resilience, and prolonged longevity.</p>
      </div>
    `,
    medical: `
      <h3><i data-lucide="activity" style="color: var(--marrow-crimson);"></i> Modern Anatomical Science</h3>
      <p>Modern medicine divides Majja into <strong>Red Bone Marrow</strong> (hematopoietically active tissue producing red blood cells, leukocytes, and platelets) and <strong>Yellow Bone Marrow</strong> (adipose-rich stromal marrow in long bone shafts). In the axial skeleton (skull, ribs, sternum, vertebrae, pelvis), active red marrow persists throughout adult life inside cancellous trabecular bone spaces.</p>
      <p style="margin-top: 8px;">The secondary neural visualization highlights the <strong>Central Nervous System (CNS)</strong> and <strong>Peripheral Nervous System (PNS)</strong>, illustrating how nerve trunks navigate through bony foramina in physical integration with the skeleton.</p>
    `,
    histology: `
      <h3><i data-lucide="microscope" style="color: var(--accent-cyan);"></i> Microscopic Architecture</h3>
      <p>Inside cancellous bone, microscopic honeycombed <strong>trabeculae</strong> create protective microenvironments (niches) housing hematological stem cells (HSCs), mesenchymal stem cells (MSCs), sinusoid blood vessels, and reticular connective tissue.</p>
    `
  },
  cranium: {
    title: 'Skull Marrow & Cranial Neural Tissue',
    subtitle: 'Flat Bones of Calvaria & Intracranial Cerebrum',
    ayurveda: `
      <h3><i data-lucide="brain" style="color: var(--neural-amber);"></i> Shiras & Mastulunga</h3>
      <p>In classical Texts (Charaka Samhita), the brain (<em>Mastulunga</em>) is described as the highest concentrated form of Majja tissue housed securely within the protective vault of the skull (<em>Shiras</em>), which is revered as the primary <em>Uttamanga</em> (supreme organ of consciousness).</p>
    `,
    medical: `
      <h3><i data-lucide="activity" style="color: var(--marrow-crimson);"></i> Cranial Hematopoiesis & Meninges</h3>
      <p>The diploë (spongy bone layer between inner and outer tables of cranial bones) contains active red marrow. Venous sinuses drain blood from both cranial bone marrow and brain tissue, establishing direct neuro-vascular coupling.</p>
    `,
    histology: `
      <h3><i data-lucide="microscope" style="color: var(--accent-cyan);"></i> Diploic Spaces</h3>
      <p>Cranial trabeculae form thin plates surrounding rich vascular sinuses, providing vital protection against mechanical impact while producing vital immune cells.</p>
    `
  },
  spine: {
    title: 'Vertebral Column & Spinal Canal',
    subtitle: 'Axial Spine, Vertebral Marrow & Spinal Cord',
    ayurveda: `
      <h3><i data-lucide="git-commit" style="color: var(--neural-amber);"></i> Spine as the Central Pillar (Merudanda)</h3>
      <p>The spinal column (<em>Merudanda</em>) contains the central axis of Majja. The spinal cord running inside the neural canal is viewed as the direct downward continuum of cranial Majja, serving as the pathway for motor, sensory, and subtle energy flow.</p>
    `,
    medical: `
      <h3><i data-lucide="activity" style="color: var(--marrow-crimson);"></i> Spinal Cord & Vertebral Body Marrow</h3>
      <p>Vertebral bodies are one of the richest sites of active adult red marrow. The spinal cord (medulla spinalis) traverses the vertebral foramina, giving off 31 pairs of spinal nerves that emerge between vertebrae to innervate the body.</p>
    `,
    histology: `
      <h3><i data-lucide="microscope" style="color: var(--accent-cyan);"></i> Vertebral Cancellous Network</h3>
      <p>Vertical and horizontal trabecular struts reinforce vertebral bodies against compression while enclosing expansive marrow cavities lined with endosteum.</p>
    `
  },
  sternum: {
    title: 'Sternum & Ribcage Marrow',
    subtitle: 'Thoracic Cage & Costal Cancellous Core',
    ayurveda: `
      <h3><i data-lucide="shield" style="color: var(--neural-amber);"></i> Thoracic Protection & Vitality</h3>
      <p>The ribs (<em>Parshuka</em>) and sternum form a protective bony cage filled with rich Majja tissue, nourishing the thoracic organs while supporting <em>Prana Vayu</em> and cardiac vitality.</p>
    `,
    medical: `
      <h3><i data-lucide="activity" style="color: var(--marrow-crimson);"></i> Primary Sternal Aspiration Site</h3>
      <p>The sternum is a clinical benchmark site for bone marrow biopsy and aspiration due to its superficial location and persistent lifetime red marrow production.</p>
    `,
    histology: `
      <h3><i data-lucide="microscope" style="color: var(--accent-cyan);"></i> Hematopoietic Sinusoids</h3>
      <p>Thin-walled blood vessels (sinusoids) traverse sternal marrow, permitting newly matured erythrocytes and leukocytes to enter peripheral circulation.</p>
    `
  },
  pelvis: {
    title: 'Pelvic Iliac Cancellous Bone',
    subtitle: 'Iliac Crest & Sacrum Marrow Reservoir',
    ayurveda: `
      <h3><i data-lucide="database" style="color: var(--neural-amber);"></i> Primary Majja Reservoir (Kati Region)</h3>
      <p>The pelvis (<em>Kati Kapala</em>) contains the largest volumetric concentration of Majja Dhatu in the human body, serving as the foundational anchor of physical strength and endurance.</p>
    `,
    medical: `
      <h3><i data-lucide="activity" style="color: var(--marrow-crimson);"></i> Gold Standard Marrow Harvest Site</h3>
      <p>The posterior iliac crest contains the largest reservoir of active hematopoietic red marrow in adults, making it the primary anatomical site for bone marrow transplants and stem cell harvesting.</p>
    `,
    histology: `
      <h3><i data-lucide="microscope" style="color: var(--accent-cyan);"></i> Dense Trabecular Grid</h3>
      <p>Curved trabecular arcuate lines withstand weight-bearing stress while maintaining high density of CD34+ stem cell niches.</p>
    `
  },
  femur: {
    title: 'Femoral & Tibial Shafts',
    subtitle: 'Proximal Epiphyses & Long Bone Medullary Canals',
    ayurveda: `
      <h3><i data-lucide="activity" style="color: var(--neural-amber);"></i> Long Bone Cavities (Mahat Asthi)</h3>
      <p>Long bones (<em>Sthula Asthi</em>) possess deep medullary canals where Majja is stored in dense, oily, nutrient-rich form, supplying continuous unctuousness to joints.</p>
    `,
    medical: `
      <h3><i data-lucide="activity" style="color: var(--marrow-crimson);"></i> Proximal Red Marrow & Medullary Canal</h3>
      <p>In adults, active red marrow is concentrated in the proximal epiphyses of the humerus and femur, while the central diaphysis transitions to yellow marrow, capable of reverting to red marrow during severe anemia.</p>
    `,
    histology: `
      <h3><i data-lucide="microscope" style="color: var(--accent-cyan);"></i> Endosteum & Medullary Space</h3>
      <p>The interior cortical bone wall is lined with endosteum containing osteoprogenitor cells and nutrient arteries supplying deep marrow tissue.</p>
    `
  }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  canvas = document.getElementById('canvas-visualizer');
  ctx = canvas.getContext('2d');

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Event Listeners for Drag and Zoom
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('mouseleave', onMouseUp);
  canvas.addEventListener('wheel', onWheel, { passive: false });

  // Touch Support
  canvas.addEventListener('touchstart', onTouchStart, { passive: false });
  canvas.addEventListener('touchmove', onTouchMove, { passive: false });
  canvas.addEventListener('touchend', onTouchEnd);

  // Load Images
  let loadedCount = 0;
  const checkLoaded = () => {
    loadedCount++;
    if (loadedCount === 2) {
      isLoaded = true;
      resetView();
      render();
      updateSidebar();
    }
  };

  images.front.onload = checkLoaded;
  images.back.onload = checkLoaded;
});

// Canvas Resizing with HD DPI scaling
function resizeCanvas() {
  const rect = canvas.parentElement.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  ctx.scale(dpr, dpr);
  render();
}

// Reset Pan & Zoom
function resetView() {
  state.scale = 0.95;
  state.panX = 0;
  state.panY = 0;
  render();
}

// Zoom Controls
function zoomIn() {
  state.scale = Math.min(state.scale * 1.25, 4.0);
  render();
}

function zoomOut() {
  state.scale = Math.max(state.scale / 1.25, 0.5);
  render();
}

function switchView(view) {
  state.currentView = view;
  document.getElementById('btn-front-view').classList.toggle('active', view === 'front');
  document.getElementById('btn-back-view').classList.toggle('active', view === 'back');
  document.getElementById('lbl-orientation').innerText = view === 'front' ? 'Anterior (Front View)' : 'Posterior (Back View)';
  
  render();
  updateSidebar();
}

// Render Function
function render() {
  if (!isLoaded || !ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const width = canvas.width / dpr;
  const height = canvas.height / dpr;

  // Clear Canvas
  ctx.clearRect(0, 0, width, height);

  ctx.save();

  // Apply Pan and Scale Transformations centered
  ctx.translate(width / 2 + state.panX, height / 2 + state.panY);
  ctx.scale(state.scale, state.scale);

  const img = images[state.currentView];
  const aspect = img.width / img.height;
  
  // Calculate Image Dimensions to fit height nicely
  let imgH = height * 0.92;
  let imgW = imgH * aspect;

  const dx = -imgW / 2;
  const dy = -imgH / 2;

  // Render Base Image with Layer Filters
  ctx.save();
  
  // Dynamic CSS Filters based on state
  let filterStr = '';

  // Transparency / Cutaway adjustment
  if (state.transparency !== 70) {
    const alpha = state.transparency / 100;
    ctx.globalAlpha = alpha;
  }

  // Marrow Glow / Contrast
  if (state.glow !== 100) {
    filterStr += ` contrast(${state.glow}%) brightness(${100 + (state.glow - 100) * 0.2}%)`;
  }

  // Render Modes
  if (state.renderMode === 'marrow-focus') {
    filterStr += ' saturate(160%) hue-rotate(-10deg) contrast(120%)';
  } else if (state.renderMode === 'xray') {
    filterStr += ' invert(90%) hue-rotate(180deg) contrast(150%)';
  }

  // Layer toggles simulation
  if (!state.layers.marrow) {
    filterStr += ' saturate(40%)';
  }
  if (!state.layers.neural) {
    // reduce yellow tone
    filterStr += ' hue-rotate(-30deg)';
  }

  if (filterStr) {
    ctx.filter = filterStr.trim();
  }

  // Draw Main Medical Render Image
  ctx.drawImage(img, dx, dy, imgW, imgH);
  ctx.restore();

  // Draw Interactive Hotspots on Canvas
  drawHotspots(dx, dy, imgW, imgH);

  ctx.restore();

  // Re-create icons if needed
  if (window.lucide) window.lucide.createIcons();
}

// Draw Hotspot Rings & Labels on Canvas
function drawHotspots(dx, dy, imgW, imgH) {
  const hotspots = hotspotsData[state.currentView];

  hotspots.forEach(hs => {
    const hx = dx + hs.x * imgW;
    const hy = dy + hs.y * imgH;
    const isSelected = state.activeHotspot === hs.id;

    ctx.save();

    // Hotspot Pulsing Outer Ring
    ctx.beginPath();
    ctx.arc(hx, hy, isSelected ? 18 : 12, 0, Math.PI * 2);
    ctx.fillStyle = isSelected ? 'rgba(214, 42, 74, 0.4)' : 'rgba(255, 184, 46, 0.25)';
    ctx.fill();

    ctx.lineWidth = isSelected ? 2.5 : 1.5;
    ctx.strokeStyle = isSelected ? '#d42a4a' : '#ffb82e';
    ctx.stroke();

    // Inner Core Dot
    ctx.beginPath();
    ctx.arc(hx, hy, isSelected ? 6 : 4, 0, Math.PI * 2);
    ctx.fillStyle = isSelected ? '#ffffff' : '#ffd269';
    ctx.fill();

    // Draw Label if selected
    if (isSelected) {
      ctx.font = '600 12px Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 6;
      ctx.fillText(hs.name, hx + 22, hy + 4);
    }

    ctx.restore();
  });
}

// Mouse Drag / Pan Handling
function onMouseDown(e) {
  state.isDragging = true;
  state.dragStartX = e.clientX - state.panX;
  state.dragStartY = e.clientY - state.panY;
}

function onMouseMove(e) {
  if (state.isDragging) {
    state.panX = e.clientX - state.dragStartX;
    state.panY = e.clientY - state.dragStartY;
    render();
  }

  // Check hover over hotspots
  checkHotspotHover(e);
}

function onMouseUp() {
  state.isDragging = false;
}

function onWheel(e) {
  e.preventDefault();
  const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
  state.scale = Math.min(Math.max(state.scale * zoomFactor, 0.5), 4.0);
  render();
}

// Touch Handling for Mobile/Tablet
function onTouchStart(e) {
  if (e.touches.length === 1) {
    state.isDragging = true;
    state.dragStartX = e.touches[0].clientX - state.panX;
    state.dragStartY = e.touches[0].clientY - state.panY;
  }
}

function onTouchMove(e) {
  if (state.isDragging && e.touches.length === 1) {
    state.panX = e.touches[0].clientX - state.dragStartX;
    state.panY = e.touches[0].clientY - state.dragStartY;
    render();
  }
}

function onTouchEnd() {
  state.isDragging = false;
}

// Hotspot Hover Detection
function checkHotspotHover(e) {
  if (!isLoaded) return;

  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const width = canvas.width / dpr;
  const height = canvas.height / dpr;

  const img = images[state.currentView];
  const aspect = img.width / img.height;
  const imgH = height * 0.92;
  const imgW = imgH * aspect;

  const dx = -imgW / 2;
  const dy = -imgH / 2;

  const hotspots = hotspotsData[state.currentView];
  let found = null;

  hotspots.forEach(hs => {
    // Transform hotspot position to screen coordinates
    const hx = (width / 2 + state.panX) + (dx + hs.x * imgW) * state.scale;
    const hy = (height / 2 + state.panY) + (dy + hs.y * imgH) * state.scale;

    const dist = Math.hypot(mouseX - hx, mouseY - hy);
    if (dist < 20 * state.scale) {
      found = hs;
    }
  });

  const tooltip = document.getElementById('tooltip');
  if (found) {
    canvas.style.cursor = 'pointer';
    tooltip.style.display = 'block';
    tooltip.style.left = (e.clientX + 15) + 'px';
    tooltip.style.top = (e.clientY + 15) + 'px';
    tooltip.innerHTML = `<strong>${found.name}</strong><br><span style="color:var(--text-muted); font-size:0.72rem;">${found.tag}</span>`;
  } else {
    canvas.style.cursor = state.isDragging ? 'grabbing' : 'grab';
    tooltip.style.display = 'none';
  }
}

// Hotspot Selection
function selectHotspot(id) {
  state.activeHotspot = id;

  document.querySelectorAll('.hotspot-btn').forEach(btn => {
    btn.classList.toggle('active', btn.id === `hs-${id}`);
  });

  render();
  updateSidebar();
}

// Controls Updates
function updateCanvasFilters() {
  state.layers.marrow = document.getElementById('toggle-marrow').checked;
  state.layers.neural = document.getElementById('toggle-neural').checked;
  state.layers.skeleton = document.getElementById('toggle-skeleton').checked;
  render();
}

function updateTransparency(val) {
  state.transparency = parseInt(val);
  document.getElementById('val-transparency').innerText = val + '%';
  render();
}

function updateGlow(val) {
  state.glow = parseInt(val);
  document.getElementById('val-glow').innerText = val + '%';
  render();
}

function setRenderMode(mode) {
  state.renderMode = mode;
  ['rm-natural', 'rm-marrow-focus', 'rm-xray'].forEach(mId => {
    const el = document.getElementById(mId);
    if (el) {
      if (mId === `rm-${mode}`) {
        el.style.background = 'rgba(168, 28, 56, 0.4)';
        el.style.borderColor = 'var(--marrow-red)';
      } else {
        el.style.background = 'rgba(255,255,255,0.05)';
        el.style.borderColor = 'var(--border-glass)';
      }
    }
  });
  render();
}

function setTab(tab) {
  state.activeTab = tab;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.id === `tab-${tab}`);
  });
  updateSidebar();
}

function updateSidebar() {
  const data = infoDatabase[state.activeHotspot] || infoDatabase['all'];
  
  document.getElementById('detail-title').innerText = data.title;
  document.getElementById('detail-subtitle').innerText = data.subtitle;

  const contentBox = document.getElementById('tab-content');
  contentBox.innerHTML = data[state.activeTab] || data['ayurveda'];

  if (window.lucide) window.lucide.createIcons();
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

function toggleComparisonMode() {
  alert('Split Comparison Mode: Side-by-side Anterior (Front) and Posterior (Back) 3D views available in full dashboard.');
}
