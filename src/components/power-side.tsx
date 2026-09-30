import { FlowCard } from "@/components/flow-card";
import { Panel } from "@/components/panel";
import { TradeTape } from "@/components/trade-tape";
import { SITE } from "@/lib/site";
import type { Print } from "@/lib/trades";
import { stats, usePower } from "@/store/power";

export function PowerSide({ rows, err }: { rows: Print[] | null; err: string | null }) {
  const seats = usePower((s) => s.seats);
  const ping = usePower((s) => s.ping);
  const spark = usePower((s) => s.spark);
  const deskErr = usePower((s) => s.err);
  const last = usePower((s) => s.last);
  const sending = usePower((s) => s.sending);
  const { s, sq, own, cross } = stats(seats);

  return (
    <div className="flex flex-col gap-3">
      <Panel kicker="the square" live>
        <p className="mt-2 font-display text-5xl leading-none tracking-[-0.04em] text-ink tabular-nums">{sq}</p>
        <p className="mt-2 font-mono text-xs text-mute">
          (Σa)² · side {s} / {SITE.sideMax}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Stat k="Σ a² · yours to point at" v={own} />
          <Stat k="2Σab · the pool" v={cross} hot />
        </div>
      </Panel>

      <Panel kicker="the pool" live extra={<span className="font-mono text-micro text-mute">GME</span>}>
        <FlowCard rows={rows} />
      </Panel>

      <Panel kicker="the tape" live>
        <TradeTape rows={rows} err={err} />
      </Panel>

      <Panel kicker="seats">
        <ul className="mt-3 flex flex-col gap-1.5">
          {seats.map((seat) => (
            <li key={seat.id} className="flex items-baseline justify-between font-mono text-xs">
              <span className={seat.you ? "text-power" : "text-ink"}>
                {seat.label}
                {seat.you ? " · you" : ""}
              </span>
              <span className="tabular-nums text-mute">
                a={seat.a} · a²={seat.a * seat.a}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 hidden gap-2 lg:flex">
          <button
            type="button"
            onClick={ping}
            className="h-11 flex-1 border border-ink bg-ink font-mono text-xs text-paper transition-transform duration-150 active:scale-[0.98]"
          >
            {sending === "ping" ? "…" : "ping +1"}
          </button>
          <button
            type="button"
            onClick={spark}
            className="h-11 flex-1 border border-power bg-power font-mono text-xs text-paper transition-transform duration-150 active:scale-[0.98]"
          >
            {sending === "spark" ? "…" : `spark +3 · ${SITE.sparkEth}`}
          </button>
        </div>
        <p className="mt-2 min-h-4 font-mono text-micro text-mute">{deskErr ?? last ?? "space ping · s spark"}</p>
      </Panel>
    </div>
  );
}

function Stat({ k, v, hot }: { k: string; v: number; hot?: boolean }) {
  return (
    <div className="border border-line p-3">
      <div className="font-mono text-micro text-mute">{k}</div>
      <div className={`mt-1 font-display text-2xl tabular-nums ${hot ? "text-power" : "text-ink"}`}>{v}</div>
    </div>
  );
}
