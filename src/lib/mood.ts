import { FACE_TOKS, hash32, type Role } from "@/lib/jlens";

export type Sitter = {
  id: string;
  word: string;
  pos: number;
  weight: number;
  you?: boolean;
};

export type Tape = {
  buy: number;
  sell: number;
};

export type Mood = {
  smile: number;
  open: number;
  alert: number;
  ink: number;
  glow: boolean;
};

export const VISUAL_POS = FACE_TOKS.map((t, i) => (t.line >= 0 ? i : -1)).filter((i) => i >= 0);

export function sitPos(seed: string) {
  return VISUAL_POS[hash32(seed) % VISUAL_POS.length]!;
}

export function moodFrom(tape: Tape, sitters: Sitter[], glow: boolean): Mood {
  const vol = tape.buy + tape.sell;
  const smile = vol === 0 ? 0.18 : clamp((tape.buy - tape.sell) / Math.max(vol, 1), -1, 1);
  const mass = sitters.reduce((s, x) => s + x.weight, 0);
  const ink = clamp(mass / 9, 0.08, 1);
  const open = 0.28 + 0.72 * clamp(sitters.length / 11, 0, 1);
  const alert = clamp(vol / 18, 0, 1);
  return { smile, open, ink, alert, glow };
}

export function roleInk(sitters: Sitter[], role: Role) {
  const w = sitters
    .filter((s) => FACE_TOKS[s.pos]?.role === role)
    .reduce((s, x) => s + x.weight, 0);
  return clamp(w / 2.2, 0, 1);
}

export function posInk(sitters: Sitter[], pos: number) {
  const w = sitters.filter((s) => s.pos === pos).reduce((s, x) => s + x.weight, 0);
  return clamp(w / 1.6, 0, 1);
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}
