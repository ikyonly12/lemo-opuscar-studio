// Main program for The Airplane Window Breather Hole
// Procedural Three.js r170 pop-up book simulation with broadcast-grade rendering (SSAA 2x + GTAO + Spiral Bokeh DoF)
import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as L from './lib.js';
import { clamp, lerp, seg, ss, eo, eio, back, track } from './lib.js';
import * as A from './art.js';
import { cv } from './paper.js';
import { makeBook, coverCanvases, texOf } from './book.js';
import { pages, buildSets, updatePops, RISE } from './sets.js';
import { makePassengerActor, makeEngineerActor } from './actors.js';
import { makePost } from './post.js';
import { DUR, OPEN, TURNS, CLOSE, COVER_TITLE, COVER_SUBTITLE } from './story.js';
import * as HUD from './hud.js';

const W = 1920, H = 1080;
const stage = document.getElementById('stage');
const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(1); // Native 1080p broadcast resolution (4x MSAA handled by DofScenePass)
renderer.setSize(W, H);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;
stage.appendChild(renderer.domElement);

const ov = document.getElementById('ov'), OX = ov.getContext('2d');
ov.width = W; ov.height = H;

const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(30, W / H, 0.005, 30);
const post = makePost(renderer, scene, cam, W, H);

// ---------- Assets & HDRI ----------
const fontList = ['500 36px Fredoka', '600 38px Fredoka', '64px "Lilita One"', '32px "Lilita One"'];
await Promise.all(fontList.map(f => document.fonts.load(f, 'AaJendela123')));

const hdr = await new RGBELoader().loadAsync('assets/lythwood_lounge_2k.hdr');
hdr.mapping = THREE.EquirectangularReflectionMapping;
scene.environment = hdr;
scene.background = hdr;
scene.backgroundBlurriness = 0.28;
scene.environmentIntensity = 0.82;

// Walnut desk with PBR maps
const tl = new THREE.TextureLoader();
const wt = n => {
  const t = tl.load(`assets/walnut_${n}.jpg`);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(2.4, 1.5);
  t.anisotropy = 12;
  return t;
};
const wdiff = wt('diff'); wdiff.colorSpace = THREE.SRGBColorSpace;
const desk = new THREE.Mesh(
  new THREE.BoxGeometry(2.8, 0.04, 1.8),
  new THREE.MeshStandardMaterial({ map: wdiff, normalMap: wt('nor'), roughnessMap: wt('rough'), color: '#c4a482', envMapIntensity: 0.8 })
);
desk.position.set(0, -0.02, 0.25);
desk.receiveShadow = true;
scene.add(desk);

// Studio Props
const gl = new GLTFLoader();
async function loadProp(name, x, z, s, ry) {
  try {
    const m = (await gl.loadAsync(`assets/${name}/${name}.gltf`)).scene;
    m.position.set(x, 0, z); m.scale.setScalar(s); m.rotation.y = ry;
    m.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; } });
    scene.add(m);
    return m;
  } catch (e) {
    return null;
  }
}
const lamp = await loadProp('desk_lamp_arm_01', -0.35, 0.52, 0.55, -0.76);
if (lamp) {
  lamp.traverse(o => {
    if (o.isMesh && o.material.name.includes('light')) {
      o.material = o.material.clone();
      o.material.emissive = new THREE.Color('#ffd9a0');
      o.material.emissiveIntensity = 5;
    }
  });
}

// ---------- Book & Mechanisms ----------
const cover = coverCanvases((x, px, py, w, h) => {
  // Title on front cover of pop-up book
  x.save();
  x.fillStyle = '#1e3a8a';
  x.fillRect(px, py, w, h);
  // Gold decorative border
  x.strokeStyle = '#f59e0b';
  x.lineWidth = 14;
  x.strokeRect(px + 40, py + 40, w - 80, h - 80);
  x.lineWidth = 4;
  x.strokeRect(px + 60, py + 60, w - 120, h - 120);

  x.fillStyle = '#fef3c7';
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.font = '700 80px "Lilita One", sans-serif';
  x.fillText(COVER_TITLE, px + w / 2, py + h * 0.38);
  x.font = '500 42px Fredoka, sans-serif';
  x.fillStyle = '#93c5fd';
  x.fillText(COVER_SUBTITLE, px + w / 2, py + h * 0.52);
  x.restore();
});

const book = makeBook(cover);
scene.add(book.root);

const P = pages(), PT = {};
for (const k in P) PT[k] = texOf(P[k]);
const SPREAD = [
  { sky: PT.sky0, ground: PT.ground0 },
  { sky: PT.sky1, ground: PT.ground1 },
  { sky: PT.sky2night, ground: PT.ground2 },
  { sky: PT.sky3, ground: PT.ground3 }
];
const { L: POPS } = buildSets(book);

