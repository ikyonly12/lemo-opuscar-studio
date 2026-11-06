// Dynamic Multi-Tiered Paper Sets & Spreads for The Hidden Geometry of QWERTY
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

  // ----- Spread 0: Modern Studio & Digital Keyboard Mystery -----
  // Sky 0: Architectural Blueprint Studio Wall
  P.sky0 = page(x => {
    grad(x, [[0, '#090d16'], [0.45, '#111827'], [1, '#1e293b']]);

    // Studio spotlight beam cone from upper-left
    const spot = x.createRadialGradient(PW * 0.25, PH * 0.2, 30, PW * 0.35, PH * 0.45, 900);
    spot.addColorStop(0, 'rgba(251, 191, 36, 0.18)');
    spot.addColorStop(0.6, 'rgba(56, 189, 248, 0.06)');
    spot.addColorStop(1, 'rgba(0, 0, 0, 0)');
    x.fillStyle = spot;
    x.fillRect(0, 0, PW, PH);

    // Fine blueprint grid lines
    x.strokeStyle = 'rgba(56, 189, 248, 0.07)';
    x.lineWidth = 1.5;
    for (let i = 80; i < PW; i += 60) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, PH); x.stroke(); }
    for (let j = 80; j < PH; j += 60) { x.beginPath(); x.moveTo(0, j); x.lineTo(PW, j); x.stroke(); }

    // Floating typographic glyph outlines
    x.fillStyle = 'rgba(248, 250, 252, 0.05)';
    x.font = '900 240px "Lilita One"';
    x.fillText('Q', PW * 0.12, PH * 0.55);
    x.fillText('W', PW * 0.45, PH * 0.40);
    x.fillText('E', PW * 0.78, PH * 0.60);

    // Elegant header plaque
    x.fillStyle = 'rgba(15, 23, 42, 0.7)';
    x.beginPath(); x.roundRect(PW / 2 - 420, 60, 840, 90, 16); x.fill();
    x.strokeStyle = '#38bdf8'; x.lineWidth = 3; x.stroke();
    x.fillStyle = '#f8fafc'; x.font = '700 42px "Lilita One"'; x.textAlign = 'center';
    x.fillText('MISTERI TATA LETAK KEYBOARD', PW / 2, 120);
  }, 1);

  // Ground 0: Warm Walnut Drafting Desk & Cutting Mat
  P.ground0 = page(x => {
    // Rich walnut wood surface
    grad(x, [[0, '#292524'], [0.4, '#1c1917'], [1, '#0c0a09']]);

    // Woodgrain horizontal streaks
    const R = mulberry(5);
    for (let i = 0; i < PH; i += 4) {
      x.fillStyle = `rgba(0,0,0,${0.04 + R() * 0.07})`;
      x.fillRect(0, i, PW, 1.4);
    }

    // Cutting Mat Inlay (Dark forest green with gold centimeter grid)
    const mx = 120, my = 100, mw = PW - 240, mh = PH - 200;
    x.fillStyle = '#064e3b';
    x.beginPath(); x.roundRect(mx, my, mw, mh, 16); x.fill();
    x.strokeStyle = '#047857'; x.lineWidth = 6; x.stroke();

    // Centimeter grid on mat
    x.strokeStyle = 'rgba(234, 179, 8, 0.16)';
    x.lineWidth = 1.5;
    for (let gx = mx + 40; gx < mx + mw; gx += 40) { x.beginPath(); x.moveTo(gx, my); x.lineTo(gx, my + mh); x.stroke(); }
    for (let gy = my + 40; gy < my + mh; gy += 40) { x.beginPath(); x.moveTo(mx, gy); x.lineTo(mx + mw, gy); x.stroke(); }

    // Brass metal ruler along bottom edge
    x.fillStyle = '#d97706';
    x.fillRect(mx + 40, my + mh - 50, mw - 80, 40);
    x.strokeStyle = '#78350f'; x.lineWidth = 2; x.strokeRect(mx + 40, my + mh - 50, mw - 80, 40);
    for (let rx = mx + 50; rx < mx + mw - 50; rx += 15) {
      x.beginPath(); x.moveTo(rx, my + mh - 50); x.lineTo(rx, my + mh - ((rx % 75 === 0) ? 25 : 38)); x.stroke();
    }

    // Pencil question sketch watermark
    x.fillStyle = 'rgba(255, 255, 255, 0.08)';
    x.font = 'italic 700 36px "Fredoka"';
    x.textAlign = 'left';
    x.fillText('Kenapa A-S-D-F dan bukan A-B-C-D?', mx + 60, my + 70);
  }, 2);

  // ----- Spread 1: 1873 Victorian Milwaukee Machine Shop -----
  // Sky 1: Red Brick Victorian Factory Wall & Sunlit Arched Windows
  P.sky1 = page(x => {
    // Red-ochre industrial brick wall
    grad(x, [[0, '#311003'], [0.5, '#451a03'], [1, '#291102']]);

    // Brick mortar course lines
    const bh = 28, bw = 70;
    x.strokeStyle = 'rgba(0, 0, 0, 0.4)'; x.lineWidth = 3;
    for (let y = 30; y < PH; y += bh) {
      x.beginPath(); x.moveTo(0, y); x.lineTo(PW, y); x.stroke();
      const off = ((y / bh) % 2) * (bw / 2);
      for (let bx = off; bx < PW; bx += bw) {
        x.beginPath(); x.moveTo(bx, y); x.lineTo(bx, y + bh); x.stroke();
      }
    }

    // Two massive arched factory window bays showing golden daylight
    const winCenters = [PW * 0.28, PW * 0.72];
    for (const cx of winCenters) {
      const cy = PH * 0.48, ww = 440, wh = 620;
      x.save();
      x.beginPath();
      x.moveTo(cx - ww / 2, cy + wh / 2);
      x.lineTo(cx - ww / 2, cy - wh * 0.2);
      x.arc(cx, cy - wh * 0.2, ww / 2, Math.PI, 0);
      x.lineTo(cx + ww / 2, cy + wh / 2);
      x.closePath();

      // Golden sky gradient
      const wg = x.createLinearGradient(0, cy - wh / 2, 0, cy + wh / 2);
      wg.addColorStop(0, '#fef08a');
      wg.addColorStop(0.5, '#fde047');
      wg.addColorStop(1, '#ffedd5');
      x.fillStyle = wg; x.fill();
      x.lineWidth = 14; x.strokeStyle = '#18181b'; x.stroke();

      // 16-pane cast iron window mullions
      x.strokeStyle = '#18181b'; x.lineWidth = 6;
      x.beginPath(); x.moveTo(cx - ww * 0.25, cy - wh * 0.35); x.lineTo(cx - ww * 0.25, cy + wh / 2); x.stroke();
      x.beginPath(); x.moveTo(cx, cy - wh * 0.5); x.lineTo(cx, cy + wh / 2); x.stroke();
      x.beginPath(); x.moveTo(cx + ww * 0.25, cy - wh * 0.35); x.lineTo(cx + ww * 0.25, cy + wh / 2); x.stroke();
      for (let k = -1; k <= 2; k++) {
        const hy = cy + k * (wh * 0.18);
        x.beginPath(); x.moveTo(cx - ww / 2 + 8, hy); x.lineTo(cx + ww / 2 - 8, hy); x.stroke();
      }
      x.restore();

      // Sunbeam shafts shining down into the shop
      x.save();
      x.globalCompositeOperation = 'lighter';
      const sbg = x.createLinearGradient(cx, cy - wh / 2, cx + 220, PH);
      sbg.addColorStop(0, 'rgba(254, 240, 138, 0.22)');
      sbg.addColorStop(1, 'rgba(254, 240, 138, 0)');
      x.fillStyle = sbg;
      x.beginPath();
      x.moveTo(cx - ww / 2, cy - wh * 0.2);
      x.lineTo(cx + ww / 2, cy - wh * 0.2);
      x.lineTo(cx + ww / 2 + 300, PH);
      x.lineTo(cx - ww / 2 + 100, PH);
      x.closePath();
      x.fill();
      x.restore();
    }

    // Cast-iron Foundry plaque in center
    x.fillStyle = '#1c1917';
    x.beginPath(); x.roundRect(PW / 2 - 380, 50, 760, 85, 14); x.fill();
    x.strokeStyle = '#d97706'; x.lineWidth = 4; x.stroke();
    x.fillStyle = '#f59e0b'; x.font = '700 34px "Lilita One"'; x.textAlign = 'center';
    x.fillText('C. LATHAM SHOLES & CO. - MILWAUKEE 1873', PW / 2, 105);
  }, 3);

  // Ground 1: Heavy Victorian Workshop Oak Planks & Blueprint Spread
  P.ground1 = page(x => {
    // Weathered rough-sawn oak flooring
    grad(x, [[0, '#451a03'], [0.45, '#291102'], [1, '#180a02']]);

    // Horizontal board joints
    const ph = 90;
    x.strokeStyle = 'rgba(0,0,0,0.6)'; x.lineWidth = 4;
    for (let y = ph; y < PH; y += ph) {
      x.beginPath(); x.moveTo(0, y); x.lineTo(PW, y); x.stroke();
      // Square iron nail heads
      for (let nx = 60; nx < PW; nx += 180) {
        x.fillStyle = '#0f172a'; x.fillRect(nx, y - 6, 8, 8);
      }
    }

    // Large drafting blueprint spread on the floor
    const bx = PW * 0.25, by = 120, bw = PW * 0.5, bh = PH - 240;
    x.fillStyle = '#1e3a8a';
    x.beginPath(); x.roundRect(bx, by, bw, bh, 12); x.fill();
    x.strokeStyle = '#60a5fa'; x.lineWidth = 3; x.stroke();

    // Blueprint circular basket radius diagram
    const cx = bx + bw / 2, cy = by + bh / 2;
    x.strokeStyle = 'rgba(255, 255, 255, 0.4)'; x.lineWidth = 2.5;
    x.beginPath(); x.arc(cx, cy, 140, 0, TAU); x.stroke();
    x.beginPath(); x.arc(cx, cy, 70, 0, TAU); x.stroke();
    for (let a = 0; a < TAU; a += Math.PI / 8) {
      x.beginPath();
      x.moveTo(cx + Math.cos(a) * 70, cy + Math.sin(a) * 70);
      x.lineTo(cx + Math.cos(a) * 140, cy + Math.sin(a) * 140);
      x.stroke();
    }
    x.fillStyle = '#f8fafc'; x.font = '700 22px "Lilita One"'; x.textAlign = 'center';
    x.fillText('RANCANGAN KERANJANG TUAS TIK MELINGKAR', cx, by + 45);
  }, 4);

  // ----- Spread 2: 1870s Western Union Telegraph Office & Matrix Lab -----
  // Sky 2: Victorian Tongue-and-Groove Wainscoting & Blackboard
  P.sky2 = page(x => {
    // Deep sage / telegraph dark green wall
    grad(x, [[0, '#042f2e'], [0.55, '#064e3b'], [1, '#134e4a']]);

    // Vertical tongue-and-groove wooden slats
    x.strokeStyle = 'rgba(0,0,0,0.25)'; x.lineWidth = 2;
    for (let i = 0; i < PW; i += 40) {
      x.beginPath(); x.moveTo(i, 0); x.lineTo(i, PH); x.stroke();
    }

    // Huge Classroom/Lab Blackboard in upper center
    const bx = PW * 0.15, by = 80, bw = PW * 0.7, bh = PH * 0.58;
    x.fillStyle = '#78350f'; // oak frame
    x.beginPath(); x.roundRect(bx - 16, by - 16, bw + 32, bh + 32, 16); x.fill();
    x.fillStyle = '#0f172a'; // dark slate
    x.beginPath(); x.roundRect(bx, by, bw, bh, 8); x.fill();

    // White chalk diagrams & digraph formulas
    x.fillStyle = '#f8fafc';
    x.font = '700 44px "Lilita One"'; x.textAlign = 'center';
    x.fillText('ANALISIS FREKUENSI DIGRAF BAHASA INGGRIS', bx + bw / 2, by + 65);

    // Letter pairs frequency bars
    const dig = [
      { p: 'T - H', pct: 0.92, col: '#ef4444' },
      { p: 'E - R', pct: 0.78, col: '#f59e0b' },
      { p: 'I - N', pct: 0.68, col: '#38bdf8' },
      { p: 'S - T', pct: 0.62, col: '#10b981' }
    ];
    let dy = by + 120;
    for (const d of dig) {
      x.fillStyle = '#f8fafc'; x.font = '700 28px "Fredoka"'; x.textAlign = 'left';
      x.fillText(d.p, bx + 60, dy + 22);
      x.fillStyle = d.col;
      x.beginPath(); x.roundRect(bx + 180, dy, (bw - 280) * d.pct, 28, 6); x.fill();
      dy += 48;
    }

    // Chalk separation theorem
    x.fillStyle = '#fef08a'; x.font = 'italic 700 28px "IM Fell English"'; x.textAlign = 'center';
    x.fillText('Aturan Anti-Macet: Pisahkan Pasangan Huruf Sering Bersanding Sejauh Mungkin!', bx + bw / 2, by + bh - 35);
  }, 5);

  // Ground 2: Western Union Operator Desk & Ticker-Tape Trails
  P.ground2 = page(x => {
    // Rich dark forest felt and mahogany desk
    grad(x, [[0, '#064e3b'], [0.5, '#022c22'], [1, '#1c1917']]);

    // Embossed gold border
    x.strokeStyle = '#d97706'; x.lineWidth = 6;
    x.strokeRect(80, 80, PW - 160, PH - 160);

    // Sprawling white telegram forms printed on desk
    x.fillStyle = '#fef3c7';
    x.save(); x.translate(140, 140); x.rotate(-0.04);
    x.beginPath(); x.roundRect(0, 0, 480, 320, 8); x.fill();
    x.strokeStyle = '#b45309'; x.lineWidth = 3; x.stroke();
    x.fillStyle = '#78350f'; x.font = '700 24px "Lilita One"';
    x.fillText('WESTERN UNION TELEGRAPH CO.', 25, 45);
    x.font = '500 16px "Fredoka"';
    x.fillText('DISPATCH: QWERTY LAYOUT APPROVED FOR FAST COPYING', 25, 80);
    x.restore();

    // Curling paper Morse ticker-tape snaking across the right side
    x.strokeStyle = '#ffffff'; x.lineWidth = 18; x.lineCap = 'round';
    x.beginPath();
    x.moveTo(PW * 0.45, PH * 0.4);
    x.bezierCurveTo(PW * 0.6, PH * 0.2, PW * 0.75, PH * 0.6, PW - 120, PH * 0.35);
    x.stroke();

    // Morse dots and dashes in black ink
    x.strokeStyle = '#0f172a'; x.lineWidth = 4;
    x.beginPath();
    x.moveTo(PW * 0.52, PH * 0.32); x.lineTo(PW * 0.55, PH * 0.30);
    x.moveTo(PW * 0.68, PH * 0.45); x.lineTo(PW * 0.72, PH * 0.50);
    x.stroke();
  }, 6);

  // ----- Spread 3: Global Digital Epilogue & Vintage Patent Archive -----
  // Sky 3: Aged Cream Parchment & Technical Patent Schematic
  P.sky3 = page(x => {
    // Warm ivory parchment
    paperFill(x, PW, PH, '#fdfbf7', 41, 0.05);

    // Aged tea vignette around edges
    const vg = x.createRadialGradient(PW / 2, PH / 2, PH * 0.35, PW / 2, PH / 2, PH * 0.75);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(180, 130, 80, 0.22)');
    x.fillStyle = vg; x.fillRect(0, 0, PW, PH);

    // U.S. Patent header
    x.fillStyle = '#291102';
    x.font = 'italic 700 38px "IM Fell English"'; x.textAlign = 'center';
    x.fillText('UNITED STATES PATENT OFFICE.', PW / 2, 85);
    x.font = '700 24px "Fredoka"';
    x.fillText('C. LATHAM SHOLES, OF MILWAUKEE, WISCONSIN.', PW / 2, 125);
    x.font = 'italic 20px "IM Fell English"';
    x.fillText('Improvement in Type-Writing Machines — Patented April 1878', PW / 2, 155);

    // Sepia technical schematic elevation of the typewriter mechanism
    const sx = PW / 2, sy = PH * 0.55;
    x.strokeStyle = 'rgba(80, 50, 30, 0.5)'; x.lineWidth = 3;
    x.strokeRect(sx - 340, sy - 140, 680, 280);
    x.beginPath(); x.arc(sx, sy, 110, 0, TAU); x.stroke();
    for (let a = 0; a < TAU; a += Math.PI / 10) {
      x.beginPath();
      x.moveTo(sx + Math.cos(a) * 40, sy + Math.sin(a) * 40);
      x.lineTo(sx + Math.cos(a) * 110, sy + Math.sin(a) * 110);
      x.stroke();
    }

    // Official gold patent seal stamp
    x.fillStyle = '#d97706';
    x.beginPath(); x.arc(PW * 0.82, PH * 0.68, 65, 0, TAU); x.fill();
    x.strokeStyle = '#b45309'; x.lineWidth = 5; x.stroke();
    x.fillStyle = '#1c1917'; x.font = '700 18px "Lilita One"';
    x.fillText('SEAL 1878', PW * 0.82, PH * 0.69);
  }, 7);

  // Ground 3: Archival Manuscript & Flowing "The End" Calligraphy
  P.ground3 = page(x => {
    // Rich archival parchment
    paperFill(x, PW, PH, '#fdfbf7', 43, 0.05);

    // Double engraved Victorian filigree border
    x.strokeStyle = '#291102'; x.lineWidth = 5;
    x.strokeRect(70, 70, PW - 140, PH - 140);
    x.lineWidth = 2;
    x.strokeRect(85, 85, PW - 170, PH - 170);

    // Corner rosettes
    const corners = [[85, 85], [PW - 85, 85], [85, PH - 85], [PW - 85, PH - 85]];
    for (const [cx, cy] of corners) {
      x.beginPath(); x.arc(cx, cy, 14, 0, TAU); x.fillStyle = '#291102'; x.fill();
    }

    // Masterpiece "The End" Calligraphy in dark iron-gall ink
    x.fillStyle = '#1c1917';
    x.font = 'italic 700 210px "IM Fell English"';
    x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText('The End', PW / 2, gz(0.18));

    // Elegant flourish swash below
    x.strokeStyle = '#1c1917'; x.lineWidth = 4;
    x.beginPath();
    x.moveTo(PW * 0.34, gz(0.24));
    x.bezierCurveTo(PW * 0.44, gz(0.22), PW * 0.47, gz(0.26), PW * 0.5, gz(0.24));
    x.bezierCurveTo(PW * 0.53, gz(0.22), PW * 0.56, gz(0.26), PW * 0.66, gz(0.24));
    x.stroke();
    x.beginPath(); x.arc(PW * 0.5, gz(0.24), 7, 0, TAU); x.fill();

    // Archival footnote
    x.font = '500 24px "Fredoka"';
    x.fillStyle = '#57534e';
    x.fillText('1873 – 2026: Dari Solusi Macet Tuas Besi Menjadi Memori Otot Abadi', PW / 2, gz(0.28));
  }, 8);

  return P;
}

