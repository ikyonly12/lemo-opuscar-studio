// All paper-cut illustrations for The Airplane Window Breather Hole
import { mulberry, TAU, clamp, lerp } from './lib.js';
import { cv, sh, blob, smoothClosed, smoothOpen, crescent, paperFill, INK, GRAIN, rr } from './paper.js';

const LW = 8;
const LW2 = 4;

// 1. Passenger Character
export const PASS_W = 600, PASS_H = 800;
export function drawPassenger(x, p = {}) {
  const { lean = 0, look = [0, 0], blink = 0, arm = 'point', mouth = 'o' } = p;
  x.clearRect(0, 0, PASS_W, PASS_H);
  x.save();
  x.translate(300, 750);
  x.rotate(lean);
  x.translate(-300, -750);

  // Torso / Navy Travel Jacket
  x.fillStyle = '#243b55';
  x.beginPath();
  x.roundRect(210, 480, 180, 240, 24);
  x.fill();
  x.lineWidth = LW;
  x.strokeStyle = INK;
  x.stroke();

  // Collar & Tie
  x.fillStyle = '#f5f7fa';
  x.beginPath();
  x.moveTo(270, 480); x.lineTo(300, 540); x.lineTo(330, 480);
  x.closePath();
  x.fill();
  x.fillStyle = '#e74c3c';
  x.beginPath();
  x.moveTo(292, 530); x.lineTo(308, 530); x.lineTo(314, 640); x.lineTo(300, 660); x.lineTo(286, 640);
  x.closePath();
  x.fill();

  // Head
  x.fillStyle = '#fce2c2';
  x.beginPath();
  x.ellipse(300, 360, 100, 115, 0, 0, TAU);
  x.fill();
  x.lineWidth = LW;
  x.strokeStyle = INK;
  x.stroke();

  // Hair
  x.fillStyle = '#3e2723';
  x.beginPath();
  x.ellipse(300, 275, 110, 60, 0, Math.PI, TAU);
  x.fill();

  // Eyes
  const exL = 265 + look[0] * 8, exR = 335 + look[0] * 8;
  const ey = 360 + look[1] * 8;
  const ry = Math.max(2, 16 * (1 - blink));
  x.fillStyle = INK;
  x.beginPath(); x.ellipse(exL, ey, 10, ry, 0, 0, TAU); x.fill();
  x.beginPath(); x.ellipse(exR, ey, 10, ry, 0, 0, TAU); x.fill();
  if (ry > 8) {
    x.fillStyle = '#fff';
    x.beginPath(); x.arc(exL - 3, ey - 4, 3, 0, TAU); x.fill();
    x.beginPath(); x.arc(exR - 3, ey - 4, 3, 0, TAU); x.fill();
  }

  // Mouth
  x.lineWidth = 5;
  x.strokeStyle = INK;
  x.beginPath();
  if (mouth === 'o') {
    x.fillStyle = '#8e2800';
    x.ellipse(300, 420, 14, 18, 0, 0, TAU);
    x.fill();
    x.stroke();
  } else if (mouth === 'smile') {
    x.arc(300, 410, 24, 0.2, Math.PI - 0.2);
    x.stroke();
  } else {
    x.moveTo(285, 420); x.lineTo(315, 420);
    x.stroke();
  }

  // Arms (Pointing or resting)
  x.lineWidth = LW;
  x.strokeStyle = INK;
  x.fillStyle = '#243b55';
  if (arm === 'point') {
    // Pointing right arm towards window
    x.beginPath();
    x.moveTo(380, 520);
    x.quadraticCurveTo(460, 480, 520, 440);
    x.lineWidth = 28; x.strokeStyle = '#243b55'; x.stroke();
    x.lineWidth = LW; x.strokeStyle = INK;
    // hand
    x.fillStyle = '#fce2c2';
    x.beginPath();
    x.arc(525, 435, 16, 0, TAU);
    x.fill(); x.stroke();
  }
  x.restore();
}

