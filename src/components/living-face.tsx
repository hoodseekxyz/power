import { cn } from "@/lib/cn";
import { FACE_TOKS, NOSE_I, type Role } from "@/lib/jlens";
import { lerp, posInk, roleInk, type Mood, type Sitter } from "@/lib/mood";
import { useEffect, useRef } from "react";

/** Paper-faithful landmarks for the ASCII face, in viewBox 0 0 200 250. */
export const ANCHOR: { x: number; y: number; pos: number }[] = [
  { pos: 0, x: 100, y: 28 },
  { pos: 1, x: 62, y: 44 },
  { pos: 2, x: 138, y: 44 },
  { pos: 3, x: 48, y: 62 },
  { pos: 4, x: 70, y: 66 },
  { pos: 5, x: 130, y: 66 },
  { pos: 6, x: 152, y: 62 },
  { pos: 7, x: 36, y: 96 },
  { pos: 8, x: 70, y: 96 },
  { pos: 9, x: 130, y: 96 },
  { pos: 10, x: 164, y: 96 },
  { pos: 11, x: 38, y: 124 },
  { pos: 12, x: 100, y: 122 },
  { pos: 13, x: 162, y: 124 },
  { pos: 14, x: 100, y: 158 },
  { pos: 15, x: 58, y: 184 },
  { pos: 16, x: 142, y: 184 },
  { pos: 17, x: 100, y: 198 },
  { pos: 18, x: 86, y: 222 },
  { pos: 19, x: 114, y: 222 },
];

function mouthD(smile: number) {
  const y = 158;
  const drop = 18 * smile;
  return `M 68 ${y - drop * 0.15} Q 100 ${y + drop} 132 ${y - drop * 0.15}`;
}

