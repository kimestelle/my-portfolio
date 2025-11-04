"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function PuddlesFastDispersionFixed() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(isMobile ? 1.25 : 2, window.devicePixelRatio || 1));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 5000);
    cam.position.set(0, 500, 900);
    cam.lookAt(0, 0, 0);

    // Floor
    const PLANE_W = 1000, PLANE_H = 700;
    const floorGeo = new THREE.PlaneGeometry(PLANE_W, PLANE_H);
    floorGeo.rotateX(-Math.PI / 2);
    const floor = new THREE.Mesh(
      floorGeo,
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, metalness: 0.0 })
    );
    scene.add(floor);

    // —— SDF data ——
    const MAX_CLUSTERS = isMobile ? 12 : 24;
    const MAX_CIRCLES  = isMobile ? 48 : 96;
    type Vec2 = [number, number];
    type Circle = { c: Vec2; r: number; cluster: number };
    type Cluster = { k: number; born: number; life: number; hold: number; centroid: Vec2; boundR: number };
    const circles: Circle[] = [];
    const clusters: Cluster[] = [];
    const now = () => performance.now();
    const mixf = (a:number,b:number,t:number)=>a*(1-t)+b*t;

    function centroidWeighted(cs: Circle[]): Vec2 {
      let sx=0, sy=0, sw=0; for (const c of cs){ const w=Math.PI*c.r*c.r; sx+=c.c[0]*w; sy+=c.c[1]*w; sw+=w; }
      return [sx/sw, sy/sw];
    }
    function boundRadius(cs: Circle[], cent: Vec2) {
      let R=0; for (const c of cs){ const cand=Math.hypot(c.c[0]-cent[0], c.c[1]-cent[1]) + c.r; if (cand>R) R=cand; }
      return R*1.05;
    }
    function spawn(x:number, y:number) {
      const id = clusters.length; if (id>=MAX_CLUSTERS) return;
      const Rbig = 22 + Math.random()*18;
      const k=6, eps=0.5*k;
      const local: Circle[] = [{ c:[x,y], r:Rbig, cluster:id }];
      const nSmall = Math.floor(Math.random()*3);
      const angs:number[]=[];
      for (let i=0;i<nSmall;i++){ let th=Math.random()*Math.PI*2; if(i===1 && Math.abs(th-angs[0])<Math.PI/4) th += Math.PI/2; angs.push(th); }
      for (let i=0;i<nSmall;i++){
        const th=angs[i], u:[number,number]=[Math.cos(th), Math.sin(th)];
        const rS=(0.18+Math.random()*0.12)*Rbig; const d=Rbig + rS - eps - Math.random()*2;
        local.push({ c:[x+u[0]*d, y+u[1]*d], r:rS, cluster:id });
      }
      if (circles.length + local.length > MAX_CIRCLES) return;
      const cent = centroidWeighted(local);
      const Rb   = boundRadius(local, cent);
      const t    = now();
      const life = 8000 + Math.random()*6000;
      const hold = mixf(0.4,0.6,Math.random()) * life;
      clusters.push({ k, born:t, life, hold, centroid:cent, boundR: Rb });
      circles.push(...local);
    }

    const circlePosRad = new Float32Array(MAX_CIRCLES * 4); // x,y,r,cluster
    const clusterData  = new Float32Array(MAX_CLUSTERS * 7); // k,born,life,hold,cx,cy,boundR

    // —— Puddles material (single pass, dispersion/refraction) ——
    const puddleMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uPlaneSize:     { value: new THREE.Vector2(PLANE_W, PLANE_H) },
        uTime:          { value: 0 },
        uClusterCount:  { value: 0 },
        uCircleCount:   { value: 0 },
        uCirclePosRad:  { value: circlePosRad },
        uClusters:      { value: clusterData },

        uHeightScale:   { value: 8.0 },
        uRimWidth:      { value: 2.0 },
        uInnerAlpha:    { value: isMobile ? 0.16 : 0.2 },
        uRimAlpha:      { value: isMobile ? 0.34 : 0.42 },
        uRimDarken:     { value: 0.07 },
        uFresnelPower:  { value: 3.5 },
        uTint:          { value: new THREE.Color(0.92, 0.98, 1.0) },
        uLightDir:      { value: new THREE.Vector3(0.35, 0.75, 0.4).normalize() },

        // ↑ bump these so you SEE it
        uRefractStrength: { value: 0.020 }, // was 0.010
        uDispersion:      { value: 0.080 }, // was 0.035
        uViewBoost:       { value: 1.2 },   // was 0.9

        uCheckerScale:    { value: 14.0 },
        uCheckA:          { value: new THREE.Color(0xf5faff) },
        uCheckB:          { value: new THREE.Color(0xe3ebf6) },
      },
      vertexShader: /* glsl */`
        varying vec2 vUv;
        varying vec3 vWorldPos, vT, vB, vN;
        void main(){
          vUv = uv;
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          vec3 Tobj = vec3(1.0, 0.0, 0.0);
          vec3 Bobj = vec3(0.0, 1.0, 0.0);
          vT = normalize((modelMatrix * vec4(Tobj, 0.0)).xyz);
          vB = normalize((modelMatrix * vec4(Bobj, 0.0)).xyz);
          vN = normalize(normalMatrix * vec3(0.0, 0.0, 1.0));
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: /* glsl */`
        #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
        #else
        precision mediump float;
        #endif

        uniform vec2  uPlaneSize;
        uniform float uTime;
        uniform int   uClusterCount, uCircleCount;
        uniform float uHeightScale, uRimWidth, uInnerAlpha, uRimAlpha, uRimDarken, uFresnelPower;
        uniform vec3  uTint, uLightDir;

        uniform float uRefractStrength, uDispersion, uViewBoost;
        uniform float uCheckerScale;
        uniform vec3  uCheckA, uCheckB;

        uniform float uCirclePosRad[${Math.max(4, MAX_CIRCLES*4)}];
        uniform float uClusters[${Math.max(7, MAX_CLUSTERS*7)}];

        varying vec2 vUv;
        varying vec3 vWorldPos, vT, vB, vN;

        float smin(float a, float b, float k){
          float h = clamp(0.5 + 0.5*(b - a)/k, 0.0, 1.0);
          return mix(b, a, h) - k*h*(1.0 - h);
        }
        float scaleAt(float t, float born, float life, float hold){
          float u = clamp((t - born)/life, 0.0, 1.0);
          float h = hold / life;
          if (u <= h) return 1.0;
          float v = (u - h)/(1.0 - h);
          return pow(1.0 - v, 3.0);
        }
        void getCluster(int j, out float k, out float born, out float life, out float hold, out vec2 cent, out float boundR){
          int base = j * 7;
          k      = uClusters[base+0];
          born   = uClusters[base+1];
          life   = uClusters[base+2];
          hold   = uClusters[base+3];
          cent.x = uClusters[base+4];
          cent.y = uClusters[base+5];
          boundR = uClusters[base+6];
        }
        vec2 planeP(vec2 uv){ return (uv - 0.5) * uPlaneSize; }

        void evalSDF(vec2 p, out float bestD, out int bestI){
          bestD = 1e9; bestI = -1;
          float t = uTime;
          for (int j=0; j<${MAX_CLUSTERS}; ++j){
            if (j >= uClusterCount) break;
            float k,born,life,hold,boundR; vec2 cent;
            getCluster(j, k, born, life, hold, cent, boundR);
            float s = scaleAt(t, born, life, hold);
            if (s <= 0.0) continue;

            float Dj = 1e9;
            float kk = max(0.0001, k) * s;
            for (int i=0; i<${MAX_CIRCLES}; ++i){
              if (i >= uCircleCount) break;
              int off = i*4;
              float cx = uCirclePosRad[off+0];
              float cy = uCirclePosRad[off+1];
              float rr = uCirclePosRad[off+2];
              float cl = uCirclePosRad[off+3];
              if (int(cl) != j) continue;
              vec2 cpos = mix(vec2(cx,cy), cent, 1.0 - s);
              float di = length(p - cpos) - rr * s;
              Dj = smin(Dj, di, kk);
            }
            if (Dj < bestD){ bestD = Dj; bestI = j; }
          }
        }

        vec3 floorColor(vec2 uv){
          vec2 g = floor(uv * uCheckerScale);
          float f = mod(g.x + g.y, 2.0);
          vec3 c = mix(uCheckA, uCheckB, f);
          vec2 d = uv - 0.5;
          float v = smoothstep(0.0, 0.85, 1.0 - dot(d,d));
          return mix(c*0.94, c, v);
        }

        void main(){
          vec2 p = planeP(vUv);

          float bestD; int bestI;
          evalSDF(p, bestD, bestI);
          if (bestI < 0) discard;

          float w = fwidth(bestD);
          float cov = smoothstep(+w, -w, bestD);
          float rim = 1.0 - smoothstep(0.0, uRimWidth, -bestD);

          // gradient / pseudo-normal in plane
          float px = max(1.0, max(length(dFdx(p)), length(dFdy(p))));
          float d1; int _;
          evalSDF(p + vec2(px,0.0), d1, _); float Dx = d1 - bestD;
          evalSDF(p + vec2(0.0,px), d1, _); float Dy = d1 - bestD;
          vec3 N_tan = normalize(vec3(-Dx * uHeightScale, -Dy * uHeightScale, 1.0));
          vec3 T = normalize(vT), B = normalize(vB), N0 = normalize(vN);
          vec3 Nw = normalize(T * N_tan.x + B * N_tan.y + N0 * N_tan.z);

          vec3 L = normalize(uLightDir);
          vec3 V = normalize(cameraPosition - vWorldPos);
          vec3 H = normalize(L + V);
          float diff = max(dot(Nw, L), 0.0);
          float spec = pow(max(dot(Nw, H), 0.0), 64.0) * 0.30;
          float fres = pow(1.0 - max(dot(Nw, V), 0.0), uFresnelPower);

          float thickness = max(0.0, -bestD);
          float graze = pow(1.0 - max(dot(N0, V), 0.0), 1.0) * uViewBoost;
          vec2 bend = N_tan.xy * (uRefractStrength * (0.35 + 0.65*clamp(thickness*0.03, 0.0, 1.0))) * (1.0 + graze);

          vec2 uvR = clamp(vUv + bend * (1.00 + uDispersion * 0.00), vec2(0.0), vec2(1.0));
          vec2 uvG = clamp(vUv + bend * (1.00 + uDispersion * 0.60), vec2(0.0), vec2(1.0)); // <-- fixed: uvG (no stray space)
          vec2 uvB = clamp(vUv + bend * (1.00 + uDispersion * 1.20), vec2(0.0), vec2(1.0));

          vec3 baseR = floorColor(uvR);
          vec3 baseG = floorColor(uvG);
          vec3 baseB = floorColor(uvB);
          vec3 refracted = vec3(baseR.r, baseG.g, baseB.b);

          // rainbow-y rim boost (subtle)
          vec3 rainbow = vec3(0.10, 0.04, -0.02) * rim;
          vec3 color = refracted + rainbow;
          color = mix(color, mix(vec3(1.0), uTint, 0.4), 0.25);
          color *= (1.0 - uRimDarken * rim);
          color *= (0.85 + 0.15 * diff);
          color += spec * (0.25 + 0.75 * fres);

          float alphaPuddle = mix(uInnerAlpha, uRimAlpha, rim);
          gl_FragColor = vec4(color, alphaPuddle * cov);
        }
      `,
    });

    const puddle = new THREE.Mesh(floorGeo.clone(), puddleMat);
    puddle.position.y += 0.5;
    scene.add(puddle);

    // pack each frame
    function packSDF(t:number){
      for (let i=clusters.length-1;i>=0;i--){
        if (t - clusters[i].born >= clusters[i].life){
          for (let k=circles.length-1;k>=0;k--){
            if (circles[k].cluster === i) circles.splice(k,1);
            else if (circles[k].cluster > i) circles[k].cluster -= 1;
          }
          clusters.splice(i,1);
        }
      }
      if (Math.random() < (isMobile ? 0.01 : 0.02)){
        spawn((Math.random()-0.5)*PLANE_W*0.9, (Math.random()-0.5)*PLANE_H*0.9);
      }
      for (let i=0;i<MAX_CIRCLES;i++){
        const off=i*4, C=circles[i];
        if (C){ circlePosRad[off]=C.c[0]; circlePosRad[off+1]=C.c[1]; circlePosRad[off+2]=C.r; circlePosRad[off+3]=C.cluster; }
        else { circlePosRad[off]=0; circlePosRad[off+1]=0; circlePosRad[off+2]=-1; circlePosRad[off+3]=-1; }
      }
      for (let j=0;j<MAX_CLUSTERS;j++){
        const off=j*7, Cl=clusters[j];
        if (Cl){
          clusterData[off]=Cl.k; clusterData[off+1]=Cl.born; clusterData[off+2]=Cl.life; clusterData[off+3]=Cl.hold;
          clusterData[off+4]=Cl.centroid[0]; clusterData[off+5]=Cl.centroid[1]; clusterData[off+6]=Cl.boundR;
        } else {
          clusterData.set([0,0,0,0,0,0,0], off);
        }
      }
      (puddleMat.uniforms.uTime.value as number) = t;
      (puddleMat.uniforms.uClusterCount.value as number) = clusters.length;
      (puddleMat.uniforms.uCircleCount.value as number)  = circles.length;
    }

    // seed & click spawn
    spawn(0,  PLANE_H*0.10);
    spawn(-PLANE_W*0.2, -PLANE_H*0.15);

    const ray = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    function onPointerDown(e: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      ray.setFromCamera(mouse, cam);
      const hit = ray.intersectObject(puddle, false)[0];
      if (hit && hit.uv){
        const x = (hit.uv.x - 0.5) * PLANE_W;
        const y = (hit.uv.y - 0.5) * PLANE_H;
        spawn(x, y);
      }
    }
    renderer.domElement.addEventListener("pointerdown", onPointerDown, { passive: true });

    // loop
    let raf = 0;
    const loop = () => {
      const t = now();
      packSDF(t);
      renderer.render(scene, cam);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // resize
    function onResize() {
      renderer.setSize(mount.clientWidth, mount.clientHeight, false);
      cam.aspect = mount.clientWidth / mount.clientHeight;
      cam.updateProjectionMatrix();
    }
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown as any);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100svw", height: "100svh", background: "#fff", cursor: "crosshair" }} />;
}
