import { ActionPad } from "@/components/action-pad";
import { AsciiFace } from "@/components/ascii-face";
import { SliceGrid } from "@/components/slice-grid";
import { cn } from "@/lib/cn";
import {
  FACE_TOKS,
  LAYERS,
  NOSE_LAYER,
  layerWords,
  rankAt,
  rankTrace,
  readout,
  visibleToks,
} from "@/lib/jlens";
import { useDesk } from "@/store/desk";

export function PaperVis() {
  const selected = useDesk((s) => s.selected);
  const injected = useDesk((s) => s.injected);
  const pinned = useDesk((s) => s.pinned);
  const you = useDesk((s) => s.you);
  const guest = useDesk((s) => s.guest);
  const hideWs = useDesk((s) => s.hideWs);
  const setHideWs = useDesk((s) => s.setHideWs);
  const select = useDesk((s) => s.select);
  const setFocus = useDesk((s) => s.setFocus);
  const tok = FACE_TOKS[selected.pos];

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0 border-b border-line px-3 py-1.5 sm:px-4 sm:py-2">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="font-display text-base font-medium tracking-[-0.03em] text-ink sm:text-xl">
            J-lens — ASCII face
          </h1>
          <p className="hidden max-w-3xl text-pretty font-mono text-micro leading-relaxed text-mute sm:block sm:text-label">
            An ASCII-art face. The model is asked what it depicts; the J-lens at mid layers shows
            face-part concepts (nose, smile, eye) at the corresponding character positions — the
            model has parsed the drawing spatially.
          </p>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-3 font-mono text-label text-ink">
          <label className="flex items-center gap-1.5">
            Pos
            <input
              type="number"
              min={0}
              max={FACE_TOKS.length - 1}
              value={selected.pos}
              onChange={(e) => {
                const p = Math.max(0, Math.min(FACE_TOKS.length - 1, Number(e.target.value)));
                const w = readout(selected.layer, p, injected).word;
                select(selected.layer, p, w);
              }}
              className="h-8 w-14 border border-line bg-surface px-1.5 tabular-nums"
            />
            <span className="text-pin">{tok?.t === " " ? "␣" : tok?.t}</span>
          </label>
          <label className="flex items-center gap-1.5">
            Layer
            <input
              type="number"
              min={0}
              max={LAYERS - 1}
              value={selected.layer}
              onChange={(e) => setFocus(Math.max(0, Math.min(LAYERS - 1, Number(e.target.value))))}
              className="h-8 w-14 border border-line bg-surface px-1.5 tabular-nums"
            />
          </label>
          <label className="flex h-8 items-center gap-1.5 text-mute">
            <input
              type="checkbox"
              checked={!hideWs}
              onChange={(e) => setHideWs(!e.target.checked)}
              className="accent-ink"
            />
            whitespace
          </label>
          <span className="text-mute">
            you = <span className="text-ws">{you}</span>
            {guest ? " · guest" : ""}
          </span>
          <span className="hidden text-mute lg:inline">arrows · space ping · j fit</span>
        </div>
      </div>

      <div className="flex shrink-0 justify-center border-b border-line bg-surface px-3 py-2 lg:hidden">
        <AsciiFace
          highlight={selected.pos}
          onPick={(p) => {
            const w = readout(Math.max(selected.layer, NOSE_LAYER), p, injected).word;
            select(selected.layer, p, w);
          }}
        />
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden lg:flex-row">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <SliceGrid />
        </div>
        <ByLayer />
        <ByPos />
      </div>

      <div className="grid shrink-0 grid-cols-1 gap-3 border-t border-line bg-surface px-3 py-2 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr] lg:px-4 lg:py-3">
        <div className="hidden lg:block">
          <AsciiFace
            highlight={selected.pos}
            onPick={(p) => {
              const w = readout(Math.max(selected.layer, NOSE_LAYER), p, injected).word;
              select(selected.layer, p, w);
            }}
          />
          <p className="mt-1 font-mono text-micro text-mute">
            rank of <span className="text-pin">{pinned}</span> at every (pos, layer)
          </p>
        </div>
        <RankHeat />
        <div className="hidden flex-col gap-2 sm:flex">
          <RankLine />
          <div className="hidden lg:block">
            <ActionPad />
          </div>
        </div>
      </div>
    </div>
  );
}