// Characters
const passenger = makePassengerActor();
passenger.root.position.set(-0.06, 0, 0.16);
passenger.root.rotation.x = -Math.PI / 2;
book.stage.add(passenger.root);

const engineer = makeEngineerActor();
engineer.root.position.set(-0.08, 0, 0.15);
engineer.root.rotation.x = -Math.PI / 2;
engineer.root.visible = false;
book.stage.add(engineer.root);

// ---------- Lights Hierarchy ----------
const lampHead = new THREE.Vector3(-0.28, 0.38, 0.44);
const spot = new THREE.SpotLight('#fff4e2', 2.0, 3.2, 0.72, 0.55, 1.8);
spot.position.copy(lampHead);
spot.target.position.set(0.02, 0, 0.2);
spot.castShadow = true;
spot.shadow.mapSize.set(4096, 4096);
spot.shadow.bias = -0.00006;
spot.shadow.normalBias = 0.0004;
spot.shadow.radius = 4;
scene.add(spot, spot.target);

const sun = new THREE.DirectionalLight('#fff0dd', 1.2);
sun.position.set(0.6, 1.2, 0.8);
sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096);
sun.shadow.bias = -0.00006;
sun.shadow.normalBias = 0.0003;
sun.shadow.radius = 3;
scene.add(sun);

const ambLight = new THREE.AmbientLight('#ffeacc', 0.40);
scene.add(ambLight);

