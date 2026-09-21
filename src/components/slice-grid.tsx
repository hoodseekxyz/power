import { cn } from "@/lib/cn";
import {
  FACE_TOKS,
  LAYERS,
  NOSE_LAYER,
  OUTPUT_LAYER,
  inWorkspace,
  readout,
  topk,
  visibleToks,
} from "@/lib/jlens";
import { useDesk } from "@/store/desk";
import { useState } from "react";

const WINDOW = 16;

export function SliceGrid() {
  const fittedTo = useDesk((s) => s.fittedTo);
  const selected = useDesk((s) => s.selected);
  const pinned = useDesk((s) => s.pinned);
  const injected = useDesk((s) => s.injected);
  const you = useDesk((s) => s.you);
  const hideWs = useDesk((s) => s.hideWs);
  const select = useDesk((s) => s.select);
  const [hover, setHover] = useState<{ layer: number; pos: number; x: number; y: number } | null>(
    null,
  );

  const cols = visibleToks(hideWs);
  const hi = Math.min(LAYERS - 1, Math.max(WINDOW - 1, selected.layer + Math.floor(WINDOW / 2)));
  const lo = Math.max(0, hi - WINDOW + 1);
  const rows: number[] = [];
  for (let l = hi; l >= lo; l--) rows.push(l);

  return (
    <div className="relative min-h-0 min-w-0 flex-1 overflow-auto">
      <table className="w-max min-w-full border-separate border-spacing-0 font-mono text-micro">
        <thead className="sticky top-0 z-10 bg-paper/95 backdrop-blur-sm">
          <tr>
            <th className="sticky left-0 z-20 bg-paper px-1.5 py-1 text-left font-medium text-mute">
              L
            </th>
            {cols.map(({ tok, pos }) => (
              <th
                key={pos}
                className={cn(
                  "min-w-[3.4rem] px-0.5 py-1 text-center font-medium",
                  selected.pos === pos ? "text-pin" : "text-mute",
                )}
              >
                <span className="block truncate text-micro tabular-nums">{pos}</span>
                <span className="block truncate">{tok.t === " " ? "␣" : tok.t}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((layer) => {
            const shown = fittedTo >= layer;
            const ws = inWorkspace(layer);
            const out = layer === OUTPUT_LAYER;
            const rowOn = selected.layer === layer;
            return (
              <tr key={layer} className={rowOn ? "bg-pin/10" : ws ? "bg-ws/5" : undefined}>
                <th
                  className={cn(
                    "sticky left-0 z-10 bg-paper px-1.5 py-0.5 text-left font-medium tabular-nums",
                    rowOn ? "text-pin" : ws ? "text-ws" : out ? "text-ink" : "text-mute",
                  )}
                >
                  {out ? "out" : String(layer)}
                </th>
                {cols.map(({ pos }) => {
                  const cell = readout(layer, pos, injected);
                  const on = selected.layer === layer && selected.pos === pos;
                  const pinHit = pinned && (cell.word === pinned || cell.top.includes(pinned));
                  const youHit = you && cell.word === you;
                  return (
                    <td key={pos} className="p-0">
                      <button
                        type="button"
                        disabled={!shown}
                        onClick={() => shown && select(layer, pos, cell.word)}
                        onMouseEnter={(e) => {
                          if (!shown) return;
                          const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                          setHover({ layer, pos, x: r.left, y: r.bottom });
                        }}
                        onMouseLeave={() => setHover(null)}
                        className={cn(
                          "flex h-6 w-full min-w-[3.4rem] flex-col items-center justify-center px-0.5 leading-none sm:h-7",
                          !shown && "text-faint",
                          shown && on && "bg-pin text-paper",
                          shown && !on && pinHit && "text-pin",
                          shown && !on && youHit && "ring-1 ring-inset ring-ws",
                          shown && !on && !pinHit && "text-ink/80 hover:bg-ink/5",
                        )}
                      >
                        {shown ? (
                          <span className="max-w-[3.2rem] truncate">
                            {cell.word}
                            <sup className={cn("ml-px", on ? "text-paper/70" : "text-mute")}>
                              {cell.rank}
                            </sup>
                          </span>
                        ) : (
                          <span className="text-faint">·</span>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {hover ? <HoverCard layer={hover.layer} pos={hover.pos} x={hover.x} y={hover.y} /> : null}
    </div>
  );
}

function HoverCard({ layer, pos, x, y }: { layer: number; pos: number; x: number; y: number }) {
  const injected = useDesk((s) => s.injected);
  const rows = topk(layer, pos, injected);
  const tok = FACE_TOKS[pos];
  const left = Math.min(x, typeof window !== "undefined" ? window.innerWidth - 220 : x);
  return (
    <div
      className="pointer-events-none fixed z-40 w-48 border border-line bg-surface p-2 shadow-plate"
      style={{ left, top: Math.min(y + 6, 520) }}
    >
      <p className="font-mono text-micro text-mute">
        Pos={pos} Layer={layer}
        {tok ? ` ${tok.t}` : ""}
      </p>
      <ol className="mt-1 space-y-0.5 font-mono text-micro">
        {rows.map((r, i) => (
          <li key={`${r.word}-${i}`} className="flex justify-between gap-2">
            <span className={i === 0 ? "text-pin" : "text-ink"}>
              {r.rank} {r.word}
            </span>
            <span className="tabular-nums text-mute">{r.pct.toFixed(1)}%</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
