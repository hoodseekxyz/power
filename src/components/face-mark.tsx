import { cn } from "@/lib/cn";
import { ASCII_FACE, FACE_TOKS, NOSE_I } from "@/lib/jlens";

/** Header mark: ornek.png egg, white tile, magenta plate on ^. */
export function FaceMark({
  className,
  size = 40,
  lit,
}: {
  className?: string;
  size?: number;
  lit?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 40 48"
      width={size}
      height={Math.round(size * 1.2)}
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <rect width="40" height="48" rx="6" fill="var(--color-paper)" stroke="var(--color-line)" strokeWidth="1" />
      <g
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 4.5 H24" />
        <path d="M14.2 7.2 L12.2 10" />
        <path d="M25.8 7.2 L27.8 10" />
        <path d="M10.8 12 L8.6 16" />
        <path d="M29.2 12 L31.4 16" />
        <path d="M8.2 18 Q6.4 21.5 8.2 25" />
        <path d="M31.8 18 Q33.6 21.5 31.8 25" />
        <path d="M7.6 26.5 V30" />
        <path d="M32.4 26.5 V30" />
        <path d="M7.6 32 V35.2" />
        <path d="M32.4 32 V35.2" />
        <path d="M15.4 32.2 L17.6 35" />
        <path d="M24.6 32.2 L22.4 35" />
        <path d="M17.6 35.6 H22.4" />
        <path d="M9.6 37.4 L12.4 40.6" />
        <path d="M30.4 37.4 L27.6 40.6" />
        <path d="M13 41.4 L16.2 44.2" />
        <path d="M27 41.4 L23.8 44.2" />
        <path d="M16.2 44.6 H23.8" />
        <path d="M17.6 46 V47.4" />
        <path d="M22.4 46 V47.4" />
        <path d="M13.6 14 Q14.6 12.6 15.6 14 T17.6 14" />
        <path d="M22.4 14 Q23.4 12.6 24.4 14 T26.4 14" />
        <path d="M18.4 25.2 L20 22.2 L21.6 25.2" />
      </g>
      <ellipse cx="14.2" cy="20.4" rx="1.7" ry="1.85" fill="none" stroke="var(--color-ink)" strokeWidth="1.3" />
      <ellipse cx="25.8" cy="20.4" rx="1.7" ry="1.85" fill="none" stroke="var(--color-ink)" strokeWidth="1.3" />
      <rect
        x="16.6"
        y="21.2"
        width="6.8"
        height="6.6"
        rx="1.5"
        fill="none"
        stroke="var(--color-pin)"
        strokeWidth={lit ? 1.7 : 1.45}
      />
    </svg>
  );
}

export function LivingFace({
  highlight,
  blink,
  onPick,
}: {
  highlight: number | null;
  blink?: boolean;
  onPick: (pos: number) => void;
}) {
  const lines = ASCII_FACE.split("\n");
  const hits = FACE_TOKS.map((tok, i) => ({ i, tok })).filter((x) => x.tok.line >= 0);

  return (
    <pre className="ascii-face text-ink select-none">
      {lines.map((line, li) => (
        <div key={li} className="whitespace-pre">
          {splitLine(line, hits.filter((h) => h.tok.line === li)).map((chunk, k) =>
            chunk.pos == null ? (
              <span key={k}>{chunk.text}</span>
            ) : (
              <button
                key={k}
                type="button"
                onClick={() => onPick(chunk.pos!)}
                title={FACE_TOKS[chunk.pos]?.role}
                className={cn(
                  "rounded-sm px-px transition-colors duration-150 ease-out active:scale-[0.96]",
                  highlight === chunk.pos
                    ? "bg-pin text-paper"
                    : chunk.pos === NOSE_I
                      ? "text-pin hover:bg-pin/15"
                      : "hover:bg-ink/8",
                )}
              >
                {blink && FACE_TOKS[chunk.pos]?.role === "eye" ? "-" : chunk.text}
              </button>
            ),
          )}
        </div>
      ))}
    </pre>
  );
}

function splitLine(
  line: string,
  hits: { i: number; tok: (typeof FACE_TOKS)[number] }[],
) {
  const sorted = [...hits].sort((a, b) => a.tok.col - b.tok.col);
  const out: { text: string; pos: number | null }[] = [];
  let cursor = 0;
  for (const h of sorted) {
    const start = h.tok.col;
    const len = h.tok.t.length;
    if (start > cursor) out.push({ text: line.slice(cursor, start), pos: null });
    out.push({ text: line.slice(start, start + len) || h.tok.t, pos: h.i });
    cursor = start + len;
  }
  if (cursor < line.length) out.push({ text: line.slice(cursor), pos: null });
  return out;
}