// ============================================================================
// 2. Multi-Tiered Pop-Up Physics & Diorama Construction
// ============================================================================
// dir: -1 folds backward (face up when lying flat), +1 folds forward (face down)
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
  const up = r.pop ? back(seg(t, t0, t0 + 0.55), 1.6) : (t >= t0 ? 1 : 0);
  const dn = 1 - ss(seg(t, tf, tf + 0.4));
  return Math.min(up, dn);
}

export function buildSets(book) {
  const L = []; // all pop-up pieces
  const S = book.stage, K = book.sky;
  const ex = {};

  const dz = z => (0.3 - z) * 1.1; // pop up sequentially back-to-front

  // ==========================================================================
  // Spread 0: Modern Studio & Digital Keyboard Mystery (0.0s – 24.8s)
  // ==========================================================================
  const s0 = 0;

  // Background wall tier (z ~ 0.015 - 0.04)
  popper(L, s0, S, A.makeStudioBookshelf(0.22), -0.14, 0, 0.018, { d: dz(0.018) });
  popper(L, s0, S, A.makeStickyNotesBoard(0.16), 0.13, 0, 0.022, { d: dz(0.022) });

  // Suspended on thread from book.sky
  {
    const gBulb = new THREE.Group();
    const itBulb = A.makeIdeaBulb(0.11);
    gBulb.add(cutMesh(itBulb));
    const th = thread(0.22);
    th.position.set(0, 0, -0.0004);
    gBulb.add(th);
    gBulb.position.set(-0.02, 0.32, 0.03);
    K.add(gBulb);
    ex.ideaBulb = gBulb;
  }

  // Midground tier (z ~ 0.06 - 0.10)
  popper(L, s0, S, A.makeDraftingLamp(0.18), -0.16, 0, 0.075, { d: dz(0.075), sway: 0.01 });

  // Hero Action Zone (z ~ 0.12 - 0.16)
  // Smartphone Pop-Up
  const cPhone = A.makeSmartphone(520, 900);
  ex.phone = popper(L, s0, S, { c: cPhone, w: 0.17, h: 0.24, ax: 0.5, ay: 0.96 }, 0.07, 0, 0.12, { d: dz(0.12) });

  // Modern Tech Typist Actor
  const userActor = makeUserActor(0.165);
  userActor.root.position.set(-0.08, 0, 0.14);
  S.add(userActor.root);
  ex.userActor = userActor;

  // Foreground tier (z ~ 0.20 - 0.26)
  popper(L, s0, S, A.makeDeskCoffeeAndTools(0.075), -0.15, 0, 0.22, { d: dz(0.22) });
  // Scattered modern chiclet keys
  popper(L, s0, S, A.makeScatteredKeycap('Q', 0.028, false), -0.04, 0, 0.24, { d: dz(0.24) });
  popper(L, s0, S, A.makeScatteredKeycap('W', 0.028, false), 0.02, 0, 0.25, { d: dz(0.25) });
  popper(L, s0, S, A.makeScatteredKeycap('E', 0.028, false), 0.12, 0, 0.23, { d: dz(0.23) });
  popper(L, s0, S, A.makeScatteredKeycap('A', 0.028, false), 0.17, 0, 0.26, { d: dz(0.26) });

  // ==========================================================================
  // Spread 1: 1873 Victorian Milwaukee Machine Shop (27.2s – 50.4s)
  // ==========================================================================
  const s1 = 1;

  // Background wall tier (z ~ 0.014 - 0.035)
  popper(L, s1, S, A.makeFactoryBrickArch(0.26), -0.02, 0, 0.014, { d: dz(0.014) });
  popper(L, s1, S, A.makePatentScrollWall(0.20), 0.15, 0, 0.026, { d: dz(0.026) });

  // Suspended on thread from book.sky
  {
    const gLantern = new THREE.Group();
    const itLantern = A.makeGaslightLantern(0.17);
    gLantern.add(cutMesh(itLantern));
    const th = thread(0.24);
    th.position.set(0, 0, -0.0004);
    gLantern.add(th);
    gLantern.position.set(-0.16, 0.35, 0.03);
    K.add(gLantern);
    ex.gasLantern = gLantern;
  }

  // Midground tier (z ~ 0.06 - 0.10)
  popper(L, s1, S, A.makeMachinistWorkbench(0.15), 0.12, 0, 0.075, { d: dz(0.075) });

  // Hero Action Zone (z ~ 0.12 - 0.16)
  // Sholes Early Typewriter Basket
  const cBasket = A.makeTypewriterBasket(640, 600);
  ex.basket = popper(L, s1, S, { c: cBasket, w: 0.23, h: 0.21, ax: 0.5, ay: 0.94 }, 0.07, 0, 0.12, { d: dz(0.12) });

  // Christopher Latham Sholes Actor
  const sholesActor = makeSholesActor(0.175);
  sholesActor.root.position.set(-0.10, 0, 0.15);
  S.add(sholesActor.root);
  ex.sholesActor = sholesActor;

  // Foreground tier (z ~ 0.20 - 0.26)
  popper(L, s1, S, A.makeScatteredKeycap('A', 0.032, true), -0.16, 0, 0.22, { d: dz(0.22) });
  popper(L, s1, S, A.makeScatteredKeycap('B', 0.032, true), -0.08, 0, 0.25, { d: dz(0.25) });
  popper(L, s1, S, A.makeScatteredKeycap('C', 0.032, true), 0.04, 0, 0.24, { d: dz(0.24) });
  popper(L, s1, S, A.makeScatteredKeycap('D', 0.032, true), 0.15, 0, 0.25, { d: dz(0.25) });

  // ==========================================================================
  // Spread 2: Digraph Frequency Matrix & Morse Telegraph (52.8s – 75.7s)
  // ==========================================================================
  const s2 = 2;

  // Background wall tier (z ~ 0.015 - 0.035)
  popper(L, s2, S, A.makeTelegraphSwitchboard(0.24), -0.11, 0, 0.018, { d: dz(0.018) });
  popper(L, s2, S, A.makeDigraphBlackboard(0.18), 0.12, 0, 0.024, { d: dz(0.024) });

  // Midground tier (z ~ 0.06 - 0.10)
  popper(L, s2, S, A.makeTelegraphPole(0.26), -0.17, 0, 0.075, { d: dz(0.075), sway: 0.015 });
  popper(L, s2, S, A.makeMorseTickerDesk(0.14), 0.14, 0, 0.082, { d: dz(0.082) });

  // Hero Action Zone (z ~ 0.12 - 0.16)
  // Digraph Blueprint Matrix Board
  const cMatrix = A.makeDigraphMatrix(640, 600);
  ex.matrix = popper(L, s2, S, { c: cMatrix, w: 0.22, h: 0.20, ax: 0.5, ay: 0.94 }, -0.07, 0, 0.12, { d: dz(0.12) });

  // Morse Telegraph Operator Actor
  const teleActor = makeTelegraphActor(0.165);
  teleActor.root.position.set(0.09, 0, 0.14);
  S.add(teleActor.root);
  ex.teleActor = teleActor;

  // Foreground tier (z ~ 0.20 - 0.26)
  popper(L, s2, S, A.makeScatteredKeycap('T', 0.032, true), -0.12, 0, 0.23, { d: dz(0.23) });
  popper(L, s2, S, A.makeScatteredKeycap('H', 0.032, true), 0.18, 0, 0.24, { d: dz(0.24) });

  // ==========================================================================
  // Spread 3: Global Digital Epilogue & Vintage Archive (78.1s – 104.5s)
  // ==========================================================================
  const s3 = 3;

  // Midground tier (z ~ 0.06 - 0.10)
  popper(L, s3, S, A.makeRemingtonPedestal(0.18), -0.14, 0, 0.065, { d: dz(0.065) });
  // Dvorak Comparison Plaque
  const cDvorak = A.makeDvorakComparison(640, 600);
  ex.dvorak = popper(L, s3, S, { c: cDvorak, w: 0.21, h: 0.20, ax: 0.5, ay: 0.95 }, 0.13, 0, 0.075, { d: dz(0.075) });

  // Hero Action Zone (z ~ 0.12 - 0.16)
  const cGlobal = A.makeGlobalFingers(640, 400);
  ex.global = popper(L, s3, S, { c: cGlobal, w: 0.24, h: 0.16, ax: 0.5, ay: 0.94 }, 0.0, 0, 0.13, { d: dz(0.13) });

  // Foreground tier (z ~ 0.20 - 0.26)
  popper(L, s3, S, A.makeScatteredKeycap('Q', 0.032, true), -0.15, 0, 0.24, { d: dz(0.24) });
  popper(L, s3, S, A.makeScatteredKeycap('Q', 0.028, false), 0.15, 0, 0.25, { d: dz(0.25) });

  return { L, ex };
}

