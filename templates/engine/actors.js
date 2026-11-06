// 3D paper actor rigs and choreography for The Airplane Window Breather Hole
import * as THREE from 'three';
import * as A from './art.js';
import { cv } from './paper.js';
import { cutMesh, blobShadow } from './cutmesh.js';
import { clamp, lerp, seg, ss, eio, eo, back, TAU } from './lib.js';

export function makePassengerActor() {
  const c = cv(A.PASS_W, A.PASS_H);
  A.drawPassenger(c.getContext('2d'), { lean: 0, arm: 'point', mouth: 'o' });
  const mesh = cutMesh({ c, w: 0.12, h: 0.16, ax: 0.5, ay: 0.90 });
  const shadow = blobShadow(0.06, 0.45);
  shadow.position.set(0, 0.0005, 0);

  const root = new THREE.Group();
  root.add(mesh);
  root.add(shadow);
  return { root, mesh, shadow, canvas: c };
}

export function makeEngineerActor() {
  const c = cv(A.ENG_W, A.ENG_H);
  A.drawEngineer(c.getContext('2d'), { headShake: 0 });
  const mesh = cutMesh({ c, w: 0.13, h: 0.17, ax: 0.5, ay: 0.90 });
  const shadow = blobShadow(0.06, 0.45);
  shadow.position.set(0, 0.0005, 0);

  const root = new THREE.Group();
  root.add(mesh);
  root.add(shadow);
  return { root, mesh, shadow, canvas: c };
}

export function makeCometFuselageActor() {
  const c = cv(A.COMET_W, A.COMET_H);
  A.drawCometFuselage(c.getContext('2d'), { stressAlpha: 1.0, crackProgress: 0 });
  const mesh = cutMesh({ c, w: 0.28, h: 0.18, ax: 0.5, ay: 0.88 });
  const shadow = blobShadow(0.12, 0.45);
  shadow.position.set(0, 0.0005, 0);

  const root = new THREE.Group();
  root.add(mesh);
  root.add(shadow);
  return { root, mesh, shadow, canvas: c };
}

export function makeExplodedLayers() {
  const cOut = cv(A.EXP_W, A.EXP_H); A.drawExplodedPane(cOut.getContext('2d'), 'outer');
  const cMid = cv(A.EXP_W, A.EXP_H); A.drawExplodedPane(cMid.getContext('2d'), 'middle');
  const cInn = cv(A.EXP_W, A.EXP_H); A.drawExplodedPane(cInn.getContext('2d'), 'inner');

  const mOut = cutMesh({ c: cOut, w: 0.16, h: 0.13, ax: 0.5, ay: 0.94 });
  const mMid = cutMesh({ c: cMid, w: 0.16, h: 0.13, ax: 0.5, ay: 0.94 });
  const mInn = cutMesh({ c: cInn, w: 0.16, h: 0.13, ax: 0.5, ay: 0.94 });

  const root = new THREE.Group();
  root.add(mOut); root.add(mMid); root.add(mInn);
  return { root, mOut, mMid, mInn };
}
