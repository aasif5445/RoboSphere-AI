import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { KNOWLEDGE_NODES } from '../data/roboticsCorpus';
import { sound } from '../utils/audio';

interface HeroCanvasProps {
  onNodeClick: (question: string) => void;
}

export const HeroCanvas: React.FC<HeroCanvasProps> = ({ onNodeClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [fps, setFps] = useState<number>(60);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.05);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 7.5);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x221111, 1.8);
    scene.add(ambientLight);

    const redSpotLight = new THREE.SpotLight(0xff2b2b, 8, 20, Math.PI / 4, 0.4, 1.5);
    redSpotLight.position.set(3, 5, 4);
    scene.add(redSpotLight);

    const blueBackLight = new THREE.DirectionalLight(0x4488ff, 1.2);
    blueBackLight.position.set(-4, 3, -3);
    scene.add(blueBackLight);

    const orbLight = new THREE.PointLight(0xff2b2b, 3.5, 8);
    scene.add(orbLight);

    // 5. Grid Floor with Perspective
    const gridHelper = new THREE.GridHelper(24, 30, 0xff2b2b, 0x220505);
    gridHelper.position.y = -2.2;
    scene.add(gridHelper);

    // Laser scan bar on grid
    const laserGeo = new THREE.BoxGeometry(24, 0.04, 0.15);
    const laserMat = new THREE.MeshBasicMaterial({ color: 0xff3333, transparent: true, opacity: 0.8 });
    const laserMesh = new THREE.Mesh(laserGeo, laserMat);
    laserMesh.position.y = -2.18;
    scene.add(laserMesh);

    // 6. Floating Holographic Particles
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 8 + 1;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      particleScales[i] = Math.random() * 0.05 + 0.02;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xff4444,
      size: 0.06,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 7. Floating Robotic Orb (Core + Dual Gyro Gimbal Rings)
    const orbGroup = new THREE.Group();
    orbGroup.position.set(2.4, 0.6, 0);

    // Core Sphere
    const coreGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x110202,
      emissive: 0xff2b2b,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.9,
      wireframe: true,
    });
    const coreSphere = new THREE.Mesh(coreGeo, coreMat);
    orbGroup.add(coreSphere);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(0.35, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0xff2222 });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    orbGroup.add(innerCore);

    // Outer Gyroscope Ring 1
    const ring1Geo = new THREE.TorusGeometry(0.85, 0.03, 16, 64);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      metalness: 0.95,
      roughness: 0.1,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    orbGroup.add(ring1);

    // Outer Gyroscope Ring 2
    const ring2Geo = new THREE.TorusGeometry(1.05, 0.025, 16, 64);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xff3b3b,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x550505,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    orbGroup.add(ring2);

    scene.add(orbGroup);

    // 8. 3D Robotic Arm
    const armGroup = new THREE.Group();
    armGroup.position.set(-2.6, -2.0, -0.5);

    // Base pedestal
    const baseGeo = new THREE.CylinderGeometry(0.65, 0.85, 0.4, 32);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x222228, metalness: 0.9, roughness: 0.3 });
    const baseMesh = new THREE.Mesh(baseGeo, armMat);
    baseMesh.position.y = 0.2;
    armGroup.add(baseMesh);

    // Shoulder swivel
    const shoulderSwivelGeo = new THREE.CylinderGeometry(0.45, 0.5, 0.35, 24);
    const shoulderSwivel = new THREE.Mesh(shoulderSwivelGeo, armMat);
    shoulderSwivel.position.y = 0.5;
    armGroup.add(shoulderSwivel);

    // Link 1 (Lower Arm)
    const link1Pivot = new THREE.Group();
    link1Pivot.position.set(0, 0.65, 0);
    armGroup.add(link1Pivot);

    const link1Mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 1.4, 0.28),
      new THREE.MeshStandardMaterial({ color: 0x18181f, metalness: 0.8, roughness: 0.2 })
    );
    link1Mesh.position.set(0, 0.7, 0);
    link1Pivot.add(link1Mesh);

    // Accent line on Link 1
    const link1Stripe = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 1.2, 0.3),
      new THREE.MeshBasicMaterial({ color: 0xff2b2b })
    );
    link1Stripe.position.set(0.13, 0.7, 0);
    link1Pivot.add(link1Stripe);

    // Elbow joint
    const elbowPivot = new THREE.Group();
    elbowPivot.position.set(0, 1.4, 0);
    link1Pivot.add(elbowPivot);

    const elbowCyl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.45, 24),
      new THREE.MeshStandardMaterial({ color: 0x33333d, metalness: 0.95, roughness: 0.1 })
    );
    elbowCyl.rotation.z = Math.PI / 2;
    elbowPivot.add(elbowCyl);

    // Link 2 (Forearm)
    const link2Mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 1.2, 0.22),
      armMat
    );
    link2Mesh.position.set(0, 0.6, 0);
    elbowPivot.add(link2Mesh);

    // Wrist and Gripper
    const wristPivot = new THREE.Group();
    wristPivot.position.set(0, 1.2, 0);
    elbowPivot.add(wristPivot);

    const gripperBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.2, 16),
      new THREE.MeshStandardMaterial({ color: 0x444455, metalness: 0.9 })
    );
    wristPivot.add(gripperBase);

    // Left gripper finger
    const fingerGeo = new THREE.BoxGeometry(0.05, 0.25, 0.08);
    const fingerMat = new THREE.MeshStandardMaterial({ color: 0xdd2222, metalness: 0.7 });
    const leftFinger = new THREE.Mesh(fingerGeo, fingerMat);
    leftFinger.position.set(-0.1, 0.2, 0);
    wristPivot.add(leftFinger);

    // Right gripper finger
    const rightFinger = new THREE.Mesh(fingerGeo, fingerMat);
    rightFinger.position.set(0.1, 0.2, 0);
    wristPivot.add(rightFinger);

    // Laser emitter beam from wrist
    const laserBeamGeo = new THREE.CylinderGeometry(0.012, 0.012, 4.0, 8);
    const laserBeamMat = new THREE.MeshBasicMaterial({ color: 0xff3b3b, transparent: true, opacity: 0.65 });
    const laserBeam = new THREE.Mesh(laserBeamGeo, laserBeamMat);
    laserBeam.position.set(0, 2.2, 0);
    wristPivot.add(laserBeam);

    scene.add(armGroup);

    // 9. Floating Knowledge Nodes with Glowing Lines
    const nodeMeshes: { id: string; mesh: THREE.Mesh; name: string; position: THREE.Vector3; questions: string[] }[] = [];
    const nodeGroup = new THREE.Group();

    KNOWLEDGE_NODES.forEach((node) => {
      const nGeo = new THREE.SphereGeometry(0.16, 24, 24);
      const nMat = new THREE.MeshStandardMaterial({
        color: 0x110202,
        emissive: new THREE.Color(node.color),
        emissiveIntensity: 0.7,
        metalness: 0.8,
        roughness: 0.2,
      });
      const mesh = new THREE.Mesh(nGeo, nMat);
      mesh.position.set(...node.position);
      mesh.userData = { id: node.id, name: node.name, questions: node.sampleQuestions };

      // Outer halo
      const haloGeo = new THREE.RingGeometry(0.22, 0.25, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(node.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.lookAt(camera.position);
      mesh.add(halo);

      nodeGroup.add(mesh);
      nodeMeshes.push({
        id: node.id,
        mesh,
        name: node.name,
        position: new THREE.Vector3(...node.position),
        questions: node.sampleQuestions,
      });
    });

    // Connecting laser lines between nodes
    const lineMat = new THREE.LineBasicMaterial({ color: 0x661111, transparent: true, opacity: 0.5 });
    for (let i = 0; i < nodeMeshes.length; i++) {
      for (let j = i + 1; j < nodeMeshes.length; j++) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          nodeMeshes[i].position,
          nodeMeshes[j].position,
        ]);
        const line = new THREE.Line(lineGeo, lineMat);
        nodeGroup.add(line);
      }
    }
    scene.add(nodeGroup);

    // 10. Mouse Interaction & Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / height) * 2 - 1);
      mouse.x = x;
      mouse.y = y;
      targetMouseX = x * 0.4;
      targetMouseY = y * 0.3;
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map((n) => n.mesh));
      if (intersects.length > 0) {
        const target = intersects[0].object as THREE.Mesh;
        const qList = target.userData?.questions as string[];
        if (qList && qList.length > 0) {
          sound.playClick();
          onNodeClick(qList[0]);
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    container.addEventListener('click', onClick);

    // Resize Handler
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    // 11. Animation Loop (Smooth 60 FPS)
    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = 0;

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = (time - lastTime) * 0.001;
      lastTime = time;

      // FPS tracking
      frameCount++;
      fpsTimer += delta;
      if (fpsTimer >= 1.0) {
        setFps(Math.round((frameCount / fpsTimer) * 10) / 10);
        frameCount = 0;
        fpsTimer = 0;
      }

      // Parallax smooth camera sway
      camera.position.x += (targetMouseX - camera.position.x) * 0.05;
      camera.position.y += (1.2 + targetMouseY - camera.position.y) * 0.05;
      camera.lookAt(0, 0.4, 0);

      // Animate Robotic Orb
      orbGroup.rotation.y += 0.008;
      ring1.rotation.x += 0.015;
      ring1.rotation.y += 0.012;
      ring2.rotation.z += 0.018;
      ring2.rotation.x -= 0.01;
      orbGroup.position.y = 0.6 + Math.sin(time * 0.002) * 0.15;
      orbLight.position.copy(orbGroup.position);

      // Animate Robotic Arm Idle Kinematics breathing
      shoulderSwivel.rotation.y = Math.sin(time * 0.001) * 0.25 + targetMouseX * 0.3;
      link1Pivot.rotation.z = Math.sin(time * 0.0012) * 0.15 - 0.2;
      elbowPivot.rotation.z = Math.cos(time * 0.0015) * 0.25 + 0.4;
      wristPivot.rotation.z = Math.sin(time * 0.002) * 0.2 - 0.2;

      // Animate Laser Sweep on Grid
      laserMesh.position.z = (Math.sin(time * 0.0015) * 8);

      // Animate Particles
      particles.rotation.y += 0.001;
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] -= delta * 0.2;
        if (positions[i] < -2.2) positions[i] = 5.0;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Check raycast hover on knowledge nodes
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map((n) => n.mesh));
      if (intersects.length > 0) {
        const hovered = intersects[0].object as THREE.Mesh;
        setHoveredNode(hovered.userData?.name || null);
        hovered.scale.set(1.4, 1.4, 1.4);
      } else {
        setHoveredNode(null);
        nodeMeshes.forEach((n) => n.mesh.scale.set(1, 1, 1));
      }

      // Gentle floating of knowledge nodes
      nodeGroup.rotation.y = Math.sin(time * 0.0004) * 0.1;

      renderer.render(scene, camera);
    };

    animate(performance.now());

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onNodeClick]);

  return (
    <div className="relative w-full h-full min-h-[580px] select-none">
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Telemetry Badges */}
      <div className="absolute top-20 right-6 hidden md:flex flex-col items-end gap-1.5 pointer-events-none font-mono text-[10px] text-gray-400">
        <div className="flex items-center gap-2 px-2.5 py-1 bg-black/60 border border-red-500/20 rounded backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
          <span className="text-gray-300">KINEMATICS: 3D THREE.JS</span>
          <span className="text-red-400 font-bold">{fps} FPS</span>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 bg-black/60 border border-white/10 rounded backdrop-blur-md">
          <span className="text-gray-400">IK RESOLVER:</span>
          <span className="text-white">DH-MATRIX ACTIVE</span>
        </div>
      </div>

      {/* Hovered Node Tooltip */}
      {hoveredNode && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-red-950/90 border border-red-500/60 rounded-lg text-white font-mono text-xs backdrop-blur-xl shadow-[0_0_20px_rgba(255,43,43,0.5)] animate-bounce pointer-events-none flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
          <span>KNOWLEDGE NODE: <strong className="text-white">{hoveredNode}</strong> (Click to query)</span>
        </div>
      )}
    </div>
  );
};
