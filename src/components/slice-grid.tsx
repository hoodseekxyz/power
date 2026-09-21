import { cn } from "@/lib/cn";
import {
  FACE_TOKS,
  LAYERS,
  OUTPUT_LAYER,
  inWorkspace,
  readout,
  type FaceTok,
} from "@/lib/jlens";
import { useDesk } from "@/store/desk";

export function SliceGrid() {
  const fittedTo = useDesk((s) => s.fittedTo);
  const selected = useDesk((s) => s.selected);
  const pinned = useDesk((s) => s.pinned);
  const injected = useDesk((s) => s.injected);
  const you = useDesk((s) => s.you);
  const select = useDesk((s) => s.select);

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-max min-w-full border-separate border-spacing-0 text-micro sm:text-label">
          <thead className="sticky top-0 z-10 bg-paper/95 backdrop-blur-sm">
            <tr>
              <th className="sticky left-0 z-20 bg-paper px-2 py-1.5 text-left font-mono font-medium text-mute">
                L
              </th>
              {FACE_TOKS.map((tok, i) => (
                <th
                  key={i}
                  className={cn(
                    "min-w-14 px-1 py-1.5 text-center font-mono font-medium",
                    selected.pos === i ? "text-ws" : "text-mute",
                  )}
                >
                  <TokHead tok={tok} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: LAYERS }, (_, layer) => {
              const shown = fittedTo >= layer;
              const ws = inWorkspace(layer);
              const out = layer === OUTPUT_LAYER;
              return (
                <tr key={layer} className={ws ? "bg-ws/6" : undefined}>
                  <th
                    className={cn(
                      "sticky left-0 z-10 bg-paper px-2 py-0.5 text-left font-mono font-medium tabular-nums",
                      ws ? "text-ws" : out ? "text-ink" : "text-mute",
                    )}
                  >
                    {out ? "out" : String(layer).padStart(2, "0")}
                  </th>
                  {FACE_TOKS.map((_, pos) => {
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
                          className={cn(
                            "flex h-8 w-full min-w-14 flex-col items-center justify-center px-0.5 leading-none transition-colors sm:h-9",
                            !shown && "text-faint",
                            shown && on && "bg-ink text-paper",
                            shown && !on && pinHit && "bg-ws/18 text-ink",
                            shown && !on && youHit && !pinHit && "ring-1 ring-inset ring-ws",
                            shown && !on && !pinHit && "hover:bg-ink/6",
                          )}
                        >
                          {shown ? (
                            <>
                              <span className="max-w-12 truncate font-mono text-micro sm:text-label">
                                {cell.word}
                              </span>
                              <span
                                className={cn(
                                  "font-mono text-micro tabular-nums",
                                  on ? "text-paper/70" : "text-mute",
                                )}
                              >
                                {cell.rank}
                                <sup className="ml-px">°</sup>
                              </span>
                            </>
                          ) : (
                            <span className="font-mono text-faint">·</span>
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
      </div>
      <p className="shrink-0 border-t border-line px-3 py-1.5 font-mono text-micro text-mute">
        Cell = lens top-1 · superscript = vocab rank · mid band = J-space · last row = mouth
      </p>
    </div>
  );
}

function TokHead({ tok }: { tok: FaceTok }) {
  return (
    <span className={cn("inline-block max-w-12 truncate", tok.role === "nose" && "text-ws")}>
      {tok.t}
    </span>
  );
}
