// All paper-cut illustrations for The Hidden Geometry of QWERTY
import { mulberry, TAU, clamp, lerp } from './lib.js';
import { cv, finishCut, sh, blob, smoothClosed, smoothOpen, paperFill, INK, GRAIN } from './paper.js';

const LW = 6;
const LW2 = 3.5;

// ============================================================================
// 1. Modern Smartphone Pop-Up Asset (Spread 0)
// ============================================================================
export function makeSmartphone(w = 520, h = 900) {
  const c = cv(w, h), x = c.getContext('2d');

  // Outer phone chassis (dark titanium/obsidian with subtle metallic sheen)
  x.fillStyle = '#0f172a';
  x.beginPath();
  x.roundRect(40, 30, w - 80, h - 60, 54);
  x.fill();
  x.lineWidth = 8;
  x.strokeStyle = '#334155';
  x.stroke();

  // Screen glass bezel
  x.fillStyle = '#020617';
  x.beginPath();
  x.roundRect(55, 48, w - 110, h - 96, 42);
  x.fill();

  // Dynamic Island / Speaker notch
  x.fillStyle = '#000000';
  x.beginPath();
  x.roundRect(w / 2 - 60, 65, 120, 28, 14);
  x.fill();
  // Front camera lens glint
  x.fillStyle = '#1e3a8a';
  x.beginPath(); x.arc(w / 2 + 35, 79, 6, 0, TAU); x.fill();
  x.fillStyle = '#38bdf8';
  x.beginPath(); x.arc(w / 2 + 36, 78, 2.5, 0, TAU); x.fill();

  // Screen Wallpaper Gradient (Deep violet / indigo glow)
  const scrGrad = x.createLinearGradient(0, 110, 0, h - 70);
  scrGrad.addColorStop(0, '#1e1b4b');
  scrGrad.addColorStop(0.45, '#0f172a');
  scrGrad.addColorStop(1, '#020617');
  x.fillStyle = scrGrad;
  x.beginPath();
  x.roundRect(65, 110, w - 130, h - 170, 32);
  x.fill();

  // Chat Bubble at top
  x.fillStyle = '#1e293b';
  x.beginPath();
  x.roundRect(90, 150, w - 210, 75, 20);
  x.fill();
  x.fillStyle = '#94a3b8';
  x.font = '500 24px "Fredoka", sans-serif';
  x.fillText('Mengapa huruf di keyboard', 115, 185);
  x.fillText('disusun seperti ini? 🤔', 115, 212);

  // Virtual Keyboard Container
  const kTop = 440, kW = w - 160, kH = 340;
  x.fillStyle = '#1e293b';
  x.beginPath();
  x.roundRect(80, kTop, w - 160, kH, 24);
  x.fill();
  x.lineWidth = 3;
  x.strokeStyle = '#334155';
  x.stroke();

  // Render 3 Keyboard Rows: QWERTYUIOP / ASDFGHJKL / ZXCVBNM
  const r1 = ['Q','W','E','R','T','Y','U','I','O','P'];
  const r2 = ['A','S','D','F','G','H','J','K','L'];
  const r3 = ['Z','X','C','V','B','N','M'];

  function drawRow(letters, y, xOff, keyW = 30, keyH = 46) {
    letters.forEach((l, i) => {
      const kx = xOff + i * (keyW + 5);
      const isA = (l === 'A');
      
      // Key background
      if (isA) {
        // Highlight letter A with amber warning pulse
        x.fillStyle = '#f59e0b';
        x.beginPath(); x.roundRect(kx, y, keyW, keyH, 8); x.fill();
        x.lineWidth = 3; x.strokeStyle = '#ef4444'; x.stroke();
        x.fillStyle = '#000000';
      } else {
        x.fillStyle = '#334155';
        x.beginPath(); x.roundRect(kx, y, keyW, keyH, 8); x.fill();
        x.fillStyle = '#f8fafc';
      }

      x.font = '700 22px "Lilita One", sans-serif';
      x.textAlign = 'center';
      x.textBaseline = 'middle';
      x.fillText(l, kx + keyW / 2, y + keyH / 2 + 1);
    });
  }

  drawRow(r1, kTop + 35, 95, 31, 48);
  drawRow(r2, kTop + 95, 112, 31, 48);
  drawRow(r3, kTop + 155, 147, 31, 48);

  // Spacebar
  x.fillStyle = '#475569';
  x.beginPath();
  x.roundRect(175, kTop + 220, 170, 42, 10);
  x.fill();
  x.fillStyle = '#cbd5e1';
  x.font = '600 18px "Fredoka", sans-serif';
  x.fillText('spasi', 260, kTop + 242);

  // Red callout circle around letter A
  x.strokeStyle = '#ef4444';
  x.lineWidth = 4;
  x.setLineDash([6, 4]);
  x.beginPath();
  x.arc(128, kTop + 119, 32, 0, TAU);
  x.stroke();
  x.setLineDash([]);

  // Callout pointer badge: "Kelingking Kiri" (Weakest Pinky)
  x.fillStyle = '#ef4444';
  x.beginPath();
  x.roundRect(85, kTop + 300, 190, 40, 12);
  x.fill();
  x.fillStyle = '#ffffff';
  x.font = '700 18px "Fredoka", sans-serif';
  x.fillText('⚠ Jari Kelingking Kiri', 180, kTop + 322);

  return finishCut(c, 14, { paper: '#fffdf7', edge: '#b9ad9c' });
}


// ============================================================================
// 2. Modern Tech Typist Character (Spread 0)
// ============================================================================
export const USER_W = 600, USER_H = 800;
export function drawUserCharacter(outCtx, p = {}) {
  const { lean = 0, look = [0, 0], blink = 0, puzzled = false } = p;
  outCtx.clearRect(0, 0, USER_W, USER_H);
  const W = cv(USER_W, USER_H), x = W.getContext('2d');
  
  x.save();
  x.translate(300, 760);
  x.rotate(lean);
  x.translate(-300, -760);

  // Torso: Emerald Green Casual Hoodie
  x.fillStyle = '#065f46';
  x.beginPath();
  x.roundRect(190, 470, 220, 270, 28);
  x.fill();
  x.lineWidth = LW;
  x.strokeStyle = INK;
  x.stroke();

  // Hoodie Pocket
  x.fillStyle = '#047857';
  x.beginPath();
  x.roundRect(220, 600, 160, 90, 18);
  x.fill();
  x.lineWidth = LW2;
  x.stroke();

  // Draw Hoodie Drawstrings
  x.strokeStyle = '#d1fae5';
  x.lineWidth = 4;
  x.beginPath(); x.moveTo(275, 470); x.lineTo(270, 560); x.stroke();
  x.beginPath(); x.moveTo(325, 470); x.lineTo(330, 560); x.stroke();

  // Neck
  x.fillStyle = '#fcd3a7';
  x.beginPath();
  x.roundRect(275, 430, 50, 55, 10);
  x.fill();
  x.lineWidth = 3;
  x.stroke();

  // Head Oval
  x.fillStyle = '#fde2c7';
  x.beginPath();
  x.ellipse(300 + look[0] * 12, 330 + look[1] * 8, 95, 115, 0, 0, TAU);
  x.fill();
  x.lineWidth = LW;
  x.stroke();

  // Ears
  x.fillStyle = '#fcd3a7';
  x.beginPath(); x.arc(205 + look[0] * 10, 335, 20, 0, TAU); x.fill(); x.lineWidth = 3; x.stroke();
  x.beginPath(); x.arc(395 + look[0] * 10, 335, 20, 0, TAU); x.fill(); x.stroke();

  // Modern Styled Hair (Curved dark brown quiff)
  x.fillStyle = '#292524';
  x.beginPath();
  x.moveTo(205 + look[0] * 10, 310);
  x.quadraticCurveTo(200, 200, 300, 190);
  x.quadraticCurveTo(400, 195, 400 + look[0] * 10, 310);
  x.quadraticCurveTo(370, 240, 300, 235);
  x.quadraticCurveTo(230, 240, 205 + look[0] * 10, 310);
  x.closePath();
  x.fill();
  x.lineWidth = LW;
  x.stroke();

  // Eyes (Paper cut layers with pupils)
  const eyeY = 325 + look[1] * 6;
  const lx = 265 + look[0] * 14, rx = 335 + look[0] * 14;

  if (blink > 0.6) {
    // Blinking
    x.strokeStyle = INK;
    x.lineWidth = 4;
    x.beginPath(); x.moveTo(lx - 16, eyeY); x.lineTo(lx + 16, eyeY); x.stroke();
    x.beginPath(); x.moveTo(rx - 16, eyeY); x.lineTo(rx + 16, eyeY); x.stroke();
  } else {
    // Open eyes
    x.fillStyle = '#ffffff';
    x.beginPath(); x.ellipse(lx, eyeY, 18, 14, 0, 0, TAU); x.fill(); x.lineWidth = 3; x.stroke();
    x.beginPath(); x.ellipse(rx, eyeY, 18, 14, 0, 0, TAU); x.fill(); x.stroke();

    // Dark Pupils
    x.fillStyle = '#1c1917';
    x.beginPath(); x.arc(lx + look[0] * 5, eyeY + look[1] * 4, 8, 0, TAU); x.fill();
    x.beginPath(); x.arc(rx + look[0] * 5, eyeY + look[1] * 4, 8, 0, TAU); x.fill();

    // Catchlight dots
    x.fillStyle = '#ffffff';
    x.beginPath(); x.arc(lx + look[0] * 5 - 3, eyeY + look[1] * 4 - 3, 2.5, 0, TAU); x.fill();
    x.beginPath(); x.arc(rx + look[0] * 5 - 3, eyeY + look[1] * 4 - 3, 2.5, 0, TAU); x.fill();
  }

  // Eyebrows
  x.strokeStyle = '#292524';
  x.lineWidth = 4.5;
  if (puzzled) {
    // Asymmetric curious / puzzled eyebrows
    x.beginPath(); x.moveTo(lx - 16, eyeY - 20); x.lineTo(lx + 16, eyeY - 28); x.stroke();
    x.beginPath(); x.moveTo(rx - 16, eyeY - 24); x.lineTo(rx + 16, eyeY - 18); x.stroke();
  } else {
    x.beginPath(); x.moveTo(lx - 16, eyeY - 22); x.lineTo(lx + 16, eyeY - 22); x.stroke();
    x.beginPath(); x.moveTo(rx - 16, eyeY - 22); x.lineTo(rx + 16, eyeY - 22); x.stroke();
  }

  // Mouth
  x.strokeStyle = INK;
  x.lineWidth = 3.5;
  if (puzzled) {
    // Slightly open curious 'o'
    x.fillStyle = '#991b1b';
    x.beginPath(); x.ellipse(300 + look[0] * 12, 385, 10, 14, 0, 0, TAU); x.fill(); x.stroke();
  } else {
    // Gentle smile
    x.beginPath(); x.arc(300 + look[0] * 12, 375, 20, 0.2, Math.PI - 0.2); x.stroke();
  }

  // Hands holding phone (resting at bottom)
  x.fillStyle = '#fcd3a7';
  x.beginPath(); x.ellipse(210, 680, 28, 22, -0.3, 0, TAU); x.fill(); x.lineWidth = 3; x.stroke();
  x.beginPath(); x.ellipse(390, 680, 28, 22, 0.3, 0, TAU); x.fill(); x.stroke();

  x.restore();
  outCtx.drawImage(finishCut(W, 14, { paper: '#fffdf7', edge: '#b9ad9c' }), 0, 0);
}

