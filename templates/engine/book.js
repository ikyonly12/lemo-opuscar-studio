// Pop-up book: spine at the far end (z=0); the cover flips back to 90° and stands up as the stage backdrop
import * as THREE from 'three';
import { cv, paperFill, GRAIN } from './paper.js';
import { mulberry, clamp } from './lib.js';

export const BW = 0.44, BD = 0.30;       // page width (x) × depth (z)
export const BT = 0.0035, HB = 0.014;    // cover-board thickness, thickness of half the page block
export const PG = BT + HB;               // height of the lower half's page surface

export function texOf(c, o = {}) {
  const t = new THREE.CanvasTexture(c); t.colorSpace = o.linear ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  t.anisotropy = 8; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter;
  return t;
}

// page edges (thin horizontal lines)
function edgeCanvas() {
  const c = cv(512, 64), x = c.getContext('2d'); x.fillStyle = '#efe6d2'; x.fillRect(0, 0, 512, 64);
  const R = mulberry(9);
  for (let i = 0; i < 64; i += 1.3) { x.fillStyle = `rgba(150,130,100,${.08 + R() * .18})`; x.fillRect(0, i, 512, .6); }
  return c;
}

// cloth cover + gold-foil title; also generates the roughness(g)/metalness(b) map
export function coverCanvases() {
  const w = 2048, h = Math.round(2048 * BD / BW), c = cv(w, h), x = c.getContext('2d'), m = cv(w, h), y = m.getContext('2d');
  
  // Luxury Deep Antique Burgundy cloth weave
  x.fillStyle = '#2a0d12'; x.fillRect(0, 0, w, h);
  const R = mulberry(8);
  for (let i = 0; i < h; i += 3) { x.fillStyle = `rgba(0,0,0,${.06 + R() * .08})`; x.fillRect(0, i, w, 1.2); }
  for (let i = 0; i < w; i += 3) { x.fillStyle = `rgba(255,255,255,${.03 + R() * .05})`; x.fillRect(i, 0, 1.2, h); }
  for (let i = 0; i < 90; i++) {
    const px = R() * w, py = R() * h, r = 60 + R() * 300, g = x.createRadialGradient(px, py, 0, px, py, r);
    g.addColorStop(0, `rgba(${R() < .5 ? '0,0,0' : '70,20,30'},${.08 * R()})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g; x.fillRect(px - r, py - r, 2 * r, 2 * r);
  }

  // gold areas are also drawn into m (b = metal, g = roughness)
  y.fillStyle = 'rgb(0,235,0)'; y.fillRect(0, 0, w, h);
  const GOLD = '#f59e0b';
  const both = fn => { x.save(); fn(x, GOLD); x.restore(); y.save(); fn(y, 'rgb(0,90,255)'); y.restore(); };

  // Decorative double gold border with corner rosettes
  both((k, col) => {
    k.strokeStyle = col; k.lineWidth = 12; k.strokeRect(90, 90, w - 180, h - 180);
    k.lineWidth = 4; k.strokeRect(120, 120, w - 240, h - 240);
    for (const [cx, cy] of [[120, 120], [w - 120, 120], [120, h - 120], [w - 120, h - 120]]) {
      k.beginPath(); k.arc(cx, cy, 32, 0, Math.PI * 2); k.fillStyle = col; k.fill();
    }
  });

  // Authentic Gold Title on Right Side
  const tx = w * .655;
  both((k, col) => {
    k.fillStyle = col; k.textAlign = 'center'; k.textBaseline = 'alphabetic';
    k.font = '700 115px "Lilita One"'; k.fillText('MISTERI', tx, h * .29);
    k.font = '700 130px "Lilita One"'; k.fillText('KEYBOARD', tx, h * .42);
    k.font = '700 145px "Lilita One"'; k.fillText('QWERTY', tx, h * .56);
    
    // Thin gold decorative divider line
    k.beginPath();
    k.moveTo(tx - 240, h * .62);
    k.lineTo(tx + 240, h * .62);
    k.lineWidth = 4;
    k.strokeStyle = col;
    k.stroke();

    // Small decorative center diamond
    k.beginPath();
    const dy = h * .62;
    k.moveTo(tx, dy - 9); k.lineTo(tx + 9, dy); k.lineTo(tx, dy + 9); k.lineTo(tx - 9, dy);
    k.closePath();
    k.fill();

    k.font = '500 42px "Fredoka", sans-serif'; k.fillText('The 1873 Anti-Jam Mechanical Bottleneck', tx, h * .70);
    k.font = 'italic 34px "Fredoka", sans-serif'; k.fillText('~ Sejarah Tuas Tik, Kemacetan & Takdir Layar Kaca ~', tx, h * .78);
  });

  // Round Mechanical Seal on Left Side
  const cx = w * .22, cy = h * .50, r = 260;
  both((k, col) => {
    k.beginPath(); k.arc(cx, cy, r + 20, 0, Math.PI * 2); k.lineWidth = 12; k.strokeStyle = col; k.stroke();
  });

  x.save(); x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.clip();
  // Deep warm bronze gradient
  const bgGrad = x.createLinearGradient(cx, cy - r, cx, cy + r);
  bgGrad.addColorStop(0, '#1c1917');
  bgGrad.addColorStop(1, '#441a1a');
  x.fillStyle = bgGrad; x.fillRect(cx - r, cy - r, 2 * r, 2 * r);

  // Radial typewriter typebar lines
  x.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  x.lineWidth = 3;
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 12) {
    x.beginPath();
    x.moveTo(cx + Math.cos(a) * 45, cy + Math.sin(a) * 45);
    x.lineTo(cx + Math.cos(a) * (r - 30), cy + Math.sin(a) * (r - 30));
    x.stroke();
  }

  // Vintage Typewriter Key Icon in Center ("Q")
  x.fillStyle = '#fffdf7';
  x.beginPath(); x.arc(cx, cy, 95, 0, Math.PI * 2); x.fill();
  x.lineWidth = 9; x.strokeStyle = '#f59e0b'; x.stroke();

  x.fillStyle = '#1c1917';
  x.font = '900 110px "Lilita One"';
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.fillText('Q', cx, cy - 2);

  x.restore();

  y.save(); y.beginPath(); y.arc(cx, cy, r, 0, Math.PI * 2); y.fillStyle = 'rgb(0,180,0)'; y.fill(); y.restore();
  return { c, m };
}

export function makeBook(cover) {
  const root = new THREE.Group();
  const cloth = new THREE.MeshStandardMaterial({ color: '#2a0d12', roughness: .85 });
  const edge = texOf(edgeCanvas()); edge.wrapS = edge.wrapT = THREE.RepeatWrapping;
  const edgeMat = new THREE.MeshStandardMaterial({ map: edge, roughness: .95 });
  const pageTop = new THREE.MeshStandardMaterial({ color: '#f3ead6', roughness: .95 });

  // lower half: cover board + page block
  const lb = new THREE.Mesh(new THREE.BoxGeometry(BW + .012, BT, BD + .006), cloth); lb.position.set(0, BT / 2, BD / 2 + .002);
  const lp = new THREE.Mesh(new THREE.BoxGeometry(BW, HB, BD - .002), [edgeMat, edgeMat, pageTop, pageTop, edgeMat, edgeMat]); lp.position.set(0, BT + HB / 2, BD / 2);
  for (const m of [lb, lp]) { m.castShadow = m.receiveShadow = true; root.add(m); }
  // spine
  const spine = new THREE.Mesh(new THREE.CylinderGeometry(PG, PG, BW + .012, 24, 1, false, Math.PI, Math.PI), cloth);
  spine.rotation.z = Math.PI / 2; spine.position.set(0, PG, -.001); spine.castShadow = true; root.add(spine);

  const hinge = new THREE.Group(); hinge.position.set(0, PG, 0); root.add(hinge);
  const upper = new THREE.Group(); hinge.add(upper);
  const open = new THREE.Group(); open.rotation.x = Math.PI / 2; upper.add(open);
  
  const up = new THREE.Mesh(new THREE.BoxGeometry(BW, BD - .002, HB), [edgeMat, edgeMat, edgeMat, edgeMat, pageTop, pageTop]); up.position.set(0, BD / 2, -HB / 2);
  const ub = new THREE.Mesh(new THREE.BoxGeometry(BW + .012, BD + .006, BT), cloth); ub.position.set(0, BD / 2 + .002, -HB - BT / 2);
  const coverTex = texOf(cover.c), mr = texOf(cover.m, { linear: true });
  const coverMat = new THREE.MeshStandardMaterial({ map: coverTex, roughnessMap: mr, metalnessMap: mr, roughness: 1, metalness: 1 });
  const cp = new THREE.Mesh(new THREE.PlaneGeometry(BW + .008, BD + .002), coverMat); cp.rotation.x = Math.PI; cp.position.set(0, BD / 2 + .002, -HB - BT - .0003);
  for (const m of [up, ub, cp]) { m.castShadow = m.receiveShadow = true; open.add(m); }

  const groundGeo = new THREE.PlaneGeometry(BW - .006, BD - .004, 1, 30); groundGeo.rotateX(-Math.PI / 2); groundGeo.translate(0, 0, BD / 2);
  gutter(groundGeo, 'z');
  const groundMat = new THREE.MeshStandardMaterial({ roughness: .92, color: '#ffffff' });
  const ground = new THREE.Mesh(groundGeo, groundMat); ground.position.y = .0003; ground.receiveShadow = true;
  const stage = new THREE.Group(); hinge.add(stage); stage.add(ground);
  const backGeo = new THREE.PlaneGeometry(BW - .006, BD - .004, 1, 30); backGeo.translate(0, BD / 2, 0); gutter(backGeo, 'y');
  const backMat = new THREE.MeshStandardMaterial({ roughness: .92, color: '#ffffff' });
  const back = new THREE.Mesh(backGeo, backMat); back.position.z = .0003; back.receiveShadow = true; open.add(back);
  const sky = new THREE.Group(); open.add(sky);

  // page turn: one curved sheet, front = old ground, back = new sky
  const NS = 40, mkLeafGeo = () => { const g = new THREE.PlaneGeometry(BW - .008, 1, 1, NS); return g; };
  const lf = mkLeafGeo(), lb2 = mkLeafGeo();
  const leafFront = new THREE.Mesh(lf, new THREE.MeshStandardMaterial({ roughness: .92, side: THREE.FrontSide }));
  const leafBack = new THREE.Mesh(lb2, new THREE.MeshStandardMaterial({ roughness: .92, side: THREE.BackSide }));
  
  const uvF = lf.attributes.uv, uvB = lb2.attributes.uv;
  for (let i = 0; i < uvF.count; i++) { const v = uvF.getY(i); uvB.setY(i, 1 - v); }
  uvB.needsUpdate = true;
  for (const m of [leafFront, leafBack]) { m.material.emissive = new THREE.Color(.42, .4, .38); m.castShadow = true; m.receiveShadow = true; m.visible = false; stage.add(m); }
  
  function setLeaf(u, bendAmt = .55) {
    const vis = u > 0 && u < 1; leafFront.visible = leafBack.visible = vis; if (!vis) return;
    const th = Math.PI / 2 * u, L = bendAmt * Math.sin(Math.PI * u);
    for (const g of [lf, lb2]) {
      const p = g.attributes.position, n = NS + 1;
      let zz = 0, yy = 0;
      const col = [];
      for (let iy = 0; iy <= NS; iy++) {
        const s = iy / NS;
        if (iy > 0) { const phi = th * (1 - L * (s - .5 / NS)) + (1 - u) * 0; zz += Math.cos(phi) * BD / NS; yy += Math.sin(phi) * BD / NS; }
        col.push([yy, zz]);
      }
      for (let iy = 0; iy <= NS; iy++) for (let ix = 0; ix < 2; ix++) { const k = iy * 2 + ix; p.setY(k, col[iy][0] + .0009); p.setZ(k, col[iy][1]); }
      p.needsUpdate = true; g.computeVertexNormals(); g.computeBoundingSphere();
    }
  }

  function setOpen(th) { upper.rotation.x = -th; }
  return { root, hinge, upper, open, stage, sky, ground, back, groundMat, backMat, leafFront, leafBack, setLeaf, setOpen, coverMat };
}

function gutter(g, axis) {
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const d = axis === 'z' ? p.getZ(i) : p.getY(i), dip = -.0045 * Math.exp(-d / .012);
    if (axis === 'z') p.setY(i, p.getY(i) + dip); else p.setZ(i, p.getZ(i) + dip);
  }
  g.computeVertexNormals();
}
