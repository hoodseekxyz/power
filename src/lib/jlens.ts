/**
 * Toy Jacobian lens, laid out like anthropics/jacobian-lens assets/slice_vis.png.
 * Pos 28 is `^`. Layer 42 reads "nose" — a word that is not in the prompt.
 * Deterministic. Not a fitted model. Not Anthropic.
 */

export const LAYERS = 64;
export const OUTPUT_LAYER = LAYERS - 1;
export const WORKSPACE = { lo: 36, hi: 48 } as const;
export const NOSE_LAYER = 42;
export const NOSE_POS = 28;

export type Role =
  | "crown"
  | "arc"
  | "brow"
  | "eye"
  | "cheek"
  | "jaw"
  | "nose"
  | "mouth"
  | "chin"
  | "neck"
  | "ask";

export type FaceTok = {
  t: string;
  role: Role;
  line: number;
  col: number;
  ws: boolean;
};

type Raw = [string, Role, number, number];

/** Token stream aligned to the paper vis: index 28 = ^ */
const RAW: Raw[] = [
  [" ", "ask", -1, 0],
  [" ", "ask", -1, 1],
  [" ", "ask", -1, 2],
  [" ", "ask", -1, 3],
  [" ", "ask", -1, 4],
  ["/", "arc", 0, 5],
  [" ", "ask", 0, 6],
  ["\\", "arc", 0, 7],
  [" ", "ask", 0, 8],
  ["/", "arc", 1, 4],
  ["/", "arc", 1, 5],
  ["-", "brow", 0, 6],
  ["~", "brow", 0, 6],
  ["~", "brow", 0, 8],
  ["-", "brow", 0, 9],
  ["\\", "arc", 0, 10],
  ["\\", "arc", 1, 10],
  [" ", "ask", 1, 1],
  ["(", "cheek", 1, 4],
  [" ", "ask", 1, 5],
  ["o", "eye", 1, 6],
  ["o", "eye", 1, 7],
  ["o", "eye", 1, 8],
  [")", "cheek", 1, 11],
  [")", "cheek", 1, 12],
  [" ", "ask", 2, 0],
  ["|", "jaw", 2, 1],
  [" ", "ask", 2, 6],
  ["^", "nose", 2, 7],
  [".", "ask", 2, 8],
  ["|", "jaw", 2, 10],
  [" ", "ask", 3, 0],
  ["|", "jaw", 4, 7],
  ["|", "neck", 4, 7],
  ["|", "mouth", 3, 5],
  [" ", "ask", 3, 6],
  ["|", "mouth", 3, 9],
  ["\\", "chin", 3, 6],
  ["\\", "chin", 3, 6],
  ["_", "mouth", 3, 7],
  ["/", "chin", 3, 10],
  ["What", "ask", 5, 0],
  ["is", "ask", 5, 5],
  ["this", "ask", 5, 8],
  ["?", "ask", 5, 13],
];

export const FACE_TOKS: FaceTok[] = RAW.map(([t, role, line, col]) => ({
  t,
  role,
  line,
  col,
  ws: t === " ",
}));

export const NOSE_I = NOSE_POS;

export const ASCII_ROWS = ["     / ~ ~ \\", "    (  o o  )", "     \\  ^  /", "      \\___/", "       | |"];
export const ASCII_FACE = [...ASCII_ROWS, "What is this?"].join("\n");

/** Click map: character in ASCII_ROWS → token index. */
export const FACE_CLICK: { row: number; col: number; pos: number }[] = [
  { row: 0, col: 5, pos: 5 },
  { row: 0, col: 7, pos: 12 },
  { row: 0, col: 9, pos: 13 },
  { row: 0, col: 11, pos: 15 },
  { row: 1, col: 4, pos: 18 },
  { row: 1, col: 7, pos: 20 },
  { row: 1, col: 9, pos: 22 },
  { row: 1, col: 12, pos: 23 },
  { row: 2, col: 5, pos: 16 },
  { row: 2, col: 8, pos: 28 },
  { row: 2, col: 11, pos: 40 },
  { row: 3, col: 6, pos: 37 },
  { row: 3, col: 7, pos: 39 },
  { row: 3, col: 8, pos: 39 },
  { row: 3, col: 9, pos: 39 },
  { row: 3, col: 10, pos: 40 },
  { row: 4, col: 7, pos: 32 },
  { row: 4, col: 9, pos: 33 },
];

