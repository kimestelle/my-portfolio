'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { starConwayPattern, updateStarConwayDirty, Dirty } from './starConway';

type MoodRingProps = {
  enabled?: boolean;
  onFps?: (fps: number) => void;
  playgroundTransition?: 'idle' | 'out' | 'reveal';
  onTransitionCovered?: () => void;
};

type HeatSpot = {
  position: THREE.Vector2;
  createdAt: number;
};

const TARGET_FPS = 60;
const FRAME_MS = 1000 / TARGET_FPS;

// Star field (Conway cell automata over the ascii layer) is disabled for now.
// Flip to true to bring it back — the code below is gated on this, not removed.
const STARS_ENABLED = false;

// The blob is a low-frequency gradient, so the WebGL canvas renders at a
// fraction of CSS resolution and the browser's linear upscale hides it.
// uResolution stays in reference (CSS × dpr) units so sizes don't change.
// 0.5 is the floor: a fresh spot is ~14px radius, and below half res its
// falloff spans so few texels that the upscale reads as pixelated.
const BLOB_RESOLUTION_SCALE = 0.5;

export default function MoodRingBackground({ enabled = true, onFps, playgroundTransition = 'idle', onTransitionCovered }: MoodRingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundRef = useRef<HTMLCanvasElement>(null);
  const viewportRef = useRef({ w: 0, h: 0 });
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;


  const heatSpots = useRef<HeatSpot[]>([]);
  const asciiStars = useRef<string[][]>([]);
  const elapsedTimeRef = useRef(0);
  const lastTouchTimeRef = useRef(0);

  // raf and running state
  const rafIdRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const startRef = useRef<null | (() => void)>(null);
  const stopRef = useRef<null | (() => void)>(null);
  const beginTransitionRef = useRef<null | (() => void)>(null);
  const transitionCoveredRef = useRef(onTransitionCovered);

  useEffect(() => {
    transitionCoveredRef.current = onTransitionCovered;
  }, [onTransitionCovered]);

  useEffect(() => {
    const v = window.visualViewport;
    viewportRef.current = v
      ? { w: Math.round(v.width), h: Math.round(v.height) }
      : { w: window.innerWidth, h: window.innerHeight };

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

    const drawAll = (width: number, height:number) => {
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

    const resizeAscii = (width: number, height: number) => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);      

      background.width = Math.floor(width * dpr);
      background.height = Math.floor(height * dpr);
      background.style.width = `${width}px`;
      background.style.height = `${height}px`;

      asciiCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.max(1, Math.floor(width / CELL_W));
      rows = Math.max(1, Math.floor(height / CELL_H));

      if (STARS_ENABLED) {
        asciiStars.current = starConwayPattern(cols, rows);
      } else {
        asciiStars.current = [];
        asciiCtx.clearRect(0, 0, width, height);
      }

      asciiCtx.font = '10px "Star Glyphs", Newsreader, serif';
      asciiCtx.fillStyle = 'rgba(68, 32, 150, 1)';
    };

    // initialize three
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const maxSpots = 50;
    const spotsArray = Array.from({ length: maxSpots }, () => new THREE.Vector3(0, 0, -999));

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
      uSpots: { value: spotsArray },
      uSpotCount: { value: 0 },
      uTransition: { value: 0 },
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
        uniform float uTransition;

        float pxToUv(float px) {
          // normalizing scale for different screen sizes and DPR
          return px / min(uResolution.x, uResolution.y);
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
          float transitionField = 0.0;
          float acceleratedGrowth = pow(uTransition, 2.35) * 2.15;
          float lateWeight = smoothstep(0.62, 1.0, uTransition);
          for (int i = 0; i < 50; i++) {
            if (i >= uSpotCount) break;
            vec3 spot = uSpots[i];
            float age = max(0.0, uTime - spot.z);
            float originalRadius = pxToUv(14.0) + age * pxToUv(60.0);
            float dist = distance(acUv, spot.xy);
            float peak = clamp(age, 0.0, 1.0);
            float decay = peak * exp(-age * 0.6) * 0.6;

            /* Both views come from the same weighted metaball. Young trail
               samples therefore cannot appear as independent white dots. */
            heat += smoothstep(1.0, 0.0, dist / originalRadius) * decay;
            float transitionWeight = mix(decay, max(decay, 0.28), lateWeight);
            transitionField += smoothstep(1.0, 0.0, dist / (originalRadius + acceleratedGrowth)) * transitionWeight;
          }

          heat = clamp(heat, 0.0, 1.0);

          vec3 base = vec3(1.0);
          vec3 glow = moodPalette(heat);
          vec3 color = mix(base, glow, smoothstep(0.0, 0.65, heat));

          float t = smoothstep(0.0, 1.0, heat);
          float a = 1.0 - pow(t, 2.5);

          float coverage = uSpotCount == 0
            ? smoothstep(0.0, 1.0, uTransition)
            : smoothstep(0.02, 0.28, transitionField) * smoothstep(0.0, 0.18, uTransition);
          gl_FragColor = vec4(mix(color, vec3(1.0), coverage), mix(a, 1.0, coverage));
        }
      `,
      transparent: true,
      depthWrite: false,
    });

    renderer.setClearColor(0x000000, 0);
    scene.add(new THREE.Mesh(geometry, material));

    const onResize = async (w: number, h: number) => {
      await ensureFont;
      viewportRef.current.w = w;
      viewportRef.current.h = h;
      
      resizeAscii(w, h);
      if (STARS_ENABLED) drawAll(w, h);

      renderer.setPixelRatio(1);
      renderer.setSize(
        Math.max(1, Math.round(w * BLOB_RESOLUTION_SCALE)),
        Math.max(1, Math.round(h * BLOB_RESOLUTION_SCALE)),
        false
      );

      const refDpr = Math.min(window.devicePixelRatio || 1, 1.5);
      uniforms.uResolution.value.set(w * refDpr, h * refDpr);
    };

    const handleTouch = (clientX: number, clientY: number) => {
      const now = elapsedTimeRef.current;
      if (now - lastTouchTimeRef.current < 0.05) return;
      lastTouchTimeRef.current = now;

      const x = clientX / viewportRef.current.w;
      const y = 1 - clientY / viewportRef.current.h;
      const stretchedY = (y - 0.5) * (viewportRef.current.h / viewportRef.current.w) + 0.5;

      heatSpots.current.push({ position: new THREE.Vector2(x, stretchedY), createdAt: now });
      if (heatSpots.current.length > maxSpots) heatSpots.current.shift();
    };

    const onPointerMove = (e: PointerEvent) => enabledRef.current && handleTouch(e.clientX, e.clientY);
    const onPointerDown = (e: PointerEvent) => enabledRef.current && handleTouch(e.clientX, e.clientY);
    const onTouchStart = (e: TouchEvent) => {
      if (!enabledRef.current) return;
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        handleTouch(touch.clientX, touch.clientY);
      }
    };

    const getViewport = () => {
      const vv = window.visualViewport;
      if (vv) return { w: Math.round(vv.width), h: Math.round(vv.height) };
      return { w: window.innerWidth, h: window.innerHeight };
    };

    // 
    let resizeT: number | null = null;
    const handleResize = () => {
      if (resizeT) clearTimeout(resizeT);
      resizeT = window.setTimeout(() => {
        const { w, h } = getViewport();
        onResize(w, h);
      }, 120);
    };

    window.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("resize", handleResize);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('touchstart', onTouchStart, { passive: true });

    onResize(viewportRef.current.w, viewportRef.current.h);

    let startTime = 0;
    let lastRender = 0
    let lastNow = 0;
    let conwayAcc = 0;
    const CONWAY_STEP = 0.12;
    let transitionActive = false;
    // True while the last rendered frame had visible blob pixels; lets us
    // draw one clearing frame after the spots expire, then stop rendering.
    let blobWasVisible = true;
    let transitionStart = 0;
    let frozenShaderTime = 0;
    let coveredSent = false;
    let killOrder: Array<{ x: number; y: number; noise: number }> = [];
    let killedCount = 0;

    const noise2d = (x: number, y: number) => {
      const broad = Math.sin(x * 0.071 + Math.sin(y * 0.053) * 2.4) * 0.5 + 0.5;
      const grain = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      return broad * 0.68 + (grain - Math.floor(grain)) * 0.32;
    };

    const animate = (t: number) => {
      if (!runningRef.current) return;
      if (startTime === 0) startTime = t;
      // Cap at ~60. The 1ms tolerance matters: on 120Hz displays the tick at
      // +16.67ms often lands at ~16.6ms due to timer jitter, and skipping it
      // pushes the render to +25ms — a hard 40fps artifact, not GPU load.
      if (t - lastRender < FRAME_MS - 1) {
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
      uniforms.uTime.value = transitionActive ? frozenShaderTime : now;

      const dt = lastNow === 0 ? 0 : (now - lastNow);
      lastNow = now;
      conwayAcc += dt;

      const src = heatSpots.current;
      if (!transitionActive) {
        let k = 0;
        for (let i = 0; i < src.length; i++) {
          const s = src[i];
          if (now - s.createdAt < 10) src[k++] = s;
        }
        src.length = k;
      }

      uniforms.uSpotCount.value = src.length;
      for (let i = 0; i < maxSpots; i++) {
        if (i < src.length) {
          const s = src[i];
          spotsArray[i].set(s.position.x, s.position.y, s.createdAt);
        } else {
          spotsArray[i].set(0, 0, -999);
        }
      }

      if (transitionActive) {
        const transitionElapsed = t - transitionStart;
        const EXPAND_MS = 1120;
        const CELL_FADE_MS = 360;
        const progress = Math.min(1, transitionElapsed / EXPAND_MS);
        uniforms.uTransition.value = progress;

        // Hold the substrate still until the white material closes. Killing it
        // through open pockets made the wipe read as flickering/spotty.
        const killProgress = Math.max(0, Math.min(1, (transitionElapsed - EXPAND_MS) / CELL_FADE_MS));
        const targetKilled = Math.floor(killOrder.length * killProgress);
        if (targetKilled > killedCount) {
          const dirty: Dirty[] = [];
          for (let i = killedCount; i < targetKilled; i++) {
            const cell = killOrder[i];
            if (asciiStars.current[cell.y]?.[cell.x] !== ' ') {
              asciiStars.current[cell.y][cell.x] = ' ';
              dirty.push({ x: cell.x, y: cell.y, ch: ' ' });
            }
          }
          drawDirty(dirty);
          killedCount = targetKilled;
        }
        if (progress === 1 && killProgress === 1 && !coveredSent) {
          coveredSent = true;
          transitionCoveredRef.current?.();
        }
      } else if (STARS_ENABLED) {
        const MAX_STEPS_PER_FRAME = 4;
        let steps = 0;
        while (conwayAcc >= CONWAY_STEP && steps < MAX_STEPS_PER_FRAME) {
          conwayAcc -= CONWAY_STEP;
          const res = updateStarConwayDirty(asciiStars.current);
          asciiStars.current = res.grid;
          drawDirty(res.dirty);
          steps++;
        }
      }

      // Nothing on this canvas but the blob: with no spots and no transition
      // it is fully transparent, so skip the GPU pass entirely while idle.
      const blobVisible = src.length > 0 || transitionActive || uniforms.uTransition.value > 0;
      if (blobVisible || blobWasVisible) {
        renderer.render(scene, camera);
      }
      blobWasVisible = blobVisible;

      rafIdRef.current = requestAnimationFrame(animate);
    };

    const clearSpotsArray = () => {
      for (let i = 0; i < maxSpots; i++) spotsArray[i].set(0, 0, -999);
      uniforms.uSpotCount.value = 0;
    };

    // start/stop handlers
    const start = () => {
      // Layout effects can converge in the same commit after a route change;
      // one simulation loop is enough regardless of how many request a start.
      if (runningRef.current) return;
      heatSpots.current = [];
      clearSpotsArray();

      elapsedTimeRef.current = 0;
      lastTouchTimeRef.current = 0;
      fpsFrames = 0;
      fpsLast = 0;
      startTime = 0;
      lastNow = 0;
      conwayAcc = 0;
      transitionActive = false;
      uniforms.uTransition.value = 0;

      // ensure grid exists + draw immediately
      if (STARS_ENABLED && cols > 0 && rows > 0) {
        asciiStars.current = starConwayPattern(cols, rows);
        drawAll(viewportRef.current.w, viewportRef.current.h);
      }

      // render one frame immediately
      uniforms.uTime.value = 0;
      renderer.render(scene, camera);
      blobWasVisible = true;

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
    };

    startRef.current = start;
    stopRef.current = stop;
    beginTransitionRef.current = () => {
      // The pathname changes one render before the reveal phase does. Treat a
      // repeated request during that handoff as the same physical event.
      if (transitionActive) return;
      if (!runningRef.current) start();
      transitionActive = true;
      transitionStart = performance.now();
      frozenShaderTime = elapsedTimeRef.current;
      coveredSent = false;
      killedCount = 0;
      killOrder = [];
      const grid = asciiStars.current;
      // starConway keeps a larger simulation field, but only this viewport can
      // be drawn. Sorting invisible cells caused a needless transition hitch.
      const visibleRows = Math.min(rows, grid.length);
      for (let y = 0; y < visibleRows; y++) {
        const visibleCols = Math.min(cols, grid[y]?.length ?? 0);
        for (let x = 0; x < visibleCols; x++) {
          if (grid[y][x] !== ' ') killOrder.push({ x, y, noise: noise2d(x, y) });
        }
      }
      killOrder.sort((a, b) => a.noise - b.noise);
    };

    // initial start
    if (enabled) start();

    return () => {
      stop();
      if (resizeT) clearTimeout(resizeT);
      window.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('touchstart', onTouchStart as any);

      renderer.dispose();
      material.dispose();
      geometry.dispose();
      beginTransitionRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // toggle run state
  useEffect(() => {
    if (playgroundTransition === 'out') {
      // The playground exit is now a short CSS fade. Avoid doing the old cell
      // expansion/sort on click, which delayed the navbar and route change.
      stopRef.current?.();
      return;
    }
    if (enabled) startRef.current?.();
    else if (playgroundTransition === 'idle') stopRef.current?.();
  }, [enabled, playgroundTransition]);

  const transitionVisible = playgroundTransition === 'out' || playgroundTransition === 'reveal';

  return (
    <>
      <div className='bg-grid fixed top-0 left-0 w-full h-full z-[-2] pointer-events-none'/>
      <div
        className={`fixed inset-0 bg-white pointer-events-none ${transitionVisible ? 'z-[48]' : 'z-[-4]'}`}
        style={{
          opacity: playgroundTransition === 'out' ? 1 : 0,
          transition: playgroundTransition === 'out'
            ? 'opacity 180ms ease-out'
            : playgroundTransition === 'reveal'
              ? 'opacity 700ms cubic-bezier(.22,.7,.25,1)'
              : 'opacity 140ms ease',
        }}
        aria-hidden="true"
      />
      <canvas
        ref={backgroundRef}
        className={`fixed top-0 left-0 w-full h-full pointer-events-none ${transitionVisible ? 'z-[49]' : 'z-[-3]'}`}
        style={{
          opacity: enabled && playgroundTransition === 'idle' ? 1 : 0,
          transition: playgroundTransition === 'out'
            ? 'opacity 160ms ease-out'
            : playgroundTransition === 'reveal'
              ? 'none'
              : 'opacity 140ms ease',
        }}
      />
      <canvas
        ref={canvasRef}
        className={`fixed top-0 left-0 w-full h-full pointer-events-none ${transitionVisible ? 'z-[50]' : 'z-[-1]'}`}
        style={{ 
          opacity: playgroundTransition === 'reveal' ? 0 : (enabled || playgroundTransition === 'out' ? 1 : 0),
          transition: playgroundTransition === 'reveal' ? 'opacity 700ms cubic-bezier(.22,.7,.25,1)' : 'opacity 140ms ease',
        }}
      />
    </>
  );
}
