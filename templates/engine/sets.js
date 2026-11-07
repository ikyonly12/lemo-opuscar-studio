// Dynamic Multi-Tiered Paper Sets & Spreads for Passer Baroe: Detak Jantung 200 Tahun
import * as THREE from 'three';
import * as A from './art.js';
import { makeUserActor, makeSholesActor, makeTelegraphActor } from './actors.js';
import { cv, GRAIN, paperFill, INK, blob, sh, smoothClosed, smoothOpen, finishCut } from './paper.js';
import { mulberry, clamp, lerp, seg, back, ss, eo, eio, TAU, spring } from './lib.js';
import { BW, BD, texOf } from './book.js';
import { cutMesh, thread, blobShadow } from './cutmesh.js';
import { OPEN, CLOSE, PAGE_TURN_0, PAGE_TURN_1, PAGE_TURN_2 } from './story.js';

const PW = 2048, PH = Math.round(2048 * BD / BW); // 2048 x 1396
const gx = xm => (xm / BW + 0.5) * PW, gz = zm => (zm / BD) * PH;

// When each spread appears (pops up) and folds away flat
export const RISE = [
  OPEN[0] + 0.9,
  PAGE_TURN_0[1] - 0.6,
  PAGE_TURN_1[1] - 0.6,
  PAGE_TURN_2[1] - 0.6
];
export const FOLD = [
  PAGE_TURN_0[0],
  PAGE_TURN_1[0],
  PAGE_TURN_2[0],
  CLOSE[0]
];

// ---------- Page Canvas Art Helpers ----------
function page(fn, seed = 1) {
  const c = cv(PW, PH), x = c.getContext('2d');
  fn(x);
  x.save();
  x.globalAlpha = 0.55;
  x.fillStyle = x.createPattern(GRAIN, 'repeat');
  x.fillRect(0, 0, PW, PH);
  x.restore();
  return c;
}

function grad(x, stops) {
  const g = x.createLinearGradient(0, 0, 0, PH);
  stops.forEach(([o, c]) => g.addColorStop(o, c));
  x.fillStyle = g;
  x.fillRect(0, 0, PW, PH);
}