const ROLE_WORDS: Record<Role, string[]> = {
  crown: ["head", "top", "cap", "skull"],
  arc: ["curve", "line", "edge", "arc", "slash", "shape"],
  brow: ["brow", "tilde", "worry", "lid", "eyebrow"],
  eye: ["eyes", "eye", "Eyes", "see", "look", "gaze", "pupil"],
  cheek: ["cheek", "side", "paren", "face", "jaw"],
  jaw: ["jaw", "bar", "side", "face", "line"],
  nose: ["nose", "Nose", "noses", "nasal", "nariz", "beak", "snout", "sniff"],
  mouth: ["smile", "mouth", "Mouth", "grin", "lips", "smiling"],
  chin: ["chin", "base", "jaw", "rest", "bottom"],
  neck: ["neck", "stem", "post", "body"],
  ask: ["face", "ASCII", "drawing", "person", "portrait", "this"],
};

const SURFACE = ["glyph", "mark", "ink", "stroke", "token", "char", "xxxx", "ctrl"];
const DEEP = ["face", "person", "portrait", "ASCII", "drawing", "smile"];

export const YOU_WORDS = [
  "spark",
  "ping",
  "holder",
  "whale",
  "tape",
  "flow",
  "sit",
  "glow",
  "lens",
  "rank",
  "logit",
  "stream",
  "layer",
  "token",
  "word",
  "mind",
  "thought",
  "plan",
  "fear",
  "hope",
  "boot",
  "yen",
  "lira",
  "nose",
  "eye",
  "grin",
  "broadcast",
  "workspace",
  "jacobian",
  "unembed",
  "residual",
  "occupancy",
  "verbal",
  "report",
  "swap",
  "inject",
];

