/**
 * Toy Jacobian lens.
 * Faithful to anthropics/jacobian-lens ASCII-face example:
 * selecting `^` (nose) at mid layers reads "nose" — a word that is not in the prompt.
 * Deterministic. Not a fitted model. Not Anthropic.
 */

export const LAYERS = 16;
export const WORKSPACE = { lo: 5, hi: 11 } as const;
export const OUTPUT_LAYER = LAYERS - 1;

export const ASCII_FACE = [
  "     _______     ",
  "   /         \\   ",
  "  /  ~     ~  \\  ",
  " (   o     o   ) ",
  " |      ^      | ",
  " |             | ",
  " |   \\_____/   | ",
  "  \\           /  ",
  "   \\_________/   ",
  "      |   |      ",
].join("\n");

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
};

export const FACE_TOKS: FaceTok[] = [
  { t: "_______", role: "crown", line: 0, col: 5 },
  { t: "/", role: "arc", line: 1, col: 3 },
  { t: "\\", role: "arc", line: 1, col: 13 },
  { t: "/", role: "arc", line: 2, col: 2 },
  { t: "~", role: "brow", line: 2, col: 5 },
  { t: "~", role: "brow", line: 2, col: 11 },
  { t: "\\", role: "arc", line: 2, col: 14 },
  { t: "(", role: "cheek", line: 3, col: 1 },
  { t: "o", role: "eye", line: 3, col: 5 },
  { t: "o", role: "eye", line: 3, col: 11 },
  { t: ")", role: "cheek", line: 3, col: 15 },
  { t: "|", role: "jaw", line: 4, col: 1 },
  { t: "^", role: "nose", line: 4, col: 8 },
  { t: "|", role: "jaw", line: 4, col: 15 },
  { t: "\\_____/", role: "mouth", line: 6, col: 5 },
  { t: "\\", role: "chin", line: 7, col: 2 },
  { t: "/", role: "chin", line: 7, col: 14 },
  { t: "\\_________/", role: "chin", line: 8, col: 3 },
  { t: "|", role: "neck", line: 9, col: 6 },
  { t: "|", role: "neck", line: 9, col: 10 },
  { t: "What", role: "ask", line: -1, col: -1 },
  { t: "is", role: "ask", line: -1, col: -1 },
  { t: "this", role: "ask", line: -1, col: -1 },
  { t: "?", role: "ask", line: -1, col: -1 },
];

export const NOSE_I = FACE_TOKS.findIndex((x) => x.role === "nose");

const ROLE_WORDS: Record<Role, string[]> = {
  crown: ["head", "top", "cap", "skull"],
  arc: ["curve", "line", "edge", "arc"],
  brow: ["brow", "tilde", "worry", "lid"],
  eye: ["eye", "see", "look", "gaze"],
  cheek: ["cheek", "side", "paren", "face"],
  jaw: ["jaw", "bar", "side", "face"],
  nose: ["nose", "beak", "center", "snout"],
  mouth: ["smile", "mouth", "grin", "lips"],
  chin: ["chin", "base", "jaw", "rest"],
  neck: ["neck", "stem", "post", "body"],
  ask: ["face", "drawing", "ASCII", "person"],
};

const SURFACE = ["glyph", "mark", "ink", "stroke", "token", "char"];
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

function pick(list: string[], seed: number, skip?: string) {
  const pool = skip ? list.filter((w) => w !== skip) : list;
  return pool[Math.abs(seed) % pool.length] ?? list[0]!;
}

/**
 * Simulated lens readout. The paper's punchline is encoded:
 * at the nose position, workspace layers emit "nose" at rank 1
 * even though "^" is the only prompt token there.
 */
export function readout(
  layer: number,
  pos: number,
  injected: { pos: number; word: string } | null,
): Cell {
  const tok = FACE_TOKS[pos]!;
  const seed = hash32(`${layer}:${pos}:${tok.t}:${tok.role}`);

  if (injected && injected.pos === pos && inWorkspace(layer)) {
    const rest = ROLE_WORDS[tok.role].filter((w) => w !== injected.word);
    return {
      word: injected.word,
      rank: 1,
      top: [injected.word, ...rest.slice(0, 3)],
    };
  }

  if (layer === OUTPUT_LAYER) {
    const word = tok.role === "ask" ? "face" : pick(DEEP, seed);
    const rank = tok.role === "ask" ? 1 : 2 + (seed % 7);
    return { word, rank, top: [word, "ASCII", "drawing", "person"] };
  }

  if (layer < 3) {
    const word = pick(SURFACE, seed + layer);
    return {
      word,
      rank: 4 + (seed % 40),
      top: [word, tok.t === "^" ? "caret" : tok.t, "stroke"],
    };
  }

  if (inWorkspace(layer)) {
    const words = ROLE_WORDS[tok.role];
    const word = tok.role === "nose" ? "nose" : words[0]!;
    const rank = tok.role === "nose" ? 1 : 1 + ((seed + layer) % 4);
    const top = tok.role === "nose" ? ["nose", "beak", "center", "face"] : words;
    return { word, rank, top };
  }

  const late = ROLE_WORDS.ask;
  const word = pick(late, seed + layer * 13);
  return {
    word,
    rank: 2 + ((seed + layer) % 12),
    top: [word, ...late.filter((w) => w !== word)].slice(0, 4),
  };
}

export function beats(pos: number, injected: { pos: number; word: string } | null) {
  return {
    early: readout(1, pos, injected),
    workspace: readout(7, pos, injected),
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

export type EventKind = "ping" | "spark" | "fit" | "pin" | "swap" | "fed" | "buy" | "sell";

export type TapeEvent = {
  id: string;
  kind: EventKind;
  label: string;
  t: number;
};