// 2. Oval Airplane Passenger Window with Breather Hole
export const WIN_W = 800, WIN_H = 1000;
export function drawCabinWindow(x, p = {}) {
  const { holeZoom = 1.0, showFlow = false, glowHole = false } = p;
  x.clearRect(0, 0, WIN_W, WIN_H);

  // Outer Aircraft Fuselage Wall (Off-white textured)
  x.fillStyle = '#edf2f7';
  x.beginPath();
  x.roundRect(40, 40, WIN_W - 80, WIN_H - 80, 60);
  x.fill();
  x.lineWidth = LW;
  x.strokeStyle = '#a0aec0';
  x.stroke();

  // Oval Window Cutout (Beveled border)
  x.fillStyle = '#cbd5e0';
  x.beginPath();
  x.roundRect(160, 140, WIN_W - 320, WIN_H - 280, 180);
  x.fill();
  x.lineWidth = 6;
  x.strokeStyle = INK;
  x.stroke();

  // Glass Pane (Sky and Clouds behind)
  const g = x.createLinearGradient(0, 180, 0, WIN_H - 180);
  g.addColorStop(0, '#2b6cb0');
  g.addColorStop(0.6, '#63b3ed');
  g.addColorStop(1, '#ebf8ff');
  x.fillStyle = g;
  x.beginPath();
  x.roundRect(190, 170, WIN_W - 380, WIN_H - 340, 150);
  x.fill();

  // Subtle cloud puffs inside window view
  x.fillStyle = 'rgba(255, 255, 255, 0.75)';
  x.beginPath();
  x.arc(320, 460, 70, 0, TAU);
  x.arc(380, 440, 90, 0, TAU);
  x.arc(460, 470, 65, 0, TAU);
  x.fill();

  // Glass Specular Glare Slant
  x.fillStyle = 'rgba(255, 255, 255, 0.22)';
  x.beginPath();
  x.moveTo(250, 180);
  x.lineTo(310, 180);
  x.lineTo(210, WIN_H - 200);
  x.lineTo(190, WIN_H - 200);
  x.closePath();
  x.fill();

  // THE BREATHER HOLE at bottom center of middle pane
  const hx = WIN_W / 2, hy = WIN_H - 250;
  const hr = 12 * holeZoom;

  if (glowHole) {
    x.fillStyle = 'rgba(255, 215, 0, 0.4)';
    x.beginPath();
    x.arc(hx, hy, hr * 2.8, 0, TAU);
    x.fill();
  }

  // Dark circular pinhole
  x.fillStyle = '#1a202c';
  x.beginPath();
  x.arc(hx, hy, hr, 0, TAU);
  x.fill();
  x.lineWidth = 4;
  x.strokeStyle = 'rgba(255,255,255,0.8)';
  x.stroke();

  // Callout ring around breather hole
  x.lineWidth = 3;
  x.strokeStyle = '#e53e3e';
  x.setLineDash([8, 6]);
  x.beginPath();
  x.arc(hx, hy, hr * 2.2, 0, TAU);
  x.stroke();
  x.setLineDash([]);

  // Label
  x.font = '600 24px Fredoka, sans-serif';
  x.fillStyle = '#e53e3e';
  x.textAlign = 'center';
  x.fillText('BREATHER HOLE', hx, hy + hr * 2.2 + 32);
}

// 3. 1954 de Havilland Comet Jet Fuselage with Square Windows
export const COMET_W = 1000, COMET_H = 650;
export function drawCometFuselage(x, p = {}) {
  const { stressAlpha = 1.0, crackProgress = 0 } = p;
  x.clearRect(0, 0, COMET_W, COMET_H);

  // Fuselage body (Aluminium silver cylinder slice)
  const g = x.createLinearGradient(0, 50, 0, COMET_H - 50);
  g.addColorStop(0, '#e2e8f0');
  g.addColorStop(0.5, '#cbd5e0');
  g.addColorStop(1, '#a0aec0');
  x.fillStyle = g;
  x.beginPath();
  x.roundRect(40, 80, COMET_W - 80, COMET_H - 160, 40);
  x.fill();
  x.lineWidth = LW;
  x.strokeStyle = '#4a5568';
  x.stroke();

  // Rivet lines
  x.fillStyle = '#718096';
  for (let i = 80; i < COMET_W - 80; i += 40) {
    x.beginPath(); x.arc(i, 110, 4, 0, TAU); x.fill();
    x.beginPath(); x.arc(i, COMET_H - 110, 4, 0, TAU); x.fill();
  }

  // 3 Retro Square Windows (1950s style)
  const wins = [200, 500, 800];
  for (const cx of wins) {
    const wx = cx - 90, wy = 200, ww = 180, wh = 180;
    // Window frame
    x.fillStyle = '#4a5568';
    x.beginPath();
    x.rect(wx - 8, wy - 8, ww + 16, wh + 16);
    x.fill();

    // Dark cabin glass
    x.fillStyle = '#1a365d';
    x.beginPath();
    x.rect(wx, wy, ww, wh);
    x.fill();
    x.lineWidth = 4;
    x.strokeStyle = '#fff';
    x.stroke();

    // Red Stress Concentration Lines at sharp 90-degree corners!
    if (stressAlpha > 0) {
      x.save();
      x.globalAlpha = stressAlpha;
      x.lineWidth = 4;
      x.strokeStyle = '#e53e3e';
      const corners = [
        [wx, wy, -1, -1],
        [wx + ww, wy, 1, -1],
        [wx, wy + wh, -1, 1],
        [wx + ww, wy + wh, 1, 1]
      ];
      for (const [kx, ky, dx, dy] of corners) {
        x.beginPath();
        x.arc(kx, ky, 24, 0, TAU);
        x.stroke();
        x.beginPath();
        x.moveTo(kx, ky);
        x.lineTo(kx + dx * 35, ky + dy * 35);
        x.stroke();
      }
      x.restore();
    }

    // Dynamic Metal Fatigue Crack
    if (crackProgress > 0 && cx === 500) {
      x.save();
      x.lineWidth = 6;
      x.strokeStyle = '#ff1a1a';
      x.beginPath();
      x.moveTo(wx, wy);
      const len = crackProgress * 120;
      x.lineTo(wx - len * 0.4, wy - len * 0.3);
      x.lineTo(wx - len * 0.6, wy - len * 0.5);
      x.lineTo(wx - len * 0.9, wy - len * 0.7);
      x.stroke();
      x.restore();
    }
  }

  // Speedbird livery stripe
  x.fillStyle = '#1e3a8a';
  x.fillRect(40, 420, COMET_W - 80, 24);
  x.font = '700 28px "Space Grotesk", sans-serif';
  x.fillStyle = '#1e3a8a';
  x.fillText('DE HAVILLAND COMET (1954)', 60, 480);
}