// ============================================================================
// 1. Double-Page Illustrated Spreads (4 Spreads)
// ============================================================================
export function pages() {
  const P = {};

  // ----- Spread 0: Batavia 1820 Weltevreden & Toko Populer 1927 -----
  // Sky 0: Colonial Weltevreden Morning Sky & Archival Map
  P.sky0 = page(x => {
    grad(x, [[0, '#09152b'], [0.45, '#1e293b'], [1, '#334155']]);

    // Golden morning sun beam over Batavia
    const spot = x.createRadialGradient(PW * 0.28, PH * 0.2, 30, PW * 0.38, PH * 0.45, 950);
    spot.addColorStop(0, 'rgba(251, 191, 36, 0.22)');
    spot.addColorStop(0.6, 'rgba(217, 119, 6, 0.08)');
    spot.addColorStop(1, 'rgba(0, 0, 0, 0)');
    x.fillStyle = spot;
    x.fillRect(0, 0, PW, PH);

    // Archival Batavia map grid watermark
    x.strokeStyle = 'rgba(251, 191, 36, 0.08)';
    x.lineWidth = 1.5;
    for (let i = 80; i < PW; i += 70) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, PH); x.stroke(); }
    for (let j = 80; j < PH; j += 70) { x.beginPath(); x.moveTo(0, j); x.lineTo(PW, j); x.stroke(); }

    // Classical Batavia canal navigation compass rose
    const cx = PW * 0.82, cy = PH * 0.38;
    x.strokeStyle = 'rgba(254, 243, 199, 0.15)'; x.lineWidth = 2;
    x.beginPath(); x.arc(cx, cy, 90, 0, TAU); x.stroke();
    x.beginPath(); x.arc(cx, cy, 45, 0, TAU); x.stroke();

    // Elegant colonial title plaque
    x.fillStyle = 'rgba(15, 23, 42, 0.8)';
    x.beginPath(); x.roundRect(PW / 2 - 440, 60, 880, 92, 16); x.fill();
    x.strokeStyle = '#d97706'; x.lineWidth = 3.5; x.stroke();
    x.fillStyle = '#fef3c7'; x.font = '700 38px "Lilita One"'; x.textAlign = 'center';
    x.fillText('PASSER BAROE 1820: PUSAT NIAGA WELTEVREDEN', PW / 2, 120);
  }, 1);

  // Ground 0: Batavia Cobblestone Promenade & Tram Lines
  P.ground0 = page(x => {
    // Weathered Batavia stone cobblestones
    grad(x, [[0, '#292524'], [0.45, '#1c1917'], [1, '#0c0a09']]);

    // Flagstone texture
    const R = mulberry(12);
    for (let i = 0; i < PH; i += 5) {
      x.fillStyle = `rgba(0,0,0,${0.05 + R() * 0.06})`;
      x.fillRect(0, i, PW, 1.6);
    }

    // Historical Tram Lines running horizontally
    const ty = PH * 0.65;
    x.fillStyle = '#475569';
    x.fillRect(0, ty - 6, PW, 12);
    x.fillRect(0, ty + 60, PW, 12);
    x.strokeStyle = '#94a3b8'; x.lineWidth = 2;
    x.beginPath(); x.moveTo(0, ty); x.lineTo(PW, ty); x.stroke();
    x.beginPath(); x.moveTo(0, ty + 66); x.lineTo(PW, ty + 66); x.stroke();

    // Wooden railway sleepers
    x.fillStyle = '#78350f';
    for (let tx = 30; tx < PW; tx += 65) {
      x.fillRect(tx, ty - 14, 28, 98);
    }

    // Archival inscription watermark
    x.fillStyle = 'rgba(254, 243, 199, 0.08)';
    x.font = '700 28px "Lilita One"'; x.textAlign = 'left';
    x.fillText('DE NOORDWIJK PASSAGE - WELTEVREDEN 1820', 120, PH - 60);
  }, 2);

  // ----- Spread 1: Pasar Baru Masa Kini (Benteng Nostalgia & Living Heritage) -----
  // Sky 1: Art Deco Pediments & Vintage Shophouses Arcade
  P.sky1 = page(x => {
    // Warm retro amber & terracotta dusk
    grad(x, [[0, '#311006'], [0.4, '#451a03'], [1, '#1c1917']]);

    // Shophouse pediment silhouette outlines across background
    x.fillStyle = 'rgba(254, 243, 199, 0.06)';
    for (let sx = 60; sx < PW - 100; sx += 260) {
      x.beginPath();
      x.moveTo(sx, PH * 0.65);
      x.lineTo(sx, PH * 0.32);
      x.lineTo(sx + 120, PH * 0.22);
      x.lineTo(sx + 240, PH * 0.32);
      x.lineTo(sx + 240, PH * 0.65);
      x.closePath();
      x.fill();
    }

    // Header plaque for Masa Kini
    x.fillStyle = 'rgba(15, 23, 42, 0.85)';
    x.beginPath(); x.roundRect(PW / 2 - 420, 60, 840, 90, 16); x.fill();
    x.strokeStyle = '#b45309'; x.lineWidth = 3; x.stroke();
    x.fillStyle = '#fed7aa'; x.font = '700 38px "Lilita One"'; x.textAlign = 'center';
    x.fillText('PASAR BARU MASA KINI: TRADISI 200 TAHUN', PW / 2, 120);
  }, 3);

  // Ground 1: Pedestrian Flagstone Walkway & Artisan Alley
  P.ground1 = page(x => {
    // Warm terracotta promenade floor
    grad(x, [[0, '#451a03'], [0.45, '#291102'], [1, '#180a02']]);

    // Prominent flagstone paving grid
    const ph = 85;
    x.strokeStyle = 'rgba(0,0,0,0.5)'; x.lineWidth = 3.5;
    for (let y = ph; y < PH; y += ph) {
      x.beginPath(); x.moveTo(0, y); x.lineTo(PW, y); x.stroke();
    }
    for (let xPos = 90; xPos < PW; xPos += 140) {
      x.beginPath(); x.moveTo(xPos, 0); x.lineTo(xPos, PH); x.stroke();
    }

    // Heritage culinary & tailor seal watermark
    x.fillStyle = 'rgba(255, 255, 255, 0.06)';
    x.font = '700 24px "Lilita One"'; x.textAlign = 'center';
    x.fillText('GANG KELINCI - PENJAHIT BESPOKE BOMBAY - KAMERA KLASIK', PW * 0.5, PH - 65);
  }, 4);

  // ----- Spread 2: Pasar Baru Masa Depan (Cyber-Heritage 2035+) -----
  // Sky 2: Twilight Cyber Skyline & Kinetic Glass Arcade Canopy
  P.sky2 = page(x => {
    // Deep midnight cyan & futuristic indigo
    grad(x, [[0, '#042f2e'], [0.55, '#082f49'], [1, '#0f172a']]);

    // Modern Jakarta high-rise skyline silhouettes with glowing windows
    x.fillStyle = 'rgba(6, 182, 212, 0.08)';
    for (let b = 80; b < PW; b += 160) {
      const bh = 220 + ((b * 13) % 200);
      x.fillRect(b, PH * 0.65 - bh, 130, bh);
      // Window dot lights
      x.fillStyle = 'rgba(254, 240, 138, 0.25)';
      for (let wy = PH * 0.65 - bh + 20; wy < PH * 0.65 - 20; wy += 35) {
        x.fillRect(b + 20, wy, 8, 8);
        x.fillRect(b + 55, wy, 8, 8);
        x.fillRect(b + 90, wy, 8, 8);
      }
      x.fillStyle = 'rgba(6, 182, 212, 0.08)';
    }

    // Header plaque for Future
    const bx = PW * 0.15, by = 60, bw = PW * 0.7, bh = 92;
    x.fillStyle = 'rgba(15, 23, 42, 0.88)';
    x.beginPath(); x.roundRect(bx, by, bw, bh, 16); x.fill();
    x.strokeStyle = '#06b6d4'; x.lineWidth = 3.5; x.stroke();

    x.fillStyle = '#38bdf8';
    x.font = '700 38px "Lilita One"'; x.textAlign = 'center';
    x.fillText('PASAR BARU 2035+: ECO-HERITAGE & KONEKTIVITAS MRT', bx + bw / 2, by + 58);
  }, 5);

  // Ground 2: Kinetic Solar Pavers & Smart Transit Concourse
  P.ground2 = page(x => {
    // Dark carbon slate with glowing cyan circuit guides
    grad(x, [[0, '#022c22'], [0.5, '#082f49'], [1, '#020617']]);

    // Glowing cyan transit line
    x.strokeStyle = '#06b6d4'; x.lineWidth = 6;
    x.strokeRect(80, 80, PW - 160, PH - 160);

    // Hexagonal smart solar paver grid
    x.strokeStyle = 'rgba(56, 189, 248, 0.15)'; x.lineWidth = 2;
    for (let px = 120; px < PW - 120; px += 80) {
      for (let py = 120; py < PH - 120; py += 70) {
        x.beginPath();
        x.arc(px, py, 26, 0, TAU);
        x.stroke();
      }
    }

    // Smart concourse watermark
    x.fillStyle = 'rgba(56, 189, 248, 0.2)';
    x.font = '700 24px "Lilita One"'; x.textAlign = 'center';
    x.fillText('INTEGRASI MRT JAKARTA & KORIDOR PEJALAN KAKI CERDAS', PW * 0.5, PH - 65);
  }, 6);

  // ----- Spread 3: Epilogue (200 Tahun Passer Baroe) -----
  // Sky 3: Golden Archival Heritage Crest
  P.sky3 = page(x => {
    paperFill(x, PW, PH, '#0f172a', 41, 0.05);

    // Giant Golden Gateway Crest Silhouette
    const cx = PW / 2, cy = PH * 0.44;
    const gGold = x.createRadialGradient(cx, cy, 50, cx, cy, 600);
    gGold.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
    gGold.addColorStop(0.6, 'rgba(180, 83, 9, 0.12)');
    gGold.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = gGold;
    x.fillRect(0, 0, PW, PH);

    x.fillStyle = '#fef3c7';
    x.font = '900 52px "Lilita One"'; x.textAlign = 'center';
    x.fillText('PASSER BAROE: DETAK JANTUNG 200 TAHUN', cx, cy - 60);

    x.font = '500 28px "Fredoka"';
    x.fillStyle = '#cbd5e1';
    x.fillText('1820 Weltevreden  •  1927 Indonesia Raya  •  2035+ Smart Heritage', cx, cy + 20);
  }, 7);

  // Ground 3: Dark Mahogany Presentation Plinth
  P.ground3 = page(x => {
    grad(x, [[0, '#1c1917'], [0.5, '#0c0a09'], [1, '#000000']]);
    x.strokeStyle = '#d97706'; x.lineWidth = 4;
    x.strokeRect(100, 100, PW - 200, PH - 200);
  }, 8);

  return P;
}

