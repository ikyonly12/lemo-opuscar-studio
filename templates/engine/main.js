// Main Orchestrator for The Hidden Geometry of QWERTY
// Broadcast Three.js r170 simulation with Native Indonesian Neural Voiceover
import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as L from './lib.js';
import { clamp, lerp, seg, ss, eo, eio, back, track, TAU } from './lib.js';
import * as A from './art.js';
import { cv, finishCut } from './paper.js';
import { makeBook, coverCanvases, texOf } from './book.js';
import { pages, buildSets, updateSets } from './sets.js';
import { cutMesh, particles } from './cutmesh.js';
import { makePost } from './post.js';
import { DUR, OPEN, CLOSE, PAGE_TURN_0, PAGE_TURN_1, PAGE_TURN_2, SHOTS } from './story.js';
import * as HUD from './hud.js';

const W = 1920, H = 1080;
const stage = document.getElementById('stage');
const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(1);
renderer.setSize(W, H);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;
stage.appendChild(renderer.domElement);

const ov = document.getElementById('ov'), OX = ov.getContext('2d');
ov.width = W; ov.height = H;

const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(36, W / H, 0.005, 30);
const post = makePost(renderer, scene, cam, W, H);

// ---------- Fonts ----------
const fontList = ['500 36px Fredoka', '600 34px Fredoka', '64px "Lilita One"', '32px "Lilita One"'];
await Promise.all(fontList.map(f => document.fonts.load(f, 'AaQWERTY123')));

// ---------- HDRI Environment ----------
const hdr = await new RGBELoader().loadAsync('assets/lythwood_lounge_2k.hdr');
hdr.mapping = THREE.EquirectangularReflectionMapping;
scene.environment = hdr;
scene.background = hdr;
scene.backgroundBlurriness = 0.28;
scene.environmentIntensity = 0.28;

// ---------- Walnut Desk with PBR Maps ----------
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

// Studio Props: Desk Lamp
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

// ---------- Book Stage & Sets ----------
const cover = coverCanvases();
const book = makeBook(cover);
scene.add(book.root);

// Generate all 4 double-page spreads
const P = pages(), PT = {};
for (const k in P) PT[k] = texOf(P[k]);

const SPREAD = [
  { ground: PT.ground0, sky: PT.sky0 },
  { ground: PT.ground1, sky: PT.sky1 },
  { ground: PT.ground2, sky: PT.sky2 },
  { ground: PT.ground3, sky: PT.sky3 }
];

// Initial spread assignment
book.groundMat.map = SPREAD[0].ground;
book.groundMat.needsUpdate = true;
book.backMat.map = SPREAD[0].sky;
book.backMat.needsUpdate = true;

const M = buildSets(book);

// ---------- Lighting ----------
const lampHead = new THREE.Vector3(-0.28, 0.38, 0.44);
const spot = new THREE.SpotLight('#fff2e0', 0.42);
spot.position.copy(lampHead);
spot.target.position.set(0.02, 0, 0.2);
spot.castShadow = true;
spot.shadow.mapSize.set(4096, 4096);
spot.shadow.bias = -0.00006;
spot.shadow.normalBias = 0.0004;
spot.shadow.radius = 4;
scene.add(spot, spot.target);

const sun = new THREE.DirectionalLight('#fff0dd', 1.15);
sun.position.set(0.6, 1.2, 0.8);
sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096);
sun.shadow.bias = -0.00006;
sun.shadow.normalBias = 0.0003;
sun.shadow.radius = 3;
scene.add(sun);

const ambLight = new THREE.AmbientLight('#ffeacc', 0.28);
scene.add(ambLight);

