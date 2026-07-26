export type ShimmerColor = readonly [red: number, green: number, blue: number];

export const SHIMMER_PALETTE = [
  [122, 87, 153],
  [240, 133, 71],
  [92, 179, 163],
] as const satisfies readonly ShimmerColor[];

export const SHIMMER_TILE_SIZE = 192;

function positiveModulo(value: number, modulus: number) {
  return ((value % modulus) + modulus) % modulus;
}

function smoothstep(value: number) {
  return value * value * (3 - 2 * value);
}

function hashGridPoint(x: number, y: number, seed: number) {
  let hash = seed ^ Math.imul(x + 0x9e3779b9, 0x85ebca6b);
  hash ^= Math.imul(y + 0xc2b2ae35, 0x27d4eb2f);
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x7feb352d);
  hash ^= hash >>> 15;
  hash = Math.imul(hash, 0x846ca68b);
  hash ^= hash >>> 16;
  return (hash >>> 0) / 0xffffffff;
}

function samplePeriodicGrid(
  x: number,
  y: number,
  periodPx: number,
  cells: number,
  seed: number,
) {
  const gridX = positiveModulo(x, periodPx) / periodPx * cells;
  const gridY = positiveModulo(y, periodPx) / periodPx * cells;
  const x0 = Math.floor(gridX);
  const y0 = Math.floor(gridY);
  const x1 = (x0 + 1) % cells;
  const y1 = (y0 + 1) % cells;
  const tx = smoothstep(gridX - x0);
  const ty = smoothstep(gridY - y0);

  const top = hashGridPoint(x0, y0, seed)
    + (hashGridPoint(x1, y0, seed) - hashGridPoint(x0, y0, seed)) * tx;
  const bottom = hashGridPoint(x0, y1, seed)
    + (hashGridPoint(x1, y1, seed) - hashGridPoint(x0, y1, seed)) * tx;
  return top + (bottom - top) * ty;
}

export function seedShimmerMap(seed: string) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < seed.length; index++) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function sampleTileableShimmerMap(
  x: number,
  y: number,
  seed: number,
  periodPx = SHIMMER_TILE_SIZE,
) {
  const broad = samplePeriodicGrid(x, y, periodPx, 4, seed);
  const medium = samplePeriodicGrid(x, y, periodPx, 8, seed ^ 0x68bc21eb);
  const fine = samplePeriodicGrid(x, y, periodPx, 16, seed ^ 0x02e5be93);
  return (broad * 0.82 + medium * 0.16 + fine * 0.02);
}

function mix(start: number, end: number, amount: number) {
  return Math.round(start + (end - start) * amount);
}

export function sampleShimmerColor(
  value: number,
  palette: readonly ShimmerColor[] = SHIMMER_PALETTE,
) {
  if (palette.length === 0) return 'currentColor';
  if (palette.length === 1) {
    const [red, green, blue] = palette[0];
    return `rgb(${red} ${green} ${blue})`;
  }
  const clamped = Math.max(0, Math.min(1, value));
  const scaled = clamped * (palette.length - 1);
  const startIndex = Math.min(palette.length - 2, Math.floor(scaled));
  const amount = scaled - startIndex;
  const start = palette[startIndex];
  const end = palette[startIndex + 1];
  return `rgb(${mix(start[0], end[0], amount)} ${mix(start[1], end[1], amount)} ${mix(start[2], end[2], amount)})`;
}