// ============================================================================
// 3. Christopher Latham Sholes 1873 Character (Spread 1)
// ============================================================================
export const SHOLES_W = 600, SHOLES_H = 800;
export function drawSholesCharacter(outCtx, p = {}) {
  const { lean = 0, look = [0, 0], frustrated = false } = p;
  outCtx.clearRect(0, 0, SHOLES_W, SHOLES_H);
  const W = cv(SHOLES_W, SHOLES_H), x = W.getContext('2d');

  x.save();
  x.translate(300, 760);
  x.rotate(lean);
  x.translate(-300, -760);

  // Victorian Tweed Frock Coat
  x.fillStyle = '#3f3f46';
  x.beginPath();
  x.roundRect(190, 460, 220, 280, 24);
  x.fill();
  x.lineWidth = LW;
  x.strokeStyle = INK;
  x.stroke();

  // Waistcoat / Vest
  x.fillStyle = '#713f12';
  x.beginPath();
  x.moveTo(230, 460); x.lineTo(300, 540); x.lineTo(370, 460);
  x.lineTo(370, 720); x.lineTo(230, 720);
  x.closePath();
  x.fill();
  x.lineWidth = 3;
  x.stroke();

  // White Victorian Collar & Black Bow Tie
  x.fillStyle = '#f8fafc';
  x.beginPath();
  x.moveTo(260, 460); x.lineTo(300, 510); x.lineTo(340, 460);
  x.closePath();
  x.fill();
  x.stroke();

  x.fillStyle = '#18181b';
  x.beginPath();
  x.ellipse(285, 495, 18, 10, -0.2, 0, TAU); x.fill();
  x.beginPath();
  x.ellipse(315, 495, 18, 10, 0.2, 0, TAU); x.fill();
  x.beginPath(); x.arc(300, 495, 8, 0, TAU); x.fill();

  // Watch Chain (Brass chain curve across vest)
  x.strokeStyle = '#d97706';
  x.lineWidth = 3;
  x.beginPath();
  x.arc(300, 610, 45, 0.3, Math.PI - 0.3);
  x.stroke();

  // Neck
  x.fillStyle = '#fcd3a7';
  x.beginPath();
  x.roundRect(275, 420, 50, 50, 8);
  x.fill(); x.lineWidth = 3; x.stroke();

  // Head Oval
  x.fillStyle = '#fde2c7';
  x.beginPath();
  x.ellipse(300 + look[0] * 10, 320 + look[1] * 8, 95, 115, 0, 0, TAU);
  x.fill();
  x.lineWidth = LW;
  x.stroke();

  // 1870s Victorian White/Silver Beard & Sideburns
  x.fillStyle = '#e4e4e7';
  x.beginPath();
  x.moveTo(205, 300);
  x.quadraticCurveTo(210, 440, 300, 445);
  x.quadraticCurveTo(390, 440, 395, 300);
  x.quadraticCurveTo(360, 390, 300, 390);
  x.quadraticCurveTo(240, 390, 205, 300);
  x.closePath();
  x.fill();
  x.lineWidth = LW2;
  x.stroke();

  // Silver Hair
  x.fillStyle = '#d4d4d8';
  x.beginPath();
  x.moveTo(205, 300);
  x.quadraticCurveTo(195, 190, 300, 185);
  x.quadraticCurveTo(405, 190, 395, 300);
  x.quadraticCurveTo(370, 240, 300, 235);
  x.quadraticCurveTo(230, 240, 205, 300);
  x.closePath();
  x.fill();
  x.lineWidth = LW;
  x.stroke();

  // Wire Spectacles
  const eyeY = 315 + look[1] * 6;
  const lx = 265 + look[0] * 12, rx = 335 + look[0] * 12;

  x.fillStyle = '#ffffff';
  x.beginPath(); x.arc(lx, eyeY, 18, 0, TAU); x.fill();
  x.beginPath(); x.arc(rx, eyeY, 18, 0, TAU); x.fill();

  x.strokeStyle = '#d97706'; // Gold wire rims
  x.lineWidth = 4;
  x.beginPath(); x.arc(lx, eyeY, 18, 0, TAU); x.stroke();
  x.beginPath(); x.arc(rx, eyeY, 18, 0, TAU); x.stroke();
  x.beginPath(); x.moveTo(lx + 18, eyeY); x.lineTo(rx - 18, eyeY); x.stroke(); // Bridge

  // Pupils
  x.fillStyle = '#1c1917';
  x.beginPath(); x.arc(lx + look[0] * 4, eyeY + look[1] * 4, 7, 0, TAU); x.fill();
  x.beginPath(); x.arc(rx + look[0] * 4, eyeY + look[1] * 4, 7, 0, TAU); x.fill();

  // Bushy Victorian Mustache
  x.fillStyle = '#e4e4e7';
  x.beginPath();
  x.ellipse(280, 370, 24, 12, 0.2, 0, TAU); x.fill(); x.lineWidth = 3; x.stroke();
  x.beginPath();
  x.ellipse(320, 370, 24, 12, -0.2, 0, TAU); x.fill(); x.stroke();

  // Arms holding mechanical tool / pointing
  x.fillStyle = '#3f3f46';
  x.beginPath();
  x.roundRect(140, 520, 60, 150, 20); x.fill(); x.stroke();
  x.beginPath();
  x.roundRect(400, 520, 60, 150, 20); x.fill(); x.stroke();

  // Hands
  x.fillStyle = '#fcd3a7';
  x.beginPath(); x.ellipse(170, 680, 22, 18, 0, 0, TAU); x.fill(); x.stroke();
  x.beginPath(); x.ellipse(430, 680, 22, 18, 0, 0, TAU); x.fill(); x.stroke();

  x.restore();
  outCtx.drawImage(finishCut(W, 14, { paper: '#fffdf7', edge: '#b9ad9c' }), 0, 0);
}

// ============================================================================
// 4. 1873 Sholes Machine & Circular Typebar Basket (Spread 1)
// ============================================================================
export function makeTypewriterBasket(w = 640, h = 600) {
  const c = cv(w, h), x = c.getContext('2d');
  const cx = w / 2, cy = h / 2 - 30;

  // Victorian Machine Stand / Frame (Heavy cast iron)
  x.fillStyle = '#18181b';
  x.beginPath();
  x.roundRect(80, h - 140, w - 160, 90, 16);
  x.fill();
  x.lineWidth = LW;
  x.strokeStyle = '#3f3f46';
  x.stroke();

  // Gold filigree border on cast iron
  x.strokeStyle = '#f59e0b';
  x.lineWidth = 3;
  x.strokeRect(95, h - 125, w - 190, 60);

  // Label badge: "THE MILWAUKEE TYPE-WRITER - 1873"
  x.fillStyle = '#f59e0b';
  x.font = '700 20px "Lilita One", sans-serif';
  x.textAlign = 'center';
  x.fillText('THE SHOLES TYPE-WRITER · 1873', cx, h - 90);

  // Circular Basket Rim ("The Birdcage")
  const R_out = 190, R_in = 140;
  x.fillStyle = '#27272a';
  x.beginPath();
  x.arc(cx, cy, R_out, 0, TAU);
  x.fill();
  x.lineWidth = 6;
  x.strokeStyle = '#52525b';
  x.stroke();

  x.fillStyle = '#09090b';
  x.beginPath();
  x.arc(cx, cy, R_in, 0, TAU);
  x.fill();
  x.stroke();

  // Central Strike Target Platen Hole
  x.fillStyle = '#3f3f46';
  x.beginPath(); x.arc(cx, cy, 32, 0, TAU); x.fill();
  x.fillStyle = '#ef4444'; // Red paper strike point
  x.beginPath(); x.arc(cx, cy, 14, 0, TAU); x.fill();

  // Radial Typebar Levers converging to center
  const nBars = 24;
  for (let i = 0; i < nBars; i++) {
    const a = (i / nBars) * TAU;
    const x1 = cx + Math.cos(a) * (R_in - 5);
    const y1 = cy + Math.sin(a) * (R_in - 5);
    const x2 = cx + Math.cos(a) * 36;
    const y2 = cy + Math.sin(a) * 36;

    x.strokeStyle = (i === 4 || i === 5) ? '#ef4444' : '#a1a1aa'; // 2 colliding bars highlighted
    x.lineWidth = (i === 4 || i === 5) ? 6 : 3.5;
    x.beginPath();
    x.moveTo(x1, y1);
    x.lineTo(x2, y2);
    x.stroke();

    // Typehead slug at inner tip
    x.fillStyle = (i === 4 || i === 5) ? '#f87171' : '#e4e4e7';
    x.beginPath();
    x.arc(x2, y2, 6, 0, TAU);
    x.fill();
  }

  // Tangled Collision Jam Effect at 1 o'clock
  const jx = cx + 32, jy = cy - 22;
  // Spark starburst
  x.fillStyle = '#f59e0b';
  x.beginPath();
  for (let s = 0; s < 8; s++) {
    const sa = (s / 8) * TAU;
    const r1 = 28, r2 = 12;
    x.lineTo(jx + Math.cos(sa) * r1, jy + Math.sin(sa) * r1);
    x.lineTo(jx + Math.cos(sa + Math.PI / 8) * r2, jy + Math.sin(sa + Math.PI / 8) * r2);
  }
  x.closePath();
  x.fill();
  x.lineWidth = 2; x.strokeStyle = '#ef4444'; x.stroke();

  // Red Jam Callout Tag
  x.fillStyle = '#ef4444';
  x.beginPath();
  x.roundRect(jx + 35, jy - 35, 160, 42, 10);
  x.fill();
  x.fillStyle = '#ffffff';
  x.font = '700 18px "Fredoka", sans-serif';
  x.textAlign = 'left';
  x.fillText('⚡ MACET / JAMMED', jx + 48, jy - 8);

  return finishCut(c, 14, { paper: '#fffdf7', edge: '#b9ad9c' });
}


// ============================================================================
// 5. English Digraph Frequency Matrix Board (Spread 2)
// ============================================================================
export function makeDigraphMatrix(w = 640, h = 600) {
  const c = cv(w, h), x = c.getContext('2d');

  // Blueprint / Chalkboard background
  x.fillStyle = '#1e3a8a';
  x.beginPath();
  x.roundRect(40, 30, w - 80, h - 60, 24);
  x.fill();
  x.lineWidth = LW;
  x.strokeStyle = '#93c5fd';
  x.stroke();

  // Grid lines
  x.strokeStyle = 'rgba(255,255,255,0.12)';
  x.lineWidth = 1.5;
  for (let gx = 60; gx < w - 60; gx += 40) {
    x.beginPath(); x.moveTo(gx, 50); x.lineTo(gx, h - 50); x.stroke();
  }
  for (let gy = 50; gy < h - 50; gy += 40) {
    x.beginPath(); x.moveTo(60, gy); x.lineTo(w - 60, gy); x.stroke();
  }

  // Header Title
  x.fillStyle = '#fef08a';
  x.font = '700 28px "Lilita One", sans-serif';
  x.textAlign = 'center';
  x.fillText('ANALISIS FREKUENSI PASANGAN HURUF', w / 2, 85);
  x.fillStyle = '#bfdbfe';
  x.font = '500 18px "Fredoka", sans-serif';
  x.fillText('Amos Densmore & Christopher Sholes (1873)', w / 2, 115);

  // Digraph frequency bars table
  const digraphs = [
    { pair: 'T - H', pct: '3.56%', wBar: 260, col: '#ef4444', note: 'Terpisah 180°' },
    { pair: 'H - E', pct: '3.07%', wBar: 230, col: '#f97316', note: 'Terpisah 160°' },
    { pair: 'I - N', pct: '2.43%', wBar: 185, col: '#eab308', note: 'Sisi Berlawanan' },
    { pair: 'E - R', pct: '2.05%', wBar: 160, col: '#10b981', note: 'Anti-Benturan' },
    { pair: 'A - N', pct: '1.99%', wBar: 150, col: '#06b6d4', note: 'Terdistribusi' },
    { pair: 'S - T', pct: '1.54%', wBar: 125, col: '#8b5cf6', note: 'Jalur Bebas' },
  ];

  const startY = 160;
  digraphs.forEach((d, i) => {
    const y = startY + i * 55;
    
    // Label
    x.fillStyle = '#ffffff';
    x.font = '700 22px "Lilita One", sans-serif';
    x.textAlign = 'left';
    x.fillText(d.pair, 70, y + 24);

    // Percentage
    x.fillStyle = '#93c5fd';
    x.font = '600 18px "Fredoka", sans-serif';
    x.fillText(d.pct, 150, y + 24);

    // Bar background
    x.fillStyle = '#172554';
    x.beginPath(); x.roundRect(230, y + 4, 270, 26, 6); x.fill();

    // Active Bar
    x.fillStyle = d.col;
    x.beginPath(); x.roundRect(230, y + 4, d.wBar, 26, 6); x.fill();

    // Clearance note badge
    x.fillStyle = '#ffffff';
    x.font = '600 14px "Fredoka", sans-serif';
    x.fillText(d.note, 240 + d.wBar + 12, y + 22);
  });

  // Footer summary badge
  x.fillStyle = '#10b981';
  x.beginPath();
  x.roundRect(70, h - 95, w - 140, 42, 12);
  x.fill();
  x.fillStyle = '#ffffff';
  x.font = '700 18px "Fredoka", sans-serif';
  x.textAlign = 'center';
  x.fillText('✓ Solusi: Pisahkan Tuas Sering Berpasangan ke Sisi Berseberangan', w / 2, h - 68);

  return finishCut(c, 14, { paper: '#fffdf7', edge: '#b9ad9c' });
}


// ============================================================================
// 6. 1870s Morse Telegraph Station & Operator (Spread 2)
// ============================================================================
export const TELE_W = 600, TELE_H = 750;
export function drawTelegraphOperator(outCtx, p = {}) {
  const { tap = 0 } = p;
  outCtx.clearRect(0, 0, TELE_W, TELE_H);
  const W = cv(TELE_W, TELE_H), x = W.getContext('2d');

  // Oak Desk Surface
  x.fillStyle = '#78350f';
  x.beginPath();
  x.roundRect(40, 520, TELE_W - 80, 180, 16);
  x.fill();
  x.lineWidth = LW;
  x.strokeStyle = INK;
  x.stroke();

  // Brass Telegraph Key & Sounder
  x.fillStyle = '#f59e0b';
  x.beginPath();
  x.roundRect(100, 500, 140, 35, 8);
  x.fill();
  x.stroke();

  // Telegraph Lever arm with dynamic tap offset
  const tY = 475 + tap * 10;
  x.strokeStyle = '#d97706';
  x.lineWidth = 6;
  x.beginPath();
  x.moveTo(110, 500); x.lineTo(210, tY); x.stroke();
  // Knob
  x.fillStyle = '#18181b';
  x.beginPath(); x.arc(210, tY, 14, 0, TAU); x.fill(); x.stroke();

  // Sounder Solenoid Coils
  x.fillStyle = '#991b1b';
  x.beginPath(); x.roundRect(250, 460, 30, 55, 6); x.fill(); x.stroke();
  x.beginPath(); x.roundRect(290, 460, 30, 55, 6); x.fill(); x.stroke();

  // Operator Torso: Pinstripe Vest & Rolled White Sleeves
  x.fillStyle = '#f8fafc';
  x.beginPath();
  x.roundRect(320, 320, 180, 240, 24);
  x.fill();
  x.lineWidth = LW;
  x.strokeStyle = INK;
  x.stroke();

  // Vest
  x.fillStyle = '#1e293b';
  x.beginPath();
  x.roundRect(330, 340, 160, 200, 16);
  x.fill();
  x.stroke();

  // Green Visor / Cap
  x.fillStyle = '#15803d';
  x.beginPath();
  x.ellipse(410, 180, 75, 24, 0.1, 0, TAU);
  x.fill();
  x.stroke();

  // Head
  x.fillStyle = '#fde2c7';
  x.beginPath();
  x.ellipse(410, 230, 60, 70, 0, 0, TAU);
  x.fill();
  x.stroke();

  // Eye & Pencil behind ear
  x.fillStyle = '#18181b';
  x.beginPath(); x.arc(385, 230, 6, 0, TAU); x.fill();
  x.fillStyle = '#f59e0b';
  x.lineWidth = 4;
  x.beginPath(); x.moveTo(440, 200); x.lineTo(480, 185); x.stroke();

  // Arm reaching to telegraph key
  x.strokeStyle = '#f8fafc';
  x.lineWidth = 26;
  x.lineCap = 'round';
  x.beginPath();
  x.moveTo(350, 400);
  x.quadraticCurveTo(280, 430, 215, tY + 4);
  x.stroke();
  x.strokeStyle = INK;
  x.lineWidth = 3;
  x.stroke();

  // Hand
  x.fillStyle = '#fcd3a7';
  x.beginPath(); x.ellipse(215, tY + 4, 16, 12, 0, 0, TAU); x.fill(); x.stroke();

  // Morse Tape Spool
  x.fillStyle = '#fef08a';
  x.beginPath();
  x.moveTo(280, 520);
  x.lineTo(380, 530);
  x.lineTo(460, 515);
  x.lineWidth = 6;
  x.strokeStyle = '#fef08a';
  x.stroke();

  outCtx.drawImage(finishCut(W, 14, { paper: '#fffdf7', edge: '#b9ad9c' }), 0, 0);
}