// ---------- 19 Contextual Micro-Shots (ASL ~3.3s) ----------
// [t, px, py, pz,  tx, ty, tz,  fov, aper, focus]
const SH = [
  // Shot 01: Desk Establishing & Cover Lifting (0.0s -> 4.5s)
  [
    [0.0, 0.0, 0.38, 0.76,  0.0, 0.05, 0.18, 34, 1.8, 0.62],
    [4.5, 0.0, 0.24, 0.54,  0.0, 0.07, 0.16, 32, 2.2, 0.44]
  ],
  // Shot 02: Spread 0 - Cabin Overview (4.5s -> 8.0s)
  [
    [4.5, -0.03, 0.16, 0.42, -0.02, 0.08, 0.15, 30, 2.4, 0.28],
    [8.0, -0.02, 0.14, 0.38, -0.01, 0.08, 0.15, 30, 2.5, 0.25]
  ],
  // Shot 03: Subject Tracking - Passenger at Window (8.0s -> 11.5s)
  [
    [8.0, -0.07, 0.12, 0.36, -0.05, 0.09, 0.16, 28, 2.6, 0.21],
    [11.5, -0.06, 0.11, 0.34, -0.04, 0.09, 0.16, 28, 2.6, 0.20]
  ],
  // Shot 04: Extreme Macro Detail - The Breather Hole (11.5s -> 15.0s)
  [
    [11.5, 0.04, 0.065, 0.26, 0.04, 0.055, 0.16, 26, 3.2, 0.12],
    [15.0, 0.04, 0.060, 0.24, 0.04, 0.055, 0.16, 26, 3.4, 0.10]
  ],
  // Shot 05: Reaction / POV Passenger Worried (15.0s -> 18.5s)
  [
    [15.0, -0.08, 0.11, 0.32, -0.06, 0.10, 0.16, 28, 2.6, 0.18],
    [18.5, -0.07, 0.10, 0.30, -0.06, 0.10, 0.16, 28, 2.6, 0.16]
  ],
  // Shot 06: Window Cloud Vista (18.5s -> 22.0s)
  [
    [18.5, 0.02, 0.14, 0.38, 0.03, 0.09, 0.16, 30, 2.2, 0.25],
    [22.0, 0.03, 0.16, 0.40, 0.03, 0.09, 0.16, 30, 2.0, 0.27]
  ],
  // Shot 07: Page Turn 0 Pullback (22.0s -> 26.2s)
  [
    [22.0, 0.0, 0.26, 0.54, 0.0, 0.07, 0.16, 32, 1.8, 0.44],
    [26.2, 0.0, 0.24, 0.50, 0.0, 0.07, 0.16, 32, 1.8, 0.40]
  ],
  // Shot 08: Spread 1 - 1954 Hangar & Comet Jet (26.2s -> 30.5s)
  [
    [26.2, -0.05, 0.15, 0.40, -0.02, 0.08, 0.14, 30, 2.4, 0.28],
    [30.5, -0.03, 0.13, 0.36, -0.01, 0.08, 0.14, 30, 2.4, 0.25]
  ],
  // Shot 09: Tracking Comet Fuselage & Square Windows (30.5s -> 34.5s)
  [
    [30.5, 0.0, 0.11, 0.34, 0.0, 0.08, 0.15, 28, 2.6, 0.21],
    [34.5, 0.02, 0.10, 0.32, 0.01, 0.08, 0.15, 28, 2.8, 0.19]
  ],
  // Shot 10: Extreme Macro - Square Corner Stress Fractures (34.5s -> 39.0s)
  [
    [34.5, -0.01, 0.075, 0.26, 0.0, 0.065, 0.15, 26, 3.2, 0.13],
    [39.0, 0.0, 0.070, 0.24, 0.0, 0.065, 0.15, 26, 3.4, 0.11]
  ],
  // Shot 11: British Engineer Realization (39.0s -> 43.5s)
  [
    [39.0, -0.10, 0.12, 0.32, -0.08, 0.10, 0.15, 28, 2.6, 0.19],
    [43.5, -0.09, 0.11, 0.30, -0.08, 0.10, 0.15, 28, 2.6, 0.17]
  ],
  // Shot 12: Drafting Table Wrap & Page Turn 1 (43.5s -> 53.8s)
  [
    [43.5, 0.0, 0.16, 0.42, 0.0, 0.08, 0.16, 32, 2.0, 0.32],
    [51.2, 0.0, 0.26, 0.54, 0.0, 0.07, 0.16, 32, 1.8, 0.44],
    [53.8, 0.0, 0.24, 0.50, 0.0, 0.07, 0.16, 32, 1.8, 0.40]
  ],
  // Shot 13: Spread 2 - Isometric 3-Layer Exploded Window (53.8s -> 58.5s)
  [
    [53.8, -0.05, 0.15, 0.38, 0.0, 0.08, 0.15, 30, 2.4, 0.26],
    [58.5, -0.03, 0.13, 0.36, 0.0, 0.08, 0.15, 30, 2.4, 0.24]
  ],
  // Shot 14: Exploded Pull-Apart: Outer, Middle, Inner (58.5s -> 63.5s)
  [
    [58.5, 0.05, 0.11, 0.32, 0.01, 0.08, 0.15, 28, 2.6, 0.20],
    [63.5, 0.06, 0.10, 0.30, 0.01, 0.08, 0.15, 28, 2.8, 0.18]
  ],
  // Shot 15: Pressure Particle Flow into Breather Hole (63.5s -> 69.0s)
  [
    [63.5, 0.0, 0.070, 0.24, 0.0, 0.055, 0.15, 26, 3.2, 0.11],
    [69.0, 0.0, 0.065, 0.22, 0.0, 0.055, 0.15, 26, 3.4, 0.09]
  ],
  // Shot 16: Diagrammatic Top-Down & Page Turn 2 (69.0s -> 78.4s)
  [
    [69.0, 0.0, 0.20, 0.46, 0.0, 0.07, 0.16, 32, 2.0, 0.36],
    [75.8, 0.0, 0.26, 0.54, 0.0, 0.07, 0.16, 32, 1.8, 0.44],
    [78.4, 0.0, 0.24, 0.50, 0.0, 0.07, 0.16, 32, 1.8, 0.40]
  ],
  // Shot 17: Spread 3 - Sunset Horizon & Golden Light (78.4s -> 85.0s)
  [
    [78.4, -0.03, 0.14, 0.38, -0.01, 0.09, 0.16, 30, 2.4, 0.26],
    [85.0, 0.02, 0.12, 0.35, 0.01, 0.09, 0.16, 30, 2.5, 0.23]
  ],
  // Shot 18: Peaceful Passenger & Frost-Free Glass (85.0s -> 92.0s)
  [
    [85.0, -0.06, 0.11, 0.32, -0.04, 0.09, 0.16, 28, 2.6, 0.19],
    [92.0, -0.04, 0.10, 0.30, -0.03, 0.09, 0.16, 28, 2.6, 0.18]
  ],
  // Shot 19: Epilogue Pullback & Book Closes (92.0s -> 99.0s)
  [
    [92.0, 0.0, 0.18, 0.46, 0.0, 0.07, 0.18, 32, 2.0, 0.34],
    [99.0, 0.0, 0.34, 0.72, 0.0, 0.05, 0.20, 34, 1.6, 0.58]
  ]
];

const SHOTS = SH.map(keys => ({
  t0: keys[0][0],
  t1: keys[keys.length - 1][0],
  f: track(keys.map(k => [k[0], [...k.slice(1, 9), k[9] || 0]]))
}));

