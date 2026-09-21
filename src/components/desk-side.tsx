import { ActionPad } from "@/components/action-pad";
import { LayerColumn } from "@/components/layer-column";
import { RankPanel } from "@/components/rank-panel";
import { cn } from "@/lib/cn";
import { FACE_TOKS, K_SPACE } from "@/lib/jlens";
import { moodFrom } from "@/lib/mood";
import { useDesk } from "@/store/desk";

export function DeskSide() {
  const you = useDesk((s) => s.you);
  const guest = useDesk((s) => s.guest);
  const events = useDesk((s) => s.events);
  const err = useDesk((s) => s.err);
  const scope = useDesk((s) => s.scope);
  const setScope = useDesk((s) => s.setScope);
  const sitters = useDesk((s) => s.sitters);
  const tape = useDesk((s) => s.tape);
  const select = useDesk((s) => s.select);
  const focusLayer = useDesk((s) => s.focusLayer);
  const mood = moodFrom(tape, sitters, false);
  const vol = tape.buy + tape.sell;
  const k = Math.min(K_SPACE, sitters.length);

  return (
    <aside className="flex w-full shrink-0 flex-col gap-3 border-t border-line bg-surface p-3 sm:gap-4 sm:p-5 lg:h-full lg:w-80 lg:overflow-y-auto lg:border-t-0 lg:border-l">
      <div className="hidden lg:block">
        <ActionPad />
      </div>
      {err ? <p className="font-mono text-xs text-warn">{err}</p> : null}

      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs text-ink">
          J-space <span className="text-pin">{k}</span>
          <span className="text-mute"> / {K_SPACE}</span>
        </p>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="h-1.5 min-w-0 flex-1 bg-ink/10">
            <div
              className="h-full bg-pin transition-[width] duration-300 ease-out"
              style={{ width: `${(k / K_SPACE) * 100}%` }}
            />
          </div>
          <span className="font-mono text-micro tabular-nums text-mute">
            you = <span className="text-ink">{you}</span>
            {guest ? " · guest" : ""}
          </span>
        </div>
      </div>

      <div className="hidden grid-cols-3 gap-2 border border-line bg-paper px-2 py-2 lg:grid">
        <Meter k="buy" n={tape.buy} max={vol || 1} accent />
        <Meter k="sell" n={tape.sell} max={vol || 1} />
        <Meter k="ink" n={Math.round(mood.ink * 100)} max={100} accent />
      </div>

      <div className="flex gap-1 border border-line p-0.5">
        {(["specimen", "slice"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setScope(s)}
            className={cn(
              "h-11 flex-1 font-mono text-label transition-colors duration-150",
              scope === s ? "bg-ink text-paper" : "text-mute hover:text-ink",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="hidden lg:block">
        <div className="mb-2 kicker">sitting</div>
        <ul className="flex flex-col gap-1">
          {sitters.slice(0, 8).map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => {
                  const tok = FACE_TOKS[s.pos];
                  if (!tok) return;
                  select(focusLayer, s.pos, tok.role === "nose" ? "nose" : tok.role);
                }}
                className="flex w-full items-center gap-2 font-mono text-micro text-mute hover:text-ink"
              >
                <span className={cn("w-10 truncate", s.you ? "text-ws" : "text-ink")}>{s.word}</span>
                <span className="min-w-0 flex-1 truncate text-left">{FACE_TOKS[s.pos]?.t}</span>
                <span className="tabular-nums">{FACE_TOKS[s.pos]?.role}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <LayerColumn />
      <div className="hidden lg:block">
        <RankPanel />
      </div>

      <div className="hidden lg:block">
        <div className="mb-2 kicker">tape</div>
        <ul className="flex flex-col gap-1">
          {events.slice(0, 8).map((e) => (
            <li key={e.id} className="flex gap-2 font-mono text-micro text-mute">
              <span className="w-10 shrink-0 text-ws">{e.kind}</span>
              <span className="truncate text-ink">{e.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function Meter({ k, n, max, accent }: { k: string; n: number; max: number; accent?: boolean }) {
  const pct = Math.min(100, (n / max) * 100);
  return (
    <div>
      <div className="kicker">{k}</div>
      <div className="mt-1 h-1 bg-ink/10">
        <div
          className={cn("h-full transition-[width] duration-500 ease-out", accent ? "bg-ws" : "bg-ink/50")}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1 font-mono text-xs tabular-nums text-ink">{n}</div>
    </div>
  );
}
