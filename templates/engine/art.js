// All paper-cut illustrations for The Airplane Window Breather Hole
import { mulberry, TAU, clamp, lerp } from './lib.js';
import { cv, sh, blob, smoothClosed, smoothOpen, crescent, paperFill, INK, GRAIN, rr } from './paper.js';

const LW = 6;
const LW2 = 3.5;

// ============================================================================
// 1. Passenger Character (Multi-layer Papercraft Rig)
// ============================================================================
export const PASS_W = 600, PASS_H = 800;
export function drawPassenger(x, p = {}) {
  const { lean = 0, look = [0, 0], blink = 0, arm = 'point', mouth = 'o' } = p;
  x.clearRect(0, 0, PASS_W, PASS_H);
  x.save();
  x.translate(300, 760);
  x.rotate(lean);
  x.translate(-300, -760);

  // Drop shadow behind body cutout for paper depth
  x.fillStyle = 'rgba(0,0,0,0.06)';
  x.beginPath();
  x.roundRect(195, 465, 210, 270, 28);
  x.fill();

  // 1. Torso: Navy Travel Jacket (Wool Texture)
  x.fillStyle = '#1e293b';
  x.beginPath();
  x.roundRect(200, 470, 200, 260, 26);
  x.fill();
  x.lineWidth = LW;
  x.strokeStyle = INK;
  x.stroke();

  // Jacket Lapels (Layered paper flaps)
  x.fillStyle = '#334155';
  x.beginPath();
  x.moveTo(230, 470);
  x.lineTo(270, 560);
  x.lineTo(250, 570);
  x.lineTo(220, 500);
  x.closePath();
  x.fill();
  x.lineWidth = 3;
  x.strokeStyle = INK;
  x.stroke();

  x.beginPath();
  x.moveTo(370, 470);
  x.lineTo(330, 560);
  x.lineTo(350, 570);
  x.lineTo(380, 500);
  x.closePath();
  x.fill();
  x.stroke();

  // Breast pocket + pocket square
  x.fillStyle = '#334155';
  x.fillRect(230, 580, 45, 8);
  x.fillStyle = '#f8fafc';
  x.beginPath();
  x.moveTo(240, 580); x.lineTo(252, 566); x.lineTo(262, 580);
  x.closePath();
  x.fill();

  // Brass buttons
  x.fillStyle = '#d97706';
  x.beginPath(); x.arc(300, 610, 5, 0, TAU); x.fill();
  x.beginPath(); x.arc(300, 660, 5, 0, TAU); x.fill();

  // 2. Shirt Collar & Crimson Tie
  x.fillStyle = '#f8fafc';
  x.beginPath();
  x.moveTo(270, 470); x.lineTo(300, 530); x.lineTo(330, 470);
  x.closePath();
  x.fill();
  x.lineWidth = 3;
  x.strokeStyle = INK;
  x.stroke();

  x.fillStyle = '#991b1b';
  x.beginPath();
  x.moveTo(292, 520); x.lineTo(308, 520); x.lineTo(314, 630); x.lineTo(300, 650); x.lineTo(286, 630);
  x.closePath();
  x.fill();
  x.lineWidth = 2.5;
  x.stroke();

  // 3. Neck
  x.fillStyle = '#fcd3a7';
  x.beginPath();
  x.roundRect(275, 430, 50, 55, 10);
  x.fill();
  x.lineWidth = 3;
  x.strokeStyle = INK;
  x.stroke();

  // 4. Head
  x.fillStyle = '#fde2c7';
  x.beginPath();
  x.ellipse(300, 345, 96, 112, 0, 0, TAU);
  x.fill();
  x.lineWidth = LW;
  x.strokeStyle = INK;
  x.stroke();

  // Cheeks (blush)
  x.fillStyle = 'rgba(239, 68, 68, 0.16)';
  x.beginPath(); x.ellipse(245, 375, 18, 10, 0, 0, TAU); x.fill();
  x.beginPath(); x.ellipse(355, 375, 18, 10, 0, 0, TAU); x.fill();

  // 5. Hair (Multi-layer dimensional cutouts, 100% solid seamless mass, zero gaps)
  // Layer 5A: Full Solid Base Hair Silhouette (covers top dome and side locks down to sideburns)
  x.fillStyle = '#2d1810';
  x.beginPath();
  x.moveTo(200, 340);
  x.quadraticCurveTo(192, 280, 196, 240);
  x.quadraticCurveTo(210, 195, 300, 195);
  x.quadraticCurveTo(390, 195, 404, 240);
  x.quadraticCurveTo(408, 280, 400, 340);
  x.quadraticCurveTo(390, 320, 385, 275);
  x.quadraticCurveTo(300, 250, 215, 275);
  x.quadraticCurveTo(210, 320, 200, 340);
  x.closePath();
  x.fill();
  x.lineWidth = LW;
  x.strokeStyle = INK;
  x.stroke();

  // Layer 5B: Forelock Paper Swatches (Neat stylish bangs well above eyebrows)
  x.fillStyle = '#452317';
  x.beginPath();
  x.moveTo(198, 270);
  x.quadraticCurveTo(245, 305, 290, 280);
  x.quadraticCurveTo(335, 310, 402, 270);
  x.quadraticCurveTo(300, 230, 198, 270);
  x.closePath();
  x.fill();
  x.lineWidth = 3.5;
  x.strokeStyle = '#2d1810';
  x.stroke();

  // Layer 5C: Hair Highlight Fringe Strands
  x.fillStyle = '#633924';
  x.beginPath();
  x.moveTo(245, 248);
  x.quadraticCurveTo(290, 266, 335, 245);
  x.quadraticCurveTo(290, 234, 245, 248);
  x.closePath();
  x.fill();

  // 6. Eyes (Expressive Paper Cut with Catchlights & Blinking)
  const exL = 265 + look[0] * 8, exR = 335 + look[0] * 8;
  const ey = 345 + look[1] * 8;
  const b = clamp(blink, 0, 1);
  const ry = Math.max(1.5, 15 * (1 - b));

  // Eyebrows
  x.lineWidth = 4;
  x.strokeStyle = '#2d1810';
  x.beginPath();
  if (mouth === 'o') {
    // Worried raised arch
    x.moveTo(245, 315); x.quadraticCurveTo(265, 305, 285, 318);
    x.moveTo(355, 315); x.quadraticCurveTo(335, 305, 315, 318);
  } else {
    x.moveTo(248, 322); x.quadraticCurveTo(268, 318, 285, 324);
    x.moveTo(352, 322); x.quadraticCurveTo(332, 318, 315, 324);
  }
  x.stroke();

  if (ry > 3) {
    // Sclera
    x.fillStyle = '#ffffff';
    x.beginPath(); x.ellipse(exL, ey, 14, ry, 0, 0, TAU); x.fill();
    x.beginPath(); x.ellipse(exR, ey, 14, ry, 0, 0, TAU); x.fill();
    x.lineWidth = 2; x.strokeStyle = INK;
    x.beginPath(); x.ellipse(exL, ey, 14, ry, 0, 0, TAU); x.stroke();
    x.beginPath(); x.ellipse(exR, ey, 14, ry, 0, 0, TAU); x.stroke();

    // Hazel Iris
    x.fillStyle = '#78350f';
    x.beginPath(); x.arc(exL, ey, 8 * (1 - b * 0.3), 0, TAU); x.fill();
    x.beginPath(); x.arc(exR, ey, 8 * (1 - b * 0.3), 0, TAU); x.fill();

    // Dark Pupil
    x.fillStyle = INK;
    x.beginPath(); x.arc(exL, ey, 5, 0, TAU); x.fill();
    x.beginPath(); x.arc(exR, ey, 5, 0, TAU); x.fill();

    // Catchlight Glints
    x.fillStyle = '#ffffff';
    x.beginPath(); x.arc(exL - 3, ey - 3, 2.5, 0, TAU); x.fill();
    x.beginPath(); x.arc(exR - 3, ey - 3, 2.5, 0, TAU); x.fill();
  } else {
    // Closed eye line
    x.lineWidth = 3;
    x.strokeStyle = INK;
    x.beginPath();
    x.moveTo(exL - 12, ey); x.quadraticCurveTo(exL, ey + 4, exL + 12, ey);
    x.moveTo(exR - 12, ey); x.quadraticCurveTo(exR, ey + 4, exR + 12, ey);
    x.stroke();
  }

  // Nose
  x.lineWidth = 3;
  x.strokeStyle = '#c28859';
  x.beginPath();
  x.moveTo(300, 345);
  x.quadraticCurveTo(308, 368, 296, 372);
  x.stroke();

  // 7. Mouth
  x.lineWidth = 4;
  x.strokeStyle = INK;
  x.beginPath();
  if (mouth === 'o') {
    x.fillStyle = '#7f1d1d';
    x.ellipse(300, 405, 14, 18, 0, 0, TAU);
    x.fill();
    x.stroke();
  } else if (mouth === 'smile') {
    x.arc(300, 395, 24, 0.2, Math.PI - 0.2);
    x.stroke();
  } else {
    x.moveTo(285, 405); x.lineTo(315, 405);
    x.stroke();
  }

  // 8. Articulated Paper Arm (Pointing towards window or resting)
  if (arm === 'point') {
    // Sleeve
    x.lineWidth = 32;
    x.strokeStyle = '#1e293b';
    x.beginPath();
    x.moveTo(380, 520);
    x.quadraticCurveTo(460, 480, 520, 435);
    x.stroke();

    // White shirt cuff
    x.lineWidth = 34;
    x.strokeStyle = '#f8fafc';
    x.beginPath();
    x.moveTo(512, 440);
    x.lineTo(522, 432);
    x.stroke();

    // Hand & Index Finger Pointing
    x.lineWidth = 3;
    x.strokeStyle = INK;
    x.fillStyle = '#fde2c7';
    // Palm
    x.beginPath(); x.arc(532, 428, 14, 0, TAU); x.fill(); x.stroke();
    // Index finger extending
    x.beginPath();
    x.roundRect(535, 416, 26, 12, 6);
    x.fill(); x.stroke();
  } else {
    // Resting arm
    x.lineWidth = 28;
    x.strokeStyle = '#1e293b';
    x.beginPath();
    x.moveTo(380, 520);
    x.quadraticCurveTo(410, 600, 390, 680);
    x.stroke();
  }

  x.restore();
}

