import { cn } from "@/lib/cn";
import { ASCII_ROWS, FACE_CLICK, FACE_TOKS, NOSE_POS } from "@/lib/jlens";
import { useEffect, useState } from "react";

export function AsciiFace({
  highlight,
  onPick,
}: {
  highlight: number;
  onPick: (pos: number) => void;
}) {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    let stop = false;
    let t: number;
    const loop = () => {
      t = window.setTimeout(() => {
        if (stop) return;
        setBlink(true);
        window.setTimeout(() => setBlink(false), 140);
        loop();
      }, 2800 + Math.floor(Math.random() * 2400));
    };
    loop();
    return () => {
      stop = true;
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div className="relative inline-block font-mono leading-[1.15] tracking-[0.08em] text-ink">
      <div className="ascii-face select-none">
        {ASCII_ROWS.map((row, r) => (
          <div key={r} className="whitespace-pre">
            {row.split("").map((ch, c) => {
              const hit = FACE_CLICK.find((x) => x.row === r && x.col === c);
              const on = hit?.pos === highlight;
              let glyph = ch;
              if (blink && (ch === "o" || ch === "O")) glyph = "-";
              if (!hit) {
                return (
                  <span key={c} className="inline-block w-[1ch] text-ink/70">
                    {glyph === " " ? "\u00a0" : glyph}
                  </span>
                );
              }
              return (
                <button
                  key={c}
                  type="button"
                  title={FACE_TOKS[hit.pos]?.role}
                  onClick={() => onPick(hit.pos)}
                  className={cn(
                    "relative inline-flex h-[1.15em] w-[1ch] items-center justify-center",
                    hit.pos === NOSE_POS && "text-pin",
                    on && "z-10",
                  )}
                >
                  {on ? (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute left-1/2 top-1/2 h-[1.35em] w-[1.35em] -translate-x-1/2 -translate-y-1/2 rounded-[4px] border-[1.5px] border-pin"
                    />
                  ) : null}
                  <span className="relative">{glyph}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <p className="mt-2 font-mono text-xs text-ink">What is this?</p>
    </div>
  );
}
