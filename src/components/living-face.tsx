import { FACE_TOKS, NOSE_I, type Role } from "@/lib/jlens";
import { lerp, roleInk, type Mood, type Sitter } from "@/lib/mood";
import { useEffect, useRef } from "react";

/** Landmarks matching ornek.png, keyed to FACE_TOKS (pos 28 = ^). */
export const ANCHOR: { x: number; y: number; pos: number }[] = [
  { pos: 5, x: 100, y: 20 },
  { pos: 5, x: 68, y: 38 },
  { pos: 15, x: 132, y: 38 },
  { pos: 9, x: 48, y: 64 },
  { pos: 16, x: 152, y: 64 },
  { pos: 12, x: 70, y: 72 },
  { pos: 13, x: 130, y: 72 },
  { pos: 18, x: 30, y: 104 },
  { pos: 23, x: 170, y: 104 },
  { pos: 20, x: 68, y: 104 },
  { pos: 22, x: 132, y: 104 },
  { pos: 28, x: 100, y: 132 },
  { pos: 26, x: 28, y: 140 },
  { pos: 30, x: 172, y: 140 },
  { pos: 34, x: 30, y: 172 },
  { pos: 36, x: 170, y: 172 },
  { pos: 37, x: 54, y: 198 },
  { pos: 40, x: 146, y: 198 },
  { pos: 39, x: 100, y: 188 },
  { pos: 32, x: 86, y: 256 },
  { pos: 33, x: 114, y: 256 },
];

function tilde(cx: number, cy: number, alert: number) {
  const lift = -4 * alert;
  return `M ${cx - 10} ${cy + lift} Q ${cx - 5} ${cy - 7 + lift} ${cx} ${cy + lift} T ${cx + 10} ${cy + lift}`;
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
  const leftEyeRef = useRef<SVGEllipseElement>(null);
  const rightEyeRef = useRef<SVGEllipseElement>(null);
  const smileL = useRef<SVGPathElement>(null);
  const smileR = useRef<SVGPathElement>(null);
  const smileBar = useRef<SVGPathElement>(null);
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
      const drop = 10 + 10 * smile;
      if (smileL.current) smileL.current.setAttribute("d", `M 76 ${168} L 88 ${168 + drop}`);
      if (smileR.current) smileR.current.setAttribute("d", `M 124 ${168} L 112 ${168 + drop}`);
      if (smileBar.current) smileBar.current.setAttribute("d", `M 88 ${170 + drop} H 112`);
      const ry = blink ? 1.2 : 7.6 + 2.4 * open;
      const rx = 7.2 + 1.6 * open;
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

  const inkOf = (role: Role) => 0.72 + 0.28 * roleInk(sitters, role);
  const sel = ANCHOR.find((a) => a.pos === highlight) ?? ANCHOR.find((a) => a.pos === NOSE_I)!;

  return (
    <svg
      viewBox="0 0 200 270"
      className="h-auto w-full max-w-[17rem] sm:max-w-[24rem] lg:max-w-[26rem]"
      role="img"
      aria-label="ASCII face specimen. Click a part to read the lens."
    >
      <title>the specimen</title>

      <g
        fill="none"
        stroke="var(--color-ink)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.45"
      >
        <path d="M 78 20 H 122" style={{ opacity: inkOf("crown") }} />
        <path d="M 62 46 L 74 32" style={{ opacity: inkOf("arc") }} />
        <path d="M 126 32 L 138 46" style={{ opacity: inkOf("arc") }} />
        <path d="M 42 74 L 54 56" style={{ opacity: inkOf("arc") }} />
        <path d="M 146 56 L 158 74" style={{ opacity: inkOf("arc") }} />
        <path d="M 38 86 Q 26 104 38 122" style={{ opacity: inkOf("cheek") }} />
        <path d="M 162 86 Q 174 104 162 122" style={{ opacity: inkOf("cheek") }} />
        <path d="M 28 130 V 150" style={{ opacity: inkOf("jaw") }} />
        <path d="M 172 130 V 150" style={{ opacity: inkOf("jaw") }} />
        <path d="M 30 162 V 182" style={{ opacity: inkOf("jaw") }} />
        <path d="M 170 162 V 182" style={{ opacity: inkOf("jaw") }} />
        <path d="M 46 202 L 60 184" style={{ opacity: inkOf("chin") }} />
        <path d="M 140 184 L 154 202" style={{ opacity: inkOf("chin") }} />
        <path d="M 62 224 L 78 238" style={{ opacity: inkOf("chin") }} />
        <path d="M 122 238 L 138 224" style={{ opacity: inkOf("chin") }} />
        <path d="M 78 240 H 122" style={{ opacity: inkOf("chin") }} />
        <path d="M 86 248 V 266" style={{ opacity: inkOf("neck") }} />
        <path d="M 114 248 V 266" style={{ opacity: inkOf("neck") }} />

        <path d={tilde(70, 72, mood.alert)} style={{ opacity: inkOf("brow") }} />
        <path d={tilde(130, 72, mood.alert)} style={{ opacity: inkOf("brow") }} />

        <path ref={smileL} d="M 76 168 L 88 182" style={{ opacity: Math.max(0.7, inkOf("mouth")) }} />
        <path ref={smileR} d="M 124 168 L 112 182" style={{ opacity: Math.max(0.7, inkOf("mouth")) }} />
        <path ref={smileBar} d="M 88 184 H 112" style={{ opacity: Math.max(0.7, inkOf("mouth")) }} />
      </g>

      <ellipse
        ref={leftEyeRef}
        cx="68"
        cy="104"
        rx="8.2"
        ry="9"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="2.45"
        style={{ opacity: Math.max(0.75, inkOf("eye")) }}
      />
      <ellipse
        ref={rightEyeRef}
        cx="132"
        cy="104"
        rx="8.2"
        ry="9"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="2.45"
        style={{ opacity: Math.max(0.75, inkOf("eye")) }}
      />

      <path
        d="M 100 122 L 91.5 138 H 108.5 Z"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="2.3"
        strokeLinejoin="round"
      />

      <rect
        x={sel.x - 16}
        y={sel.y - 16}
        width="32"
        height="32"
        rx="7"
        fill="none"
        stroke="var(--color-pin)"
        strokeWidth="2"
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