// ============================================================================
// 2. Oval Airplane Passenger Window with Breather Hole
// ============================================================================
export const WIN_W = 800, WIN_H = 1000;
export function drawCabinWindow(x, p = {}) {
  const { holeZoom = 1.0, showFlow = false, glowHole = false } = p;
  x.clearRect(0, 0, WIN_W, WIN_H);

  // Outer Aircraft Fuselage Wall (Warm Off-white Cabin Plastic Panel)
  x.fillStyle = '#f1f5f9';
  x.beginPath();
  x.roundRect(40, 40, WIN_W - 80, WIN_H - 80, 60);
  x.fill();
  x.lineWidth = LW;
  x.strokeStyle = '#94a3b8';
  x.stroke();

  // Molded Bevel Ring
  x.fillStyle = '#e2e8f0';
  x.beginPath();
  x.roundRect(140, 120, WIN_W - 280, WIN_H - 240, 190);
  x.fill();
  x.lineWidth = 4;
  x.strokeStyle = '#cbd5e1';
  x.stroke();

  // Oval Window Inner Reveal
  x.fillStyle = '#cbd5e1';
  x.beginPath();
  x.roundRect(170, 150, WIN_W - 340, WIN_H - 300, 160);
  x.fill();
  x.lineWidth = 5;
  x.strokeStyle = INK;
  x.stroke();

  // Glass Pane: Sky View
  const g = x.createLinearGradient(0, 180, 0, WIN_H - 180);
  g.addColorStop(0, '#1d4ed8');
  g.addColorStop(0.55, '#60a5fa');
  g.addColorStop(1, '#dbeafe');
  x.fillStyle = g;
  x.beginPath();
  x.roundRect(190, 170, WIN_W - 380, WIN_H - 340, 140);
  x.fill();

  // Cloud layers outside window
  x.fillStyle = 'rgba(255, 255, 255, 0.85)';
  x.beginPath();
  x.arc(310, 470, 75, 0, TAU);
  x.arc(380, 440, 95, 0, TAU);
  x.arc(470, 470, 70, 0, TAU);
  x.fill();

  // Glass Diagonal Glare Reflection
  x.fillStyle = 'rgba(255, 255, 255, 0.18)';
  x.beginPath();
  x.moveTo(260, 180);
  x.lineTo(330, 180);
  x.lineTo(220, WIN_H - 200);
  x.lineTo(190, WIN_H - 200);
  x.closePath();
  x.fill();

  // THE BREATHER HOLE (Perspex middle pane, bottom center)
  const hx = WIN_W / 2, hy = WIN_H - 250;
  const hr = 12 * holeZoom;

  if (glowHole) {
    x.fillStyle = 'rgba(251, 191, 36, 0.4)';
    x.beginPath();
    x.arc(hx, hy, hr * 2.8, 0, TAU);
    x.fill();
  }

  // Dark circular pinhole
  x.fillStyle = '#0f172a';
  x.beginPath();
  x.arc(hx, hy, hr, 0, TAU);
  x.fill();
  x.lineWidth = 3.5;
  x.strokeStyle = 'rgba(255,255,255,0.9)';
  x.stroke();

  // Callout ring around breather hole
  x.lineWidth = 3.5;
  x.strokeStyle = '#ef4444';
  x.setLineDash([8, 6]);
  x.beginPath();
  x.arc(hx, hy, hr * 2.4, 0, TAU);
  x.stroke();
  x.setLineDash([]);

  // Label banner
  x.fillStyle = '#ef4444';
  x.font = '700 24px Fredoka, sans-serif';
  x.textAlign = 'center';
  x.fillText('BREATHER HOLE (LUBANG NAPAS)', hx, hy + hr * 2.4 + 34);
}

