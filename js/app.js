/**
 * DIVINE INTERIORS - OFFICIAL ENGINE
 * 1. Apple 3D Liquid Glass Lens Top Bar (Screenshot 1)
 * 2. Jesper Landberg WebGL 3D Curved Cylindrical Carousel (jesperlandberg.com)
 * 3. Nathan Riley Minimalist Case Study Modal (Screenshot 3)
 */

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  initHeroArchitecturalLive3D();
  initAppleLiquidLens();
  initJesperLandbergCylinder();
  initPortfolioViewToggle();
  initTiltPhysics();
  initAnimatedCounters();
  initContactForm();
  initMobileDrawer();
  initActiveNavSpy();
  initFooterQuickPillObserver();
});

/**
 * ==========================================================================
 * 1. APPLE LIQUID GLASS LENS TOP BAR
 * Bulbous convex 3D liquid magnifying lens hovering over active nav item
 * ==========================================================================
 */
function initAppleLiquidLens() {
  const lens = document.getElementById('liquid-glass-lens');
  const nav = document.getElementById('glass-nav');
  const navLinks = document.querySelectorAll('.glass-nav .nav-link');

  if (!lens || !nav || navLinks.length === 0) return;

  function moveLensTo(element, animate = true) {
    const navRect = nav.getBoundingClientRect();
    const linkRect = element.getBoundingClientRect();

    const x = linkRect.left - navRect.left;
    const width = linkRect.width;

    if (window.gsap && animate) {
      gsap.to(lens, {
        x: x,
        width: width,
        duration: 0.42,
        ease: 'power3.out'
      });
    } else {
      lens.style.transform = `translateX(${x}px)`;
      lens.style.width = `${width}px`;
    }
  }

  const activeLink = document.querySelector('.glass-nav .nav-link.active') || navLinks[0];
  setTimeout(() => moveLensTo(activeLink, false), 60);

  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => moveLensTo(link, true));
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      moveLensTo(link, true);
    });
  });

  nav.addEventListener('mouseleave', () => {
    const currentActive = document.querySelector('.glass-nav .nav-link.active') || navLinks[0];
    moveLensTo(currentActive, true);
  });

  window.addEventListener('resize', () => {
    const currentActive = document.querySelector('.glass-nav .nav-link.active') || navLinks[0];
    moveLensTo(currentActive, false);
  });
}

/**
 * ==========================================================================
 * ARCHITECTURAL HERO: 3D PROCEDURAL WIREFRAME HOUSE ASSEMBLY (LIVE THREE.JS)
 * Replicates the exact architectural house from user's animation frames:
 * - Deep black scene (#000000) with perspective ground drafting grid & dimensions
 * - Phase 01: Ground floor blueprint with double-wall perimeter & interior partitions
 * - Phase 02: Vertical wall extrusion with guide rays, window/door frame cutouts & porch
 * - Phase 03: Second story, gabled triangular end walls, timber roof trusses & ridge beam
 * - Phase 04: Interior stairs, wireframe furniture (sofa, dining, bed), chimney, mullions
 * - Synchronized 4-phase GSAP single-pass build with interactive bottom HUD clicking & mouse parallax
 * ==========================================================================
 */
