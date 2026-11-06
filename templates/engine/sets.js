// Four pop-up spreads with strict 5-phase lifecycle state machine (anti-clipping)
import * as THREE from 'three';
import * as A from './art.js';
import { cv, paperFill, INK, sh, smoothOpen, GRAIN } from './paper.js';
import { mulberry, clamp, lerp, seg, back, ss, eio, eo, TAU } from './lib.js';
import { BW, BD, texOf } from './book.js';
import { cutMesh, blobShadow } from './cutmesh.js';
import { OPEN, TURNS, CLOSE } from './story.js';

const PW = 2048, PH = Math.round(2048 * BD / BW);
const gx = xm => (xm / BW + .5) * PW, gz = zm => zm / BD * PH;

// When each spread appears / folds away
export const RISE = [OPEN[0] + 1.2, TURNS[0][1] - 0.2, TURNS[1][1] - 0.2, TURNS[2][1] - 0.2];
export const FOLD = [TURNS[0][0], TURNS[1][0], TURNS[2][0], CLOSE[0]];

function page(fn) {
  const c = cv(PW, PH), x = c.getContext('2d');
  fn(x);
  x.save();
  x.globalAlpha = 0.5;
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

export function pages() {
  const P = {};

  // Spread 0: Modern airliner cabin interior floor & clouds
  P.sky0 = page(x => {
    grad(x, [[0, '#3182ce'], [0.7, '#90cdf4'], [1, '#ebf8ff']]);
    // Soft paper clouds
    x.fillStyle = 'rgba(255,255,255,0.7)';
    for (let i = 0; i < 6; i++) {
      const cx = (i * 350 + 120) % PW, cy = 180 + (i % 3) * 120;
      x.beginPath();
      x.arc(cx, cy, 140, 0, TAU);
      x.arc(cx + 90, cy - 30, 160, 0, TAU);
      x.arc(cx + 180, cy, 130, 0, TAU);
      x.fill();
    }
  });
  P.ground0 = page(x => {
    grad(x, [[0, '#2d3748'], [1, '#1a202c']]); // Cabin carpet
    // Carpet aisle runner stripes
    x.fillStyle = '#4a5568';
    x.fillRect(PW * 0.42, 0, PW * 0.16, PH);
    x.strokeStyle = '#e2e8f0';
    x.lineWidth = 4;
    x.strokeRect(PW * 0.42, 0, PW * 0.16, PH);
  });

  // Spread 1: 1954 British Aerospace Hangar & Comet Blueprint
  P.sky1 = page(x => {
    grad(x, [[0, '#1e3a8a'], [0.7, '#2563eb'], [1, '#3b82f6']]);
    // Blueprint grid
    x.strokeStyle = 'rgba(255,255,255,0.15)';
    x.lineWidth = 2;
    for (let i = 0; i < PW; i += 60) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, PH); x.stroke(); }
    for (let j = 0; j < PH; j += 60) { x.beginPath(); x.moveTo(0, j); x.lineTo(PW, j); x.stroke(); }
  });
  P.ground1 = page(x => {
    grad(x, [[0, '#172554'], [1, '#0f172a']]);
    // Drafting table surface
    x.fillStyle = 'rgba(255,255,255,0.08)';
    x.fillRect(60, 60, PW - 120, PH - 120);
    x.strokeStyle = 'rgba(255,255,255,0.3)';
    x.lineWidth = 4;
    x.strokeRect(60, 60, PW - 120, PH - 120);
  });

  // Spread 2: Laboratory & Exploded Diagram Grid
  P.sky2day = page(x => {
    grad(x, [[0, '#0f172a'], [0.6, '#1e293b'], [1, '#334155']]);
    // Pressure flow vectors
    x.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    x.lineWidth = 3;
    for (let y = 100; y < PH - 100; y += 80) {
      x.beginPath();
      x.moveTo(100, y);
      x.lineTo(PW - 100, y);
      x.stroke();
    }
  });
  P.sky2night = P.sky2day;
  P.ground2 = page(x => {
    grad(x, [[0, '#0f172a'], [1, '#020617']]);
  });

  // Spread 3: High-Altitude Sunset & Golden Horizon
  P.sky3 = page(x => {
    grad(x, [[0, '#4338ca'], [0.4, '#d97706'], [0.75, '#f59e0b'], [1, '#fef3c7']]);
    // Golden sun glowing on the horizon
    const g = x.createRadialGradient(PW * 0.7, PH * 0.55, 10, PW * 0.7, PH * 0.55, 600);
    g.addColorStop(0, 'rgba(255, 243, 196, 0.95)');
    g.addColorStop(0.3, 'rgba(251, 191, 36, 0.6)');
    g.addColorStop(1, 'rgba(251, 191, 36, 0)');
    x.fillStyle = g;
    x.fillRect(0, 0, PW, PH);
  });
  P.ground3 = page(x => {
    grad(x, [[0, '#78350f'], [1, '#451a03']]);
  });

  return P;
}

