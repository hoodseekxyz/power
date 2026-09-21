import { FACE_TOKS, NOSE_I, type Role } from "@/lib/jlens";
import { roleInk, type Mood, type Sitter } from "@/lib/mood";

/**
 * ornek.png egg, short chords — not font glyphs.
 *
 *   /     \     upper
 *  /  ~ ~  \    brow
 * (  0   0  )
 * |    ^    |
 * |  \   /  |   smile inside
 *  \       /    lower  ← backslash on the left
 *   \     /
 *     ---
 *     | |
 */
type Stroke = { d: string; pos: number; role: Role };

const STROKES: Stroke[] = [
  { d: "M 80 20 H 120", pos: 5, role: "crown" },

  { d: "M 72 34 L 60 50", pos: 5, role: "arc" },
  { d: "M 128 34 L 140 50", pos: 15, role: "arc" },

  { d: "M 52 60 L 40 80", pos: 9, role: "arc" },
  { d: "M 148 60 L 160 80", pos: 16, role: "arc" },

  { d: "M 34 90 Q 24 108 34 126", pos: 18, role: "cheek" },
  { d: "M 166 90 Q 176 108 166 126", pos: 23, role: "cheek" },

  { d: "M 30 134 V 154", pos: 26, role: "jaw" },
  { d: "M 170 134 V 154", pos: 30, role: "jaw" },

  { d: "M 30 164 V 184", pos: 34, role: "jaw" },
  { d: "M 170 164 V 184", pos: 36, role: "jaw" },

  { d: "M 78 168 L 90 182", pos: 39, role: "mouth" },
  { d: "M 122 168 L 110 182", pos: 39, role: "mouth" },
  { d: "M 90 186 H 110", pos: 39, role: "mouth" },

  { d: "M 40 198 L 54 216", pos: 37, role: "chin" },
  { d: "M 160 198 L 146 216", pos: 40, role: "chin" },

  { d: "M 58 222 L 76 238", pos: 37, role: "chin" },
  { d: "M 142 222 L 124 238", pos: 40, role: "chin" },

  { d: "M 76 240 H 124", pos: 17, role: "chin" },

  { d: "M 86 250 V 266", pos: 32, role: "neck" },
  { d: "M 114 250 V 266", pos: 33, role: "neck" },
];

const FEATURES: { kind: "tilde" | "eye" | "caret"; x: number; y: number; pos: number; role: Role }[] = [
  { kind: "tilde", x: 70, y: 70, pos: 12, role: "brow" },
  { kind: "tilde", x: 130, y: 70, pos: 13, role: "brow" },
  { kind: "eye", x: 68, y: 104, pos: 20, role: "eye" },
  { kind: "eye", x: 132, y: 104, pos: 22, role: "eye" },
  { kind: "caret", x: 100, y: 132, pos: 28, role: "nose" },
];

function tildeD(cx: number, cy: number) {
  return `M ${cx - 10} ${cy} Q ${cx - 5} ${cy - 7} ${cx} ${cy} T ${cx + 10} ${cy}`;
}

function caretD(cx: number, cy: number) {
  return `M ${cx - 9} ${cy + 8} L ${cx} ${cy - 8} L ${cx + 9} ${cy + 8}`;
}

export const ANCHOR: { x: number; y: number; pos: number }[] = [
  { pos: 5, x: 100, y: 20 },
  { pos: 5, x: 66, y: 42 },
  { pos: 15, x: 134, y: 42 },
  { pos: 9, x: 46, y: 70 },
  { pos: 16, x: 154, y: 70 },
  { pos: 12, x: 70, y: 70 },
  { pos: 13, x: 130, y: 70 },
  { pos: 18, x: 30, y: 108 },
  { pos: 23, x: 170, y: 108 },
  { pos: 20, x: 68, y: 104 },
  { pos: 22, x: 132, y: 104 },
  { pos: 28, x: 100, y: 132 },
  { pos: 26, x: 30, y: 144 },
  { pos: 30, x: 170, y: 144 },
  { pos: 34, x: 30, y: 174 },
  { pos: 36, x: 170, y: 174 },
  { pos: 39, x: 100, y: 178 },
  { pos: 37, x: 50, y: 210 },
  { pos: 40, x: 150, y: 210 },
  { pos: 17, x: 100, y: 240 },
  { pos: 32, x: 86, y: 258 },
  { pos: 33, x: 114, y: 258 },
];

export function LivingFaceSvg({
  highlight,
  blink,
  sitters,
  onPick,
}: {
  highlight: number;
  blink: boolean;
  mood: Mood;
  sitters: Sitter[];
  onPick: (pos: number) => void;
}) {
  const sel = ANCHOR.find((a) => a.pos === highlight) ?? ANCHOR.find((a) => a.pos === NOSE_I)!;
  const inkOf = (role: Role) => 0.82 + 0.18 * roleInk(sitters, role);

  return (
    <svg
      viewBox="0 0 200 272"
      className="h-auto w-full max-w-[17rem] sm:max-w-[22rem] lg:max-w-[24rem]"
      role="img"
      aria-label="ASCII face specimen. Click a part to read the lens."
    >
      <title>the specimen</title>
      <g
        fill="none"
        stroke="var(--color-ink)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
      >
        {STROKES.map((s, i) => (
          <path key={i} d={s.d} style={{ opacity: inkOf(s.role) }} />
        ))}
        {FEATURES.filter((f) => f.kind === "tilde").map((f) => (
          <path key={f.pos} d={tildeD(f.x, f.y)} style={{ opacity: inkOf(f.role) }} />
        ))}
        <path d={caretD(100, 132)} style={{ opacity: inkOf("nose") }} />
      </g>

      {FEATURES.filter((f) => f.kind === "eye").map((f) => (
        <ellipse
          key={f.pos}
          cx={f.x}
          cy={f.y}
          rx={blink ? 8 : 8.2}
          ry={blink ? 1.2 : 9}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="2.4"
          style={{ opacity: inkOf("eye") }}
        />
      ))}

      <rect
        x={sel.x - 15}
        y={sel.y - 16}
        width="30"
        height="32"
        rx="7"
        fill="none"
        stroke="var(--color-pin)"
        strokeWidth="2.1"
        className="pointer-events-none"
      />

      {ANCHOR.map((a, i) => (
        <circle
          key={`${a.pos}-${i}`}
          cx={a.x}
          cy={a.y}
          r="16"
          fill="transparent"
          className="cursor-pointer"
          onClick={() => onPick(a.pos)}
        >
          <title>{FACE_TOKS[a.pos]?.role ?? FACE_TOKS[a.pos]?.t}</title>
        </circle>
      ))}
    </svg>
  );
}
