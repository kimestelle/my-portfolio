import { asciiStars } from "../starTheme";
const SCALE = 3.5;
const DEAD = ' ';
const randStar = () => asciiStars[(Math.random() * asciiStars.length) | 0];

export function starConwayPattern(width: number, height: number): string[][] {
  if (width <= 0 || height <= 0) return [];

  const W = Math.max(1, Math.floor(width * SCALE));
  const H = Math.max(1, Math.floor(height * SCALE));

  const grid = Array.from({ length: H }, () => Array.from({ length: W }, () => DEAD));

  const fillProbability = 0.11;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (Math.random() < fillProbability) grid[y][x] = randStar();
    }
  }

  return grid;
}

export function updateStarConway(grid: string[][], width: number, height: number): string[][] {
  if (!grid || grid.length === 0) return grid;

  const W = Math.max(1, Math.floor(width * SCALE));
  const H = Math.max(1, Math.floor(height * SCALE));

  if (grid.length !== H || (grid[0]?.length ?? 0) !== W) return starConwayPattern(width, height);

  const out = Array.from({ length: H }, () => Array.from({ length: W }, () => DEAD));
  const wrap = (n: number, max: number) => (n + max) % max;

  for (let y = 0; y < H; y++) {
    const ym1 = wrap(y - 1, H);
    const yp1 = wrap(y + 1, H);

    for (let x = 0; x < W; x++) {
      const xm1 = wrap(x - 1, W);
      const xp1 = wrap(x + 1, W);

      let n = 0;
      if (grid[ym1][xm1] !== DEAD) n++;
      if (grid[ym1][x] !== DEAD) n++;
      if (grid[ym1][xp1] !== DEAD) n++;
      if (grid[y][xm1] !== DEAD) n++;
      if (grid[y][xp1] !== DEAD) n++;
      if (grid[yp1][xm1] !== DEAD) n++;
      if (grid[yp1][x] !== DEAD) n++;
      if (grid[yp1][xp1] !== DEAD) n++;

      const alive = grid[y][x] !== DEAD;

      if (alive) out[y][x] = (n === 2 || n === 3) ? grid[y][x] : DEAD;
      else out[y][x] = (n === 3) ? randStar() : DEAD;
    }
  }

  return out;
}

export type Dirty = { x: number; y: number; ch: string };

export function updateStarConwayDirty(grid: string[][]): { grid: string[][]; dirty: Dirty[] } {
  const H = grid.length;
  const W = grid[0]?.length ?? 0;
  const out = Array.from({ length: H }, () => Array.from({ length: W }, () => " "));
  const dirty: Dirty[] = [];

  const wrap = (n: number, max: number) => (n + max) % max;
  const DEAD = " ";

  for (let y = 0; y < H; y++) {
    const ym1 = wrap(y - 1, H), yp1 = wrap(y + 1, H);
    for (let x = 0; x < W; x++) {
      const xm1 = wrap(x - 1, W), xp1 = wrap(x + 1, W);
      let n = 0;
      if (grid[ym1][xm1] !== DEAD) n++;
      if (grid[ym1][x]   !== DEAD) n++;
      if (grid[ym1][xp1] !== DEAD) n++;
      if (grid[y][xm1]   !== DEAD) n++;
      if (grid[y][xp1]   !== DEAD) n++;
      if (grid[yp1][xm1] !== DEAD) n++;
      if (grid[yp1][x]   !== DEAD) n++;
      if (grid[yp1][xp1] !== DEAD) n++;

      const alive = grid[y][x] !== DEAD;
      const next = alive ? ((n === 2 || n === 3) ? grid[y][x] : DEAD) : ((n === 3) ? randStar() : DEAD);
      out[y][x] = next;

      if (next !== grid[y][x]) dirty.push({ x, y, ch: next });
    }
  }

  return { grid: out, dirty };
}