// ============================================================================
// 7. QWERTY vs Dvorak Comparison Plaque with Lock (Spread 3)
// ============================================================================
export function makeDvorakComparison(w = 640, h = 600) {
  const c = cv(w, h), x = c.getContext('2d');

  // Parchment base
  x.fillStyle = '#fef3c7';
  x.beginPath();
  x.roundRect(40, 30, w - 80, h - 60, 24);
  x.fill();
  x.lineWidth = LW;
  x.strokeStyle = '#92400e';
  x.stroke();

  // Title
  x.fillStyle = '#78350f';
  x.font = '700 28px "Lilita One", sans-serif';
  x.textAlign = 'center';
  x.fillText('PERANG TATA LETAK KEYBOARD', w / 2, 80);

  // Section 1: QWERTY (1873)
  x.fillStyle = '#f8fafc';
  x.beginPath(); x.roundRect(65, 115, w - 130, 140, 16); x.fill();
  x.lineWidth = 3; x.strokeStyle = '#cbd5e1'; x.stroke();

  x.fillStyle = '#0f172a';
  x.font = '700 22px "Lilita One", sans-serif';
  x.textAlign = 'left';
  x.fillText('QWERTY (1873)', 90, 150);

  x.fillStyle = '#ef4444';
  x.font = '700 18px "Fredoka", sans-serif';
  x.fillText('Hanya 32% ketikan di Baris Rumah (Home Row)', 90, 185);
  x.fillStyle = '#64748b';
  x.font = '500 16px "Fredoka", sans-serif';
  x.fillText('Dirancang menghindari tubrukan tuas mekanis kuno.', 90, 215);

  // Section 2: DVORAK (1936)
  x.fillStyle = '#f0fdf4';
  x.beginPath(); x.roundRect(65, 275, w - 130, 140, 16); x.fill();
  x.lineWidth = 3; x.strokeStyle = '#86efac'; x.stroke();

  x.fillStyle = '#166534';
  x.font = '700 22px "Lilita One", sans-serif';
  x.fillText('DVORAK SIMPLIFIED (1936)', 90, 310);

  x.fillStyle = '#15803d';
  x.font = '700 18px "Fredoka", sans-serif';
  x.fillText('70% ketikan di Baris Rumah · Jauh Lebih Cepat!', 90, 345);
  x.fillStyle = '#64748b';
  x.font = '500 16px "Fredoka", sans-serif';
  x.fillText('Gagal total menggantikan QWERTY di seluruh dunia.', 90, 375);

  // Lock Icon & Inevitability Badge at bottom
  x.fillStyle = '#b45309';
  x.beginPath();
  x.roundRect(70, 440, w - 140, 85, 18);
  x.fill();

  // Brass Padlock
  const lx = 120, ly = 482;
  // Shackle
  x.strokeStyle = '#fbbf24';
  x.lineWidth = 6;
  x.beginPath();
  x.arc(lx, ly - 14, 16, Math.PI, 0);
  x.stroke();
  // Body
  x.fillStyle = '#f59e0b';
  x.beginPath(); x.roundRect(lx - 22, ly - 12, 44, 38, 8); x.fill();
  x.fillStyle = '#78350f';
  x.beginPath(); x.arc(lx, ly + 4, 4, 0, TAU); x.fill();

  // Lock Text
  x.fillStyle = '#ffffff';
  x.font = '700 22px "Lilita One", sans-serif';
  x.textAlign = 'left';
  x.fillText('KUTUKAN MEMORI OTOT (PATH DEPENDENCY)', 160, 475);
  x.font = '500 16px "Fredoka", sans-serif';
  x.fillText('Miliaran jari sudah terprogram permanen sejak lahir.', 160, 502);

  return finishCut(c, 14, { paper: '#fffdf7', edge: '#b9ad9c' });
}


// ============================================================================
// 8. Global Fingers Collage (Spread 3 Epilogue)
// ============================================================================
export function makeGlobalFingers(w = 640, h = 400) {
  const c = cv(w, h), x = c.getContext('2d');

  // Modern minimalist warm wood backing
  x.fillStyle = '#1c1917';
  x.beginPath();
  x.roundRect(40, 30, w - 80, h - 60, 24);
  x.fill();
  x.lineWidth = LW;
  x.strokeStyle = '#78716c';
  x.stroke();

  // Glowing silhouettes of modern devices
  // Laptop keyboard
  x.fillStyle = '#292524';
  x.beginPath(); x.roundRect(70, 160, 220, 140, 12); x.fill();
  x.strokeStyle = '#38bdf8'; x.lineWidth = 2; x.stroke();
  x.fillStyle = '#38bdf8';
  x.font = '700 18px "Lilita One", sans-serif';
  x.textAlign = 'center';
  x.fillText('LAPTOP', 180, 240);

  // Tablet
  x.fillStyle = '#292524';
  x.beginPath(); x.roundRect(320, 130, 140, 180, 14); x.fill();
  x.strokeStyle = '#a855f7'; x.lineWidth = 2; x.stroke();
  x.fillStyle = '#a855f7';
  x.fillText('TABLET', 390, 225);

  // Smartphone
  x.fillStyle = '#292524';
  x.beginPath(); x.roundRect(485, 170, 85, 150, 14); x.fill();
  x.strokeStyle = '#34d399'; x.lineWidth = 2; x.stroke();
  x.fillStyle = '#34d399';
  x.fillText('HP', 527, 250);

  // Connecting gold pulse arcs
  x.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  x.lineWidth = 3;
  x.setLineDash([8, 6]);
  x.beginPath();
  x.moveTo(180, 160);
  x.quadraticCurveTo(300, 80, 390, 130);
  x.quadraticCurveTo(460, 80, 527, 170);
  x.stroke();
  x.setLineDash([]);

  // Epilogue Banner
  x.fillStyle = '#f59e0b';
  x.font = '700 24px "Lilita One", sans-serif';
  x.textAlign = 'center';
  x.fillText('150 TAHUN GEOMETRI MEKANIS QWERTY', w / 2, 75);
  x.fillStyle = '#e7e5e4';
  x.font = '500 16px "Fredoka", sans-serif';
  x.fillText('Dari Solusi Macet 1873 Menjadi Bahasa Digital Manusia', w / 2, 105);

  return finishCut(c, 14, { paper: '#fffdf7', edge: '#b9ad9c' });
}


// ============================================================================
// Multi-Tiered Papercraft World Building Assets & Props (PPM = 2000)
// ============================================================================
export const PPM = 2000;

// 9. Modern Studio Bookshelf (Spread 0 Background)
export function makeStudioBookshelf(hm = 0.22) {
  const h = Math.round(hm * PPM), w = Math.round(h * 0.85);
  const c = cv(w, h), x = c.getContext('2d');

  // Walnut outer bookcase
  x.fillStyle = '#1e293b';
  x.beginPath(); x.roundRect(20, 20, w - 40, h - 40, 16); x.fill();
  x.lineWidth = 6; x.strokeStyle = '#0f172a'; x.stroke();

  // 3 Shelf compartments
  const shY = [h * 0.35, h * 0.65, h - 40];
  x.strokeStyle = '#334155'; x.lineWidth = 8;
  for (let i = 0; i < 2; i++) {
    x.beginPath(); x.moveTo(25, shY[i]); x.lineTo(w - 25, shY[i]); x.stroke();
  }

  // Top shelf: colorful books + mini succulent plant
  const bookCols = ['#f43f5e', '#38bdf8', '#10b981', '#f59e0b', '#8b5cf6', '#e2e8f0'];
  let bx = 45;
  for (let i = 0; i < 6; i++) {
    const bw = 22 + (i % 3) * 6, bh = 80 + (i % 4) * 12;
    x.fillStyle = bookCols[i];
    x.beginPath(); x.roundRect(bx, shY[0] - bh, bw, bh, 4); x.fill();
    x.strokeStyle = 'rgba(0,0,0,0.25)'; x.lineWidth = 2; x.stroke();
    // Gold spine text line
    x.fillStyle = 'rgba(255,255,255,0.4)'; x.fillRect(bx + 4, shY[0] - bh + 15, bw - 8, 3);
    bx += bw + 6;
  }
  // Plant pot
  const px = w - 85, py = shY[0] - 65;
  x.fillStyle = '#f97316'; x.beginPath(); x.roundRect(px, py + 25, 45, 40, 6); x.fill();
  x.fillStyle = '#22c55e';
  for (let a = 0; a < 5; a++) {
    x.beginPath(); x.ellipse(px + 22 + (a - 2) * 8, py + 15 - Math.abs(a - 2) * 6, 8, 18, (a - 2) * 0.25, 0, TAU); x.fill();
  }

  // Middle shelf: typewriter history binder & framed icon
  x.fillStyle = '#cbd5e1';
  x.beginPath(); x.roundRect(45, shY[1] - 95, 65, 95, 6); x.fill();
  x.fillStyle = '#1e3a8a'; x.font = '700 16px "Lilita One"'; x.textAlign = 'center';
  x.fillText('1873', 77, shY[1] - 50);

  // Framed patent badge
  x.fillStyle = '#fef08a';
  x.beginPath(); x.roundRect(140, shY[1] - 85, 75, 85, 6); x.fill();
  x.strokeStyle = '#ca8a04'; x.lineWidth = 4; x.stroke();
  x.fillStyle = '#854d0e'; x.font = '700 24px "Lilita One"'; x.fillText('Q', 177, shY[1] - 40);

  // Bottom shelf: horizontal stacked thick textbooks
  const stCols = ['#0284c7', '#059669', '#d97706'];
  let sy = shY[2] - 15;
  for (let i = 0; i < 3; i++) {
    x.fillStyle = stCols[i];
    x.beginPath(); x.roundRect(50, sy - 24, 160, 24, 4); x.fill();
    x.strokeStyle = 'rgba(0,0,0,0.3)'; x.lineWidth = 2; x.stroke();
    sy -= 28;
  }

  const out = finishCut(c, 14, { paper: '#fffdf7', edge: '#b9ad9c' });
  return { c: out, w: w / PPM, h: hm, ax: 0.5, ay: 0.98 };
}

// 10. Modern Drafting Anglepoise Lamp (Spread 0 Midground)
export function makeDraftingLamp(hm = 0.18) {
  const h = Math.round(hm * PPM), w = Math.round(h * 0.65);
  const c = cv(w, h), x = c.getContext('2d');

  // Heavy stepped circular base
  const bx = w * 0.35, by = h - 35;
  x.fillStyle = '#0f172a';
  x.beginPath(); x.roundRect(bx - 40, by, 80, 25, 8); x.fill();
  x.fillStyle = '#d97706';
  x.beginPath(); x.arc(bx, by, 12, 0, TAU); x.fill();

  // Dual scissor cantilever arms (graphite with brass pivot pins)
  const j1x = bx + 40, j1y = h * 0.52;
  const j2x = bx + 10, j2y = h * 0.22;

  x.strokeStyle = '#1e293b'; x.lineWidth = 8; x.lineCap = 'round';
  x.beginPath(); x.moveTo(bx, by); x.lineTo(j1x, j1y); x.lineTo(j2x, j2y); x.stroke();

  // Tension springs
  x.strokeStyle = '#94a3b8'; x.lineWidth = 2;
  x.beginPath(); x.moveTo(bx + 10, by - 10); x.lineTo(j1x - 5, j1y + 10); x.stroke();

  // Brass joint pivots
  x.fillStyle = '#f59e0b';
  x.beginPath(); x.arc(j1x, j1y, 9, 0, TAU); x.fill();
  x.beginPath(); x.arc(j2x, j2y, 8, 0, TAU); x.fill();

  // Conical lampshade
  const headX = j2x + 45, headY = j2y + 30;
  x.save();
  x.translate(j2x, j2y);
  x.rotate(0.45);
  x.fillStyle = '#0f172a';
  x.beginPath();
  x.moveTo(0, -15); x.lineTo(70, -35); x.lineTo(75, 35); x.lineTo(0, 15);
  x.closePath(); x.fill();
  x.strokeStyle = '#334155'; x.lineWidth = 4; x.stroke();

  // Inner warm lamp glow
  const glow = x.createRadialGradient(50, 0, 5, 50, 0, 50);
  glow.addColorStop(0, '#ffffff');
  glow.addColorStop(0.4, '#fef08a');
  glow.addColorStop(1, 'rgba(250, 204, 21, 0)');
  x.fillStyle = glow;
  x.beginPath(); x.ellipse(72, 0, 14, 32, 0, 0, TAU); x.fill();
  x.restore();

  const out = finishCut(c, 14, { paper: '#fffdf7', edge: '#b9ad9c' });
  return { c: out, w: w / PPM, h: hm, ax: 0.35, ay: 0.98 };
}

