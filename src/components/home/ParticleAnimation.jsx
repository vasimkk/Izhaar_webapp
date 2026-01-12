import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

const ParticleAnimation = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const particlesRef = useRef(null);
  const composerRef = useRef(null);
  const animationRef = useRef(null);
  const stateRef = useRef({
    time: 0,
    disintegrationCycle: 0,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const particleCount = 3000;
    const cosmicColors = [
      new THREE.Color(0xFF1493), // Deep Pink
      new THREE.Color(0xDA70D6), // Orchid
      new THREE.Color(0xBA55D3), // Medium Orchid
      new THREE.Color(0x9932CC), // Dark Orchid
      new THREE.Color(0xFF69B4), // Hot Pink
    ];

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1500
    );
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(containerRef.current.clientWidth, containerRef.current.clientHeight),
      1.8,
      0.7,
      0.3
    );
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());

    // Create heart path using parametric equation
    const createHeartPath = (particleIndex, totalParticles) => {
      const t = (particleIndex / totalParticles) * Math.PI * 2;
      const scale = 2.5;

      let x = 16 * Math.pow(Math.sin(t), 3);
      let y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

      const finalX = x * scale;
      const finalY = y * scale;
      const z = Math.sin(t * 4) * 1.5;

      const jitterStrength = 0.3;
      return new THREE.Vector3(
        finalX + (Math.random() - 0.5) * jitterStrength,
        finalY + (Math.random() - 0.5) * jitterStrength,
        z + (Math.random() - 0.5) * jitterStrength * 0.5
      );
    };

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const heartPositions = new Float32Array(particleCount * 3);
    const disintegrationOffsets = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      const heartPos = createHeartPath(i, particleCount);

      positions[i3] = heartPos.x;
      positions[i3 + 1] = heartPos.y;
      positions[i3 + 2] = heartPos.z;

      heartPositions[i3] = heartPos.x;
      heartPositions[i3 + 1] = heartPos.y;
      heartPositions[i3 + 2] = heartPos.z;

      // Assign cosmic colors
      const colorIndex = Math.floor((i / particleCount) * cosmicColors.length);
      const color = cosmicColors[colorIndex];

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = 0.6 + Math.random() * 0.8;

      // Disintegration offsets - particles spread outward
      const offsetStrength = 40 + Math.random() * 50;
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.acos(2 * Math.random() - 1);

      disintegrationOffsets[i3] = Math.sin(theta) * Math.cos(phi) * offsetStrength;
      disintegrationOffsets[i3 + 1] = Math.sin(theta) * Math.sin(phi) * offsetStrength;
      disintegrationOffsets[i3 + 2] = Math.cos(theta) * offsetStrength * 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('heartPosition', new THREE.BufferAttribute(heartPositions, 3));
    geometry.setAttribute('disintegrationOffset', new THREE.BufferAttribute(disintegrationOffsets, 3));

    // Create particle texture - star shaped for cosmic feel
    const canvas = document.createElement('canvas');
    const size = 64;
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    const centerX = size / 2;
    const centerY = size / 2;
    const outerRadius = size * 0.45;
    const innerRadius = size * 0.2;
    const numPoints = 5;

    context.beginPath();
    context.moveTo(centerX, centerY - outerRadius);
    for (let i = 0; i < numPoints; i++) {
      const outerAngle = (i / numPoints) * Math.PI * 2 - Math.PI / 2;
      context.lineTo(centerX + outerRadius * Math.cos(outerAngle), centerY + outerRadius * Math.sin(outerAngle));
      const innerAngle = outerAngle + Math.PI / numPoints;
      context.lineTo(centerX + innerRadius * Math.cos(innerAngle), centerY + innerRadius * Math.sin(innerAngle));
    }
    context.closePath();

    const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, outerRadius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 200, 255, 0.95)');
    gradient.addColorStop(0.6, 'rgba(220, 100, 255, 0.7)');
    gradient.addColorStop(1, 'rgba(150, 50, 200, 0)');

    context.fillStyle = gradient;
    context.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const material = new THREE.PointsMaterial({
      size: 1.8,
      map: texture,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
      alphaTest: 0.01,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    particlesRef.current = particles;
    composerRef.current = composer;

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      stateRef.current.time += 0.016;
      stateRef.current.disintegrationCycle = (stateRef.current.time * 0.3) % 1;

      const positions = particles.geometry.attributes.position.array;
      const heartPositions = particles.geometry.attributes.heartPosition.array;
      const particleColors = particles.geometry.attributes.color.array;
      const particleSizes = particles.geometry.attributes.size.array;
      const disintegrationOffsets = particles.geometry.attributes.disintegrationOffset.array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const iSize = i;

        // Disintegration cycle: particles form heart, then disintegrate
        const cycleTime = 3;
        const particleDelay = (i / particleCount) * cycleTime * 0.3;
        const cycleProgress = (stateRef.current.disintegrationCycle * cycleTime + particleDelay) % cycleTime;
        
        let disintegrationAmount = 0;
        if (cycleProgress < 1) {
          disintegrationAmount = 0;
        } else if (cycleProgress < 1.8) {
          disintegrationAmount = (cycleProgress - 1) / 0.8;
        } else {
          disintegrationAmount = Math.max(0, 1 - (cycleProgress - 1.8) / 1.2);
        }

        disintegrationAmount = Math.sin(disintegrationAmount * Math.PI * 0.5);

        const homeX = heartPositions[i3];
        const homeY = heartPositions[i3 + 1];
        const homeZ = heartPositions[i3 + 2];

        let targetX = homeX;
        let targetY = homeY;
        let targetZ = homeZ;

        if (disintegrationAmount > 0.001) {
          targetX = homeX + disintegrationOffsets[i3] * disintegrationAmount;
          targetY = homeY + disintegrationOffsets[i3 + 1] * disintegrationAmount;
          targetZ = homeZ + disintegrationOffsets[i3 + 2] * disintegrationAmount;
        }

        positions[i3] += (targetX - positions[i3]) * 0.08;
        positions[i3 + 1] += (targetY - positions[i3 + 1]) * 0.08;
        positions[i3 + 2] += (targetZ - positions[i3 + 2]) * 0.08;

        // Color cycling with brightness pulse
        const colorIndex = Math.floor((i / particleCount) * cosmicColors.length);
        const baseColor = cosmicColors[colorIndex];
        
        const brightness = (0.7 + Math.sin(stateRef.current.time * 1.5 + i * 0.5) * 0.3) * 
                          (1 - disintegrationAmount * 0.5);

        particleColors[i3] = baseColor.r * brightness;
        particleColors[i3 + 1] = baseColor.g * brightness;
        particleColors[i3 + 2] = baseColor.b * brightness;

        let currentSize = (0.6 + Math.random() * 0.8) * (1 - disintegrationAmount * 0.7);
        currentSize *= 0.9 + Math.sin(stateRef.current.time * 3 + i * 0.3) * 0.1;
        particleSizes[iSize] = Math.max(0.05, currentSize);
      }

      particles.geometry.attributes.position.needsUpdate = true;
      particles.geometry.attributes.color.needsUpdate = true;
      particles.geometry.attributes.size.needsUpdate = true;

      composer.render();
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      composer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default ParticleAnimation;
