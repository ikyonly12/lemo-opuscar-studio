// 2D overlay: clean single-line word-chunk subtitles, character speech bubbles, and chapter plaques
import { SUBS, BUB, CHAPTERS, DUR } from './story.js';
import { clamp, seg, back, ss, eo, lerp } from './lib.js';

const INK = '#2c221e';
export const CPS = 26; // character typing speed for bubbles

export function drawSubs(x, t) {
  const W = x.canvas.width, H = x.canvas.height;
  for (const [t0, t1, text] of SUBS) {
    if (t < t0 - 0.1 || t > t1 + 0.15) continue;
    const a = Math.min(seg(t, t0 - 0.1, t0 + 0.1), 1 - seg(t, t1 - 0.05, t1 + 0.15));
    if (a <= 0) continue;

    x.save();
    x.globalAlpha = a;
    x.textAlign = 'center';
    x.textBaseline = 'middle';

    const y = H - 110;
    x.font = '500 36px Fredoka, sans-serif';

    // Soft dark backdrop pill for maximum legibility over 3D backgrounds
    const tw = x.measureText(text).width;
    x.fillStyle = 'rgba(24, 18, 14, 0.72)';
    x.beginPath();
    x.roundRect(W / 2 - tw / 2 - 24, y - 24, tw + 48, 48, 14);
    x.fill();

    // Clean white text with subtle shadow
    x.shadowColor = 'rgba(0,0,0,0.4)';
    x.shadowBlur = 8;
    x.fillStyle = '#fffdf5';
    x.fillText(text, W / 2, y + 2);
    x.restore();
  }
}

// Character Speech Bubble
export function drawBubbles(x, t, anchors) {
  const W = x.canvas.width, H = x.canvas.height;
  for (const [who, t0, t1, text] of BUB) {
    if (t < t0 - 0.05 || t > t1 + 0.25) continue;
    const an = anchors[who];
    if (!an) continue;

    const kin = back(seg(t, t0, t0 + 0.22), 2.0);
    const kout = 1 - ss(seg(t, t1, t1 + 0.2));
    const k = kin * kout;
    if (k <= 0) continue;

    const n = Math.floor(clamp((t - t0 - 0.1) * CPS, 0, text.length));
    x.save();
    x.font = '600 38px Fredoka, sans-serif';
    const tw = Math.max(x.measureText(text).width, 220);
    const bw = tw + 70, bh = 110;

    let bx = clamp(an[0] - bw * 0.4, 40, W - bw - 40);
    let by = clamp(an[1] - bh - 60, 40, H - 240);
    const tx = clamp(an[0], bx + 40, bx + bw - 40);

    x.translate(tx, by + bh);
    x.scale(k, k);
    x.translate(-tx, -(by + bh));
    x.globalAlpha = clamp(kout * 1.5, 0, 1);

    // Drop shadow
    x.fillStyle = 'rgba(30, 20, 15, 0.24)';
    x.beginPath();
    x.roundRect(bx + 6, by + 10, bw, bh, 32);
    x.fill();

    // Body + Tail
    x.fillStyle = '#fffef8';
    x.beginPath();
    x.roundRect(bx, by, bw, bh, 32);
    x.moveTo(tx - 20, by + bh - 2);
    x.lineTo(lerp(tx, an[0], 0.65), Math.min(an[1] - 12, by + bh + 48));
    x.lineTo(tx + 16, by + bh - 2);
    x.fill();

    x.lineWidth = 5;
    x.strokeStyle = INK;
    x.lineJoin = 'round';
    x.stroke();

    // Text
    x.fillStyle = '#221612';
    x.textAlign = 'left';
    x.textBaseline = 'middle';
    x.fillText(text.slice(0, n), bx + 35, by + bh / 2 + 2);
    x.restore();
  }
}

// Suspended Chapter Sign
export function drawChapter(x, t) {
  const W = x.canvas.width;
  for (const [t0, t1, a, b] of CHAPTERS) {
    if (t < t0 || t > t1 + 0.5) continue;
    const kin = seg(t, t0, t0 + 0.6), kout = seg(t, t1, t1 + 0.4);
    const drop = (1 - back(kin, 1.3)) * -280 - ss(kout) * 380;
    const sw = Math.sin((t - t0) * 3.0) * 0.02 * (1 - kin * 0.5) * (1 - kout);

    x.save();
    x.translate(W / 2, 130 + drop);
    x.rotate(sw);

    // Hanging cords
    x.strokeStyle = '#5a483a';
    x.lineWidth = 3;
    x.beginPath();
    x.moveTo(-240, -40);
    x.lineTo(-240, -320);
    x.moveTo(240, -40);
    x.lineTo(240, -320);
    x.stroke();

    // Cardboard plate
    x.font = '80px "Lilita One", sans-serif';
    const w = Math.max(540, x.measureText(b).width + 120);

    // Shadow
    x.fillStyle = 'rgba(30, 20, 15, 0.22)';
    x.beginPath();
    x.roundRect(-w / 2 + 8, -35 + 12, w, 150, 18);
    x.fill();

    // Main plate
    x.fillStyle = '#fffaf0';
    x.beginPath();
    x.roundRect(-w / 2 - 6, -42, w + 12, 164, 22);
    x.fill();

    x.fillStyle = '#f3e5c4';
    x.beginPath();
    x.roundRect(-w / 2, -35, w, 150, 18);
    x.fill();
    x.lineWidth = 5;
    x.strokeStyle = INK;
    x.stroke();

    // Ribbon banner for Act number
    x.fillStyle = '#c83b32';
    x.beginPath();
    x.moveTo(-140, -60);
    x.lineTo(140, -60);
    x.lineTo(125, -28);
    x.lineTo(140, 4);
    x.lineTo(-140, 4);
    x.lineTo(-125, -28);
    x.closePath();
    x.fill();
    x.stroke();

    x.textAlign = 'center';
    x.textBaseline = 'middle';
    x.font = '32px "Lilita One", sans-serif';
    x.fillStyle = '#fff4d6';
    x.fillText(a, 0, -28);

    x.font = '64px "Lilita One", sans-serif';
    x.lineWidth = 10;
    x.strokeStyle = INK;
    x.lineJoin = 'round';
    x.strokeText(b, 0, 48);
    x.fillStyle = '#ffcf3f';
    x.fillText(b, 0, 48);

    x.restore();
  }
}