// ============================================================================
// 3. 1954 de Havilland Comet Fuselage with Square Windows
// ============================================================================
export const COMET_W = 1000, COMET_H = 650;
export function drawCometFuselage(x, p = {}) {
  const { stressAlpha = 1.0, crackProgress = 0 } = p;
  x.clearRect(0, 0, COMET_W, COMET_H);

  // Fuselage body (Aluminium silver cylinder slice)
  const g = x.createLinearGradient(0, 50, 0, COMET_H - 50);
  g.addColorStop(0, '#f1f5f9');
  g.addColorStop(0.5, '#cbd5e1');
  g.addColorStop(1, '#94a3b8');
  x.fillStyle = g;
  x.beginPath();
  x.roundRect(40, 80, COMET_W - 80, COMET_H - 160, 36);
  x.fill();
  x.lineWidth = LW;
  x.strokeStyle = '#334155';
  x.stroke();

  // Rivet lines
  x.fillStyle = '#64748b';
  for (let i = 80; i < COMET_W - 80; i += 36) {
    x.beginPath(); x.arc(i, 110, 3.5, 0, TAU); x.fill();
    x.beginPath(); x.arc(i, COMET_H - 110, 3.5, 0, TAU); x.fill();
  }

  // 3 Retro Square Windows (1950s square design)
  const wins = [200, 500, 800];
  for (const cx of wins) {
    const wx = cx - 90, wy = 200, ww = 180, wh = 180;
    // Window frame
    x.fillStyle = '#334155';
    x.beginPath();
    x.rect(wx - 8, wy - 8, ww + 16, wh + 16);
    x.fill();

    // Dark cabin glass
    x.fillStyle = '#0f172a';
    x.beginPath();
    x.rect(wx, wy, ww, wh);
    x.fill();
    x.lineWidth = 3.5;
    x.strokeStyle = '#e2e8f0';
    x.stroke();

    // Red Stress Concentration Lines at sharp 90-degree corners!
    if (stressAlpha > 0) {
      x.save();
      x.globalAlpha = stressAlpha;
      x.lineWidth = 4;
      x.strokeStyle = '#ef4444';
      const corners = [
        [wx, wy, -1, -1],
        [wx + ww, wy, 1, -1],
        [wx, wy + wh, -1, 1],
        [wx + ww, wy + wh, 1, 1]
      ];
      for (const [kx, ky, dx, dy] of corners) {
        x.beginPath();
        x.arc(kx, ky, 22, 0, TAU);
        x.stroke();
        x.beginPath();
        x.moveTo(kx, ky);
        x.lineTo(kx + dx * 36, ky + dy * 36);
        x.stroke();
      }
      x.restore();
    }

    // Dynamic Metal Fatigue Crack on middle window
    if (crackProgress > 0 && cx === 500) {
      x.save();
      x.lineWidth = 6;
      x.strokeStyle = '#dc2626';
      x.beginPath();
      x.moveTo(wx, wy);
      const len = crackProgress * 130;
      x.lineTo(wx - len * 0.45, wy - len * 0.35);
      x.lineTo(wx - len * 0.7, wy - len * 0.55);
      x.lineTo(wx - len * 0.95, wy - len * 0.75);
      x.stroke();
      x.restore();
    }
  }

  // BOAC / Speedbird livery stripe
  x.fillStyle = '#1e3a8a';
  x.fillRect(40, 420, COMET_W - 80, 24);
  x.font = '700 26px "Space Grotesk", sans-serif';
  x.fillStyle = '#1e3a8a';
  x.fillText('DE HAVILLAND COMET (1954)', 60, 480);
}