function browD(cx: number, cy: number, alert: number, side: 1 | -1) {
  const lift = -6 * alert;
  const k = 7;
  return `M ${cx - 10} ${cy + 2 + lift * 0.2} Q ${cx - 2} ${cy - 6 + lift} ${cx + 2} ${cy + 1 + lift * 0.3} T ${cx + 10} ${cy + 1 + lift * 0.15 * side}`;
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
  const mouthRef = useRef<SVGPathElement>(null);
  const leftEyeRef = useRef<SVGEllipseElement>(null);
  const rightEyeRef = useRef<SVGEllipseElement>(null);
  const target = useRef(mood);
  target.current = mood;

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let smile = mood.smile;
    let open = mood.open;
    let raf = 0;
    const tick = () => {
      const t = reduced ? 1 : 0.14;
      smile = lerp(smile, target.current.smile, t);
      open = lerp(open, target.current.open, t);
      if (mouthRef.current) mouthRef.current.setAttribute("d", mouthD(smile));
      const ry = blink ? 1.2 : 2.2 + 7.4 * open;
      const rx = 3.4 + 5.2 * open;
      for (const el of [leftEyeRef.current, rightEyeRef.current]) {
        if (!el) continue;
        el.setAttribute("rx", String(rx));
        el.setAttribute("ry", String(ry));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // mood is read via ref; blink is the only render-driven snap
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blink]);

  const inkOf = (role: Role) => 0.18 + 0.82 * roleInk(sitters, role);
  const sel = ANCHOR.find((a) => a.pos === highlight) ?? ANCHOR.find((a) => a.pos === NOSE_I)!;

  return (
    <svg
      viewBox="0 0 200 250"
      className="h-auto w-full max-w-[16.5rem] sm:max-w-[24rem] lg:max-w-[28rem]"
      role="img"
      aria-label="ASCII face specimen. Click a part to read the lens."
    >
      <title>the specimen</title>

      {/* underdrawing — the paper's dashed sketch, always there */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="7 11"
        className="text-ink/35"
      >
        <path d="M 78 26 H 122" />
        <path d="M 78 26 L 54 48" />
        <path d="M 122 26 L 146 48" />
        <path d="M 50 56 L 38 88" />
        <path d="M 150 56 L 162 88" />
        <path d="M 34 100 V 138" />
        <path d="M 166 100 V 138" />
        <path d="M 36 148 L 58 178" />
        <path d="M 164 148 L 142 178" />
        <path d="M 64 190 H 136" />
        <path d="M 86 210 V 236" />
        <path d="M 114 210 V 236" />
        <path d={browD(70, 66, 0, -1)} />
        <path d={browD(130, 66, 0, 1)} />
        <path d={mouthD(0.35)} />
      </g>

      {/* ink — holders paint the same strokes solid */}
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-ink"
      >
        <Contour pos={0} d="M 78 26 H 122" sitters={sitters} onPick={onPick} />
        <Contour pos={1} d="M 78 26 L 54 48" sitters={sitters} onPick={onPick} />
        <Contour pos={2} d="M 122 26 L 146 48" sitters={sitters} onPick={onPick} />
        <Contour pos={3} d="M 50 56 L 38 88" sitters={sitters} onPick={onPick} />
        <Contour pos={6} d="M 150 56 L 162 88" sitters={sitters} onPick={onPick} />
        <Contour pos={7} d="M 34 100 V 138" sitters={sitters} onPick={onPick} />
        <Contour pos={10} d="M 166 100 V 138" sitters={sitters} onPick={onPick} />
        <Contour pos={11} d="M 36 148 L 58 178" sitters={sitters} onPick={onPick} />
        <Contour pos={13} d="M 164 148 L 142 178" sitters={sitters} onPick={onPick} />
        <Contour pos={15} d="M 64 190 H 100" sitters={sitters} onPick={onPick} />
        <Contour pos={16} d="M 100 190 H 136" sitters={sitters} onPick={onPick} />
        <Contour pos={17} d="M 70 198 H 130" sitters={sitters} onPick={onPick} />
        <Contour pos={18} d="M 86 210 V 236" sitters={sitters} onPick={onPick} />
        <Contour pos={19} d="M 114 210 V 236" sitters={sitters} onPick={onPick} />

        <path
          d={browD(70, 66, mood.alert, -1)}
          strokeWidth="2.4"
          className="face-stroke"
          style={{ opacity: inkOf("brow") }}
        />
        <path
          d={browD(130, 66, mood.alert, 1)}
          strokeWidth="2.4"
          className="face-stroke"
          style={{ opacity: inkOf("brow") }}
        />
        <path
          ref={mouthRef}
          d={mouthD(mood.smile)}
          strokeWidth="2.6"
          className="face-stroke"
          style={{ opacity: Math.max(0.25, inkOf("mouth")) }}
        />
      </g>

      {/* eyes */}
      <ellipse
        ref={leftEyeRef}
        cx="70"
        cy="96"
        rx="7"
        ry="7"
        className="fill-ink"
        style={{ opacity: Math.max(0.35, inkOf("eye")) }}
      />
      <ellipse
        ref={rightEyeRef}
        cx="130"
        cy="96"
        rx="7"
        ry="7"
        className="fill-ink"
        style={{ opacity: Math.max(0.35, inkOf("eye")) }}
      />

      {/* nose caret — the paper's selected token */}
      <path
        d="M 100 112 L 91.5 128 H 108.5 Z"
        fill="none"
        stroke="var(--color-ws)"
        strokeWidth="2.4"
        strokeLinejoin="round"
        className="face-stroke"
        style={{ opacity: Math.max(0.55, inkOf("nose")) }}
      />

      {/* selection plate, like the paper's highlighted ^ */}
      <rect
        x={sel.x - 16}
        y={sel.y - 16}
        width="32"
        height="32"
        rx="7"
        fill="none"
        stroke="var(--color-ws)"
        strokeWidth="1.8"
        className="pointer-events-none origin-center transition-[x,y] duration-300 ease-out"
        style={{ opacity: mood.glow ? 1 : 0.9 }}
      />

      {/* sitters as ticks on the contour */}
      {sitters.map((s) => {
        const a = ANCHOR.find((x) => x.pos === s.pos);
        if (!a) return null;
        const you = s.you;
        return (
          <circle
            key={s.id}
            cx={a.x + (hashJitter(s.id, 0) - 4)}
            cy={a.y + (hashJitter(s.id, 1) - 4)}
            r={you ? 3.6 : 2.4 + Math.min(2, s.weight)}
            fill={you ? "var(--color-ws)" : "var(--color-ink)"}
            className="pointer-events-none"
            opacity={you ? 1 : 0.55}
          />
        );
      })}

      {/* invisible hit targets — 44px-class on the scaled svg */}
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

function Contour({
  pos,
  d,
  sitters,
  onPick,
}: {
  pos: number;
  d: string;
  sitters: Sitter[];
  onPick: (pos: number) => void;
}) {
  const ink = posInk(sitters, pos);
  return (
    <path
      d={d}
      strokeWidth={2.1 + 1.6 * ink}
      className="face-stroke cursor-pointer"
      style={{ opacity: 0.12 + 0.88 * ink }}
      onClick={() => onPick(pos)}
    />
  );
}

function hashJitter(id: string, lane: number) {
  let h = 2166136261 ^ lane;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 9;
}