function camAt(t) {
  let s = SHOTS[0];
  for (const S of SHOTS) if (t >= S.t0) s = S;
  const v = s.f(t);
  return {
    pos: new THREE.Vector3(v[0], v[1], v[2]),
    tgt: new THREE.Vector3(v[3], v[4], v[5]),
    fov: v[6],
    aper: v[7],
    focus: v[8]
  };
}

// ---------- Book Turn & Render Logic ----------
window.render = function(t) {
  // 1. Book open/close
  let op = 0;
  if (t < OPEN[0]) op = 0;
  else if (t < OPEN[1]) op = eio(seg(t, OPEN[0], OPEN[1]));
  else if (t < CLOSE[0]) op = 1;
  else if (t < CLOSE[1]) op = 1 - eio(seg(t, CLOSE[0], CLOSE[1]));
  else op = 0;
  book.setOpen(Math.PI / 2 * op);

  // 2. Page turns & spreads
  let spread = 0;
  for (let i = 0; i < 3; i++) if (t >= TURNS[i][0] + 0.45) spread = i + 1;
  let turning = -1;
  let turnK = 0;
  for (let i = 0; i < 3; i++) {
    if (t >= TURNS[i][0] + 0.45 && t < TURNS[i][1] - 0.3) {
      turning = i;
      turnK = eio(seg(t, TURNS[i][0] + 0.45, TURNS[i][1] - 0.3));
    }
  }

  book.groundMat.map = SPREAD[spread].ground;
  book.groundMat.needsUpdate = true;
  const skyIdx = turning >= 0 ? turning : spread;
  book.backMat.map = SPREAD[skyIdx].sky;
  book.backMat.needsUpdate = true;

  if (turning >= 0) {
    book.leafFront.material.map = SPREAD[turning].ground;
    book.leafBack.material.map = SPREAD[turning + 1].sky;
    book.leafFront.material.needsUpdate = book.leafBack.material.needsUpdate = true;
    book.setLeaf(turnK);
  } else {
    book.setLeaf(0);
  }

  // 3. Update Pop-up state machine (Lifecycle: Fold flat before leaf sweep)
  updatePops(POPS, t, spread, turnK);

  // 4. Update actors visibility per spread (Zero clipping)
  if (spread === 0 && turning < 0) {
    const k = back(seg(t, RISE[0], RISE[0] + 0.6), 1.3);
    passenger.root.visible = k > 0.01;
    passenger.root.rotation.x = -Math.PI / 2 * (1 - k);
    engineer.root.visible = false;
  } else if (spread === 1 && turning < 0) {
    passenger.root.visible = false;
    const k = back(seg(t, RISE[1], RISE[1] + 0.6), 1.3);
    engineer.root.visible = k > 0.01;
    engineer.root.rotation.x = -Math.PI / 2 * (1 - k);
  } else if (spread === 3 && turning < 0) {
    const k = back(seg(t, RISE[3], RISE[3] + 0.6), 1.3);
    passenger.root.visible = k > 0.01;
    passenger.root.rotation.x = -Math.PI / 2 * (1 - k);
    engineer.root.visible = false;
  } else {
    // Page turning or Spread 2
    passenger.root.visible = false;
    engineer.root.visible = false;
  }

  // 5. Camera track & DoF
  const C = camAt(t);
  cam.position.copy(C.pos);
  cam.lookAt(C.tgt);
  cam.fov = C.fov;
  cam.updateProjectionMatrix();

  post.dof.focus = C.focus;
  post.dof.aper = C.aper;
  post.composer.render();

  // 6. Overlay HUD (Subtitles, Chapter banners, Character bubbles)
  OX.clearRect(0, 0, W, H);
  HUD.drawSubs(OX, t);
  HUD.drawChapter(OX, t);

  // Compute screen anchors for bubbles
  const anchors = {};
  if (passenger.root.visible) {
    const pVec = new THREE.Vector3(-0.06, 0.16, 0.16).project(cam);
    anchors['passenger'] = [(pVec.x * 0.5 + 0.5) * W, (-pVec.y * 0.5 + 0.5) * H];
  }
  if (engineer.root.visible) {
    const eVec = new THREE.Vector3(-0.08, 0.17, 0.15).project(cam);
    anchors['engineer'] = [(eVec.x * 0.5 + 0.5) * W, (-eVec.y * 0.5 + 0.5) * H];
  }
  HUD.drawBubbles(OX, t, anchors);
};

window.READY = true;
window.DUR = DUR;
console.log('Airplane Window Pop-up Studio Ready! DUR =', DUR);