// Build 3D Pop-up Sets
export function buildSets(book) {
  const L = []; // List of pop-up elements

  // 1. Spread 0: Modern Cabin Oval Window
  const cWin0 = cv(A.WIN_W, A.WIN_H);
  A.drawCabinWindow(cWin0.getContext('2d'), { holeZoom: 1.0, glowHole: true });
  const mWin0 = cutMesh({ c: cWin0, w: 0.18, h: 0.22, ax: 0.5, ay: 0.96 });
  mWin0.position.set(0.04, 0, 0.16);
  mWin0.rotation.x = -Math.PI / 2;
  book.stage.add(mWin0);
  L.push({ spread: 0, mesh: mWin0 });

  // 2. Spread 1: Comet Jet Fuselage & Stress Fracture
  const cComet = cv(A.COMET_W, A.COMET_H);
  A.drawCometFuselage(cComet.getContext('2d'), { stressAlpha: 1.0, crackProgress: 0.5 });
  const mComet = cutMesh({ c: cComet, w: 0.32, h: 0.20, ax: 0.5, ay: 0.88 });
  mComet.position.set(-0.02, 0, 0.15);
  mComet.rotation.x = -Math.PI / 2;
  mComet.visible = false;
  book.stage.add(mComet);
  L.push({ spread: 1, mesh: mComet });

  // 3. Spread 2: 3-Layer Exploded Window (Outer, Middle with Breather, Inner)
  const cOut = cv(A.EXP_W, A.EXP_H); A.drawExplodedPane(cOut.getContext('2d'), 'outer');
  const cMid = cv(A.EXP_W, A.EXP_H); A.drawExplodedPane(cMid.getContext('2d'), 'middle');
  const cInn = cv(A.EXP_W, A.EXP_H); A.drawExplodedPane(cInn.getContext('2d'), 'inner');

  const mOut = cutMesh({ c: cOut, w: 0.18, h: 0.14, ax: 0.5, ay: 0.94 });
  const mMid = cutMesh({ c: cMid, w: 0.18, h: 0.14, ax: 0.5, ay: 0.94 });
  const mInn = cutMesh({ c: cInn, w: 0.18, h: 0.14, ax: 0.5, ay: 0.94 });

  const expGroup = new THREE.Group();
  mOut.position.set(0, 0, 0.05);
  mMid.position.set(0, 0, 0.0);
  mInn.position.set(0, 0, -0.05);
  expGroup.add(mOut); expGroup.add(mMid); expGroup.add(mInn);
  expGroup.position.set(0.0, 0, 0.15);
  expGroup.rotation.x = -Math.PI / 2;
  expGroup.visible = false;
  book.stage.add(expGroup);
  L.push({ spread: 2, mesh: expGroup, mOut, mMid, mInn });

  // 4. Spread 3: Hero Window with Sunset View
  const cWin3 = cv(A.WIN_W, A.WIN_H);
  A.drawCabinWindow(cWin3.getContext('2d'), { holeZoom: 1.2, glowHole: false });
  const mWin3 = cutMesh({ c: cWin3, w: 0.20, h: 0.24, ax: 0.5, ay: 0.96 });
  mWin3.position.set(0.02, 0, 0.16);
  mWin3.rotation.x = -Math.PI / 2;
  mWin3.visible = false;
  book.stage.add(mWin3);
  L.push({ spread: 3, mesh: mWin3 });

  return { L };
}

// 5-Phase Lifecycle Update (Guarantees zero clipping during page sweeps)
export function updatePops(L, t, curSpread, turnK = 0) {
  for (const item of L) {
    const s = item.spread;
    const m = item.mesh;

    if (s < curSpread) {
      m.visible = false;
      continue;
    }
    if (s > curSpread) {
      m.visible = false;
      continue;
    }

    // Active spread:
    if (turnK > 0) {
      // Turn in progress!
      if (turnK < 0.15) {
        // PRE_TURN_FOLD: fold flat into spine
        const foldK = turnK / 0.15;
        m.visible = true;
        m.rotation.x = -Math.PI / 2 * ss(foldK);
      } else {
        // SWEEP_HIDDEN: hide completely so turning leaf cannot collide!
        m.visible = false;
      }
    } else {
      // Spread is stationary
      const riseT = RISE[s];
      if (t < riseT) {
        m.visible = false;
        m.rotation.x = -Math.PI / 2;
      } else {
        const k = back(seg(t, riseT, riseT + 0.7), 1.3);
        m.visible = k > 0.002;
        m.rotation.x = -Math.PI / 2 * (1 - k);
      }
    }

    // Animate exploded layers pull-apart during Shot 14
    if (s === 2 && item.mOut && item.mMid && item.mInn) {
      const sep = lerp(0.02, 0.065, ss(seg(t, 58.5, 63.5)));
      item.mOut.position.z = sep;
      item.mMid.position.z = 0;
      item.mInn.position.z = -sep;
    }
  }
}