// 11. Cork Pinboard with Sticky Notes (Spread 0 Midground)
export function makeStickyNotesBoard(hm = 0.16) {
  const h = Math.round(hm * PPM), w = Math.round(h * 1.35);
  const c = cv(w, h), x = c.getContext('2d');

  // Pine wood frame
  x.fillStyle = '#b45309';
  x.beginPath(); x.roundRect(15, 15, w - 30, h - 30, 12); x.fill();

  // Cork bulletin surface
  x.fillStyle = '#d97706';
  x.beginPath(); x.roundRect(28, 28, w - 56, h - 56, 8); x.fill();

  // Yellow sticky note
  x.save(); x.translate(55, 50); x.rotate(-0.06);
  x.fillStyle = '#fef08a'; x.fillRect(0, 0, 110, 105);
  x.fillStyle = '#ef4444'; x.beginPath(); x.arc(55, 10, 6, 0, TAU); x.fill(); // pin
  x.fillStyle = '#1e293b'; x.font = '700 15px "Fredoka"';
  x.fillText('Kenapa Huruf', 12, 45);
  x.fillText('Acak? 🤔', 12, 70);
  x.restore();

  // Cyan sticky note
  x.save(); x.translate(195, 60); x.rotate(0.08);
  x.fillStyle = '#a5f3fc'; x.fillRect(0, 0, 115, 110);
  x.fillStyle = '#3b82f6'; x.beginPath(); x.arc(58, 10, 6, 0, TAU); x.fill(); // pin
  x.fillStyle = '#0f172a'; x.font = '700 14px "Fredoka"';
  x.fillText('Bukan Mitos!', 10, 45);
  x.fillText('Tapi Solusi Macet', 10, 70);
  x.fillText('1873', 10, 92);
  x.restore();

  // Diagram sketch note
  x.save(); x.translate(110, 160); x.rotate(0.02);
  x.fillStyle = '#ffffff'; x.fillRect(0, 0, 130, 95);
  x.strokeStyle = '#ef4444'; x.lineWidth = 3;
  x.beginPath(); x.moveTo(25, 45); x.lineTo(55, 65); x.lineTo(25, 85); x.stroke(); // clash icon
  x.beginPath(); x.moveTo(105, 45); x.lineTo(75, 65); x.lineTo(105, 85); x.stroke();
  x.fillStyle = '#ef4444'; x.font = '700 13px "Lilita One"'; x.fillText('JAM!', 50, 30);
  x.restore();

  const out = finishCut(c, 14, { paper: '#fffdf7', edge: '#b9ad9c' });
  return { c: out, w: w / PPM, h: hm, ax: 0.5, ay: 0.98 };
}

// 12. Hanging Edison Idea Bulb (Spread 0 Suspended on Thread)
export function makeIdeaBulb(hm = 0.11) {
  const h = Math.round(hm * PPM), w = Math.round(h * 0.65);
  const c = cv(w, h), x = c.getContext('2d');

  const cx = w / 2, cy = h * 0.58, r = w * 0.36;

  // Brass screw cap at top
  x.fillStyle = '#d97706';
  x.beginPath(); x.roundRect(cx - 20, 20, 40, 35, 6); x.fill();
  x.strokeStyle = '#78350f'; x.lineWidth = 3;
  for (let i = 28; i < 50; i += 7) { x.beginPath(); x.moveTo(cx - 18, i); x.lineTo(cx + 18, i); x.stroke(); }

  // Glass bulb teardrop
  x.fillStyle = 'rgba(254, 240, 138, 0.45)';
  x.beginPath();
  x.arc(cx, cy, r, -0.4, Math.PI + 0.4);
  x.lineTo(cx - 18, 55);
  x.lineTo(cx + 18, 55);
  x.closePath();
  x.fill();
  x.lineWidth = 5; x.strokeStyle = '#ca8a04'; x.stroke();

  // Glowing amber tungsten squirrel-cage filament
  x.strokeStyle = '#f59e0b'; x.lineWidth = 4;
  x.beginPath();
  x.moveTo(cx - 10, 65); x.lineTo(cx - 10, cy - 10);
  x.lineTo(cx - 18, cy + 15); x.lineTo(cx, cy - 5);
  x.lineTo(cx + 18, cy + 15); x.lineTo(cx + 10, cy - 10);
  x.lineTo(cx + 10, 65);
  x.stroke();

  // Core radial filament glow
  const g = x.createRadialGradient(cx, cy, 5, cx, cy, 65);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(0.3, '#fef08a');
  g.addColorStop(1, 'rgba(254, 240, 138, 0)');
  x.fillStyle = g; x.beginPath(); x.arc(cx, cy, 65, 0, TAU); x.fill();

  const out = finishCut(c, 14, { paper: '#fffdf7', edge: '#b9ad9c' });
  return { c: out, w: w / PPM, h: hm, ax: 0.5, ay: 0.2 }; // hanging anchor near top
}

// 13. Modern Paper Coffee Cup & Drafting Tools (Spread 0 Foreground)
export function makeDeskCoffeeAndTools(hm = 0.075) {
  const h = Math.round(hm * PPM), w = Math.round(h * 1.8);
  const c = cv(w, h), x = c.getContext('2d');

  // Coffee cup with sleeve
  const cx = 65, cy = h - 20;
  x.fillStyle = '#f8fafc';
  x.beginPath();
  x.moveTo(cx - 32, cy - 90); x.lineTo(cx + 32, cy - 90);
  x.lineTo(cx + 24, cy); x.lineTo(cx - 24, cy);
  x.closePath(); x.fill();
  x.strokeStyle = '#cbd5e1'; x.lineWidth = 3; x.stroke();

  // Ribbed kraft cardboard sleeve
  x.fillStyle = '#b45309';
  x.beginPath();
  x.moveTo(cx - 29, cy - 65); x.lineTo(cx + 29, cy - 65);
  x.lineTo(cx + 25, cy - 25); x.lineTo(cx - 25, cy - 25);
  x.closePath(); x.fill();

  // Plastic sipping lid
  x.fillStyle = '#e2e8f0';
  x.beginPath(); x.roundRect(cx - 35, cy - 98, 70, 12, 4); x.fill();

  // Drafting pencil (yellow hexagonal HB)
  x.save();
  x.translate(cx + 70, cy - 15);
  x.rotate(-0.15);
  x.fillStyle = '#eab308'; x.fillRect(0, -6, 120, 12); // body
  x.fillStyle = '#cbd5e1'; x.fillRect(120, -6, 15, 12); // ferrule
  x.fillStyle = '#f43f5e'; x.fillRect(135, -6, 18, 12); // pink eraser
  // Sharpened wood tip + graphite
  x.fillStyle = '#fed7aa';
  x.beginPath(); x.moveTo(0, -6); x.lineTo(-24, 0); x.lineTo(0, 6); x.closePath(); x.fill();
  x.fillStyle = '#1e293b';
  x.beginPath(); x.moveTo(-14, -3.5); x.lineTo(-24, 0); x.lineTo(-14, 3.5); x.closePath(); x.fill();
  x.restore();

  const out = finishCut(c, 14, { paper: '#fffdf7', edge: '#b9ad9c' });
  return { c: out, w: w / PPM, h: hm, ax: 0.4, ay: 0.98 };
}

// 14. 1873 Victorian Factory Brick Arch Facade (Spread 1 Background Wall)
export function makeFactoryBrickArch(hm = 0.26) {
  const h = Math.round(hm * PPM), w = Math.round(h * 1.45);
  const c = cv(w, h), x = c.getContext('2d');

  // Red-ochre Victorian brick facade
  x.fillStyle = '#451a03';
  x.beginPath(); x.roundRect(20, 20, w - 40, h - 35, 18); x.fill();

  // Brick rows
  const bh = 22, bw = 55;
  x.strokeStyle = 'rgba(0,0,0,0.35)'; x.lineWidth = 2.5;
  for (let y = 30; y < h - 40; y += bh) {
    x.beginPath(); x.moveTo(25, y); x.lineTo(w - 25, y); x.stroke();
    const off = ((y / bh) % 2) * (bw / 2);
    for (let bx = 25 + off; bx < w - 25; bx += bw) {
      x.beginPath(); x.moveTo(bx, y); x.lineTo(bx, y + bh); x.stroke();
    }
  }

  // Large arched window cutout in center
  const wx = w / 2, wy = h * 0.52, ww = w * 0.54, wh = h * 0.65;
  x.save();
  x.beginPath();
  x.moveTo(wx - ww / 2, wy + wh / 2);
  x.lineTo(wx - ww / 2, wy - wh * 0.2);
  x.arc(wx, wy - wh * 0.2, ww / 2, Math.PI, 0);
  x.lineTo(wx + ww / 2, wy + wh / 2);
  x.closePath();
  // Daylight sky through window
  const wGrad = x.createLinearGradient(0, wy - wh / 2, 0, wy + wh / 2);
  wGrad.addColorStop(0, '#fef08a');
  wGrad.addColorStop(0.6, '#fed7aa');
  wGrad.addColorStop(1, '#ffedd5');
  x.fillStyle = wGrad; x.fill();
  x.lineWidth = 10; x.strokeStyle = '#1e1b4b'; x.stroke();

  // Window mullions (12-pane industrial glass)
  x.strokeStyle = '#1e1b4b'; x.lineWidth = 5;
  // Verticals
  x.beginPath(); x.moveTo(wx - ww * 0.22, wy - wh * 0.35); x.lineTo(wx - ww * 0.22, wy + wh / 2); x.stroke();
  x.beginPath(); x.moveTo(wx, wy - wh * 0.48); x.lineTo(wx, wy + wh / 2); x.stroke();
  x.beginPath(); x.moveTo(wx + ww * 0.22, wy - wh * 0.35); x.lineTo(wx + ww * 0.22, wy + wh / 2); x.stroke();
  // Horizontals
  for (let k = -1; k <= 2; k++) {
    const hy = wy + k * (wh * 0.18);
    x.beginPath(); x.moveTo(wx - ww / 2 + 5, hy); x.lineTo(wx + ww / 2 - 5, hy); x.stroke();
  }
  x.restore();

  // Steam pipe along top with valve wheel
  x.fillStyle = '#57534e';
  x.fillRect(25, 35, w - 50, 16);
  x.fillStyle = '#b45309';
  x.beginPath(); x.arc(w * 0.82, 43, 18, 0, TAU); x.fill();
  x.fillStyle = '#1c1917';
  x.beginPath(); x.arc(w * 0.82, 43, 6, 0, TAU); x.fill();

  const out = finishCut(c, 14, { paper: '#fffdf7', edge: '#b9ad9c' });
  return { c: out, w: w / PPM, h: hm, ax: 0.5, ay: 0.98 };
}

// 15. Heavy Victorian Machinist Workbench with Vise & Tools (Spread 1 Midground)
export function makeMachinistWorkbench(hm = 0.15) {
  const h = Math.round(hm * PPM), w = Math.round(h * 1.55);
  const c = cv(w, h), x = c.getContext('2d');

  // Dark timber benchtop
  x.fillStyle = '#291102';
  x.beginPath(); x.roundRect(30, h * 0.35, w - 60, 35, 6); x.fill();
  x.lineWidth = 4; x.strokeStyle = '#180a02'; x.stroke();

  // Heavy cast-iron trestle legs
  x.fillStyle = '#1c1917';
  x.fillRect(55, h * 0.35 + 35, 30, h * 0.55);
  x.fillRect(w - 85, h * 0.35 + 35, 30, h * 0.55);
  // Cross brace
  x.fillRect(55, h * 0.72, w - 110, 18);

  // Bench screw vise mounted on left corner
  const vx = 80, vy = h * 0.35;
  x.fillStyle = '#3f3f46';
  x.beginPath(); x.roundRect(vx - 25, vy - 45, 50, 45, 6); x.fill();
  // Vise jaws
  x.fillStyle = '#71717a';
  x.fillRect(vx - 20, vy - 55, 18, 15);
  x.fillRect(vx + 2, vy - 55, 18, 15);
  // Screw handle
  x.fillStyle = '#d4d4d8';
  x.fillRect(vx - 35, vy - 25, 70, 8);
  x.beginPath(); x.arc(vx - 35, vy - 21, 8, 0, TAU); x.fill();
  x.beginPath(); x.arc(vx + 35, vy - 21, 8, 0, TAU); x.fill();

  // Antique brass oil can with long spout on right
  const ox = w - 90, oy = h * 0.35;
  x.fillStyle = '#d97706';
  x.beginPath(); x.ellipse(ox, oy - 18, 22, 18, 0, 0, TAU); x.fill();
  x.strokeStyle = '#b45309'; x.lineWidth = 3; x.stroke();
  // Curved spout
  x.strokeStyle = '#d97706'; x.lineWidth = 5; x.lineCap = 'round';
  x.beginPath(); x.moveTo(ox, oy - 30); x.quadraticCurveTo(ox - 10, oy - 70, ox - 35, oy - 80); x.stroke();

  // Machinist ball-peen hammer resting on benchtop
  x.fillStyle = '#78350f';
  x.fillRect(w * 0.42, vy - 14, 75, 8); // handle
  x.fillStyle = '#52525b';
  x.beginPath(); x.roundRect(w * 0.42 - 12, vy - 24, 24, 20, 4); x.fill();

  const out = finishCut(c, 14, { paper: '#fffdf7', edge: '#b9ad9c' });
  return { c: out, w: w / PPM, h: hm, ax: 0.5, ay: 0.98 };
}

// 16. Victorian Brass Gaslight Lantern (Spread 1 Midground / Suspended)
export function makeGaslightLantern(hm = 0.17) {
  const h = Math.round(hm * PPM), w = Math.round(h * 0.55);
  const c = cv(w, h), x = c.getContext('2d');

  const cx = w / 2, cy = h * 0.55;

  // Wrought iron ornate bracket
  x.strokeStyle = '#18181b'; x.lineWidth = 6; x.lineCap = 'round';
  x.beginPath(); x.moveTo(20, 30); x.lineTo(cx, 30); x.lineTo(cx, cy - 45); x.stroke();
  x.beginPath(); x.arc(cx - 20, 50, 16, 0, Math.PI); x.stroke();

  // Brass lantern cap with pointed finial
  x.fillStyle = '#b45309';
  x.beginPath();
  x.moveTo(cx, cy - 65); x.lineTo(cx + 42, cy - 40); x.lineTo(cx - 42, cy - 40);
  x.closePath(); x.fill();
  x.strokeStyle = '#78350f'; x.lineWidth = 3; x.stroke();

  // Glass lantern housing (tapering downwards)
  x.fillStyle = 'rgba(254, 243, 199, 0.45)';
  x.beginPath();
  x.moveTo(cx - 40, cy - 40); x.lineTo(cx + 40, cy - 40);
  x.lineTo(cx + 28, cy + 45); x.lineTo(cx - 28, cy + 45);
  x.closePath(); x.fill();
  x.strokeStyle = '#b45309'; x.lineWidth = 4; x.stroke();

  // Flickering yellow fishtail gas flame inside
  const g = x.createRadialGradient(cx, cy, 3, cx, cy, 35);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(0.35, '#f59e0b');
  g.addColorStop(1, 'rgba(245, 158, 11, 0)');
  x.fillStyle = g;
  x.beginPath(); x.arc(cx, cy, 35, 0, TAU); x.fill();

  x.fillStyle = '#fef08a';
  x.beginPath();
  x.moveTo(cx - 7, cy + 15);
  x.quadraticCurveTo(cx - 12, cy - 10, cx, cy - 25);
  x.quadraticCurveTo(cx + 12, cy - 10, cx + 7, cy + 15);
  x.closePath(); x.fill();

  // Brass bottom base
  x.fillStyle = '#b45309';
  x.beginPath(); x.roundRect(cx - 25, cy + 45, 50, 18, 4); x.fill();

  const out = finishCut(c, 14, { paper: '#fffdf7', edge: '#b9ad9c' });
  return { c: out, w: w / PPM, h: hm, ax: 0.5, ay: 0.25 };
}