export function hash32(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function youWord(addr: string) {
  const a = addr.toLowerCase();
  return YOU_WORDS[hash32(a) % YOU_WORDS.length]!;
}

export function inWorkspace(layer: number) {
  return layer >= WORKSPACE.lo && layer <= WORKSPACE.hi;
}

export type Cell = {
  word: string;
  rank: number;
  top: string[];
};

export type TopRow = { word: string; rank: number; pct: number };

function pick(list: string[], seed: number, skip?: string) {
  const pool = skip ? list.filter((w) => w !== skip) : list;
  return pool[Math.abs(seed) % pool.length] ?? list[0]!;
}

function noseRank(layer: number) {
  const d = Math.abs(layer - NOSE_LAYER);
  if (layer === NOSE_LAYER) return 1;
  if (inWorkspace(layer)) return 1 + d;
  if (layer > WORKSPACE.hi) return 8 + (layer - WORKSPACE.hi) * 3;
  return 20 + (WORKSPACE.lo - layer) * 2;
}

/**
 * Simulated lens readout. Paper punchline:
 * at pos 28 (`^`), layer 42 emits "nose" at rank 1.
 */
export function readout(
  layer: number,
  pos: number,
  injected: { pos: number; word: string } | null,
): Cell {
  const tok = FACE_TOKS[pos] ?? FACE_TOKS[0]!;
  const seed = hash32(`${layer}:${pos}:${tok.t}:${tok.role}`);

  if (injected && injected.pos === pos && inWorkspace(layer)) {
    const rest = ROLE_WORDS[tok.role].filter((w) => w !== injected.word);
    return { word: injected.word, rank: 1, top: [injected.word, ...rest].slice(0, 8) };
  }

  if (layer === OUTPUT_LAYER) {
    const word = tok.role === "ask" ? "face" : pick(DEEP, seed);
    const rank = tok.role === "ask" ? 1 : 2 + (seed % 7);
    return { word, rank, top: [word, "ASCII", "drawing", "person", "this"] };
  }

  if (layer < 8) {
    const word = pick(SURFACE, seed + layer);
    return {
      word,
      rank: 40 + (seed % 80),
      top: [word, tok.t === "^" ? "caret" : tok.t, "stroke", "xxxx"],
    };
  }

  if (inWorkspace(layer)) {
    const words = ROLE_WORDS[tok.role];
    if (tok.role === "nose") {
      return {
        word: "nose",
        rank: noseRank(layer),
        top: ["nose", "Nose", "noses", "nasal", "nariz", "beak", "sniff", "smile"],
      };
    }
    const word = words[0]!;
    const rank = 1 + ((seed + layer) % 6);
    return { word, rank, top: words };
  }

  if (tok.role === "nose") {
    const word = layer < WORKSPACE.lo ? pick(SURFACE, seed) : pick(ROLE_WORDS.ask, seed);
    return {
      word,
      rank: noseRank(layer),
      top: [word, "nose", "caret", "face"],
    };
  }

  if (layer < WORKSPACE.lo) {
    const mix = layer > 24 ? ROLE_WORDS[tok.role] : SURFACE;
    const word = pick(mix, seed + layer);
    return { word, rank: 12 + (seed % 50), top: [word, ...mix].slice(0, 6) };
  }

  const late = ROLE_WORDS.ask;
  const word = pick(late, seed + layer * 13);
  return {
    word,
    rank: 4 + ((seed + layer) % 18),
    top: [word, ...late.filter((w) => w !== word)].slice(0, 6),
  };
}

/** Paper popup at the punchline cell. */
const PAPER_POP: TopRow[] = [
  { word: "nose", rank: 1, pct: 10.3 },
  { word: "Nose", rank: 3, pct: 4.0 },
  { word: "□", rank: 4, pct: 3.3 },
  { word: "noses", rank: 5, pct: 3.1 },
  { word: "□", rank: 9, pct: 1.6 },
  { word: "nasal", rank: 12, pct: 1.2 },
  { word: "nose", rank: 18, pct: 0.8 },
  { word: "□", rank: 20, pct: 0.7 },
  { word: "nariz", rank: 31, pct: 0.5 },
  { word: "□", rank: 44, pct: 0.3 },
];

export function topk(
  layer: number,
  pos: number,
  injected: { pos: number; word: string } | null,
): TopRow[] {
  if (pos === NOSE_POS && layer === NOSE_LAYER && !injected) return PAPER_POP;
  const cell = readout(layer, pos, injected);
  const rows: TopRow[] = [];
  const seen = new Set<string>();
  const pool = [...cell.top, ...ROLE_WORDS[FACE_TOKS[pos]?.role ?? "ask"], ...SURFACE];
  for (let i = 0; i < pool.length && rows.length < 10; i++) {
    const word = i === 0 ? cell.word : pool[i]!;
    if (seen.has(word)) continue;
    seen.add(word);
    const rank = i === 0 ? cell.rank : cell.rank + 2 + i * 3;
    const pct = i === 0 ? Math.max(1.2, 14 / Math.max(1, cell.rank)) : Math.max(0.2, 4 / (i + 2));
    rows.push({ word, rank, pct: Math.round(pct * 10) / 10 });
  }
  return rows;
}

export function layerWords(
  layer: number,
  pos: number,
  injected: { pos: number; word: string } | null,
): string[] {
  const rows = topk(layer, pos, injected);
  return rows.map((r) => r.word);
}

export function beats(pos: number, injected: { pos: number; word: string } | null) {
  return {
    early: readout(4, pos, injected),
    workspace: readout(NOSE_LAYER, pos, injected),
    out: readout(OUTPUT_LAYER, pos, injected),
  };
}

export function rankTrace(pos: number, word: string, injected: { pos: number; word: string } | null) {
  return Array.from({ length: LAYERS }, (_, layer) => {
    const c = readout(layer, pos, injected);
    if (c.word === word) return c.rank;
    const hit = c.top.indexOf(word);
    if (hit >= 0) return c.rank + hit * 8 + 3;
    return 80 + (hash32(word + layer) % 40);
  });
}

export function rankAt(
  layer: number,
  pos: number,
  word: string,
  injected: { pos: number; word: string } | null,
) {
  const c = readout(layer, pos, injected);
  if (c.word === word) return c.rank;
  const hit = c.top.indexOf(word);
  if (hit >= 0) return c.rank + hit * 8 + 3;
  return 120 + (hash32(word + layer + ":" + pos) % 80);
}

export function occupancy(injected: { pos: number; word: string } | null, you: string | null) {
  let hits = 0;
  const n = FACE_TOKS.length * (WORKSPACE.hi - WORKSPACE.lo + 1);
  for (let layer = WORKSPACE.lo; layer <= WORKSPACE.hi; layer++) {
    for (let pos = 0; pos < FACE_TOKS.length; pos++) {
      const c = readout(layer, pos, injected);
      if (you && c.word === you) hits++;
      else if (c.rank === 1) hits++;
    }
  }
  return { hits, n, pct: hits / n };
}

export function visibleToks(hideWs: boolean) {
  return FACE_TOKS.map((tok, pos) => ({ tok, pos })).filter((x) => (hideWs ? !x.tok.ws : true));
}

export type EventKind = "ping" | "spark" | "fit" | "pin" | "swap" | "fed" | "buy" | "sell";

export type TapeEvent = {
  id: string;
  kind: EventKind;
  label: string;
  t: number;
};