// ============================================================================
// 3. Dynamic Frame Updates (Springs, Sway, Collisions)
// ============================================================================
export function updateSets(sets, t) {
  const { L, ex } = sets;

  // 1. Update all paper pop-up pieces with physical spring hinges
  for (const r of L) {
    const k = riseOf(r, t);
    r.g.visible = k > 0.001;
    if (r.g.visible) {
      // Paper hinge rotation: folds flat at angle (dir * PI/2), stands up at 0
      const angle = (1 - k) * (r.dir * Math.PI / 2);
      r.m.rotation.x = angle;
      if (r.sway) {
        r.m.rotation.z = Math.sin(t * 1.6 + r.ph) * r.sway * k;
      }
      if (r.upd) r.upd(r, t, k);
    }
  }

  // 2. Suspended props swaying gently
  if (ex.ideaBulb) {
    const s0vis = t >= RISE[0] && t < FOLD[0];
    ex.ideaBulb.visible = s0vis;
    if (s0vis) {
      ex.ideaBulb.rotation.z = Math.sin(t * 1.4) * 0.04;
    }
  }
  if (ex.gasLantern) {
    const s1vis = t >= RISE[1] && t < FOLD[1];
    ex.gasLantern.visible = s1vis;
    if (s1vis) {
      ex.gasLantern.rotation.z = Math.sin(t * 1.8) * 0.03;
    }
  }

  // 3. Actors visibility and poses
  const uVis = t >= RISE[0] && t < FOLD[0];
  ex.userActor.root.visible = uVis;
  ex.userActor.shadow.visible = uVis;
  if (uVis) {
    const blink = Math.sin(t * 4.2) > 0.94 ? 1 : 0;
    const mood = t > 13.0 && t < 18.5 ? 'puzzled' : 'typing';
    ex.userActor.pose({ mood, blink, mouthOpen: t > 13.4 && t < 18.0 ? 0.8 : 0.0 });
  }

  const sVis = t >= RISE[1] && t < FOLD[1];
  ex.sholesActor.root.visible = sVis;
  ex.sholesActor.shadow.visible = sVis;
  if (sVis) {
    const blink = Math.sin(t * 3.8) > 0.94 ? 1 : 0;
    const mood = t > 40.0 ? 'frustrated' : 'working';
    ex.sholesActor.pose({ mood, blink, mouthOpen: t > 48.0 && t < 50.2 ? 0.9 : 0.0 });
  }

  const teleVis = t >= RISE[2] && t < FOLD[2];
  ex.teleActor.root.visible = teleVis;
  ex.teleActor.shadow.visible = teleVis;
  if (teleVis) {
    const blink = Math.sin(t * 4.0) > 0.94 ? 1 : 0;
    ex.teleActor.pose({ mood: 'focused', blink, tapOffset: Math.sin(t * 22) * 0.003 });
  }
}