// 17. 1873 Typebar Linkage Patent Drafting Scroll (Spread 1 Background)
export function makePatentScrollWall(hm = 0.20) {
  const h = Math.round(hm * PPM), w = Math.round(h * 0.8);
  const c = cv(w, h), x = c.getContext('2d');

  // Parchment paper sheet
  x.fillStyle = '#fef3c7';
  x.beginPath(); x.roundRect(25, 25, w - 50, h - 50, 10); x.fill();
  x.strokeStyle = '#b45309'; x.lineWidth = 4; x.stroke();

  // Technical schematic in dark sepia ink
  x.strokeStyle = '#78350f'; x.lineWidth = 3;
  // Circular basket radius arc
  x.beginPath(); x.arc(w / 2, h * 0.45, w * 0.28, Math.PI * 0.2, Math.PI * 0.8); x.stroke();
  // Radial linkage arms
  for (let a = 0.3; a <= 0.7; a += 0.08) {
    const ang = Math.PI * a;
    x.beginPath();
    x.moveTo(w / 2 + Math.cos(ang) * (w * 0.28), h * 0.45 + Math.sin(ang) * (w * 0.28));
    x.lineTo(w / 2, h * 0.45);
    x.stroke();
  }

  // Clash warning annotation
  x.fillStyle = '#dc2626';
  x.font = '700 16px "Lilita One"'; x.textAlign = 'center';
  x.fillText('CRITICAL JAM POINT!', w / 2, h * 0.78);

  // Red wax seal at bottom
  x.fillStyle = '#b91c1c';
  x.beginPath(); x.arc(w * 0.75, h * 0.82, 18, 0, TAU); x.fill();

  const out = finishCut(c, 14, { paper: '#fffdf7', edge: '#b9ad9c' });
  return { c: out, w: w / PPM, h: hm, ax: 0.5, ay: 0.98 };
}

// 18. Western Union Telegraph Central Switchboard (Spread 2 Background Wall)
export function makeTelegraphSwitchboard(hm = 0.24) {
  const h = Math.round(hm * PPM), w = Math.round(h * 1.25);
  const c = cv(w, h), x = c.getContext('2d');

  // Polished mahogany casing
  x.fillStyle = '#291102';
  x.beginPath(); x.roundRect(20, 20, w - 40, h - 40, 16); x.fill();
  x.lineWidth = 6; x.strokeStyle = '#180a02'; x.stroke();

  // Header brass title plaque
  x.fillStyle = '#d97706';
  x.beginPath(); x.roundRect(w / 2 - 130, 35, 260, 32, 6); x.fill();
  x.fillStyle = '#1c1917'; x.font = '700 16px "Lilita One"'; x.textAlign = 'center';
  x.fillText('WESTERN UNION TELEGRAPH CO.', w / 2, 57);

  // Large brass galvanometer with glass dial
  const gx = w * 0.28, gy = h * 0.42;
  x.fillStyle = '#fef3c7';
  x.beginPath(); x.arc(gx, gy, 45, 0, TAU); x.fill();
  x.lineWidth = 6; x.strokeStyle = '#b45309'; x.stroke();
  // Dial ticks & indicator needle
  x.strokeStyle = '#1c1917'; x.lineWidth = 2;
  for (let a = -0.8; a <= 0.8; a += 0.2) {
    x.beginPath();
    x.moveTo(gx + Math.sin(a) * 35, gy - Math.cos(a) * 35);
    x.lineTo(gx + Math.sin(a) * 42, gy - Math.cos(a) * 42);
    x.stroke();
  }
  // Red needle
  x.strokeStyle = '#dc2626'; x.lineWidth = 3;
  x.beginPath(); x.moveTo(gx, gy); x.lineTo(gx + 22, gy - 28); x.stroke();

  // Jack plug matrix grid on the right
  const mx = w * 0.52, my = h * 0.25;
  for (let r = 0; r < 5; r++) {
    for (let col = 0; col < 6; col++) {
      const px = mx + col * 26, py = my + r * 28;
      x.fillStyle = '#b45309';
      x.beginPath(); x.arc(px, py, 7, 0, TAU); x.fill();
      x.fillStyle = '#0f172a';
      x.beginPath(); x.arc(px, py, 3.5, 0, TAU); x.fill();
    }
  }

  // Braided colored patch cords connecting jacks
  x.lineWidth = 4; x.lineCap = 'round';
  x.strokeStyle = '#ef4444';
  x.beginPath(); x.moveTo(mx + 26, my + 28); x.quadraticCurveTo(mx + 60, my + 130, mx + 104, my + 84); x.stroke();
  x.strokeStyle = '#eab308';
  x.beginPath(); x.moveTo(mx + 52, my); x.quadraticCurveTo(mx + 10, my + 110, mx + 78, my + 112); x.stroke();

  const out = finishCut(c, 14, { paper: '#fffdf7', edge: '#b9ad9c' });
  return { c: out, w: w / PPM, h: hm, ax: 0.5, ay: 0.98 };
}

// 19. Cedar Telegraph Pole with Insulator Crossbars (Spread 2 Midground)
export function makeTelegraphPole(hm = 0.26) {
  const h = Math.round(hm * PPM), w = Math.round(h * 0.55);
  const c = cv(w, h), x = c.getContext('2d');

  const cx = w / 2;

  // Wooden cedar pole trunk
  x.fillStyle = '#451a03';
  x.fillRect(cx - 14, 40, 28, h - 50);
  x.strokeStyle = '#291102'; x.lineWidth = 3;
  x.strokeRect(cx - 14, 40, 28, h - 50);

  // Two horizontal cross-arms
  const armsY = [80, 140];
  for (const ay of armsY) {
    x.fillStyle = '#78350f';
    x.fillRect(cx - 65, ay, 130, 16);
    x.strokeStyle = '#291102'; x.lineWidth = 2.5; x.strokeRect(cx - 65, ay, 130, 16);

    // Green glass bell insulators
    const insX = [cx - 52, cx - 22, cx + 22, cx + 52];
    for (const ix of insX) {
      x.fillStyle = '#059669';
      x.beginPath(); x.roundRect(ix - 7, ay - 14, 14, 14, 4); x.fill();
      x.strokeStyle = '#047857'; x.lineWidth = 1.5; x.stroke();
    }
  }

  // Hanging wire loops
  x.strokeStyle = '#1c1917'; x.lineWidth = 2.5;
  x.beginPath(); x.moveTo(cx - 52, 66); x.quadraticCurveTo(cx - 37, 76, cx - 22, 66); x.stroke();
  x.beginPath(); x.moveTo(cx + 22, 66); x.quadraticCurveTo(cx + 37, 76, cx + 52, 66); x.stroke();

  const out = finishCut(c, 14, { paper: '#fffdf7', edge: '#b9ad9c' });
  return { c: out, w: w / PPM, h: hm, ax: 0.5, ay: 0.98 };
}

// 20. Antique Telegraph Sounder Desk with Ticker Tape (Spread 2 Midground)
export function makeMorseTickerDesk(hm = 0.14) {
  const h = Math.round(hm * PPM), w = Math.round(h * 1.5);
  const c = cv(w, h), x = c.getContext('2d');

  // Green felt mahogany desk
  x.fillStyle = '#064e3b';
  x.beginPath(); x.roundRect(25, h * 0.42, w - 50, 30, 6); x.fill();
  x.lineWidth = 5; x.strokeStyle = '#291102'; x.stroke();

  // Brass Morse sounder on mahogany sounding base
  const sx = 95, sy = h * 0.42;
  x.fillStyle = '#451a03';
  x.beginPath(); x.roundRect(sx - 35, sy - 14, 70, 14, 4); x.fill();
  // Twin brass electromagnet coils
  x.fillStyle = '#b45309';
  x.fillRect(sx - 24, sy - 42, 18, 28);
  x.fillRect(sx + 6, sy - 42, 18, 28);
  // Sounder anvil arm
  x.fillStyle = '#d97706';
  x.fillRect(sx - 28, sy - 48, 56, 8);

  // Spilling white ticker-tape ribbon across the desk
  x.strokeStyle = '#f8fafc'; x.lineWidth = 12; x.lineCap = 'round';
  x.beginPath();
  x.moveTo(sx + 35, sy - 20);
  x.quadraticCurveTo(w * 0.55, sy - 5, w * 0.72, sy + 15);
  x.quadraticCurveTo(w * 0.88, sy + 35, w - 25, sy + 45);
  x.stroke();

  // Printed dots and dashes on tape
  x.strokeStyle = '#1e293b'; x.lineWidth = 3;
  x.beginPath();
  x.moveTo(w * 0.60, sy + 2); x.lineTo(w * 0.65, sy + 7);
  x.moveTo(w * 0.75, sy + 20); x.lineTo(w * 0.82, sy + 28);
  x.stroke();

  const out = finishCut(c, 14, { paper: '#fffdf7', edge: '#b9ad9c' });
  return { c: out, w: w / PPM, h: hm, ax: 0.5, ay: 0.98 };
}

// 21. Statistical Letter Digraph Blackboard (Spread 2 Midground / Background)
export function makeDigraphBlackboard(hm = 0.18) {
  const h = Math.round(hm * PPM), w = Math.round(h * 1.35);
  const c = cv(w, h), x = c.getContext('2d');

  // Oak frame
  x.fillStyle = '#78350f';
  x.beginPath(); x.roundRect(15, 15, w - 30, h - 30, 10); x.fill();

  // Dark slate blackboard surface
  x.fillStyle = '#1e293b';
  x.beginPath(); x.roundRect(26, 26, w - 52, h - 52, 6); x.fill();

  // White chalk title
  x.fillStyle = '#f8fafc';
  x.font = '700 16px "Lilita One"'; x.textAlign = 'center';
  x.fillText('MATRIKS FREKUENSI PASANGAN HURUF', w / 2, 55);

  // Digraph frequency bars (TH, ER, IN, HE)
  const pairs = [
    { p: 'T - H', pct: 90, col: '#ef4444' },
    { p: 'E - R', pct: 75, col: '#f59e0b' },
    { p: 'I - N', pct: 65, col: '#38bdf8' },
    { p: 'H - E', pct: 60, col: '#10b981' }
  ];

  let py = 85;
  for (const item of pairs) {
    x.fillStyle = '#f8fafc'; x.font = '700 14px "Fredoka"'; x.textAlign = 'left';
    x.fillText(item.p, 42, py + 12);

    // Chalk bar
    x.fillStyle = item.col;
    x.beginPath(); x.roundRect(95, py, (w - 150) * (item.pct / 100), 16, 4); x.fill();
    py += 26;
  }

  // Chalk separation formula
  x.fillStyle = '#fef08a'; x.font = 'italic 14px "IM Fell English"'; x.textAlign = 'center';
  x.fillText('Pemisahan Sudut Tuas: Δθ >= 90° (Anti-Jam)', w / 2, h - 42);

  const out = finishCut(c, 14, { paper: '#fffdf7', edge: '#b9ad9c' });
  return { c: out, w: w / PPM, h: hm, ax: 0.5, ay: 0.98 };
}

// 22. 1878 Remington Typewriter Display Pedestal (Spread 3 Midground)
export function makeRemingtonPedestal(hm = 0.18) {
  const h = Math.round(hm * PPM), w = Math.round(h * 1.25);
  const c = cv(w, h), x = c.getContext('2d');

  // Fluted mahogany pedestal column
  x.fillStyle = '#291102';
  x.beginPath(); x.roundRect(40, h * 0.35, w - 80, h * 0.6, 10); x.fill();
  x.lineWidth = 5; x.strokeStyle = '#180a02'; x.stroke();

  // Crimson velvet runner draped over top
  x.fillStyle = '#881337';
  x.beginPath();
  x.moveTo(25, h * 0.35); x.lineTo(w - 25, h * 0.35);
  x.lineTo(w - 35, h * 0.58); x.lineTo(w - 55, h * 0.50);
  x.lineTo(55, h * 0.50); x.lineTo(35, h * 0.58);
  x.closePath(); x.fill();

  // Gold fringes on velvet
  x.strokeStyle = '#f59e0b'; x.lineWidth = 4;
  x.beginPath(); x.moveTo(35, h * 0.58); x.lineTo(w - 35, h * 0.58); x.stroke();

  // Brass commemorative plaque in center
  const px = w / 2, py = h * 0.72;
  x.fillStyle = '#d97706';
  x.beginPath(); x.roundRect(px - 95, py - 24, 190, 48, 6); x.fill();
  x.strokeStyle = '#b45309'; x.lineWidth = 3; x.stroke();

  x.fillStyle = '#1c1917'; x.font = '700 13px "Lilita One"'; x.textAlign = 'center';
  x.fillText('E. REMINGTON & SONS', px, py - 4);
  x.font = '500 11px "Fredoka"';
  x.fillText('Standard No. 2 (1878) - QWERTY', px, py + 14);

  const out = finishCut(c, 14, { paper: '#fffdf7', edge: '#b9ad9c' });
  return { c: out, w: w / PPM, h: hm, ax: 0.5, ay: 0.98 };
}

