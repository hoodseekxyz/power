import { cn } from "@/lib/cn";
import { FACE_TOKS, LAYERS, OUTPUT_LAYER, inWorkspace, readout } from "@/lib/jlens";
import { useDesk } from "@/store/desk";

export function LayerColumn() {
  const pos = useDesk((s) => s.selected.pos);
  const focusLayer = useDesk((s) => s.focusLayer);
  const fittedTo = useDesk((s) => s.fittedTo);
  const injected = useDesk((s) => s.injected);
  const you = useDesk((s) => s.you);
  const setFocus = useDesk((s) => s.setFocus);
  const tok = FACE_TOKS[pos];

  return (
    <div className="hidden lg:block">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="kicker">layers</span>
        <span className="font-mono text-micro text-mute">{tok?.t}</span>
      </div>
      <ol className="flex flex-col">
        {Array.from({ length: LAYERS }, (_, layer) => {
          const shown = fittedTo >= layer;
          const cell = readout(layer, pos, injected);
          const ws = inWorkspace(layer);
          const out = layer === OUTPUT_LAYER;
          const on = focusLayer === layer;
          const youHit = you && cell.word === you;
          return (
            <li key={layer}>
              <button
                type="button"
                disabled={!shown}
                onClick={() => shown && setFocus(layer)}
                className={cn(
                  "flex h-7 w-full items-center gap-2 px-1 text-left font-mono text-label transition-colors duration-150",
                  on && "bg-ink text-paper",
                  !on && ws && "bg-ws/8",
                  !shown && "text-faint",
                )}
              >
                <span className={cn("w-7 tabular-nums", on ? "text-paper/70" : ws ? "text-ws" : "text-mute")}>
                  {out ? "out" : String(layer).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 truncate">{shown ? cell.word : "·"}</span>
                <span className={cn("tabular-nums", on ? "text-paper/70" : "text-mute")}>
                  {shown ? `${cell.rank}°` : ""}
                </span>
                {youHit && shown ? <span className={on ? "text-paper" : "text-ws"}>·</span> : null}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function LayerStrip() {
  const pos = useDesk((s) => s.selected.pos);
  const focusLayer = useDesk((s) => s.focusLayer);
  const fittedTo = useDesk((s) => s.fittedTo);
  const injected = useDesk((s) => s.injected);
  const setFocus = useDesk((s) => s.setFocus);

  return (
    <ol className="flex w-full gap-1 overflow-x-auto pb-1 lg:hidden">
      {Array.from({ length: LAYERS }, (_, layer) => {
        const shown = fittedTo >= layer;
        const cell = readout(layer, pos, injected);
        const ws = inWorkspace(layer);
        const on = focusLayer === layer;
        return (
          <li key={layer} className="shrink-0">
            <button
              type="button"
              disabled={!shown}
              onClick={() => shown && setFocus(layer)}
              className={cn(
                "flex h-11 min-w-11 flex-col items-center justify-center px-2 font-mono text-micro",
                on && "bg-ink text-paper",
                !on && ws && "bg-ws/15 text-ink",
                !on && !ws && "border border-line text-mute",
                !shown && "text-faint",
              )}
            >
              <span className="tabular-nums">{layer === OUTPUT_LAYER ? "out" : String(layer).padStart(2, "0")}</span>
              <span className="max-w-12 truncate">{shown ? cell.word : "·"}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