function ByLayer() {
  const selected = useDesk((s) => s.selected);
  const injected = useDesk((s) => s.injected);
  const pinned = useDesk((s) => s.pinned);
  const setFocus = useDesk((s) => s.setFocus);
  const tok = FACE_TOKS[selected.pos];
  const rows: number[] = [];
  for (let l = LAYERS - 1; l >= 0; l--) rows.push(l);

  return (
    <aside className="hidden min-h-0 w-[22%] shrink-0 flex-col border-l border-line lg:flex">
      <p className="shrink-0 border-b border-line px-2 py-1.5 font-mono text-micro text-mute">
        By Layer (Pos={selected.pos} {tok?.t})
      </p>
      <div className="min-h-0 flex-1 overflow-auto px-2 py-1">
        {rows.map((layer) => {
          const words = layerWords(layer, selected.pos, injected);
          const on = layer === selected.layer;
          return (
            <button
              key={layer}
              type="button"
              onClick={() => setFocus(layer)}
              className={cn(
                "flex w-full gap-1.5 py-px text-left font-mono text-micro leading-tight",
                on && "bg-pin/15",
              )}
            >
              <span className={cn("w-5 shrink-0 tabular-nums", on ? "text-pin" : "text-mute")}>
                {layer}
              </span>
              <span className="min-w-0 truncate">
                {words.map((w, i) => (
                  <span
                    key={`${w}-${i}`}
                    className={cn(
                      "mr-1",
                      w === pinned ? "text-pin" : i === 0 ? "text-ink" : "text-mute",
                    )}
                  >
                    {w}
                  </span>
                ))}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function ByPos() {
  const selected = useDesk((s) => s.selected);
  const injected = useDesk((s) => s.injected);
  const pinned = useDesk((s) => s.pinned);
  const hideWs = useDesk((s) => s.hideWs);
  const select = useDesk((s) => s.select);
  const cols = visibleToks(hideWs);

  return (
    <aside className="hidden min-h-0 w-[22%] shrink-0 flex-col border-l border-line xl:flex">
      <p className="shrink-0 border-b border-line px-2 py-1.5 font-mono text-micro text-mute">
        By Pos (Layer={selected.layer})
      </p>
      <div className="min-h-0 flex-1 overflow-auto px-2 py-1">
        {cols.map(({ tok, pos }) => {
          const words = layerWords(selected.layer, pos, injected);
          const on = pos === selected.pos;
          return (
            <button
              key={pos}
              type="button"
              onClick={() => select(selected.layer, pos, words[0] ?? tok.role)}
              className={cn(
                "flex w-full gap-1.5 py-px text-left font-mono text-micro leading-tight",
                on && "bg-pin/15",
              )}
            >
              <span className={cn("w-5 shrink-0 tabular-nums", on ? "text-pin" : "text-mute")}>
                {pos}
              </span>
              <span className="w-4 shrink-0 text-ink">{tok.t === " " ? "␣" : tok.t}</span>
              <span className="min-w-0 truncate">
                {words.map((w, i) => (
                  <span
                    key={`${w}-${i}`}
                    className={cn(
                      "mr-1",
                      w === pinned ? "text-pin" : i === 0 ? "text-ink" : "text-mute",
                    )}
                  >
                    {w}
                  </span>
                ))}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function RankHeat() {
  const pinned = useDesk((s) => s.pinned);
  const injected = useDesk((s) => s.injected);
  const selected = useDesk((s) => s.selected);
  const hideWs = useDesk((s) => s.hideWs);
  const select = useDesk((s) => s.select);
  const cols = visibleToks(hideWs);
  const layerStep = 2;
  const rows: number[] = [];
  for (let l = LAYERS - 1; l >= 0; l -= layerStep) rows.push(l);

  return (
    <div>
      <div
        className="grid gap-px"
        style={{ gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr))` }}
      >
        {rows.map((layer) =>
          cols.map(({ pos }) => {
            const r = rankAt(layer, pos, pinned, injected);
            const on = Math.abs(layer - selected.layer) < 2 && pos === selected.pos;
            return (
              <button
                key={`${layer}-${pos}`}
                type="button"
                title={`L${layer} p${pos} rank ${r}`}
                onClick={() => select(layer, pos, readout(layer, pos, injected).word)}
                className={cn("h-1 sm:h-1.5", on && "outline outline-1 outline-pin")}
                style={{ background: heatColor(r) }}
              />
            );
          }),
        )}
      </div>
      <div className="mt-1 flex justify-between font-mono text-micro text-mute">
        <span>J-lens — ASCII face · {cols.length} pos × {LAYERS} layers</span>
        <span>Pos →</span>
      </div>
    </div>
  );
}

function heatColor(r: number) {
  if (r <= 2) return "var(--color-hot)";
  if (r <= 6) return "color-mix(in oklab, var(--color-hot) 55%, var(--color-pin))";
  if (r <= 14) return "var(--color-pin)";
  if (r <= 40) return "color-mix(in oklab, var(--color-ws) 45%, var(--color-heat))";
  return "var(--color-heat)";
}

function RankLine() {
  const selected = useDesk((s) => s.selected);
  const pinned = useDesk((s) => s.pinned);
  const injected = useDesk((s) => s.injected);
  const setFocus = useDesk((s) => s.setFocus);
  const trace = rankTrace(selected.pos, pinned, injected);
  const max = Math.max(20, ...trace);
  const logMax = Math.log(max);

  return (
    <div>
      <p className="mb-1 font-mono text-micro text-mute">
        rank of <span className="text-pin">{pinned}</span> · layer →
      </p>
      <div className="flex h-16 items-end gap-px">
        {trace.map((r, i) => {
          const h = Math.max(6, Math.round((1 - Math.log(Math.max(1, r)) / logMax) * 1000) / 10);
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
                className={on ? "bg-pin" : r <= 2 ? "bg-hot" : "bg-ws/55"}
                style={{ height: `${h}%`, width: "100%" }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
