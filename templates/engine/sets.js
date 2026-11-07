// Dynamic Multi-Tiered Paper Sets & Spreads for Passer Baroe: Detak Jantung 200 Tahun (Myeongdong Edition)
import * as THREE from 'three';
import * as A from './art.js';
import { makeUserActor, makeSholesActor, makeTelegraphActor } from './actors.js';
import { cv, GRAIN, paperFill, INK, blob, sh, smoothClosed, smoothOpen, finishCut } from './paper.js';
import { mulberry, clamp, lerp, seg, back, ss, eo, eio, TAU, spring } from './lib.js';
import { BW, BD, texOf } from './book.js';
import { cutMesh, thread, blobShadow } from './cutmesh.js';
import { OPEN, CLOSE, PAGE_TURN_0, PAGE_TURN_1, PAGE_TURN_2, PAGE_TURN_3 } from './story.js';

const PW = 2048, PH = Math.round(2048 * BD / BW); // 2048 x 1396
const gx = xm => (xm / BW + 0.5) * PW, gz = zm => (zm / BD) * PH;

// When each spread appears (pops up) and folds away flat
export const RISE = [
  OPEN[0] + 0.9,          // Spread 0 (0.9s)
  PAGE_TURN_0[1] - 0.4,   // Spread 1 (30.4s)
  PAGE_TURN_1[1] - 0.4,   // Spread 2 (43.8s)
  PAGE_TURN_2[1] - 0.4    // Spread 3 (63.8s)
];
export const FOLD = [
  PAGE_TURN_0[0],         // Spread 0 (28.8s)
  PAGE_TURN_1[0],         // Spread 1 (42.0s)
  PAGE_TURN_2[0],         // Spread 2 (62.0s)
  CLOSE[0]                // Spread 3 (93.0s)
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

  // ----- Spread 0: Batavia 1820 Weltevreden & Toko Kompak Mayor Tionghoa -----
  P.sky0 = page(x => {
    grad(x, [[0, '#09152b'], [0.45, '#1e293b'], [1, '#334155']]);

    // Morning golden sunbeam over Weltevreden
    const spot = x.createRadialGradient(PW * 0.28, PH * 0.2, 30, PW * 0.38, PH * 0.45, 950);
    spot.addColorStop(0, 'rgba(251, 191, 36, 0.22)');
    spot.addColorStop(0.6, 'rgba(217, 119, 6, 0.08)');
    spot.addColorStop(1, 'rgba(0, 0, 0, 0)');
    x.fillStyle = spot;
    x.fillRect(0, 0, PW, PH);

    // Archival Batavia map grid watermark
    x.strokeStyle = 'rgba(251, 191, 36, 0.08)'; x.lineWidth = 1.5;
    for (let i = 80; i < PW; i += 70) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, PH); x.stroke(); }
    for (let j = 80; j < PH; j += 70) { x.beginPath(); x.moveTo(0, j); x.lineTo(PW, j); x.stroke(); }

    // Header plaque
    x.fillStyle = 'rgba(15, 23, 42, 0.85)';
    x.beginPath(); x.roundRect(PW / 2 - 460, 60, 920, 92, 16); x.fill();
    x.strokeStyle = '#d97706'; x.lineWidth = 3.5; x.stroke();
    x.fillStyle = '#fef3c7'; x.font = '700 36px "Lilita One"'; x.textAlign = 'center';
    x.fillText('PASSER BAROE 1820: PUSAT NIAGA WELTEVREDEN', PW / 2, 120);
  }, 1);

  P.ground0 = page(x => {
    grad(x, [[0, '#292524'], [0.45, '#1c1917'], [1, '#0c0a09']]);

    // Cobblestones
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

    x.fillStyle = '#78350f';
    for (let tx = 30; tx < PW; tx += 65) {
      x.fillRect(tx, ty - 14, 28, 98);
    }
  }, 2);

  // ----- Spread 1: Toko Populer 1927 (Perekaman Pertama Lagu Indonesia Raya) -----
  P.sky1 = page(x => {
    grad(x, [[0, '#1c1917'], [0.45, '#292524'], [1, '#451a03']]);

    // Giant Shellac Record Groove Artwork in background
    const scX = PW * 0.5, scY = PH * 0.42;
    x.strokeStyle = 'rgba(251, 191, 36, 0.12)'; x.lineWidth = 2;
    for (let r = 80; r < 480; r += 24) {
      x.beginPath(); x.arc(scX, scY, r, 0, TAU); x.stroke();
    }

    // Header plaque for 1927
    x.fillStyle = 'rgba(15, 23, 42, 0.88)';
    x.beginPath(); x.roundRect(PW / 2 - 460, 60, 920, 92, 16); x.fill();
    x.strokeStyle = '#b91c1c'; x.lineWidth = 3.5; x.stroke();
    x.fillStyle = '#fef3c7'; x.font = '700 36px "Lilita One"'; x.textAlign = 'center';
    x.fillText('TOKO POPULER 1927: REKAMAN EMAS INDONESIA RAYA', PW / 2, 120);
  }, 3);

  P.ground1 = page(x => {
    grad(x, [[0, '#311006'], [0.45, '#1e1b4b'], [1, '#0c0a09']]);

    // Vintage Teak Parquet Floor
    x.strokeStyle = 'rgba(0,0,0,0.5)'; x.lineWidth = 3;
    for (let y = 80; y < PH; y += 80) {
      x.beginPath(); x.moveTo(0, y); x.lineTo(PW, y); x.stroke();
    }

    // Historical watermarks
    x.fillStyle = 'rgba(254, 243, 199, 0.08)';
    x.font = '700 24px "Lilita One"'; x.textAlign = 'center';
    x.fillText('PIRINGAN HITAM 78 RPM • MASTER ASLI WR SOEPRATMAN • TOKO POPULER', PW * 0.5, PH - 65);
  }, 4);

  // ----- Spread 2: Pasar Baru Masa Kini (Penjahit Jas Bombay, Kamera & Gang Kelinci) -----
  P.sky2 = page(x => {
    grad(x, [[0, '#1e293b'], [0.45, '#334155'], [1, '#1e1b4b']]);

    // Transparent arched canopy roof truss pattern (Khas Atap Pasar Baru)
    x.strokeStyle = 'rgba(56, 189, 248, 0.15)'; x.lineWidth = 3;
    for (let ax = 120; ax < PW; ax += 220) {
      x.beginPath();
      x.arc(ax, PH * 0.2, 180, Math.PI, 0);
      x.stroke();
    }

    // Header plaque for Masa Kini
    x.fillStyle = 'rgba(15, 23, 42, 0.88)';
    x.beginPath(); x.roundRect(PW / 2 - 460, 60, 920, 92, 16); x.fill();
    x.strokeStyle = '#b45309'; x.lineWidth = 3.5; x.stroke();
    x.fillStyle = '#fed7aa'; x.font = '700 36px "Lilita One"'; x.textAlign = 'center';
    x.fillText('PASAR BARU MASA KINI: BENTENG TRADISI & NOSTALGIA', PW / 2, 120);
  }, 5);

  P.ground2 = page(x => {
    grad(x, [[0, '#451a03'], [0.45, '#291102'], [1, '#180a02']]);

    // Granite pedestrian promenade pavers
    const ph = 85;
    x.strokeStyle = 'rgba(0,0,0,0.45)'; x.lineWidth = 3;
    for (let y = ph; y < PH; y += ph) {
      x.beginPath(); x.moveTo(0, y); x.lineTo(PW, y); x.stroke();
    }
    for (let xPos = 90; xPos < PW; xPos += 140) {
      x.beginPath(); x.moveTo(xPos, 0); x.lineTo(xPos, PH); x.stroke();
    }

    x.fillStyle = 'rgba(255, 255, 255, 0.06)';
    x.font = '700 24px "Lilita One"'; x.textAlign = 'center';
    x.fillText('PENJAHIT HARIOMS • BURSA KAMERA ANALOG • BAKMI GANG KELINCI', PW * 0.5, PH - 65);
  }, 6);

  // ----- Spread 3: Visi 2027+ Revitalisasi "Myeongdong of Jakarta" -----
  P.sky3 = page(x => {
    // Twilight deep violet & Korean night market ambiance
    grad(x, [[0, '#1e1b4b'], [0.4, '#311042'], [1, '#0f172a']]);

    // Romantic string festoon bistro lights twinkling across sky
    x.strokeStyle = 'rgba(251, 191, 36, 0.4)'; x.lineWidth = 2;
    for (let sy = 180; sy < PH * 0.55; sy += 90) {
      x.beginPath();
      x.moveTo(0, sy);
      x.quadraticCurveTo(PW * 0.5, sy + 65, PW, sy);
      x.stroke();
      // Glowing fairy bulbs
      for (let bx = 60; bx < PW; bx += 85) {
        const u = bx / PW;
        const by = sy + Math.sin(u * Math.PI) * 65;
        const gF = x.createRadialGradient(bx, by, 2, bx, by, 12);
        gF.addColorStop(0, '#fffbeb'); gF.addColorStop(0.6, '#f59e0b'); gF.addColorStop(1, 'rgba(245, 158, 11, 0)');
        x.fillStyle = gF; x.beginPath(); x.arc(bx, by, 12, 0, TAU); x.fill();
      }
    }

    // Header plaque for Myeongdong Jakarta
    const bx = PW * 0.12, by = 60, bw = PW * 0.76, bh = 92;
    x.fillStyle = 'rgba(15, 23, 42, 0.9)';
    x.beginPath(); x.roundRect(bx, by, bw, bh, 16); x.fill();
    x.strokeStyle = '#f59e0b'; x.lineWidth = 3.5; x.stroke();
    x.fillStyle = '#fef08a';
    x.font = '700 36px "Lilita One"'; x.textAlign = 'center';
    x.fillText('PASAR BARU 2027+: SURGA PEDESTRIAN ALA MYEONGDONG', bx + bw / 2, by + 58);
  }, 7);

  P.ground3 = page(x => {
    // Clean modern granite pedestrian tiles (Low Emission Zone)
    grad(x, [[0, '#1e293b'], [0.5, '#0f172a'], [1, '#020617']]);

    // Guiding block tactile pavers for pedestrian accessibility
    x.fillStyle = '#eab308';
    x.fillRect(PW * 0.5 - 20, 0, 40, PH);
    x.strokeStyle = '#ca8a04'; x.lineWidth = 2;
    x.strokeRect(PW * 0.5 - 20, 0, 40, PH);

    x.fillStyle = 'rgba(56, 189, 248, 0.2)';
    x.font = '700 24px "Lilita One"'; x.textAlign = 'center';
    x.fillText('ZONA RENDAH EMISI 24 JAM • AKSES PEJALAN KAKI MRT HARMONI', PW * 0.5, PH - 65);
  }, 8);

  return P;
}