// 23. Individual 3D Typewriter / Keyboard Key (Foreground Tactile Element)
export function makeScatteredKeycap(letter = 'Q', hm = 0.032, isVintage = true) {
  const h = Math.round(hm * PPM), w = h;
  const c = cv(w, h), x = c.getContext('2d');

  const cx = w / 2, cy = h / 2, r = w * 0.42;

  if (isVintage) {
    // Polished brass outer rim
    x.fillStyle = '#d97706';
    x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.fill();
    x.lineWidth = 4; x.strokeStyle = '#b45309'; x.stroke();

    // Ivory celluloid center
    x.fillStyle = '#fefce8';
    x.beginPath(); x.arc(cx, cy, r - 6, 0, TAU); x.fill();

    // Bold serif letter
    x.fillStyle = '#1c1917';
    x.font = '700 28px "Lilita One"';
    x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText(letter, cx, cy + 1);
  } else {
    // Modern sleek chiclet key
    x.fillStyle = '#1e293b';
    x.beginPath(); x.roundRect(6, 6, w - 12, h - 12, 10); x.fill();
    x.strokeStyle = '#334155'; x.lineWidth = 2.5; x.stroke();

    x.fillStyle = '#f8fafc';
    x.font = '700 24px "Fredoka"';
    x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText(letter, cx, cy);
  }

  const out = finishCut(c, 8, { paper: '#fffdf7', edge: '#b9ad9c' });
  return { c: out, w: w / PPM, h: hm, ax: 0.5, ay: 0.95 };
}



// ============================================================================
// PASAR BARU (1820 - 2035+) PAPER CRAFT ASSETS & PROPS (PPM = 2000)
// ============================================================================

// 1. Neoclassical Colonial Gateway: Passer Baroe 1820 (Spread 0)
export function makePasserBaroeGate(hm = 0.24) {
  const h = Math.round(hm * PPM), w = Math.round(h * 1.35);
  const c = cv(w, h), x = c.getContext('2d');

  // Neoclassical Arch Gateway in warm antique colonial ivory and red brick
  // Twin brick pillars
  const pillarW = w * 0.18, pillarH = h * 0.72;
  const leftX = w * 0.12, rightX = w * 0.70, baseY = h * 0.95;

  // Brick pillars with mortar lines
  [leftX, rightX].forEach(px => {
    x.fillStyle = '#991b1b'; // weathered Batavia terracotta red brick
    x.fillRect(px, baseY - pillarH, pillarW, pillarH);
    // Classical stone base plinth
    x.fillStyle = '#e2e8f0';
    x.fillRect(px - 10, baseY - 35, pillarW + 20, 35);
    x.strokeStyle = '#64748b'; x.lineWidth = 3; x.strokeRect(px - 10, baseY - 35, pillarW + 20, 35);
    
    // Brick mortar lines
    x.strokeStyle = 'rgba(254, 243, 199, 0.4)'; x.lineWidth = 2;
    for (let by = baseY - pillarH + 15; by < baseY - 35; by += 18) {
      x.beginPath(); x.moveTo(px, by); x.lineTo(px + pillarW, by); x.stroke();
    }
    // Classical capital / cornice on pillar top
    x.fillStyle = '#f1f5f9';
    x.fillRect(px - 8, baseY - pillarH - 24, pillarW + 16, 24);
    x.strokeStyle = '#475569'; x.lineWidth = 3; x.strokeRect(px - 8, baseY - pillarH - 24, pillarW + 16, 24);

    // Wrought-iron gas lantern sconce on pillar
    const lx = px + pillarW * 0.5, ly = baseY - pillarH * 0.55;
    x.strokeStyle = '#1e293b'; x.lineWidth = 4;
    x.beginPath(); x.moveTo(px + (px === leftX ? pillarW : 0), ly); x.lineTo(lx, ly - 20); x.stroke();
    // Glowing lantern glass
    const gLamp = x.createRadialGradient(lx, ly - 20, 4, lx, ly - 20, 24);
    gLamp.addColorStop(0, '#fef08a'); gLamp.addColorStop(0.7, '#f59e0b'); gLamp.addColorStop(1, 'rgba(245, 158, 11, 0)');
    x.fillStyle = gLamp; x.beginPath(); x.arc(lx, ly - 20, 24, 0, TAU); x.fill();
    x.fillStyle = '#fffbeb'; x.beginPath(); x.arc(lx, ly - 20, 8, 0, TAU); x.fill();
    x.strokeRect(lx - 10, ly - 32, 20, 24);
  });

  // Central triumphal arch span
  const archL = leftX + pillarW, archR = rightX, archW = archR - archL;
  const archSpringY = baseY - pillarH + 10;
  
  // Arch masonry opening
  x.fillStyle = '#f8fafc';
  x.beginPath();
  x.moveTo(archL, baseY);
  x.lineTo(archL, archSpringY);
  x.bezierCurveTo(archL + archW * 0.15, archSpringY - archW * 0.55, archR - archW * 0.15, archSpringY - archW * 0.55, archR, archSpringY);
  x.lineTo(archR, baseY);
  x.closePath();
  // Spandrel wall above arch
  x.fillStyle = '#f1f5f9';
  x.fillRect(archL, baseY - pillarH - 24, archW, pillarH + 24 - (baseY - archSpringY));

  // Massive Entablature and Classical Pediment
  const entabY = baseY - pillarH - 75, entabH = 50;
  x.fillStyle = '#e2e8f0';
  x.fillRect(leftX - 20, entabY, (rightX + pillarW + 20) - (leftX - 20), entabH);
  x.strokeStyle = '#334155'; x.lineWidth = 4;
  x.strokeRect(leftX - 20, entabY, (rightX + pillarW + 20) - (leftX - 20), entabH);

  // Triangular pediment on top
  const pedimPeakY = entabY - 65;
  x.fillStyle = '#f8fafc';
  x.beginPath();
  x.moveTo(leftX - 25, entabY);
  x.lineTo(w * 0.5, pedimPeakY);
  x.lineTo(rightX + pillarW + 25, entabY);
  x.closePath();
  x.fill();
  x.stroke();

  // Dutch Colonial Coat of Arms / Decorative Medallion in pediment
  x.fillStyle = '#b45309';
  x.beginPath(); x.arc(w * 0.5, entabY - 26, 20, 0, TAU); x.fill();
  x.strokeStyle = '#d97706'; x.lineWidth = 3; x.stroke();
  x.fillStyle = '#fef3c7'; x.font = '700 16px "Lilita One"'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText('1820', w * 0.5, entabY - 26);

  // Iconic Gold Carved Typography on Entablature: PASSER BAROE
  x.fillStyle = '#92400e';
  x.font = '900 32px "Lilita One"';
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText('PASSER  BAROE', w * 0.5, entabY + entabH * 0.52);

  const out = finishCut(c, 10, { paper: '#fffdf7', edge: '#b9ad9c' });
  return { c: out, w: w / PPM, h: hm, ax: 0.5, ay: 0.98 };
}

// 2. Batavia Horse Carriage (Kretek 1820)
export function makeHorseCarriage(hm = 0.16) {
  const h = Math.round(hm * PPM), w = Math.round(h * 1.75);
  const c = cv(w, h), x = c.getContext('2d');

  // Ground baseline
  const baseY = h * 0.92;

  // Trotting Batavia Thoroughbred Horse (Right side)
  const horseX = w * 0.68, horseY = baseY - 60;
  x.fillStyle = '#78350f'; // rich chestnut brown
  // Horse torso
  x.beginPath();
  x.ellipse(horseX, horseY - 30, 75, 42, -0.05, 0, TAU);
  x.fill();
  // Muscular neck & head
  x.beginPath();
  x.moveTo(horseX + 50, horseY - 45);
  x.quadraticCurveTo(horseX + 85, horseY - 95, horseX + 110, horseY - 90);
  x.quadraticCurveTo(horseX + 130, horseY - 75, horseX + 115, horseY - 55);
  x.lineTo(horseX + 70, horseY - 20);
  x.closePath();
  x.fill();
  // Ears
  x.beginPath(); x.moveTo(horseX + 98, horseY - 92); x.lineTo(horseX + 104, horseY - 110); x.lineTo(horseX + 112, horseY - 92); x.fill();
  // Flowing black mane & tail
  x.fillStyle = '#1c1917';
  x.beginPath(); x.moveTo(horseX - 70, horseY - 40); x.quadraticCurveTo(horseX - 110, horseY - 20, horseX - 95, horseY + 25); x.lineTo(horseX - 65, horseY - 25); x.fill();
  // 4 Trot legs with black hooves
  x.fillStyle = '#78350f';
  [[-45, 10], [-15, 0], [35, 15], [60, -5]].forEach(([lx, ang]) => {
    x.save();
    x.translate(horseX + lx, horseY);
    x.rotate(ang * Math.PI / 180);
    x.fillRect(-7, 0, 14, 60);
    x.fillStyle = '#1c1917';
    x.fillRect(-8, 55, 16, 12);
    x.fillStyle = '#78350f';
    x.restore();
  });
  // Leather harness & reins
  x.strokeStyle = '#451a03'; x.lineWidth = 3;
  x.beginPath(); x.moveTo(horseX + 115, horseY - 70); x.lineTo(horseX - 100, horseY - 55); x.stroke();

  // Elegant Lacquered Carriage Cabin (Left side)
  const cabX = w * 0.12, cabY = baseY - 135, cabW = w * 0.42, cabH = 95;
  // Wooden chassis curved bottom
  x.fillStyle = '#1e1b4b'; // deep midnight lacquer
  x.beginPath();
  x.roundRect(cabX, cabY, cabW, cabH, [24, 24, 16, 16]);
  x.fill();
  x.strokeStyle = '#d97706'; x.lineWidth = 4; x.stroke();

  // Glass oval window with warm amber glow
  x.fillStyle = '#fef08a';
  x.beginPath();
  x.ellipse(cabX + cabW * 0.45, cabY + cabH * 0.42, 36, 26, 0, 0, TAU);
  x.fill();
  x.strokeStyle = '#b45309'; x.lineWidth = 3; x.stroke();
  // Window cross frame
  x.beginPath(); x.moveTo(cabX + cabW * 0.45 - 36, cabY + cabH * 0.42); x.lineTo(cabX + cabW * 0.45 + 36, cabY + cabH * 0.42); x.stroke();
  x.beginPath(); x.moveTo(cabX + cabW * 0.45, cabY + cabH * 0.42 - 26); x.lineTo(cabX + cabW * 0.45, cabY + cabH * 0.42 + 26); x.stroke();

  // Driver Coachman Box with leather seat
  x.fillStyle = '#451a03';
  x.fillRect(cabX + cabW - 10, cabY + 25, 45, 45);
  // Driver in colonial blangkon & beskap
  x.fillStyle = '#d97706';
  x.beginPath(); x.arc(cabX + cabW + 12, cabY + 10, 14, 0, TAU); x.fill();
  x.fillStyle = '#78350f'; // blangkon
  x.beginPath(); x.arc(cabX + cabW + 12, cabY + 5, 14, Math.PI, 0); x.fill();

  // Brass carriage lantern
  x.fillStyle = '#f59e0b';
  x.fillRect(cabX - 18, cabY + 20, 16, 26);
  x.strokeStyle = '#78350f'; x.lineWidth = 2.5; x.strokeRect(cabX - 18, cabY + 20, 16, 26);

  // Large Spoked Wooden Carriage Wheels
  [[cabX + 45, baseY - 45, 42], [cabX + cabW - 35, baseY - 38, 36]].forEach(([wx, wy, wr]) => {
    // Outer wooden rim
    x.fillStyle = '#b45309';
    x.beginPath(); x.arc(wx, wy, wr, 0, TAU); x.fill();
    x.fillStyle = '#fffdf7';
    x.beginPath(); x.arc(wx, wy, wr - 8, 0, TAU); x.fill();
    x.strokeStyle = '#451a03'; x.lineWidth = 4; x.stroke();
    // Center brass axle hub
    x.fillStyle = '#d97706';
    x.beginPath(); x.arc(wx, wy, 10, 0, TAU); x.fill();
    // 8 spokes
    x.strokeStyle = '#78350f'; x.lineWidth = 3;
    for (let a = 0; a < TAU; a += Math.PI / 4) {
      x.beginPath(); x.moveTo(wx, wy); x.lineTo(wx + Math.cos(a) * (wr - 8), wy + Math.sin(a) * (wr - 8)); x.stroke();
    }
  });

  const out = finishCut(c, 8, { paper: '#fffdf7', edge: '#b9ad9c' });
  return { c: out, w: w / PPM, h: hm, ax: 0.5, ay: 0.98 };
}