// ---------- Particle Systems ----------
function spriteTex(fn, n = 64) {
  const c = cv(n, n), x = c.getContext('2d'); fn(x, n);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const glowTex = spriteTex((x, n) => {
  const g = x.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.3, 'rgba(255,255,255,0.5)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, n, n);
});
const starTex = spriteTex((x, n) => {
  x.translate(n / 2, n / 2); x.fillStyle = '#fff'; x.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * TAU, r = i % 2 ? n * 0.1 : n * 0.48;
    x.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  x.closePath(); x.fill();
}, 128);

const quad = new THREE.PlaneGeometry(1, 1);
const addMat = (map, col) => new THREE.MeshBasicMaterial({
  map, color: col, transparent: true, depthWrite: false,
  blending: THREE.AdditiveBlending, side: THREE.DoubleSide, toneMapped: true
});

const camQ = new THREE.Quaternion();
function billboard(fn) {
  return (i, t) => {
    const p = fn(i, t);
    if (p) {
      const e = new THREE.Euler().setFromQuaternion(camQ);
      p.rx = e.x; p.ry = e.y; p.rz = e.z + (p.spin || 0);
    }
    return p;
  };
}

const PS = [];
// 1. Dust in the desk lamp beam
PS.push(particles(quad, addMat(glowTex, new THREE.Color(1.2, 1.0, 0.75)), 70, billboard((i, t) => {
  const on = Math.max(seg(t, 0, 2) * (1 - seg(t, 100, 104)), 0.3);
  const R = L.mulberry(i * 7 + 1), u = R(), v = R(), w = R(), sp = 0.003 + R() * 0.005;
  const x = lerp(-0.3, 0.1, u) + Math.sin(t * 0.25 + i) * 0.015;
  const y = 0.02 + ((v * 0.35 + t * sp) % 0.35);
  const z = lerp(0.1, 0.5, w) + Math.cos(t * 0.2 + i) * 0.015;
  return { x, y, z, s: (0.0015 + R() * 0.002) * on * (0.5 + 0.5 * Math.sin(t * 1.2 + i * 2)) };
})));

// 2. Golden sparkles when book opens
const sparkle = particles(quad, addMat(starTex, new THREE.Color(2.4, 1.9, 0.9)), 80, billboard((i, t) => {
  const R = L.mulberry(i * 13 + 5), t0 = OPEN[0] + 0.3 + R() * 2.2, life = 1.2 + R() * 1.0, k = (t - t0) / life;
  if (k < 0 || k > 1) return null;
  const x = lerp(-0.18, 0.18, R()), z = lerp(0.04, 0.26, R());
  return { x: x + Math.sin(k * 5 + i) * 0.01, y: k * (0.07 + R() * 0.08), z, s: 0.005 * Math.sin(k * Math.PI) * (0.5 + R()), spin: t * 2 + i };
}));
book.stage.add(sparkle); PS.push(sparkle);

// 3. Clashing sparks during typebar basket jam at 42.0s
const clashSparks = particles(quad, addMat(starTex, new THREE.Color(2.5, 1.4, 0.4)), 50, billboard((i, t) => {
  const R = L.mulberry(i * 11 + 3), t0 = 41.5 + R() * 3.5, life = 0.4 + R() * 0.3, k = (t - t0) / life;
  if (k < 0 || k > 1) return null;
  const vx = (R() - 0.5) * 0.08, vy = 0.04 + R() * 0.06, vz = (R() - 0.5) * 0.04;
  return { x: 0.07 + vx * k, y: 0.05 + vy * k - 0.1 * k * k, z: 0.12 + vz * k, s: 0.004 * (1 - k), spin: t * 8 };
}));
book.stage.add(clashSparks); PS.push(clashSparks);

// ---------- Camera & Shot Interpolation ----------
function updateCamera(t) {
  let curShot = SHOTS[0];
  for (const s of SHOTS) {
    if (t >= s.t0 && t <= s.t1) {
      curShot = s;
      break;
    }
  }

  const u = clamp((t - curShot.t0) / Math.max(0.001, curShot.t1 - curShot.t0), 0, 1);
  const kEase = eio(u);

  cam.position.set(
    curShot.cam[0],
    curShot.cam[1] - (1 - kEase) * 0.008,
    curShot.cam[2] + (1 - kEase) * 0.012
  );
  cam.lookAt(curShot.look[0], curShot.look[1], curShot.look[2]);
  cam.fov = curShot.fov;
  cam.updateProjectionMatrix();

  camQ.copy(cam.quaternion);

  // Update physical DoF
  post.dof.focus = curShot.focus;
}

// ---------- Render Frame (Exposed to Playwright) ----------
window.render = function(t) {
  // 1. Book open/close angle
  if (t < OPEN[0]) {
    book.setOpen(0);
  } else if (t < OPEN[1]) {
    const k = ss(seg(t, OPEN[0], OPEN[1]));
    book.setOpen(k * Math.PI / 2);
  } else if (t < CLOSE[0]) {
    book.setOpen(Math.PI / 2);
  } else if (t <= CLOSE[1]) {
    const k = ss(seg(t, CLOSE[0], CLOSE[1]));
    book.setOpen((1 - k) * Math.PI / 2);
  } else {
    book.setOpen(0);
  }

  // 2. Spread & Page Turn Sweeping Texture Transitions
  const TURNS = [PAGE_TURN_0, PAGE_TURN_1, PAGE_TURN_2];
  let spread = 0;
  for (let i = 0; i < 3; i++) {
    if (t >= TURNS[i][0] + 0.45) spread = i + 1;
  }
  let turning = -1;
  for (let i = 0; i < 3; i++) {
    if (t >= TURNS[i][0] && t <= TURNS[i][1]) turning = i;
  }

  // Update active spread textures on ground and backdrop
  book.groundMat.map = SPREAD[spread].ground;
  book.groundMat.needsUpdate = true;
  const skyIdx = turning >= 0 ? turning : spread;
  book.backMat.map = SPREAD[skyIdx].sky;
  book.backMat.needsUpdate = true;

  if (turning >= 0) {
    const a = TURNS[turning][0], b = TURNS[turning][1];
    const u = eio(seg(t, a, b));
    book.leafFront.material.map = SPREAD[turning].ground;
    book.leafBack.material.map = SPREAD[turning + 1].sky;
    book.leafFront.material.emissiveMap = book.leafFront.material.map;
    book.leafBack.material.emissiveMap = book.leafBack.material.map;
    book.leafFront.material.needsUpdate = book.leafBack.material.needsUpdate = true;
    book.setLeaf(u);
  } else {
    book.setLeaf(0);
  }

  // 3. Update Sets, Pop-Up Pieces and Actors
  updateSets(M, t);

  // 4. Update Camera Splines & Particle Billboards
  updateCamera(t);
  for (const p of PS) p.userData.update(t);

  // 5. Render 3D Scene through Post-Processing Composer
  scene.updateMatrixWorld(true);
  post.composer.render();

  // 6. Draw 2D HUD Overlays
  OX.clearRect(0, 0, W, H);

  // Anchors for character speech bubbles
  const anchors = {
    user: (M.ex && M.ex.userActor) ? project(M.ex.userActor.head()) : [W / 2, H / 2],
    sholes: (M.ex && M.ex.sholesActor) ? project(M.ex.sholesActor.head()) : [W / 2, H / 2]
  };

  HUD.drawSubs(OX, t);
  HUD.drawBubbles(OX, t, anchors);
  HUD.drawChapters(OX, t);

  // Fade in / out at start and end
  if (t < 1.2 || t > DUR - 1.2) {
    OX.fillStyle = `rgba(0,0,0,${1 - seg(t, 0, 1.2) * (1 - seg(t, DUR - 1.2, DUR))})`;
    OX.fillRect(0, 0, W, H);
  }
};

const _pv = new THREE.Vector3();
function project(worldVec) {
  _pv.copy(worldVec).project(cam);
  return [(_pv.x * 0.5 + 0.5) * W, (-_pv.y * 0.5 + 0.5) * H];
}

window.render(0.0);
window.READY = true;
window.DUR = DUR;