// ============================================================================
// 4. British Aerospace Engineer / Accident Investigator Character
// ============================================================================
export const ENG_W = 600, ENG_H = 800;
export function drawEngineer(x, p = {}) {
  const { headShake = 0 } = p;
  x.clearRect(0, 0, ENG_W, ENG_H);
  x.save();

  // Torso / British Laboratory Dust Coat
  x.fillStyle = '#f1f5f9';
  x.beginPath();
  x.roundRect(190, 430, 220, 290, 24);
  x.fill();
  x.lineWidth = LW;
  x.strokeStyle = INK;
  x.stroke();

  // Tweed Waistcoat underneath
  x.fillStyle = '#475569';
  x.beginPath();
  x.moveTo(260, 470); x.lineTo(300, 520); x.lineTo(340, 470);
  x.lineTo(330, 680); x.lineTo(270, 680);
  x.closePath();
  x.fill();

  // Vintage Brass Watch Chain
  x.lineWidth = 3;
  x.strokeStyle = '#d97706';
  x.beginPath();
  x.arc(300, 600, 22, 0.2, Math.PI - 0.2);
  x.stroke();

  // Pen pocket with vintage drafting pens
  x.fillStyle = '#cbd5e1';
  x.fillRect(225, 520, 42, 45);
  x.lineWidth = 2.5; x.strokeStyle = INK; x.strokeRect(225, 520, 42, 45);
  x.fillStyle = '#dc2626'; x.fillRect(234, 502, 6, 22);
  x.fillStyle = '#2563eb'; x.fillRect(246, 498, 6, 26);

  // Head with shake rotation
  x.translate(300, 315);
  x.rotate(headShake);
  x.translate(-300, -315);

  // Neck
  x.fillStyle = '#fed7aa';
  x.fillRect(280, 385, 40, 50);

  // Head oval
  x.fillStyle = '#fde2c7';
  x.beginPath();
  x.ellipse(300, 315, 92, 108, 0, 0, TAU);
  x.fill();
  x.lineWidth = LW;
  x.strokeStyle = INK;
  x.stroke();

  // Distinguished Silver Hair (100% solid continuous mass, zero gaps)
  x.fillStyle = '#64748b';
  x.beginPath();
  x.moveTo(200, 310);
  x.quadraticCurveTo(192, 260, 196, 220);
  x.quadraticCurveTo(210, 180, 300, 180);
  x.quadraticCurveTo(390, 180, 404, 220);
  x.quadraticCurveTo(408, 260, 400, 310);
  x.quadraticCurveTo(390, 290, 385, 250);
  x.quadraticCurveTo(300, 230, 215, 250);
  x.quadraticCurveTo(210, 290, 200, 310);
  x.closePath();
  x.fill();
  x.lineWidth = LW;
  x.strokeStyle = INK;
  x.stroke();

  x.fillStyle = '#94a3b8';
  x.beginPath();
  x.moveTo(198, 245);
  x.quadraticCurveTo(245, 275, 290, 245);
  x.quadraticCurveTo(335, 280, 402, 245);
  x.quadraticCurveTo(300, 205, 198, 245);
  x.closePath();
  x.fill();
  x.lineWidth = 3;
  x.strokeStyle = '#475569';
  x.stroke();

  // Tortoiseshell Wireframe Glasses
  x.lineWidth = 4.5;
  x.strokeStyle = '#78350f';
  x.fillStyle = 'rgba(191, 219, 254, 0.25)';
  x.beginPath(); x.arc(265, 315, 26, 0, TAU); x.fill(); x.stroke();
  x.beginPath(); x.arc(335, 315, 26, 0, TAU); x.fill(); x.stroke();
  x.beginPath(); x.moveTo(291, 315); x.lineTo(309, 315); x.stroke();

  // Worried Eyes & Furrowed Brows
  x.fillStyle = INK;
  x.beginPath(); x.arc(265, 315, 6, 0, TAU); x.fill();
  x.beginPath(); x.arc(335, 315, 6, 0, TAU); x.fill();
  x.lineWidth = 4;
  x.strokeStyle = INK;
  x.beginPath();
  x.moveTo(242, 280); x.lineTo(285, 294);
  x.moveTo(358, 280); x.lineTo(315, 294);
  x.stroke();

  // Worried mouth
  x.beginPath();
  x.arc(300, 390, 18, Math.PI * 1.15, Math.PI * 1.85);
  x.stroke();

  // Hand holding engineering clipboard
  x.restore();
  x.save();
  x.translate(430, 560);
  x.rotate(-0.35);
  x.fillStyle = '#b45309'; // Masonite clipboard
  x.roundRect(-25, -90, 70, 150, 8);
  x.fill();
  x.fillStyle = '#fef08a'; // Blueprint paper
  x.fillRect(-18, -80, 56, 130);
  x.fillStyle = '#2563eb';
  x.lineWidth = 1.5;
  x.strokeRect(-18, -80, 56, 130);
  // Grid lines
  for (let y = -70; y < 40; y += 15) {
    x.beginPath(); x.moveTo(-15, y); x.lineTo(35, y); x.stroke();
  }
  x.restore();
}

