import type { Print } from "@/lib/trades";

/** Twelve rings, each three pixels thick. 36×36. One shared square. */
export const RINGS = 12;
export const SCALE = 3;
export const PIX = RINGS * SCALE;

export type Pix = { heat: number; closed: boolean };
export type RingSeat = { ring: number; who: string; gme: number };

export type Picture = {
  cells: Pix[];
  seats: RingSeat[];
  epoch: number;
  ring: number;
  filled: number;
  ringCells: number;
  threshold: number;
  full: boolean;
};

function band(ring: number) {
  const a = ring * SCALE;
  const b = a + SCALE;
  const cells: number[] = [];
  for (let r = 0; r < PIX; r++) {
    for (let c = 0; c < PIX; c++) {
      const m = Math.max(r, c);
      if (m >= a && m < b) cells.push(r * PIX + c);
    }
  }
  return cells;
}

const BANDS = Array.from({ length: RINGS }, (_, ring) => band(ring));

function blank(): Pix[] {
  return Array.from({ length: PIX * PIX }, () => ({ heat: 0, closed: false }));
}

function thresholdOf(gmes: number[]) {
  if (gmes.length < 4) return Number.POSITIVE_INFINITY;
  const sorted = [...gmes].sort((a, b) => a - b);
  return sorted[Math.floor((sorted.length - 1) * 0.8)];
}

export function paintMarket(newestFirst: Print[]): Picture {
  const chrono = [...newestFirst].sort((a, b) => a.block - b.block || a.hash.localeCompare(b.hash));
  const threshold = thresholdOf(chrono.filter((p) => p.side === "buy").map((p) => p.gme));
  let cells = blank();
  let seats: RingSeat[] = [];
  let epoch = 1;
  let ring = 0;
  let idx = 0;
  let full = false;

  const cool = () => {
    for (let i = cells.length - 1; i >= 0; i--) {
      const cell = cells[i];
      if (cell && cell.heat >= 1 && !cell.closed) {
        cell.heat = 0.35;
        return;
      }
    }
  };

  const openNext = () => {
    epoch += 1;
    ring = 0;
    idx = 0;
    full = false;
    cells = blank();
    seats = [];
  };

  for (const print of chrono) {
    if (full) openNext();
    if (print.side === "sell") {
      cool();
      continue;
    }
    const here = BANDS[ring] ?? [];
    if (print.gme > threshold) {
      for (const at of here) {
        const cell = cells[at];
        if (cell) {
          cell.heat = 1;
          cell.closed = true;
        }
      }
      if (print.who) seats.push({ ring, who: print.who, gme: print.gme });
      ring += 1;
      idx = 0;
      if (ring >= RINGS) full = true;
      continue;
    }
    const at = here[idx];
    if (at !== undefined) {
      const cell = cells[at];
      if (cell) cell.heat = 1;
      idx += 1;
    }
    if (idx >= here.length) {
      ring += 1;
      idx = 0;
      if (ring >= RINGS) full = true;
    }
  }

  const here = BANDS[Math.min(ring, RINGS - 1)] ?? [];
  return {
    cells,
    seats,
    epoch,
    ring: Math.min(ring, RINGS),
    filled: idx,
    ringCells: here.length,
    threshold,
    full,
  };
}
