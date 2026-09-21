import { FACE_TOKS, LAYERS, WORKSPACE, rankTrace } from "@/lib/jlens";
import { useDesk } from "@/store/desk";

export function RankPanel() {
  const selected = useDesk((s) => s.selected);
  const pinned = useDesk((s) => s.pinned);
  const injected = useDesk((s) => s.injected);
  const setFocus = useDesk((s) => s.setFocus);
  if (!pinned) {
    return <p className="font-mono text-xs text-mute">Click a cell to pin a token.</p>;
  }
  const trace = rankTrace(selected.pos, pinned, injected);
  const tok = FACE_TOKS[selected.pos];
  const max = Math.max(20, ...trace);
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <div>
          <div className="font-mono text-xs text-ink">{pinned}</div>
          <div className="font-mono text-micro text-mute">
            {tok?.t} · rank heatmap
          </div>
        </div>
        <div className="font-mono text-micro tabular-nums text-mute">low = said</div>
      </div>
      <div className="flex h-16 items-end gap-px">
        {trace.map((r, i) => {
          const h = Math.max(8, 100 - (r / max) * 100);
          const ws = i >= WORKSPACE.lo && i <= WORKSPACE.hi;
          const on = i === selected.layer;
          return (
            <button
              key={i}
              type="button"
              title={`L${i} rank ${r}`}
              onClick={() => setFocus(i)}
              className="flex flex-1 flex-col items-center justify-end"
            >
              <div
                className={
                  on ? "bg-ink" : ws ? "bg-ws" : i === LAYERS - 1 ? "bg-ink/70" : "bg-ink/25"
                }
                style={{ height: `${h}%`, width: "100%" }}
              />
            </button>
          );
        })}
      </div>
      <div className="mt-1 flex justify-between font-mono text-micro text-faint">
        <span>L00</span>
        <span>workspace</span>
        <span>out</span>
      </div>
    </div>
  );
}