// ============================================================================
// 2. Build Multi-Tiered 3D Sets & Pop-Up Props
// ============================================================================
function popper(list, spread, parent, item, x, y, z, o = {}) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  const m = cutMesh(item, o);
  if (o.flip) m.scale.x = -1;
  if (o.ry) m.rotation.y = o.ry;
  if (o.rx) m.rotation.x = o.rx;
  g.add(m);
  parent.add(g);
  const rec = {
    g,
    m,
    spread,
    d: o.d ?? 0,
    dir: o.dir ?? (z > 0.15 ? -1 : 1),
    sway: o.sway || 0,
    ph: o.ph ?? x * 40,
    pop: o.pop !== false,
    upd: o.upd
  };
  list.push(rec);
  return rec;
}

function riseOf(r, t) {
  const t0 = RISE[r.spread] + r.d;
  const tf = FOLD[r.spread] + (0.3 - r.g.position.z) * 0.6;
  if (t < t0 || t > tf + 0.4) return 0;
  const up = r.pop ? back(seg(t, t0, t0 + 0.55), 1.6) : (t >= t0 ? 1 : 0);
  const dn = 1 - ss(seg(t, tf, tf + 0.4));
  return Math.max(0, Math.min(up, dn));
}

export function buildSets(book) {
  const L = []; // all pop-up pieces
  const S = book.stage, K = book.sky;
  const ex = {};

  const dz = z => (0.3 - z) * 1.1; // pop up sequentially back-to-front

  // ==========================================================================
  // Spread 0: Batavia 1820 Weltevreden & Toko Populer 1927 (0.0s - 39.8s)
  // ==========================================================================
  const s0 = 0;

  // Background wall tier (z ~ 0.018 - 0.038)
  popper(L, s0, S, A.makePasserBaroeGate(0.24), -0.06, 0, 0.025, { d: dz(0.025) });
  popper(L, s0, S, A.makeDaendelsPlaque(0.14), 0.14, 0, 0.022, { d: dz(0.022) });

  // Suspended on thread from book.sky (Batavia Street Gaslight)
  {
    const gLantern = new THREE.Group();
    const itLantern = A.makeGaslightLantern(0.16);
    gLantern.add(cutMesh(itLantern));
    const th = thread(0.24);
    th.position.set(0, 0, -0.0004);
    gLantern.add(th);
    gLantern.position.set(-0.16, 0.34, 0.03);
    K.add(gLantern);
    ex.gasLantern0 = gLantern;
  }

  // Midground tier (z ~ 0.06 - 0.10)
  popper(L, s0, S, A.makeHorseCarriage(0.16), 0.08, 0, 0.075, { d: dz(0.075), sway: 0.01 });
  popper(L, s0, S, A.makeGramophoneRecord(0.18), -0.12, 0, 0.082, { d: dz(0.082) });

  // Hero Action Zone (z ~ 0.12 - 0.16)
  // Historical Actor (Merchant / Storyteller)
  const userActor = makeUserActor(0.165);
  userActor.root.position.set(-0.02, 0, 0.14);
  S.add(userActor.root);
  ex.userActor = userActor;

  // Foreground tier (z ~ 0.20 - 0.26)
  popper(L, s0, S, A.makeDeskCoffeeAndTools(0.075), -0.15, 0, 0.22, { d: dz(0.22) });
  popper(L, s0, S, A.makeScatteredKeycap('1', 0.028, false), -0.04, 0, 0.24, { d: dz(0.24) });
  popper(L, s0, S, A.makeScatteredKeycap('8', 0.028, false), 0.02, 0, 0.25, { d: dz(0.25) });
  popper(L, s0, S, A.makeScatteredKeycap('2', 0.028, false), 0.10, 0, 0.23, { d: dz(0.23) });
  popper(L, s0, S, A.makeScatteredKeycap('0', 0.028, false), 0.16, 0, 0.26, { d: dz(0.26) });

  // ==========================================================================
  // Spread 1: Pasar Baru Masa Kini (Tradisi & Living Heritage) (42.6s - 59.5s)
  // ==========================================================================
  const s1 = 1;

  // Background wall tier (z ~ 0.014 - 0.035)
  popper(L, s1, S, A.makeFactoryBrickArch(0.25), -0.02, 0, 0.014, { d: dz(0.014) });
  popper(L, s1, S, A.makePatentScrollWall(0.19), 0.15, 0, 0.026, { d: dz(0.026) });

  // Suspended Lantern
  {
    const gLantern = new THREE.Group();
    const itLantern = A.makeGaslightLantern(0.16);
    gLantern.add(cutMesh(itLantern));
    const th = thread(0.24);
    th.position.set(0, 0, -0.0004);
    gLantern.add(th);
    gLantern.position.set(0.15, 0.35, 0.03);
    K.add(gLantern);
    ex.gasLantern1 = gLantern;
  }

  // Midground tier (z ~ 0.06 - 0.10)
  popper(L, s1, S, A.makeTextileRolls(0.16), 0.12, 0, 0.075, { d: dz(0.075) });
  popper(L, s1, S, A.makeVintageCamera(0.15), -0.12, 0, 0.078, { d: dz(0.078) });

  // Hero Action Zone (z ~ 0.11 - 0.15)
  // Steaming Gang Kelinci Noodles on foreground table
  popper(L, s1, S, A.makeGangKelinciNoodles(0.14), 0.01, 0, 0.115, { d: dz(0.115), sway: 0.008 });

  // Master Bespoke Tailor Actor
  const sholesActor = makeSholesActor(0.175);
  sholesActor.root.position.set(-0.09, 0, 0.15);
  S.add(sholesActor.root);
  ex.sholesActor = sholesActor;

  // Foreground tier (z ~ 0.20 - 0.26)
  popper(L, s1, S, A.makeScatteredKeycap('2', 0.032, true), -0.16, 0, 0.22, { d: dz(0.22) });
  popper(L, s1, S, A.makeScatteredKeycap('0', 0.032, true), -0.08, 0, 0.25, { d: dz(0.25) });
  popper(L, s1, S, A.makeScatteredKeycap('0', 0.032, true), 0.04, 0, 0.24, { d: dz(0.24) });
  popper(L, s1, S, A.makeScatteredKeycap('T', 0.032, true), 0.15, 0, 0.25, { d: dz(0.25) });

  // ==========================================================================
  // Spread 2: Pasar Baru Masa Depan (Cyber-Heritage 2035+) (62.3s - 84.0s)
  // ==========================================================================
  const s2 = 2;

  // Background wall tier (z ~ 0.015 - 0.035)
  popper(L, s2, S, A.makeFutureArcade(0.24), 0.0, 0, 0.026, { d: dz(0.026) });

  // Elevated Sky MRT Jakarta Train gliding on viaduct
  {
    const gTrain = new THREE.Group();
    const itTrain = A.makeSkyMrtTrain(0.14);
    gTrain.add(cutMesh(itTrain));
    gTrain.position.set(-0.02, 0.10, 0.028);
    S.add(gTrain);
    ex.mrtTrain = gTrain;
  }

  // Midground tier (z ~ 0.06 - 0.10)
  popper(L, s2, S, A.makeSmartKiosk(0.17), 0.12, 0, 0.075, { d: dz(0.075) });
  popper(L, s2, S, A.makeIdeaBulb(0.12), -0.14, 0, 0.078, { d: dz(0.078), sway: 0.01 });

  // Foreground tier (z ~ 0.20 - 0.26)
  popper(L, s2, S, A.makeScatteredKeycap('M', 0.030, false), -0.14, 0, 0.23, { d: dz(0.23) });
  popper(L, s2, S, A.makeScatteredKeycap('R', 0.030, false), -0.04, 0, 0.25, { d: dz(0.25) });
  popper(L, s2, S, A.makeScatteredKeycap('T', 0.030, false), 0.06, 0, 0.24, { d: dz(0.24) });
  popper(L, s2, S, A.makeScatteredKeycap('+', 0.030, false), 0.14, 0, 0.26, { d: dz(0.26) });

  // ==========================================================================
  // Spread 3: Global Epilogue
  // ==========================================================================
  const s3 = 3;
  popper(L, s3, S, A.makePatentScrollWall(0.22), 0.0, 0, 0.02, { d: dz(0.02) });

  return { list: L, ex };
}