function initHeroArchitecturalLive3D() {
  const container = document.getElementById('hero-3d-wireframe-canvas');
  if (!container || !window.THREE) return;

  // 1. Scene, Camera, Fog, Renderer
  const scene = new THREE.Scene();
  scene.background = null;
  scene.fog = new THREE.FogExp2(0x000000, 0.018);

  const camera = new THREE.PerspectiveCamera(36, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(16.5, 11.5, 16.5);
  camera.lookAt(0, 2.8, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // 2. Materials
  const matBright = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
  const matMuted = new THREE.LineBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0 });
  const matDim = new THREE.LineBasicMaterial({ color: 0x888888, transparent: true, opacity: 0 });
  const matGuide = new THREE.LineBasicMaterial({ color: 0x555555, transparent: true, opacity: 0 });

  // Geometry helper: build line segments from pair of [x,y,z] coordinates
  function createLineSegments(pairs, material) {
    const flat = [];
    pairs.forEach(([p1, p2]) => {
      flat.push(p1[0], p1[1], p1[2], p2[0], p2[1], p2[2]);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(flat), 3));
    return new THREE.LineSegments(geo, material);
  }

  // Geometry helper: build clean wireframe box edges
  function createBoxEdges(w, h, d, material, posX = 0, posY = 0, posZ = 0) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const edges = new THREE.EdgesGeometry(geo);
    geo.dispose();
    const mesh = new THREE.LineSegments(edges, material);
    mesh.position.set(posX, posY, posZ);
    return mesh;
  }

  // 3. Ground Perspective Grid & CAD Dimensions
  const gridHelper = new THREE.GridHelper(40, 40, 0x333333, 0x151515);
  gridHelper.position.y = -0.01;
  scene.add(gridHelper);

  // Floor CAD Dimension lines & annotation ticks (matching reference images)
  const floorDimPairs = [
    // Front dimension line (12.7m)
    [[-4.5, 0.02, 5.2], [4.5, 0.02, 5.2]],
    [[-4.5, 0.02, 4.8], [-4.5, 0.02, 5.5]],
    [[4.5, 0.02, 4.8], [4.5, 0.02, 5.5]],
    [[-4.5, 0.02, 3.2], [-4.5, 0.02, 5.0]], // witness line left
    [[4.5, 0.02, 3.2], [4.5, 0.02, 5.0]],   // witness line right
    // Porch width dimension ticks
    [[1.0, 0.02, 5.0], [3.2, 0.02, 5.0]],
    [[1.0, 0.02, 4.8], [1.0, 0.02, 5.2]],
    [[3.2, 0.02, 4.8], [3.2, 0.02, 5.2]],
    // Side dimension line (8.5m)
    [[-5.8, 0.02, -3.8], [-5.8, 0.02, 3.2]],
    [[-6.1, 0.02, -3.8], [-5.5, 0.02, -3.8]],
    [[-6.1, 0.02, 3.2], [-5.5, 0.02, 3.2]],
    [[-4.5, 0.02, -3.8], [-5.6, 0.02, -3.8]], // witness line rear
    [[-4.5, 0.02, 3.2], [-5.6, 0.02, 3.2]]    // witness line front
  ];
  const matFloorDim = new THREE.LineBasicMaterial({ color: 0x666666, transparent: true, opacity: 0 });
  const floorDimLines = createLineSegments(floorDimPairs, matFloorDim);
  scene.add(floorDimLines);

  // 4. House Root Group (Centered on Ground Grid)
  const houseGroup = new THREE.Group();
  houseGroup.position.set(0, 0, 0);
  scene.add(houseGroup);

  // =========================================================================
  // PHASE 01: FOUNDATION & 2D BLUEPRINT FLOOR PLAN (Matching Frame 0:00)
  // =========================================================================
  const phase1Group = new THREE.Group();
  houseGroup.add(phase1Group);

  const blueprintPairs = [
    // Outer perimeter walls (Double lines for wall thickness ~0.24m)
    // Main rectangle outer
    [[-4.5, 0.02, -3.8], [4.5, 0.02, -3.8]],
    [[4.5, 0.02, -3.8], [4.5, 0.02, 3.2]],
    [[4.5, 0.02, 3.2], [3.2, 0.02, 3.2]],
    // Porch bump-out outer
    [[3.2, 0.02, 3.2], [3.2, 0.02, 4.4]],
    [[3.2, 0.02, 4.4], [2.6, 0.02, 4.4]], // Door gap right
    [[1.6, 0.02, 4.4], [1.0, 0.02, 4.4]], // Door gap left
    [[1.0, 0.02, 4.4], [1.0, 0.02, 3.2]],
    // Main front wall left of porch
    [[1.0, 0.02, 3.2], [-4.5, 0.02, 3.2]],
    [[-4.5, 0.02, 3.2], [-4.5, 0.02, -3.8]],

    // Main rectangle inner perimeter (thickness offset = 0.24m)
    [[-4.26, 0.02, -3.56], [4.26, 0.02, -3.56]],
    [[4.26, 0.02, -3.56], [4.26, 0.02, 2.96]],
    [[4.26, 0.02, 2.96], [3.2, 0.02, 2.96]],
    [[1.0, 0.02, 2.96], [-4.26, 0.02, 2.96]],
    [[-4.26, 0.02, 2.96], [-4.26, 0.02, -3.56]],

    // Porch inner perimeter
    [[2.96, 0.02, 3.2], [2.96, 0.02, 4.16]],
    [[2.96, 0.02, 4.16], [2.6, 0.02, 4.16]],
    [[1.6, 0.02, 4.16], [1.24, 0.02, 4.16]],
    [[1.24, 0.02, 4.16], [1.24, 0.02, 3.2]],

    // Interior Room Partitions
    // Hallway / Stairwell dividing wall (x = -0.6)
    [[-0.6, 0.02, -3.56], [-0.6, 0.02, 0.6]],
    [[-0.6, 0.02, 1.6], [-0.6, 0.02, 2.96]], // Doorway gap
    [[-0.36, 0.02, -3.56], [-0.36, 0.02, 0.6]],
    [[-0.36, 0.02, 1.6], [-0.36, 0.02, 2.96]],

    // Cross partition (z = 0.0) separating living room from kitchen
    [[-4.26, 0.02, 0.0], [-1.8, 0.02, 0.0]],
    [[-0.8, 0.02, 0.0], [-0.6, 0.02, 0.0]], // Doorway opening
    [[-4.26, 0.02, -0.24], [-1.8, 0.02, -0.24]],
    [[-0.8, 0.02, -0.24], [-0.6, 0.02, -0.24]],

    // Right room partition (z = 0.8)
    [[1.0, 0.02, 0.8], [4.26, 0.02, 0.8]],
    [[1.0, 0.02, 1.04], [4.26, 0.02, 1.04]],

    // Door swing arc approximations
    [[1.6, 0.02, 4.4], [1.6, 0.02, 3.7]],
    [[1.6, 0.02, 3.7], [2.3, 0.02, 3.7]],
    [[-0.6, 0.02, 0.6], [0.1, 0.02, 0.6]]
  ];
  const blueprintLines = createLineSegments(blueprintPairs, matBright);
  phase1Group.add(blueprintLines);

  // =========================================================================
  // PHASE 02: VERTICAL WALL EXTRUSIONS & GUIDE RAYS (Matching Frame 0:02)
  // =========================================================================
  const phase2Group = new THREE.Group();
  houseGroup.add(phase2Group);

  // Vertical structural guide rays shooting upward
  const guideRayPairs = [
    [[-4.5, 0, -3.8], [-4.5, 8.5, -3.8]],
    [[ 4.5, 0, -3.8], [ 4.5, 8.5, -3.8]],
    [[-4.5, 0,  3.2], [-4.5, 8.5,  3.2]],
    [[ 4.5, 0,  3.2], [ 4.5, 8.5,  3.2]],
    [[ 1.0, 0,  4.4], [ 1.0, 8.5,  4.4]],
    [[ 3.2, 0,  4.4], [ 3.2, 8.5,  4.4]],
    [[-0.6, 0, -3.8], [-0.6, 8.5, -3.8]],
    [[-0.6, 0,  3.2], [-0.6, 8.5,  3.2]],
    [[ 1.0, 0,  3.2], [ 1.0, 8.5,  3.2]],
    [[ 3.2, 0,  3.2], [ 3.2, 8.5,  3.2]]
  ];
  const guideRays = createLineSegments(guideRayPairs, matGuide);
  phase2Group.add(guideRays);

  // Ground Floor Wall Wireframe Planes with Window/Door Cutouts (H = 2.8m)
  const gndWallPairs = [
    // Outer perimeter vertical edges
    [[-4.5, 0, -3.8], [-4.5, 2.8, -3.8]],
    [[ 4.5, 0, -3.8], [ 4.5, 2.8, -3.8]],
    [[-4.5, 0,  3.2], [-4.5, 2.8,  3.2]],
    [[ 4.5, 0,  3.2], [ 4.5, 2.8,  3.2]],
    [[ 1.0, 0,  4.4], [ 1.0, 2.6,  4.4]],
    [[ 3.2, 0,  4.4], [ 3.2, 2.6,  4.4]],
    [[ 1.0, 0,  3.2], [ 1.0, 2.8,  3.2]],
    [[ 3.2, 0,  3.2], [ 3.2, 2.8,  3.2]],

    // Top wall plate lines (y = 2.8)
    [[-4.5, 2.8, -3.8], [4.5, 2.8, -3.8]],
    [[ 4.5, 2.8, -3.8], [4.5, 2.8,  3.2]],
    [[ 4.5, 2.8,  3.2], [3.2, 2.8,  3.2]],
    [[ 1.0, 2.8,  3.2], [-4.5, 2.8, 3.2]],
    [[-4.5, 2.8,  3.2], [-4.5, 2.8, -3.8]],

    // Porch top plate (y = 2.6)
    [[1.0, 2.6, 3.2], [1.0, 2.6, 4.4]],
    [[1.0, 2.6, 4.4], [3.2, 2.6, 4.4]],
    [[3.2, 2.6, 4.4], [3.2, 2.6, 3.2]],

    // Front living room large window (sill = 0.8, lintel = 2.2, x in [-3.8, -1.4])
    [[-3.8, 0.8, 3.2], [-1.4, 0.8, 3.2]],
    [[-3.8, 2.2, 3.2], [-1.4, 2.2, 3.2]],
    [[-3.8, 0.8, 3.2], [-3.8, 2.2, 3.2]],
    [[-1.4, 0.8, 3.2], [-1.4, 2.2, 3.2]],

    // Front right window (x in [3.4, 4.2], y in [0.8, 2.2])
    [[3.4, 0.8, 3.2], [4.2, 0.8, 3.2]],
    [[3.4, 2.2, 3.2], [4.2, 2.2, 3.2]],
    [[3.4, 0.8, 3.2], [3.4, 2.2, 3.2]],
    [[4.2, 0.8, 3.2], [4.2, 2.2, 3.2]],

    // Entrance Porch Door Opening on z = 4.4 (x in [1.6, 2.6], y in [0, 2.2])
    [[1.6, 0, 4.4], [1.6, 2.2, 4.4]],
    [[2.6, 0, 4.4], [2.6, 2.2, 4.4]],
    [[1.6, 2.2, 4.4], [2.6, 2.2, 4.4]],

    // Left wall side window (z in [-1.2, 1.4], y in [0.8, 2.2], x = -4.5)
    [[-4.5, 0.8, -1.2], [-4.5, 0.8, 1.4]],
    [[-4.5, 2.2, -1.2], [-4.5, 2.2, 1.4]],
    [[-4.5, 0.8, -1.2], [-4.5, 2.2, -1.2]],
    [[-4.5, 0.8,  1.4], [-4.5, 2.2,  1.4]],

    // Rear wall windows (z = -3.8)
    [[-3.6, 0.8, -3.8], [-1.6, 0.8, -3.8]],
    [[-3.6, 2.2, -3.8], [-1.6, 2.2, -3.8]],
    [[-3.6, 0.8, -3.8], [-3.6, 2.2, -3.8]],
    [[-1.6, 0.8, -3.8], [-1.6, 2.2, -3.8]],

    [[ 1.6, 0.8, -3.8], [ 3.6, 0.8, -3.8]],
    [[ 1.6, 2.2, -3.8], [ 3.6, 2.2, -3.8]],
    [[ 1.6, 0.8, -3.8], [ 1.6, 2.2, -3.8]],
    [[ 3.6, 0.8, -3.8], [ 3.6, 2.2, -3.8]],

    // Interior hallway wall & door (x = -0.6)
    [[-0.6, 0, -3.56], [-0.6, 2.8, -3.56]],
    [[-0.6, 0,  2.96], [-0.6, 2.8,  2.96]],
    [[-0.6, 2.8, -3.56], [-0.6, 2.8, 2.96]],
    [[-0.6, 0, 0.6], [-0.6, 2.1, 0.6]],
    [[-0.6, 0, 1.6], [-0.6, 2.1, 1.6]],
    [[-0.6, 2.1, 0.6], [-0.6, 2.1, 1.6]]
  ];
  const gndWalls = createLineSegments(gndWallPairs, matBright);
  phase2Group.add(gndWalls);

  // =========================================================================
  // PHASE 03: SECOND STORY & PITCHED ROOF TRUSSES (Matching Frame 0:04)
  // =========================================================================
  const phase3Group = new THREE.Group();
  houseGroup.add(phase3Group);

  // Intermediate floor slab dividing ground and second floor
  const slabBox = createBoxEdges(9.1, 0.16, 7.1, matMuted, 0, 2.88, -0.3);
  phase3Group.add(slabBox);

  const upperWallPairs = [
    // Second floor wall vertical corners (H = 2.96 to 5.2)
    [[-4.5, 2.96, -3.8], [-4.5, 5.2, -3.8]],
    [[ 4.5, 2.96, -3.8], [ 4.5, 5.2, -3.8]],
    [[-4.5, 2.96,  3.2], [-4.5, 5.2,  3.2]],
    [[ 4.5, 2.96,  3.2], [ 4.5, 5.2,  3.2]],

    // Eaves wall plates at y = 5.2
    [[-4.5, 5.2, -3.8], [4.5, 5.2, -3.8]],
    [[ 4.5, 5.2, -3.8], [4.5, 5.2,  3.2]],
    [[ 4.5, 5.2,  3.2], [-4.5, 5.2, 3.2]],
    [[-4.5, 5.2,  3.2], [-4.5, 5.2, -3.8]],

    // Triangular Gable End Walls (Left gable at x = -4.5, Right gable at x = 4.5)
    // Left gable apex at [-4.5, 7.5, -0.3]
    [[-4.5, 5.2, -3.8], [-4.5, 7.5, -0.3]],
    [[-4.5, 5.2,  3.2], [-4.5, 7.5, -0.3]],
    [[-4.5, 5.2, -0.3], [-4.5, 7.5, -0.3]], // Central king strut

    // Right gable apex at [4.5, 7.5, -0.3]
    [[4.5, 5.2, -3.8], [4.5, 7.5, -0.3]],
    [[4.5, 5.2,  3.2], [4.5, 7.5, -0.3]],
    [[4.5, 5.2, -0.3], [4.5, 7.5, -0.3]], // Central king strut

    // Upper Front Windows (z = 3.2, y in [3.6, 4.8])
    // Left upper window
    [[-3.6, 3.6, 3.2], [-1.6, 3.6, 3.2]],
    [[-3.6, 4.8, 3.2], [-1.6, 4.8, 3.2]],
    [[-3.6, 3.6, 3.2], [-3.6, 4.8, 3.2]],
    [[-1.6, 3.6, 3.2], [-1.6, 4.8, 3.2]],

    // Right upper window
    [[ 1.6, 3.6, 3.2], [ 3.6, 3.6, 3.2]],
    [[ 1.6, 4.8, 3.2], [ 3.6, 4.8, 3.2]],
    [[ 1.6, 3.6, 3.2], [ 1.6, 4.8, 3.2]],
    [[ 3.6, 3.6, 3.2], [ 3.6, 4.8, 3.2]],

    // Upper Rear Windows (z = -3.8, y in [3.6, 4.8])
    [[-3.6, 3.6, -3.8], [-1.6, 3.6, -3.8]],
    [[-3.6, 4.8, -3.8], [-1.6, 4.8, -3.8]],
    [[-3.6, 3.6, -3.8], [-3.6, 4.8, -3.8]],
    [[-1.6, 3.6, -3.8], [-1.6, 4.8, -3.8]],

    [[ 1.6, 3.6, -3.8], [ 3.6, 3.6, -3.8]],
    [[ 1.6, 4.8, -3.8], [ 3.6, 4.8, -3.8]],
    [[ 1.6, 3.6, -3.8], [ 1.6, 4.8, -3.8]],
    [[ 3.6, 3.6, -3.8], [ 3.6, 4.8, -3.8]]
  ];
  const upperWalls = createLineSegments(upperWallPairs, matBright);
  phase3Group.add(upperWalls);

  // Pitched Timber Roof Truss Structure (Repetitive Rafters Spanning Roof)
  const roofPairs = [
    // Main apex ridge beam spanning full length with eaves overhang
    [[-5.0, 7.5, -0.3], [5.0, 7.5, -0.3]],
    // Front eaves line (overhang at z = 3.6, y = 5.0)
    [[-5.0, 5.0,  3.6], [5.0, 5.0,  3.6]],
    // Rear eaves line (overhang at z = -4.2, y = 5.0)
    [[-5.0, 5.0, -4.2], [5.0, 5.0, -4.2]]
  ];

  // 11 Exposed Triangular Timber Rafter Trusses (Exactly matching Reference images 3 & 4)
  const numTrusses = 11;
  for (let i = 0; i < numTrusses; i++) {
    const tx = -4.8 + i * (9.6 / (numTrusses - 1));
    // Front rafter beam
    roofPairs.push([[tx, 5.0, 3.6], [tx, 7.5, -0.3]]);
    // Rear rafter beam
    roofPairs.push([[tx, 5.0, -4.2], [tx, 7.5, -0.3]]);
    // Horizontal tie beam
    roofPairs.push([[tx, 5.2, -3.8], [tx, 5.2, 3.2]]);
    // Vertical king post strut
    roofPairs.push([[tx, 5.2, -0.3], [tx, 7.5, -0.3]]);
    // Diagonal truss web struts
    roofPairs.push([[tx, 5.2, -1.8], [tx, 6.35, -0.3]]);
    roofPairs.push([[tx, 5.2,  1.2], [tx, 6.35, -0.3]]);
  }

  // Front Porch Pitched Canopy Roof (y = 2.6 to 3.3, z in [3.2, 4.5], x in [0.9, 3.3])
  roofPairs.push(
    [[2.1, 3.3, 3.2], [2.1, 3.3, 4.6]], // Porch ridge beam
    [[0.9, 2.6, 4.6], [2.1, 3.3, 4.6]], // Porch front left rafter
    [[3.3, 2.6, 4.6], [2.1, 3.3, 4.6]], // Porch front right rafter
    [[0.9, 2.6, 3.2], [2.1, 3.3, 3.2]], // Porch rear left rafter
    [[3.3, 2.6, 3.2], [2.1, 3.3, 3.2]]  // Porch rear right rafter
  );

  // Roof Dimension Callout Line (Matching "A: 14.5m" from Reference image 3)
  const calloutPairs = [
    [[-4.5, 6.8, -0.3], [-6.2, 7.2, -0.3]],
    [[-6.2, 7.2, -0.3], [-7.2, 7.2, -0.3]],
    [[-4.5, 6.8, -0.3], [-4.6, 6.95, -0.3]], // Arrow tick 1
    [[-4.5, 6.8, -0.3], [-4.4, 6.65, -0.3]]  // Arrow tick 2
  ];

  const roofStructure = createLineSegments(roofPairs, matBright);
  const calloutStructure = createLineSegments(calloutPairs, matDim);
  phase3Group.add(roofStructure);
  phase3Group.add(calloutStructure);

  // =========================================================================
  // PHASE 04: INTERIOR STAIRS, FURNITURE, CHIMNEY & DETAILS (Matching Frame 0:06)
  // =========================================================================
  const phase4Group = new THREE.Group();
  houseGroup.add(phase4Group);

  // 1. Central Masonry Chimney on Roof
  const chimney = createBoxEdges(0.85, 2.6, 0.85, matBright, -0.2, 7.6, -0.3);
  const chimneyCap = createBoxEdges(1.05, 0.12, 1.05, matMuted, -0.2, 8.95, -0.3);
  phase4Group.add(chimney);
  phase4Group.add(chimneyCap);

  // 2. Interior Circulation Staircase (10 Steps Rising from Floor to Upper Slab)
  const stairPairs = [];
  const numSteps = 10;
  for (let s = 0; s < numSteps; s++) {
    const sy = s * (2.8 / numSteps);
    const sz = -2.6 + s * (3.2 / numSteps);
    const sx1 = -0.55;
    const sx2 = 0.55;
    const nextY = (s + 1) * (2.8 / numSteps);
    const nextZ = sz + (3.2 / numSteps);

    // Tread rectangle
    stairPairs.push([[sx1, nextY, sz], [sx2, nextY, sz]]);
    stairPairs.push([[sx1, nextY, nextZ], [sx2, nextY, nextZ]]);
    stairPairs.push([[sx1, nextY, sz], [sx1, nextY, nextZ]]);
    stairPairs.push([[sx2, nextY, sz], [sx2, nextY, nextZ]]);

    // Vertical riser
    stairPairs.push([[sx1, sy, sz], [sx1, nextY, sz]]);
    stairPairs.push([[sx2, sy, sz], [sx2, nextY, sz]]);
    stairPairs.push([[sx1, sy, sz], [sx2, sy, sz]]);

    // Staircase handrail balusters every other step
    if (s % 2 === 0) {
      stairPairs.push([[sx2, nextY, (sz + nextZ) * 0.5], [sx2, nextY + 0.9, (sz + nextZ) * 0.5]]);
    }
  }
  // Sloping Handrail
  stairPairs.push([[0.55, 0.9, -2.6], [0.55, 3.7, 0.6]]);
  const stairs = createLineSegments(stairPairs, matMuted);
  phase4Group.add(stairs);

  // 3. Interior Furniture Wireframes (Matching Reference Frame 4)
  const furnPairs = [];

  // Living Room Sectional Sofa (L-shaped, in front left room)
  // Main couch block
  const sofaMain = [
    // Base frame
    [[-3.8, 0.45, 0.6], [-1.8, 0.45, 0.6]],
    [[-3.8, 0.45, 1.6], [-1.8, 0.45, 1.6]],
    [[-3.8, 0.45, 0.6], [-3.8, 0.45, 1.6]],
    [[-1.8, 0.45, 0.6], [-1.8, 0.45, 1.6]],
    // 4 legs
    [[-3.8, 0, 0.6], [-3.8, 0.45, 0.6]],
    [[-1.8, 0, 0.6], [-1.8, 0.45, 0.6]],
    [[-3.8, 0, 1.6], [-3.8, 0.45, 1.6]],
    [[-1.8, 0, 1.6], [-1.8, 0.45, 1.6]],
    // Backrest (H = 0.85)
    [[-3.8, 0.85, 0.6], [-1.8, 0.85, 0.6]],
    [[-3.8, 0.45, 0.6], [-3.8, 0.85, 0.6]],
    [[-1.8, 0.45, 0.6], [-1.8, 0.85, 0.6]],
    // Cushion seam dividers
    [[-3.13, 0.45, 0.6], [-3.13, 0.45, 1.6]],
    [[-2.46, 0.45, 0.6], [-2.46, 0.45, 1.6]],
    // Armrest
    [[-3.8, 0.68, 0.6], [-3.8, 0.68, 1.6]],
    [[-3.8, 0.45, 1.6], [-3.8, 0.68, 1.6]]
  ];
  sofaMain.forEach(p => furnPairs.push(p));

  // Coffee table in living room
  const ctBox = [
    [[-3.4, 0.38, 2.0], [-2.2, 0.38, 2.0]],
    [[-3.4, 0.38, 2.6], [-2.2, 0.38, 2.6]],
    [[-3.4, 0.38, 2.0], [-3.4, 0.38, 2.6]],
    [[-2.2, 0.38, 2.0], [-2.2, 0.38, 2.6]],
    [[-3.4, 0, 2.0], [-3.4, 0.38, 2.0]],
    [[-2.2, 0, 2.0], [-2.2, 0.38, 2.0]],
    [[-3.4, 0, 2.6], [-3.4, 0.38, 2.6]],
    [[-2.2, 0, 2.6], [-2.2, 0.38, 2.6]]
  ];
  ctBox.forEach(p => furnPairs.push(p));

  // Dining Table & Chairs in rear room
  // Table top at y = 0.76
  const diningTable = [
    [[-3.6, 0.76, -2.8], [-2.0, 0.76, -2.8]],
    [[-3.6, 0.76, -1.8], [-2.0, 0.76, -1.8]],
    [[-3.6, 0.76, -2.8], [-3.6, 0.76, -1.8]],
    [[-2.0, 0.76, -2.8], [-2.0, 0.76, -1.8]],
    [[-3.6, 0, -2.8], [-3.6, 0.76, -2.8]],
    [[-2.0, 0, -2.8], [-2.0, 0.76, -2.8]],
    [[-3.6, 0, -1.8], [-3.6, 0.76, -1.8]],
    [[-2.0, 0, -1.8], [-2.0, 0.76, -1.8]]
  ];
  diningTable.forEach(p => furnPairs.push(p));

  // 4 Dining Chairs around table
  const chairCenters = [
    [-3.2, -3.15], [-2.4, -3.15], // front pair
    [-3.2, -1.45], [-2.4, -1.45]  // rear pair
  ];
  chairCenters.forEach(([cx, cz]) => {
    const hw = 0.22;
    // Seat rectangle at y = 0.44
    furnPairs.push(
      [[cx - hw, 0.44, cz - hw], [cx + hw, 0.44, cz - hw]],
      [[cx + hw, 0.44, cz - hw], [cx + hw, 0.44, cz + hw]],
      [[cx + hw, 0.44, cz + hw], [cx - hw, 0.44, cz + hw]],
      [[cx - hw, 0.44, cz + hw], [cx - hw, 0.44, cz - hw]],
      // 4 legs
      [[cx - hw, 0, cz - hw], [cx - hw, 0.44, cz - hw]],
      [[cx + hw, 0, cz - hw], [cx + hw, 0.44, cz - hw]],
      [[cx + hw, 0, cz + hw], [cx + hw, 0.44, cz + hw]],
      [[cx - hw, 0, cz + hw], [cx - hw, 0.44, cz + hw]],
      // Backrest
      [[cx - hw, 0.88, cz - hw], [cx + hw, 0.88, cz - hw]],
      [[cx - hw, 0.44, cz - hw], [cx - hw, 0.88, cz - hw]],
      [[cx + hw, 0.44, cz - hw], [cx + hw, 0.88, cz - hw]]
    );
  });

  // Upstairs Bedroom Bed (Upper floor slab y = 2.96)
  const bedBox = [
    // Mattress base (y = 3.4)
    [[1.8, 3.4, -3.2], [3.6, 3.4, -3.2]],
    [[1.8, 3.4, -1.4], [3.6, 3.4, -1.4]],
    [[1.8, 3.4, -3.2], [1.8, 3.4, -1.4]],
    [[3.6, 3.4, -3.2], [3.6, 3.4, -1.4]],
    // 4 legs
    [[1.8, 2.96, -3.2], [1.8, 3.4, -3.2]],
    [[3.6, 2.96, -3.2], [3.6, 3.4, -3.2]],
    [[1.8, 2.96, -1.4], [1.8, 3.4, -1.4]],
    [[3.6, 2.96, -1.4], [3.6, 3.4, -1.4]],
    // Headboard at z = -3.2 (H = 4.0)
    [[1.8, 4.0, -3.2], [3.6, 4.0, -3.2]],
    [[1.8, 3.4, -3.2], [1.8, 4.0, -3.2]],
    [[3.6, 3.4, -3.2], [3.6, 4.0, -3.2]],
    // Two Pillows
    [[2.0, 3.5, -3.0], [2.6, 3.5, -3.0]],
    [[2.0, 3.5, -2.6], [2.6, 3.5, -2.6]],
    [[2.0, 3.5, -3.0], [2.0, 3.5, -2.6]],
    [[2.6, 3.5, -3.0], [2.6, 3.5, -2.6]],
    [[2.8, 3.5, -3.0], [3.4, 3.5, -3.0]],
    [[2.8, 3.5, -2.6], [3.4, 3.5, -2.6]],
    [[2.8, 3.5, -3.0], [2.8, 3.5, -2.6]],
    [[3.4, 3.5, -3.0], [3.4, 3.5, -2.6]]
  ];
  bedBox.forEach(p => furnPairs.push(p));

  const furniture = createLineSegments(furnPairs, matDim);
  phase4Group.add(furniture);

  // 4. Front Entrance Concrete Steps (3 Steps Cascading Down to Grid)
  const step1 = createBoxEdges(1.6, 0.12, 0.4, matBright, 2.1, 0.06, 4.6);
  const step2 = createBoxEdges(1.8, 0.12, 0.4, matMuted, 2.1, 0.18, 4.8);
  const step3 = createBoxEdges(2.0, 0.12, 0.4, matMuted, 2.1, 0.30, 5.0);
  phase4Group.add(step1);
  phase4Group.add(step2);
  phase4Group.add(step3);

  // 5. Window Cross-Mullions (Glazing Grid on Windows)
  const mullionPairs = [
    // Front ground living window (z = 3.2, x in [-3.8, -1.4], y in [0.8, 2.2])
    [[-2.6, 0.8, 3.2], [-2.6, 2.2, 3.2]], // Vertical center mullion
    [[-3.8, 1.5, 3.2], [-1.4, 1.5, 3.2]], // Horizontal transom bar

    // Front ground right window
    [[3.8, 0.8, 3.2], [3.8, 2.2, 3.2]],
    [[3.4, 1.5, 3.2], [4.2, 1.5, 3.2]],

    // Upper front left window
    [[-2.6, 3.6, 3.2], [-2.6, 4.8, 3.2]],
    [[-3.6, 4.2, 3.2], [-1.6, 4.2, 3.2]],

    // Upper front right window
    [[2.6, 3.6, 3.2], [2.6, 4.8, 3.2]],
    [[1.6, 4.2, 3.2], [3.6, 4.2, 3.2]],

    // Left wall ground window
    [[-4.5, 0.8, 0.1], [-4.5, 2.2, 0.1]],
    [[-4.5, 1.5, -1.2], [-4.5, 1.5, 1.4]]
  ];
  const mullions = createLineSegments(mullionPairs, matMuted);
  phase4Group.add(mullions);

  // =========================================================================
  // 5. GSAP 4-PHASE PROGRESSIVE ASSEMBLY TIMELINE
  // =========================================================================
  const phaseStepEls = [
    document.getElementById('phase-step-1'),
    document.getElementById('phase-step-2'),
    document.getElementById('phase-step-3'),
    document.getElementById('phase-step-4')
  ];

  function setPhaseIndicator(index) {
    phaseStepEls.forEach((el, i) => {
      if (!el) return;
      if (i <= index) el.classList.add('active');
      else el.classList.remove('active');
    });
  }

  // Initial states
  phase1Group.scale.set(0.001, 1, 0.001);
  phase2Group.scale.set(1, 0.001, 1);
  phase3Group.scale.set(1, 0.001, 1);
  phase4Group.scale.set(1, 0.001, 1);

  const animState = {
    p1: 0,
    p2: 0,
    p3: 0,
    p4: 0,
    camX: 18.0,
    camY: 13.5,
    camZ: 18.0
  };

  const tl = window.gsap.timeline({
    repeat: 0,
    repeatDelay: 0,
    defaults: { ease: 'power2.out' },
    onUpdate: () => {
      // Phase 1: Blueprint expands on ground
      phase1Group.scale.set(Math.max(0.001, animState.p1), 1, Math.max(0.001, animState.p1));
      matBright.opacity = Math.min(1, animState.p1 * 1.1);
      matFloorDim.opacity = Math.min(0.8, animState.p1);

      // Phase 2: Vertical walls extrude up
      phase2Group.scale.y = Math.max(0.001, animState.p2);
      matGuide.opacity = Math.max(0, (1 - animState.p3) * animState.p2 * 0.65); // Guide rays pulse & then soften

      // Phase 3: Second story & roof trusses fan out
      phase3Group.scale.y = Math.max(0.001, animState.p3);
      phase3Group.position.y = (1 - animState.p3) * 1.8;
      matMuted.opacity = Math.min(0.9, animState.p3);

      // Phase 4: Interior stairs, furniture, chimney & details snap into place
      phase4Group.scale.set(1, Math.max(0.001, animState.p4), 1);
      matDim.opacity = Math.min(0.75, animState.p4);

      // Camera elevation
      camera.position.set(animState.camX, animState.camY, animState.camZ);
      camera.lookAt(0, 2.8, 0);
    }
  });

  // Phase 1: Foundation (0.0s -> 2.2s)
  tl.call(() => setPhaseIndicator(0), null, 0.0);
  tl.to(animState, { p1: 1, duration: 2.0, ease: 'power3.out' }, 0.0);
  tl.to(animState, { camX: 16.5, camY: 11.5, camZ: 16.5, duration: 2.2 }, 0.0);

  // Phase 2: Framing & Ground Walls (2.2s -> 4.8s)
  tl.call(() => setPhaseIndicator(1), null, 2.2);
  tl.to(animState, { p2: 1, duration: 2.4, ease: 'power2.inOut' }, 2.2);
  tl.to(animState, { camX: 15.2, camY: 10.8, camZ: 17.4, duration: 2.4 }, 2.2);

  // Phase 3: Second Floor & Timber Roof Trusses (4.8s -> 7.4s)
  tl.call(() => setPhaseIndicator(2), null, 4.8);
  tl.to(animState, { p3: 1, duration: 2.4, ease: 'power2.out' }, 4.8);
  tl.to(animState, { camX: 14.5, camY: 9.8, camZ: 17.8, duration: 2.4 }, 4.8);

  // Phase 4: Stairs, Furniture, Chimney, Mullions (7.4s -> 10.0s)
  tl.call(() => setPhaseIndicator(3), null, 7.4);
  tl.to(animState, { p4: 1, duration: 2.2, ease: 'power2.out' }, 7.4);
  tl.to(animState, { camX: 13.8, camY: 9.4, camZ: 18.0, duration: 2.4 }, 7.4);

  // Allow clicking on HUD steps to jump timeline immediately
  const phaseStartTimes = [0.1, 2.3, 4.9, 7.5];
  phaseStepEls.forEach((el, idx) => {
    if (!el) return;
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      tl.seek(phaseStartTimes[idx]);
      setPhaseIndicator(idx);
    });
  });

  // 6. Dampened Mouse Parallax
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });

  // 7. 60 FPS Render Loop
  let reqId;
  function animate() {
    reqId = requestAnimationFrame(animate);

    mouse.x += (mouse.targetX - mouse.x) * 0.04;
    mouse.y += (mouse.targetY - mouse.y) * 0.04;

    camera.position.x = animState.camX + mouse.x * 1.5;
    camera.position.y = animState.camY + mouse.y * 1.2;
    camera.lookAt(0, 2.8, 0);

    renderer.render(scene, camera);
  }
  animate();

  // Resize Handler
  function onResize() {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }
  window.addEventListener('resize', onResize);
}

