// 2D overlay: clean single-line word-chunk subtitles, character speech bubbles, and chapter plaques
import { SUBS, BUB, CHAPTERS, DUR } from './story.js';
import { clamp, seg, back, ss } from './lib.js';

export const CPS = 26; // character typing speed for bubbles

export function drawSubs(x, t) {
  const W = x.canvas.width, H = x.canvas.height;
  // Strictly pick at most ONE active subtitle chunk at time t to prevent overlap
  let active = null;
  for (const [t0, t1, text] of SUBS) {
    if (t >= t0 && t < t1) {
      active = { t0, t1, text };
      break;
    }
  }
  if (!active) return;

  const { t0, t1, text } = active;
  const dur = t1 - t0;
  const fade = Math.min(0.08, dur * 0.2);
  const a = Math.min(seg(t, t0, t0 + fade), 1 - seg(t, t1 - fade, t1));
  if (a <= 0) return;

  x.save();
  x.globalAlpha = a;
  x.textAlign = 'center';
  x.textBaseline = 'middle';

  const y = H - 110;
  x.font = '500 36px "Fredoka", sans-serif';

  // Soft dark backdrop pill for maximum legibility over 3D backgrounds
  const tw = x.measureText(text).width;
  x.fillStyle = 'rgba(15, 23, 42, 0.82)';
  x.beginPath();
  x.roundRect(W / 2 - tw / 2 - 24, y - 24, tw + 48, 48, 14);
  x.fill();

  // Clean white text with subtle shadow
  x.shadowColor = 'rgba(0,0,0,0.5)';
  x.shadowBlur = 8;
  x.fillStyle = '#fffdf5';
  x.fillText(text, W / 2, y + 2);
  x.restore();
}

// Character Speech Bubble
export function drawBubbles(x, t, anchors) {
  const W = x.canvas.width, H = x.canvas.height;
  for (const [who, t0, t1, text] of BUB) {
    if (t < t0 - 0.05 || t > t1 + 0.25) continue;
    const an = anchors[who];
    if (!an) continue;
    if (an[0] < -50 || an[0] > W + 50 || an[1] < -50 || an[1] > H + 50) continue;

    const kin = back(seg(t, t0, t0 + 0.22), 2.0);
    const kout = 1 - ss(seg(t, t1, t1 + 0.2));
    const k = kin * kout;
    if (k <= 0) continue;

    x.save();
    x.font = '600 34px "Fredoka", sans-serif';
    const tw = Math.max(x.measureText(text).width, 220);
    const bw = tw + 60, bh = 90;

    let bx = clamp(an[0] - bw * 0.5, 60, W - bw - 60);
    let by = clamp(an[1] - bh - 70, 50, H - 240);
    const tx = clamp(an[0], bx + 40, bx + bw - 40);

    x.translate(tx, by + bh);
    x.scale(k, k);
    x.translate(-tx, -(by + bh));
    x.globalAlpha = clamp(kout * 1.5, 0, 1);

    // Drop shadow
    x.fillStyle = 'rgba(15, 23, 42, 0.25)';
    x.beginPath();
    x.roundRect(bx + 4, by + 6, bw, bh, 18);
    x.fill();

    // Bubble body (solid cream paper)
    x.fillStyle = '#fffdf7';
    x.beginPath();
    x.roundRect(bx, by, bw, bh, 18);
    x.fill();
    x.lineWidth = 4;
    x.strokeStyle = '#334155';
    x.stroke();

    // Bubble pointer tail
    x.fillStyle = '#fffdf7';
    x.beginPath();
    x.moveTo(tx - 14, by + bh - 2);
    x.lineTo(tx, by + bh + 24);
    x.lineTo(tx + 14, by + bh - 2);
    x.closePath();
    x.fill();
    x.beginPath();
    x.moveTo(tx - 14, by + bh - 2);
    x.lineTo(tx, by + bh + 24);
    x.lineTo(tx + 14, by + bh - 2);
    x.stroke();

    // Speech text
    x.fillStyle = '#0f172a';
    x.textAlign = 'center';
    x.textBaseline = 'middle';
    x.fillText(text, bx + bw / 2, by + bh / 2);
    x.restore();
  }
}

// Chapter Ribbon Banner (Top Center)
export function drawChapters(x, t) {
  const W = x.canvas.width;
  for (const [t0, t1, part, title] of CHAPTERS) {
    if (t < t0 || t > t1) continue;
    const dur = t1 - t0;
    const a = Math.min(seg(t, t0, t0 + 0.4), 1 - seg(t, t1 - 0.4, t1));
    if (a <= 0) continue;

    x.save();
    x.globalAlpha = a;
    const cy = 68;

    x.font = '700 18px "Lilita One", sans-serif';
    const pw = x.measureText(part).width;
    x.font = '600 24px "Fredoka", sans-serif';
    const tw = x.measureText(title).width;
    const totalW = Math.max(pw, tw) + 70;

    // Elegant gold bordered plaque
    x.fillStyle = 'rgba(15, 23, 42, 0.88)';
    x.beginPath();
    x.roundRect(W / 2 - totalW / 2, cy - 32, totalW, 64, 12);
    x.fill();
    x.lineWidth = 3;
    x.strokeStyle = '#f59e0b';
    x.stroke();

    // Text
    x.textAlign = 'center';
    x.fillStyle = '#f59e0b';
    x.font = '700 16px "Lilita One", sans-serif';
    x.fillText(part, W / 2, cy - 10);
    x.fillStyle = '#ffffff';
    x.font = '600 22px "Fredoka", sans-serif';
    x.fillText(title, W / 2, cy + 14);

    x.restore();
  }
}
