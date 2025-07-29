'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type HeatSpot = {
  position: THREE.Vector2;
  createdAt: number;
};

export default function MoodRingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heatSpots = useRef<HeatSpot[]>([]);
  const elapsedTimeRef = useRef(0);
  const lastTouchTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const geometry = new THREE.PlaneGeometry(2, 2);

    let startTime = 0;

    const maxSpots = 50;

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
      uSpots: { value: Array(maxSpots).fill(new THREE.Vector3(0, 0, 0)) },
      uSpotCount: { value: 0 },
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

        float heatFalloff(vec2 uv, vec2 center, float age) {
          float radius = 0.02 + age * 0.05;  // expands over time
          float dist = distance(uv, center);
          float d = dist / radius;
          float softness = smoothstep(1.0, 0.0, d); 
          float peak = clamp(age, 0.0, 1.0); 
          float decay = peak * exp(-age * 0.6) * 0.6; 
          return softness * decay;
        }

        // palette
        vec3 moodPalette(float t) {
          vec3 cool    = vec3(0.80, 1.00, 0.95); // blue
          vec3 neutral = vec3(0.98, 0.95, 0.90); // cream
          vec3 warm    = vec3(1.00, 0.88, 0.88); // pink
          vec3 hot     = vec3(1.00, 0.82, 0.82); // red

          if (t < 0.4) {
            float f = smoothstep(0.0, 0.4, t);
            return mix(cool, neutral, f);
          } else if (t < 0.75) {
            float f = smoothstep(0.4, 0.75, t);
            return mix(neutral, warm, f);
          } else {
            float f = smoothstep(0.75, 1.0, t);
            return mix(warm, hot, f);
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

          vec3 base = vec3(1.00, 1.00, 1.00); // white base
          vec3 glow = moodPalette(heat);
          vec3 color = mix(base, glow, smoothstep(0.0, 0.65, heat));

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height, false); // <- false disables style resize
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      const maxDPR = 1.5;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDPR));
      uniforms.uResolution.value.set(width, height);
    };
    window.addEventListener('resize', onResize);
    onResize();

    const handleTouch = (clientX: number, clientY: number) => {
      //prevent performance issues
      const now = elapsedTimeRef.current;
      if (now - lastTouchTimeRef.current < 0.05) return;
      lastTouchTimeRef.current = now;

      const x = clientX / window.innerWidth;
      const y = 1 - clientY / window.innerHeight;
      const stretchedY = (y - 0.5) * (window.innerHeight / window.innerWidth) + 0.5;

      const createdAt = elapsedTimeRef.current; // use synced animation time
      heatSpots.current.push({ position: new THREE.Vector2(x, stretchedY), createdAt });

      if (heatSpots.current.length > maxSpots) {
        heatSpots.current.shift(); // Remove oldest
      }
    };

    window.addEventListener('pointermove', (e) => handleTouch(e.clientX, e.clientY));
    window.addEventListener('pointerdown', (e) => handleTouch(e.clientX, e.clientY));
    window.addEventListener('touchstart', (e) => {
      for (const touch of Array.from(e.touches)) {
        handleTouch(touch.clientX, touch.clientY);
      }
    });

    const animate = (t: number) => {
      if (startTime === 0) startTime = t; 
      const now = (t - startTime) * 0.001; 
      elapsedTimeRef.current = now;
      uniforms.uTime.value = now;

      const updatedSpots = heatSpots.current
        .filter((s) => now - s.createdAt < 10) // Decay after 10s
        .slice(-maxSpots); //keep maxspots from accumulating

      uniforms.uSpotCount.value = updatedSpots.length;
      for (let i = 0; i < maxSpots; i++) {
        if (i < updatedSpots.length) {
          const s = updatedSpots[i];
          uniforms.uSpots.value[i] = new THREE.Vector3(s.position.x, s.position.y, s.createdAt);
        } else {
          uniforms.uSpots.value[i] = new THREE.Vector3(0, 0, -999); // inactive
        }
      }

      heatSpots.current = updatedSpots;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate(0);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', handleTouch as any);
      window.removeEventListener('pointerdown', handleTouch as any);
      window.removeEventListener('touchstart', handleTouch as any);
      renderer.dispose();
      material.dispose();
      geometry.dispose();
    };
  }, []);

  return (
    <>
    <div
      className="fixed top-0 left-0 w-full h-full z-[-1] pointer-events-none"
      style={{
        backgroundImage: "url('/textures/sandpaper.png')",
        backgroundSize: 'repeat',
        opacity: 1, 
        mixBlendMode: 'lighten',
      }}
    />
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-[-2] pointer-events-none"
      // style={{ filter: 'blur(20px)' }} 
    />
    </>
  );
}
