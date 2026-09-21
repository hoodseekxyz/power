import { FACE_TOKS, NOSE_I, type Role } from "@/lib/jlens";
import { lerp, roleInk, type Mood, type Sitter } from "@/lib/mood";
import { useEffect, useRef } from "react";

/** Paper-faithful landmarks for the ASCII face, in viewBox 0 0 200 250. */
export const ANCHOR: { x: number; y: number; pos: number }[] = [
  { pos: 0, x: 100, y: 26 },
  { pos: 1, x: 58, y: 46 },
  { pos: 2, x: 142, y: 46 },
  { pos: 3, x: 42, y: 70 },
  { pos: 4, x: 70, y: 68 },
  { pos: 5, x: 130, y: 68 },
  { pos: 6, x: 158, y: 70 },
  { pos: 7, x: 32, y: 100 },
  { pos: 8, x: 70, y: 98 },
  { pos: 9, x: 130, y: 98 },
  { pos: 10, x: 168, y: 100 },
  { pos: 11, x: 36, y: 130 },
  { pos: 12, x: 100, y: 122 },
  { pos: 13, x: 164, y: 130 },
  { pos: 14, x: 100, y: 160 },
  { pos: 15, x: 56, y: 186 },
  { pos: 16, x: 144, y: 186 },
  { pos: 17, x: 100, y: 204 },
  { pos: 18, x: 86, y: 226 },
  { pos: 19, x: 114, y: 226 },
];

const EGG =
  "M100 22 C148 22 170 68 170 118 C170 168 138 204 100 204 C62 204 30 168 30 118 C30 68 52 22 100 22";

function mouthD(smile: number) {
  const y = 160;
  const drop = 20 * smile;
  return `M 70 ${y - drop * 0.12} Q 100 ${y + drop} 130 ${y - drop * 0.12}`;
}

function browD(cx: number, cy: number, alert: number) {
  const lift = -7 * alert;
  return `M ${cx - 11} ${cy + 3 + lift * 0.15} Q ${cx - 3} ${cy - 7 + lift} ${cx + 2} ${cy + 2 + lift * 0.25} T ${cx + 11} ${cy + 1 + lift * 0.1}`;
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
      const ry = blink ? 1.15 : 3.2 + 5.6 * open;
      const rx = 4.2 + 4.4 * open;
      for (const el of [leftEyeRef.current, rightEyeRef.current]) {
        if (!el) continue;
        el.setAttribute("rx", String(rx));
        el.setAttribute("ry", String(ry));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blink]);

  const inkOf = (role: Role) => 0.22 + 0.78 * roleInk(sitters, role);
  const sel = ANCHOR.find((a) => a.pos === highlight) ?? ANCHOR.find((a) => a.pos === NOSE_I)!;

  return (
    <svg
      viewBox="0 0 200 250"
      className="h-auto w-full max-w-[16.5rem] sm:max-w-[24rem] lg:max-w-[28rem]"
      role="img"
      aria-label="ASCII face specimen. Click a part to read the lens."
    >
      <title>the specimen</title>

      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path
          d={EGG}
          strokeWidth="2.2"
          strokeDasharray="8 13"
          className="text-ink/45"
        />
        <path
          d={EGG}
          strokeWidth="2.35"
          className="text-ink face-stroke"
          style={{ opacity: mood.ink }}
        />
        <path d="M 86 210 V 238" strokeWidth="2.2" className="text-ink/70" style={{ opacity: 0.35 + 0.65 * inkOf("neck") }} />
        <path d="M 114 210 V 238" strokeWidth="2.2" className="text-ink/70" style={{ opacity: 0.35 + 0.65 * inkOf("neck") }} />
        <path
          d={browD(70, 68, mood.alert)}
          strokeWidth="2.3"
          className="text-ink face-stroke"
          style={{ opacity: inkOf("brow") }}
        />
        <path
          d={browD(130, 68, mood.alert)}
          strokeWidth="2.3"
          className="text-ink face-stroke"
          style={{ opacity: inkOf("brow") }}
        />
        <path
          ref={mouthRef}
          d={mouthD(mood.smile)}
          strokeWidth="2.5"
          className="text-ink face-stroke"
          style={{ opacity: Math.max(0.35, inkOf("mouth")) }}
        />
      </g>

      <ellipse
        ref={leftEyeRef}
        cx="70"
        cy="98"
        rx="7.5"
        ry="7.5"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="2.3"
        style={{ opacity: Math.max(0.4, inkOf("eye")) }}
      />
      <ellipse
        ref={rightEyeRef}
        cx="130"
        cy="98"
        rx="7.5"
        ry="7.5"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="2.3"
        style={{ opacity: Math.max(0.4, inkOf("eye")) }}
      />

      <path
        d="M 100 112 L 91.5 128 H 108.5 Z"
        fill="none"
        stroke="var(--color-ws)"
        strokeWidth="2.4"
        strokeLinejoin="round"
        className="face-stroke"
        style={{ opacity: Math.max(0.6, inkOf("nose")) }}
      />

      <rect
        x={sel.x - 16}
        y={sel.y - 16}
        width="32"
        height="32"
        rx="7"
        fill="none"
        stroke="var(--color-ws)"
        strokeWidth="1.85"
        className="pointer-events-none"
        style={{ opacity: mood.glow ? 1 : 0.92 }}
      />

      {sitters.map((s) => {
        const a = ANCHOR.find((x) => x.pos === s.pos);
        if (!a) return null;
        return (
          <circle
            key={s.id}
            cx={a.x + (hashJitter(s.id, 0) - 4)}
            cy={a.y + (hashJitter(s.id, 1) - 4)}
            r={s.you ? 3.4 : 2.3 + Math.min(1.8, s.weight)}
            fill={s.you ? "var(--color-ws)" : "var(--color-ink)"}
            className="pointer-events-none"
            opacity={s.you ? 1 : 0.5}
          />
        );
      })}

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

function hashJitter(id: string, lane: number) {
  let h = 2166136261 ^ lane;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 9;
}
