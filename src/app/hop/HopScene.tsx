'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import HopChrome from './HopChrome';
import { createHopCursor } from './hopCursor';
import {
  composeHopPhoto,
  HOP_PHOTO_ASPECT,
  HOP_PHOTO_RENDER_HEIGHT,
  HOP_PHOTO_RENDER_WIDTH,
} from './hopPhoto';
import {
  framePhotoCamera,
  getPhotoSubjectBounds,
} from './hopPhotoCamera';
import {
  HOP_CONTENT,
  type IntroPhase,
  type PerformanceStats,
  type PhotoFeedback,
  type SceneSize,
} from './hopContent';
import styles from './hop.module.css';

type BoneRestPose = {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  scale: THREE.Vector3;
};

const FIXED_STEP = 1 / 120;
const GRAVITY = 14.5;
const HOP_DISTANCE_IN_HEIGHTS = 0.32;
const HOP_APEX_IN_HEIGHTS = 0.13;
const HOP_PREP_TIME = 0.075;
const HOP_LANDING_COOLDOWN = 0.04;
const CARRY_LANDING_DURATION = 0.22;
const CARRY_CLEARANCE_IN_HEIGHTS = 0.2;
const WANDER_RADIUS_IN_HEIGHTS = 1.35;
const ARRIVAL_EPSILON = 0.08;
const SPRING_VERTICAL_STIFFNESS = 178;
const SPRING_VERTICAL_DAMPING = 3.55;
const SPRING_LATERAL_STIFFNESS = 58;
const SPRING_LATERAL_DAMPING = 1.85;
const TOUCH_HOLD_DELAY = 220;
const TOUCH_DRAG_THRESHOLD = 9;
const AFFECTION_HOLD_DELAY = 2.3;
const AFFECTION_RUB_DELAY = 1.35;
const AFFECTION_RUB_DISTANCE = 145;
const AFFECTION_PARTICLE_COUNT = 18;
const AFFECTION_PARTICLE_MAX_ALPHA = 0.62;
const DIZZY_SWING_ENERGY_THRESHOLD = 1.05;
const DIZZY_CHARGE_THRESHOLD = 0.78;
const CARRY_BODY_DRAG = 0.72;
const CARRY_CHAIN_LENGTH_RATIO = 1.015;
const CARRY_POINTER_GAIN = 0.74;
const CARRY_ANCHOR_STIFFNESS = 64;
const CARRY_ANCHOR_DAMPING = 8.8;
const CARRY_ANCHOR_MAX_SPEED_IN_HEIGHTS = 3.4;
const CARRY_POSE_STIFFNESS = 110;
const CARRY_POSE_DAMPING = 8.2;
const CARRY_FEET_SWING_LIMIT = THREE.MathUtils.degToRad(24);
const CARRY_FEET_SWING_STIFFNESS = 52;
const CARRY_FEET_SWING_DAMPING = 5.4;
const PALETTE_CHROME_INNER_RADIUS = 0.055;
const PALETTE_CHROME_OUTER_RADIUS = 0.23;
const PALETTE_CHROME_EDGE_START = 0.78;
const PALETTE_CHROME_EDGE_END = 0.96;
const COLOR_MODE_ZOOM = 0.16;
const COLOR_MODE_ENTRY_DURATION = 0.58;
const PALETTE_BOUNDARY = 0.9;
const BOUNDARY_SOFT_START = 0.84;
const SCENE_ZOOM: Record<SceneSize, number> = {
  small: 0.56,
  medium: 0.78,
  large: 1,
};
const INTRO_EXIT_DURATION_MS = 700;
const INTRO_DROP_DELAY_MS = 520;
const INTRO_CHROME_DELAY_MS = 140;

const clamp = (value: number, min: number, max: number) => (
  Math.min(max, Math.max(min, value))
);

function dampAngle(current: number, target: number, lambda: number, dt: number) {
  const delta = Math.atan2(Math.sin(target - current), Math.cos(target - current));
  return current + delta * (1 - Math.exp(-lambda * dt));
}

function disposeObject(root: THREE.Object3D) {
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.geometry.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material) => material.dispose());
  });
}

