'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LAB_BY_TECH, type LabItem } from './labData';
import { SoftBlob } from './SoftBlob';
import { GLASS_FRAGMENT_SHADER, GLASS_VERTEX_SHADER } from './glassShaders';

const INK = 'hsl(226, 100%, 12%)';
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
    <main className={`glass-lab${fallback ? ' is-fallback' : ''}`}>
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
              const meta = kind === 'iframe' ? 'live' : kind === 'video' ? 'video' : `${previewCount} ${previewCount === 1 ? 'still' : 'stills'}`;
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
      <footer>
        <code>click to open · esc to close · arrows move through stills</code>
        <code>a 2d profile lathed into a ring mesh, spring physics on every vertex, normals re-derived each frame — the melt is just a new rest pose</code>
      </footer>
      <style jsx>{`
        .glass-lab { --ink: ${INK}; position: relative; isolation: isolate; width: 100%; min-height: 100vh; overflow: clip; color: var(--ink); padding: 6.5rem clamp(1.5rem, 6vw, 7rem) 4rem; background-color: white; background-image: radial-gradient(circle 900px at 32% 24%, rgba(122,87,153,.16), rgba(122,87,153,.07) 42%, transparent 68%), radial-gradient(circle 760px at 70% 44%, rgba(240,133,71,.14), rgba(240,133,71,.06) 42%, transparent 68%), radial-gradient(circle 680px at 44% 78%, rgba(92,179,163,.13), rgba(92,179,163,.06) 42%, transparent 68%); background-attachment: fixed; }
        .glass-lab__canvas { position: fixed; inset: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 2; }
        .glass-lab__frame { position: fixed; inset: 14px; z-index: 20; pointer-events: none; border: .5px solid rgba(10,16,61,.28); filter: blur(1px); }
        .glass-lab__grain { position: fixed; inset: 0; z-index: 21; pointer-events: none; background: url('/textures/sandpaper.png') 0 0 / 60px 60px repeat; mix-blend-mode: screen; opacity: .5; }
        .glass-lab__header, .glass-lab__groups, footer { position: relative; z-index: 3; }
        .glass-lab__header { max-width: 760px; margin: 0 auto 5.5rem; text-align: center; }
        .glass-lab__header h1 { color: var(--ink); font: 500 clamp(3.4rem, 7vw, 4.2rem)/.9 'Star Glyphs', serif; letter-spacing: -.04em; }
        .glass-lab__header p { margin-top: 1.25rem; color: var(--ink); font: italic 1.05rem/1.35 'EB Garamond', Georgia, serif; }
        .glass-lab__groups { max-width: 1120px; margin: auto; }
        .glass-lab__group { margin: 0 0 5rem; }
        .glass-lab__group h2 { color: var(--ink); font: italic 1.05rem/1.4 'EB Garamond', Georgia, serif; border-bottom: .5px solid rgba(10,16,61,.35); padding-bottom: .35rem; margin-bottom: 1.6rem; }
        .glass-lab__cluster { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 3rem clamp(1rem, 4vw, 3rem); }
        .glass-lab__item { width: 232px; transform-origin: center; }
        .glass-lab__item:nth-child(2n) { transform: rotate(.5deg) translateY(7px); }
        .glass-lab__item:nth-child(3n) { transform: rotate(-.6deg) translateY(-4px); }
        .glass-lab__item:nth-child(5n) { transform: rotate(.3deg) translateY(12px); }
        .glass-lab__stage { position: relative; width: 232px; height: 200px; }
        .glass-lab__hit { position: absolute; inset: 0; z-index: 4; width: 232px; height: 200px; border: 0; background: transparent; border-radius: 50%; color: transparent; }
        .glass-lab__hit:focus-visible { outline: 1px solid var(--ink); outline-offset: 6px; }
        .glass-lab__shadow { position: absolute; z-index: 1; left: 42px; bottom: 18px; width: 148px; height: 18px; background: radial-gradient(ellipse, rgba(10,16,61,.13), transparent 70%); filter: blur(3px); transition: width .5s ease, left .5s ease, opacity .5s ease; }
        .is-open .glass-lab__shadow { width: 205px; left: 14px; opacity: .75; }
        .glass-lab__caption { padding: .45rem .35rem 0; color: var(--ink); }
        .glass-lab__caption h3 { display: inline; color: var(--ink); font: 500 1.03rem/1.3 'EB Garamond', Georgia, serif; margin: 0; background-image: linear-gradient(var(--ink), var(--ink)); background-position: 0 100%; background-repeat: no-repeat; background-size: 0 .5px; transition: background-size .2s ease; }
        .glass-lab__item:hover .glass-lab__caption h3, .glass-lab__item:focus-within .glass-lab__caption h3 { background-size: 100% .5px; }
        .glass-lab__caption code { display: block; margin-top: .18rem; color: var(--ink); opacity: .5; font: .62rem/1.3 'Courier New', monospace; text-transform: lowercase; }
        .glass-lab__caption a { color: inherit; text-decoration: underline; }
        .glass-lab__caption p { margin-top: .75rem; color: var(--ink); opacity: 0; transform: translateY(-3px); pointer-events: none; font: 300 .76rem/1.35 'Ysabeau Office', sans-serif; transition: opacity .35s ease, transform .35s ease; }
        .glass-lab__item.is-open .glass-lab__caption p { opacity: .68; transform: none; }
        .glass-lab__panel { position: absolute; z-index: 5; left: 4px; top: 26px; width: 224px; height: 148px; overflow: hidden; border: .5px solid rgba(10,16,61,.38); border-radius: 14px; opacity: 0; transform: scale(.94); pointer-events: none; background: rgba(255,255,255,.55); backdrop-filter: blur(9px); -webkit-backdrop-filter: blur(9px); box-shadow: inset 8px 0 9px -8px rgba(122,87,153,.46), inset -8px 0 9px -8px rgba(92,179,163,.42), inset 0 -8px 9px -8px rgba(240,133,71,.4), 0 14px 28px rgba(10,16,61,.12); transition: opacity .38s ease, transform .55s cubic-bezier(.25,.9,.25,1.2); }
        .glass-lab__panel.is-open { opacity: 1; transform: scale(1); pointer-events: auto; }
        .glass-lab__panel :global(img), .glass-lab__panel :global(video), .glass-lab__panel :global(iframe) { width: 100%; height: 100%; display: block; object-fit: cover; border: 0; }
        .glass-lab__close { position: absolute; z-index: 3; left: 8px; top: 7px; display: grid; place-items: center; width: 20px; height: 20px; border: .5px solid rgba(10,16,61,.35); border-radius: 50%; background: rgba(255,255,255,.72); color: var(--ink); font: 13px/1 sans-serif; }
        .glass-lab__mark { position: absolute; z-index: 2; left: 9px; bottom: 8px; padding: 2px 4px; border-radius: 3px; color: var(--ink); background: rgba(255,255,255,.68); font: .58rem/1.2 'Courier New', monospace; }
        .glass-lab__live::before { content: ''; display: inline-block; width: 4px; height: 4px; margin: 0 4px 1px 0; border-radius: 50%; background: #ee7048; }
        .glass-lab__arrows { position: absolute; z-index: 2; right: 7px; bottom: 6px; display: flex; gap: 3px; }
        .glass-lab__arrows button { width: 24px; height: 21px; border: .5px solid rgba(10,16,61,.3); border-radius: 7px; background: rgba(255,255,255,.72); color: var(--ink); font: 12px/1 sans-serif; }
        footer { display: grid; gap: .35rem; max-width: 1120px; margin: 2rem auto 0; opacity: .45; }
        footer code { color: var(--ink); font: .62rem/1.4 'Courier New', monospace; }
        .glass-lab__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; }
        .is-fallback .glass-lab__hit { background: radial-gradient(circle at 38% 30%, rgba(255,255,255,.85), rgba(122,87,153,.2) 55%, rgba(10,16,61,.12)); box-shadow: inset 8px 5px 15px rgba(255,255,255,.8), inset -7px -5px 15px rgba(92,179,163,.22), 0 12px 20px rgba(10,16,61,.1); }
        @media (max-width: 767px) { .glass-lab { padding-inline: 1rem; } .glass-lab__cluster { justify-content: center; gap-block: 3rem; } .glass-lab__header { margin-bottom: 4rem; } }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; } }
      `}</style>
    </main>
  );
}