// ============================================================================
// 3. Dynamic Micro-Choreography & Animation Updates
// ============================================================================
export function updateSets(bookOrSets, t) {
  const data = (bookOrSets && bookOrSets.sets) ? bookOrSets.sets : bookOrSets;
  if (!data || !data.list) return;

  const { list, ex } = data;

  // Pop-up mechanics for all props
  for (const r of list) {
    const u = riseOf(r, t);
    // Smooth angle folding into book crease
    const ang = (1 - u) * (Math.PI / 2) * r.dir;
    r.g.rotation.x = ang;
    r.g.visible = u > 0.001;

    // Gentle organic swaying
    if (r.sway && u > 0.5) {
      r.g.rotation.z = Math.sin(t * 1.8 + r.ph) * r.sway;
    }
  }

  // --- Elevated MRT Train gliding in Spread 2 ---
  if (ex.mrtTrain) {
    const mrtVis = t >= RISE[2] && t < FOLD[2];
    ex.mrtTrain.visible = mrtVis;
    if (mrtVis) {
      // Glides smoothly across the elevated viaduct
      const mrtProgress = clamp((t - 62.0) / 22.0, 0, 1);
      ex.mrtTrain.position.x = -0.22 + mrtProgress * 0.44;
      ex.mrtTrain.position.y = 0.10 + Math.sin(t * 8.0) * 0.0008; // subtle track vibration
    }
  }

  // --- Suspended Lanterns Organic Pendulum Sway ---
  if (ex.gasLantern0) {
    ex.gasLantern0.visible = t < FOLD[0];
    ex.gasLantern0.rotation.z = Math.sin(t * 1.5) * 0.04;
  }
  if (ex.gasLantern1) {
    ex.gasLantern1.visible = t >= RISE[1] && t < FOLD[1];
    ex.gasLantern1.rotation.z = Math.sin(t * 1.6 + 1.2) * 0.04;
  }

  // --- Historical Actor (Merchant / Storyteller in Spread 0) ---
  const uVis = t < FOLD[0];
  ex.userActor.root.visible = uVis;
  ex.userActor.shadow.visible = uVis;
  if (uVis) {
    const breathU = Math.sin(t * 3.2);
    ex.userActor.body.scale.set(1.0 - 0.015 * breathU, 1.0 + 0.02 * breathU, 1.0);
    ex.userActor.body.rotation.z = Math.sin(t * 1.4) * 0.025;
    ex.userActor.body.position.y = Math.sin(t * 3.2) * 0.001;

    const blinkU = (Math.sin(t * 2.8) > 0.94 || (t % 5.5 > 5.3)) ? 1 : 0;
    const mood = t > 26.0 && t < 38.0 ? 'puzzled' : 'typing';
    
    // Voiceover line speaking mouth sync
    const isSpeaking = (t > 2.0 && t < 8.0) || (t > 26.5 && t < 35.0);
    const mouthOpen = isSpeaking ? (0.35 + 0.5 * Math.abs(Math.sin(t * 14.0))) : 0.0;
    
    ex.userActor.pose({ mood, blink: blinkU, mouthOpen });
  }

  // --- Master Bespoke Tailor Actor in Spread 1 ---
  const sVis = t >= RISE[1] && t < FOLD[1];
  ex.sholesActor.root.visible = sVis;
  ex.sholesActor.shadow.visible = sVis;
  if (sVis) {
    const breathS = Math.sin(t * 2.6);
    ex.sholesActor.body.scale.set(1.0 - 0.016 * breathS, 1.0 + 0.022 * breathS, 1.0);
    
    ex.sholesActor.body.rotation.z = Math.sin(t * 1.3) * 0.028;
    ex.sholesActor.body.position.y = Math.sin(t * 2.6) * 0.001;

    const blinkS = (Math.sin(t * 3.1) > 0.94 || (t % 6.0 > 5.8)) ? 1 : 0;
    const mood = 'working';

    const isSpeaking = t > 43.0 && t < 52.0;
    const mouthOpen = isSpeaking ? (0.45 + 0.5 * Math.abs(Math.sin(t * 15.0))) : 0.0;

    ex.sholesActor.pose({ mood, blink: blinkS, mouthOpen });
  }

  // --- Modern Concourse Pedestrian Actor in Spread 2 ---
  if (ex.teleActor) {
    const teleVis = t >= RISE[2] && t < FOLD[2];
    ex.teleActor.root.visible = teleVis;
    ex.teleActor.shadow.visible = teleVis;
    if (teleVis) {
      const breathT = Math.sin(t * 2.9);
      ex.teleActor.body.scale.set(1.0 - 0.014 * breathT, 1.0 + 0.018 * breathT, 1.0);
      ex.teleActor.body.rotation.z = Math.sin(t * 1.5) * 0.02;
      ex.teleActor.body.position.y = Math.abs(Math.sin(t * 12.0)) * 0.0012;
      const blinkT = Math.sin(t * 3.5) > 0.94 ? 1 : 0;
      ex.teleActor.pose({ mood: 'focused', blink: blinkT, tapOffset: Math.sin(t * 24.0) * 0.004 });
    }
  }
}
