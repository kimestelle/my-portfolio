'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';
import { BUBBLE_FRAGMENT_SHADER, BUBBLE_VERTEX_SHADER } from './bubbleMaterialShaders';
import { SoftBlob } from './SoftBlob';

type Pixel = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  age: number;
  life: number;
  color: string;
};

type Bubble = {
  x: number;
  y: number;
  baseX: number;
  radius: number;
  age: number;
  seed: number;
  driftVelocity: number;
  impactVelocityX: number;
  impactVelocityY: number;
  collisionContactX: number;
  collisionContactY: number;
  collisionVertexForce: number;
  launchSpeed: number;
  riseSpeed: number;
  body: SoftBlob;
  geometry: THREE.BufferGeometry;
  positionAttribute: THREE.BufferAttribute;
  normalAttribute: THREE.BufferAttribute;
  renderPositions: Float32Array;
  renderNormals: Float32Array;
  mesh: THREE.Mesh;
  material: THREE.ShaderMaterial;
  albedoTexture: THREE.Texture | null;
  previewVideo: HTMLVideoElement | null;
  videoIndex: number;
};

type ExpandedVideo = {
  index: number;
  originX: number;
  originY: number;
  radius: number;
};

const SOFT_CENTER_X = 116;
const SOFT_CENTER_Y = 100;
const SOFT_RADIUS = 66;
const FALLBACK_PALETTE = ['#7a5799', '#f08547', '#5cb3a3', '#ffffff', '#0a103d'];
const BUBBLE_VIDEO_PREVIEWS = Array.from(
  { length: 16 },
  (_, index) => `/creative-images/video-demos/optimized/bubble/preview-${String(index + 1).padStart(2, '0')}.m4v`,
);
const FULL_VIDEOS = Array.from(
  { length: 16 },
  (_, index) => `/creative-images/video-demos/optimized/video-${String(index + 1).padStart(2, '0')}.m4v`,
);

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(min: number, max: number, value: number) {
  const t = clamp((value - min) / (max - min), 0, 1);
  return t * t * (3 - 2 * t);
}

function hash(value: number) {
  const sine = Math.sin(value * 127.1) * 43758.5453123;
  return sine - Math.floor(sine);
}

function noise(value: number, seed: number) {
  const cell = Math.floor(value);
  const fraction = value - cell;
  const eased = fraction * fraction * (3 - 2 * fraction);
  const a = hash(cell + seed * 19.19);
  const b = hash(cell + 1 + seed * 19.19);
  return (a + (b - a) * eased) * 2 - 1;
}

function layeredNoise(value: number, seed: number) {
  return noise(value, seed) * 0.62
    + noise(value * 2.03 + 11.7, seed + 3.1) * 0.27
    + noise(value * 4.11 + 27.2, seed + 9.4) * 0.11;
}

