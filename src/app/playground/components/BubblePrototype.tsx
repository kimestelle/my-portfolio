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
  mediaIndex: number;
  hoverAmount: number;
  videoPlaying: boolean;
};

type ReleasedMedia = {
  id: number;
  type: 'video' | 'image';
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
// gl_FragCoord is expressed in device pixels; multiplying by DPR keeps one
// sandpaper texel at one visible CSS pixel on high-density displays.
const BACKGROUND_GRAIN_TILE_WIDTH = 348;
const BACKGROUND_GRAIN_TILE_HEIGHT = 500;
const MOUSE_VERTEX_DEFORMATION_FORCE = 1.5;
const DEFAULT_RADIUS_RANGE = [0.1, 0.17] as const;
const EMPTY_MEDIA_SOURCES: readonly string[] = [];
const RELEASE_LOAD_DELAY_MS = 80;
const BACKGROUND_REVEAL_DURATION_MS = 1900;
const POP_PALETTE = ['#ffffff', '#fff9f4', '#f6f3ff', '#eefaf7', '#f8f4ed'];
const BUBBLE_VIDEO_PREVIEWS = Array.from(
  { length: 16 },
  (_, index) => `/creative-images/video-demos/optimized/bubble/preview-${String(index + 1).padStart(2, '0')}.m4v`,
);
const FULL_RESOLUTION_VIDEOS = Array.from(
  { length: 16 },
  (_, index) => `/creative-images/video-demos/optimized/video-${String(index + 1).padStart(2, '0')}.m4v`,
);

type BubblePrototypeProps = {
  photoSources?: readonly string[];
  photoPreviewSources?: readonly string[];
  radiusRange?: readonly [minimum: number, maximum: number];
  initialBubbleCount?: number;
  maxBubbleCount?: number;
  randomizeMediaOrder?: boolean;
  initialBackgroundSource?: string;
  interactionLabel?: string;
};

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

export default function BubblePrototype({
  photoSources,
  photoPreviewSources,
  radiusRange = DEFAULT_RADIUS_RANGE,
  initialBubbleCount = 4,
  maxBubbleCount = Number.POSITIVE_INFINITY,
  randomizeMediaOrder = false,
  initialBackgroundSource,
  interactionLabel = 'Click the field to release a video bubble; hover a bubble to play it and click it to burst',
}: BubblePrototypeProps = {}) {
  const usesPhotos = Boolean(photoSources?.length);
  const fullResolutionPhotoSources = photoSources ?? EMPTY_MEDIA_SOURCES;
  const previewSources: readonly string[] = usesPhotos
    ? photoPreviewSources?.length
      ? photoPreviewSources
      : fullResolutionPhotoSources
    : BUBBLE_VIDEO_PREVIEWS;
  const releaseSources: readonly string[] = usesPhotos
    ? fullResolutionPhotoSources
    : FULL_RESOLUTION_VIDEOS;
  const webglRef = useRef<HTMLCanvasElement>(null);
  const effectsRef = useRef<HTMLCanvasElement>(null);
  const fpsRef = useRef<HTMLOutputElement>(null);
  const nextReleaseIdRef = useRef(0);
  const latestReleaseIdRef = useRef(0);
  const installBackgroundTextureRef = useRef<(
    media: HTMLVideoElement | HTMLImageElement,
    releasedMedia: ReleasedMedia,
  ) => void>(() => undefined);
  const previewVideosRef = useRef(new Set<HTMLVideoElement>());
  const [releasedMedia, setReleasedMedia] = useState<ReleasedMedia[]>([]);

  const revealReleasedMedia = (
    released: ReleasedMedia,
    media: HTMLVideoElement | HTMLImageElement,
  ) => {
    if (released.id !== latestReleaseIdRef.current) {
      setReleasedMedia((current) => current.filter((item) => item.id !== released.id));
      return;
    }
    installBackgroundTextureRef.current(media, released);
    setReleasedMedia((current) => current.map((item) => (
      item.id === released.id ? { ...item, ready: true } : item
    )));
  };

  const markReleasedVideoReady = (released: ReleasedMedia, video: HTMLVideoElement) => {
    if (video.dataset.releaseRevealScheduled) return;
    video.dataset.releaseRevealScheduled = 'true';
    const reveal = () => {
      revealReleasedMedia(released, video);
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

  const markReleasedImageReady = (released: ReleasedMedia, image: HTMLImageElement) => {
    if (image.dataset.releaseRevealScheduled) return;
    image.dataset.releaseRevealScheduled = 'true';
    window.requestAnimationFrame(() => revealReleasedMedia(released, image));
  };

  const finishReleasedMediaTransition = (id: number) => {
    setReleasedMedia((current) => current.filter((item) => item.id >= id));
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
    const tileTexture = new THREE.TextureLoader().load('/textures/sandpaper.png');
    tileTexture.colorSpace = THREE.SRGBColorSpace;
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
    let backgroundTexture: THREE.Texture | null = null;
    let activeBackgroundTexture: THREE.Texture | null = null;
    let pendingBackgroundTexture: THREE.Texture | null = null;
    let queuedBackground: {
      texture: THREE.Texture;
      media: HTMLVideoElement | HTMLImageElement;
      released: ReleasedMedia;
    } | null = null;
    let backgroundTransitionStart = 0;
    let bubbleBackgroundSwitched = false;
    let disposed = false;
    const releaseTimers = new Set<number>();
    const inverseResolution = new THREE.Vector2(1, 1);
    const viewportSize = new THREE.Vector2(1, 1);
    const tileUvScale = new THREE.Vector2(0.1, 0.1);
    const backgroundUvTransform = new THREE.Vector4(1, 1, 0, 0);
    const activeBackgroundUvTransform = new THREE.Vector4(1, 1, 0, 0);
    const pendingBackgroundUvTransform = new THREE.Vector4(1, 1, 0, 0);
    const lightPosition = new THREE.Vector3(-180, 220, -120);
    const sphereDistance = 600;
    const backgroundPlaneZ = -1400;
    let focalLength = 1;
    const availableMediaIndices = previewSources.map((_, index) => index);
    if (randomizeMediaOrder) {
      for (let index = availableMediaIndices.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [availableMediaIndices[index], availableMediaIndices[swapIndex]] = [
          availableMediaIndices[swapIndex],
          availableMediaIndices[index],
        ];
      }
    }

    const updateBackgroundUvTransform = (
      target: THREE.Vector4,
      media: HTMLVideoElement | HTMLImageElement | null,
    ) => {
      const mediaWidth = media instanceof HTMLVideoElement ? media.videoWidth : media?.naturalWidth;
      const mediaHeight = media instanceof HTMLVideoElement ? media.videoHeight : media?.naturalHeight;
      if (!mediaWidth || !mediaHeight) {
        target.set(1, 1, 0, 0);
        return;
      }
      const viewportAspect = width / height;
      const mediaAspect = mediaWidth / mediaHeight;
      const scaleX = viewportAspect < mediaAspect ? viewportAspect / mediaAspect : 1;
      const scaleY = viewportAspect > mediaAspect ? mediaAspect / viewportAspect : 1;
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

    const initialBackgroundTexture = initialBackgroundSource
      ? new THREE.TextureLoader().load(initialBackgroundSource, (texture) => {
        if (disposed || activeBackgroundTexture || pendingBackgroundTexture) {
          texture.dispose();
          return;
        }
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        activeBackgroundTexture = texture;
        backgroundTexture = texture;
        updateBackgroundUvTransform(
          activeBackgroundUvTransform,
          texture.image as HTMLImageElement,
        );
        backgroundUvTransform.copy(activeBackgroundUvTransform);
        backgroundMaterial.uniforms.uCurrentBackground.value = texture;
        backgroundMaterial.uniforms.uHasCurrentBackground.value = 1;
        for (const target of bubbles) {
          target.material.uniforms.uBackground.value = texture;
          target.material.uniforms.uHasBackground.value = 1;
          target.material.uniforms.uBackgroundStrength.value = 1;
        }
      })
      : null;
    if (initialBackgroundTexture) {
      initialBackgroundTexture.colorSpace = THREE.SRGBColorSpace;
      initialBackgroundTexture.wrapS = THREE.ClampToEdgeWrapping;
      initialBackgroundTexture.wrapT = THREE.ClampToEdgeWrapping;
      initialBackgroundTexture.minFilter = THREE.LinearFilter;
      initialBackgroundTexture.magFilter = THREE.LinearFilter;
      initialBackgroundTexture.generateMipmaps = false;
    }

    const beginBackgroundTransition = (
      nextTexture: THREE.Texture,
      media: HTMLVideoElement | HTMLImageElement,
      released: ReleasedMedia,
      startedAt = performance.now(),
    ) => {
      updateBackgroundUvTransform(pendingBackgroundUvTransform, media);
      pendingBackgroundTexture = nextTexture;
      backgroundTexture = nextTexture;
      backgroundMaterial.uniforms.uNextBackground.value = nextTexture;
      backgroundMaterial.uniforms.uHasNextBackground.value = 1;
      backgroundMaterial.uniforms.uRevealOrigin.value.set(
        released.originX * dpr,
        (height - released.originY) * dpr,
      );
      backgroundMaterial.uniforms.uRevealRadius.value = released.radius * dpr;
      backgroundMaterial.uniforms.uRevealProgress.value = 0;
      bubbleBackgroundSwitched = false;
      backgroundTransitionStart = startedAt;
    };

    installBackgroundTextureRef.current = (media, released) => {
      if (released.id !== latestReleaseIdRef.current) return;
      if (backgroundTexture?.image === media || queuedBackground?.texture.image === media) return;
      const nextTexture = media instanceof HTMLVideoElement
        ? new THREE.VideoTexture(media)
        : new THREE.Texture(media);
      nextTexture.colorSpace = THREE.SRGBColorSpace;
      nextTexture.wrapS = THREE.ClampToEdgeWrapping;
      nextTexture.wrapT = THREE.ClampToEdgeWrapping;
      nextTexture.minFilter = THREE.LinearFilter;
      nextTexture.magFilter = THREE.LinearFilter;
      nextTexture.generateMipmaps = false;
      nextTexture.needsUpdate = true;

      if (pendingBackgroundTexture && backgroundTransitionStart > 0) {
        queuedBackground?.texture.dispose();
        queuedBackground = { texture: nextTexture, media, released };
        return;
      }

      beginBackgroundTransition(nextTexture, media, released);
    };

    const createSurface = (body: SoftBlob) => {
      const reflectedBackgroundTexture = pendingBackgroundTexture && bubbleBackgroundSwitched
        ? pendingBackgroundTexture
        : activeBackgroundTexture;
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
          uBackground: { value: reflectedBackgroundTexture ?? whiteTexture },
          uHasBackground: { value: reflectedBackgroundTexture ? 1 : 0 },
          uBackgroundStrength: { value: 1 },
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
      if (!availableMediaIndices.includes(target.mediaIndex)) {
        availableMediaIndices.push(target.mediaIndex);
      }
    };

    const attachAlbedo = (target: Bubble) => {
      if (usesPhotos) {
        const texture = new THREE.TextureLoader().load(previewSources[target.mediaIndex]);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        target.albedoTexture = texture;
        target.material.uniforms.uAlbedo.value = texture;
        return;
      }
      const video = document.createElement('video');
      video.src = previewSources[target.mediaIndex];
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
        1 / (BACKGROUND_GRAIN_TILE_WIDTH * dpr),
        1 / (BACKGROUND_GRAIN_TILE_HEIGHT * dpr),
      );
      focalLength = height * dpr / (2 * Math.tan(THREE.MathUtils.degToRad(42) * 0.5));
      updateBackgroundUvTransform(
        backgroundUvTransform,
        (
          pendingBackgroundTexture && bubbleBackgroundSwitched
            ? pendingBackgroundTexture
            : activeBackgroundTexture
        )?.image as HTMLVideoElement | HTMLImageElement | null,
      );
      updateBackgroundUvTransform(
        activeBackgroundUvTransform,
        activeBackgroundTexture?.image as HTMLVideoElement | HTMLImageElement | null,
      );
      updateBackgroundUvTransform(
        pendingBackgroundUvTransform,
        pendingBackgroundTexture?.image as HTMLVideoElement | HTMLImageElement | null,
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
      if (bubbles.length >= maxBubbleCount) return;
      const mediaIndex = availableMediaIndices.shift();
      if (mediaIndex === undefined) return;
      const compactScale = width < 640 ? 0.82 : width < 900 ? 0.92 : 1;
      const widthRadiusCap = width < 640 ? 0.38 : 0.44;
      const radius = Math.min(
        height
          * (radiusRange[0] + Math.random() * (radiusRange[1] - radiusRange[0]))
          * compactScale,
        width * widthRadiusCap,
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
        mediaIndex,
        previewVideo: null,
        hoverAmount: 0,
        videoPlaying: false,
        ...createSurface(body),
      };
      bubbles.push(target);
      target.material.uniforms.uFocalLength.value = focalLength;
      syncBodyGeometry(target);
      attachAlbedo(target);
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
          size: 0.4 + Math.random() * 1.25,
          age: 0,
          life: 0.42 + Math.random() * 0.62,
          color: POP_PALETTE[Math.floor(Math.random() * POP_PALETTE.length)],
        });
      }
      removeBubble(target);
    };

    const releaseMedia = (target: Bubble) => {
      nextReleaseIdRef.current += 1;
      const nextReleasedMedia: ReleasedMedia = {
        id: nextReleaseIdRef.current,
        type: usesPhotos ? 'image' : 'video',
        src: releaseSources[target.mediaIndex],
        currentTime: target.previewVideo?.currentTime ?? 0,
        originX: target.x,
        originY: target.y,
        radius: target.radius,
        ready: false,
      };
      latestReleaseIdRef.current = nextReleasedMedia.id;
      for (const pendingTimer of releaseTimers) window.clearTimeout(pendingTimer);
      releaseTimers.clear();
      if (queuedBackground) {
        queuedBackground.texture.dispose();
        queuedBackground = null;
      }
      const timer = window.setTimeout(() => {
        releaseTimers.delete(timer);
        setReleasedMedia([nextReleasedMedia]);
      }, RELEASE_LOAD_DELAY_MS);
      releaseTimers.add(timer);
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
        pop(hit);
        releaseMedia(hit);
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
        // Preserve the strong silhouette pull while giving the interior a
        // broad, softer response instead of leaving it visually pinned.
        const surfaceWeight = 0.5 + smoothstep(0.68, 0.96, restRadialDistance) * 0.5;
        const directionalMouseFacing = Math.max(0, (
          radialX * pointerDirectionX + radialY * pointerDirectionY
        ) / (radialLength * pointerLength));
        const interiorReach = (1 - smoothstep(0.28, 0.82, restRadialDistance)) * 0.72;
        const mouseFacing = Math.max(directionalMouseFacing, interiorReach);
        const mouseInfluence = mouseProximity
          * Math.pow(mouseFacing, 2)
          * localNearness
          * surfaceWeight
          * MOUSE_VERTEX_DEFORMATION_FORCE;
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
      const insideDepth = pointer.present
        ? clamp((target.radius - pointerDistance) / (target.radius * 0.75), 0, 1)
        : 0;
      const dampingProximity = smoothstep(0, 1, insideDepth);
      target.hoverAmount += (dampingProximity - target.hoverAmount) * Math.min(1, delta * 3.6);
      // The rim remains freely moving; damping grows only as the pointer moves
      // into the bubble, while retaining a little drift at maximum depth.
      const motionScale = 1 - target.hoverAmount * 0.88;

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
        const size = Math.max(0.3, pixel.size * (1 - progress * 0.45));
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
        const revealProgress = clamp(
          (time - backgroundTransitionStart) / BACKGROUND_REVEAL_DURATION_MS,
          0,
          1,
        );
        backgroundMaterial.uniforms.uRevealProgress.value = revealProgress;
        const reflectionStrength = revealProgress < 0.5
          ? 1 - smoothstep(0.08, 0.48, revealProgress)
          : smoothstep(0.52, 0.92, revealProgress);
        if (!bubbleBackgroundSwitched && revealProgress >= 0.5) {
          bubbleBackgroundSwitched = true;
          backgroundUvTransform.copy(pendingBackgroundUvTransform);
          for (const target of bubbles) {
            target.material.uniforms.uBackground.value = pendingBackgroundTexture;
            target.material.uniforms.uHasBackground.value = 1;
          }
        }
        for (const target of bubbles) {
          target.material.uniforms.uBackgroundStrength.value = reflectionStrength;
        }
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
          bubbleBackgroundSwitched = true;
          for (const target of bubbles) {
            target.material.uniforms.uBackground.value = activeBackgroundTexture;
            target.material.uniforms.uHasBackground.value = 1;
            target.material.uniforms.uBackgroundStrength.value = 1;
          }

          const nextBackground = queuedBackground;
          queuedBackground = null;
          if (nextBackground) {
            if (nextBackground.released.id === latestReleaseIdRef.current) {
              beginBackgroundTransition(
                nextBackground.texture,
                nextBackground.media,
                nextBackground.released,
                time,
              );
            } else {
              nextBackground.texture.dispose();
            }
          }
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
        fpsOutput.textContent = `${fps.toFixed(0)} fps · ${frameTime.toFixed(1)} ms · ${bubbles.length} blobs · ${availableMediaIndices.length} queued · ${vertices.toLocaleString()} vertices · ${renderer.info.render.calls} draws`;
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
    const spawnCount = Math.min(initialBubbleCount, previewSources.length, maxBubbleCount);
    const initialSpawnTimers = Array.from({ length: spawnCount }, (_, index) => window.setTimeout(
      () => spawn(width * (spawnCount === 1 ? 0.5 : 0.18 + index * (0.64 / (spawnCount - 1)))),
      280 + index * 560,
    ));
    frame = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      initialSpawnTimers.forEach((timer) => window.clearTimeout(timer));
      for (const timer of releaseTimers) window.clearTimeout(timer);
      releaseTimers.clear();
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
      installBackgroundTextureRef.current = () => undefined;
      const backgroundTextures = new Set([
        backgroundTexture,
        activeBackgroundTexture,
        pendingBackgroundTexture,
        queuedBackground?.texture,
        initialBackgroundTexture,
      ]);
      for (const texture of backgroundTextures) texture?.dispose();
      backgroundMaterial.dispose();
      backgroundGeometry.dispose();
      tileTexture.dispose();
      whiteTexture.dispose();
      renderer.dispose();
    };
  }, [
    initialBubbleCount,
    initialBackgroundSource,
    maxBubbleCount,
    previewSources,
    radiusRange,
    randomizeMediaOrder,
    releaseSources,
    usesPhotos,
  ]);

  return (
    <div className="absolute inset-0 z-[2]">
      {releasedMedia.map((released) => (
        <div
          key={released.id}
          className={`released-video-layer${released.ready ? ' is-ready' : ''}`}
          style={{
            '--release-x': `${released.originX}px`,
            '--release-y': `${released.originY}px`,
            '--release-radius': `${released.radius}px`,
          } as CSSProperties}
          aria-hidden="true"
          onAnimationEnd={() => finishReleasedMediaTransition(released.id)}
        >
          {released.type === 'video' ? (
            <video
              src={released.src}
              className="released-video"
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              onLoadedMetadata={(event) => {
                const video = event.currentTarget;
                const latestTime = Math.max(0, video.duration - 0.05);
                const desiredTime = Math.min(released.currentTime, latestTime);
                if (Math.abs(video.currentTime - desiredTime) > 0.01) {
                  video.currentTime = desiredTime;
                } else {
                  void video.play().catch(() => undefined);
                }
              }}
              onSeeked={(event) => {
                void event.currentTarget.play().catch(() => undefined);
              }}
              onPlaying={(event) => markReleasedVideoReady(released, event.currentTarget)}
              onError={() => {
                setReleasedMedia((current) => current.filter((item) => item.id !== released.id));
              }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={released.src}
              className="released-video"
              alt=""
              onLoad={(event) => markReleasedImageReady(released, event.currentTarget)}
              onError={() => {
                setReleasedMedia((current) => current.filter((item) => item.id !== released.id));
              }}
            />
          )}
        </div>
      ))}
      <canvas ref={webglRef} className="pointer-events-none absolute inset-0 z-[2] h-full w-full" aria-hidden="true" />
      <canvas
        ref={effectsRef}
        className="absolute inset-0 z-[3] h-full w-full cursor-crosshair touch-none"
        aria-label={interactionLabel}
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
