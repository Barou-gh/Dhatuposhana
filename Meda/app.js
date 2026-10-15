/* ==========================================================================
   MEDA DHATU 3D MEDICAL VISUALIZATION - INTERACTIVE APPLICATION SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // DOM Element References
  const specimenImg = document.getElementById('specimen-img');
  const renderWrapper = document.getElementById('render-wrapper');
  const btnViewFront = document.getElementById('btn-view-front');
  const btnViewBack = document.getElementById('btn-view-back');
  const hotspotsContainer = document.getElementById('hotspots-container');
  const medicalScanner = document.getElementById('medical-scanner');
  
  // Tools
  const toolScan = document.getElementById('tool-scan');
  const toolLoupe = document.getElementById('tool-loupe');
  const toolReset = document.getElementById('tool-reset');
  const toolFullscreen = document.getElementById('tool-fullscreen');
  const magnifierLoupe = document.getElementById('magnifier-loupe');
  const loupeBg = document.getElementById('loupe-bg');
  const viewerContainer = document.getElementById('anatomical-viewer');

  // Info Sidebar Elements
  const cardRegionTitle = document.getElementById('card-region-title');
  const cardRegionBody = document.getElementById('card-region-body');
  const statDensity = document.getElementById('stat-density');
  const statElement = document.getElementById('stat-element');
  const statUpadhatu = document.getElementById('stat-upadhatu');
  const statMala = document.getElementById('stat-mala');

  // State Management
  let currentOrientation = 'front'; // 'front' | 'back'
  let currentLayer = 'all'; // 'all' | 'subcutaneous' | 'visceral' | 'muscular'
  let activeRegion = 'all';
  let isLoupeActive = false;
  let isScanning = false;

  // Image Asset Paths
  const ASSETS = {
    front: 'assets/meda_front_3d.jpg',
    back: 'assets/meda_back_3d.jpg'
  };

  // Hotspot Definitions for Front & Back Views
  const HOTSPOTS_DATA = {
    front: [
      {
        id: 'facial',
        title: 'Facial & Cervical Subcutaneous Fat',
        x: 50, y: 8,
        regionKey: 'facial',
        density: '12-16%',
        element: 'Jala + Prithvi',
        upadhatu: 'Vasa (Facial Lipid)',
        mala: 'Sveda',
        description: 'Subcutaneous adipose tissue in the buccal cheeks, malar pads, and cervical anterior neck. Maintains facial volume contour, soft cushioning over facial expression muscles, and dermal moisture.'
      },
      {
        id: 'chest_arm',
        title: 'Mammary & Brachial Fat Layer',
        x: 32, y: 22,
        regionKey: 'subcutaneous',
        density: '15-22%',
        element: 'Jala Dominant',
        upadhatu: 'Stanya (Breast Milk)',
        mala: 'Sveda',
        description: 'Superficial subcutaneous fat sitting above the pectoralis major and upper brachial fascial planes. Formed by dense lobulated adipocytes that provide shock absorption and thermal insulation.'
      },
      {
        id: 'visceral',
        title: 'Abdominal Visceral Fat (Greater Omentum)',
        x: 50, y: 38,
        regionKey: 'visceral',
        density: '8-14%',
        element: 'Agni + Jala',
        upadhatu: 'Kala Cushion',
        mala: 'Metabolic Heat',
        description: 'Antar Meda (Visceral Adipose Tissue) surrounding the small and large intestines, stomach, and retroperitoneum. Composed of soft, highly vascularized lobules providing essential thermal protection to abdominal visceral organs.'
      },
      {
        id: 'femoral',
        title: 'Femoral & Quadriceps Subcutaneous Layer',
        x: 38, y: 62,
        regionKey: 'femoral',
        density: '20-28%',
        element: 'Prithvi Dominant',
        upadhatu: 'Snayu (Tendons)',
        mala: 'Sveda',
        description: 'Thick subcutaneous adipose lobule layer overlying the anterior quadriceps muscle groups and femoral fascia. Acts as a key energy storehouse and cushions deep muscular kinetic movements.'
      },
      {
        id: 'feet',
        title: 'Plantar & Tarsal Cushioning Fat',
        x: 58, y: 92,
        regionKey: 'calves',
        density: '25-30%',
        element: 'Prithvi + Jala',
        upadhatu: 'Fascial Pad',
        mala: 'Sveda',
        description: 'Specialized chambered fibrous adipose pads situated beneath the calcaneus and plantar aponeurosis. Designed specifically for shock absorption during locomotion.'
      }
    ],
    back: [
      {
        id: 'scalp_neck',
        title: 'Posterior Cervical & Suboccipital Fat',
        x: 50, y: 9,
        regionKey: 'facial',
        density: '10-14%',
        element: 'Jala',
        upadhatu: 'Fascia',
        mala: 'Sveda',
        description: 'Subcutaneous adipose cushions situated across the nuchal ligament and trapezius insertion, shielding the cervical spine and suboccipital nerve branches.'
      },
      {
        id: 'dorsal',
        title: 'Thoracodorsal & Flank Adipose',
        x: 62, y: 26,
        regionKey: 'subcutaneous',
        density: '14-20%',
        element: 'Jala + Prithvi',
        upadhatu: 'Snayu Base',
        mala: 'Sveda',
        description: 'Distributed subcutaneous fat sitting over the latissimus dorsi, trapezius, and infraspinatus muscles. Integrates naturally with superficial thoracolumbar fascia.'
      },
      {
        id: 'gluteal',
        title: 'Gluteal Subcutaneous Adipose Pad',
        x: 42, y: 48,
        regionKey: 'pelvic',
        density: '24-32%',
        element: 'Prithvi + Jala',
        upadhatu: 'Vasa (Deep Fat)',
        mala: 'Sveda',
        description: 'Extensive subcutaneous fat deposits overlying the gluteus maximus and medius muscles. Provides major structural weight-bearing cushioning during sitting and posture stabilization.'
      },
      {
        id: 'hamstring',
        title: 'Posterior Femoral & Popliteal Fat',
        x: 60, y: 64,
        regionKey: 'femoral',
        density: '18-24%',
        element: 'Jala',
        upadhatu: 'Snayu',
        mala: 'Sveda',
        description: 'Adipose tissue occupying the posterior thigh compartment and popliteal fossa behind the knee joint. Protects sciatic nerve branches, popliteal vessels, and hamstring tendons.'
      },
      {
        id: 'calf_ankle',
        title: 'Gastrocnemius & Achilles Peritendinous Fat',
        x: 40, y: 82,
        regionKey: 'calves',
        density: '14-18%',
        element: 'Prithvi',
        upadhatu: 'Achilles Cushion',
        mala: 'Sveda',
        description: 'Lobulated subcutaneous fat surrounding the posterior gastrocnemius, soleus, and Achilles tendon (Gulpha sandhi area), facilitating friction-free tendon gliding.'
      }
    ]
  };

  // Render Hotspots onto Canvas
  function renderHotspots() {
    hotspotsContainer.innerHTML = '';
    const currentHotspots = HOTSPOTS_DATA[currentOrientation] || [];

    currentHotspots.forEach(spot => {
      const spotEl = document.createElement('div');
      spotEl.className = 'hotspot';
      spotEl.style.left = `${spot.x}%`;
      spotEl.style.top = `${spot.y}%`;
      spotEl.setAttribute('data-id', spot.id);

      spotEl.innerHTML = `
        <div class="hotspot-pulse"></div>
        <div class="hotspot-btn">
          <i data-lucide="crosshair" style="width: 14px; height: 14px; color: #ffb703;"></i>
        </div>
        <div class="hotspot-label">${spot.title}</div>
      `;

      spotEl.addEventListener('click', (e) => {
        e.stopPropagation();
        selectHotspot(spot);
      });

      hotspotsContainer.appendChild(spotEl);
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Select a Hotspot & Update Details
  function selectHotspot(spot) {
    // Update active highlight class
    document.querySelectorAll('.hotspot').forEach(el => el.classList.remove('active'));
    const activeEl = document.querySelector(`.hotspot[data-id="${spot.id}"]`);
    if (activeEl) activeEl.classList.add('active');

    // Update Sidebar Details
    cardRegionTitle.textContent = spot.title;
    cardRegionBody.innerHTML = spot.description;
    statDensity.textContent = spot.density;
    statElement.textContent = spot.element;
    statUpadhatu.textContent = spot.upadhatu;
    statMala.textContent = spot.mala;

    // Pulse effect on specimen image
    specimenImg.style.filter = 'drop-shadow(0 0 35px rgba(255, 183, 3, 0.4)) brightness(1.05)';
    setTimeout(() => {
      applyLayerFilter();
    }, 400);

    // Trigger brief scan pulse
    triggerScanPulse();
  }

  // Switch Front / Back View Orientation
  function setOrientation(orientation) {
    if (currentOrientation === orientation) return;
    currentOrientation = orientation;

    // Button states
    btnViewFront.classList.toggle('active', currentOrientation === 'front');
    btnViewFront.setAttribute('aria-checked', currentOrientation === 'front');
    btnViewBack.classList.toggle('active', currentOrientation === 'back');
    btnViewBack.setAttribute('aria-checked', currentOrientation === 'back');

    // Add flip transition animation
    renderWrapper.classList.add('flipped');

    setTimeout(() => {
      specimenImg.src = ASSETS[currentOrientation];
      renderHotspots();
      updateLoupeBackground();
    }, 250);

    setTimeout(() => {
      renderWrapper.classList.remove('flipped');
    }, 600);
  }

  // Event Listeners for Orientation Buttons
  btnViewFront.addEventListener('click', () => setOrientation('front'));
  btnViewBack.addEventListener('click', () => setOrientation('back'));

  // Layer Selector Controls
  document.querySelectorAll('#layer-selector-list .layer-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('#layer-selector-list .layer-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      currentLayer = card.getAttribute('data-layer');
      applyLayerFilter();
    });
  });

  // Apply Visual Filters according to Layer Spotlight
  function applyLayerFilter() {
    switch (currentLayer) {
      case 'subcutaneous':
        specimenImg.style.filter = 'drop-shadow(0 0 30px rgba(251, 133, 0, 0.3)) saturate(1.25) contrast(1.1)';
        break;
      case 'visceral':
        specimenImg.style.filter = 'drop-shadow(0 0 30px rgba(42, 157, 143, 0.35)) hue-rotate(-10deg) brightness(1.05)';
        break;
      case 'muscular':
        specimenImg.style.filter = 'drop-shadow(0 0 30px rgba(230, 57, 70, 0.35)) saturate(1.4) contrast(1.15)';
        break;
      default: // 'all'
        specimenImg.style.filter = 'drop-shadow(0 0 25px rgba(255, 183, 3, 0.15))';
        break;
    }
  }

  // Region Selector Buttons
  document.querySelectorAll('#region-selector-list .region-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#region-selector-list .region-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const regionKey = btn.getAttribute('data-region');
      activeRegion = regionKey;

      if (regionKey === 'all') {
        renderHotspots();
      } else {
        const matching = (HOTSPOTS_DATA[currentOrientation] || []).find(s => s.regionKey === regionKey);
        if (matching) {
          selectHotspot(matching);
        }
      }
    });
  });

  // Interactive Magnifier Loupe Tool
  toolLoupe.addEventListener('click', () => {
    isLoupeActive = !isLoupeActive;
    toolLoupe.classList.toggle('active', isLoupeActive);
    magnifierLoupe.style.display = isLoupeActive ? 'block' : 'none';

    if (isLoupeActive) {
      updateLoupeBackground();
    }
  });

  function updateLoupeBackground() {
    loupeBg.style.backgroundImage = `url('${specimenImg.src}')`;
  }

  viewerContainer.addEventListener('mousemove', (e) => {
    if (!isLoupeActive) return;

    const rect = viewerContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Position loupe tool centered on cursor
    magnifierLoupe.style.left = `${x - 90}px`;
    magnifierLoupe.style.top = `${y - 90}px`;

    // Calculate background magnification position (2.2x zoom)
    const imgRect = specimenImg.getBoundingClientRect();
    const bgX = ((e.clientX - imgRect.left) / imgRect.width) * 100;
    const bgY = ((e.clientY - imgRect.top) / imgRect.height) * 100;

    loupeBg.style.backgroundPosition = `${bgX}% ${bgY}%`;
    loupeBg.style.backgroundSize = `${imgRect.width * 2.2}px ${imgRect.height * 2.2}px`;
  });

  // Medical Laser Scanner Toggle
  function triggerScanPulse() {
    medicalScanner.classList.remove('scanning');
    void medicalScanner.offsetWidth; // trigger reflow
    medicalScanner.classList.add('scanning');
    setTimeout(() => {
      if (!isScanning) medicalScanner.classList.remove('scanning');
    }, 3000);
  }

  toolScan.addEventListener('click', () => {
    isScanning = !isScanning;
    toolScan.classList.toggle('active', isScanning);
    if (isScanning) {
      medicalScanner.classList.add('scanning');
    } else {
      medicalScanner.classList.remove('scanning');
    }
  });

  // Reset View & Zoom
  toolReset.addEventListener('click', () => {
    currentLayer = 'all';
    isLoupeActive = false;
    isScanning = false;
    toolLoupe.classList.remove('active');
    toolScan.classList.remove('active');
    magnifierLoupe.style.display = 'none';
    medicalScanner.classList.remove('scanning');

    document.querySelectorAll('#layer-selector-list .layer-card').forEach(c => c.classList.remove('active'));
    document.querySelector('#layer-selector-list .layer-card[data-layer="all"]').classList.add('active');

    specimenImg.style.transform = 'scale(1)';
    applyLayerFilter();
    renderHotspots();

    cardRegionTitle.textContent = 'Adipose Tissue System (Meda)';
    cardRegionBody.innerHTML = 'In Ayurvedic medicine, <strong>Meda Dhatu</strong> represents the lipid and adipose tissue system responsible for bodily lubrication (<em>Snehana</em>), thermal insulation, energy storage, and physical cushioning for internal organs and skeletal structures.';
    statDensity.textContent = '18-24%';
    statElement.textContent = 'Jala + Prithvi';
    statUpadhatu.textContent = 'Snayu & Vasa';
    statMala.textContent = 'Sveda (Sweat)';
  });

  // Fullscreen View Toggle
  toolFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      viewerContainer.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen();
    }
  });

  // Tab Switcher for Details Panel
  document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetTab = tab.getAttribute('data-tab');
      const contentEl = document.getElementById(`tab-${targetTab}`);
      if (contentEl) contentEl.classList.add('active');
    });
  });

  // Initial Setup
  renderHotspots();
});
