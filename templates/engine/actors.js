// Dynamic Posable Actors for The Hidden Geometry of QWERTY
import * as THREE from 'three';
import * as A from './art.js';
import { cv } from './paper.js';
import { texOf } from './book.js';
import { blobShadow } from './cutmesh.js';

function dynPlane(c, h, ax, ay, side) {
  const t = texOf(c), w = h * c.width / c.height;
  const g = new THREE.PlaneGeometry(w, h);
  g.translate(w / 2 - ax * w, ay * h - h / 2, 0);
  const m = new THREE.MeshStandardMaterial({
    map: t,
    alphaTest: 0.5,
    alphaToCoverage: false,
    roughness: 0.85,
    side
  });
  const mesh = new THREE.Mesh(g, m);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.customDepthMaterial = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking,
    map: t,
    alphaTest: 0.5,
    side: THREE.DoubleSide
  });
  return { mesh, t, c };
}

// 1. Posable Modern Smartphone User Character
export function makeUserActor(H = 0.16) {
  const cF = cv(A.USER_W, A.USER_H);
  A.drawUserCharacter(cF.getContext('2d'), {});
  const P = dynPlane(cF, H, 0.5, 0.95, THREE.DoubleSide);

  const root = new THREE.Group();
  const body = new THREE.Group();
  body.add(P.mesh);
  root.add(body);

  const shadow = blobShadow(H * 0.45, 0.4);
  root.add(shadow);

  let key = '';
  return {
    root,
    body,
    shadow,
    H,
    pose(p) {
      const k = JSON.stringify(p, (kk, v) => typeof v === 'number' ? Math.round(v * 30) / 30 : v);
      if (k === key) return;
      key = k;
      A.drawUserCharacter(cF.getContext('2d'), p);
      P.t.needsUpdate = true;
    },
    head(v = new THREE.Vector3()) {
      return v.set(0, H * 0.92, 0).applyMatrix4(body.matrixWorld);
    }
  };
}

// 2. Posable Christopher Latham Sholes (1873)
export function makeSholesActor(H = 0.17) {
  const cF = cv(A.SHOLES_W, A.SHOLES_H);
  A.drawSholesCharacter(cF.getContext('2d'), {});
  const P = dynPlane(cF, H, 0.5, 0.95, THREE.DoubleSide);

  const root = new THREE.Group();
  const body = new THREE.Group();
  body.add(P.mesh);
  root.add(body);

  const shadow = blobShadow(H * 0.48, 0.4);
  root.add(shadow);

  let key = '';
  return {
    root,
    body,
    shadow,
    H,
    pose(p) {
      const k = JSON.stringify(p, (kk, v) => typeof v === 'number' ? Math.round(v * 30) / 30 : v);
      if (k === key) return;
      key = k;
      A.drawSholesCharacter(cF.getContext('2d'), p);
      P.t.needsUpdate = true;
    },
    head(v = new THREE.Vector3()) {
      return v.set(0, H * 0.94, 0).applyMatrix4(body.matrixWorld);
    }
  };
}

// 3. Posable Morse Telegraph Operator
export function makeTelegraphActor(H = 0.165) {
  const cF = cv(A.TELE_W, A.TELE_H);
  A.drawTelegraphOperator(cF.getContext('2d'), {});
  const P = dynPlane(cF, H, 0.5, 0.95, THREE.DoubleSide);

  const root = new THREE.Group();
  const body = new THREE.Group();
  body.add(P.mesh);
  root.add(body);

  const shadow = blobShadow(H * 0.45, 0.4);
  root.add(shadow);

  let key = '';
  return {
    root,
    body,
    shadow,
    H,
    pose(p) {
      const k = JSON.stringify(p, (kk, v) => typeof v === 'number' ? Math.round(v * 30) / 30 : v);
      if (k === key) return;
      key = k;
      A.drawTelegraphOperator(cF.getContext('2d'), p);
      P.t.needsUpdate = true;
    }
  };
}