/**
 * ==========================================================================
 * 2. JESPER LANDBERG EXACT 3D CURVED CYLINDRICAL CAROUSEL (jesperlandberg.com)
 * WebGL scene with Three.js:
 * - Cylindrical arc curve coordinates (R = 13.5)
 * - Curved vertex geometry for each panoramic card
 * - Retina canvas textures with embedded titles and circular arrow buttons
 * - High-precision inertia drag, fling momentum, and wheel panning
 * - Perspective 3D ground grid
 * - Smooth raycast click with zoom flight into Nathan Riley modal
 * ==========================================================================
 */
const JESPER_PROJECTS = [
  {
    id: 'furlenco',
    title: 'Furlenco Flagship',
    sub: 'Retail Fit-Out • 8,500 Sq.Ft',
    image: 'assets/images/furlenco_store.jpg'
  },
  {
    id: 'mokobara',
    title: 'Mokobara Boutique',
    sub: 'Travel Retail • 2,400 Sq.Ft',
    image: 'assets/images/mokobara_store.jpg'
  },
  {
    id: 'bewakoof',
    title: 'Bewakoof Flagship',
    sub: 'Apparel Store • 3,800 Sq.Ft',
    image: 'assets/images/bewakoof_store.jpg'
  },
  {
    id: 'artisan',
    title: 'Artisan Bath Studio',
    sub: 'Experience Center • 7,200 Sq.Ft',
    image: 'assets/images/showroom_store.jpg'
  },
  {
    id: 'nexus-hq',
    title: 'Nexus Tech HQ',
    sub: 'Corporate Office • 22,000 Sq.Ft',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'sovereign',
    title: 'The Sovereign Villa',
    sub: 'Ultra-Luxury Living • 6,800 Sq.Ft',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'lumina',
    title: 'Lumina Bistro & Bar',
    sub: 'Hospitality • 5,200 Sq.Ft',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'
  }
];

