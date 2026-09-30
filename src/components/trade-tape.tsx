import { SITE } from "@/lib/site";
import type { Print } from "@/lib/trades";

export function compact(n: number) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
  if (n >= 1) return n.toFixed(2);
  return n.toFixed(4);
}

export function TradeTape({ rows, err }: { rows: Print[] | null; err: string | null }) {
  const view = (rows ?? []).slice(0, 12);
  const last = view[0];

  return (
    <div className="mt-3 flex flex-col gap-2">
      <p className="font-mono text-xs text-ink">
        {last ? (
          <>
            last <span className={last.side === "buy" ? "text-power" : "text-ink"}>{last.side}</span>{" "}
            {compact(last.sq)} SQ
          </>
        ) : err ? (
          <span className="text-mute">tape quiet</span>
        ) : (
          <span className="text-mute">reading the pool…</span>
        )}
      </p>
      <ul className="flex max-h-44 flex-col gap-1.5 overflow-y-auto">
        {view.map((row) => (
          <li key={row.hash} className="flex items-baseline justify-between gap-2 font-mono text-xs">
            <a className={row.side === "buy" ? "text-power" : "text-ink"} href={`${SITE.explorer}/tx/${row.hash}`}>
              {row.side}
            </a>
            <span className="tabular-nums text-mute">
              {compact(row.sq)} · {compact(row.gme)} GME
            </span>
          </li>
        ))}
      </ul>
      <a className="font-mono text-micro text-mute hover:text-ink" href={SITE.longUrl}>
        open the pool on long
      </a>
    </div>
  );
}