// 3. 1927 Toko Populer Gramophone & Indonesia Raya Shellac Record (Spread 0)
export function makeGramophoneRecord(hm = 0.18) {
  const h = Math.round(hm * PPM), w = Math.round(h * 1.25);
  const c = cv(w, h), x = c.getContext('2d');

  const baseY = h * 0.92;

  // Solid Polished Teak Wood Turntable Cabinet Base
  const boxX = w * 0.18, boxY = baseY - 75, boxW = w * 0.64, boxH = 68;
  x.fillStyle = '#78350f'; // dark aged teak
  x.beginPath(); x.roundRect(boxX, boxY, boxW, boxH, 12); x.fill();
  x.strokeStyle = '#451a03'; x.lineWidth = 4; x.stroke();

  // Brass plaque on cabinet: "TOKO POPULER - PASSER BAROE 1927"
  x.fillStyle = '#f59e0b';
  x.fillRect(boxX + 25, boxY + boxH - 28, boxW - 50, 18);
  x.strokeStyle = '#78350f'; x.lineWidth = 1.5; x.strokeRect(boxX + 25, boxY + boxH - 28, boxW - 50, 18);
  x.fillStyle = '#451a03';
  x.font = '700 11px "Lilita One"';
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText('TOKO POPULER  1927', boxX + boxW * 0.5, boxY + boxH - 18);

  // Spinning Shellac Disc (Piringan Hitam 78 RPM)
  const discCX = boxX + boxW * 0.42, discCY = boxY - 10, discRX = boxW * 0.44, discRY = 22;
  // Black shellac body
  x.fillStyle = '#0f172a';
  x.beginPath();
  x.ellipse(discCX, discCY, discRX, discRY, 0, 0, TAU);
  x.fill();
  x.strokeStyle = '#334155'; x.lineWidth = 2.5; x.stroke();

  // Concentric groove reflections
  x.strokeStyle = 'rgba(255, 255, 255, 0.22)'; x.lineWidth = 1.2;
  [0.85, 0.70, 0.55].forEach(scale => {
    x.beginPath();
    x.ellipse(discCX, discCY, discRX * scale, discRY * scale, 0, 0, TAU);
    x.stroke();
  });

  // Red Circular Center Label: INDONESIA RAYA
  x.fillStyle = '#b91c1c';
  x.beginPath();
  x.ellipse(discCX, discCY, discRX * 0.34, discRY * 0.34, 0, 0, TAU);
  x.fill();
  x.strokeStyle = '#fef08a'; x.lineWidth = 1.5; x.stroke();
  // Gold center text
  x.fillStyle = '#fef3c7';
  x.font = '900 10px "Lilita One"';
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText('INDONESIA RAYA', discCX, discCY);

  // Spindle center hole
  x.fillStyle = '#f8fafc';
  x.beginPath(); x.arc(discCX, discCY, 3, 0, TAU); x.fill();

  // Magnificent Flared Brass Acoustic Morning Glory Horn
  const hornBaseX = boxX + boxW * 0.82, hornBaseY = boxY - 5;
  const hornFlareX = boxX - 10, hornFlareY = boxY - 140, hornFlareR = 65;

  // Brass Tone Arm connecting to record
  x.strokeStyle = '#d97706'; x.lineWidth = 5;
  x.beginPath();
  x.moveTo(hornBaseX - 15, hornBaseY);
  x.lineTo(hornBaseX - 35, hornBaseY - 25);
  x.lineTo(discCX + 15, discCY - 2);
  x.stroke();
  // Soundbox & needle head
  x.fillStyle = '#f59e0b';
  x.beginPath(); x.arc(discCX + 15, discCY - 2, 8, 0, TAU); x.fill();
  x.strokeStyle = '#1e293b'; x.lineWidth = 2;
  x.beginPath(); x.moveTo(discCX + 15, discCY - 2); x.lineTo(discCX + 12, discCY + 3); x.stroke();

  // Flared Brass Horn Body
  const gHorn = x.createLinearGradient(hornBaseX, hornBaseY, hornFlareX, hornFlareY);
  gHorn.addColorStop(0, '#78350f');
  gHorn.addColorStop(0.3, '#d97706');
  gHorn.addColorStop(0.65, '#fef08a');
  gHorn.addColorStop(1, '#b45309');

  x.fillStyle = gHorn;
  x.beginPath();
  x.moveTo(hornBaseX, hornBaseY);
  x.quadraticCurveTo(hornBaseX + 25, hornBaseY - 65, hornFlareX + 35, hornFlareY + 55);
  // Horn opening flare ellipse
  x.ellipse(hornFlareX, hornFlareY, hornFlareR, hornFlareR * 0.65, -0.4, 0, TAU);
  x.quadraticCurveTo(hornBaseX - 25, hornBaseY - 80, hornBaseX - 15, hornBaseY);
  x.closePath();
  x.fill();
  x.strokeStyle = '#92400e'; x.lineWidth = 3; x.stroke();

  // Horn Bell Rim highlight
  x.strokeStyle = '#fef08a'; x.lineWidth = 4;
  x.beginPath();
  x.ellipse(hornFlareX, hornFlareY, hornFlareR, hornFlareR * 0.65, -0.4, 0, TAU);
  x.stroke();

  const out = finishCut(c, 8, { paper: '#fffdf7', edge: '#b9ad9c' });
  return { c: out, w: w / PPM, h: hm, ax: 0.5, ay: 0.98 };
}

// 4. Bespoke Textile & Silk Rolls with Tailor Scissors (Spread 1)
export function makeTextileRolls(hm = 0.16) {
  const h = Math.round(hm * PPM), w = Math.round(h * 1.45);
  const c = cv(w, h), x = c.getContext('2d');

  const baseY = h * 0.92;

  // Stack of 4 Luxurious Fabric Rolls (Bombay Silk, Crimson Brocade, Indigo Batik, Saffron Satin)
  const rolls = [
    { col: '#047857', pat: '#065f46', rib: '#fef08a', y: baseY - 35, w: w * 0.88, h: 42 },
    { col: '#b91c1c', pat: '#991b1b', rib: '#fbbf24', y: baseY - 70, w: w * 0.78, h: 40 },
    { col: '#1e3a8a', pat: '#1e40af', rib: '#f8fafc', y: baseY - 105, w: w * 0.68, h: 38 },
    { col: '#d97706', pat: '#b45309', rib: '#fef3c7', y: baseY - 138, w: w * 0.56, h: 36 }
  ];

  rolls.forEach((r, idx) => {
    const rx = (w - r.w) * 0.5;
    // Cylindrical roll body
    x.fillStyle = r.col;
    x.beginPath(); x.roundRect(rx, r.y, r.w, r.h, 16); x.fill();
    x.strokeStyle = 'rgba(0,0,0,0.25)'; x.lineWidth = 2.5; x.stroke();

    // Geometric pattern weaves on fabric
    x.strokeStyle = r.pat; x.lineWidth = 3;
    for (let fx = rx + 20; fx < rx + r.w - 20; fx += 28) {
      x.beginPath(); x.moveTo(fx, r.y + 4); x.lineTo(fx + 12, r.y + r.h - 4); x.stroke();
    }

    // Gold ribbon tied around center
    x.fillStyle = r.rib;
    x.fillRect(rx + r.w * 0.5 - 12, r.y, 24, r.h);
    x.strokeStyle = '#92400e'; x.lineWidth = 1.5; x.strokeRect(rx + r.w * 0.5 - 12, r.y, 24, r.h);

    // Roll side circular fabric cylinder
    x.fillStyle = r.pat;
    x.beginPath();
    x.ellipse(rx + 14, r.y + r.h * 0.5, 12, r.h * 0.42, 0, 0, TAU);
    x.fill();
    x.strokeStyle = '#fff'; x.lineWidth = 1.5; x.stroke();
  });

  // Tailor Yellow Measuring Tape draped over stack
  x.strokeStyle = '#fef08a'; x.lineWidth = 8;
  x.beginPath();
  x.moveTo(w * 0.22, baseY - 145);
  x.bezierCurveTo(w * 0.38, baseY - 110, w * 0.28, baseY - 60, w * 0.16, baseY - 10);
  x.stroke();
  // Tape black tick marks
  x.strokeStyle = '#1e293b'; x.lineWidth = 2;
  for (let ty = baseY - 140; ty < baseY - 10; ty += 12) {
    x.beginPath(); x.moveTo(w * 0.26 - (ty % 20), ty); x.lineTo(w * 0.26 - (ty % 20) + 6, ty); x.stroke();
  }

  // Heavy Vintage Brass Tailor Shears / Scissors on foreground
  const scX = w * 0.65, scY = baseY - 25;
  x.strokeStyle = '#d97706'; x.lineWidth = 7;
  // Blade 1
  x.beginPath(); x.moveTo(scX - 35, scY + 10); x.lineTo(scX + 45, scY - 12); x.stroke();
  // Blade 2
  x.beginPath(); x.moveTo(scX - 35, scY - 10); x.lineTo(scX + 45, scY + 12); x.stroke();
  // Brass finger finger loops
  x.fillStyle = '#b45309';
  x.beginPath(); x.arc(scX - 45, scY + 14, 15, 0, TAU); x.stroke();
  x.beginPath(); x.arc(scX - 45, scY - 14, 15, 0, TAU); x.stroke();
  // Center pivot screw
  x.fillStyle = '#fef08a';
  x.beginPath(); x.arc(scX, scY, 5, 0, TAU); x.fill();

  const out = finishCut(c, 8, { paper: '#fffdf7', edge: '#b9ad9c' });
  return { c: out, w: w / PPM, h: hm, ax: 0.5, ay: 0.98 };
}

// 5. Vintage 35mm Mechanical Rangefinder Camera (Spread 1)
export function makeVintageCamera(hm = 0.15) {
  const h = Math.round(hm * PPM), w = Math.round(h * 1.35);
  const c = cv(w, h), x = c.getContext('2d');

  const baseY = h * 0.92;
  const bodyX = w * 0.15, bodyY = baseY - 120, bodyW = w * 0.70, bodyH = 110;

  // Camera Body - Matte Black Textured Leatherette
  x.fillStyle = '#1e293b';
  x.beginPath(); x.roundRect(bodyX, bodyY + 30, bodyW, bodyH - 30, 16); x.fill();
  x.strokeStyle = '#0f172a'; x.lineWidth = 3; x.stroke();
  // Fine leatherette stipple
  x.fillStyle = 'rgba(255,255,255,0.06)';
  for (let py = bodyY + 35; py < bodyY + bodyH - 5; py += 6) {
    for (let px = bodyX + 8; px < bodyX + bodyW - 8; px += 8) {
      x.fillRect(px, py, 2, 2);
    }
  }

  // Brushed Satin Chrome Top Plate
  x.fillStyle = '#e2e8f0';
  x.beginPath(); x.roundRect(bodyX, bodyY, bodyW, 35, [14, 14, 4, 4]); x.fill();
  x.strokeStyle = '#94a3b8'; x.lineWidth = 3; x.stroke();

  // Rangefinder Viewfinder Windows
  x.fillStyle = '#0284c7';
  x.fillRect(bodyX + 22, bodyY + 8, 22, 16);
  x.strokeStyle = '#0f172a'; x.lineWidth = 2; x.strokeRect(bodyX + 22, bodyY + 8, 22, 16);
  x.fillStyle = '#38bdf8';
  x.fillRect(bodyX + bodyW - 48, bodyY + 8, 18, 16);
  x.strokeRect(bodyX + bodyW - 48, bodyY + 8, 18, 16);

  // Chrome Shutter Button & Dial Knobs on top
  x.fillStyle = '#cbd5e1';
  x.fillRect(bodyX + 55, bodyY - 14, 18, 15); // Shutter button
  x.fillRect(bodyX + bodyW - 35, bodyY - 18, 26, 19); // Shutter speed dial
  x.strokeStyle = '#475569'; x.lineWidth = 2;
  x.strokeRect(bodyX + 55, bodyY - 14, 18, 15);
  x.strokeRect(bodyX + bodyW - 35, bodyY - 18, 26, 19);

  // Prominent Precision Lens Barrel in Center
  const lensCX = bodyX + bodyW * 0.5, lensCY = bodyY + 68;
  // Chrome outer bezel
  x.fillStyle = '#94a3b8';
  x.beginPath(); x.arc(lensCX, lensCY, 48, 0, TAU); x.fill();
  x.strokeStyle = '#475569'; x.lineWidth = 3; x.stroke();

  // Aperture calibration ring with white tick marks
  x.fillStyle = '#0f172a';
  x.beginPath(); x.arc(lensCX, lensCY, 42, 0, TAU); x.fill();
  x.strokeStyle = '#f8fafc'; x.lineWidth = 1.5;
  for (let a = 0; a < TAU; a += Math.PI / 6) {
    x.beginPath(); x.moveTo(lensCX + Math.cos(a) * 38, lensCY + Math.sin(a) * 38); x.lineTo(lensCX + Math.cos(a) * 42, lensCY + Math.sin(a) * 42); x.stroke();
  }

  // Deep Glass Optics with Cyan Anti-Reflective Coating Reflection
  const gLens = x.createRadialGradient(lensCX - 8, lensCY - 8, 4, lensCX, lensCY, 32);
  gLens.addColorStop(0, '#38bdf8');
  gLens.addColorStop(0.5, '#0369a1');
  gLens.addColorStop(1, '#082f49');
  x.fillStyle = gLens;
  x.beginPath(); x.arc(lensCX, lensCY, 32, 0, TAU); x.fill();

  // Specular curved glare arc
  x.strokeStyle = 'rgba(255, 255, 255, 0.75)'; x.lineWidth = 3.5;
  x.beginPath();
  x.arc(lensCX, lensCY, 24, -Math.PI * 0.75, -Math.PI * 0.25);
  x.stroke();

  // Classic Brown Leather Neck Strap drooping at sides
  x.strokeStyle = '#92400e'; x.lineWidth = 6;
  x.beginPath();
  x.moveTo(bodyX, bodyY + 45);
  x.bezierCurveTo(bodyX - 25, bodyY + 75, bodyX - 15, baseY, bodyX + 20, baseY);
  x.stroke();

  const out = finishCut(c, 8, { paper: '#fffdf7', edge: '#b9ad9c' });
  return { c: out, w: w / PPM, h: hm, ax: 0.5, ay: 0.98 };
}