// 4. British Aerospace Engineer Character
export const ENG_W = 600, ENG_H = 800;
export function drawEngineer(x, p = {}) {
  const { headShake = 0 } = p;
  x.clearRect(0, 0, ENG_W, ENG_H);
  x.save();

  // Torso / White Lab Coat
  x.fillStyle = '#f8fafc';
  x.beginPath();
  x.roundRect(200, 440, 200, 280, 20);
  x.fill();
  x.lineWidth = LW;
  x.strokeStyle = INK;
  x.stroke();

  // Collar & Pen in pocket
  x.fillStyle = '#94a3b8';
  x.fillRect(230, 520, 40, 45);
  x.fillStyle = '#2563eb';
  x.fillRect(245, 505, 8, 25);

  // Head with shake angle
  x.translate(300, 320);
  x.rotate(headShake);
  x.translate(-300, -320);

  x.fillStyle = '#fce2c2';
  x.beginPath();
  x.ellipse(300, 320, 95, 110, 0, 0, TAU);
  x.fill();
  x.lineWidth = LW;
  x.strokeStyle = INK;
  x.stroke();

  // Round 1950s Glasses
  x.lineWidth = 5;
  x.strokeStyle = '#b45309';
  x.beginPath();
  x.arc(265, 315, 26, 0, TAU);
  x.arc(335, 315, 26, 0, TAU);
  x.moveTo(291, 315); x.lineTo(309, 315);
  x.stroke();

  // Worried eyebrows & eyes
  x.fillStyle = INK;
  x.beginPath();
  x.arc(265, 315, 7, 0, TAU);
  x.arc(335, 315, 7, 0, TAU);
  x.fill();
  x.beginPath();
  x.moveTo(245, 280); x.lineTo(285, 292);
  x.moveTo(355, 280); x.lineTo(315, 292);
  x.lineWidth = 5;
  x.stroke();

  // Mouth (Worried frown)
  x.beginPath();
  x.arc(300, 395, 20, Math.PI * 1.15, Math.PI * 1.85);
  x.stroke();

  // Hand holding slide rule
  x.restore();
  x.fillStyle = '#fef08a';
  x.save();
  x.translate(420, 560);
  x.rotate(-0.5);
  x.fillRect(-15, -100, 30, 200);
  x.lineWidth = 4;
  x.strokeStyle = INK;
  x.strokeRect(-15, -100, 30, 200);
  x.restore();
}

// 5. 3-Layer Exploded Window Assembly
export const EXP_W = 900, EXP_H = 700;
export function drawExplodedPane(x, layer = 'middle') {
  x.clearRect(0, 0, EXP_W, EXP_H);
  const pw = 480, ph = 620, px = (EXP_W - pw) / 2, py = 40;

  if (layer === 'outer') {
    // Structural Outer Pane (Thick acrylic, withstands 8 psi)
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