function initJesperLandbergCylinder() {
  const container = document.getElementById('three-cylinder-container');
  const wrapper = document.getElementById('webgl-canvas-wrapper');
  const hudTitle = document.getElementById('hud-active-title');
  const prevBtn = document.getElementById('webgl-prev-btn');
  const nextBtn = document.getElementById('webgl-next-btn');
  const centerExploreBtn = document.getElementById('center-explore-btn');
  const track = document.getElementById('jesper-scroll-track');
  const progressDashes = document.querySelectorAll('.jesper-progress-bar');

  if (!container || !wrapper || !window.THREE) return;

  const width = wrapper.clientWidth || window.innerWidth;
  const height = wrapper.clientHeight || window.innerHeight;

  // 1. Scene & Camera Setup (exact Jesper Landberg camera parameters)
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.012);

  const fov = 53.4;
  const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);
  camera.position.set(0, 0, 41.18);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // 2. Exact Card Dimensions & Gaps (Matching user uploaded screenshot media_1790854584315.png)
  // Center card: ~42% screen width, ~53% screen height, subtle calm S-curve
  const cardWidth = 26.8;
  const cardHeight = 20.4;
  const slotWidth = 27.4; // clean subtle gap (~10-14px)
  const totalCards = JESPER_PROJECTS.length;
  const totalTrackWidth = totalCards * slotWidth;
  const restingOffset = -2.2;

  // Ultra-subdivided plane geometry so vertex shader bends each vertex seamlessly
  const planeGeo = new THREE.PlaneGeometry(cardWidth, cardHeight, 48, 32);

  // Calculate Frustum parameters
  function getFrustumParams() {
    const fovRad = (camera.fov * Math.PI) / 180;
    const frustumH = 2 * Math.tan(fovRad / 2) * camera.position.z;
    const frustumW = frustumH * camera.aspect;
    const halfW = frustumW / 2;
    const isSmall = window.innerWidth < 768;
    return {
      H: frustumH,
      W: frustumW,
      halfW: halfW,
      // Calibrated to match Jesper Landberg (media_1790854584315.png):
      // D is s * depth where depth = 0.09~0.10. Calm, gentle S-curve, no extreme forward bulging.
      sheetD: isSmall ? halfW * 0.08 : halfW * 0.095,
      sheetC: isSmall ? 0.0 : 1.0,
      sheetT: isSmall ? 1.0 : 1.15,
      // Door hinge angle: hinges whole strip back into screen on the right
      leanA: isSmall ? 0.0 : halfW * -0.10,
      leanW: halfW
    };
  }

  let frustum = getFrustumParams();

  // 3. Procedural Perspective Floor Grid with Right-Most Shine
  // "there must be this grid and when scroling the right most part of the grid slightly shines"
  const floorW = frustum.W * 3.5;
  const floorD = 140.0;
  const floorGeo = new THREE.PlaneGeometry(floorW, floorD, 64, 48);
  floorGeo.rotateX(-Math.PI / 2);

  const floorMat = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vWorld;
      varying float vFar;

      uniform float u_run;

      void main() {
        vUv = uv;
        vec4 w = modelMatrix * vec4(position, 1.0);
        vWorld = w.xyz;
        vFar = -w.z / max(u_run, 0.0001);
        gl_Position = projectionMatrix * viewMatrix * w;
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vWorld;
      varying float vFar;

      uniform vec3 u_c0;        // horizon black
      uniform vec3 u_c1;        // near floor tint
      uniform vec2 u_gridF;     // grid cell frequency
      uniform float u_sheetV;   // scroll velocity [0.0, 1.0]
      uniform float u_frustumW; // frustum half width

      void main() {
        // 1. Dissolve fade into the dark horizon
        float fade = 1.0 - smoothstep(0.12, 0.90, vFar);
        if (fade < 0.001) discard;

        // 2. Base floor color with contact shadow under cards
        float contact = exp(-abs(vFar - 0.04) * 14.0);
        vec3 col = mix(u_c1, u_c0, smoothstep(0.0, 0.85, vFar));
        col *= 1.0 - contact * 0.65;

        // 3. Crisp antialiased grid lines via fwidth
        vec2 g = vec2(vUv.x * u_gridF.x, vFar * u_gridF.y);
        vec2 gf = abs(fract(g) - 0.5);
        vec2 gw = fwidth(g) * 1.5;
        vec2 lines = vec2(1.0) - smoothstep(vec2(0.0), gw, gf);
        float line = max(lines.x, lines.y);

        // Base subtle warm stone/charcoal grid line
        vec3 gridLineColor = vec3(0.22, 0.18, 0.15);
        col += line * gridLineColor * fade;

        // 4. "when scrolling the right most part of the grid slightly shines"
        // Normalized X coordinate across the floor (-1 to 1)
        float normX = (vWorld.x / max(u_frustumW, 0.001)) * 0.5 + 0.5;
        
        // Mask for the right-hand portion of the grid
        float rightMask = smoothstep(0.42, 0.95, normX);
        float depthFalloff = exp(-abs(vFar - 0.12) * 4.0);

        // Subtle resting sheen (0.18) + dynamic shine boost when scrolling (up to 1.0)
        float shineAmount = rightMask * (0.18 + 0.82 * u_sheetV) * depthFalloff;
        
        // Radiant architectural warm sand & ivory sheen along the right grid lines
        vec3 shineColor = vec3(0.94, 0.86, 0.76);
        col += line * shineColor * shineAmount * 2.4 * fade;

        gl_FragColor = vec4(col, fade);
      }
    `,
    uniforms: {
      u_run: { value: floorD },
      u_c0: { value: new THREE.Color(0x0a0807) },
      u_c1: { value: new THREE.Color(0x181412) },
      u_gridF: { value: new THREE.Vector2(28.0, 16.0) },
      u_sheetV: { value: 0.0 },
      u_frustumW: { value: frustum.halfW }
    },
    transparent: true,
    depthWrite: false
  });

  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.position.set(0, -9.6, -floorD / 2 + 10.0);
  scene.add(floorMesh);

  // 4. Exact Jesper Landberg GLSL Vertex Shader
  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vWorldPos;
    varying vec3 vNormal;

    uniform float u_sheetW; // frustum half-width at z=0
    uniform float u_sheetD; // wave depth amplitude
    uniform float u_sheetT; // span of S-curve
    uniform float u_sheetC; // 0 = symmetric bowl, 1 = near-to-far S
    uniform float u_sheetP; // sheet strength (1.0 on strip)
    uniform float u_sheetV; // velocity magnitude [0.0, 1.0]
    uniform float u_hover;  // hover dent trigger
    uniform float u_dent;   // hover dent depth
    uniform vec2 u_res;
    uniform float u_leanA;  // door lean amplitude (hinge swing)
    uniform float u_leanW;  // door lean width

    const float SHEET_PI = 3.141592653589793;
    const float SHEET_SHIFT = -0.2;
    const float SHEET_TAIL = 1.0;
    const float SHEET_BANK = -0.16;
    const float SHEET_DIAG = 0.03;
    const float SHEET_WAVE = 0.0;
    const float SHEET_WAVE_F = 0.8;
    const float SHEET_WAVE_PH = 0.35;
    const float SHEET_REAR_Y = 0.12;
    const float SHEET_REAR_Z = 0.24;
    const float SHEET_VTWIST = 1.8;

    float sheetQ(float wx) {
      return wx / max(u_sheetW, 0.0001) * u_sheetT + SHEET_SHIFT;
    }

    float sheetShape(float q) {
      return mix(1.0 - q * q, sin(SHEET_PI * q), u_sheetC) * exp(-SHEET_TAIL * q * q);
    }

    float sheetShapeSlope(float q) {
      float g = exp(-SHEET_TAIL * q * q);
      float bowl = -2.0 * q * (1.0 + SHEET_TAIL * (1.0 - q * q));
      float ess = SHEET_PI * cos(SHEET_PI * q) - 2.0 * SHEET_TAIL * q * sin(SHEET_PI * q);
      return mix(bowl, ess, u_sheetC) * g;
    }

    float sheetZ(float wx) {
      return -u_sheetD * sheetShape(sheetQ(wx));
    }

    float leanRamp(float s) {
      s = clamp(s, -1.0, 1.0);
      return s * (1.5 - 0.5 * s * s);
    }

    float leanSlope(float s) {
      s = min(abs(s), 1.0);
      return 1.5 * (1.0 - s * s);
    }

    vec4 lean(vec4 w, float k) {
      if (u_leanW > 0.001 && k > 0.001) {
        w.z += u_leanA * leanRamp(w.x / u_leanW) * k;
      }
      return w;
    }

    float sheetRoll(float wx) {
      if (u_sheetW < 0.001) return 0.0;
      return SHEET_BANK * sheetShapeSlope(sheetQ(wx)) / SHEET_PI * u_sheetC * u_sheetP;
    }

    vec4 sheetWind(vec4 w) {
      float a = sheetRoll(w.x);
      if (u_sheetV > 0.001 && u_sheetW > 0.001 && u_sheetP > 0.001) {
        float qe = w.x / u_sheetW;
        a += SHEET_VTWIST * u_sheetV * smoothstep(0.3, 0.9, abs(qe)) * sign(qe) * u_sheetP;
      }
      if (abs(a) < 0.0001) return w;
      float s = sin(a); float c = cos(a);
      return vec4(w.x, w.y * c - w.z * s, w.y * s + w.z * c, w.w);
    }

    vec4 sheet(vec4 w) {
      w = sheetWind(w);
      w.z += sheetZ(w.x) * u_sheetP;
      if (u_sheetW > 0.001) {
        float qw = w.x / u_sheetW;
        w.y += SHEET_DIAG * w.x * u_sheetP;
        w.y += SHEET_WAVE * u_sheetW * sin(SHEET_PI * (qw * SHEET_WAVE_F + SHEET_WAVE_PH)) * u_sheetP;
        if (u_sheetV > 0.001) {
          float m = 1.0 - smoothstep(-1.0, 0.3, qw);
          w.y += SHEET_REAR_Y * u_sheetW * u_sheetV * m * u_sheetP;
          w.z += SHEET_REAR_Z * u_sheetW * u_sheetV * m * u_sheetP;
        }
      }
      return w;
    }

    float sheetDome(vec2 uv) {
      vec2 q = uv * 2.0 - 1.0;
      return (1.0 - q.x * q.x) * (1.0 - q.y * q.y);
    }

    void main() {
      vUv = uv;
      vec4 w = modelMatrix * vec4(position, 1.0);
      if (u_hover > 0.0001) {
        w.z -= u_hover * u_dent * u_res.y * sheetDome(uv);
      }
      w = sheet(w);
      w = lean(w, u_sheetP);
      vWorldPos = w.xyz;

      // Analytical normal computation matching Jesper Landberg GLSL
      float dzdx = 0.0;
      if (u_sheetW > 0.001 && u_sheetP > 0.001 && u_sheetD > 0.001) {
        dzdx += -u_sheetD * sheetShapeSlope(sheetQ(w.x)) * u_sheetT / u_sheetW * u_sheetP;
      }
      if (u_leanW > 0.001 && u_sheetP > 0.001) {
        dzdx += u_leanA * leanSlope(w.x / u_leanW) / u_leanW * u_sheetP;
      }
      vec3 n = normalize(vec3(-dzdx, 0.0, 1.0));
      float a = sheetRoll(w.x);
      if (abs(a) > 0.0001) {
        float s = sin(a); float c = cos(a);
        n = vec3(n.x, n.y * c - n.z * s, n.y * s + n.z * c);
      }
      vNormal = n;

      gl_Position = projectionMatrix * viewMatrix * w;
    }
  `;

  // 5. Exact Jesper Landberg GLSL Fragment Shader
  const fragmentShader = `
    varying vec2 vUv;
    varying vec3 vWorldPos;
    varying vec3 vNormal;

    uniform sampler2D u_texture;
    uniform vec2 u_res;
    uniform float u_corner;
    uniform vec3 u_cameraPos;

    const vec3 LIGHT_DIR = normalize(vec3(-0.4, 0.5, 1.0));
    const float LIGHT_GLOSS = 38.0;
    const float LIGHT_SPEC = 0.32;
    const float LIGHT_DIFF = 0.12;

    float roundedBoxSDF(vec2 centerPos, vec2 size, float radius) {
      vec2 d = abs(centerPos) - size + radius;
      return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - radius;
    }

    void main() {
      vec2 pixelPos = (vUv - 0.5) * u_res;
      float r = u_corner * u_res.y;
      float dist = roundedBoxSDF(pixelPos, u_res * 0.5, r);
      float edgeAlpha = 1.0 - smoothstep(-0.06, 0.06, dist);
      if (edgeAlpha < 0.001) discard;

      vec4 texColor = texture2D(u_texture, vUv);

      vec3 n = normalize(vNormal);
      vec3 v = normalize(u_cameraPos - vWorldPos);
      float d = dot(n, LIGHT_DIR) * 0.5 + 0.5;
      vec3 col = texColor.rgb * (1.0 - LIGHT_DIFF * (1.0 - d));

      vec3 h = normalize(LIGHT_DIR + v);
      float spec = pow(max(dot(n, h), 0.0), LIGHT_GLOSS) * LIGHT_SPEC;
      col += spec;

      // Subtle specular rim highlight around curved borders
      float borderDist = abs(dist + 0.04);
      float rim = smoothstep(0.08, 0.0, borderDist) * 0.25;
      col += vec3(rim);

      gl_FragColor = vec4(col, texColor.a * edgeAlpha);
    }
  `;

  // Helper to generate high-resolution retina canvas textures (Aspect ratio ~1.28 matching 23.5 x 18.2)
  function createCardTexture(project) {
    const canvas = document.createElement('canvas');
    canvas.width = 1320;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;

    function renderContent(loadedImg) {
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw rounded rectangle clip
      const r = 36;
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(canvas.width - r, 0);
      ctx.quadraticCurveTo(canvas.width, 0, canvas.width, r);
      ctx.lineTo(canvas.width, canvas.height - r);
      ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - r, canvas.height);
      ctx.lineTo(r, canvas.height);
      ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.clip();

      if (loadedImg) {
        const imgAspect = loadedImg.width / loadedImg.height;
        const canvasAspect = canvas.width / canvas.height;
        let dw, dh, dx, dy;
        if (imgAspect > canvasAspect) {
          dh = canvas.height;
          dw = dh * imgAspect;
          dx = (canvas.width - dw) / 2;
          dy = 0;
        } else {
          dw = canvas.width;
          dh = dw / imgAspect;
          dx = 0;
          dy = (canvas.height - dh) / 2;
        }
        ctx.drawImage(loadedImg, dx, dy, dw, dh);
      } else {
        const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        bgGrad.addColorStop(0, '#1c2432');
        bgGrad.addColorStop(1, '#0c1017');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 2. Cinematic bottom shadow gradient
      const grad = ctx.createLinearGradient(0, canvas.height * 0.45, 0, canvas.height);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(0.65, 'rgba(0, 0, 0, 0.72)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 3. Clean Jesper Landberg Typography on bottom
      ctx.fillStyle = '#ffffff';
      ctx.font = "700 46px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(project.title, 54, canvas.height - 76);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
      ctx.font = "500 22px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(project.sub, 56, canvas.height - 38);

      // 4. Circular Arrow Button on bottom right (as in jesperlandberg.com)
      const btnX = canvas.width - 76;
      const btnY = canvas.height - 60;
      const btnRadius = 26;

      ctx.beginPath();
      ctx.arc(btnX, btnY, btnRadius, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(12, 16, 24, 0.88)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = "700 24px sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('→', btnX + 1, btnY);

      ctx.restore();
      texture.needsUpdate = true;
    }

    renderContent(null);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = project.image;
    img.onload = () => {
      renderContent(img);
    };

    return texture;
  }

  // 6. Instantiate Card Meshes with Custom Shader Materials
  const cardMeshes = [];
  const ribbonGroup = new THREE.Group();
  ribbonGroup.position.y = 1.0;
  scene.add(ribbonGroup);

  JESPER_PROJECTS.forEach((proj, i) => {
    const texture = createCardTexture(proj);
    const mat = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        u_texture: { value: texture },
        u_res: { value: new THREE.Vector2(cardWidth, cardHeight) },
        u_corner: { value: 0.08 },
        u_sheetW: { value: frustum.halfW },
        u_sheetD: { value: frustum.sheetD },
        u_sheetT: { value: frustum.sheetT },
        u_sheetC: { value: frustum.sheetC },
        u_leanA: { value: frustum.leanA },
        u_leanW: { value: frustum.leanW },
        u_sheetP: { value: 1.0 },
        u_sheetV: { value: 0.0 },
        u_hover: { value: 0.0 },
        u_dent: { value: 0.08 },
        u_cameraPos: { value: camera.position }
      },
      transparent: true,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(planeGeo, mat);
    mesh.userData = {
      id: proj.id,
      title: proj.title,
      index: i
    };

    ribbonGroup.add(mesh);
    cardMeshes.push(mesh);
  });

  // 7. Infinite Scroll & Physics State
  // Starts exactly at the resting position of Project 0 matching screenshot media_1790854165173.png
  let targetScrollX = -restingOffset;
  let currentScrollX = -restingOffset;
  let velMagnitude = 0;
  let isDragging = false;
  let isWheeling = false;
  let lastWheelTime = 0;
  let lastX = 0;
  let velocityX = 0;
  let lastMoveTime = Date.now();
  let pointerDownPos = { x: 0, y: 0 };

  // True Infinite Wheel Scroll: loops endlessly in both directions
  wrapper.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    targetScrollX += delta * 0.052;
    isWheeling = true;
    lastWheelTime = performance.now();
  }, { passive: false });

  // Pointer Dragging with High-Precision Momentum
  wrapper.addEventListener('pointerdown', (e) => {
    isDragging = true;
    isWheeling = false;
    lastX = e.clientX;
    lastMoveTime = Date.now();
    velocityX = 0;
    pointerDownPos = { x: e.clientX, y: e.clientY };
    wrapper.style.cursor = 'grabbing';
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) {
      handlePointerHover(e);
      return;
    }

    const deltaX = e.clientX - lastX;
    userDragOffset -= deltaX * 0.052;
    targetScrollX -= deltaX * 0.052;

    const now = Date.now();
    const dt = Math.max(1, now - lastMoveTime);
    velocityX = -(deltaX / dt) * 0.38;

    lastX = e.clientX;
    lastMoveTime = now;
  });

  window.addEventListener('pointerup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    wrapper.style.cursor = 'grab';

    // Fling inertia
    targetScrollX += velocityX * 6.5;

    // Smoothly snap to resting position after flick
    setTimeout(() => {
      const nearestK = Math.round((targetScrollX + restingOffset) / slotWidth);
      targetScrollX = nearestK * slotWidth - restingOffset;
    }, 280);

    const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
    if (dist < 8) {
      handleCardClick(e);
    }
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      const nearestK = Math.round((targetScrollX + restingOffset) / slotWidth);
      targetScrollX = (nearestK + 1) * slotWidth - restingOffset;
    } else if (e.key === 'ArrowLeft') {
      const nearestK = Math.round((targetScrollX + restingOffset) / slotWidth);
      targetScrollX = (nearestK - 1) * slotWidth - restingOffset;
    }
  });

  // Navigation Arrows
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const nearestK = Math.round((targetScrollX + restingOffset) / slotWidth);
      targetScrollX = (nearestK + 1) * slotWidth - restingOffset;
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const nearestK = Math.round((targetScrollX + restingOffset) / slotWidth);
      targetScrollX = (nearestK - 1) * slotWidth - restingOffset;
    });
  }

  // Card Selection & Projection Hit-Testing
  function getClosestCardToCenter() {
    let closestCard = null;
    let minDist = Infinity;

    cardMeshes.forEach(mesh => {
      const dist = Math.abs(mesh.position.x - restingOffset);
      if (dist < minDist) {
        minDist = dist;
        closestCard = mesh;
      }
    });

    return closestCard;
  }

  // Mathematical evaluation of the sheet deformation in JS matching GLSL vertex shader
  const SHEET_PI = 3.141592653589793;
  const SHEET_SHIFT = -0.2;
  const SHEET_TAIL = 1.0;
  const SHEET_BANK = -0.16;
  const SHEET_DIAG = 0.03;
  const SHEET_WAVE = 0.0;
  const SHEET_WAVE_F = 0.8;
  const SHEET_WAVE_PH = 0.35;
  const SHEET_REAR_Y = 0.12;
  const SHEET_REAR_Z = 0.24;
  const SHEET_VTWIST = 1.8;

  function sheetEvaluate(wx, wy, wz, fW, fD, fT, fC, fP, fV, fLeanA, fLeanW) {
    function sheetQ(x) {
      return (x / Math.max(fW, 0.0001)) * fT + SHEET_SHIFT;
    }
    function sheetShape(q) {
      return ((1.0 - fC) * (1.0 - q * q) + fC * Math.sin(SHEET_PI * q)) * Math.exp(-SHEET_TAIL * q * q);
    }
    function sheetShapeSlope(q) {
      const g = Math.exp(-SHEET_TAIL * q * q);
      const bowl = -2.0 * q * (1.0 + SHEET_TAIL * (1.0 - q * q));
      const ess = SHEET_PI * Math.cos(SHEET_PI * q) - 2.0 * SHEET_TAIL * q * Math.sin(SHEET_PI * q);
      return ((1.0 - fC) * bowl + fC * ess) * g;
    }
    function sheetZ(x) {
      return -fD * sheetShape(sheetQ(x));
    }
    function sheetRoll(x) {
      if (fW < 0.001) return 0.0;
      return (SHEET_BANK * sheetShapeSlope(sheetQ(x)) / SHEET_PI) * fC * fP;
    }

    let a = sheetRoll(wx);
    if (fV > 0.001 && fW > 0.001 && fP > 0.001) {
      const qe = wx / fW;
      const absQe = Math.abs(qe);
      const t = Math.max(0, Math.min(1, (absQe - 0.3) / 0.6));
      const ss = t * t * (3 - 2 * t);
      a += SHEET_VTWIST * fV * ss * Math.sign(qe) * fP;
    }

    let px = wx;
    let py = wy;
    let pz = wz;

    if (Math.abs(a) > 0.0001) {
      const s = Math.sin(a);
      const c = Math.cos(a);
      const ny = py * c - pz * s;
      const nz = py * s + pz * c;
      py = ny;
      pz = nz;
    }

    pz += sheetZ(px) * fP;

    if (fLeanW && fLeanW > 0.001 && fP > 0.001) {
      const s = Math.max(-1.0, Math.min(1.0, px / fLeanW));
      pz += fLeanA * (s * (1.5 - 0.5 * s * s)) * fP;
    }

    if (fW > 0.001) {
      const qw = px / fW;
      py += SHEET_DIAG * px * fP;
      py += SHEET_WAVE * fW * Math.sin(SHEET_PI * (qw * SHEET_WAVE_F + SHEET_WAVE_PH)) * fP;
      if (fV > 0.001) {
        const t = Math.max(0, Math.min(1, (qw - (-1.0)) / 1.3));
        const m = 1.0 - (t * t * (3 - 2 * t));
        py += SHEET_REAR_Y * fW * fV * m * fP;
        pz += SHEET_REAR_Z * fW * fV * m * fP;
      }
    }

    return { x: px, y: py, z: pz };
  }

  function getMeshScreenRect(mesh) {
    if (!renderer || !renderer.domElement) return null;
    const canvasRect = renderer.domElement.getBoundingClientRect();
    const halfW = cardWidth * 0.5;
    const halfH = cardHeight * 0.5;

    const samplePoints = [
      { x: -halfW, y: halfH, z: 0 },
      { x: halfW, y: halfH, z: 0 },
      { x: halfW, y: -halfH, z: 0 },
      { x: -halfW, y: -halfH, z: 0 },
      { x: 0, y: halfH, z: 0 },
      { x: 0, y: -halfH, z: 0 },
      { x: -halfW, y: 0, z: 0 },
      { x: halfW, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 }
    ];

    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    const v = new THREE.Vector3();
    const f = getFrustumParams();

    for (let i = 0; i < samplePoints.length; i++) {
      const pt = samplePoints[i];
      const wx = mesh.position.x + pt.x;
      const wy = ribbonGroup.position.y + mesh.position.y + pt.y;
      const wz = mesh.position.z + pt.z;

      const evalPt = sheetEvaluate(wx, wy, wz, f.halfW, f.sheetD, f.sheetT, f.sheetC, 1.0, velMagnitude, f.leanA, f.leanW);
      v.set(evalPt.x, evalPt.y, evalPt.z);
      v.project(camera);

      const px = canvasRect.left + (v.x * 0.5 + 0.5) * canvasRect.width;
      const py = canvasRect.top + (-v.y * 0.5 + 0.5) * canvasRect.height;

      if (px < minX) minX = px;
      if (px > maxX) maxX = px;
      if (py < minY) minY = py;
      if (py > maxY) maxY = py;
    }

    return {
      left: minX,
      top: minY,
      width: Math.max(60, maxX - minX),
      height: Math.max(40, maxY - minY)
    };
  }

  window._jesperGetMeshScreenRect = getMeshScreenRect;
  window._jesperCardMeshes = cardMeshes;
  window._jesperGetClosestCardToCenter = getClosestCardToCenter;

  function handlePointerHover(e) {
    const clientX = e.clientX;
    const clientY = e.clientY;

    let hoveredMesh = null;
    cardMeshes.forEach(mesh => {
      const rect = getMeshScreenRect(mesh);
      if (!rect) return;
      if (
        clientX >= rect.left &&
        clientX <= rect.left + rect.width &&
        clientY >= rect.top &&
        clientY <= rect.top + rect.height
      ) {
        hoveredMesh = mesh;
      }
    });

    wrapper.style.cursor = hoveredMesh ? 'pointer' : 'grab';

    cardMeshes.forEach(mesh => {
      const isHovered = mesh === hoveredMesh;
      if (mesh.material.uniforms.u_hover) {
        gsap.to(mesh.material.uniforms.u_hover, {
          value: isHovered ? 1.0 : 0.0,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    });
  }

  function handleCardClick(e) {
    const clientX = e.clientX;
    const clientY = e.clientY;

    let clickedMesh = null;
    let minCenterDist = Infinity;

    cardMeshes.forEach(mesh => {
      const rect = getMeshScreenRect(mesh);
      if (!rect) return;
      const pad = 12;
      if (
        clientX >= rect.left - pad &&
        clientX <= rect.left + rect.width + pad &&
        clientY >= rect.top - pad &&
        clientY <= rect.top + rect.height + pad
      ) {
        const centerDist = Math.hypot(
          clientX - (rect.left + rect.width * 0.5),
          clientY - (rect.top + rect.height * 0.5)
        );
        if (centerDist < minCenterDist) {
          minCenterDist = centerDist;
          clickedMesh = mesh;
        }
      }
    });

    if (!clickedMesh) {
      clickedMesh = getClosestCardToCenter();
    }

    if (clickedMesh) {
      expandCardToSquarish(clickedMesh.userData.id, clickedMesh);
    }
  }

  if (centerExploreBtn) {
    centerExploreBtn.addEventListener('click', () => {
      const active = getClosestCardToCenter();
      if (active) expandCardToSquarish(active.userData.id, active);
    });
  }

  // Active Title & Progress Dash Tracking
  let lastActiveId = '';

  function updateHUD() {
    const closestCard = getClosestCardToCenter();
    if (closestCard && closestCard.userData.id !== lastActiveId) {
      lastActiveId = closestCard.userData.id;
      const idx = closestCard.userData.index;

      if (hudTitle) {
        hudTitle.style.opacity = '0';
        setTimeout(() => {
          hudTitle.textContent = closestCard.userData.title;
          hudTitle.style.opacity = '1';
        }, 80);
      }

      progressDashes.forEach((dash, i) => {
        dash.classList.toggle('active', i === idx);
      });
    }
  }

  // Connect Progress Dashes to smoothly scroll directly to that project
  progressDashes.forEach((dash, idx) => {
    dash.addEventListener('click', () => {
      const currentK = Math.round((targetScrollX + restingOffset) / slotWidth);
      const currentMod = ((currentK % totalCards) + totalCards) % totalCards;
      let diff = idx - currentMod;
      if (diff > totalCards / 2) diff -= totalCards;
      if (diff < -totalCards / 2) diff += totalCards;
      targetScrollX = (currentK + diff) * slotWidth - restingOffset;
    });
  });

  // 8. Render & Physics Animation Loop
  let lastTime = performance.now();

  function animate() {
    requestAnimationFrame(animate);

    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    // Smooth physics lerp
    const diff = targetScrollX - currentScrollX;
    currentScrollX += diff * 0.082;

    // Auto-snap to resting position when wheeling stops
    if (isWheeling && now - lastWheelTime > 240) {
      if (Math.abs(diff) < 1.2) {
        isWheeling = false;
        const nearestK = Math.round((targetScrollX + restingOffset) / slotWidth);
        targetScrollX = nearestK * slotWidth - restingOffset;
      }
    }

    // Velocity computation for dynamic ribbon twist & floor shine
    const rawVel = diff / (dt * 60 || 1);
    const normVel = Math.tanh(rawVel / 16.0);
    velMagnitude += (Math.abs(normVel) - velMagnitude) * 0.14;

    // Update floor shader uniform: drives right-side shine!
    if (floorMat && floorMat.uniforms.u_sheetV) {
      floorMat.uniforms.u_sheetV.value = velMagnitude;
      floorMat.uniforms.u_frustumW.value = frustum.halfW;
    }

    // Dynamic infinite ribbon modulo wrapping
    cardMeshes.forEach((mesh, i) => {
      const baseX = i * slotWidth;
      let relX = baseX - currentScrollX;

      // Mathematical infinite wrapping
      relX = ((relX + totalTrackWidth / 2) % totalTrackWidth + totalTrackWidth) % totalTrackWidth - totalTrackWidth / 2;

      mesh.position.x = relX;
      mesh.position.y = 0;
      mesh.position.z = 0;

      // Update card shader uniforms
      const u = mesh.material.uniforms;
      u.u_sheetV.value = velMagnitude;
      u.u_sheetW.value = frustum.halfW;
      u.u_sheetD.value = frustum.sheetD;
      u.u_sheetT.value = frustum.sheetT;
      u.u_sheetC.value = frustum.sheetC;
      u.u_leanA.value = frustum.leanA;
      u.u_leanW.value = frustum.leanW;
    });

    updateHUD();
    renderer.render(scene, camera);
  }

  animate();

  // Resize Handler
  window.addEventListener('resize', () => {
    const newW = wrapper.clientWidth || window.innerWidth;
    const newH = wrapper.clientHeight || window.innerHeight;
    camera.aspect = newW / newH;
    camera.updateProjectionMatrix();
    renderer.setSize(newW, newH);
    frustum = getFrustumParams();
  });
}

/**
 * ==========================================================================
 * 3. JESPER LANDBERG "FEATURED / FULL" VIEW TOGGLE
 * Switches between 3D Curved Cylindrical Carousel & Full Index Grid
 * ==========================================================================
 */
function initPortfolioViewToggle() {
  const btnFeatured = document.getElementById('view-toggle-featured');
  const btnFull = document.getElementById('view-toggle-full');
  const canvasWrapper = document.getElementById('webgl-canvas-wrapper');
  const gridWrapper = document.getElementById('projects-grid-wrapper');

  if (!btnFeatured || !btnFull || !canvasWrapper || !gridWrapper) return;

  btnFeatured.addEventListener('click', () => {
    btnFeatured.classList.add('active');
    btnFull.classList.remove('active');
    canvasWrapper.style.display = 'block';
    gridWrapper.style.display = 'none';
  });

  btnFull.addEventListener('click', () => {
    btnFull.classList.add('active');
    btnFeatured.classList.remove('active');
    gridWrapper.style.display = 'block';
    canvasWrapper.style.display = 'none';
    gridWrapper.scrollIntoView({ behavior: 'smooth' });
  });
}

/**
 * ==========================================================================
 * 4. NATHAN RILEY MINIMALIST WHITE MODAL (Screenshot 3)
 * ==========================================================================
 */
const PROJECT_DATABASE = {
  'furlenco': {
    title: 'Furlenco Flagship Experience Store',
    category: 'Commercial Retail Flagship',
    year: '2026',
    client: 'FURLENCO LIFESTYLE',
    city: 'Indiranagar, 100 Ft Road, Bengaluru',
    area: '8,500 Sq.Ft (G+2 Floors)',
    timeline: '42 Calendar Days',
    image: 'assets/images/furlenco_store.jpg',
    pantone: [
      { name: 'PANTONE 2297 C', color: '#74c043', label: 'Lime Fit-Out' },
      { name: 'PANTONE 2185 C', color: '#004780', label: 'Sapphire Shell' },
      { name: 'PANTONE 11-0601', color: '#ffffff', label: 'Bright White' }
    ],
    tags: ['Frameless Glazing', 'VRV HVAC', 'Civil Shell', 'Bespoke Display Pods'],
    description: 'Divine Interiors delivered the complete turnkey execution of Furlenco\'s flagship offline retail hub in Bangalore. The project involved structural retrofitting of a 3-level commercial building, heavy architectural glazing for the front facade, multi-zone VRV air conditioning, and bespoke mechanized joinery to showcase modular furniture environments with live room-settings.',
    highlights: [
      'Engineered a 45-foot double-height frameless glass curtain wall compliant with wind load standards.',
      'Constructed 18 modular room simulation pods with independent magnetic architectural track lighting.',
      'Achieved zero-snag mall and civic authority handovers ahead of the festive shopping season.'
    ]
  },
  'mokobara': {
    title: 'Mokobara Premium Travel Boutique',
    category: 'High-Street Luxury Retail',
    year: '2025',
    client: 'MOKOBARA TRAVEL',
    city: 'Bandra West, Mumbai',
    area: '2,400 Sq.Ft',
    timeline: '28 Calendar Days',
    image: 'assets/images/mokobara_store.jpg',
    pantone: [
      { name: 'PANTONE 13-1404', color: '#dfc2bd', label: 'Quartz Rose' },
      { name: 'PANTONE Warm Gray 1 C', color: '#e8e5de', label: 'Warm Sand' },
      { name: 'PANTONE Black 6 C', color: '#111827', label: 'Charcoal' }
    ],
    tags: ['Seamless Terrazzo', 'Brushed Brass Joinery', 'Linear 95+ CRI Lighting'],
    description: 'Designed to mirror the sleek, fluid minimalism of Mokobara\'s travel luggage, this store features monolithic cast-in-situ white terrazzo floors, CNC-milled display racks with integrated micro-LED channels, and soundproof consultation niches for bespoke travel customization.',
    highlights: [
      'In-house factory manufactured curved plywood display plinths with anti-scratch matte PU coating.',
      'Integrated high-frequency commercial power distribution with concealed cable raceways.',
      'Handed over completely snag-free in 28 calendar days with zero client downtime.'
    ]
  },
  'bewakoof': {
    title: 'Bewakoof Youth Fashion Concept Store',
    category: 'Apparel & Lifestyle Retail',
    year: '2025',
    client: 'BEWAKOOF BRAND BRIGHT',
    city: 'Phoenix Marketcity, Pune',
    area: '3,800 Sq.Ft',
    timeline: '32 Calendar Days',
    image: 'assets/images/bewakoof_store.jpg',
    pantone: [
      { name: 'PANTONE 2185 C', color: '#004780', label: 'Aegean' },
      { name: 'PANTONE 109 C', color: '#f7cf00', label: 'Youth Yellow' },
      { name: 'PANTONE Black 6 C', color: '#111827', label: 'Carbon Steel' }
    ],
    tags: ['Mall Authority Liaison', 'Industrial Steel Fixtures', 'Neon Installations'],
    description: 'An energetic high-traffic retail environment built inside a premier shopping mall. Compliant with stringent night-work protocols, this fit-out features powder-coated industrial steel racking, illuminated experiential trial rooms, and acoustic open-plenum ceiling treatments.',
    highlights: [
      'Compliant with 100% of Phoenix Mall MEP guidelines, smoke damper certifications, and night-shift logistics.',
      'Custom modular merchandising towers capable of rapid seasonal re-configuration.',
      'Precision air-balancing test passed on first audit.'
    ]
  },
  'artisan': {
    title: 'Artisan Ceramic & Bath Studio',
    category: 'Experience Center & Showroom',
    year: '2026',
    client: 'ARTISAN CERAMICS',
    city: 'Koramangala, Bengaluru',
    area: '7,200 Sq.Ft',
    timeline: '45 Calendar Days',
    image: 'assets/images/showroom_store.jpg',
    pantone: [
      { name: 'PANTONE 2297 C', color: '#74c043', label: 'Pistachio' },
      { name: 'PANTONE 421 C', color: '#b2b4b3', label: 'Micro-Cement' }
    ],
    tags: ['Live Water Simulators', 'Heavy Stone Displays', 'Industrial MEP'],
    description: 'A cutting-edge showroom featuring functioning live rain shower exhibits, heavy sliding quartz display panels (up to 300kg per leaf), and a floating architectural consultation zone.',
    highlights: [
      'Engineered concealed structural overhead steel gantries to support multi-ton stone sliding racks.',
      'Closed-loop water recirculation system for live shower and faucet experience displays.',
      'Architectural micro-cement floor finish with high abrasion resistance.'
    ]
  },
  'nexus-hq': {
    title: 'Nexus Global Tech Headquarters',
    category: 'Corporate Office Fit-Out',
    year: '2026',
    client: 'NEXUS CLOUD CORP',
    city: 'Whitefield, Bengaluru',
    area: '22,000 Sq.Ft',
    timeline: '65 Calendar Days',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    pantone: [
      { name: 'PANTONE 2185 C', color: '#004780', label: 'Tech Blue' },
      { name: 'PANTONE Cool Gray 3 C', color: '#c8c9c7', label: 'Aluminum' }
    ],
    tags: ['Acoustic Baffles', 'Smart Boardrooms', 'Central Chilled Water HVAC'],
    description: 'Turnkey interior execution for an international fintech enterprise. Included open-plan workstations, executive boardroom with smart privacy switchable glass, 12 acoustic telephone pods, and a vibrant 200-seat cafeteria.',
    highlights: [
      'STC 50+ acoustic isolation across all meeting rooms and executive video-conferencing suites.',
      'Full DALI lighting system with daylight harvesting and presence detection sensors.',
      'Zero lost-time safety incidents across 35,000 man-hours of on-site execution.'
    ]
  },
  'sovereign': {
    title: 'The Sovereign Sky Penthouse',
    category: 'Ultra-Luxury Residential Architecture',
    year: '2026',
    client: 'PRIVATE RESIDENCE',
    city: 'Worli Sea Face, Mumbai',
    area: '6,800 Sq.Ft Duplex',
    timeline: '90 Calendar Days',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    pantone: [
      { name: 'PANTONE 13-1404', color: '#dfc2bd', label: 'Statuario Blush' },
      { name: 'PANTONE 7531 C', color: '#72675b', label: 'Fluted Walnut' }
    ],
    tags: ['Bookmatched Statuario', 'Bespoke Walk-in Wardrobes', 'Home Automation'],
    description: 'An ultra-exclusive residential haven overlooking the Arabian Sea. Executed with bookmatched Italian Statuario marble, acoustic motorized drapery, custom fluted walnut wall cladding, and an integrated smart home automation backbone.',
    highlights: [
      'Hand-selected and laser-cut 4,000 sq.ft of imported Italian marble with continuous grain alignment.',
      'Climate-controlled master walk-in wardrobe with velvet-lined jewelry drawers and sensor lighting.',
      'Custom terrace jacuzzi plumbing and weatherproof architectural deck execution.'
    ]
  },
  'lumina': {
    title: 'Lumina Artisanal Bistro & Bar',
    category: 'Boutique Hospitality & Dining',
    year: '2025',
    client: 'LUMINA HOSPITALITY',
    city: 'Connaught Place, New Delhi',
    area: '5,200 Sq.Ft',
    timeline: '48 Calendar Days',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    pantone: [
      { name: 'PANTONE 7407 C', color: '#cba052', label: 'Antique Brass' },
      { name: 'PANTONE 5405 C', color: '#4d6978', label: 'Velvet Teal' }
    ],
    tags: ['Commercial Kitchen MEP', 'Brass Bar Counter', 'Acoustic Ceilings'],
    description: 'Turnkey fit-out for a Michelin-calibre dining room and cocktail lounge. High-performance commercial kitchen extraction, grease trap plumbing, sound attenuation baffles, and an ornate 30-foot solid brass cocktail island.',
    highlights: [
      'High-velocity kitchen hood ventilation compliant with international fire & safety codes.',
      'Acoustic reverberation time reduced to 0.6 seconds for optimal dining intimacy.',
      'Custom plush velvet banquette booths manufactured and installed with stain-guard protection.'
    ]
  }
};

let activeSquarishCard = null;
let isSquarishAnimating = false;

function expandCardToSquarish(projectId, clickedMesh, sourceElement) {
  if (activeSquarishCard || isSquarishAnimating) return;

  const data = PROJECT_DATABASE[projectId] || PROJECT_DATABASE['furlenco'];
  if (!data) return;

  isSquarishAnimating = true;

  // 1. If clickedMesh wasn't passed, try to look up in window._jesperCardMeshes
  if (!clickedMesh && !sourceElement && window._jesperCardMeshes) {
    clickedMesh = window._jesperCardMeshes.find(m => m.userData.id === projectId);
  }

  // 2. Compute exact starting bounding rectangle on screen
  let startRect = null;
  if (clickedMesh && window._jesperGetMeshScreenRect) {
    startRect = window._jesperGetMeshScreenRect(clickedMesh);
  } else if (sourceElement) {
    startRect = sourceElement.getBoundingClientRect();
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (!startRect || startRect.width < 10 || startRect.height < 10) {
    startRect = {
      left: vw * 0.25,
      top: vh * 0.25,
      width: vw * 0.5,
      height: vh * 0.4
    };
  }

  // 3. Compute centered squarish target geometry (~1:1 squarish luxury proportion)
  const squarishSize = Math.min(820, Math.floor(vw * 0.90), Math.floor(vh * 0.88));
  const targetRect = {
    width: squarishSize,
    height: squarishSize,
    left: (vw - squarishSize) / 2,
    top: (vh - squarishSize) / 2
  };

  // 4. Create backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'squarish-expansion-backdrop';
  backdrop.id = 'squarish-backdrop';

  // 5. Create squarish flyer element
  const flyer = document.createElement('div');
  flyer.className = 'squarish-expanded-card';
  flyer.id = 'squarish-flyer';

  // Setup initial geometry matching small card
  flyer.style.position = 'fixed';
  flyer.style.left = `${startRect.left}px`;
  flyer.style.top = `${startRect.top}px`;
  flyer.style.width = `${startRect.width}px`;
  flyer.style.height = `${startRect.height}px`;
  flyer.style.borderRadius = '24px';
  flyer.style.margin = '0';
  flyer.style.zIndex = '99999';

  flyer.innerHTML = `
    <!-- Top Hero Image Container -->
    <div class="squarish-hero-wrap" style="height: ${startRect.height}px;">
      <img src="${data.image}" alt="${data.title}" class="squarish-hero-img">
      <div class="squarish-hero-gradient"></div>

      <!-- Top floating row: Badges + Close button -->
      <div class="squarish-hero-top-bar">
        <div class="squarish-badge-group">
          <span class="squarish-category-badge">${data.category}</span>
          <span class="squarish-award-badge">
            <svg class="badge-trophy" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
              <path d="M4 22h16"/>
              <path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1h10v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34"/>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
            </svg>
            ZERO SNAG FIT-OUT
          </span>
        </div>

        <!-- Floating Close Button -->
        <button class="squarish-close-btn" id="squarish-close-btn" aria-label="Close Case Study">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Hero Bottom Content: Title & Client -->
      <div class="squarish-hero-bottom-info">
        <span class="squarish-client-tag">${data.client} • ${data.year}</span>
        <h2 class="squarish-card-title">${data.title}</h2>
      </div>
    </div>

    <!-- Bottom Scrollable Case Study Body -->
    <div class="squarish-card-body" style="opacity: 0; transform: translateY(24px);">
      <!-- Narrative -->
      <div class="squarish-narrative-section">
        <h4 class="squarish-section-label">ARCHITECTURAL CONCEPT & TURNKEY EXECUTION</h4>
        <p class="squarish-description-text">${data.description}</p>
      </div>

      <!-- Pantone Material Identity Palette -->
      <div class="squarish-pantone-section">
        <h4 class="squarish-section-label">SPECIFIED MATERIAL PALETTE</h4>
        <div class="squarish-pantone-chips">
          ${data.pantone.map(p => `
            <div class="squarish-pantone-chip">
              <span class="squarish-pantone-swatch" style="background-color: ${p.color};"></span>
              <div class="squarish-pantone-info">
                <strong class="squarish-pantone-name">${p.name}</strong>
                <span class="squarish-pantone-label">${p.label}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 3-Column Specifications Grid -->
      <div class="squarish-specs-grid">
        <div class="squarish-spec-box">
          <span class="squarish-spec-label">LOCATION</span>
          <strong class="squarish-spec-val">${data.city}</strong>
        </div>
        <div class="squarish-spec-box">
          <span class="squarish-spec-label">CARPET AREA</span>
          <strong class="squarish-spec-val">${data.area}</strong>
        </div>
        <div class="squarish-spec-box">
          <span class="squarish-spec-label">TIMELINE</span>
          <strong class="squarish-spec-val squarish-spec-accent">${data.timeline}</strong>
        </div>
      </div>

      <!-- Turnkey Fit-Out Highlights Checklist -->
      <div class="squarish-highlights-section">
        <h4 class="squarish-section-label">TURNKEY FIT-OUT HIGHLIGHTS</h4>
        <ul class="squarish-highlights-list">
          ${data.highlights.map(h => `
            <li class="squarish-highlight-item">
              <span class="squarish-highlight-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
              <span class="squarish-highlight-text">${h}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- Tags / Disciplines -->
      <div class="squarish-tags-row">
        ${data.tags.map(t => `<span class="squarish-tag-pill">${t}</span>`).join('')}
      </div>

      <!-- Call to Action Footer -->
      <div class="squarish-action-footer">
        <a href="#contact" class="liquid-btn glass-btn-primary squarish-cta-btn" id="squarish-inquire-btn">
          <span class="btn-sheen"></span>
          <span class="btn-text">Request Consultation for Similar Project</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
        <button type="button" class="squarish-close-secondary-btn" id="squarish-secondary-close">
          Return to Showcase
        </button>
      </div>
    </div>
  `;

  // 6. In the exact same frame: hide the 3D mesh (zero flash)
  if (clickedMesh) {
    clickedMesh.visible = false;
  }

  document.body.style.overflow = 'hidden';
  document.body.appendChild(backdrop);
  document.body.appendChild(flyer);

  activeSquarishCard = flyer;

  const heroWrap = flyer.querySelector('.squarish-hero-wrap');
  const cardBody = flyer.querySelector('.squarish-card-body');
  const targetHeroH = Math.min(360, Math.floor(targetRect.height * 0.43));

  // 7. Buttery-smooth GSAP FLIP expansion
  const tl = gsap.timeline({
    onComplete: () => {
      isSquarishAnimating = false;
    }
  });

  tl.to(backdrop, {
    opacity: 1,
    duration: 0.45,
    ease: 'power2.out'
  }, 0);

  tl.to(flyer, {
    left: targetRect.left,
    top: targetRect.top,
    width: targetRect.width,
    height: targetRect.height,
    borderRadius: '32px',
    duration: 0.65,
    ease: 'power3.out'
  }, 0);

  tl.to(heroWrap, {
    height: targetHeroH,
    duration: 0.65,
    ease: 'power3.out'
  }, 0);

  tl.to(cardBody, {
    opacity: 1,
    y: 0,
    duration: 0.45,
    ease: 'power2.out'
  }, 0.22);

  // 8. Reverse collapse back to small card
  let isClosing = false;
  function closeSquarishCard() {
    if (isClosing) return;
    isClosing = true;
    isSquarishAnimating = true;

    // Recompute current screen position of the card
    let returnRect = null;
    if (clickedMesh && window._jesperGetMeshScreenRect) {
      returnRect = window._jesperGetMeshScreenRect(clickedMesh);
    } else if (sourceElement) {
      returnRect = sourceElement.getBoundingClientRect();
    }
    if (!returnRect) returnRect = startRect;

    const closeTl = gsap.timeline({
      onComplete: () => {
        if (clickedMesh) clickedMesh.visible = true;
        flyer.remove();
        backdrop.remove();
        document.body.style.overflow = '';
        activeSquarishCard = null;
        isSquarishAnimating = false;
        window.removeEventListener('keydown', handleEsc);
        window.removeEventListener('resize', handleResize);
      }
    });

    closeTl.to(cardBody, {
      opacity: 0,
      y: 18,
      duration: 0.2,
      ease: 'power2.in'
    }, 0);

    closeTl.to(flyer, {
      left: returnRect.left,
      top: returnRect.top,
      width: returnRect.width,
      height: returnRect.height,
      borderRadius: '24px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
      duration: 0.52,
      ease: 'power3.inOut'
    }, 0.06);

    closeTl.to(heroWrap, {
      height: returnRect.height,
      duration: 0.52,
      ease: 'power3.inOut'
    }, 0.06);

    closeTl.to(backdrop, {
      opacity: 0,
      duration: 0.48,
      ease: 'power2.inOut'
    }, 0.06);
  }

  function handleEsc(e) {
    if (e.key === 'Escape') closeSquarishCard();
  }

  function handleResize() {
    if (isClosing) return;
    const curW = window.innerWidth;
    const curH = window.innerHeight;
    const newSize = Math.min(820, Math.floor(curW * 0.90), Math.floor(curH * 0.88));
    gsap.to(flyer, {
      left: (curW - newSize) / 2,
      top: (curH - newSize) / 2,
      width: newSize,
      height: newSize,
      duration: 0.25,
      ease: 'power2.out'
    });
  }

  window.addEventListener('keydown', handleEsc);
  window.addEventListener('resize', handleResize);
  backdrop.addEventListener('click', closeSquarishCard);

  const closeBtn = flyer.querySelector('#squarish-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeSquarishCard);

  const secCloseBtn = flyer.querySelector('#squarish-secondary-close');
  if (secCloseBtn) secCloseBtn.addEventListener('click', closeSquarishCard);

  const inquireBtn = flyer.querySelector('#squarish-inquire-btn');
  if (inquireBtn) {
    inquireBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeSquarishCard();
      setTimeout(() => {
        const contactSec = document.getElementById('contact');
        if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
      }, 350);
    });
  }
}

window.expandCardToSquarish = expandCardToSquarish;
window.openProjectModal = expandCardToSquarish;

// Attach click listeners to full grid project cards for smooth squarish card expansion
document.querySelectorAll('.project-card[data-project-id]').forEach(card => {
  card.addEventListener('click', () => {
    const id = card.getAttribute('data-project-id');
    expandCardToSquarish(id, null, card);
  });
});

/**
 * ==========================================================================
 * 5. TILT & ANIMATED COUNTERS
 * ==========================================================================
 */
function initTiltPhysics() {
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cardWidth = rect.width;
      const cardHeight = rect.height;
      const centerX = rect.left + cardWidth / 2;
      const centerY = rect.top + cardHeight / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateXUncapped = ((mouseY / (cardHeight / 2)) * -5);
      const rotateYUncapped = ((mouseX / (cardWidth / 2)) * 5);

      card.style.transform = `perspective(1000px) rotateX(${rotateXUncapped}deg) rotateY(${rotateYUncapped}deg) scale3d(1.01, 1.01, 1.01)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

function initAnimatedCounters() {
  const stats = document.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        stats.forEach(stat => {
          const target = parseFloat(stat.getAttribute('data-target'));
          const suffix = stat.querySelector('span') ? stat.querySelector('span').outerHTML : '';
          let count = 0;
          const duration = 1600;
          const stepTime = 20;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              count = target;
              clearInterval(timer);
            }
            if (target === 99) {
              stat.innerHTML = `99.4${suffix}`;
            } else {
              stat.innerHTML = `${Math.floor(count)}${suffix}`;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsBar = document.querySelector('.hero-stats-bar');
  if (statsBar) {
    observer.observe(statsBar);
  }
}

/**
 * ==========================================================================
 * 7. CONTACT FORM & FEEDBACK TOASTS
 * ==========================================================================
 */
function initContactForm() {
  const form = document.getElementById('project-inquiry-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('client-name').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const email = document.getElementById('client-email').value.trim();
    const city = document.getElementById('client-city').value.trim();

    if (!name || !phone || !email || !city) {
      showToast('Please fill in all mandatory fields with valid contact details.', 'error');
      return;
    }

    showToast(`Thank you, ${name}! Your fit-out brief has been received. Our senior project director will contact you within 24 hours.`, 'success');
    form.reset();
  });
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  const icon = type === 'success' ? 'check-circle' : 'alert-circle';
  toast.innerHTML = `<i data-lucide="${icon}"></i> <span>${message}</span>`;

  container.appendChild(toast);
  if (window.lucide) {
    window.lucide.createIcons();
  }

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

/**
 * ==========================================================================
 * 8. MOBILE DRAWER & ACTIVE NAV SPY
 * ==========================================================================
 */
function initMobileDrawer() {
  const btn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  if (!btn || !drawer) return;

  const openIcon = btn.querySelector('.open-icon');
  const closeIcon = btn.querySelector('.close-icon');

  function toggleDrawer(open) {
    const isOpen = open !== undefined ? open : !drawer.classList.contains('active');
    if (isOpen) {
      drawer.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
      if (openIcon) openIcon.style.display = 'none';
      if (closeIcon) closeIcon.style.display = 'block';
    } else {
      drawer.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
      if (openIcon) openIcon.style.display = 'block';
      if (closeIcon) closeIcon.style.display = 'none';
    }
  }

  btn.addEventListener('click', () => toggleDrawer());

  const links = drawer.querySelectorAll('.mobile-link');
  links.forEach(l => {
    l.addEventListener('click', () => toggleDrawer(false));
  });

  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !drawer.contains(e.target)) {
      toggleDrawer(false);
    }
  });
}

function initActiveNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const architectLinks = document.querySelectorAll('.architect-nav-link');
  const headerEl = document.getElementById('site-header');

  window.addEventListener('scroll', () => {
    // Header background blur on scroll
    if (headerEl) {
      if (window.scrollY > 40) {
        headerEl.classList.add('scrolled');
      } else {
        headerEl.classList.remove('scrolled');
      }
    }

    let current = 'home';
    const scrollPos = window.scrollY + 220;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    architectLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${current}`) {
        architectLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

// 12. Hide floating quick pill when architectural footer is in view
function initFooterQuickPillObserver() {
  const footerEl = document.getElementById('site-footer');
  const quickPill = document.querySelector('.floating-quick-pill');
  if (!footerEl || !quickPill) return;

  function checkFooterVisibility() {
    const rect = footerEl.getBoundingClientRect();
    if (rect.top <= window.innerHeight - 20) {
      quickPill.classList.add('hide-pill');
    } else {
      quickPill.classList.remove('hide-pill');
    }
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        quickPill.classList.add('hide-pill');
      } else {
        checkFooterVisibility();
      }
    });
  }, { threshold: [0, 0.05, 0.1] });

  observer.observe(footerEl);
  window.addEventListener('scroll', checkFooterVisibility, { passive: true });
  window.addEventListener('resize', checkFooterVisibility, { passive: true });
  checkFooterVisibility();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initFooterQuickPillObserver();
  });
} else {
  initFooterQuickPillObserver();
}

