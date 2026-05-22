'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  PIPE_RADIUS, PIPE_TUBE, FLANGE_R, FLANGE_T,
  FLANGE_BOLT_R, FLANGE_BOLTS, CAPSULE_WALL_OFFSET,
  CAPSULE_RAD_SEG, CAPSULE_TUBE_SEG, CAP_DISC_OVERHANG,
  CENTERLINE_POINTS,
} from '@/lib/constants';

// ── Easing ────────────────────────────────────────────────────────────────────
const easing = {
  linear:       (t: number) => t,
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeOutBack:  (t: number) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
};

const _activeTweens = new Map<string, () => void>();
function tween(opts: {
  key?: string; duration?: number; delay?: number;
  ease?: (t: number) => number;
  onUpdate: (e: number, t: number) => void;
  onComplete?: () => void;
}) {
  const { key, duration = 400, delay = 0, ease = easing.easeOutCubic, onUpdate, onComplete } = opts;
  if (key && _activeTweens.has(key)) _activeTweens.get(key)!();
  const start = performance.now() + delay;
  let cancelled = false;
  const tick = (now: number) => {
    if (cancelled) return;
    if (now < start) { requestAnimationFrame(tick); return; }
    const t = Math.min(1, (now - start) / duration);
    onUpdate(ease(t), t);
    if (t < 1) requestAnimationFrame(tick);
    else { onComplete?.(); if (key) _activeTweens.delete(key); }
  };
  requestAnimationFrame(tick);
  const cancel = () => { cancelled = true; };
  if (key) _activeTweens.set(key, cancel);
  return cancel;
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface CapRecord {
  type: 'cap';
  mesh: THREE.Mesh;
  outward: THREE.Vector3;
  closedPos: THREE.Vector3;
  mat: THREE.MeshStandardMaterial;
  edgeMat: THREE.MeshStandardMaterial;
}
interface TubeRecord {
  type: 'sweep-tube';
  geo: THREE.TubeGeometry;
  totalIndex: number;
}
interface BeadRecord {
  type: 'bead';
  mesh: THREE.Mesh;
  mat: THREE.MeshStandardMaterial;
}
type CapsulePiece = CapRecord | TubeRecord | BeadRecord;

export interface SceneHandle {
  showStep: (step: number) => void;
}

export function useScene(canvasRef: React.RefObject<HTMLCanvasElement | null>): React.MutableRefObject<SceneHandle | null> {
  const handleRef = useRef<SceneHandle | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Renderer ───────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0xf2f2f2, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // ── Scene ──────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf2f2f2);
    scene.fog = new THREE.Fog(0xf2f2f2, 320, 900);

    const camera = new THREE.PerspectiveCamera(40,
      canvas.clientWidth / canvas.clientHeight, 0.1, 2000);
    camera.position.set(180, 130, 220);
    camera.lookAt(40, 40, 50);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(40, 40, 50);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.72));
    const key = new THREE.DirectionalLight(0xffffff, 0.95);
    key.position.set(100, 250, 150); key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xfff4e8, 0.45);
    fill.position.set(-200, 100, -100);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xe86200, 0.16);
    rim.position.set(0, -100, -200);
    scene.add(rim);

    const grid = new THREE.GridHelper(600, 60, 0x9aa4b0, 0xc6cdd5);
    grid.position.y = -10;
    (grid.material as THREE.Material & { opacity: number; transparent: boolean }).opacity = 0.55;
    (grid.material as THREE.Material & { transparent: boolean }).transparent = true;
    scene.add(grid);

    // ── Materials ──────────────────────────────────────────────────────────
    const matSteel = new THREE.MeshStandardMaterial({ color: 0xb8b8c0, metalness: 0.75, roughness: 0.35 });
    const matBlank = new THREE.MeshStandardMaterial({ color: 0xe86200, metalness: 0.45, roughness: 0.55, transparent: true, opacity: 0.38 });
    const matCapsule = new THREE.MeshStandardMaterial({ color: 0x6a6a6a, metalness: 0.4, roughness: 0.7, side: THREE.DoubleSide });
    const matJig = new THREE.MeshStandardMaterial({ color: 0xe86200, metalness: 0.3, roughness: 0.65 });
    const matWelds = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.3 });

    // ── Curves ────────────────────────────────────────────────────────────
    const pipeCurve = new THREE.CatmullRomCurve3(
      CENTERLINE_POINTS.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
      false, 'centripetal', 0.5
    );

    const branchStart = pipeCurve.getPoint(0.55);
    const branchTangent = pipeCurve.getTangent(0.55);
    let bPerp = new THREE.Vector3().crossVectors(branchTangent, new THREE.Vector3(1, 0, 0)).normalize();
    if (bPerp.z < 0) bPerp.negate();
    const branchCurve = new THREE.CatmullRomCurve3([
      branchStart,
      branchStart.clone().add(bPerp.clone().multiplyScalar(18)),
      branchStart.clone().add(bPerp.clone().multiplyScalar(48)).add(new THREE.Vector3(0, 6, 0)),
      branchStart.clone().add(bPerp.clone().multiplyScalar(72)).add(new THREE.Vector3(0, 10, 0)),
    ], false, 'centripetal', 0.5);

    const flangePositions = [
      { point: pipeCurve.getPoint(0.0), tangent: pipeCurve.getTangent(0.0), outward: pipeCurve.getTangent(0.0).clone().negate().normalize() },
      { point: pipeCurve.getPoint(1.0), tangent: pipeCurve.getTangent(1.0), outward: pipeCurve.getTangent(1.0).clone().normalize() },
      { point: branchCurve.getPoint(1.0), tangent: branchCurve.getTangent(1.0), outward: branchCurve.getTangent(1.0).clone().normalize() },
    ];

    // ── Helpers ───────────────────────────────────────────────────────────
    function buildPipe(curve: THREE.CatmullRomCurve3, radius: number, mat: THREE.Material): THREE.Mesh {
      const geo = new THREE.TubeGeometry(curve, 200, radius, 16, false);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true; mesh.receiveShadow = true;
      return mesh;
    }

    function buildFlange(point: THREE.Vector3, tangent: THREE.Vector3, mat: THREE.Material, sizeMult = 1.0): THREE.Group {
      const grp = new THREE.Group();
      grp.add(new THREE.Mesh(new THREE.CylinderGeometry(FLANGE_R * sizeMult, FLANGE_R * sizeMult, FLANGE_T, 32), mat));
      for (let i = 0; i < FLANGE_BOLTS; i++) {
        const a = (i / FLANGE_BOLTS) * Math.PI * 2;
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, FLANGE_T + 1, 12), matWelds);
        bolt.position.set(Math.cos(a) * FLANGE_BOLT_R * sizeMult, 0, Math.sin(a) * FLANGE_BOLT_R * sizeMult);
        grp.add(bolt);
      }
      grp.position.copy(point);
      grp.quaternion.copy(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent.clone().normalize()));
      return grp;
    }

    function radialUpAt(t: number): THREE.Vector3 {
      const tan = pipeCurve.getTangent(t);
      let up = new THREE.Vector3(0, 1, 0);
      const dot = Math.abs(up.dot(tan));
      if (dot > 0.98) up.set(0, 0, 1);
      return up.sub(tan.clone().multiplyScalar(up.dot(tan))).normalize();
    }

    function surfacePointAt(t: number, extra = 0): THREE.Vector3 {
      const pos = pipeCurve.getPoint(t);
      const up = radialUpAt(t);
      return pos.add(up.multiplyScalar(PIPE_RADIUS + CAPSULE_WALL_OFFSET + extra));
    }

    // ── Target pipe ────────────────────────────────────────────────────────
    const groupTarget = new THREE.Group();
    groupTarget.add(buildPipe(pipeCurve, PIPE_RADIUS, matSteel));
    groupTarget.add(buildPipe(branchCurve, PIPE_RADIUS * 0.7, matSteel));
    flangePositions.forEach(f => groupTarget.add(buildFlange(f.point, f.tangent, matSteel)));
    scene.add(groupTarget);

    // ── Blank ──────────────────────────────────────────────────────────────
    const groupBlank = new THREE.Group();
    groupBlank.add(buildPipe(pipeCurve, PIPE_RADIUS + 5, matBlank));
    groupBlank.add(buildPipe(branchCurve, PIPE_RADIUS * 0.7 + 5, matBlank));
    flangePositions.forEach(f => groupBlank.add(buildFlange(f.point, f.tangent, matBlank, 1.18)));
    groupBlank.visible = false;
    scene.add(groupBlank);

    // ── Conformal capsule ─────────────────────────────────────────────────
    const groupCapsule = new THREE.Group();
    const capsulePieces: CapsulePiece[] = [];

    // Body tube
    const bodyGeo = new THREE.TubeGeometry(pipeCurve, CAPSULE_TUBE_SEG, PIPE_RADIUS + CAPSULE_WALL_OFFSET, CAPSULE_RAD_SEG, false);
    const bodyMesh = new THREE.Mesh(bodyGeo, matCapsule.clone());
    bodyMesh.castShadow = true;
    groupCapsule.add(bodyMesh);
    capsulePieces.push({ type: 'sweep-tube', geo: bodyGeo, totalIndex: (bodyGeo.index?.count ?? 0) });

    // Branch tube
    const branchCapR = PIPE_RADIUS * 0.78 + CAPSULE_WALL_OFFSET;
    const branchGeo = new THREE.TubeGeometry(branchCurve, 48, branchCapR, CAPSULE_RAD_SEG, false);
    const branchMesh = new THREE.Mesh(branchGeo, matCapsule.clone());
    branchMesh.castShadow = true;
    groupCapsule.add(branchMesh);
    capsulePieces.push({ type: 'sweep-tube', geo: branchGeo, totalIndex: (branchGeo.index?.count ?? 0) });

    // Dished caps (torispherical-style domes)
    const DOME_R = FLANGE_R + CAP_DISC_OVERHANG;
    flangePositions.forEach(fp => {
      const capMat = matCapsule.clone() as THREE.MeshStandardMaterial;
      capMat.transparent = true; capMat.opacity = 0;
      const edgeMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.3 });
      const capGeo = new THREE.SphereGeometry(DOME_R, 28, 14, 0, Math.PI * 2, 0, Math.PI / 4.5);
      const capMesh = new THREE.Mesh(capGeo, capMat);
      const closedPos = fp.point.clone().add(fp.outward.clone().multiplyScalar(2));
      capMesh.position.copy(closedPos);
      capMesh.quaternion.copy(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), fp.outward));
      groupCapsule.add(capMesh);
      capsulePieces.push({ type: 'cap', mesh: capMesh, outward: fp.outward, closedPos, mat: capMat, edgeMat });
    });

    // Weld bead at branch tee
    const beadMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.3, transparent: true, opacity: 0 }) as THREE.MeshStandardMaterial;
    const beadGeo = new THREE.TorusGeometry(branchCapR, 2, 12, 32);
    const beadMesh = new THREE.Mesh(beadGeo, beadMat);
    beadMesh.position.copy(branchStart);
    beadMesh.quaternion.copy(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), branchTangent.normalize()));
    groupCapsule.add(beadMesh);
    capsulePieces.push({ type: 'bead', mesh: beadMesh, mat: beadMat });

    groupCapsule.visible = false;
    scene.add(groupCapsule);

    // ── Ports + hooks ──────────────────────────────────────────────────────
    const groupPorts = new THREE.Group();

    function addPort(t: number, r: number, h: number) {
      const pos = surfacePointAt(t);
      const up = radialUpAt(t);
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 16), matWelds);
      tube.position.copy(pos.clone().add(up.clone().multiplyScalar(h / 2)));
      tube.quaternion.copy(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), up));
      groupPorts.add(tube);
    }

    function addHook(t: number) {
      const pos = surfacePointAt(t, 2);
      const up = radialUpAt(t);
      const tan = pipeCurve.getTangent(t);
      const base = new THREE.Mesh(new THREE.BoxGeometry(8, 3, 8), matWelds);
      base.position.copy(pos);
      groupPorts.add(base);
      const post = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 10, 12), matWelds);
      post.position.copy(pos.clone().add(up.clone().multiplyScalar(6)));
      post.quaternion.copy(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), up));
      groupPorts.add(post);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(3.5, 1, 10, 24), matWelds);
      ring.position.copy(pos.clone().add(up.clone().multiplyScalar(12)));
      ring.quaternion.copy(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), tan.normalize()));
      groupPorts.add(ring);
    }

    addPort(0.92, 4, 30);  // fill pipe
    addPort(0.08, 2.5, 24); // degas tube
    [0.04, 0.16, 0.85, 0.97].forEach(addHook);

    groupPorts.visible = false;
    scene.add(groupPorts);

    // ── Exploded view ──────────────────────────────────────────────────────
    const groupExploded = new THREE.Group();
    // body tube elevated
    const exBody = bodyMesh.clone();
    exBody.position.y += 50;
    groupExploded.add(exBody);
    // branch offset
    const exBranch = branchMesh.clone();
    exBranch.position.set(-20, 30, -20);
    groupExploded.add(exBranch);
    // caps exploded outward
    flangePositions.forEach((fp, i) => {
      const capGeo2 = new THREE.SphereGeometry(DOME_R, 28, 14, 0, Math.PI * 2, 0, Math.PI / 4.5);
      const cap2 = new THREE.Mesh(capGeo2, matCapsule.clone());
      cap2.position.copy(fp.point.clone().add(fp.outward.clone().multiplyScalar(75)));
      cap2.quaternion.copy(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), fp.outward));
      groupExploded.add(cap2);
    });
    groupExploded.visible = false;
    scene.add(groupExploded);

    // ── Jig ────────────────────────────────────────────────────────────────
    const groupJig = new THREE.Group();
    const cradleR = PIPE_RADIUS + CAPSULE_WALL_OFFSET + 3;
    const saddles = [0.05, 0.32, 0.62, 0.93];

    // I-beam base
    [-8, 8].forEach(z => {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(240, 6, 8), matJig);
      beam.position.set(20, -28, z);
      groupJig.add(beam);
    });
    [-60, 20, 100].forEach(x => {
      const cross = new THREE.Mesh(new THREE.BoxGeometry(8, 6, 24), matJig);
      cross.position.set(x, -28, 0);
      groupJig.add(cross);
    });

    saddles.forEach((t, i) => {
      const sp = pipeCurve.getPoint(t);
      const tan = pipeCurve.getTangent(t);
      const up = radialUpAt(t);
      const side = new THREE.Vector3().crossVectors(tan, up).normalize();

      // V-saddle (lower half-shell)
      const saddleGeo = new THREE.CylinderGeometry(cradleR + 4, cradleR + 4, 18, 28, 1, true, -Math.PI / 2, Math.PI);
      const saddle = new THREE.Mesh(saddleGeo, matJig);
      saddle.position.copy(sp);
      saddle.quaternion.setFromRotationMatrix(
        new THREE.Matrix4().makeBasis(side, up.clone().negate(), tan)
      );
      groupJig.add(saddle);

      // vertical post
      const postH = Math.max(8, sp.y - cradleR - (-28));
      const post = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, postH, 12), matJig);
      post.position.set(sp.x, -28 + postH / 2, sp.z);
      groupJig.add(post);

      // foot pad
      const foot = new THREE.Mesh(new THREE.BoxGeometry(14, 3, 14), matJig);
      foot.position.set(sp.x, -30, sp.z);
      groupJig.add(foot);

      // anti-rotation pins on middle saddles
      if (i === 1 || i === 2) {
        const pin = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 8, 10), matWelds);
        pin.position.copy(sp.clone().add(side.clone().multiplyScalar(cradleR + 2)));
        groupJig.add(pin);
      }
    });

    // corner lift lugs
    [[-80, -60], [-80, 60], [120, -60], [120, 60]].forEach(([x, z]) => {
      const lug = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.9, 10, 24), matWelds);
      lug.position.set(x, -22, z);
      groupJig.add(lug);
    });

    groupJig.visible = false;
    scene.add(groupJig);

    // ── Capsule assembly animation ──────────────────────────────────────────
    let previousStep = -1;

    function playCapsuleAssembly() {
      capsulePieces.forEach((piece, idx) => {
        if (piece.type === 'sweep-tube') {
          const isBody = idx === 0;
          piece.geo.setDrawRange(0, 0);
          tween({
            key: `sweep-${idx}`,
            duration: isBody ? 720 : 480,
            delay: isBody ? 0 : 320,
            ease: easing.easeOutCubic,
            onUpdate: (e) => {
              piece.geo.setDrawRange(0, Math.floor(piece.totalIndex * e));
            },
          });
        } else if (piece.type === 'cap') {
          const capIdx = capsulePieces.filter((p, i) => i < idx && p.type === 'cap').length;
          const explodedPos = piece.closedPos.clone().add(piece.outward.clone().multiplyScalar(60));
          piece.mesh.position.copy(explodedPos);
          piece.mat.opacity = 0;
          tween({
            key: `cap-pos-${idx}`,
            duration: 460,
            delay: 520 + capIdx * 140,
            ease: easing.easeOutBack,
            onUpdate: (e) => {
              piece.mesh.position.lerpVectors(explodedPos, piece.closedPos, e);
              piece.mat.opacity = e;
            },
            onComplete: () => {
              tween({
                key: `weld-${idx}`,
                duration: 320,
                ease: easing.linear,
                onUpdate: (e) => {
                  const wave = e < 0.5 ? e * 2 : (1 - e) * 2;
                  piece.mat.color.setHex(wave > 0.5 ? 0xff6a18 : 0x111111);
                },
              });
            },
          });
        } else if (piece.type === 'bead') {
          piece.mat.opacity = 0;
          tween({
            key: 'bead-fade',
            duration: 280,
            delay: 760,
            ease: easing.easeOutCubic,
            onUpdate: (e) => { piece.mat.opacity = e * 0.9; },
            onComplete: () => {
              tween({
                key: 'bead-flash',
                duration: 360,
                ease: easing.linear,
                onUpdate: (e) => {
                  const wave = e < 0.5 ? e * 2 : (1 - e) * 2;
                  piece.mat.color.setHex(wave > 0.5 ? 0xff6a18 : 0x111111);
                },
              });
            },
          });
        }
      });
    }

    // ── Step visibility controller ──────────────────────────────────────────
    function showStep(step: number) {
      groupTarget.visible = step >= 1;
      groupBlank.visible = step === 2;
      groupCapsule.visible = step >= 3 && step <= 4;
      groupPorts.visible = step === 4;
      groupExploded.visible = step === 5;
      groupJig.visible = step === 6;

      if (step === 3 && previousStep !== 3) {
        playCapsuleAssembly();
      }
      previousStep = step;
    }

    handleRef.current = { showStep };

    // ── Render loop ────────────────────────────────────────────────────────
    let animId: number;
    function animate() {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // ── Resize ─────────────────────────────────────────────────────────────
    const observer = new ResizeObserver(() => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      renderer.dispose();
      handleRef.current = null;
    };
  }, [canvasRef]);

  return handleRef;
}
