import { cn } from "@/lib/cn";
import { ASCII_FACE, FACE_TOKS, NOSE_I } from "@/lib/jlens";

/** Paper's ASCII face. `^` is the nose. */
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
      viewBox="0 0 40 44"
      width={size}
      height={Math.round(size * 1.1)}
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <rect width="40" height="44" rx="4" fill="var(--color-ink)" />
      <g fill="none" stroke="var(--color-paper)" strokeWidth="1.4" strokeLinecap="round">
        <path d="M11 9h18" />
        <path d="M8 12.5c0-2.2 3.2-4.2 12-4.2s12 2 12 4.2" />
      </g>
      <circle cx="14.2" cy="20" r="1.85" fill="var(--color-paper)" />
      <circle cx="25.8" cy="20" r="1.85" fill="var(--color-paper)" />
      <path
        d="M20 23 L18.1 26.7 L21.9 26.7 Z"
        fill={lit ? "var(--color-ws)" : "var(--color-paper)"}
      />
      <path
        d="M13.5 31.2c2.2 2.6 10.8 2.6 13 0"
        fill="none"
        stroke="var(--color-paper)"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
      <path d="M17 38.2v4M23 38.2v4" stroke="var(--color-paper)" strokeWidth="1.4" />
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
                    ? "bg-ws text-paper"
                    : chunk.pos === NOSE_I
                      ? "text-ws hover:bg-ws/15"
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
