import { FACE_TOKS, NOSE_I } from "@/lib/jlens";
import { roleInk, type Mood, type Sitter } from "@/lib/mood";

/**
 * ornek.png is ASCII, not an illustration.
 * Typeset the same glyphs on a monospace grid. Do not draw an egg.
 */
const COL = 16;
const ROW = 26;
const OX = 36;
const OY = 32;
const FS = 30;

type Glyph = { ch: string; c: number; r: number; pos: number };

const GLYPHS: Glyph[] = [
  { ch: "─", c: 7, r: 0, pos: 5 },
  { ch: "─", c: 8, r: 0, pos: 5 },
  { ch: "─", c: 9, r: 0, pos: 5 },

  { ch: "/", c: 5, r: 1, pos: 5 },
  { ch: "\\", c: 11, r: 1, pos: 15 },

  { ch: "/", c: 3, r: 2.4, pos: 9 },
  { ch: "~", c: 6, r: 2.4, pos: 12 },
  { ch: "~", c: 10, r: 2.4, pos: 13 },
  { ch: "\\", c: 13, r: 2.4, pos: 16 },

  { ch: "(", c: 2, r: 4.2, pos: 18 },
  { ch: "0", c: 6, r: 4.2, pos: 20 },
  { ch: "0", c: 10, r: 4.2, pos: 22 },
  { ch: ")", c: 14, r: 4.2, pos: 23 },

  { ch: "|", c: 2, r: 5.8, pos: 26 },
  { ch: "^", c: 8, r: 6.2, pos: 28 },
  { ch: "|", c: 14, r: 5.8, pos: 30 },

  { ch: "|", c: 2, r: 7.8, pos: 34 },
  { ch: "\\", c: 6.2, r: 7.8, pos: 39 },
  { ch: "/", c: 9.8, r: 7.8, pos: 39 },
  { ch: "|", c: 14, r: 7.8, pos: 36 },

  { ch: "─", c: 7, r: 8.7, pos: 39 },
  { ch: "─", c: 8, r: 8.7, pos: 39 },
  { ch: "─", c: 9, r: 8.7, pos: 39 },

  { ch: "/", c: 4, r: 10.2, pos: 37 },
  { ch: "\\", c: 12, r: 10.2, pos: 40 },

  { ch: "/", c: 5.4, r: 11.5, pos: 37 },
  { ch: "\\", c: 10.6, r: 11.5, pos: 40 },

  { ch: "─", c: 6.5, r: 12.6, pos: 17 },
  { ch: "─", c: 7.5, r: 12.6, pos: 17 },
  { ch: "─", c: 8.5, r: 12.6, pos: 17 },
  { ch: "─", c: 9.5, r: 12.6, pos: 17 },

  { ch: "|", c: 7, r: 13.8, pos: 32 },
  { ch: "|", c: 9, r: 13.8, pos: 33 },
];

function gx(c: number) {
  return OX + c * COL;
}
function gy(r: number) {
  return OY + r * ROW;
}

export const ANCHOR = uniqueAnchors();

function uniqueAnchors() {
  const seen = new Map<number, { x: number; y: number; pos: number }>();
  for (const g of GLYPHS) {
    const prev = seen.get(g.pos);
    const x = gx(g.c);
    const y = gy(g.r);
    if (!prev) seen.set(g.pos, { x, y, pos: g.pos });
    else seen.set(g.pos, { x: (prev.x + x) / 2, y: (prev.y + y) / 2, pos: g.pos });
  }
  return [...seen.values()];
}

export function LivingFaceSvg({
  highlight,
  blink,
  mood,
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
  const nose = GLYPHS.find((g) => g.ch === "^")!;

  return (
    <svg
      viewBox="0 0 280 420"
      className="h-auto w-full max-w-[17rem] sm:max-w-[22rem] lg:max-w-[24rem]"
      role="img"
      aria-label="ASCII face specimen. Click a part to read the lens."
    >
      <title>the specimen</title>
      <g
        fontFamily="var(--font-mono), ui-monospace, monospace"
        fontSize={FS}
        fontWeight={500}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {GLYPHS.map((g, i) => {
          const tok = FACE_TOKS[g.pos];
          const ink = 0.78 + 0.22 * roleInk(sitters, tok?.role ?? "ask");
          const ch = g.ch === "0" && blink ? "-" : g.ch;
          const size = g.ch === "0" || (g.ch === "-" && blink) ? FS * 1.2 : FS;
          return (
            <text
              key={`${g.ch}-${i}`}
              x={gx(g.c)}
              y={gy(g.r)}
              fontSize={size}
              fill="var(--color-ink)"
              fillOpacity={ink}
              className="cursor-pointer select-none"
              onClick={() => onPick(g.pos)}
            >
              {ch}
            </text>
          );
        })}
      </g>

      <rect
        x={gx(nose.c) - 15}
        y={gy(nose.r) - 16}
        width="30"
        height="32"
        rx="7"
        fill="none"
        stroke="var(--color-pin)"
        strokeWidth="2.2"
        className="pointer-events-none"
        opacity={highlight === NOSE_I || highlight === nose.pos ? 1 : 0.35}
      />
      {highlight !== NOSE_I && highlight !== nose.pos ? (
        <rect
          x={sel.x - 16}
          y={sel.y - 16}
          width="32"
          height="32"
          rx="8"
          fill="none"
          stroke="var(--color-pin)"
          strokeWidth="2.2"
          className="pointer-events-none"
        />
      ) : null}

      {ANCHOR.map((a) => (
        <circle
          key={a.pos}
          cx={a.x}
          cy={a.y}
          r="18"
          fill="transparent"
          className="cursor-pointer"
          onClick={() => onPick(a.pos)}
        >
          <title>{FACE_TOKS[a.pos]?.role}</title>
        </circle>
      ))}
    </svg>
  );
}
