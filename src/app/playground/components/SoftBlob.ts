const ROWS = 44;
const SEGS = 34;
const R = 66;
const CX = 116;
const CY = 100;

const PHYS = { springK: 0.085, damping: 0.88, hoverForce: 2.4, hoverRadius: 78 };

export class SoftBlob {
  readonly positions: Float32Array;
  readonly normals: Float32Array;
  readonly uvs: Float32Array;
  readonly indices: Uint16Array;
  readonly restA: Float32Array;
  readonly restB: Float32Array;
  readonly velocities: Float32Array;
  rest: Float32Array;
  active = true;
  private quietFrames = 0;

  constructor(frontOnly = false) {
    const segments = frontOnly ? SEGS / 2 : SEGS;
    const ring = segments + 1;
    const vertexCount = (ROWS + 1) * ring;
    this.positions = new Float32Array(vertexCount * 3);
    this.normals = new Float32Array(vertexCount * 3);
    this.uvs = new Float32Array(vertexCount * 2);
    this.restA = new Float32Array(vertexCount * 3);
    this.restB = new Float32Array(vertexCount * 3);
    this.velocities = new Float32Array(vertexCount * 3);

    for (let i = 0; i <= ROWS; i += 1) {
      const v = i / ROWS;
      const y = CY - R * Math.cos(v * Math.PI);
      const radius = R * Math.sin(v * Math.PI);
      for (let j = 0; j <= segments; j += 1) {
        const vertex = i * ring + j;
        const p = vertex * 3;
        // The lightweight playground prototype needs only the camera-facing
        // half. The full lab mesh keeps its original closed 360° surface.
        const th = (j / segments) * Math.PI * (frontOnly ? 1 : 2);
        const x = CX + radius * Math.cos(th);
        const z = radius * Math.sin(th);
        this.positions.set([x, y, z], p);
        this.restA.set([x, y, z], p);
        this.uvs.set([j / segments, v], vertex * 2);

        // Radial mapping preserves every surface direction, so the shell opens
        // across the slab instead of collapsing onto its nearest z face.
        const dx = x - CX;
        const dy = y - CY;
        const dz = z;
        let lo = 0;
        let hi = 300;
        for (let step = 0; step < 24; step += 1) {
          const mid = (lo + hi) * 0.5;
          if (SoftBlob.slabSdf((dx / R) * mid, (dy / R) * mid, (dz / R) * mid) < 0) lo = mid;
          else hi = mid;
        }
        this.restB.set([CX + (dx / R) * hi, CY + (dy / R) * hi, (dz / R) * hi], p);
      }
    }

    const tris: number[] = [];
    for (let i = 0; i < ROWS; i += 1) {
      for (let j = 0; j < segments; j += 1) {
        const p0 = i * ring + j;
        const p1 = (i + 1) * ring + j;
        const p2 = i * ring + j + 1;
        const p3 = (i + 1) * ring + j + 1;
        tris.push(p0, p1, p2, p1, p3, p2);
      }
    }
    this.indices = new Uint16Array(tris);
    this.rest = this.restA;
    this.recomputeNormals();
  }

  private static slabSdf(x: number, y: number, z: number): number {
    const rr = 12;
    const qx = Math.abs(x) - 100;
    const qy = Math.abs(y) - 62;
    const qz = Math.abs(z) - 4;
    return Math.hypot(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) +
      Math.min(Math.max(qx, qy, qz), 0) - rr;
  }

  setPose(pose: 0 | 1): void {
    this.rest = pose === 1 ? this.restB : this.restA;
    this.active = true;
    this.quietFrames = 0;
  }

  step(hovering: boolean, px: number, py: number, bobY: number): void {
    let speed = 0;
    const count = this.positions.length / 3;
    for (let n = 0; n < count; n += 1) {
      const p = n * 3;
      if (hovering) {
        const dx = this.positions[p] - px;
        const dy = this.positions[p + 1] - py;
        const d = Math.hypot(dx, dy);
        if (d > 0.0001 && d < PHYS.hoverRadius) {
          const force = (1 - d / PHYS.hoverRadius) * PHYS.hoverForce;
          this.velocities[p] += (dx / d) * force;
          this.velocities[p + 1] += (dy / d) * force;
        }
      }
      this.velocities[p] += (this.rest[p] - this.positions[p]) * PHYS.springK;
      this.velocities[p + 1] += (this.rest[p + 1] + bobY - this.positions[p + 1]) * PHYS.springK;
      this.velocities[p + 2] += (this.rest[p + 2] - this.positions[p + 2]) * PHYS.springK;
      this.velocities[p] *= PHYS.damping;
      this.velocities[p + 1] *= PHYS.damping;
      this.velocities[p + 2] *= PHYS.damping;
      this.positions[p] += this.velocities[p];
      this.positions[p + 1] += this.velocities[p + 1];
      this.positions[p + 2] += this.velocities[p + 2];
      speed += Math.hypot(this.velocities[p], this.velocities[p + 1], this.velocities[p + 2]);
    }
    if (speed / count < 0.02) this.quietFrames += 1;
    else this.quietFrames = 0;
    this.active = this.quietFrames < 8;
  }

  recomputeNormals(): void {
    this.normals.fill(0);
    for (let i = 0; i < this.indices.length; i += 3) {
      const ia = this.indices[i] * 3;
      const ib = this.indices[i + 1] * 3;
      const ic = this.indices[i + 2] * 3;
      const abx = this.positions[ib] - this.positions[ia];
      const aby = this.positions[ib + 1] - this.positions[ia + 1];
      const abz = this.positions[ib + 2] - this.positions[ia + 2];
      const acx = this.positions[ic] - this.positions[ia];
      const acy = this.positions[ic + 1] - this.positions[ia + 1];
      const acz = this.positions[ic + 2] - this.positions[ia + 2];
      const nx = aby * acz - abz * acy;
      const ny = abz * acx - abx * acz;
      const nz = abx * acy - aby * acx;
      for (const p of [ia, ib, ic]) {
        this.normals[p] += nx;
        this.normals[p + 1] += ny;
        this.normals[p + 2] += nz;
      }
    }
    for (let p = 0; p < this.normals.length; p += 3) {
      const length = Math.hypot(this.normals[p], this.normals[p + 1], this.normals[p + 2]) || 1;
      this.normals[p] /= length;
      this.normals[p + 1] /= length;
      this.normals[p + 2] /= length;
    }
  }
}