export default function HopScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneSizeRef = useRef<SceneSize>('small');
  const colorModeRef = useRef(false);
  const applySceneSizeRef = useRef<(() => void) | null>(null);
  const captureSceneRef = useRef<(() => void) | null>(null);
  const dropOnEnterRef = useRef<(() => void) | null>(null);
  const introStartedRef = useRef(false);
  const debugVisibleRef = useRef(false);
  const setColorModeRuntimeRef = useRef<((active: boolean) => void) | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>(HOP_CONTENT.status.loading);
  const [introDelayElapsed, setIntroDelayElapsed] = useState(false);
  const [introPhase, setIntroPhase] = useState<IntroPhase>('holding');
  const [chromeVisible, setChromeVisible] = useState(false);
  const [sceneSize, setSceneSize] = useState<SceneSize>('small');
  const [colorMode, setColorMode] = useState(false);
  const [photoFeedback, setPhotoFeedback] = useState<PhotoFeedback>('idle');
  const [debugVisible, setDebugVisible] = useState(false);
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats>({
    fps: 0,
    frameMs: 0,
    drawCalls: 0,
    triangles: 0,
  });

  useEffect(() => {
    const enabled = new URLSearchParams(window.location.search).has('debug');
    debugVisibleRef.current = enabled;
    setDebugVisible(enabled);
  }, []);

  useEffect(() => {
    const introTimer = window.setTimeout(() => setIntroDelayElapsed(true), 1500);
    return () => window.clearTimeout(introTimer);
  }, []);

  const introReady = !loading && introDelayElapsed;

  useEffect(() => {
    if (!introReady || introStartedRef.current) return;
    introStartedRef.current = true;
    setIntroPhase('launching');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dropTimer = window.setTimeout(
      () => dropOnEnterRef.current?.(),
      reduceMotion ? 20 : INTRO_DROP_DELAY_MS,
    );
    const finishTimer = window.setTimeout(
      () => setIntroPhase('finished'),
      reduceMotion ? 30 : INTRO_EXIT_DURATION_MS,
    );
    const reducedChromeTimer = reduceMotion
      ? window.setTimeout(() => setChromeVisible(true), 40)
      : 0;

    return () => {
      window.clearTimeout(dropTimer);
      window.clearTimeout(finishTimer);
      window.clearTimeout(reducedChromeTimer);
    };
  }, [introReady]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let animationFrame = 0;
    let lastTime = performance.now();
    let accumulator = 0;
    let statusValue: string = HOP_CONTENT.status.loading;
    let captureInProgress = false;
    let photoFeedbackTimer = 0;
    let entranceChromeTimer = 0;
    let cameraZoomTarget = 1;
    let performanceWindowStart = performance.now();
    let performanceFrameCount = 0;

    const setSceneStatus = (next: string) => {
      if (next === statusValue || disposed) return;
      statusValue = next;
      setStatus(next);
    };

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xffffff, 10, 23);

    const camera = new THREE.PerspectiveCamera(36, 1, 0.05, 50);
    camera.position.set(0, 3.8, 7.2);
    const cameraPositionTarget = camera.position.clone();
    const cameraLookTarget = new THREE.Vector3(0, 0.78, -0.3);
    const cameraLookGoal = cameraLookTarget.clone();
    camera.lookAt(cameraLookTarget);
    const photoCamera = new THREE.PerspectiveCamera(
      36,
      HOP_PHOTO_ASPECT,
      0.01,
      100,
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = false;
    renderer.setClearColor(0xffffff, 1);
    renderer.domElement.className = styles.canvas;
    renderer.domElement.setAttribute('aria-label', HOP_CONTENT.canvasLabel);
    renderer.domElement.tabIndex = 0;
    mount.appendChild(renderer.domElement);

    const hopCursor = createHopCursor({
      canvas: renderer.domElement,
      isColorMode: () => colorModeRef.current,
      mount,
    });
    const setCursorMode = hopCursor.setMode;
    const updateCustomCursor = hopCursor.update;

    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnvironment = new RoomEnvironment();
    const environment = pmrem.fromScene(roomEnvironment, 0.04).texture;
    scene.environment = environment;
    roomEnvironment.dispose();

    const hemi = new THREE.HemisphereLight(0xffffff, 0xe7e7e7, 1.55);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(-4.5, 7.5, 5.5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.45);
    rimLight.position.set(4, 5, -3);
    scene.add(rimLight);

    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.92,
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), floorMaterial);
    floor.name = 'hop-floor';
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const boundarySegments = 96;
    const boundaryPositions = new Float32Array(boundarySegments * 3);
    for (let index = 0; index < boundarySegments; index += 1) {
      const angle = index / boundarySegments * Math.PI * 2;
      boundaryPositions[index * 3] = Math.cos(angle);
      boundaryPositions[index * 3 + 1] = 0;
      boundaryPositions[index * 3 + 2] = Math.sin(angle);
    }
    const movementBoundaryGeometry = new THREE.BufferGeometry();
    movementBoundaryGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(boundaryPositions, 3),
    );
    const movementBoundaryMaterial = new THREE.LineBasicMaterial({
      color: 0x161616,
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
      toneMapped: false,
    });
    const movementBoundary = new THREE.LineLoop(
      movementBoundaryGeometry,
      movementBoundaryMaterial,
    );
    movementBoundary.name = 'hoptimist-movement-boundary';
    movementBoundary.position.y = 0.014;
    movementBoundary.renderOrder = 2;
    movementBoundary.visible = false;
    scene.add(movementBoundary);

    const colorPoolMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uBloom: { value: 0 },
        uHueOffset: { value: 0 },
        uRadialExponent: { value: 1 },
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uBloom;
        uniform float uHueOffset;
        uniform float uRadialExponent;
        varying vec2 vUv;

        vec3 hsvToRgb(vec3 color) {
          vec3 channels = clamp(
            abs(mod(color.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0,
            0.0,
            1.0
          );
          channels = channels * channels * (3.0 - 2.0 * channels);
          return color.z * mix(vec3(1.0), channels, color.y);
        }

        void main() {
          vec2 poolPoint = (vUv - 0.5) * 2.0;
          float poolRadius = length(poolPoint);
          float radius = pow(clamp(poolRadius, 0.0, 1.0), uRadialExponent);
          float hue = fract(
            atan(poolPoint.y, poolPoint.x) / 6.2831853 + 1.0 + uHueOffset
          );
          float saturation = smoothstep(
            ${PALETTE_CHROME_INNER_RADIUS.toFixed(3)},
            0.30,
            radius
          );
          vec3 spectrum = hsvToRgb(vec3(hue, saturation, 0.98));
          float pool = 1.0 - smoothstep(0.72, 1.0, poolRadius);
          float centerChrome = 1.0 - smoothstep(
            ${PALETTE_CHROME_INNER_RADIUS.toFixed(3)},
            ${PALETTE_CHROME_OUTER_RADIUS.toFixed(3)},
            poolRadius
          );
          float edgeChrome = smoothstep(
            ${PALETTE_CHROME_EDGE_START.toFixed(3)},
            ${PALETTE_CHROME_EDGE_END.toFixed(3)},
            poolRadius
          );
          float chromeAmount = max(centerChrome, edgeChrome);
          float chromeSheen = smoothstep(
            -0.65,
            0.75,
            poolPoint.x * 0.55 - poolPoint.y * 0.85
          );
          vec3 chrome = mix(
            vec3(0.40, 0.43, 0.49),
            vec3(0.90, 0.93, 0.98),
            0.18 + chromeSheen * 0.62
          );
          spectrum = mix(spectrum, chrome, chromeAmount);
          float alpha = pool * uBloom * 0.92;

          if (alpha < 0.002) discard;
          gl_FragColor = vec4(spectrum, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    });
    const colorPool = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      colorPoolMaterial,
    );
    colorPool.name = 'chromatic-color-pool';
    colorPool.rotation.x = -Math.PI / 2;
    colorPool.position.y = 0.004;
    colorPool.renderOrder = 0;
    colorPool.visible = false;
    scene.add(colorPool);

    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 64;
    shadowCanvas.height = 64;
    const shadowContext = shadowCanvas.getContext('2d');
    if (!shadowContext) throw new Error('Could not create the blob shadow texture');
    const shadowGradient = shadowContext.createRadialGradient(32, 32, 2, 32, 32, 32);
    shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.72)');
    shadowGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
    shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    shadowContext.fillStyle = shadowGradient;
    shadowContext.fillRect(0, 0, 64, 64);

    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    shadowTexture.colorSpace = THREE.SRGBColorSpace;
    const blobShadowMaterial = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      toneMapped: false,
    });
    const blobShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      blobShadowMaterial,
    );
    blobShadow.name = 'cheap-blob-shadow';
    blobShadow.rotation.x = -Math.PI / 2;
    blobShadow.position.y = 0.008;
    blobShadow.renderOrder = 1;
    blobShadow.visible = false;
    scene.add(blobShadow);

    const characterRoot = new THREE.Group();
    characterRoot.name = 'hoptimist-runtime-root';
    characterRoot.visible = false;
    scene.add(characterRoot);

    const frostCanvas = document.createElement('canvas');
    frostCanvas.width = 64;
    frostCanvas.height = 64;
    const frostContext = frostCanvas.getContext('2d');
    if (!frostContext) throw new Error('Could not create the frosted texture');
    const frostPixels = frostContext.createImageData(64, 64);
    let frostSeed = 2719;
    for (let index = 0; index < frostPixels.data.length; index += 4) {
      frostSeed = (frostSeed * 16807) % 2147483647;
      const grain = 184 + (frostSeed % 72);
      frostPixels.data[index] = grain;
      frostPixels.data[index + 1] = grain;
      frostPixels.data[index + 2] = grain;
      frostPixels.data[index + 3] = 255;
    }
    frostContext.putImageData(frostPixels, 0, 0);
    const frostTexture = new THREE.CanvasTexture(frostCanvas);
    frostTexture.wrapS = THREE.RepeatWrapping;
    frostTexture.wrapT = THREE.RepeatWrapping;
    frostTexture.repeat.set(12, 12);
    frostTexture.colorSpace = THREE.NoColorSpace;

    const metallicMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xb90a24,
      metalness: 0.48,
      roughness: 0.29,
      transmission: 0,
      thickness: 0,
      attenuationColor: 0xc8001c,
      attenuationDistance: 0.38,
      ior: 1.46,
      specularIntensity: 0.86,
      specularColor: 0xffffff,
      clearcoat: 0.2,
      clearcoatRoughness: 0.18,
      envMapIntensity: 1.5,
      roughnessMap: frostTexture,
      bumpMap: frostTexture,
      bumpScale: 0.022,
    });
    const frostedColor = new THREE.Color(0xb90a24);
    const materialColor = new THREE.Color(0xb90a24);
    const materialColorHsl = { h: 0, s: 0, l: 0 };
    const chromeColor = new THREE.Color(0xb6bbc4);
    const initialColorHsl = { h: 0, s: 0, l: 0 };
    frostedColor.getHSL(initialColorHsl, THREE.SRGBColorSpace);
    const initialPaletteAngle = initialColorHsl.h * Math.PI * 2;
    const selectedPalettePoint = new THREE.Vector2(
      Math.cos(initialPaletteAngle) * 0.58,
      Math.sin(initialPaletteAngle) * 0.58,
    );
    let paletteBaseHueOffset = 0;
    let paletteRadialExponent = 1;
    let paletteLastPoolAngle = 0;
    let paletteTravelAngle = 0;
    let paletteHueScroll = 0;
    let paletteHueScrollVelocity = 0;
    const eyeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uBlink: { value: 0 },
        uDelight: { value: 0 },
        uDizzy: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uBlink;
        uniform float uDelight;
        uniform float uDizzy;
        varying vec2 vUv;

        float distanceToSegment(vec2 point, vec2 start, vec2 end) {
          vec2 segment = end - start;
          float amount = clamp(
            dot(point - start, segment) / dot(segment, segment),
            0.0,
            1.0
          );
          return length(point - (start + segment * amount));
        }

        float distanceToSpiral(vec2 point) {
          vec2 scaledPoint = vec2(point.x / 0.96, point.y);
          float minimumDistance = 10.0;
          vec2 previousPoint = vec2(0.0);
          for (int index = 1; index <= 28; index++) {
            float amount = float(index) / 28.0;
            float angle = amount * 12.25;
            float radius = 0.04 + angle * 0.05;
            vec2 currentPoint = vec2(cos(angle), sin(angle)) * radius;
            minimumDistance = min(
              minimumDistance,
              distanceToSegment(scaledPoint, previousPoint, currentPoint)
            );
            previousPoint = currentPoint;
          }
          return minimumDistance - 0.055;
        }

        void main() {
          vec2 point = vUv * 2.0 - 1.0;
          float shapeAmount = smoothstep(0.04, 0.12, uBlink);
          float ovalDistance = (
            length(vec2(point.x / 0.32, point.y / 0.78)) - 1.0
          ) * 0.32;
          float lineDistance = distanceToSegment(
            point,
            vec2(-0.34, 0.0),
            vec2(0.34, 0.0)
          ) - 0.045;
          float closedDistance = mix(ovalDistance, lineDistance, shapeAmount);
          float closedAlpha = 1.0 - smoothstep(-0.02, 0.02, closedDistance);

          float curveX = clamp(point.x, -0.34, 0.34);
          vec2 curvePoint = vec2(curveX, -0.09 + curveX * curveX * 0.76);
          float curveDistance = length(point - curvePoint) - 0.045;
          float curveAlpha = 1.0 - smoothstep(-0.02, 0.02, curveDistance);
          float spiralAlpha = 1.0 - smoothstep(
            -0.018,
            0.018,
            distanceToSpiral(point)
          );
          float alpha = mix(
            closedAlpha,
            curveAlpha,
            smoothstep(0.0, 1.0, uDelight)
          );
          alpha = mix(alpha, spiralAlpha, smoothstep(0.0, 1.0, uDizzy));

          if (alpha < 0.01) discard;
          gl_FragColor = vec4(0.025, 0.025, 0.025, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -6,
      polygonOffsetUnits: -6,
      toneMapped: false,
    });

    const affectionParticleCanvas = document.createElement('canvas');
    affectionParticleCanvas.width = 96;
    affectionParticleCanvas.height = 96;
    const affectionParticleContext = affectionParticleCanvas.getContext('2d');
    if (affectionParticleContext) {
      affectionParticleContext.clearRect(0, 0, 96, 96);
      affectionParticleContext.fillStyle = '#fff';
      affectionParticleContext.font = '300 74px Georgia, serif';
      affectionParticleContext.textAlign = 'center';
      affectionParticleContext.textBaseline = 'middle';
      affectionParticleContext.fillText('✛', 48, 50);
    }
    const affectionParticleTexture = new THREE.CanvasTexture(
      affectionParticleCanvas,
    );
    affectionParticleTexture.colorSpace = THREE.NoColorSpace;
    affectionParticleTexture.generateMipmaps = false;
    affectionParticleTexture.minFilter = THREE.LinearFilter;
    affectionParticleTexture.magFilter = THREE.LinearFilter;

    const affectionParticlePositions = new Float32Array(
      AFFECTION_PARTICLE_COUNT * 3,
    );
    const affectionParticleAlphas = new Float32Array(AFFECTION_PARTICLE_COUNT);
    const affectionParticleSizes = new Float32Array(AFFECTION_PARTICLE_COUNT);
    const affectionParticleBaseSizes = new Float32Array(
      AFFECTION_PARTICLE_COUNT,
    );
    const affectionParticleAges = new Float32Array(AFFECTION_PARTICLE_COUNT);
    affectionParticleAges.fill(-1);
    const affectionParticleLifetimes = new Float32Array(
      AFFECTION_PARTICLE_COUNT,
    );
    const affectionParticleVelocities = Array.from(
      { length: AFFECTION_PARTICLE_COUNT },
      () => new THREE.Vector3(),
    );
    const affectionParticleGeometry = new THREE.BufferGeometry();
    affectionParticleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(affectionParticlePositions, 3),
    );
    affectionParticleGeometry.setAttribute(
      'aAlpha',
      new THREE.BufferAttribute(affectionParticleAlphas, 1),
    );
    affectionParticleGeometry.setAttribute(
      'aSize',
      new THREE.BufferAttribute(affectionParticleSizes, 1),
    );
    const affectionParticleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: affectionParticleTexture },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.75) },
      },
      vertexShader: `
        attribute float aAlpha;
        attribute float aSize;
        uniform float uPixelRatio;
        varying float vAlpha;

        void main() {
          vAlpha = aAlpha;
          vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * viewPosition;
          gl_PointSize = aSize * uPixelRatio;
        }
      `,
      fragmentShader: `
        uniform sampler2D uMap;
        varying float vAlpha;

        void main() {
          float glyphAlpha = texture2D(uMap, gl_PointCoord).a * vAlpha;
          if (glyphAlpha < 0.02) discard;
          gl_FragColor = vec4(0.025, 0.025, 0.025, glyphAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      toneMapped: false,
    });
    const affectionParticles = new THREE.Points(
      affectionParticleGeometry,
      affectionParticleMaterial,
    );
    affectionParticles.name = 'rub_affection_particles';
    affectionParticles.frustumCulled = false;
    affectionParticles.renderOrder = 8;
    affectionParticles.visible = false;
    scene.add(affectionParticles);

    const raycaster = new THREE.Raycaster();
    raycaster.layers.enable(1);
    const pointer = new THREE.Vector2();
    const pressDirection = new THREE.Vector2(0, 1);
    const springOffset = new THREE.Vector3();
    const springVelocity = new THREE.Vector3();
    const springAcceleration = new THREE.Vector3();
    const floorTarget = new THREE.Vector3();
    const hopVelocity = new THREE.Vector3();
    const hopDirection = new THREE.Vector3(0, 0, 1);
    const tempDirection = new THREE.Vector3();
    const carryTarget = new THREE.Vector3();
    const carryGoal = new THREE.Vector3();
    const carryDelta = new THREE.Vector3();
    const carryAnchorVelocity = new THREE.Vector3();
    const carryAnchorAcceleration = new THREE.Vector3();
    const carryPointerPosition = new THREE.Vector3();
    const carryPointerOrigin = new THREE.Vector3();
    const carryAnchorOrigin = new THREE.Vector3();
    const carryPointerDelta = new THREE.Vector3();
    const carryBodyPosition = new THREE.Vector3();
    const carryBodyVelocity = new THREE.Vector3();
    const carryBodyAcceleration = new THREE.Vector3();
    const carryConstraintDirection = new THREE.Vector3();
    const carryPoseTarget = new THREE.Vector3();
    const chainJointWorldPosition = new THREE.Vector3();
    const chainEffectorDirection = new THREE.Vector3();
    const chainTargetDirection = new THREE.Vector3();
    const chainCurrentWorldQuaternion = new THREE.Quaternion();
    const chainParentWorldQuaternion = new THREE.Quaternion();
    const chainDeltaQuaternion = new THREE.Quaternion();
    const chainLimitedDeltaQuaternion = new THREE.Quaternion();
    const chainDesiredWorldQuaternion = new THREE.Quaternion();
    const chainIdentityQuaternion = new THREE.Quaternion();
    const dropVelocity = new THREE.Vector3();
    const dropPreviousPosition = new THREE.Vector3();
    const landingFrom = new THREE.Vector3();
    const landingTo = new THREE.Vector3();
    const antennaWorldPosition = new THREE.Vector3();
    const tipDragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const headCenterInSpringTip = new THREE.Vector3();
    const headCenterWorld = new THREE.Vector3();
    const affectionParticleOrigin = new THREE.Vector3();
    const affectionContactInSpringTip = new THREE.Vector3();
    const pressHitLocal = new THREE.Vector3();
    const poseEuler = new THREE.Euler();
    const poseQuaternion = new THREE.Quaternion();
    const feetSwing = new THREE.Vector2();
    const feetSwingVelocity = new THREE.Vector2();
    const feetSwingTarget = new THREE.Vector2();
    const landingFeetSwingFrom = new THREE.Vector2();
    const feetPivotWorldPosition = new THREE.Vector3();
    const feetPivotWorldQuaternion = new THREE.Quaternion();
    const springRootWorldQuaternion = new THREE.Quaternion();
    const springRootParentWorldQuaternion = new THREE.Quaternion();
    const springRootFromFeetQuaternion = new THREE.Quaternion();
    const colorModeEntryFrom = new THREE.Vector3();
    const colorModeEntryTo = new THREE.Vector3();

    let model: THREE.Group | null = null;
    let springRoot: THREE.Bone | null = null;
    let springOne: THREE.Bone | null = null;
    let springTwo: THREE.Bone | null = null;
    let springTip: THREE.Bone | null = null;
    let feetPivot: THREE.Group | null = null;
    let springBaseBindingReady = false;
    let carryChainBones: THREE.Bone[] = [];
    let bodyMeshes: THREE.Object3D[] = [];
    let headMeshes: THREE.Object3D[] = [];
    let touchHitProxy: THREE.Mesh | null = null;
    let antennaHitProxy: THREE.Mesh | null = null;
    let pickupHitProxy: THREE.Mesh | null = null;
    let eyeMeshes: THREE.Mesh[] = [];
    let restPoses = new Map<THREE.Bone, BoneRestPose>();
    let pressingHead = false;
    let carrying = false;
    let carryingFromHeadTip = false;
    let dropping = false;
    let settlingLanding = false;
    let landingElapsed = 0;
    let touchHoldTimer = 0;
    let touchPending = false;
    let touchPointerId: number | null = null;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let touchPendingHit: THREE.Intersection<THREE.Object3D> | null = null;
    let pressedPointerId: number | null = null;
    let colorSampling = false;
    let colorModeEntryActive = false;
    let colorModeEntryElapsed = 0;
    let targetActive = false;
    let airborne = false;
    let preparingHop = false;
    let hopPrepRemaining = 0;
    let preparedHopDistance = 0;
    let hopCooldown = 0;
    let wanderCooldown = 1.1;
    let modelHeight = 2.25;
    let movementBodyRadius = modelHeight * 0.28;
    let movementBoundaryRadiusVisual = modelHeight * WANDER_RADIUS_IN_HEIGHTS;
    let colorPoolRadius = modelHeight * 2.9;
    let hopDistance = modelHeight * HOP_DISTANCE_IN_HEIGHTS;
    let hopPower = Math.sqrt(2 * GRAVITY * modelHeight * HOP_APEX_IN_HEIGHTS);
    let hopFlightTime = (hopPower * 2) / GRAVITY;
    let carryTipHeight = modelHeight * (1 + CARRY_CLEARANCE_IN_HEIGHTS);
    let carryRestLength = modelHeight;
    let desiredHeading = 0;
    let currentHeading = 0;
    let carryRigBlend = 0;
    let blinkTimer = 0;
    let blinkAmount = 0;
    let delightAmount = 0;
    let dizzyAmount = 0;
    let dizzyCharge = 0;
    let dizzyUnlocked = false;
    let dizzyReleaseTimer = 0;
    let headHoldElapsed = 0;
    let headRubTravel = 0;
    let headRubActivity = 0;
    let headRubLastX = 0;
    let headRubLastY = 0;
    let affectionContactReady = false;
    let affectionUnlocked = false;
    let affectionParticleSpawnAccumulator = 0;
    let loaded = false;
    let entranceDropActive = false;

    const captureScene = () => {
      if (!loaded || captureInProgress || disposed) return;
      captureInProgress = true;
      setPhotoFeedback('capturing');
      const capturedAt = new Date();

      scene.updateMatrixWorld(true);
      const subjectBounds = getPhotoSubjectBounds([
        ...bodyMeshes,
        ...eyeMeshes,
      ]);
      if (subjectBounds.isEmpty()) {
        captureInProgress = false;
        setPhotoFeedback('idle');
        return;
      }
      framePhotoCamera(photoCamera, subjectBounds);

      const renderTarget = new THREE.WebGLRenderTarget(
        HOP_PHOTO_RENDER_WIDTH,
        HOP_PHOTO_RENDER_HEIGHT,
        {
          depthBuffer: true,
          format: THREE.RGBAFormat,
          type: THREE.UnsignedByteType,
          samples: Math.min(4, renderer.capabilities.maxSamples),
        },
      );
      renderTarget.texture.colorSpace = THREE.SRGBColorSpace;
      const pixels = new Uint8Array(
        HOP_PHOTO_RENDER_WIDTH * HOP_PHOTO_RENDER_HEIGHT * 4,
      );
      const previousTarget = renderer.getRenderTarget();
      const boundaryWasVisible = movementBoundary.visible;
      const colorPoolWasVisible = colorPool.visible;

      try {
        movementBoundary.visible = false;
        colorPool.visible = false;
        renderer.setRenderTarget(renderTarget);
        renderer.clear();
        renderer.render(scene, photoCamera);
        renderer.readRenderTargetPixels(
          renderTarget,
          0,
          0,
          HOP_PHOTO_RENDER_WIDTH,
          HOP_PHOTO_RENDER_HEIGHT,
          pixels,
        );
      } finally {
        renderer.setRenderTarget(previousTarget);
        movementBoundary.visible = boundaryWasVisible;
        colorPool.visible = colorPoolWasVisible;
        renderTarget.dispose();
      }

      const sceneCanvas = document.createElement('canvas');
      sceneCanvas.width = HOP_PHOTO_RENDER_WIDTH;
      sceneCanvas.height = HOP_PHOTO_RENDER_HEIGHT;
      const photoContext = sceneCanvas.getContext('2d');
      if (!photoContext) {
        captureInProgress = false;
        setPhotoFeedback('idle');
        return;
      }

      const flippedPixels = new Uint8ClampedArray(pixels.length);
      const rowLength = HOP_PHOTO_RENDER_WIDTH * 4;
      for (let row = 0; row < HOP_PHOTO_RENDER_HEIGHT; row += 1) {
        const sourceStart = (
          HOP_PHOTO_RENDER_HEIGHT - row - 1
        ) * rowLength;
        flippedPixels.set(
          pixels.subarray(sourceStart, sourceStart + rowLength),
          row * rowLength,
        );
      }
      photoContext.putImageData(
        new ImageData(
          flippedPixels,
          HOP_PHOTO_RENDER_WIDTH,
          HOP_PHOTO_RENDER_HEIGHT,
        ),
        0,
        0,
      );

      const photoCanvas = composeHopPhoto({
        capturedAt,
        source: sceneCanvas,
      });

      photoCanvas.toBlob((blob) => {
        captureInProgress = false;
        if (!blob || disposed) {
          if (!disposed) setPhotoFeedback('idle');
          return;
        }

        const photoUrl = URL.createObjectURL(blob);
        const download = document.createElement('a');
        const timestamp = capturedAt.toISOString().replace(/[:.]/g, '-');
        download.href = photoUrl;
        download.download = `hop-${timestamp}.png`;
        download.click();
        window.setTimeout(() => URL.revokeObjectURL(photoUrl), 1000);
        setPhotoFeedback('saved');
        window.clearTimeout(photoFeedbackTimer);
        photoFeedbackTimer = window.setTimeout(() => {
          if (!disposed) setPhotoFeedback('idle');
        }, 1600);
      }, 'image/png');
    };
    captureSceneRef.current = captureScene;

    const triggerBlink = (duration = 0.2) => {
      blinkTimer = Math.max(blinkTimer, duration);
    };

    const sampleColorFromPosition = () => {
      const poolX = characterRoot.position.x / colorPoolRadius;
      // The palette plane's local Y points toward negative world Z after rotation.
      const poolY = -characterRoot.position.z / colorPoolRadius;
      const poolRadialAmount = clamp(Math.hypot(poolX, poolY), 0, 1);
      const radialAmount = Math.pow(poolRadialAmount, paletteRadialExponent);
      const poolAngle = Math.atan2(poolY, poolX);
      const hue = (
        (poolAngle + paletteBaseHueOffset + paletteHueScroll) / (Math.PI * 2)
        + 1
      ) % 1;
      const hsvSaturation = THREE.MathUtils.smoothstep(
        radialAmount,
        PALETTE_CHROME_INNER_RADIUS,
        0.3,
      );
      const value = 0.98;
      const lightness = value * (1 - hsvSaturation * 0.5);
      const saturation = lightness <= 0 || lightness >= 1
        ? 0
        : (value - lightness) / Math.min(lightness, 1 - lightness);
      frostedColor.setHSL(
        hue,
        saturation,
        lightness,
        THREE.SRGBColorSpace,
      );
      const centerChromeAmount = 1 - THREE.MathUtils.smoothstep(
        poolRadialAmount,
        PALETTE_CHROME_INNER_RADIUS,
        PALETTE_CHROME_OUTER_RADIUS,
      );
      const edgeChromeAmount = THREE.MathUtils.smoothstep(
        poolRadialAmount,
        PALETTE_CHROME_EDGE_START,
        PALETTE_CHROME_EDGE_END,
      );
      const chromeAmount = Math.max(centerChromeAmount, edgeChromeAmount);
      const coloredAmount = 1 - chromeAmount;
      frostedColor.getHSL(materialColorHsl, THREE.SRGBColorSpace);
      materialColor.setHSL(
        materialColorHsl.h,
        clamp(
          materialColorHsl.s + (1 - materialColorHsl.s) * 0.25 * coloredAmount,
          0,
          1,
        ),
        clamp(materialColorHsl.l - 0.04 * coloredAmount, 0, 1),
        THREE.SRGBColorSpace,
      );
      metallicMaterial.color.copy(materialColor).lerp(chromeColor, chromeAmount);
      metallicMaterial.attenuationColor.copy(materialColor);
      metallicMaterial.metalness = THREE.MathUtils.lerp(0.48, 1, chromeAmount);
      metallicMaterial.roughness = THREE.MathUtils.lerp(0.29, 0.13, chromeAmount);
      metallicMaterial.transmission = 0;
      metallicMaterial.thickness = 0;
      metallicMaterial.clearcoat = THREE.MathUtils.lerp(0.2, 0.3, chromeAmount);
      metallicMaterial.clearcoatRoughness = THREE.MathUtils.lerp(
        0.18,
        0.1,
        chromeAmount,
      );
      metallicMaterial.envMapIntensity = THREE.MathUtils.lerp(
        1.5,
        2.05,
        chromeAmount,
      );
      metallicMaterial.bumpScale = THREE.MathUtils.lerp(0.022, 0.008, chromeAmount);
      const selectedAngle = hue * Math.PI * 2;
      selectedPalettePoint.set(
        Math.cos(selectedAngle) * radialAmount,
        Math.sin(selectedAngle) * radialAmount,
      );
    };

    setColorModeRuntimeRef.current = (active) => {
      colorModeRef.current = active;
      hopCursor.refresh();
      if (active) {
        const maxPaletteRadius = Math.max(
          0.1,
          PALETTE_BOUNDARY - movementBodyRadius / colorPoolRadius,
        );
        const selectedRadius = Math.min(
          selectedPalettePoint.length(),
          maxPaletteRadius,
        );
        const selectedAngle = Math.atan2(
          selectedPalettePoint.y,
          selectedPalettePoint.x,
        );
        colorModeEntryFrom.copy(characterRoot.position);
        colorModeEntryTo.set(
          Math.cos(selectedAngle) * selectedRadius * colorPoolRadius,
          0,
          -Math.sin(selectedAngle) * selectedRadius * colorPoolRadius,
        );
        colorModeEntryElapsed = 0;
        colorModeEntryActive = true;
        paletteBaseHueOffset = 0;
        paletteRadialExponent = 1;
        paletteLastPoolAngle = selectedAngle;
        paletteTravelAngle = 0;
        paletteHueScroll = 0;
        paletteHueScrollVelocity = 0;
        colorPoolMaterial.uniforms.uHueOffset.value = 0;
        colorPoolMaterial.uniforms.uRadialExponent.value = paletteRadialExponent;
      } else {
        colorModeEntryActive = false;
      }
      targetActive = false;
      preparingHop = false;
      airborne = false;
      dropping = false;
      settlingLanding = false;
      hopVelocity.set(0, 0, 0);
      wanderCooldown = active ? 2.4 : 1.2;
      if (!active) colorSampling = false;
      setSceneStatus(
        active ? HOP_CONTENT.status.colorMode : HOP_CONTENT.status.colorSelected,
      );
    };

    dropOnEnterRef.current = () => {
      if (!loaded || disposed) return;
      carrying = false;
      pressingHead = false;
      headHoldElapsed = 0;
      headRubTravel = 0;
      affectionUnlocked = false;
      headRubActivity = 0;
      targetActive = false;
      preparingHop = false;
      airborne = false;
      settlingLanding = false;
      dropping = true;
      entranceDropActive = true;
      characterRoot.position.set(0, modelHeight * 0.78, 0);
      characterRoot.rotation.y = 0;
      currentHeading = 0;
      desiredHeading = 0;
      hopVelocity.set(0, 0, 0);
      dropVelocity.set(0, -0.45, 0);
      springOffset.set(0, 0.18, 0);
      springVelocity.set(0, -0.6, 0);
      wanderCooldown = 1.8;
      triggerBlink(0.22);
      characterRoot.visible = true;
      blobShadow.visible = true;
      movementBoundary.visible = true;
      setSceneStatus(HOP_CONTENT.status.droppingIn);
    };

    const updatePointer = (event: PointerEvent) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
    };

    const getHeadHit = () => (
      headMeshes.length > 0
        ? raycaster.intersectObjects(headMeshes, false)[0] ?? null
        : null
    );

    const aimPressAtHit = (hit: THREE.Intersection<THREE.Object3D>) => {
      if (!springTip) return;

      headCenterWorld.copy(headCenterInSpringTip);
      springTip.localToWorld(headCenterWorld);
      pressHitLocal.copy(hit.point);
      characterRoot.worldToLocal(pressHitLocal);
      characterRoot.worldToLocal(headCenterWorld);
      pressHitLocal.sub(headCenterWorld);
      pressDirection.set(pressHitLocal.x, pressHitLocal.z);

      if (pressDirection.lengthSq() < 0.0001) pressDirection.set(0, 1);
      else pressDirection.normalize();
      pressDirection.multiplyScalar(-1);
    };

    const applySpringPose = () => {
      if (!springOne || !springTwo || !springTip) return;

      const compression = clamp(1 + springOffset.y * 0.62, 0.52, 1.22);
      const bendAroundX = clamp(
        springOffset.z * 0.72 + springVelocity.z * 0.024,
        -0.45,
        0.45,
      );
      const bendAroundZ = clamp(
        -springOffset.x * 0.72 - springVelocity.x * 0.024,
        -0.45,
        0.45,
      );
      const springTwist = clamp(
        (springOffset.x - springOffset.z) * 0.12
          + (springVelocity.x - springVelocity.z) * 0.006,
        -0.12,
        0.12,
      );
      // Keep the authored bottom-to-top bone direction during pickup. Reversing
      // it on a timer made the visible bend fight the actual pendulum direction.
      const rigDirection = 1;

      const poseBone = (
        bone: THREE.Bone,
        bendWeight: number,
        compressPosition: boolean,
      ) => {
        const rest = restPoses.get(bone);
        if (!rest) return;
        bone.position.copy(rest.position);
        bone.scale.copy(rest.scale);
        if (compressPosition) bone.position.y = rest.position.y * compression;
        poseEuler.set(
          bendAroundX * bendWeight * rigDirection,
          springTwist * bendWeight * rigDirection,
          bendAroundZ * bendWeight * rigDirection,
          'XYZ',
        );
        poseQuaternion.setFromEuler(poseEuler);
        bone.quaternion.copy(rest.quaternion).multiply(poseQuaternion);
      };

      poseBone(springOne, THREE.MathUtils.lerp(0.58, 0.92, carryRigBlend), true);
      poseBone(springTwo, THREE.MathUtils.lerp(0.84, 0.7, carryRigBlend), true);
      poseBone(springTip, THREE.MathUtils.lerp(0.4, 0.18, carryRigBlend), true);
    };

    const syncSpringBaseToFeet = () => {
      if (
        !springBaseBindingReady
        || !feetPivot
        || !springRoot
        || !springRoot.parent
      ) return;

      // The feet are rendered under a separate pendulum pivot, while the coil
      // is still driven by its skeleton. Match their world-space orientation
      // at the shared attachment point without disturbing the authored offset.
      feetPivot.getWorldQuaternion(feetPivotWorldQuaternion);
      springRoot.parent.getWorldQuaternion(springRootParentWorldQuaternion);
      springRootWorldQuaternion
        .copy(feetPivotWorldQuaternion)
        .multiply(springRootFromFeetQuaternion);
      springRoot.quaternion
        .copy(springRootParentWorldQuaternion.invert())
        .multiply(springRootWorldQuaternion)
        .normalize();
    };

    const solveCarryChain = () => {
      if (!antennaHitProxy || carryChainBones.length !== 3) return;
      const maxJointSteps = [0.26, 0.22, 0.055];

      // CCD rotates the authored joints toward the held tip. Unlike positional
      // bone offsets, rotations preserve every segment length like a real chain.
      for (let iteration = 0; iteration < 3; iteration += 1) {
        for (let index = carryChainBones.length - 1; index >= 0; index -= 1) {
          const joint = carryChainBones[index];
          if (!joint.parent) continue;

          characterRoot.updateMatrixWorld(true);
          antennaHitProxy.getWorldPosition(antennaWorldPosition);
          joint.getWorldPosition(chainJointWorldPosition);
          chainEffectorDirection
            .copy(antennaWorldPosition)
            .sub(chainJointWorldPosition);
          chainTargetDirection
            .copy(carryTarget)
            .sub(chainJointWorldPosition);
          if (
            chainEffectorDirection.lengthSq() < 0.000001
            || chainTargetDirection.lengthSq() < 0.000001
          ) continue;

          chainEffectorDirection.normalize();
          chainTargetDirection.normalize();
          const angle = Math.acos(clamp(
            chainEffectorDirection.dot(chainTargetDirection),
            -1,
            1,
          ));
          if (angle < 0.0001) continue;

          chainDeltaQuaternion.setFromUnitVectors(
            chainEffectorDirection,
            chainTargetDirection,
          );
          const maxStep = maxJointSteps[index];
          if (angle > maxStep) {
            chainLimitedDeltaQuaternion.slerpQuaternions(
              chainIdentityQuaternion,
              chainDeltaQuaternion,
              maxStep / angle,
            );
            chainDeltaQuaternion.copy(chainLimitedDeltaQuaternion);
          }

          joint.getWorldQuaternion(chainCurrentWorldQuaternion);
          chainDesiredWorldQuaternion
            .copy(chainDeltaQuaternion)
            .multiply(chainCurrentWorldQuaternion);
          joint.parent.getWorldQuaternion(chainParentWorldQuaternion);
          joint.quaternion
            .copy(chainParentWorldQuaternion.invert())
            .multiply(chainDesiredWorldQuaternion)
            .normalize();
        }
      }
      characterRoot.updateMatrixWorld(true);
    };

    const updateAffectionContact = (
      hit: THREE.Intersection<THREE.Object3D>,
    ) => {
      if (!springTip) return;
      affectionContactInSpringTip.copy(hit.point);
      springTip.worldToLocal(affectionContactInSpringTip);
      affectionContactReady = true;
    };

    const spawnAffectionParticle = (index: number) => {
      if (!springTip) return;
      affectionParticleOrigin.copy(
        affectionContactReady
          ? affectionContactInSpringTip
          : headCenterInSpringTip,
      );
      springTip.localToWorld(affectionParticleOrigin);
      const angle = Math.random() * Math.PI * 2;
      const radialDistance = modelHeight * (0.018 + Math.random() * 0.045);
      const positionIndex = index * 3;
      affectionParticlePositions[positionIndex] = affectionParticleOrigin.x
        + Math.cos(angle) * radialDistance;
      affectionParticlePositions[positionIndex + 1] = affectionParticleOrigin.y
        + modelHeight * (0.012 + Math.random() * 0.04);
      affectionParticlePositions[positionIndex + 2] = affectionParticleOrigin.z
        + Math.sin(angle) * radialDistance;
      affectionParticleVelocities[index].set(
        Math.cos(angle) * modelHeight * (0.035 + Math.random() * 0.04),
        modelHeight * (0.16 + Math.random() * 0.11),
        Math.sin(angle) * modelHeight * (0.035 + Math.random() * 0.04),
      );
      affectionParticleAges[index] = 0;
      affectionParticleLifetimes[index] = 0.72 + Math.random() * 0.48;
      affectionParticleBaseSizes[index] = 14 + Math.random() * 8;
    };

    const updateAffectionParticles = (dt: number) => {
      headRubActivity = Math.max(0, headRubActivity - dt * 2.35);
      const emitting = pressingHead
        && affectionUnlocked
        && headRubActivity > 0.06;
      if (emitting) {
        affectionParticleSpawnAccumulator += dt * (7 + headRubActivity * 12);
      } else {
        affectionParticleSpawnAccumulator = Math.min(
          affectionParticleSpawnAccumulator,
          0.95,
        );
      }

      while (affectionParticleSpawnAccumulator >= 1) {
        const availableIndex = affectionParticleAges.findIndex((age) => age < 0);
        if (availableIndex < 0) break;
        spawnAffectionParticle(availableIndex);
        affectionParticleSpawnAccumulator -= 1;
      }

      let hasVisibleParticle = false;
      for (let index = 0; index < AFFECTION_PARTICLE_COUNT; index += 1) {
        if (affectionParticleAges[index] < 0) {
          affectionParticleAlphas[index] = 0;
          affectionParticleSizes[index] = 0;
          continue;
        }

        affectionParticleAges[index] += dt;
        const lifetime = affectionParticleLifetimes[index];
        if (affectionParticleAges[index] >= lifetime) {
          affectionParticleAges[index] = -1;
          affectionParticleAlphas[index] = 0;
          affectionParticleSizes[index] = 0;
          continue;
        }

        hasVisibleParticle = true;
        const lifeAmount = affectionParticleAges[index] / lifetime;
        const positionIndex = index * 3;
        affectionParticlePositions[positionIndex]
          += affectionParticleVelocities[index].x * dt;
        affectionParticlePositions[positionIndex + 1]
          += affectionParticleVelocities[index].y * dt;
        affectionParticlePositions[positionIndex + 2]
          += affectionParticleVelocities[index].z * dt;
        affectionParticleVelocities[index].multiplyScalar(
          Math.exp(-0.7 * dt),
        );
        const envelope = Math.sin(lifeAmount * Math.PI);
        affectionParticleAlphas[index] = Math.pow(envelope, 0.72)
          * AFFECTION_PARTICLE_MAX_ALPHA;
        affectionParticleSizes[index] = affectionParticleBaseSizes[index]
          * (0.72 + envelope * 0.38);
      }

      affectionParticles.visible = hasVisibleParticle;
      affectionParticleGeometry.getAttribute('position').needsUpdate = true;
      affectionParticleGeometry.getAttribute('aAlpha').needsUpdate = true;
      affectionParticleGeometry.getAttribute('aSize').needsUpdate = true;
    };

    const updateEyes = (dt: number) => {
      blinkTimer = Math.max(0, blinkTimer - dt);
      if (pressingHead) {
        headHoldElapsed += dt;
        if (
          headHoldElapsed >= AFFECTION_HOLD_DELAY
          || (
            headHoldElapsed >= AFFECTION_RUB_DELAY
            && headRubTravel >= AFFECTION_RUB_DISTANCE
          )
        ) affectionUnlocked = true;
      }
      const target = pressingHead
        || blinkTimer > 0
        || preparingHop
        || airborne ? 1 : 0;
      const response = target > blinkAmount ? 34 : 18;
      blinkAmount += (target - blinkAmount) * (1 - Math.exp(-response * dt));
      const delightTarget = pressingHead && affectionUnlocked ? 1 : 0;
      const delightResponse = delightTarget > delightAmount ? 7.2 : 11;
      delightAmount += (delightTarget - delightAmount)
        * (1 - Math.exp(-delightResponse * dt));

      if (carrying) {
        const relativeSwingSpeed = Math.hypot(
          carryBodyVelocity.x - carryAnchorVelocity.x,
          carryBodyVelocity.z - carryAnchorVelocity.z,
        ) / Math.max(modelHeight, 0.001);
        const pointerSwingSpeed = Math.hypot(
          carryAnchorVelocity.x,
          carryAnchorVelocity.z,
        ) / Math.max(modelHeight, 0.001);
        const swingEnergy = relativeSwingSpeed * 0.65
          + pointerSwingSpeed * 0.48
          + feetSwingVelocity.length() * 0.12;
        dizzyCharge += swingEnergy > DIZZY_SWING_ENERGY_THRESHOLD
          ? dt * (swingEnergy - 0.32)
          : -dt * 0.28;
        dizzyCharge = clamp(dizzyCharge, 0, 1.2);
        if (dizzyCharge >= DIZZY_CHARGE_THRESHOLD) {
          dizzyUnlocked = true;
          dizzyReleaseTimer = 0.7;
        }
      } else {
        dizzyCharge = Math.max(0, dizzyCharge - dt * 1.8);
        dizzyReleaseTimer = Math.max(0, dizzyReleaseTimer - dt);
        if (dizzyReleaseTimer === 0) dizzyUnlocked = false;
      }
      const dizzyTarget = dizzyUnlocked ? 1 : 0;
      const dizzyResponse = dizzyTarget > dizzyAmount ? 8.5 : 10;
      dizzyAmount += (dizzyTarget - dizzyAmount)
        * (1 - Math.exp(-dizzyResponse * dt));

      eyeMaterial.uniforms.uBlink.value = blinkAmount;
      eyeMaterial.uniforms.uDelight.value = delightAmount;
      eyeMaterial.uniforms.uDizzy.value = dizzyAmount;
      updateAffectionParticles(dt);
    };

    const finishAtTarget = () => {
      targetActive = false;
      preparingHop = false;
      wanderCooldown = 1.5 + Math.random() * 2;
      setSceneStatus(HOP_CONTENT.status.settled);
    };

    const scheduleWanderHop = () => {
      const angle = Math.random() * Math.PI * 2;
      const distance = modelHeight * (0.16 + Math.random() * 0.14);
      floorTarget.set(
        characterRoot.position.x + Math.sin(angle) * distance,
        0,
        characterRoot.position.z + Math.cos(angle) * distance,
      );

      const wanderRadius = getMovementBoundaryRadius() - movementBodyRadius;
      tempDirection.set(floorTarget.x, 0, floorTarget.z);
      if (tempDirection.length() > wanderRadius) {
        tempDirection.setLength(wanderRadius * 0.88);
        floorTarget.set(tempDirection.x, 0, tempDirection.z);
      }
      targetActive = true;
      hopCooldown = 0;
    };

    const prepareNextHop = () => {
      tempDirection.set(
        floorTarget.x - characterRoot.position.x,
        0,
        floorTarget.z - characterRoot.position.z,
      );
      const remainingDistance = tempDirection.length();
      if (remainingDistance <= ARRIVAL_EPSILON) {
        characterRoot.position.x = floorTarget.x;
        characterRoot.position.z = floorTarget.z;
        finishAtTarget();
        return;
      }

      hopDirection.copy(tempDirection).normalize();
      preparedHopDistance = Math.min(hopDistance, remainingDistance);
      desiredHeading = Math.atan2(hopDirection.x, hopDirection.z);
      preparingHop = true;
      hopPrepRemaining = HOP_PREP_TIME;
      springOffset.y = Math.min(springOffset.y, -0.24);
      springVelocity.y -= 1.5;
      triggerBlink(HOP_PREP_TIME + 0.06);
      setSceneStatus(HOP_CONTENT.status.loadingSpring);
    };

    const launchPreparedHop = () => {
      preparingHop = false;
      hopVelocity.set(
        hopDirection.x * preparedHopDistance / hopFlightTime,
        hopPower,
        hopDirection.z * preparedHopDistance / hopFlightTime,
      );
      airborne = true;
      springVelocity.y += 5.5;
      springVelocity.x -= hopDirection.x * 1.05;
      springVelocity.z -= hopDirection.z * 1.05;
      setSceneStatus(HOP_CONTENT.status.hopping);
    };

    const getMovementBoundaryTargetRadius = () => (
      colorModeRef.current
        ? colorPoolRadius * PALETTE_BOUNDARY
        : modelHeight * WANDER_RADIUS_IN_HEIGHTS
    );
    const getMovementBoundaryRadius = () => movementBoundaryRadiusVisual;

    const softenMovementPosition = (
      position: THREE.Vector3,
      inset = 0,
    ) => {
      const radius = Math.hypot(position.x, position.z);
      const limit = Math.max(modelHeight * 0.2, getMovementBoundaryRadius() - inset);
      const softStart = limit * BOUNDARY_SOFT_START;
      if (radius <= softStart || radius === 0) return;
      const softWidth = limit - softStart;
      const softenedRadius = softStart + softWidth * (
        1 - Math.exp(-(radius - softStart) / softWidth)
      );
      const scale = softenedRadius / radius;
      position.x *= scale;
      position.z *= scale;
    };

    const enforceMovementBoundary = (
      position: THREE.Vector3,
      velocity?: THREE.Vector3,
      inset = 0,
    ) => {
      const radius = Math.hypot(position.x, position.z);
      const limit = Math.max(modelHeight * 0.2, getMovementBoundaryRadius() - inset);
      if (radius <= limit || radius === 0) return;
      const normalX = position.x / radius;
      const normalZ = position.z / radius;
      position.x = normalX * limit;
      position.z = normalZ * limit;
      if (!velocity) return;
      const outwardSpeed = velocity.x * normalX + velocity.z * normalZ;
      if (outwardSpeed > 0) {
        velocity.x -= normalX * outwardSpeed;
        velocity.z -= normalZ * outwardSpeed;
      }
    };

    const beginFootPlant = (
      from: THREE.Vector3,
      targetX: number,
      targetZ: number,
    ) => {
      dropping = false;
      settlingLanding = true;
      landingElapsed = 0;
      landingFeetSwingFrom.copy(feetSwing);
      landingFrom.copy(from);
      landingFrom.y = Math.max(0, landingFrom.y);
      landingTo.set(targetX, 0, targetZ);
      enforceMovementBoundary(landingFrom, undefined, movementBodyRadius);
      enforceMovementBoundary(landingTo, undefined, movementBodyRadius);
      characterRoot.position.copy(landingFrom);
      dropVelocity.set(0, 0, 0);
      setSceneStatus(HOP_CONTENT.status.plantingFeet);
    };

    const stepPhysics = (dt: number) => {
      if (carrying) {
        carryAnchorAcceleration
          .copy(carryGoal)
          .sub(carryTarget)
          .multiplyScalar(CARRY_ANCHOR_STIFFNESS)
          .addScaledVector(carryAnchorVelocity, -CARRY_ANCHOR_DAMPING);
        carryAnchorVelocity.addScaledVector(carryAnchorAcceleration, dt);
        const maxAnchorSpeed = modelHeight * CARRY_ANCHOR_MAX_SPEED_IN_HEIGHTS;
        if (carryAnchorVelocity.lengthSq() > maxAnchorSpeed * maxAnchorSpeed) {
          carryAnchorVelocity.setLength(maxAnchorSpeed);
        }
        carryTarget.addScaledVector(carryAnchorVelocity, dt);
        enforceMovementBoundary(carryTarget, carryAnchorVelocity);

        carryBodyAcceleration
          .set(0, -GRAVITY * 0.92, 0)
          .addScaledVector(carryBodyVelocity, -CARRY_BODY_DRAG);
        carryBodyVelocity.addScaledVector(carryBodyAcceleration, dt);
        if (carryBodyVelocity.lengthSq() > 100) carryBodyVelocity.setLength(10);
        carryBodyPosition.addScaledVector(carryBodyVelocity, dt);

        // A chain can go slack, but it cannot stretch. Project the lower body
        // back onto the tether sphere and remove only its outward velocity.
        carryDelta.copy(carryBodyPosition).sub(carryTarget);
        const constrainedDistance = Math.max(carryDelta.length(), 0.0001);
        const chainLength = carryRestLength * CARRY_CHAIN_LENGTH_RATIO;
        if (constrainedDistance > chainLength) {
          carryConstraintDirection.copy(carryDelta).divideScalar(constrainedDistance);
          carryBodyPosition
            .copy(carryTarget)
            .addScaledVector(carryConstraintDirection, chainLength);
          const outwardSpeed = carryBodyVelocity
            .sub(carryAnchorVelocity)
            .dot(carryConstraintDirection);
          if (outwardSpeed > 0) {
            carryBodyVelocity.addScaledVector(carryConstraintDirection, -outwardSpeed);
          }
          carryBodyVelocity.add(carryAnchorVelocity);
        }

        const carryFloorClearance = modelHeight * 0.065;
        if (carryBodyPosition.y < carryFloorClearance) {
          carryBodyPosition.y = carryFloorClearance;
          if (carryBodyVelocity.y < 0) carryBodyVelocity.y = 0;
        }
        enforceMovementBoundary(
          carryBodyPosition,
          carryBodyVelocity,
          movementBodyRadius,
        );

        carryDelta.copy(carryTarget).sub(carryBodyPosition);
        const visualDistance = carryDelta.length();
        // Let the feet react to the user's intended pull immediately, while the
        // body and chain retain their softer delayed follow.
        carryPointerDelta.copy(carryGoal).sub(carryBodyPosition);
        const horizontalPull = Math.hypot(
          carryPointerDelta.x,
          carryPointerDelta.z,
        );
        const pullAmount = THREE.MathUtils.smoothstep(
          horizontalPull / (modelHeight * 0.24),
          0.04,
          1,
        );
        if (horizontalPull > modelHeight * 0.008) {
          const headingCos = Math.cos(currentHeading);
          const headingSin = Math.sin(currentHeading);
          const localPullX = carryPointerDelta.x * headingCos
            - carryPointerDelta.z * headingSin;
          const localPullZ = carryPointerDelta.x * headingSin
            + carryPointerDelta.z * headingCos;
          const swingAmount = CARRY_FEET_SWING_LIMIT * pullAmount
            / horizontalPull;
          feetSwingTarget.set(
            localPullZ * swingAmount,
            -localPullX * swingAmount,
          );
        } else {
          feetSwingTarget.set(0, 0);
        }
        carryPoseTarget.set(
          clamp(carryDelta.x / (modelHeight * 0.72), -0.58, 0.58),
          clamp(
            (visualDistance - carryRestLength) / (modelHeight * 0.62),
            -0.42,
            0.18,
          ),
          clamp(carryDelta.z / (modelHeight * 0.72), -0.58, 0.58),
        );
      } else {
        if (dropping) feetSwingTarget.copy(feetSwing);
        else feetSwingTarget.set(0, 0);
      }

      if (carrying) {
        springAcceleration
          .copy(carryPoseTarget)
          .sub(springOffset)
          .multiplyScalar(CARRY_POSE_STIFFNESS)
          .addScaledVector(springVelocity, -CARRY_POSE_DAMPING);
      } else {
        const verticalStiffness = pressingHead ? 188 : SPRING_VERTICAL_STIFFNESS;
        const verticalDamping = pressingHead ? 5.4 : SPRING_VERTICAL_DAMPING;
        springAcceleration.set(
          -springOffset.x * SPRING_LATERAL_STIFFNESS
            - springVelocity.x * SPRING_LATERAL_DAMPING,
          -springOffset.y * verticalStiffness
            - springVelocity.y * verticalDamping,
          -springOffset.z * SPRING_LATERAL_STIFFNESS
            - springVelocity.z * SPRING_LATERAL_DAMPING,
        );
      }

      if (pressingHead) {
        springAcceleration.y -= 112;
        springAcceleration.x += pressDirection.x * 17;
        springAcceleration.z += pressDirection.y * 17;
      }
      if (preparingHop) {
        springAcceleration.y -= 12;
      }

      springVelocity.addScaledVector(springAcceleration, dt);
      springOffset.addScaledVector(springVelocity, dt);
      springOffset.x = clamp(springOffset.x, -0.62, 0.62);
      springOffset.y = clamp(springOffset.y, -0.68, 0.38);
      springOffset.z = clamp(springOffset.z, -0.62, 0.62);

      if (settlingLanding) {
        const landingSwingAmount = clamp(
          landingElapsed / CARRY_LANDING_DURATION,
          0,
          1,
        );
        const smoothLandingSwing = landingSwingAmount * landingSwingAmount
          * (3 - 2 * landingSwingAmount);
        feetSwing.copy(landingFeetSwingFrom).multiplyScalar(
          1 - smoothLandingSwing,
        );
        feetSwingVelocity.set(0, 0);
      } else {
        const feetSwingDamping = carrying
          ? CARRY_FEET_SWING_DAMPING
          : dropping ? 2.4 : 9.5;
        feetSwingVelocity.x += (
          (feetSwingTarget.x - feetSwing.x) * CARRY_FEET_SWING_STIFFNESS
          - feetSwingVelocity.x * feetSwingDamping
        ) * dt;
        feetSwingVelocity.y += (
          (feetSwingTarget.y - feetSwing.y) * CARRY_FEET_SWING_STIFFNESS
          - feetSwingVelocity.y * feetSwingDamping
        ) * dt;
        feetSwingVelocity.x = clamp(feetSwingVelocity.x, -3.6, 3.6);
        feetSwingVelocity.y = clamp(feetSwingVelocity.y, -3.6, 3.6);
        feetSwing.addScaledVector(feetSwingVelocity, dt);
        const maxFeetSwing = CARRY_FEET_SWING_LIMIT * 1.08;
        if (feetSwing.lengthSq() > maxFeetSwing * maxFeetSwing) {
          feetSwing.setLength(maxFeetSwing);
        }
      }
      if (feetPivot) {
        feetPivot.rotation.set(feetSwing.x, 0, feetSwing.y, 'XYZ');
      }
      syncSpringBaseToFeet();

      hopCooldown = Math.max(0, hopCooldown - dt);

      if (carrying) {
        characterRoot.position.copy(carryBodyPosition);
      } else if (dropping) {
        dropPreviousPosition.copy(characterRoot.position);
        dropVelocity.y -= GRAVITY * dt;
        const horizontalDamping = Math.exp(-1.25 * dt);
        dropVelocity.x *= horizontalDamping;
        dropVelocity.z *= horizontalDamping;
        characterRoot.position.addScaledVector(dropVelocity, dt);

        if (
          characterRoot.position.y <= modelHeight * 0.025
          && dropVelocity.y < 0
        ) {
          const plantX = characterRoot.position.x + dropVelocity.x * 0.055;
          const plantZ = characterRoot.position.z + dropVelocity.z * 0.055;
          beginFootPlant(dropPreviousPosition, plantX, plantZ);
        }
      } else if (settlingLanding) {
        landingElapsed += dt;
        const amount = clamp(landingElapsed / CARRY_LANDING_DURATION, 0, 1);
        const smoothAmount = amount * amount * (3 - 2 * amount);
        characterRoot.position.lerpVectors(landingFrom, landingTo, smoothAmount);
        characterRoot.position.y += Math.sin(amount * Math.PI)
          * Math.min(0.055, modelHeight * 0.025);

        if (amount >= 1) {
          const isEntranceLanding = entranceDropActive;
          characterRoot.position.copy(landingTo);
          feetSwing.set(0, 0);
          feetSwingTarget.set(0, 0);
          feetSwingVelocity.set(0, 0);
          settlingLanding = false;
          springOffset.y = Math.min(
            springOffset.y,
            isEntranceLanding ? -0.18 : -0.28,
          );
          springVelocity.y -= isEntranceLanding ? 4.2 : 6.2;
          triggerBlink(0.2);
          setSceneStatus(HOP_CONTENT.status.landed);
          if (entranceDropActive) {
            entranceDropActive = false;
            window.clearTimeout(entranceChromeTimer);
            entranceChromeTimer = window.setTimeout(
              () => setChromeVisible(true),
              INTRO_CHROME_DELAY_MS,
            );
          }
        }
      } else if (preparingHop) {
        hopPrepRemaining -= dt;
        if (hopPrepRemaining <= 0) launchPreparedHop();
      } else if (airborne) {
        characterRoot.position.addScaledVector(hopVelocity, dt);
        hopVelocity.y -= GRAVITY * dt;

        if (characterRoot.position.y <= 0 && hopVelocity.y < 0) {
          characterRoot.position.y = 0;
          airborne = false;
          hopVelocity.set(0, 0, 0);
          hopCooldown = HOP_LANDING_COOLDOWN;
          springOffset.y = Math.min(springOffset.y, -0.22);
          springVelocity.y -= 4.7;
          springVelocity.x -= hopDirection.x * 1.25;
          springVelocity.z -= hopDirection.z * 1.25;
          triggerBlink(0.16);

          tempDirection.set(
            floorTarget.x - characterRoot.position.x,
            0,
            floorTarget.z - characterRoot.position.z,
          );
          if (targetActive) {
            characterRoot.position.x = floorTarget.x;
            characterRoot.position.z = floorTarget.z;
            finishAtTarget();
          }
        }
      } else if (targetActive && hopCooldown === 0 && !pressingHead) {
        prepareNextHop();
      }

      if (!carrying) {
        if (dropping) {
          enforceMovementBoundary(
            characterRoot.position,
            dropVelocity,
            movementBodyRadius,
          );
        } else if (airborne) {
          enforceMovementBoundary(
            characterRoot.position,
            hopVelocity,
            movementBodyRadius,
          );
        } else {
          enforceMovementBoundary(
            characterRoot.position,
            undefined,
            movementBodyRadius,
          );
        }
      }

      if (colorSampling && colorModeRef.current && !carrying) {
        sampleColorFromPosition();
        if (!dropping && !settlingLanding) colorSampling = false;
      }

      if (
        loaded
        && !targetActive
        && !preparingHop
        && !airborne
        && !carrying
        && !dropping
        && !settlingLanding
        && !pressingHead
        && !colorModeRef.current
      ) {
        wanderCooldown = Math.max(0, wanderCooldown - dt);
        if (wanderCooldown === 0) scheduleWanderHop();
      }

      carryRigBlend += (
        (carrying ? 1 : 0) - carryRigBlend
      ) * (1 - Math.exp(-(carrying ? 7.4 : 10) * dt));
      currentHeading = dampAngle(
        currentHeading,
        desiredHeading,
        carrying ? 6.2 : 14,
        dt,
      );
      characterRoot.rotation.y = currentHeading;
      applySpringPose();
      if (carrying) {
        solveCarryChain();
        if (colorSampling) sampleColorFromPosition();
      }
      updateEyes(dt);
    };

    const clearPendingTouch = () => {
      window.clearTimeout(touchHoldTimer);
      touchHoldTimer = 0;
      touchPending = false;
      touchPointerId = null;
      touchPendingHit = null;
    };

    const beginCarry = (pointerId: number, fromHeadTip = false) => {
      if (!antennaHitProxy) return;
      clearPendingTouch();
      paletteLastPoolAngle = Math.atan2(
        -characterRoot.position.z,
        characterRoot.position.x,
      );
      colorModeEntryActive = false;
      antennaHitProxy.getWorldPosition(antennaWorldPosition);
      tipDragPlane.constant = -carryTipHeight;
      if (!raycaster.ray.intersectPlane(tipDragPlane, carryPointerPosition)) {
        carryPointerPosition.copy(antennaWorldPosition);
      }
      carryPointerPosition.y = carryTipHeight;
      softenMovementPosition(carryPointerPosition);
      carryPointerOrigin.copy(carryPointerPosition);
      carryAnchorOrigin.copy(antennaWorldPosition);
      carryAnchorOrigin.y = carryTipHeight;
      carryTarget.copy(antennaWorldPosition);
      carryGoal.copy(carryAnchorOrigin);
      carryAnchorVelocity.set(0, 0, 0);
      carryBodyPosition.copy(characterRoot.position);
      if (airborne) carryBodyVelocity.copy(hopVelocity);
      else if (dropping) carryBodyVelocity.copy(dropVelocity);
      else carryBodyVelocity.set(0, 0, 0);

      carrying = true;
      carryingFromHeadTip = fromHeadTip;
      colorSampling = colorModeRef.current;
      dropping = false;
      settlingLanding = false;
      pressingHead = false;
      headHoldElapsed = 0;
      headRubTravel = 0;
      headRubActivity = 0;
      affectionUnlocked = false;
      affectionContactReady = false;
      dizzyCharge = 0;
      dizzyUnlocked = false;
      dizzyReleaseTimer = 0;
      pressedPointerId = pointerId;
      targetActive = false;
      preparingHop = false;
      airborne = false;
      hopVelocity.set(0, 0, 0);
      wanderCooldown = 1.5 + Math.random() * 1.5;
      desiredHeading = 0;
      springVelocity.y += 1.2;
      triggerBlink(0.14);
      try {
        renderer.domElement.setPointerCapture(pointerId);
      } catch {
        // The touch may have ended during the hold threshold.
      }
      setCursorMode(fromHeadTip ? 'tip-active' : 'active');
      setSceneStatus(HOP_CONTENT.status.pickedUp);
    };

    const applyTapPush = (hit: THREE.Intersection<THREE.Object3D>) => {
      if (!airborne) {
        targetActive = false;
        preparingHop = false;
        wanderCooldown = Math.max(wanderCooldown, 0.9);
      }
      aimPressAtHit(hit);
      springOffset.y = Math.min(springOffset.y, -0.26);
      springOffset.x = clamp(
        springOffset.x + pressDirection.x * 0.1,
        -0.62,
        0.62,
      );
      springOffset.z = clamp(
        springOffset.z + pressDirection.y * 0.1,
        -0.62,
        0.62,
      );
      springVelocity.y += 3.1;
      springVelocity.x += pressDirection.x * 4.1;
      springVelocity.z += pressDirection.y * 4.1;
      triggerBlink(0.34);
      setSceneStatus(HOP_CONTENT.status.springReleased);
    };

    const onPointerDown = (event: PointerEvent) => {
      updateCustomCursor(event);
      if (!loaded || event.button !== 0) return;
      updatePointer(event);

      const antennaHit = pickupHitProxy
        ? raycaster.intersectObject(pickupHitProxy, false)[0] ?? null
        : null;
      const touchProxyHit = event.pointerType === 'touch' && touchHitProxy
        ? raycaster.intersectObject(touchHitProxy, false)[0] ?? null
        : null;
      const bodyHit = bodyMeshes.length > 0
        ? raycaster.intersectObjects(bodyMeshes, false)[0] ?? null
        : null;
      const headHit = getHeadHit();

      if (
        event.pointerType === 'touch'
        && (headHit || bodyHit || antennaHit || touchProxyHit)
      ) {
        clearPendingTouch();
        touchPending = true;
        touchPointerId = event.pointerId;
        touchStartX = event.clientX;
        touchStartY = event.clientY;
        touchStartTime = event.timeStamp;
        touchPendingHit = headHit || bodyHit || antennaHit || touchProxyHit;
        renderer.domElement.setPointerCapture(event.pointerId);
        touchHoldTimer = window.setTimeout(() => {
          if (touchPending && touchPointerId === event.pointerId) {
            beginCarry(event.pointerId);
          }
        }, TOUCH_HOLD_DELAY);
        setCursorMode('hover');
        event.preventDefault();
        return;
      }

      const bodyCanCarry = colorModeRef.current && Boolean(bodyHit);
      if ((antennaHit || bodyCanCarry) && antennaHitProxy) {
        beginCarry(event.pointerId, Boolean(antennaHit));
        event.preventDefault();
        return;
      }

      if (headHit) {
        if (!airborne) {
          targetActive = false;
          preparingHop = false;
          wanderCooldown = Math.max(wanderCooldown, 0.9);
        }
        pressingHead = true;
        headHoldElapsed = 0;
        headRubTravel = 0;
        headRubActivity = 0;
        headRubLastX = event.clientX;
        headRubLastY = event.clientY;
        affectionUnlocked = false;
        updateAffectionContact(headHit);
        pressedPointerId = event.pointerId;
        aimPressAtHit(headHit);
        springOffset.y = Math.min(springOffset.y, -0.26);
        springOffset.x = clamp(
          springOffset.x + pressDirection.x * 0.1,
          -0.62,
          0.62,
        );
        springOffset.z = clamp(
          springOffset.z + pressDirection.y * 0.1,
          -0.62,
          0.62,
        );
        springVelocity.y -= 4.7;
        springVelocity.x += pressDirection.x * 2.1;
        springVelocity.z += pressDirection.y * 2.1;
        triggerBlink(0.34);
        renderer.domElement.setPointerCapture(event.pointerId);
        setCursorMode('active');
        setSceneStatus(HOP_CONTENT.status.pressingSpring);
        event.preventDefault();
        return;
      }
    };

    const releaseInteraction = (event: PointerEvent) => {
      if (touchPending && event.pointerId === touchPointerId) {
        const tapHit = touchPendingHit;
        clearPendingTouch();
        if (renderer.domElement.hasPointerCapture(event.pointerId)) {
          renderer.domElement.releasePointerCapture(event.pointerId);
        }
        setCursorMode('hover');
        if (event.type === 'pointerup' && tapHit) applyTapPush(tapHit);
        event.preventDefault();
        return;
      }

      if (carrying && event.pointerId === pressedPointerId) {
        const releasedHeadTip = carryingFromHeadTip;
        carrying = false;
        carryingFromHeadTip = false;
        colorSampling = colorModeRef.current;
        pressedPointerId = null;
        dropping = characterRoot.position.y > modelHeight * 0.02;
        dropVelocity.copy(carryBodyVelocity);
        if (dropVelocity.lengthSq() > 100) dropVelocity.setLength(10);
        carryAnchorVelocity.set(0, 0, 0);
        setCursorMode(releasedHeadTip ? 'tip' : 'hover');
        if (renderer.domElement.hasPointerCapture(event.pointerId)) {
          renderer.domElement.releasePointerCapture(event.pointerId);
        }
        if (dropping) setSceneStatus(HOP_CONTENT.status.dropping);
        else beginFootPlant(
          characterRoot.position,
          characterRoot.position.x,
          characterRoot.position.z,
        );
        return;
      }

      if (!pressingHead || event.pointerId !== pressedPointerId) return;
      pressingHead = false;
      headHoldElapsed = 0;
      headRubTravel = 0;
      headRubActivity = 0;
      affectionUnlocked = false;
      affectionContactReady = false;
      pressedPointerId = null;
      springVelocity.y += 7.8;
      springVelocity.x += pressDirection.x * 2;
      springVelocity.z += pressDirection.y * 2;
      setCursorMode('hover');
      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
      setSceneStatus(HOP_CONTENT.status.springReleased);
    };

    const onPointerMove = (event: PointerEvent) => {
      updateCustomCursor(event);
      if (!loaded) return;
      updatePointer(event);
      if (touchPending && event.pointerId === touchPointerId) {
        const distance = Math.hypot(
          event.clientX - touchStartX,
          event.clientY - touchStartY,
        );
        if (
          distance >= TOUCH_DRAG_THRESHOLD
          && event.timeStamp - touchStartTime >= 90
        ) {
          beginCarry(event.pointerId);
        }
        event.preventDefault();
        return;
      }
      if (carrying && event.pointerId === pressedPointerId) {
        tipDragPlane.constant = -carryTipHeight;
        const intersection = raycaster.ray.intersectPlane(
          tipDragPlane,
          carryPointerPosition,
        );
        if (intersection && antennaHitProxy) {
          carryPointerPosition.y = carryTipHeight;
          carryPointerDelta
            .copy(carryPointerPosition)
            .sub(carryPointerOrigin);
          carryGoal
            .copy(carryAnchorOrigin)
            .addScaledVector(carryPointerDelta, CARRY_POINTER_GAIN);
          carryGoal.y = carryTipHeight;
          softenMovementPosition(carryGoal);
        }
        setCursorMode(carryingFromHeadTip ? 'tip-active' : 'active');
        event.preventDefault();
        return;
      }
      if (pressingHead && event.pointerId === pressedPointerId) {
        const headHit = getHeadHit();
        if (headHit) {
          const rubDistance = Math.min(32, Math.hypot(
            event.clientX - headRubLastX,
            event.clientY - headRubLastY,
          ));
          headRubTravel += rubDistance;
          headRubActivity = clamp(
            headRubActivity + rubDistance / 42,
            0,
            1,
          );
          updateAffectionContact(headHit);
          aimPressAtHit(headHit);
        }
        headRubLastX = event.clientX;
        headRubLastY = event.clientY;
        return;
      }
      const antennaIsHit = Boolean(
        pickupHitProxy
        && raycaster.intersectObject(pickupHitProxy, false).length > 0
      );
      const bodyIsHit = Boolean(
        colorModeRef.current
        && bodyMeshes.length > 0
        && raycaster.intersectObjects(bodyMeshes, false).length > 0
      );
      setCursorMode(
        antennaIsHit
          ? 'tip'
          : bodyIsHit || getHeadHit() ? 'hover' : 'idle',
      );
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', releaseInteraction);
    renderer.domElement.addEventListener('pointercancel', releaseInteraction);

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditableTarget = Boolean(
        target?.closest('input, select, textarea, [contenteditable="true"]'),
      );
      if (event.code === 'Space') {
        if (event.repeat || isEditableTarget) return;
        event.preventDefault();
        event.stopPropagation();
        captureScene();
        return;
      }
      if (target?.closest('a, button, input, select, textarea, [contenteditable="true"]')) {
        return;
      }
      if (event.code === 'KeyD' && !event.repeat) {
        event.preventDefault();
        const nextDebugVisible = !debugVisibleRef.current;
        debugVisibleRef.current = nextDebugVisible;
        setDebugVisible(nextDebugVisible);
        performanceWindowStart = performance.now();
        performanceFrameCount = 0;
        return;
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code !== 'Space') return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, select, textarea, [contenteditable="true"]')) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
    };
    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('keyup', onKeyUp, true);

    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      const aspect = width / height;
      const pixelRatio = Math.min(
        window.devicePixelRatio,
        aspect < 0.8 ? 1.4 : 1.75,
      );
      renderer.setPixelRatio(pixelRatio);
      affectionParticleMaterial.uniforms.uPixelRatio.value = pixelRatio;
      renderer.setSize(width, height, false);
      camera.aspect = aspect;
      camera.fov = aspect < 0.8 ? 42 : 36;
      if (colorModeRef.current) {
        cameraZoomTarget = COLOR_MODE_ZOOM;
        cameraPositionTarget.set(
          0,
          aspect < 0.8 ? 10 : 7.8,
          aspect < 0.8 ? 6.1 : 4.85,
        );
        cameraLookGoal.set(0, 0.02, -0.08);
      } else {
        cameraZoomTarget = SCENE_ZOOM[sceneSizeRef.current];
        cameraPositionTarget.set(
          0,
          aspect < 0.8 ? 4.55 : 3.8,
          aspect < 0.8 ? 8.7 : 7.2,
        );
        cameraLookGoal.set(0, aspect < 0.8 ? 0.9 : 0.78, -0.3);
      }
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    applySceneSizeRef.current = resize;
    resize();

    const loader = new GLTFLoader();
    loader.load(
      '/models/hoptimist.glb',
      (gltf) => {
        if (disposed) {
          disposeObject(gltf.scene);
          return;
        }

        model = gltf.scene;
        model.name = 'hoptimist-model';
        characterRoot.add(model);

        const oldMaterials = new Set<THREE.Material>();
        bodyMeshes = [];
        model.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return;
          bodyMeshes.push(object);
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => oldMaterials.add(material));
          object.material = metallicMaterial;
          object.castShadow = false;
          object.receiveShadow = false;
        });
        oldMaterials.forEach((material) => material.dispose());

        model.updateMatrixWorld(true);
        const bounds = new THREE.Box3().setFromObject(model);
        const size = bounds.getSize(new THREE.Vector3());
        const modelScale = 2.25 / Math.max(size.y, 0.001);
        model.scale.setScalar(modelScale);
        model.updateMatrixWorld(true);

        bounds.setFromObject(model);
        const center = bounds.getCenter(new THREE.Vector3());
        model.position.x -= center.x;
        model.position.z -= center.z;
        model.position.y -= bounds.min.y;
        model.updateMatrixWorld(true);

        bounds.setFromObject(model);
        const runtimeSize = bounds.getSize(new THREE.Vector3());
        const runtimeCenter = bounds.getCenter(new THREE.Vector3());
        modelHeight = runtimeSize.y;
        movementBodyRadius = Math.max(runtimeSize.x, runtimeSize.z) * 0.52;
        colorPoolRadius = modelHeight * 2.9;
        movementBoundaryRadiusVisual = getMovementBoundaryTargetRadius();
        movementBoundary.scale.setScalar(movementBoundaryRadiusVisual);
        colorPool.scale.setScalar(colorPoolRadius * 2);
        blobShadow.scale.set(modelHeight * 0.82, modelHeight * 0.44, 1);
        hopDistance = modelHeight * HOP_DISTANCE_IN_HEIGHTS;
        hopPower = Math.sqrt(2 * GRAVITY * modelHeight * HOP_APEX_IN_HEIGHTS);
        hopFlightTime = (hopPower * 2) / GRAVITY;
        carryTipHeight = modelHeight * (1 + CARRY_CLEARANCE_IN_HEIGHTS);

        const touchProxyMaterial = new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: 0,
          depthWrite: false,
          colorWrite: false,
        });
        touchHitProxy = new THREE.Mesh(
          new THREE.BoxGeometry(
            runtimeSize.x * 1.45,
            runtimeSize.y * 1.18,
            runtimeSize.z * 1.45,
          ),
          touchProxyMaterial,
        );
        touchHitProxy.name = 'mobile-body-touch-target';
        touchHitProxy.position.copy(runtimeCenter);
        scene.add(touchHitProxy);
        characterRoot.attach(touchHitProxy);

        springRoot = model.getObjectByName('spring_root') as THREE.Bone | null;
        springOne = model.getObjectByName('spring_1') as THREE.Bone | null;
        springTwo = model.getObjectByName('spring_2') as THREE.Bone | null;
        springTip = model.getObjectByName('spring_tip') as THREE.Bone | null;
        const coil = model.getObjectByName('coil');
        const skinnedFeet = model.getObjectByName('feet');
        const head = model.getObjectByName('head');

        if (
          !springRoot
          || !springOne
          || !springTwo
          || !springTip
          || !head
          || !(coil instanceof THREE.SkinnedMesh)
          || !(skinnedFeet instanceof THREE.SkinnedMesh)
          || !skinnedFeet.parent
        ) {
          setSceneStatus(HOP_CONTENT.status.incompleteRig);
          setLoading(false);
          return;
        }

        const coilRootBoneIndex = coil.skeleton.bones.findIndex(
          (bone) => bone.name === 'spring_root',
        );
        const coilPositions = coil.geometry.getAttribute('position');
        const coilSkinIndices = coil.geometry.getAttribute('skinIndex');
        const coilSkinWeights = coil.geometry.getAttribute('skinWeight');
        if (
          coilRootBoneIndex >= 0
          && coilPositions
          && coilSkinIndices
          && coilSkinWeights
        ) {
          let coilMinY = Infinity;
          let coilMaxY = -Infinity;
          for (let index = 0; index < coilPositions.count; index += 1) {
            const y = coilPositions.getY(index);
            coilMinY = Math.min(coilMinY, y);
            coilMaxY = Math.max(coilMaxY, y);
          }
          const coilHeight = Math.max(0.000001, coilMaxY - coilMinY);
          for (let index = 0; index < coilPositions.count; index += 1) {
            const normalizedHeight = (
              coilPositions.getY(index) - coilMinY
            ) / coilHeight;
            const pinAmount = 1 - THREE.MathUtils.smoothstep(
              normalizedHeight,
              0.025,
              0.22,
            );
            if (pinAmount <= 0.0001) continue;

            const joints = [
              coilSkinIndices.getX(index),
              coilSkinIndices.getY(index),
              coilSkinIndices.getZ(index),
              coilSkinIndices.getW(index),
            ];
            const weights = [
              coilSkinWeights.getX(index),
              coilSkinWeights.getY(index),
              coilSkinWeights.getZ(index),
              coilSkinWeights.getW(index),
            ];
            let rootSlot = joints.indexOf(coilRootBoneIndex);
            if (rootSlot < 0) {
              rootSlot = weights.indexOf(Math.min(...weights));
              joints[rootSlot] = coilRootBoneIndex;
            }
            const retainedAmount = 1 - pinAmount;
            for (let slot = 0; slot < 4; slot += 1) {
              weights[slot] *= retainedAmount;
            }
            weights[rootSlot] += pinAmount;
            const weightTotal = Math.max(
              0.000001,
              weights[0] + weights[1] + weights[2] + weights[3],
            );
            for (let slot = 0; slot < 4; slot += 1) {
              weights[slot] /= weightTotal;
            }
            coilSkinIndices.setXYZW(
              index,
              joints[0],
              joints[1],
              joints[2],
              joints[3],
            );
            coilSkinWeights.setXYZW(
              index,
              weights[0],
              weights[1],
              weights[2],
              weights[3],
            );
          }
          coilSkinIndices.needsUpdate = true;
          coilSkinWeights.needsUpdate = true;
        }

        // The imported feet are rigid (every vertex is weighted 100% to
        // spring_root), so render an unskinned copy under its own world-up
        // pivot. This prevents root-bone motion from canceling their yaw.
        skinnedFeet.skeleton.update();
        const rootBoneIndex = skinnedFeet.skeleton.bones.findIndex(
          (bone) => bone.name === 'spring_root',
        );
        if (rootBoneIndex < 0) {
          setSceneStatus(HOP_CONTENT.status.incompleteRig);
          setLoading(false);
          return;
        }
        const rootBoneMatrix = new THREE.Matrix4().fromArray(
          skinnedFeet.skeleton.boneMatrices,
          rootBoneIndex * 16,
        );
        const rigidFeetSkinMatrix = new THREE.Matrix4()
          .copy(skinnedFeet.bindMatrixInverse)
          .multiply(rootBoneMatrix)
          .multiply(skinnedFeet.bindMatrix);
        const rigidFeetGeometry = skinnedFeet.geometry
          .clone()
          .applyMatrix4(rigidFeetSkinMatrix);
        const rigidFeet = new THREE.Mesh(rigidFeetGeometry, metallicMaterial);
        rigidFeet.name = 'feet_runtime_rigid';
        rigidFeet.position.copy(skinnedFeet.position);
        rigidFeet.quaternion.copy(skinnedFeet.quaternion);
        rigidFeet.scale.copy(skinnedFeet.scale);
        rigidFeet.renderOrder = skinnedFeet.renderOrder;
        rigidFeet.castShadow = false;
        rigidFeet.receiveShadow = false;
        skinnedFeet.parent.add(rigidFeet);
        skinnedFeet.visible = false;

        feetPivot = new THREE.Group();
        feetPivot.name = 'feet_runtime_pivot';
        characterRoot.updateMatrixWorld(true);
        springRoot.getWorldPosition(feetPivotWorldPosition);
        characterRoot.worldToLocal(feetPivotWorldPosition);
        feetPivot.position.copy(feetPivotWorldPosition);
        characterRoot.add(feetPivot);
        feetPivot.attach(rigidFeet);
        characterRoot.updateMatrixWorld(true);
        feetPivot.getWorldQuaternion(feetPivotWorldQuaternion);
        springRoot.getWorldQuaternion(springRootWorldQuaternion);
        springRootFromFeetQuaternion
          .copy(feetPivotWorldQuaternion)
          .invert()
          .multiply(springRootWorldQuaternion);
        springBaseBindingReady = true;
        bodyMeshes = bodyMeshes.filter((object) => object !== skinnedFeet);
        bodyMeshes.push(rigidFeet);
        carryChainBones = [springOne, springTwo, springTip];

        restPoses = new Map();
        carryChainBones.forEach((bone) => {
          restPoses.set(bone, {
            position: bone.position.clone(),
            quaternion: bone.quaternion.clone(),
            scale: bone.scale.clone(),
          });
        });

        headMeshes = [];
        head.traverse((object) => {
          if (object instanceof THREE.Mesh) headMeshes.push(object);
        });
        if (head instanceof THREE.Mesh) headMeshes.push(head);

        const headBounds = new THREE.Box3().setFromObject(head);
        const headSize = headBounds.getSize(new THREE.Vector3());
        const headCenter = headBounds.getCenter(new THREE.Vector3());
        headCenterInSpringTip.copy(springTip.worldToLocal(headCenter.clone()));
        const eyeY = headBounds.min.y + headSize.y * 0.48;
        const eyeOffsetX = headSize.x * 0.225;
        const eyeCardSize = headSize.x * 0.09;
        const eyeGeometry = new THREE.PlaneGeometry(2, 2);
        const placementRaycaster = new THREE.Raycaster();
        const eyeForward = new THREE.Vector3(0, 0, 1);

        eyeMeshes = [-1, 1].flatMap((side) => {
          const origin = new THREE.Vector3(
            headCenter.x + eyeOffsetX * side,
            eyeY,
            headBounds.max.z + headSize.z,
          );
          placementRaycaster.set(origin, new THREE.Vector3(0, 0, -1));
          const hit = placementRaycaster.intersectObject(head, true)[0];
          if (!hit) return [];

          const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
          const surfaceNormal = hit.face
            ? hit.face.normal.clone().transformDirection(hit.object.matrixWorld)
            : new THREE.Vector3(0, 0, 1);
          eye.name = side < 0 ? 'eye_left' : 'eye_right';
          eye.position.copy(hit.point).addScaledVector(
            surfaceNormal,
            Math.max(0.006, headSize.z * 0.004),
          );
          eye.quaternion.setFromUnitVectors(eyeForward, surfaceNormal);
          eye.scale.setScalar(eyeCardSize);
          eye.castShadow = false;
          eye.receiveShadow = false;
          scene.add(eye);
          eye.updateMatrixWorld(true);
          springTip!.attach(eye);
          return [eye];
        });
        headMeshes.push(...eyeMeshes);
        headMeshes = [...new Set(headMeshes)];

        const antennaMaterial = new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: 0,
          depthWrite: false,
          colorWrite: false,
        });
        antennaHitProxy = new THREE.Mesh(
          new THREE.CylinderGeometry(
            headSize.x * 0.055,
            headSize.x * 0.065,
            headSize.y * 0.16,
            12,
          ),
          antennaMaterial,
        );
        antennaHitProxy.name = 'antenna_grab_anchor';
        antennaHitProxy.position.set(
          headCenter.x,
          headBounds.max.y - headSize.y * 0.06,
          headCenter.z,
        );
        antennaHitProxy.layers.set(1);
        scene.add(antennaHitProxy);
        antennaHitProxy.updateMatrixWorld(true);
        springTip.attach(antennaHitProxy);

        pickupHitProxy = new THREE.Mesh(
          new THREE.CapsuleGeometry(
            headSize.x * 0.105,
            headSize.y * 0.28,
            4,
            12,
          ),
          antennaMaterial,
        );
        pickupHitProxy.name = 'antenna_grab_target';
        pickupHitProxy.position.set(
          headCenter.x,
          headBounds.max.y + headSize.y * 0.12,
          headCenter.z,
        );
        pickupHitProxy.layers.set(1);
        scene.add(pickupHitProxy);
        pickupHitProxy.updateMatrixWorld(true);
        springTip.attach(pickupHitProxy);
        characterRoot.updateMatrixWorld(true);
        antennaHitProxy.getWorldPosition(antennaWorldPosition);
        carryRestLength = Math.max(
          modelHeight * 0.72,
          antennaWorldPosition.distanceTo(characterRoot.position),
        );

        loaded = true;
        setLoading(false);
        setSceneStatus(HOP_CONTENT.status.ready);
      },
      undefined,
      () => {
        if (disposed) return;
        setLoading(false);
        setSceneStatus(HOP_CONTENT.status.loadError);
      },
    );

    const animate = (now: number) => {
      if (disposed) return;
      const frameDelta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      accumulator = Math.min(accumulator + frameDelta, FIXED_STEP * 8);

      while (accumulator >= FIXED_STEP) {
        stepPhysics(FIXED_STEP);
        accumulator -= FIXED_STEP;
      }

      if (colorModeEntryActive) {
        colorModeEntryElapsed += frameDelta;
        const entryAmount = clamp(
          colorModeEntryElapsed / COLOR_MODE_ENTRY_DURATION,
          0,
          1,
        );
        const easedEntryAmount = THREE.MathUtils.smootherstep(
          entryAmount,
          0,
          1,
        );
        characterRoot.position.lerpVectors(
          colorModeEntryFrom,
          colorModeEntryTo,
          easedEntryAmount,
        );
        if (entryAmount >= 1) {
          characterRoot.position.copy(colorModeEntryTo);
          colorModeEntryActive = false;
        }
      }

      const liftAmount = clamp(
        characterRoot.position.y / Math.max(modelHeight * 0.7, 0.001),
        0,
        1,
      );
      const shadowSpread = 1 + liftAmount * 0.22;
      blobShadow.position.x = characterRoot.position.x;
      blobShadow.position.z = characterRoot.position.z;
      blobShadow.scale.set(
        modelHeight * 0.82 * shadowSpread,
        modelHeight * 0.44 * shadowSpread,
        1,
      );
      blobShadowMaterial.opacity = 0.28 * (1 - liftAmount * 0.78);

      const zoomResponse = 1 - Math.exp(-8 * frameDelta);
      camera.zoom += (cameraZoomTarget - camera.zoom) * zoomResponse;
      const cameraMoveResponse = 1 - Math.exp(-5.8 * frameDelta);
      camera.position.lerp(cameraPositionTarget, cameraMoveResponse);
      cameraLookTarget.lerp(cameraLookGoal, cameraMoveResponse);
      camera.lookAt(cameraLookTarget);
      camera.updateProjectionMatrix();

      let paletteHueScrollTarget = 0;
      if (colorModeRef.current && !colorModeEntryActive) {
        const poolX = characterRoot.position.x / colorPoolRadius;
        const poolY = -characterRoot.position.z / colorPoolRadius;
        const poolRadius = clamp(Math.hypot(poolX, poolY), 0, 1);
        const poolAngle = Math.atan2(poolY, poolX);
        const edgeAmount = THREE.MathUtils.smoothstep(poolRadius, 0.56, 0.86);
        if (poolRadius > 0.08) {
          const angleStep = Math.atan2(
            Math.sin(poolAngle - paletteLastPoolAngle),
            Math.cos(poolAngle - paletteLastPoolAngle),
          );
          paletteTravelAngle += angleStep * edgeAmount;
          paletteLastPoolAngle = poolAngle;
        } else {
          paletteLastPoolAngle = poolAngle;
        }
        paletteHueScrollTarget = -paletteTravelAngle * edgeAmount * 0.42;
      } else if (colorModeRef.current) {
        paletteLastPoolAngle = Math.atan2(
          -characterRoot.position.z,
          characterRoot.position.x,
        );
      }
      const paletteScrollAcceleration = (
        (paletteHueScrollTarget - paletteHueScroll) * 32
        - paletteHueScrollVelocity * 11.5
      );
      paletteHueScrollVelocity += paletteScrollAcceleration * frameDelta;
      paletteHueScroll += paletteHueScrollVelocity * frameDelta;
      colorPoolMaterial.uniforms.uHueOffset.value = (
        (paletteBaseHueOffset + paletteHueScroll) / (Math.PI * 2)
      );

      const bloomTarget = colorModeRef.current ? 1 : 0;
      const bloomResponse = 1 - Math.exp(-4.8 * frameDelta);
      colorPoolMaterial.uniforms.uBloom.value += (
        bloomTarget - colorPoolMaterial.uniforms.uBloom.value
      ) * bloomResponse;
      colorPool.visible = colorPoolMaterial.uniforms.uBloom.value > 0.002;
      const boundaryRadiusTarget = getMovementBoundaryTargetRadius();
      movementBoundaryRadiusVisual += (
        boundaryRadiusTarget - movementBoundaryRadiusVisual
      ) * bloomResponse;
      movementBoundary.scale.setScalar(movementBoundaryRadiusVisual);
      movementBoundaryMaterial.opacity = 0.14
        + colorPoolMaterial.uniforms.uBloom.value * 0.05;

      renderer.render(scene, camera);
      if (debugVisibleRef.current) {
        performanceFrameCount += 1;
        const performanceElapsed = now - performanceWindowStart;
        if (performanceElapsed >= 600) {
          setPerformanceStats({
            fps: performanceFrameCount * 1000 / performanceElapsed,
            frameMs: performanceElapsed / performanceFrameCount,
            drawCalls: renderer.info.render.calls,
            triangles: renderer.info.render.triangles,
          });
          performanceWindowStart = now;
          performanceFrameCount = 0;
        }
      } else {
        performanceWindowStart = now;
        performanceFrameCount = 0;
      }
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', releaseInteraction);
      renderer.domElement.removeEventListener('pointercancel', releaseInteraction);
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('keyup', onKeyUp, true);
      window.clearTimeout(photoFeedbackTimer);
      window.clearTimeout(entranceChromeTimer);
      window.clearTimeout(touchHoldTimer);
      applySceneSizeRef.current = null;
      captureSceneRef.current = null;
      dropOnEnterRef.current = null;
      setColorModeRuntimeRef.current = null;
      colorModeRef.current = false;
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
      hopCursor.destroy();
      disposeObject(scene);
      affectionParticleGeometry.dispose();
      affectionParticleMaterial.dispose();
      affectionParticleTexture.dispose();
      movementBoundaryGeometry.dispose();
      movementBoundaryMaterial.dispose();
      shadowTexture.dispose();
      frostTexture.dispose();
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  const handleSceneSize = (nextSize: SceneSize) => {
    if (colorModeRef.current) return;
    sceneSizeRef.current = nextSize;
    setSceneSize(nextSize);
    applySceneSizeRef.current?.();
  };
  const handleColorMode = () => {
    const nextMode = !colorMode;
    colorModeRef.current = nextMode;
    setColorMode(nextMode);
    setColorModeRuntimeRef.current?.(nextMode);
    applySceneSizeRef.current?.();
  };

  return (
    <main className={styles.page}>
      <div ref={mountRef} className={styles.canvasWrap} />
      <HopChrome
        chromeVisible={chromeVisible}
        colorMode={colorMode}
        debugVisible={debugVisible}
        introPhase={introPhase}
        loading={loading}
        performanceStats={performanceStats}
        photoFeedback={photoFeedback}
        sceneSize={sceneSize}
        status={status}
        onCapture={() => captureSceneRef.current?.()}
        onColorMode={handleColorMode}
        onSceneSize={handleSceneSize}
      />
    </main>
  );
}