// ============================================================================
// 2. Build Multi-Tiered 3D Sets & Real-World Pop-Up Props
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
  // Spread 0: Batavia 1820 Weltevreden & Toko Kompak (0.0s - 28.8s)
  // ==========================================================================
  const s0 = 0;
  // Background wall tier (z ~ 0.02 - 0.03)
  popper(L, s0, S, A.makePasserBaroeGate(0.24), -0.07, 0, 0.024, { d: dz(0.024) });
  popper(L, s0, S, A.makeTokoKompak(0.22), 0.09, 0, 0.028, { d: dz(0.028) });

  // Midground tier (z ~ 0.06 - 0.08)
  popper(L, s0, S, A.makeDaendelsPlaque(0.14), -0.15, 0, 0.07, { d: dz(0.07) });
  popper(L, s0, S, A.makeHorseCarriage(0.16), 0.08, 0, 0.075, { d: dz(0.075), sway: 0.01 });

  // Hero Action Zone (z ~ 0.12 - 0.15)
  const userActor = makeUserActor(0.165);
  userActor.root.position.set(-0.02, 0, 0.14);
  S.add(userActor.root);
  ex.userActor = userActor;

  // Foreground tier (z ~ 0.22 - 0.26)
  popper(L, s0, S, A.makeDeskCoffeeAndTools(0.075), -0.15, 0, 0.22, { d: dz(0.22) });
  popper(L, s0, S, A.makeScatteredKeycap('1', 0.028, false), -0.04, 0, 0.24, { d: dz(0.24) });
  popper(L, s0, S, A.makeScatteredKeycap('8', 0.028, false), 0.02, 0, 0.25, { d: dz(0.25) });
  popper(L, s0, S, A.makeScatteredKeycap('2', 0.028, false), 0.10, 0, 0.23, { d: dz(0.23) });
  popper(L, s0, S, A.makeScatteredKeycap('0', 0.028, false), 0.16, 0, 0.26, { d: dz(0.26) });

  // ==========================================================================
  // Spread 1: Toko Populer 1927 Perekaman Indonesia Raya (30.4s - 42.0s)
  // ==========================================================================
  const s1 = 1;
  // Background wall tier
  popper(L, s1, S, A.makeFactoryBrickArch(0.25), -0.02, 0, 0.018, { d: dz(0.018) });

  // Midground tier
  popper(L, s1, S, A.makeGramophoneRecord(0.19), -0.08, 0, 0.072, { d: dz(0.072) });
  popper(L, s1, S, A.makeViolinAndSheetMusic(0.14), 0.09, 0, 0.078, { d: dz(0.078) });

  // Foreground tier
  popper(L, s1, S, A.makeScatteredKeycap('1', 0.032, true), -0.16, 0, 0.22, { d: dz(0.22) });
  popper(L, s1, S, A.makeScatteredKeycap('9', 0.032, true), -0.08, 0, 0.25, { d: dz(0.25) });
  popper(L, s1, S, A.makeScatteredKeycap('2', 0.032, true), 0.04, 0, 0.24, { d: dz(0.24) });
  popper(L, s1, S, A.makeScatteredKeycap('7', 0.032, true), 0.15, 0, 0.25, { d: dz(0.25) });

  // ==========================================================================
  // Spread 2: Pasar Baru Masa Kini (Penjahit Bombay, Kamera, Gang Kelinci) (43.8s - 62.0s)
  // ==========================================================================
  const s2 = 2;
  // Background wall tier
  popper(L, s2, S, A.makeBombayTailorShop(0.22), -0.08, 0, 0.022, { d: dz(0.022) });
  popper(L, s2, S, A.makeSepatuBataSign(0.13), 0.14, 0, 0.025, { d: dz(0.025) });

  // Midground tier
  popper(L, s2, S, A.makeTextileRolls(0.16), -0.12, 0, 0.075, { d: dz(0.075) });
  popper(L, s2, S, A.makeVintageCameraDisplay(0.16), 0.11, 0, 0.078, { d: dz(0.078) });

  // Hero Action Zone: Steaming Gang Kelinci Noodles & Master Tailor
  popper(L, s2, S, A.makeGangKelinciNoodles(0.14), 0.01, 0, 0.115, { d: dz(0.115), sway: 0.008 });
  const sholesActor = makeSholesActor(0.175);
  sholesActor.root.position.set(-0.06, 0, 0.14);
  S.add(sholesActor.root);
  ex.sholesActor = sholesActor;

  // Foreground tier
  popper(L, s2, S, A.makeScatteredKeycap('B', 0.030, false), -0.14, 0, 0.23, { d: dz(0.23) });
  popper(L, s2, S, A.makeScatteredKeycap('A', 0.030, false), -0.04, 0, 0.25, { d: dz(0.25) });
  popper(L, s2, S, A.makeScatteredKeycap('T', 0.030, false), 0.06, 0, 0.24, { d: dz(0.24) });
  popper(L, s2, S, A.makeScatteredKeycap('A', 0.030, false), 0.14, 0, 0.26, { d: dz(0.26) });

  // ==========================================================================
  // Spread 3: Revitalisasi 2027+ "Myeongdong of Jakarta" (63.8s - 93.0s)
  // ==========================================================================
  const s3 = 3;
  // Background restored gateway & festoon bistro lights
  popper(L, s3, S, A.makeMyeongdongArcadeGate(0.24), 0.0, 0, 0.022, { d: dz(0.022) });

  // Midground: Myeongdong Street Food Cart & MRT Harmoni Wayfinding Totem
  popper(L, s3, S, A.makeStreetFoodCart(0.17), 0.11, 0, 0.075, { d: dz(0.075) });
  popper(L, s3, S, A.makeMrtDirectionPylon(0.16), -0.13, 0, 0.078, { d: dz(0.078) });

  // Hero Action Zone: Live Acoustic Busking Stage
  popper(L, s3, S, A.makeBuskingStage(0.16), -0.01, 0, 0.12, { d: dz(0.12) });
  const youthActor = makeUserActor(0.165);
  youthActor.root.position.set(0.08, 0, 0.14);
  S.add(youthActor.root);
  ex.youthActor = youthActor;

  // Foreground tier
  popper(L, s3, S, A.makeScatteredKeycap('M', 0.030, false), -0.14, 0, 0.23, { d: dz(0.23) });
  popper(L, s3, S, A.makeScatteredKeycap('R', 0.030, false), -0.04, 0, 0.25, { d: dz(0.25) });
  popper(L, s3, S, A.makeScatteredKeycap('T', 0.030, false), 0.06, 0, 0.24, { d: dz(0.24) });
  popper(L, s3, S, A.makeScatteredKeycap('+', 0.030, false), 0.14, 0, 0.26, { d: dz(0.26) });

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
    const ang = (1 - u) * (Math.PI / 2) * r.dir;
    r.g.rotation.x = ang;
    r.g.visible = u > 0.001;

    if (r.sway && u > 0.5) {
      r.g.rotation.z = Math.sin(t * 1.8 + r.ph) * r.sway;
    }
  }

  // --- Historical Actor (Spread 0) ---
  if (ex.userActor) {
    const uVis = t < FOLD[0];
    ex.userActor.root.visible = uVis;
    ex.userActor.shadow.visible = uVis;
    if (uVis) {
      const breathU = Math.sin(t * 3.2);
      ex.userActor.body.scale.set(1.0 - 0.015 * breathU, 1.0 + 0.02 * breathU, 1.0);
      ex.userActor.body.rotation.z = Math.sin(t * 1.4) * 0.025;
      ex.userActor.body.position.y = Math.sin(t * 3.2) * 0.001;

      const blinkU = (Math.sin(t * 2.8) > 0.94 || (t % 5.5 > 5.3)) ? 1 : 0;
      const mood = t > 20.0 ? 'puzzled' : 'typing';
      const isSpeaking = (t > 2.0 && t < 9.0) || (t > 20.5 && t < 28.0);
      const mouthOpen = isSpeaking ? (0.35 + 0.5 * Math.abs(Math.sin(t * 14.0))) : 0.0;
      ex.userActor.pose({ mood, blink: blinkU, mouthOpen });
    }
  }

  // --- Master Bespoke Tailor Actor (Spread 2) ---
  if (ex.sholesActor) {
    const sVis = t >= RISE[2] && t < FOLD[2];
    ex.sholesActor.root.visible = sVis;
    ex.sholesActor.shadow.visible = sVis;
    if (sVis) {
      const breathS = Math.sin(t * 2.6);
      ex.sholesActor.body.scale.set(1.0 - 0.016 * breathS, 1.0 + 0.022 * breathS, 1.0);
      ex.sholesActor.body.rotation.z = Math.sin(t * 1.3) * 0.028;
      ex.sholesActor.body.position.y = Math.sin(t * 2.6) * 0.001;

      const blinkS = (Math.sin(t * 3.1) > 0.94 || (t % 6.0 > 5.8)) ? 1 : 0;
      const isSpeaking = t > 44.0 && t < 54.0;
      const mouthOpen = isSpeaking ? (0.45 + 0.5 * Math.abs(Math.sin(t * 15.0))) : 0.0;
      ex.sholesActor.pose({ mood: 'working', blink: blinkS, mouthOpen });
    }
  }

  // --- Modern Urban Youth Actor (Spread 3: Myeongdong) ---
  if (ex.youthActor) {
    const yVis = t >= RISE[3] && t < FOLD[3];
    ex.youthActor.root.visible = yVis;
    ex.youthActor.shadow.visible = yVis;
    if (yVis) {
      const breathT = Math.sin(t * 2.9);
      ex.youthActor.body.scale.set(1.0 - 0.014 * breathT, 1.0 + 0.018 * breathT, 1.0);
      ex.youthActor.body.rotation.z = Math.sin(t * 1.5) * 0.02;
      ex.youthActor.body.position.y = Math.sin(t * 3.2) * 0.001;
      const blinkT = Math.sin(t * 3.5) > 0.94 ? 1 : 0;
      const isSpeaking = t > 74.0 && t < 84.0;
      ex.youthActor.pose({ mood: 'typing', blink: blinkT, mouthOpen: isSpeaking ? 0.35 : 0 });
    }
  }
}
