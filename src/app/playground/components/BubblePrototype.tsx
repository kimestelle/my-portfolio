'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import * as THREE from 'three';
import {
  BACKGROUND_FRAGMENT_SHADER,
  BACKGROUND_VERTEX_SHADER,
  BUBBLE_FRAGMENT_SHADER,
  BUBBLE_VERTEX_SHADER,
} from './bubbleMaterialShaders';
import { SoftBlob } from './SoftBlob';
import './BubblePrototype.css';

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
  hoverAmount: number;
  videoPlaying: boolean;
};

type ReleasedVideo = {
  id: number;
  src: string;
  currentTime: number;
  originX: number;
  originY: number;
  radius: number;
  ready: boolean;
};

const SOFT_CENTER_X = 116;
const SOFT_CENTER_Y = 100;
const SOFT_RADIUS = 66;
const BACKGROUND_GRAIN_TILE_SIZE = 100;
const POP_PALETTE = ['#ffffff', '#fff9f4', '#f6f3ff', '#eefaf7', '#f8f4ed'];
const BUBBLE_VIDEO_PREVIEWS = Array.from(
  { length: 16 },
  (_, index) => `/creative-images/video-demos/optimized/bubble/preview-${String(index + 1).padStart(2, '0')}.m4v`,
);
const FULL_RESOLUTION_VIDEOS = Array.from(
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
  const nextReleaseIdRef = useRef(0);
  const installBackgroundVideoTextureRef = useRef<(
    video: HTMLVideoElement,
    releasedVideo: ReleasedVideo,
  ) => void>(() => undefined);
  const previewVideosRef = useRef(new Set<HTMLVideoElement>());
  const [releasedVideos, setReleasedVideos] = useState<ReleasedVideo[]>([]);

  const markReleasedVideoReady = (releasedVideo: ReleasedVideo, video: HTMLVideoElement) => {
    if (video.dataset.releaseRevealScheduled) return;
    video.dataset.releaseRevealScheduled = 'true';
    const reveal = () => {
      installBackgroundVideoTextureRef.current(video, releasedVideo);
      setReleasedVideos((current) => current.map((item) => (
        item.id === releasedVideo.id ? { ...item, ready: true } : item
      )));
    };
    const frameVideo = video as HTMLVideoElement & {
      requestVideoFrameCallback?: (callback: () => void) => number;
    };
    if (frameVideo.requestVideoFrameCallback) {
      frameVideo.requestVideoFrameCallback(reveal);
    } else {
      window.requestAnimationFrame(reveal);
    }
  };

  const finishReleasedVideoTransition = (id: number) => {
    setReleasedVideos((current) => current.filter((item) => item.id >= id));
  };

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
    const tileTexture = new THREE.TextureLoader().load('/textures/3px-tile.png');
    tileTexture.wrapS = THREE.RepeatWrapping;
    tileTexture.wrapT = THREE.RepeatWrapping;
    tileTexture.minFilter = THREE.LinearFilter;
    tileTexture.magFilter = THREE.LinearFilter;
    tileTexture.generateMipmaps = false;
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
    let backgroundVideoTexture: THREE.VideoTexture | null = null;
    let activeBackgroundTexture: THREE.VideoTexture | null = null;
    let pendingBackgroundTexture: THREE.VideoTexture | null = null;
    let backgroundTransitionStart = 0;
    const inverseResolution = new THREE.Vector2(1, 1);
    const viewportSize = new THREE.Vector2(1, 1);
    const tileUvScale = new THREE.Vector2(0.01, 0.01);
    const backgroundUvTransform = new THREE.Vector4(1, 1, 0, 0);
    const activeBackgroundUvTransform = new THREE.Vector4(1, 1, 0, 0);
    const pendingBackgroundUvTransform = new THREE.Vector4(1, 1, 0, 0);
    const lightPosition = new THREE.Vector3(-180, 220, -120);
    const sphereDistance = 600;
    const backgroundPlaneZ = -1400;
    let focalLength = 1;
    const availableVideoIndices = BUBBLE_VIDEO_PREVIEWS.map((_, index) => index);

    const updateBackgroundUvTransform = (
      target: THREE.Vector4,
      video: HTMLVideoElement | null,
    ) => {
      if (!video?.videoWidth || !video.videoHeight) {
        target.set(1, 1, 0, 0);
        return;
      }
      const viewportAspect = width / height;
      const videoAspect = video.videoWidth / video.videoHeight;
      const scaleX = viewportAspect < videoAspect ? viewportAspect / videoAspect : 1;
      const scaleY = viewportAspect > videoAspect ? videoAspect / viewportAspect : 1;
      target.set(scaleX, scaleY, (1 - scaleX) * 0.5, (1 - scaleY) * 0.5);
    };

    const backgroundGeometry = new THREE.PlaneGeometry(1, 1);
    const backgroundMaterial = new THREE.ShaderMaterial({
      vertexShader: BACKGROUND_VERTEX_SHADER,
      fragmentShader: BACKGROUND_FRAGMENT_SHADER,
      uniforms: {
        uCurrentBackground: { value: whiteTexture },
        uNextBackground: { value: whiteTexture },
        uTile: { value: tileTexture },
        uHasCurrentBackground: { value: 0 },
        uHasNextBackground: { value: 0 },
        uCurrentBackgroundUvTransform: { value: activeBackgroundUvTransform },
        uNextBackgroundUvTransform: { value: pendingBackgroundUvTransform },
        uViewportSize: { value: viewportSize },
        uTileUvScale: { value: tileUvScale },
        uRevealOrigin: { value: new THREE.Vector2(0, 0) },
        uRevealRadius: { value: 1 },
        uRevealProgress: { value: 0 },
      },
      depthTest: false,
      depthWrite: false,
    });
    const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    backgroundMesh.position.z = -20;
    backgroundMesh.renderOrder = -100;
    scene.add(backgroundMesh);

    installBackgroundVideoTextureRef.current = (video, releasedVideo) => {
      if (backgroundVideoTexture?.image === video) return;
      const nextTexture = new THREE.VideoTexture(video);
      nextTexture.colorSpace = THREE.SRGBColorSpace;
      nextTexture.wrapS = THREE.ClampToEdgeWrapping;
      nextTexture.wrapT = THREE.ClampToEdgeWrapping;
      nextTexture.minFilter = THREE.LinearFilter;
      nextTexture.magFilter = THREE.LinearFilter;
      nextTexture.generateMipmaps = false;
      updateBackgroundUvTransform(backgroundUvTransform, video);
      updateBackgroundUvTransform(pendingBackgroundUvTransform, video);
      for (const target of bubbles) {
        target.material.uniforms.uBackground.value = nextTexture;
        target.material.uniforms.uHasBackground.value = 1;
      }
      if (pendingBackgroundTexture && pendingBackgroundTexture !== activeBackgroundTexture) {
        pendingBackgroundTexture.dispose();
      }
      pendingBackgroundTexture = nextTexture;
      backgroundVideoTexture = nextTexture;
      backgroundMaterial.uniforms.uNextBackground.value = nextTexture;
      backgroundMaterial.uniforms.uHasNextBackground.value = 1;
      backgroundMaterial.uniforms.uRevealOrigin.value.set(
        releasedVideo.originX * dpr,
        (height - releasedVideo.originY) * dpr,
      );
      backgroundMaterial.uniforms.uRevealRadius.value = releasedVideo.radius * dpr;
      backgroundMaterial.uniforms.uRevealProgress.value = 0;
      backgroundTransitionStart = performance.now();
    };

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
          uLightPosition: { value: lightPosition },
          uViewPosition: { value: new THREE.Vector3(0, 0, 0) },
          uWireframeMode: { value: 0 },
          uOpacity: { value: 0.0 },
          uTime: { value: 0 },
          uColorPhase: { value: Math.random() },
          uBackground: { value: backgroundVideoTexture ?? whiteTexture },
          uHasBackground: { value: backgroundVideoTexture ? 1 : 0 },
          uTile: { value: tileTexture },
          uTileUvScale: { value: tileUvScale },
          uInvResolution: { value: inverseResolution },
          uViewportSize: { value: viewportSize },
          uFocalLength: { value: focalLength },
          uSphereCenterView: { value: new THREE.Vector3(0, 0, -sphereDistance) },
          uSphereRadiusView: { value: 1 },
          uBackgroundPlaneZ: { value: backgroundPlaneZ },
          uBackgroundUvTransform: { value: backgroundUvTransform },
        },
        transparent: true,
        depthWrite: false,
        // syncBodyGeometry flips Y, so the camera-facing winding is the
        // geometry's back side. Cull the hidden half while keeping one pass.
        side: THREE.BackSide,
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
      video.load();
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
      lightPosition.set(-width * 0.58, height * 0.64, -120);
      inverseResolution.set(1 / (width * dpr), 1 / (height * dpr));
      viewportSize.set(width * dpr, height * dpr);
      tileUvScale.set(
        1 / (BACKGROUND_GRAIN_TILE_SIZE * dpr),
        1 / (BACKGROUND_GRAIN_TILE_SIZE * dpr),
      );
      focalLength = height * dpr / (2 * Math.tan(THREE.MathUtils.degToRad(42) * 0.5));
      updateBackgroundUvTransform(
        backgroundUvTransform,
        backgroundVideoTexture?.image as HTMLVideoElement | null,
      );
      updateBackgroundUvTransform(
        activeBackgroundUvTransform,
        activeBackgroundTexture?.image as HTMLVideoElement | null,
      );
      updateBackgroundUvTransform(
        pendingBackgroundUvTransform,
        pendingBackgroundTexture?.image as HTMLVideoElement | null,
      );
      backgroundMesh.scale.set(width, height, 1);
      for (const target of bubbles) {
        target.material.uniforms.uFocalLength.value = focalLength;
      }
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
        hoverAmount: 0,
        videoPlaying: false,
        ...createSurface(body),
      };
      bubbles.push(target);
      target.material.uniforms.uFocalLength.value = focalLength;
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
          color: POP_PALETTE[Math.floor(Math.random() * POP_PALETTE.length)],
        });
      }
      removeBubble(target);
    };

    const releaseVideo = (target: Bubble) => {
      nextReleaseIdRef.current += 1;
      const nextReleasedVideo: ReleasedVideo = {
        id: nextReleaseIdRef.current,
        src: FULL_RESOLUTION_VIDEOS[target.videoIndex],
        currentTime: target.previewVideo?.currentTime ?? 0,
        originX: target.x,
        originY: target.y,
        radius: target.radius,
        ready: false,
      };
      setReleasedVideos((current) => [...current, nextReleasedVideo]);
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
        releaseVideo(hit);
        pop(hit);
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

    const applyMouseImpact = (target: Bubble, delta: number, motionScale: number) => {
      if (pointer.present) {
        const awayX = target.x - pointer.x;
        const awayY = target.y - pointer.y;
        const distance = Math.hypot(awayX, awayY) || 1;
        const impactRadius = target.radius * 2.8;
        const proximity = clamp(1 - distance / impactRadius, 0, 1);
        const force = proximity * proximity * target.radius * 8.5 * motionScale;
        target.impactVelocityX += (awayX / distance) * force * delta;
        target.impactVelocityY += (awayY / distance) * force * delta;
      }

      const damping = Math.pow(0.1, delta);
      target.impactVelocityX *= damping;
      target.impactVelocityY *= damping;
      const shiftX = target.impactVelocityX * delta * motionScale;
      target.x += shiftX;
      target.y += target.impactVelocityY * delta * motionScale;
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
      const pointerDistance = Math.hypot(pointer.x - target.x, pointer.y - target.y);
      const hovered = pointer.present && pointerDistance <= target.radius;
      target.hoverAmount += ((hovered ? 1 : 0) - target.hoverAmount) * Math.min(1, delta * 4.5);
      const motionScale = 1 - target.hoverAmount;

      if (hovered && !target.videoPlaying) {
        target.videoPlaying = true;
        void target.previewVideo?.play().catch(() => {
          target.videoPlaying = false;
        });
      } else if (!hovered && target.videoPlaying) {
        target.videoPlaying = false;
        target.previewVideo?.pause();
      }

      const wobble = reducedMotion ? 0 : 1;
      const driftTarget = layeredNoise(target.age * 0.42, target.seed) * target.radius * 0.16 * wobble;
      target.driftVelocity += (driftTarget - target.driftVelocity) * Math.min(1, delta * 2.4);
      target.x += target.driftVelocity * delta * motionScale;
      target.x += (target.baseX - target.x) * Math.min(1, delta * 0.22) * motionScale;
      const launchProgress = clamp(target.age / 0.5, 0, 1);
      const launchEase = launchProgress * launchProgress * (3 - 2 * launchProgress);
      const verticalSpeed = target.launchSpeed + (target.riseSpeed - target.launchSpeed) * launchEase;
      target.y -= verticalSpeed * delta * motionScale;
      target.y += layeredNoise(target.age * 0.8 + 30, target.seed) * target.radius * 0.035 * wobble * delta * motionScale;

      applyMouseImpact(target, delta, motionScale);
      pullVertices(target, Math.hypot(pointer.x - target.x, pointer.y - target.y));
      target.body.step(false, 0, 0, layeredNoise(target.age * 0.65, target.seed + 21) * 1.4 * wobble);
      syncBodyGeometry(target);
      target.material.uniforms.uTime.value = target.age;
      const centerX = target.x * dpr;
      const centerY = (height - target.y) * dpr;
      const projectedRadius = target.radius * dpr;
      target.material.uniforms.uSphereCenterView.value.set(
        (centerX - viewportSize.x * 0.5) * sphereDistance / focalLength,
        (centerY - viewportSize.y * 0.5) * sphereDistance / focalLength,
        -sphereDistance,
      );
      target.material.uniforms.uSphereRadiusView.value = projectedRadius * sphereDistance
        / Math.sqrt(focalLength * focalLength + projectedRadius * projectedRadius);

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
      if (pendingBackgroundTexture && backgroundTransitionStart > 0) {
        const revealProgress = clamp((time - backgroundTransitionStart) / 1500, 0, 1);
        backgroundMaterial.uniforms.uRevealProgress.value = revealProgress;
        if (revealProgress >= 1) {
          if (activeBackgroundTexture && activeBackgroundTexture !== pendingBackgroundTexture) {
            activeBackgroundTexture.dispose();
          }
          activeBackgroundTexture = pendingBackgroundTexture;
          pendingBackgroundTexture = null;
          activeBackgroundUvTransform.copy(pendingBackgroundUvTransform);
          backgroundMaterial.uniforms.uCurrentBackground.value = activeBackgroundTexture;
          backgroundMaterial.uniforms.uHasCurrentBackground.value = 1;
          backgroundMaterial.uniforms.uHasNextBackground.value = 0;
          backgroundMaterial.uniforms.uRevealProgress.value = 0;
          backgroundTransitionStart = 0;
        }
      }
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
      280 + index * 560,
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
      installBackgroundVideoTextureRef.current = () => undefined;
      const backgroundTextures = new Set([
        backgroundVideoTexture,
        activeBackgroundTexture,
        pendingBackgroundTexture,
      ]);
      for (const texture of backgroundTextures) texture?.dispose();
      backgroundMaterial.dispose();
      backgroundGeometry.dispose();
      tileTexture.dispose();
      whiteTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 z-[2]">
      {releasedVideos.map((releasedVideo) => (
        <div
          key={releasedVideo.id}
          className={`released-video-layer${releasedVideo.ready ? ' is-ready' : ''}`}
          style={{
            '--release-x': `${releasedVideo.originX}px`,
            '--release-y': `${releasedVideo.originY}px`,
            '--release-radius': `${releasedVideo.radius}px`,
          } as CSSProperties}
          aria-hidden="true"
          onAnimationEnd={() => finishReleasedVideoTransition(releasedVideo.id)}
        >
          <video
            src={releasedVideo.src}
            className="released-video"
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            onLoadedMetadata={(event) => {
              const video = event.currentTarget;
              const latestTime = Math.max(0, video.duration - 0.05);
              const desiredTime = Math.min(releasedVideo.currentTime, latestTime);
              if (Math.abs(video.currentTime - desiredTime) > 0.01) {
                video.currentTime = desiredTime;
              } else {
                void video.play().catch(() => undefined);
              }
            }}
            onSeeked={(event) => {
              void event.currentTarget.play().catch(() => undefined);
            }}
            onPlaying={(event) => markReleasedVideoReady(releasedVideo, event.currentTarget)}
            onError={() => {
              setReleasedVideos((current) => current.filter((item) => item.id !== releasedVideo.id));
            }}
          />
        </div>
      ))}
      <canvas ref={webglRef} className="pointer-events-none absolute inset-0 z-[2] h-full w-full" aria-hidden="true" />
      <canvas
        ref={effectsRef}
        className="absolute inset-0 z-[3] h-full w-full cursor-crosshair touch-none"
        aria-label="Click the field to release a video bubble; hover a bubble to play it and click it to burst"
      />
      <output
        ref={fpsRef}
        className="pointer-events-none absolute top-2 right-2 md:top-5 md:right-5 z-[5] font-mono text-[7px] md:text-[10px] font-normal tracking-[-0.01em] text-white mix-blend-difference"
      >
        0 fps · 0.0 ms · 0 blobs · 0 verts · 0 draws
      </output>

    </div>
  );
}