export default function BubblePrototype() {
  const webglRef = useRef<HTMLCanvasElement>(null);
  const effectsRef = useRef<HTMLCanvasElement>(null);
  const fpsRef = useRef<HTMLOutputElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);
  const previewVideosRef = useRef(new Set<HTMLVideoElement>());
  const expandedRef = useRef<ExpandedVideo | null>(null);
  const [expanded, setExpanded] = useState<ExpandedVideo | null>(null);

  const closeExpanded = () => {
    expandedRef.current = null;
    setExpanded(null);
  };

  useEffect(() => {
    for (const video of previewVideosRef.current) {
      if (expanded) video.pause();
      else void video.play().catch(() => undefined);
    }
    if (expanded) void fullscreenVideoRef.current?.play().catch(() => undefined);
  }, [expanded]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeExpanded();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const webglCanvas = webglRef.current;
    const effectsCanvas = effectsRef.current;
    const effects = effectsCanvas?.getContext('2d');
    const fpsOutput = fpsRef.current;
    if (!webglCanvas || !effectsCanvas || !effects || !fpsOutput) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const renderer = new THREE.WebGLRenderer({ canvas: webglCanvas, alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 2000);
    camera.position.z = 600;

    const whiteTexture = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
    whiteTexture.colorSpace = THREE.SRGBColorSpace;
    whiteTexture.needsUpdate = true;
    const pointer = { x: 0, y: 0, present: false };
    let width = 1;
    let height = 1;
    let dpr = 1;
    let bubbles: Bubble[] = [];
    let pixels: Pixel[] = [];
    let frame = 0;
    let previousTime = performance.now();
    let fpsWindowStart = previousTime;
    let fpsFrames = 0;
    const availableVideoIndices = BUBBLE_VIDEO_PREVIEWS.map((_, index) => index);

    const createSurface = (body: SoftBlob) => {
      const renderPositions = new Float32Array(body.positions.length);
      const renderNormals = new Float32Array(body.normals.length);
      const geometry = new THREE.BufferGeometry();
      const positionAttribute = new THREE.BufferAttribute(renderPositions, 3).setUsage(THREE.DynamicDrawUsage);
      const normalAttribute = new THREE.BufferAttribute(renderNormals, 3).setUsage(THREE.DynamicDrawUsage);
      geometry.setAttribute('position', positionAttribute);
      geometry.setAttribute('normal', normalAttribute);
      geometry.setAttribute('uv', new THREE.BufferAttribute(body.uvs, 2));
      geometry.setIndex(new THREE.BufferAttribute(body.indices, 1));

      const material = new THREE.ShaderMaterial({
        vertexShader: BUBBLE_VERTEX_SHADER,
        fragmentShader: BUBBLE_FRAGMENT_SHADER,
        uniforms: {
          uAlbedo: { value: whiteTexture },
          uLightPosition: { value: new THREE.Vector3(-180, 220, 340) },
          uViewPosition: { value: new THREE.Vector3(0, 0, 0) },
          uWireframeMode: { value: 0 },
          uOpacity: { value: 0.0 },
          uTime: { value: 0 },
          uColorPhase: { value: Math.random() },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      return {
        geometry,
        positionAttribute,
        normalAttribute,
        renderPositions,
        renderNormals,
        mesh,
        material,
        albedoTexture: null,
      };
    };

    const syncBodyGeometry = (target: Bubble) => {
      const { body, renderPositions, renderNormals } = target;
      body.recomputeNormals();
      for (let offset = 0; offset < body.positions.length; offset += 3) {
        renderPositions[offset] = body.positions[offset] - SOFT_CENTER_X;
        renderPositions[offset + 1] = SOFT_CENTER_Y - body.positions[offset + 1];
        renderPositions[offset + 2] = body.positions[offset + 2];
        renderNormals[offset] = body.normals[offset];
        renderNormals[offset + 1] = -body.normals[offset + 1];
        renderNormals[offset + 2] = body.normals[offset + 2];
      }
      target.positionAttribute.needsUpdate = true;
      target.normalAttribute.needsUpdate = true;
    };

    const removeBubble = (target: Bubble) => {
      scene.remove(target.mesh);
      if (target.previewVideo) {
        target.previewVideo.pause();
        target.previewVideo.removeAttribute('src');
        target.previewVideo.load();
        previewVideosRef.current.delete(target.previewVideo);
      }
      target.albedoTexture?.dispose();
      target.material.dispose();
      target.geometry.dispose();
      bubbles = bubbles.filter((candidate) => candidate !== target);
      if (!availableVideoIndices.includes(target.videoIndex)) {
        availableVideoIndices.push(target.videoIndex);
      }
    };

    const attachVideoAlbedo = (target: Bubble) => {
      const video = document.createElement('video');
      video.src = BUBBLE_VIDEO_PREVIEWS[target.videoIndex];
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.setAttribute('playsinline', '');
      const texture = new THREE.VideoTexture(video);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      target.previewVideo = video;
      target.albedoTexture = texture;
      target.material.uniforms.uAlbedo.value = texture;
      previewVideosRef.current.add(video);
      void video.play().catch(() => undefined);
    };

    const resize = () => {
      const bounds = effectsCanvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      effectsCanvas.width = Math.round(width * dpr);
      effectsCanvas.height = Math.round(height * dpr);
      effects.setTransform(dpr, 0, 0, dpr, 0, 0);
      camera.left = -width * 0.5;
      camera.right = width * 0.5;
      camera.top = height * 0.5;
      camera.bottom = -height * 0.5;
      camera.updateProjectionMatrix();
    };

    const spawn = (x: number) => {
      const videoIndex = availableVideoIndices.shift();
      if (videoIndex === undefined) return;
      const radius = Math.min(
        height * (0.1 + Math.random() * 0.07),
        width * 0.36,
      );
      const safeX = clamp(x, radius * 1.08, width - radius * 1.08);
      const body = new SoftBlob(true);
      if (!reducedMotion) {
        for (let offset = 0; offset < body.positions.length; offset += 3) {
          body.positions[offset] = SOFT_CENTER_X + (body.positions[offset] - SOFT_CENTER_X) * 0.92;
          body.positions[offset + 1] = SOFT_CENTER_Y + (body.positions[offset + 1] - SOFT_CENTER_Y) * 1.12;
        }
      }
      const target: Bubble = {
        x: safeX,
        y: height + radius * 0.72,
        baseX: safeX,
        radius,
        age: 0,
        seed: Math.random() * 1000,
        driftVelocity: 0,
        impactVelocityX: 0,
        impactVelocityY: 0,
        collisionContactX: 0,
        collisionContactY: 0,
        collisionVertexForce: 0,
        launchSpeed: height * (0.42 + Math.random() * 0.04),
        riseSpeed: height * (0.052 + Math.random() * 0.012),
        body,
        videoIndex,
        previewVideo: null,
        ...createSurface(body),
      };
      bubbles.push(target);
      syncBodyGeometry(target);
      attachVideoAlbedo(target);
    };

    const pop = (target: Bubble) => {
      const count = Math.round(clamp(target.radius * 0.8, 80, 160));
      for (let index = 0; index < count; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const distance = target.radius * (0.18 + Math.sqrt(Math.random()) * 0.82);
        const speed = 60 + Math.random() * 180;
        pixels.push({
          x: target.x + Math.cos(angle) * distance,
          y: target.y + Math.sin(angle) * distance,
          vx: Math.cos(angle) * speed + target.driftVelocity,
          vy: Math.sin(angle) * speed - 28,
          size: 0.7 + Math.random() * 2.2,
          age: 0,
          life: 0.42 + Math.random() * 0.62,
          color: FALLBACK_PALETTE[Math.floor(Math.random() * FALLBACK_PALETTE.length)],
        });
      }
      removeBubble(target);
    };

    const pointerPosition = (event: PointerEvent) => {
      const bounds = effectsCanvas.getBoundingClientRect();
      return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    };

    const onPointerMove = (event: PointerEvent) => {
      const position = pointerPosition(event);
      pointer.x = position.x;
      pointer.y = position.y;
      pointer.present = true;
    };

    const onPointerLeave = () => {
      pointer.present = false;
    };

    const onPointerDown = (event: PointerEvent) => {
      const position = pointerPosition(event);
      pointer.x = position.x;
      pointer.y = position.y;
      const hit = [...bubbles].reverse().find((candidate) => (
        Math.hypot(position.x - candidate.x, position.y - candidate.y) <= candidate.radius
      ));
      if (hit) {
        if (event.altKey) {
          pop(hit);
          return;
        }
        const bounds = effectsCanvas.getBoundingClientRect();
        const nextExpanded = {
          index: hit.videoIndex,
          originX: bounds.left + hit.x,
          originY: bounds.top + hit.y,
          radius: hit.radius,
        };
        expandedRef.current = nextExpanded;
        setExpanded(nextExpanded);
        return;
      }
      pointer.present = event.pointerType === 'mouse';
      spawn(position.x);
    };

    const pullVertices = (target: Bubble, pointerDistance: number) => {
      const mouseProximity = pointer.present
        ? clamp(1 - (pointerDistance - target.radius) / (target.radius * 1.8), 0, 1)
        : 0;
      const collisionContactLength = Math.hypot(target.collisionContactX, target.collisionContactY);
      const hasCollision = collisionContactLength > 0.0001 && target.collisionVertexForce > 0;
      if (mouseProximity <= 0 && !hasCollision) return;

      const scale = target.radius / SOFT_RADIUS;
      const localPointerX = SOFT_CENTER_X + (pointer.x - target.x) / scale;
      const localPointerY = SOFT_CENTER_Y + (pointer.y - target.y) / scale;
      const pointerDirectionX = localPointerX - SOFT_CENTER_X;
      const pointerDirectionY = localPointerY - SOFT_CENTER_Y;
      const pointerLength = Math.hypot(pointerDirectionX, pointerDirectionY) || 1;
      const collisionTowardX = hasCollision ? target.collisionContactX / collisionContactLength : 0;
      const collisionTowardY = hasCollision ? target.collisionContactY / collisionContactLength : 0;
      const collisionPush = hasCollision
        ? clamp(target.collisionVertexForce / (target.radius * 0.1), 0, 1)
        : 0;
      const body = target.body;

      for (let offset = 0; offset < body.positions.length; offset += 3) {
        const radialX = body.positions[offset] - SOFT_CENTER_X;
        const radialY = body.positions[offset + 1] - SOFT_CENTER_Y;
        const radialLength = Math.hypot(radialX, radialY) || 1;
        const projectedDistance = Math.hypot(
          body.positions[offset] - localPointerX,
          body.positions[offset + 1] - localPointerY,
        );
        const localNearness = clamp(1 - projectedDistance / (SOFT_RADIUS * 1.25), 0, 1);
        const restRadialDistance = Math.hypot(
          body.restA[offset] - SOFT_CENTER_X,
          body.restA[offset + 1] - SOFT_CENTER_Y,
        ) / SOFT_RADIUS;
        // The silhouette carries most of the force, while projected interior
        // vertices receive a softer version of the same local interaction.
        const surfaceWeight = 0.2 + smoothstep(0.68, 0.96, restRadialDistance) * 0.8;
        const mouseFacing = Math.max(0, (
          radialX * pointerDirectionX + radialY * pointerDirectionY
        ) / (radialLength * pointerLength));
        const mouseInfluence = mouseProximity * Math.pow(mouseFacing, 3) * localNearness * surfaceWeight;
        body.velocities[offset] += (localPointerX - body.positions[offset]) * mouseInfluence * 0.012;
        body.velocities[offset + 1] += (localPointerY - body.positions[offset + 1]) * mouseInfluence * 0.012;
        body.velocities[offset + 2] += mouseInfluence * 0.7;

        if (hasCollision) {
          const contactFacing = Math.max(0, (
            radialX * collisionTowardX + radialY * collisionTowardY
          ) / radialLength);
          const collisionSurfaceWeight = 0.34 + smoothstep(0.6, 0.94, restRadialDistance) * 0.66;
          const collisionInfluence = Math.pow(contactFacing, 1.65) * collisionSurfaceWeight * collisionPush;
          // Contact-facing vertices follow the same soft field as the mouse,
          // but move away from the other bubble to form a shallow dent.
          body.velocities[offset] -= collisionTowardX * collisionInfluence * 2.15;
          body.velocities[offset + 1] -= collisionTowardY * collisionInfluence * 2.15;
          body.velocities[offset + 2] -= collisionInfluence * 0.78;
        }
      }
      body.active = true;
    };

    const applyMouseImpact = (target: Bubble, delta: number) => {
      if (pointer.present) {
        const awayX = target.x - pointer.x;
        const awayY = target.y - pointer.y;
        const distance = Math.hypot(awayX, awayY) || 1;
        const impactRadius = target.radius * 2.8;
        const proximity = clamp(1 - distance / impactRadius, 0, 1);
        const force = proximity * proximity * target.radius * 8.5;
        target.impactVelocityX += (awayX / distance) * force * delta;
        target.impactVelocityY += (awayY / distance) * force * delta;
      }

      const damping = Math.pow(0.1, delta);
      target.impactVelocityX *= damping;
      target.impactVelocityY *= damping;
      const shiftX = target.impactVelocityX * delta;
      target.x += shiftX;
      target.y += target.impactVelocityY * delta;
      // Preserve some lateral displacement so an interaction changes the
      // subsequent noise path instead of snapping back to the launch column.
      target.baseX = clamp(
        target.baseX + shiftX * 0.38,
        target.radius * 0.85,
        width - target.radius * 0.85,
      );
      target.x = clamp(target.x, target.radius * 0.72, width - target.radius * 0.72);
    };

    const applyBubbleCollisions = (delta: number) => {
      for (const target of bubbles) {
        target.collisionContactX = 0;
        target.collisionContactY = 0;
        target.collisionVertexForce = 0;
      }

      for (let firstIndex = 0; firstIndex < bubbles.length; firstIndex += 1) {
        const first = bubbles[firstIndex];
        for (let secondIndex = firstIndex + 1; secondIndex < bubbles.length; secondIndex += 1) {
          const second = bubbles[secondIndex];
          const collisionRadius = first.radius + second.radius;
          const dx = first.x - second.x;
          const dy = first.y - second.y;

          // Cheap broad phase before the single circular distance check.
          if (Math.abs(dx) >= collisionRadius || Math.abs(dy) >= collisionRadius) continue;

          let distance = Math.hypot(dx, dy);
          let normalX = dx / (distance || 1);
          let normalY = dy / (distance || 1);
          if (distance < 0.001) {
            const separationAngle = (first.seed - second.seed) * Math.PI * 2;
            normalX = Math.cos(separationAngle);
            normalY = Math.sin(separationAngle);
            distance = 0;
          }
          if (distance >= collisionRadius) continue;

          // The field is zero at the combined outer radii and increases
          // smoothly with overlap. Radius-squared acts as a cheap mass proxy,
          // so smaller bubbles yield more when differently sized ones collide.
          const overlap = collisionRadius - distance;
          const softness = smoothstep(0, collisionRadius * 0.42, overlap);
          const impulse = overlap * (12 + softness * 12) * delta;
          const firstMass = first.radius * first.radius;
          const secondMass = second.radius * second.radius;
          const totalMass = firstMass + secondMass;
          const firstShare = secondMass / totalMass;
          const secondShare = firstMass / totalMass;

          first.impactVelocityX += normalX * impulse * firstShare;
          first.impactVelocityY += normalY * impulse * firstShare;
          second.impactVelocityX -= normalX * impulse * secondShare;
          second.impactVelocityY -= normalY * impulse * secondShare;

          // Accumulate one coarse surface field per bubble. This reuses the
          // existing vertex pass and avoids any vertex-to-vertex comparisons.
          const firstSurfaceImpulse = impulse * firstShare;
          const secondSurfaceImpulse = impulse * secondShare;
          first.collisionContactX -= normalX * firstSurfaceImpulse;
          first.collisionContactY -= normalY * firstSurfaceImpulse;
          first.collisionVertexForce += firstSurfaceImpulse;
          second.collisionContactX += normalX * secondSurfaceImpulse;
          second.collisionContactY += normalY * secondSurfaceImpulse;
          second.collisionVertexForce += secondSurfaceImpulse;
        }
      }
    };

    const updateBubble = (target: Bubble, delta: number) => {
      target.age += delta;
      const wobble = reducedMotion ? 0 : 1;
      const driftTarget = layeredNoise(target.age * 0.42, target.seed) * target.radius * 0.16 * wobble;
      target.driftVelocity += (driftTarget - target.driftVelocity) * Math.min(1, delta * 2.4);
      target.x += target.driftVelocity * delta;
      target.x += (target.baseX - target.x) * Math.min(1, delta * 0.22);
      const launchProgress = clamp(target.age / 0.5, 0, 1);
      const launchEase = launchProgress * launchProgress * (3 - 2 * launchProgress);
      const verticalSpeed = target.launchSpeed + (target.riseSpeed - target.launchSpeed) * launchEase;
      target.y -= verticalSpeed * delta;
      target.y += layeredNoise(target.age * 0.8 + 30, target.seed) * target.radius * 0.035 * wobble * delta;

      applyMouseImpact(target, delta);
      const pointerDistance = Math.hypot(pointer.x - target.x, pointer.y - target.y);
      pullVertices(target, pointerDistance);
      target.body.step(false, 0, 0, layeredNoise(target.age * 0.65, target.seed + 21) * 1.4 * wobble);
      syncBodyGeometry(target);
      target.material.uniforms.uTime.value = target.age;

      const scale = target.radius / SOFT_RADIUS;
      target.mesh.position.set(target.x - width * 0.5, height * 0.5 - target.y, 0);
      target.mesh.scale.setScalar(scale);
      target.mesh.rotation.y = layeredNoise(target.age * 0.15, target.seed + 44) * 0.16 * wobble;
      target.mesh.rotation.z = layeredNoise(target.age * 0.22, target.seed + 72) * 0.035 * wobble;

      if (target.y + target.radius < -target.radius * 0.25) {
        removeBubble(target);
      }
    };

    const drawPixels = (delta: number) => {
      effects.clearRect(0, 0, width, height);
      const remaining: Pixel[] = [];
      for (const pixel of pixels) {
        pixel.age += delta;
        if (pixel.age >= pixel.life) continue;
        pixel.vx *= Math.pow(0.28, delta);
        pixel.vy = pixel.vy * Math.pow(0.64, delta) + 105 * delta;
        pixel.x += pixel.vx * delta;
        pixel.y += pixel.vy * delta;
        const progress = pixel.age / pixel.life;
        effects.globalAlpha = Math.pow(1 - progress, 1.55);
        effects.fillStyle = pixel.color;
        const size = Math.max(0.45, pixel.size * (1 - progress * 0.45));
        effects.fillRect(Math.round(pixel.x), Math.round(pixel.y), size, size);
        remaining.push(pixel);
      }
      effects.globalAlpha = 1;
      pixels = remaining;
    };

    const animate = (time: number) => {
      const delta = Math.min(0.033, Math.max(0.001, (time - previousTime) / 1000));
      previousTime = time;
      applyBubbleCollisions(delta);
      for (const activeBubble of [...bubbles]) updateBubble(activeBubble, delta);
      drawPixels(delta);
      renderer.render(scene, camera);
      fpsFrames += 1;
      if (time - fpsWindowStart >= 500) {
        const fps = fpsFrames * 1000 / (time - fpsWindowStart);
        const vertices = bubbles.reduce((total, target) => total + target.body.positions.length / 3, 0);
        const frameTime = 1000 / Math.max(fps, 0.001);
        fpsOutput.textContent = `${fps.toFixed(0)} fps · ${frameTime.toFixed(1)} ms · ${bubbles.length} blobs · ${availableVideoIndices.length} queued · ${vertices.toLocaleString()} vertices · ${renderer.info.render.calls} draws`;
        fpsFrames = 0;
        fpsWindowStart = time;
      }
      frame = requestAnimationFrame(animate);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(effectsCanvas);
    effectsCanvas.addEventListener('pointermove', onPointerMove, { passive: true });
    effectsCanvas.addEventListener('pointerenter', onPointerMove, { passive: true });
    effectsCanvas.addEventListener('pointerleave', onPointerLeave);
    effectsCanvas.addEventListener('pointerdown', onPointerDown);
    resize();
    const initialSpawnTimers = [0, 1, 2, 3].map((index) => window.setTimeout(
      () => spawn(width * (0.18 + index * 0.21)),
      180 + index * 220,
    ));
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      initialSpawnTimers.forEach((timer) => window.clearTimeout(timer));
      observer.disconnect();
      effectsCanvas.removeEventListener('pointermove', onPointerMove);
      effectsCanvas.removeEventListener('pointerenter', onPointerMove);
      effectsCanvas.removeEventListener('pointerleave', onPointerLeave);
      effectsCanvas.removeEventListener('pointerdown', onPointerDown);
      for (const target of bubbles) {
        target.previewVideo?.pause();
        target.albedoTexture?.dispose();
        target.material.dispose();
        target.geometry.dispose();
      }
      bubbles = [];
      whiteTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 z-[2]">
      <canvas ref={webglRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />
      <canvas
        ref={effectsRef}
        className="absolute inset-0 h-full w-full touch-none"
        aria-label="Click the field to release a video bubble; click a bubble to expand its video"
      />
      <output
        ref={fpsRef}
        className="pointer-events-none absolute bottom-5 left-5 rounded-full bg-white/55 px-2.5 py-1 font-mono text-[11px] text-[#0a103d]/70 backdrop-blur-sm"
      >
        0 fps · 0.0 ms · 0 blobs · 16 queued · 0 vertices · 0 draws
      </output>

      {expanded ? createPortal((
        <div
          className="bubble-fullscreen"
          style={{
            '--bubble-origin-x': `${expanded.originX}px`,
            '--bubble-origin-y': `${expanded.originY}px`,
            '--bubble-origin-radius': `${expanded.radius}px`,
          } as CSSProperties}
          onClick={closeExpanded}
        >
          <video
            ref={fullscreenVideoRef}
            key={FULL_VIDEOS[expanded.index]}
            src={FULL_VIDEOS[expanded.index]}
            className="bubble-fullscreen__video"
            autoPlay
            playsInline
            controls
            onClick={(event) => event.stopPropagation()}
          />
          <button
            type="button"
            className="bubble-fullscreen__close"
            onClick={closeExpanded}
            aria-label="Close video"
          >
            ×
          </button>
        </div>
      ), document.body) : null}

      <style jsx>{`
        .bubble-fullscreen {
          position: fixed;
          z-index: 90;
          inset: 0;
          display: grid;
          place-items: center;
          padding: clamp(0.75rem, 3vw, 2rem);
          background: rgb(8, 9, 14);
          clip-path: circle(var(--bubble-origin-radius) at var(--bubble-origin-x) var(--bubble-origin-y));
          animation: bubble-expand 720ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .bubble-fullscreen__video {
          width: 100%;
          height: 100%;
          object-fit: contain;
          opacity: 0;
          animation: video-reveal 480ms ease 180ms forwards;
        }

        .bubble-fullscreen__close {
          position: absolute;
          z-index: 2;
          top: 1.25rem;
          right: 1.25rem;
          display: grid;
          width: 2.25rem;
          height: 2.25rem;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          color: white;
          cursor: pointer;
          font: inherit;
          font-size: 1.35rem;
          line-height: 1;
          backdrop-filter: blur(10px);
        }

        @keyframes bubble-expand {
          to { clip-path: circle(150vmax at var(--bubble-origin-x) var(--bubble-origin-y)); }
        }

        @keyframes video-reveal {
          to { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .bubble-fullscreen,
          .bubble-fullscreen__video {
            animation-duration: 1ms;
            animation-delay: 0ms;
          }
        }
      `}</style>
    </div>
  );
}
