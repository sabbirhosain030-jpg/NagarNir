'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface VerticalCitySceneProps {
  scrollProgress: number;
}

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function VerticalCityScene({ scrollProgress }: VerticalCitySceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    buildings: { mesh: THREE.Mesh; targetY: number; growDelay: number }[];
    particles: THREE.Points;
    animStart: number;
    rafId: number;
    dispose: () => void;
  } | null>(null);

  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const W = container.clientWidth;
    const H = container.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0d0f12, 0.018);

    // Camera
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);
    camera.position.set(0, 8, 28);

    // Lights
    const ambient = new THREE.AmbientLight(0x1a2b3c, 0.6);
    scene.add(ambient);
    const keyLight = new THREE.DirectionalLight(0xd4820a, 1.2);
    keyLight.position.set(-8, 20, 10);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0x2a6496, 0.5);
    fillLight.position.set(10, 5, -10);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0xf2f0eb, 0.3);
    rimLight.position.set(0, -5, 20);
    scene.add(rimLight);

    // Ground
    const groundGeo = new THREE.PlaneGeometry(120, 120);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x0a0d10 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const grid = new THREE.GridHelper(80, 40, 0x1a2b3c, 0x1a2b3c);
    grid.material = new THREE.LineBasicMaterial({ color: 0x1a2b3c, opacity: 0.4, transparent: true });
    scene.add(grid);

    // Buildings
    const rand = seededRand(42);
    const buildings: { mesh: THREE.Mesh; targetY: number; growDelay: number }[] = [];
    const ROWS = 5;
    const COLS = 9;

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const w = 0.8 + rand() * 1.4;
        const h = 2 + rand() * 14 * (1 + (ROWS - row) * 0.2);
        const d = 0.8 + rand() * 1.4;

        const geo = new THREE.BoxGeometry(w, h, d);
        const hue = rand() > 0.5 ? 0x1a2b3c : 0x0d1520;
        const mat = new THREE.MeshStandardMaterial({ color: hue, roughness: 0.8, metalness: 0.2 });
        const mesh = new THREE.Mesh(geo, mat);

        const x = (col - COLS / 2) * 6.5 + (rand() - 0.5) * 2;
        const z = (row - ROWS / 2) * 6.5 + (rand() - 0.5) * 2;
        const targetY = h / 2;

        mesh.position.set(x, -h / 2, z);
        scene.add(mesh);

        // Amber windows
        const windowCount = Math.floor(rand() * 6) + 2;
        for (let w2 = 0; w2 < windowCount; w2++) {
          const wGeo = new THREE.BoxGeometry(0.2, 0.3, 0.05);
          const wMat = new THREE.MeshStandardMaterial({
            color: 0xd4820a,
            emissive: 0xd4820a,
            emissiveIntensity: rand() * 0.8 + 0.2,
          });
          const windowMesh = new THREE.Mesh(wGeo, wMat);
          windowMesh.position.set(
            (rand() - 0.5) * (w - 0.4),
            (rand() - 0.5) * (h * 0.6),
            d / 2 + 0.03
          );
          mesh.add(windowMesh);
        }

        buildings.push({ mesh, targetY, growDelay: rand() * 1200 });
      }
    }

    // Particles
    const particleCount = 800;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (rand() - 0.5) * 60;
      positions[i * 3 + 1] = rand() * 30;
      positions[i * 3 + 2] = (rand() - 0.5) * 60;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xd4820a, size: 0.08, sizeAttenuation: true, transparent: true, opacity: 0.7 });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Animation loop
    const animStart = performance.now();
    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - animStart) / 1000;
      const sp = scrollRef.current;

      // Grow buildings
      buildings.forEach(({ mesh, targetY, growDelay }) => {
        const t = Math.max(0, (performance.now() - animStart - growDelay) / 1200);
        const ease = 1 - Math.pow(Math.max(0, 1 - t * 0.7), 3);
        mesh.position.y += (targetY * ease - mesh.position.y) * 0.1;
      });

      // Particles drift
      const pos = pGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        pos.array[i * 3 + 1] += 0.02;
        if (pos.array[i * 3 + 1] > 30) pos.array[i * 3 + 1] = 0;
      }
      pos.needsUpdate = true;
      pMat.opacity = 0.5 + 0.3 * Math.sin(elapsed * 0.8);

      // Camera oscillation
      const targetCamX = Math.sin(elapsed * 0.04) * 3;
      const targetCamY = 8 + Math.sin(elapsed * 0.025) * 1.5;
      const targetCamZ = 28 + sp * 24;
      const targetCamYScroll = 8 + sp * 10;
      camera.position.x += (targetCamX - camera.position.x) * 0.02;
      camera.position.y += (targetCamYScroll - camera.position.y) * 0.12;
      camera.position.z += (targetCamZ - camera.position.z) * 0.12;
      camera.lookAt(0, 4, 0);

      renderer.domElement.style.opacity = String(Math.max(0, 1 - sp * 1.4));
      renderer.render(scene, camera);
    };

    animate();

    // Resize
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    sceneRef.current = {
      renderer, scene, camera, buildings, particles, animStart,
      rafId,
      dispose: () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', onResize);
        buildings.forEach(({ mesh }) => {
          mesh.geometry.dispose();
          (mesh.material as THREE.Material).dispose();
        });
        pGeo.dispose();
        pMat.dispose();
        groundGeo.dispose();
        groundMat.dispose();
        renderer.dispose();
        container.removeChild(renderer.domElement);
      },
    };

    return () => sceneRef.current?.dispose();
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ position: 'absolute', inset: 0, zIndex: 1 }}
      aria-hidden="true"
    />
  );
}
