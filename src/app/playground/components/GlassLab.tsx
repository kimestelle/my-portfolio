'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LAB_BY_TECH, type LabItem } from './labData';
import { SoftBlob } from './SoftBlob';
import { GLASS_FRAGMENT_SHADER, GLASS_VERTEX_SHADER } from './glassShaders';
import { LAB_COMPONENTS } from './labComponents';
import styles from './GlassLab.module.css';

const TINTS: readonly [number, number, number][] = [
  [0.48, 0.34, 0.60],
  [0.94, 0.52, 0.28],
  [0.36, 0.70, 0.64],
];

type CellRuntime = {
  item: LabItem;
  element: HTMLDivElement | null;
  blob: SoftBlob;
  phase: number;
  hover: number;
  hoverTarget: number;
  morph: number;
  morphTarget: number;
  pointerX: number;
  pointerY: number;
  texture: WebGLTexture | null;
};

type ShaderLocations = {
  pos: number;
  nor: number;
  uv: number;
  cell: WebGLUniformLocation;
  reveal: WebGLUniformLocation;
  light: WebGLUniformLocation;
  tint: WebGLUniformLocation;
  thumb: WebGLUniformLocation;
};

function formatTime(value: number): string {
  const minutes = Math.floor(value / 60).toString().padStart(2, '0');
  const seconds = Math.floor(value % 60).toString().padStart(2, '0');
  const centiseconds = Math.floor((value % 1) * 100).toString().padStart(2, '0');
  return `${minutes}:${seconds}.${centiseconds}`;
}