// 6. Legendary Gang Kelinci Steaming Noodle Bowl (Spread 1)
export function makeGangKelinciNoodles(hm = 0.14) {
  const h = Math.round(hm * PPM), w = Math.round(h * 1.35);
  const c = cv(w, h), x = c.getContext('2d');

  const baseY = h * 0.92;
  const bowlCX = w * 0.5, bowlCY = baseY - 50, bowlRX = w * 0.38, bowlRY = 24;

  // Traditional Porcelain Bowl (Classic Chinese Batavia Blue-White pattern)
  x.fillStyle = '#f8fafc';
  x.beginPath();
  x.moveTo(bowlCX - bowlRX, bowlCY);
  x.bezierCurveTo(bowlCX - bowlRX * 0.85, baseY, bowlCX + bowlRX * 0.85, baseY, bowlCX + bowlRX, bowlCY);
  x.closePath();
  x.fill();
  x.strokeStyle = '#1e3a8a'; x.lineWidth = 4; x.stroke();

  // Blue decorative floral band around rim
  x.fillStyle = '#2563eb';
  x.fillRect(bowlCX - bowlRX + 8, bowlCY - 2, bowlRX * 2 - 16, 8);

  // Broth surface inside bowl
  x.fillStyle = '#fef08a';
  x.beginPath();
  x.ellipse(bowlCX, bowlCY, bowlRX, bowlRY, 0, 0, TAU);
  x.fill();
  x.strokeStyle = '#ca8a04'; x.lineWidth = 3; x.stroke();

  // Curly Golden Egg Noodles
  x.strokeStyle = '#eab308'; x.lineWidth = 4.5;
  for (let n = 0; n < 8; n++) {
    const nx = bowlCX - bowlRX * 0.7 + n * 18, ny = bowlCY - 6;
    x.beginPath();
    x.moveTo(nx, ny);
    x.bezierCurveTo(nx + 10, ny - 14, nx - 8, ny + 12, nx + 14, ny - 2);
    x.stroke();
  }

  // Savory Braised Chicken Cubes
  x.fillStyle = '#b45309';
  [[bowlCX - 25, bowlCY - 8], [bowlCX - 5, bowlCY - 14], [bowlCX + 15, bowlCY - 6]].forEach(([cx, cy]) => {
    x.beginPath(); x.roundRect(cx, cy, 18, 14, 4); x.fill();
    x.strokeStyle = '#78350f'; x.lineWidth = 1.5; x.stroke();
  });

  // Fresh Green Bok Choy Leaves
  x.fillStyle = '#16a34a';
  x.beginPath();
  x.ellipse(bowlCX + 35, bowlCY - 5, 22, 10, -0.3, 0, TAU);
  x.fill();
  x.strokeStyle = '#15803d'; x.lineWidth = 2; x.stroke();

  // Golden Crispy Fried Shallots & Scallions sprinkled
  x.fillStyle = '#d97706';
  for (let s = 0; s < 12; s++) {
    x.fillRect(bowlCX - 30 + (s * 7) % 60, bowlCY - 12 + (s * 5) % 18, 4, 3);
  }

  // Bamboo Chopsticks resting across rim
  x.strokeStyle = '#92400e'; x.lineWidth = 4;
  x.beginPath(); x.moveTo(bowlCX - bowlRX - 15, bowlCY - 12); x.lineTo(bowlCX + bowlRX + 25, bowlCY + 4); x.stroke();
  x.beginPath(); x.moveTo(bowlCX - bowlRX - 15, bowlCY - 6); x.lineTo(bowlCX + bowlRX + 25, bowlCY + 10); x.stroke();

  // Soft Translucent Curving Steam Wisps rising
  x.strokeStyle = 'rgba(255, 255, 255, 0.65)'; x.lineWidth = 4;
  x.lineCap = 'round';
  [bowlCX - 25, bowlCX, bowlCX + 25].forEach((sx, idx) => {
    x.beginPath();
    x.moveTo(sx, bowlCY - 15);
    x.bezierCurveTo(sx - 15, bowlCY - 45, sx + 20, bowlCY - 75, sx - 5, bowlCY - 105 - idx * 10);
    x.stroke();
  });

  const out = finishCut(c, 8, { paper: '#fffdf7', edge: '#b9ad9c' });
  return { c: out, w: w / PPM, h: hm, ax: 0.5, ay: 0.98 };
}

// 7. Cyber-Heritage Smart Glass Arcade Canopy (Spread 2)
export function makeFutureArcade(hm = 0.24) {
  const h = Math.round(hm * PPM), w = Math.round(h * 1.45);
  const c = cv(w, h), x = c.getContext('2d');

  const baseY = h * 0.95;

  // Ultra-modern Sweeping Parametric Kinetic Canopy Pillars
  const leftX = w * 0.12, rightX = w * 0.72, pillarW = w * 0.16, pillarH = h * 0.75;
  [leftX, rightX].forEach(px => {
    // Sleek titanium white & brushed bronze composite column
    x.fillStyle = '#0f172a';
    x.fillRect(px, baseY - pillarH, pillarW, pillarH);
    x.strokeStyle = '#06b6d4'; x.lineWidth = 3; x.strokeRect(px, baseY - pillarH, pillarW, pillarH);

    // Glowing cyan vertical smart LED ribbon
    x.fillStyle = '#06b6d4';
    x.fillRect(px + pillarW * 0.5 - 3, baseY - pillarH + 15, 6, pillarH - 30);
  });

  // Kinetic Glass & Solar Hexagonal Lattice Arch
  const archL = leftX + pillarW, archR = rightX, archW = archR - archL;
  const archSpringY = baseY - pillarH + 20;

  // Translucent Solar Glass Dome
  const gGlass = x.createLinearGradient(archL, baseY - pillarH - 80, archR, archSpringY);
  gGlass.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
  gGlass.addColorStop(0.5, 'rgba(59, 130, 246, 0.25)');
  gGlass.addColorStop(1, 'rgba(236, 72, 153, 0.15)');

  x.fillStyle = gGlass;
  x.beginPath();
  x.moveTo(archL, archSpringY);
  x.bezierCurveTo(archL + archW * 0.2, baseY - pillarH - 90, archR - archW * 0.2, baseY - pillarH - 90, archR, archSpringY);
  x.closePath();
  x.fill();
  x.strokeStyle = '#38bdf8'; x.lineWidth = 4; x.stroke();

  // Smart Hexagonal Photovoltaic Grid
  x.strokeStyle = 'rgba(255, 255, 255, 0.45)'; x.lineWidth = 2;
  for (let hx = archL + 25; hx < archR - 25; hx += 35) {
    x.beginPath();
    x.moveTo(hx, archSpringY - 10);
    x.lineTo(hx + 15, baseY - pillarH - 45);
    x.stroke();
  }

  // Floating Holographic Signage: PASAR BARU 2035+
  const signY = baseY - pillarH - 25;
  x.fillStyle = 'rgba(15, 23, 42, 0.85)';
  x.beginPath(); x.roundRect(w * 0.5 - 130, signY - 22, 260, 44, 12); x.fill();
  x.strokeStyle = '#06b6d4'; x.lineWidth = 2.5; x.stroke();

  x.fillStyle = '#38bdf8';
  x.font = '900 18px "Lilita One"';
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText('PASAR BARU  2035+', w * 0.5, signY);

  const out = finishCut(c, 10, { paper: '#fffdf7', edge: '#b9ad9c' });
  return { c: out, w: w / PPM, h: hm, ax: 0.5, ay: 0.98 };
}

// 8. Elevated High-Speed MRT Jakarta Train (Spread 2)
export function makeSkyMrtTrain(hm = 0.16) {
  const h = Math.round(hm * PPM), w = Math.round(h * 2.2);
  const c = cv(w, h), x = c.getContext('2d');

  const baseY = h * 0.90;

  // Concrete Elevated Viaduct Rail Beam
  const viaductY = baseY - 35, viaductH = 30;
  x.fillStyle = '#64748b';
  x.fillRect(0, viaductY, w, viaductH);
  x.strokeStyle = '#334155'; x.lineWidth = 3; x.strokeRect(0, viaductY, w, viaductH);
  // Power rail line
  x.strokeStyle = '#38bdf8'; x.lineWidth = 3;
  x.beginPath(); x.moveTo(0, viaductY - 3); x.lineTo(w, viaductY - 3); x.stroke();

  // Aerodynamic MRT Jakarta Train Car (Crisp White + MRT Navy Blue Livery)
  const trainX = w * 0.08, trainY = viaductY - 75, trainW = w * 0.84, trainH = 72;

  // Streamlined Train Body with bullet nose on right
  x.fillStyle = '#f8fafc';
  x.beginPath();
  x.moveTo(trainX, trainY + trainH);
  x.lineTo(trainX, trainY + 12);
  x.roundRect(trainX, trainY, trainW - 40, trainH, [16, 0, 0, 0]);
  // Aerodynamic nose slope
  x.bezierCurveTo(trainX + trainW - 20, trainY + 10, trainX + trainW, trainY + 35, trainX + trainW, trainY + trainH);
  x.closePath();
  x.fill();
  x.strokeStyle = '#cbd5e1'; x.lineWidth = 3; x.stroke();

  // MRT Jakarta Signature Navy & Cyan Stripe
  x.fillStyle = '#1e3a8a';
  x.fillRect(trainX, trainY + trainH - 24, trainW - 8, 12);
  x.fillStyle = '#06b6d4';
  x.fillRect(trainX, trainY + trainH - 12, trainW - 5, 8);

  // Tinted Panoramic Cabin Windows with interior lighting
  const winY = trainY + 15, winH = 26;
  for (let wx = trainX + 25; wx < trainX + trainW - 65; wx += 52) {
    x.fillStyle = '#0f172a';
    x.beginPath(); x.roundRect(wx, winY, 38, winH, 6); x.fill();
    // Warm interior passenger glow
    x.fillStyle = '#fef08a';
    x.fillRect(wx + 4, winY + 4, 30, 4);
    x.strokeStyle = '#38bdf8'; x.lineWidth = 1.5; x.strokeRect(wx, winY, 38, winH, 6);
  }
  // Front driver windshield
  x.fillStyle = '#0f172a';
  x.beginPath();
  x.moveTo(trainX + trainW - 35, winY);
  x.lineTo(trainX + trainW - 8, winY + 18);
  x.lineTo(trainX + trainW - 14, winY + winH);
  x.lineTo(trainX + trainW - 35, winY + winH);
  x.closePath();
  x.fill();
  x.strokeStyle = '#38bdf8'; x.lineWidth = 2; x.stroke();

  // High-intensity front LED headlights
  x.fillStyle = '#fef08a';
  x.beginPath(); x.arc(trainX + trainW - 12, trainY + trainH - 18, 6, 0, TAU); x.fill();

  const out = finishCut(c, 8, { paper: '#fffdf7', edge: '#b9ad9c' });
  return { c: out, w: w / PPM, h: hm, ax: 0.5, ay: 0.98 };
}

// 9. Weltevreden 1820 Daendels Commemorative Plaque (Spread 0)
export function makeDaendelsPlaque(hm = 0.14) {
  const h = Math.round(hm * PPM), w = Math.round(h * 1.3);
  const c = cv(w, h), x = c.getContext('2d');

  // Antique Carved Brass Plaque on Dark Colonial Marble
  x.fillStyle = '#1e293b'; // Belgian dark marble
  x.beginPath(); x.roundRect(20, 20, w - 40, h - 40, 16); x.fill();
  x.strokeStyle = '#d97706'; x.lineWidth = 5; x.stroke();

  // Inner ornate brass border
  x.strokeStyle = '#f59e0b'; x.lineWidth = 2.5;
  x.strokeRect(32, 32, w - 64, h - 64);

  // 4 corner rosette studs
  [[32, 32], [w - 32, 32], [32, h - 32], [w - 32, h - 32]].forEach(([sx, sy]) => {
    x.fillStyle = '#fef08a'; x.beginPath(); x.arc(sx, sy, 6, 0, TAU); x.fill();
    x.strokeStyle = '#b45309'; x.lineWidth = 2; x.stroke();
  });

  // Engraved Colonial Inscription
  x.fillStyle = '#fef3c7';
  x.font = '700 18px "Lilita One"';
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText('WELTEVREDEN  1820', w * 0.5, h * 0.38);

  x.font = '400 12px "Fredoka"';
  x.fillStyle = '#cbd5e1';
  x.fillText('GOUVERNEUR-GENERAAL DAENDELS', w * 0.5, h * 0.54);
  x.fillText('PASSER BAROE - BATAVIA', w * 0.5, h * 0.68);

  const out = finishCut(c, 8, { paper: '#fffdf7', edge: '#b9ad9c' });
  return { c: out, w: w / PPM, h: hm, ax: 0.5, ay: 0.98 };
}

// 10. Smart Pedestrian Transit Information Kiosk (Spread 2)
export function makeSmartKiosk(hm = 0.17) {
  const h = Math.round(hm * PPM), w = Math.round(h * 0.9);
  const c = cv(w, h), x = c.getContext('2d');
  const baseY = h * 0.94;

  const totemW = w * 0.65, totemH = h * 0.85;
  const totemX = (w - totemW) * 0.5, totemY = baseY - totemH;

  x.fillStyle = '#0f172a';
  x.beginPath(); x.roundRect(totemX, totemY, totemW, totemH, 20); x.fill();
  x.strokeStyle = '#06b6d4'; x.lineWidth = 3.5; x.stroke();

  const scrX = totemX + 16, scrY = totemY + 24, scrW = totemW - 32, scrH = totemH * 0.68;
  x.fillStyle = '#020617';
  x.beginPath(); x.roundRect(scrX, scrY, scrW, scrH, 12); x.fill();
  x.strokeStyle = '#38bdf8'; x.lineWidth = 2; x.stroke();

  x.strokeStyle = '#06b6d4'; x.lineWidth = 4;
  x.beginPath();
  x.moveTo(scrX + 20, scrY + scrH * 0.78);
  x.lineTo(scrX + scrW * 0.45, scrY + scrH * 0.5);
  x.lineTo(scrX + scrW - 20, scrY + scrH * 0.25);
  x.stroke();

  [[scrX + 20, scrY + scrH * 0.78, '#38bdf8'], [scrX + scrW * 0.45, scrY + scrH * 0.5, '#f59e0b'], [scrX + scrW - 20, scrY + scrH * 0.25, '#10b981']].forEach(([dx, dy, col]) => {
    x.fillStyle = col; x.beginPath(); x.arc(dx, dy, 7, 0, TAU); x.fill();
    x.strokeStyle = '#fff'; x.lineWidth = 2; x.stroke();
  });

  x.fillStyle = '#38bdf8';
  x.font = '700 14px "Lilita One"'; x.textAlign = 'center';
  x.fillText('MRT PASAR BARU', scrX + scrW * 0.5, scrY + 30);
  x.fillStyle = '#94a3b8';
  x.font = '500 11px "Fredoka"';
  x.fillText('NEXT TRAIN: 2 MIN', scrX + scrW * 0.5, scrY + 52);

  x.fillStyle = '#06b6d4';
  x.beginPath(); x.arc(totemX + totemW * 0.5, totemY + totemH - 35, 16, 0, TAU); x.fill();
  x.strokeStyle = '#e0f2fe'; x.lineWidth = 2; x.stroke();

  const out = finishCut(c, 8, { paper: '#fffdf7', edge: '#b9ad9c' });
  return { c: out, w: w / PPM, h: hm, ax: 0.5, ay: 0.98 };
}
