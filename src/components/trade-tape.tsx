import { SITE } from "@/lib/site";
import { getTrades, type Print } from "@/lib/trades";
import { useEffect, useState } from "react";

function compact(n: number) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
  if (n >= 1) return n.toFixed(2);
  return n.toFixed(4);
}

export function TradeTape() {
  const [rows, setRows] = useState<Print[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let stop = false;
    const load = () => {
      getTrades()
        .then((next) => {
          if (!stop) {
            setRows(next);
            setErr(null);
          }
        })
        .catch((e) => {
          if (!stop) setErr(e instanceof Error ? e.message : "tape down");
        });
    };
    load();
    const id = setInterval(load, 12000);
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, []);

  const last = rows?.[0];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <p className="kicker">the tape</p>
        <a className="font-mono text-micro text-mute hover:text-ink" href={SITE.longUrl}>
          long
        </a>
      </div>
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
      <ul className="flex max-h-40 flex-col gap-1 overflow-y-auto">
        {(rows ?? []).map((row) => (
          <li key={row.hash} className="flex items-baseline justify-between gap-2 font-mono text-xs">
            <a
              className={row.side === "buy" ? "text-power" : "text-ink"}
              href={`${SITE.explorer}/tx/${row.hash}`}
            >
              {row.side}
            </a>
            <span className="tabular-nums text-mute">
              {compact(row.sq)} · {compact(row.gme)} GME
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