// ============================================================================
// 5. 3-Layer Exploded Window Assembly
// ============================================================================
export const EXP_W = 900, EXP_H = 700;
export function drawExplodedPane(x, layer = 'middle') {
  x.clearRect(0, 0, EXP_W, EXP_H);
  const pw = 480, ph = 620, px = (EXP_W - pw) / 2, py = 40;

  if (layer === 'outer') {
    // Structural Outer Pane (Thick acrylic, withstands cabin pressure)
    x.fillStyle = 'rgba(147, 197, 253, 0.45)';
    x.beginPath();
    x.roundRect(px, py, pw, ph, 120);
    x.fill();
    x.lineWidth = 8;
    x.strokeStyle = '#2563eb';
    x.stroke();

    // Label banner
    x.fillStyle = '#1e40af';
    x.font = '700 28px Fredoka, sans-serif';
    x.textAlign = 'center';
    x.fillText('KACA LUAR (Struktural - 12mm)', EXP_W / 2, py + ph / 2);
    x.font = '500 22px Fredoka, sans-serif';
    x.fillText('Menahan 100% Beban Tekanan Kabin', EXP_W / 2, py + ph / 2 + 36);
  } else if (layer === 'middle') {
    // Middle Pane with Breather Hole
    x.fillStyle = 'rgba(191, 219, 254, 0.4)';
    x.beginPath();
    x.roundRect(px, py, pw, ph, 120);
    x.fill();
    x.lineWidth = 7;
    x.strokeStyle = '#0284c7';
    x.stroke();

    // The Hole!
    const hx = EXP_W / 2, hy = py + ph - 80;
    x.fillStyle = '#0f172a';
    x.beginPath();
    x.arc(hx, hy, 16, 0, TAU);
    x.fill();
    x.lineWidth = 4;
    x.strokeStyle = '#ef4444';
    x.stroke();

    x.fillStyle = '#0369a1';
    x.font = '700 28px Fredoka, sans-serif';
    x.textAlign = 'center';
    x.fillText('KACA TENGAH (Breather Pane)', EXP_W / 2, py + ph / 2 - 20);
    x.fillStyle = '#ef4444';
    x.font = '700 24px Fredoka, sans-serif';
    x.fillText('LUBANG NAPAS (Breather Hole)', hx, hy - 30);
  } else if (layer === 'inner') {
    // Inner Scratch Pane (Thin plastic to protect from passenger scratches)
    x.fillStyle = 'rgba(224, 231, 255, 0.35)';
    x.beginPath();
    x.roundRect(px, py, pw, ph, 120);
    x.fill();
    x.lineWidth = 6;
    x.strokeStyle = '#4f46e5';
    x.stroke();
    x.fillStyle = '#3730a3';
    x.font = '700 28px Fredoka, sans-serif';
    x.textAlign = 'center';
    x.fillText('KACA DALAM (Pelindung Antigores)', EXP_W / 2, py + ph / 2);
    x.font = '500 22px Fredoka, sans-serif';
    x.fillText('Melindungi dari Sentuhan Penumpang', EXP_W / 2, py + ph / 2 + 36);
  }
}