function ExperimentPanel({ item, open, onClose }: { item: LabItem; open: boolean; onClose: () => void }) {
  const previews = item.preview ?? [];
  const kind = previews[0]?.type;
  const CustomComponent = item.component ? LAB_COMPONENTS[item.component] : null;
  const [slide, setSlide] = useState(0);
  const [time, setTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const moveSlide = useCallback((amount: number) => {
    if (previews.length > 1) setSlide((current) => (current + amount + previews.length) % previews.length);
  }, [previews.length]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (open) void video.play().catch(() => undefined);
    else video.pause();
  }, [open]);

  useEffect(() => {
    if (!open || kind !== 'image') return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') moveSlide(-1);
      if (event.key === 'ArrowRight') moveSlide(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [kind, moveSlide, open]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !open) return;
    let frame = 0;
    const tick = () => {
      setTime(video.currentTime);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [open]);

  return (
    <div className={`glass-lab__panel${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <button className="glass-lab__close" type="button" onClick={onClose} aria-label={`Close ${item.name}`}>×</button>
      {CustomComponent && <CustomComponent />}
      {kind === 'image' && previews[slide] && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previews[slide].src} alt={`${item.name}, view ${slide + 1}`} />
          <code className="glass-lab__mark">{slide + 1} / {previews.length}</code>
          {previews.length > 1 && <div className="glass-lab__arrows">
            <button type="button" onClick={() => moveSlide(-1)} aria-label="Previous image">←</button>
            <button type="button" onClick={() => moveSlide(1)} aria-label="Next image">→</button>
          </div>}
        </>
      )}
      {kind === 'video' && previews[0] && (
        <>
          <video ref={videoRef} src={previews[0].src} muted loop playsInline preload="metadata" />
          <code className="glass-lab__mark">{formatTime(time)}</code>
        </>
      )}
      {kind === 'iframe' && previews[0] && (
        <>
          <iframe src={previews[0].src} title={item.name} loading="lazy" />
          <code className="glass-lab__mark glass-lab__live">live</code>
        </>
      )}
    </div>
  );
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Unable to create glass-lab shader.');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? 'Unknown shader error.';
    gl.deleteShader(shader);
    throw new Error(message);
  }
  return shader;
}

function makeMonogram(item: LabItem, tint: readonly [number, number, number]): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  if (!context) return canvas;
  const rgb = tint.map((channel) => Math.round(channel * 255));
  const wash = context.createRadialGradient(128, 116, 8, 128, 128, 180);
  wash.addColorStop(0, `rgba(${rgb.join(',')}, 0.34)`);
  wash.addColorStop(1, 'rgba(255,255,255,1)');
  context.fillStyle = wash;
  context.fillRect(0, 0, 256, 256);
  context.fillStyle = 'rgba(10,16,61,0.75)';
  context.font = 'italic 130px "EB Garamond", Georgia, serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(item.name.charAt(0).toLowerCase(), 128, 126);
  return canvas;
}

export default function GlassLab() {
  const items = useMemo(() => LAB_BY_TECH.flatMap((group) => group.items), []);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runtimesRef = useRef<CellRuntime[]>(items.map((item, index) => ({
    item,
    element: null,
    blob: new SoftBlob(),
    phase: index * 1.73,
    hover: 0,
    hoverTarget: 0,
    morph: 0,
    morphTarget: 0,
    pointerX: 116,
    pointerY: 100,
    texture: null,
  })));
  const [openId, setOpenId] = useState<string | null>(null);
  const [panelId, setPanelId] = useState<string | null>(null);
  const panelIdRef = useRef<string | null>(null);
  const [mounted, setMounted] = useState<Set<string>>(() => new Set());
  const [fallback, setFallback] = useState(false);

  const setOpen = useCallback((id: string | null) => {
    setOpenId(id);
    if (id === null) {
      panelIdRef.current = null;
      setPanelId(null);
    }
    if (id) setMounted((previous) => previous.has(id) ? previous : new Set(previous).add(id));
    for (const runtime of runtimesRef.current) {
      const next = runtime.item.id === id ? 1 : 0;
      if (runtime.morphTarget !== next) runtime.blob.setPose(next as 0 | 1);
      runtime.morphTarget = next;
    }
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setOpen]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const runtimes = runtimesRef.current;
    const gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false });
    if (!gl) {
      console.error('glass-lab: WebGL unavailable; using static thumbnails.');
      setFallback(true);
      return;
    }

    let program: WebGLProgram | null = null;
    const buffers: WebGLBuffer[] = [];
    const textures: WebGLTexture[] = [];
    let animationFrame = 0;
    let disposed = false;
    try {
      const vertex = compileShader(gl, gl.VERTEX_SHADER, GLASS_VERTEX_SHADER);
      const fragment = compileShader(gl, gl.FRAGMENT_SHADER, GLASS_FRAGMENT_SHADER);
      program = gl.createProgram();
      if (!program) throw new Error('Unable to create glass-lab program.');
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? 'Shader link failed.');
    } catch (error) {
      console.error('glass-lab: shader setup failed.', error);
      if (program) gl.deleteProgram(program);
      setFallback(true);
      return;
    }

    const location = (name: string) => {
      const value = gl.getUniformLocation(program!, name);
      if (!value) throw new Error(`Missing uniform ${name}`);
      return value;
    };
    const locations: ShaderLocations = {
      pos: gl.getAttribLocation(program, 'a_pos'),
      nor: gl.getAttribLocation(program, 'a_nor'),
      uv: gl.getAttribLocation(program, 'a_uv'),
      cell: location('u_cell'),
      reveal: location('u_reveal'),
      light: location('u_light'),
      tint: location('u_tint'),
      thumb: location('u_thumb'),
    };
    const makeBuffer = () => {
      const buffer = gl.createBuffer();
      if (!buffer) throw new Error('Unable to create glass-lab buffer.');
      buffers.push(buffer);
      return buffer;
    };
    const posBuffer = makeBuffer();
    const normalBuffer = makeBuffer();
    const uvBuffer = makeBuffer();
    const indexBuffer = makeBuffer();
    const firstBlob = runtimes[0].blob;
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, firstBlob.positions.byteLength, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, firstBlob.normals.byteLength, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, firstBlob.uvs, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, firstBlob.indices, gl.STATIC_DRAW);

    const uploadTexture = (texture: WebGLTexture, source: TexImageSource) => {
      if (disposed) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };
    runtimes.forEach((runtime, index) => {
      const texture = gl.createTexture();
      if (!texture) return;
      textures.push(texture);
      runtime.texture = texture;
      uploadTexture(texture, makeMonogram(runtime.item, TINTS[index % TINTS.length]));
      const preview = runtime.item.preview?.[0];
      if (preview?.type === 'image') {
        const image = new Image();
        image.decoding = 'async';
        image.onload = () => uploadTexture(texture, image);
        image.src = preview.src;
      } else if (preview?.type === 'video') {
        const video = document.createElement('video');
        video.muted = true;
        video.preload = 'metadata';
        video.src = preview.src;
        video.addEventListener('loadedmetadata', () => { video.currentTime = Math.min(1.5, Math.max(0, video.duration - 0.1)); }, { once: true });
        video.addEventListener('seeked', () => {
          const poster = document.createElement('canvas');
          poster.width = 256;
          poster.height = 256;
          poster.getContext('2d')?.drawImage(video, 0, 0, 256, 256);
          uploadTexture(texture, poster);
          video.removeAttribute('src');
          video.load();
        }, { once: true });
      }
    });

    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.SCISSOR_TEST);
    gl.uniform2f(locations.cell, 232, 200);
    gl.uniform1i(locations.thumb, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.enableVertexAttribArray(locations.uv);
    gl.vertexAttribPointer(locations.uv, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarse = window.matchMedia('(pointer: coarse)');
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const light = { x: 0, y: 0.5 };
    const onPointerMove = (event: PointerEvent) => { pointer.x = event.clientX; pointer.y = event.clientY; };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    let lastFrame = 0;

    const draw = (now: number) => {
      animationFrame = requestAnimationFrame(draw);
      if (now - lastFrame < 15) return;
      lastFrame = now;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.round(window.innerWidth * dpr);
      const height = Math.round(window.innerHeight * dpr);
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
      gl.viewport(0, 0, width, height);
      gl.scissor(0, 0, width, height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const targetLightX = ((pointer.x / window.innerWidth) - 0.5) * 1.6;
      const targetLightY = (0.5 - pointer.y / window.innerHeight) * 1.6 + 0.5;
      light.x += (targetLightX - light.x) * 0.06;
      light.y += (targetLightY - light.y) * 0.06;

      runtimes.forEach((runtime, index) => {
        runtime.hover += (runtime.hoverTarget - runtime.hover) * 0.12;
        runtime.morph += (runtime.morphTarget - runtime.morph) * (reduced.matches ? 1 : 0.075);
        if (runtime.morphTarget === 1 && runtime.morph > 0.86 && panelIdRef.current !== runtime.item.id) {
          panelIdRef.current = runtime.item.id;
          setPanelId(runtime.item.id);
        }
        const bobY = reduced.matches ? 0 : Math.sin(now * 0.0007 + runtime.phase) * 3.5 * (1 - runtime.morph);
        runtime.blob.step(!coarse.matches && runtime.hoverTarget > 0, runtime.pointerX, runtime.pointerY, bobY);
        const element = runtime.element;
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const visible = rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
        if (!visible) return;
        if (runtime.blob.active) runtime.blob.recomputeNormals();
        const vx = Math.round(rect.left * dpr);
        const vy = Math.round((window.innerHeight - rect.bottom) * dpr);
        const vw = Math.round(rect.width * dpr);
        const vh = Math.round(rect.height * dpr);
        gl.viewport(vx, vy, vw, vh);
        gl.scissor(vx, vy, vw, vh);
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, runtime.blob.positions);
        gl.enableVertexAttribArray(locations.pos);
        gl.vertexAttribPointer(locations.pos, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, runtime.blob.normals);
        gl.enableVertexAttribArray(locations.nor);
        gl.vertexAttribPointer(locations.nor, 3, gl.FLOAT, false, 0, 0);
        const reveal = (0.34 + 0.28 * runtime.hover) * (1 - Math.max(0, (runtime.morph - 0.7) / 0.3));
        gl.uniform1f(locations.reveal, reveal);
        gl.uniform2f(locations.light, light.x, light.y);
        gl.uniform3fv(locations.tint, TINTS[index % TINTS.length]);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, runtime.texture);
        gl.drawElements(gl.TRIANGLES, runtime.blob.indices.length, gl.UNSIGNED_SHORT, 0);
      });
    };
    animationFrame = requestAnimationFrame(draw);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('pointermove', onPointerMove);
      for (const runtime of runtimes) runtime.texture = null;
      textures.forEach((texture) => gl.deleteTexture(texture));
      buffers.forEach((buffer) => gl.deleteBuffer(buffer));
      gl.deleteProgram(program);
    };
  }, [items]);

  let itemIndex = 0;
  return (
    <main className={`${styles.root} glass-lab${fallback ? ' is-fallback' : ''}`}>
      <canvas ref={canvasRef} className="glass-lab__canvas" aria-hidden="true" />
      <div className="glass-lab__frame" aria-hidden="true" />
      <div className="glass-lab__grain" aria-hidden="true" />
      <header className="glass-lab__header">
        <h1>lab ✦</h1>
        <p>short-form snippets of side projects &amp; experiments — touch a blob</p>
      </header>
      <div className="glass-lab__groups">
        {LAB_BY_TECH.map((group) => <section className="glass-lab__group" key={group.tech}>
          <h2>{group.tech.toLowerCase()}</h2>
          <div className="glass-lab__cluster">
            {group.items.map((item) => {
              const index = itemIndex++;
              const runtime = runtimesRef.current[index];
              const previewCount = item.preview?.length ?? 0;
              const kind = item.preview?.[0]?.type;
              const meta = item.component
                ? 'tsx'
                : kind === 'iframe'
                  ? 'live'
                  : kind === 'video'
                    ? 'video'
                    : `${previewCount} ${previewCount === 1 ? 'still' : 'stills'}`;
              const isOpen = openId === item.id;
              return <article className={`glass-lab__item${isOpen ? ' is-open' : ''}`} key={item.id}>
                <div className="glass-lab__stage" ref={(node) => { runtime.element = node; }}>
                  <div className="glass-lab__shadow" aria-hidden="true" />
                  <button
                    type="button"
                    className="glass-lab__hit"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(item.id)}
                    onPointerEnter={() => { runtime.hoverTarget = 1; }}
                    onPointerLeave={() => { runtime.hoverTarget = 0; }}
                    onPointerMove={(event) => {
                      const rect = event.currentTarget.getBoundingClientRect();
                      runtime.pointerX = ((event.clientX - rect.left) / rect.width) * 232;
                      runtime.pointerY = ((event.clientY - rect.top) / rect.height) * 200;
                    }}
                  ><span className="glass-lab__sr">Open {item.name}</span></button>
                  {mounted.has(item.id) && <ExperimentPanel item={item} open={panelId === item.id} onClose={() => setOpen(null)} />}
                </div>
                <div className="glass-lab__caption">
                  <h3>{item.name}</h3>
                  <code>{meta}{item.githubUrl && <> · <a href={item.githubUrl} target="_blank" rel="noreferrer">gh</a></>}</code>
                  <p>{item.blurb}</p>
                </div>
              </article>;
            })}
          </div>
        </section>)}
      </div>
    </main>
  );
}
