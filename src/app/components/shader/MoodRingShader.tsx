'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { starConwayPattern, updateStarConwayDirty, Dirty } from './starConway';

type MoodRingProps = {
  enabled?: boolean;
  onFps?: (fps: number) => void;
};

type HeatSpot = {
  position: THREE.Vector2;
  createdAt: number;
};

const TARGET_FPS = 60;
const FRAME_MS = 1000 / TARGET_FPS;

export default function MoodRingBackground({ enabled = true, onFps }: MoodRingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundRef = useRef<HTMLCanvasElement>(null);

  const heatSpots = useRef<HeatSpot[]>([]);
  const asciiStars = useRef<string[][]>([]);
  const elapsedTimeRef = useRef(0);
  const lastTouchTimeRef = useRef(0);

  // raf and running state
  const rafIdRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const startRef = useRef<null | (() => void)>(null);
  const stopRef = useRef<null | (() => void)>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const background = backgroundRef.current;
    if (!canvas || !background) return;

    const asciiCtx = background.getContext('2d');
    if (!asciiCtx) return;

    const CELL_W = 10;
    const CELL_H = 14;

    let cols = 0;
    let rows = 0;
    let dpr = 1;
    let lastAsciiStep = 0;

    let fpsFrames = 0;
    let fpsLast = 0;

    // preload font
    const ensureFont = (async () => {
      try {
        await document.fonts.load('16px "Star Glyphs"');
        await document.fonts.ready;
      } catch {}
    })();

    const drawAll = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      asciiCtx.clearRect(0, 0, width, height);

      const g = asciiStars.current;
      for (let y = 0; y < g.length; y++) {
        const row = g[y];
        const py = (y + 1) * CELL_H;
        for (let x = 0; x < row.length; x++) {
          const ch = row[x];
          if (ch !== ' ') asciiCtx.fillText(ch, x * CELL_W, py);
        }
      }
    };

    const drawDirty = (dirty: Dirty[]) => {
      for (let i = 0; i < dirty.length; i++) {
        const d = dirty[i];
        const px = d.x * CELL_W;
        const py = (d.y + 1) * CELL_H;

        asciiCtx.clearRect(px, py - CELL_H, CELL_W, CELL_H + 3);
        if (d.ch !== ' ') asciiCtx.fillText(d.ch, px, py);
      }
    };

    const resizeAscii = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      background.width = Math.floor(width * dpr);
      background.height = Math.floor(height * dpr);
      background.style.width = `${width}px`;
      background.style.height = `${height}px`;

      asciiCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.max(1, Math.floor(width / CELL_W));
      rows = Math.max(1, Math.floor(height / CELL_H));

      asciiStars.current = starConwayPattern(cols, rows);

      asciiCtx.font = '10px "Star Glyphs", Newsreader, serif';
      asciiCtx.fillStyle = 'rgba(68, 32, 150, 0.5)';
    };

    // initialize three
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const maxSpots = 50;
    const spotsArray = Array.from({ length: maxSpots }, () => new THREE.Vector3(0, 0, -999));

    const loader = new THREE.TextureLoader();
    const paperTex = loader.load(
      '/textures/clean-gray-paper.png',
      (tex) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.colorSpace = THREE.NoColorSpace;
        tex.needsUpdate = true;
      },
      undefined,
      () => {}
    );

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
      uSpots: { value: spotsArray },
      uSpotCount: { value: 0 },
      uPaperTex: { value: paperTex },
      uTexStrength: { value: 1.0 },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;

        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec3 uSpots[50];
        uniform int uSpotCount;
        uniform sampler2D uPaperTex;
        uniform float uTexStrength;

        float heatFalloff(vec2 uv, vec2 center, float age) {
          float radius = 0.02 + age * 0.05;
          float dist = distance(uv, center);
          float d = dist / radius;
          float softness = smoothstep(1.0, 0.0, d);
          float peak = clamp(age, 0.0, 1.0);
          float decay = peak * exp(-age * 0.6) * 0.6;
          return softness * decay;
        }

        vec3 moodPalette(float t) {
          vec3 galaxy  = vec3(0.48, 0.34, 0.60);
          vec3 ember   = vec3(0.94, 0.52, 0.28);
          vec3 sea     = vec3(0.36, 0.70, 0.64);

          if (t < 0.70) {
            float f = smoothstep(0.0, 0.70, t);
            return mix(galaxy, ember, f);
          } else if (t < 0.85) {
            float f = smoothstep(0.70, 0.85, t);
            return mix(ember, sea, f);
          } else {
            float f = smoothstep(0.85, 1.0, t);
            return mix(sea, ember, f * 0.85);
          }
        }

        void main() {
          vec2 uv = vUv;
          vec2 acUv = vec2(vUv.x, (vUv.y - 0.5) * (uResolution.y / uResolution.x) + 0.5);

          float heat = 0.0;
          for (int i = 0; i < 50; i++) {
            if (i >= uSpotCount) break;
            vec3 spot = uSpots[i];
            heat += heatFalloff(acUv, spot.xy, uTime - spot.z);
          }

          heat = clamp(heat, 0.0, 1.0);

          vec3 base = vec3(1.0);
          vec3 glow = moodPalette(heat);
          vec3 color = mix(base, glow, smoothstep(0.0, 0.65, heat));

          float a = 1.0 - smoothstep(0.0, 1.0, heat);
          vec2 paperUv = uv * uResolution.xy / 256.0;

          float paperAlpha = texture2D(uPaperTex, paperUv).r + 0.1;
          a *= mix(0.0, 1.0, paperAlpha) * uTexStrength;

          gl_FragColor = vec4(color, a);
        }
      `,
      transparent: true,
      depthWrite: false,
    });

    renderer.setClearColor(0x000000, 0);
    scene.add(new THREE.Mesh(geometry, material));

    const onResize = async () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      await ensureFont;
      resizeAscii();
      drawAll();

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width, height);
    };

    const handleTouch = (clientX: number, clientY: number) => {
      const now = elapsedTimeRef.current;
      if (now - lastTouchTimeRef.current < 0.05) return;
      lastTouchTimeRef.current = now;

      const x = clientX / window.innerWidth;
      const y = 1 - clientY / window.innerHeight;
      const stretchedY = (y - 0.5) * (window.innerHeight / window.innerWidth) + 0.5;

      heatSpots.current.push({ position: new THREE.Vector2(x, stretchedY), createdAt: now });
      if (heatSpots.current.length > maxSpots) heatSpots.current.shift();
    };

    const onPointerMove = (e: PointerEvent) => enabled && handleTouch(e.clientX, e.clientY);
    const onPointerDown = (e: PointerEvent) => enabled && handleTouch(e.clientX, e.clientY);
    const onTouchStart = (e: TouchEvent) => {
      if (!enabled) return;
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        handleTouch(touch.clientX, touch.clientY);
      }
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('touchstart', onTouchStart, { passive: true });

    onResize();

    let startTime = 0;
    let lastRender = 0

    const animate = (t: number) => {
      if (!runningRef.current) return;
      if (startTime === 0) startTime = t;
      if (t - lastRender < FRAME_MS) {
        rafIdRef.current = requestAnimationFrame(animate);
        return;
      }
      lastRender = t;

      fpsFrames++;
      if (!fpsLast) fpsLast = t;
      if (t - fpsLast >= 500) {
        const fps = (fpsFrames * 1000) / (t - fpsLast);
        onFps?.(fps);
        fpsFrames = 0;
        fpsLast = t;
      }

      const now = (t - startTime) * 0.001;
      elapsedTimeRef.current = now;
      uniforms.uTime.value = now;

      const src = heatSpots.current;
      let k = 0;
      for (let i = 0; i < src.length; i++) {
        const s = src[i];
        if (now - s.createdAt < 10) src[k++] = s;
      }
      src.length = k;

      uniforms.uSpotCount.value = src.length;
      for (let i = 0; i < maxSpots; i++) {
        if (i < src.length) {
          const s = src[i];
          spotsArray[i].set(s.position.x, s.position.y, s.createdAt);
        } else {
          spotsArray[i].set(0, 0, -999);
        }
      }

      if (now - lastAsciiStep > 0.12) {
        lastAsciiStep = now;
        const res = updateStarConwayDirty(asciiStars.current);
        asciiStars.current = res.grid;
        drawDirty(res.dirty);
      }

      renderer.render(scene, camera);
      rafIdRef.current = requestAnimationFrame(animate);
    };

    const clearSpotsArray = () => {
      for (let i = 0; i < maxSpots; i++) spotsArray[i].set(0, 0, -999);
      uniforms.uSpotCount.value = 0;
    };

    // start/stop handlers
    const start = () => {
      // reset state
      heatSpots.current = [];
      clearSpotsArray();
      asciiStars.current = [];
      elapsedTimeRef.current = 0;
      lastTouchTimeRef.current = 0;
      lastAsciiStep = 0;
      fpsFrames = 0;
      fpsLast = 0;
      startTime = 0;

      runningRef.current = true;
      rafIdRef.current = requestAnimationFrame(animate);
    };

    const stop = () => {
      runningRef.current = false;
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
      //reset one more time for safety
      heatSpots.current = [];
      clearSpotsArray();
      asciiStars.current = [];
      elapsedTimeRef.current = 0;
      lastTouchTimeRef.current = 0;
      lastAsciiStep = 0;
      fpsFrames = 0;
      fpsLast = 0;
      startTime = 0;
      // clear canvas on off
      const w = window.innerWidth, h = window.innerHeight;
      asciiCtx.clearRect(0, 0, w, h);
      renderer.clear();
    };

    startRef.current = start;
    stopRef.current = stop;

    // initial start
    if (enabled) start();

    return () => {
      stop();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('touchstart', onTouchStart as any);

      renderer.dispose();
      paperTex.dispose();
      material.dispose();
      geometry.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // toggle run state
  useEffect(() => {
    if (enabled) startRef.current?.();
    else stopRef.current?.();
  }, [enabled]);

  return (
    <>
      <canvas
        ref={backgroundRef}
        className="fixed top-0 left-0 w-full h-full z-[-2] pointer-events-none"
        style={{ opacity: enabled ? 1 : 0, transition: 'opacity 140ms ease' }}
      />
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-[-1] pointer-events-none"
        style={{ opacity: enabled ? 1 : 0, transition: 'opacity 140ms ease' }}
      />
    </>
  );
}
