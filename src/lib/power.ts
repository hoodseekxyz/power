/** (Σa)² = Σa² + 2Σab. The cross term is the pool. */

export const SIDE_MAX = 12;

export type Seat = {
  id: string;
  label: string;
  a: number;
  you?: boolean;
};

export function sumA(seats: Seat[]) {
  return seats.reduce((s, x) => s + x.a, 0);
}

export function sumSq(seats: Seat[]) {
  return seats.reduce((s, x) => s + x.a * x.a, 0);
}

export function squareOfSum(seats: Seat[]) {
  const s = sumA(seats);
  return s * s;
}

export function cross(seats: Seat[]) {
  return squareOfSum(seats) - sumSq(seats);
}

/** Step k = max(row, col) is one cell of the odd gnomon 2k+1. */
export function ownerAt(seats: Seat[], row: number, col: number): Seat | null {
  const step = Math.max(row, col);
  let cursor = 0;
  for (const seat of seats) {
    if (seat.a <= 0) continue;
    if (step < cursor + seat.a) return seat;
    cursor += seat.a;
  }
  return null;
}
