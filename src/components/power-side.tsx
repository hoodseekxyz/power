import { FlowCard } from "@/components/flow-card";
import { Panel } from "@/components/panel";
import { compact, TradeTape } from "@/components/trade-tape";
import { RINGS, type Picture } from "@/lib/paint";
import { SITE } from "@/lib/site";
import type { Print } from "@/lib/trades";
import { usePower } from "@/store/power";

export function PowerSide({
  rows,
  err,
  picture,
}: {
  rows: Print[] | null;
  err: string | null;
  picture: Picture;
}) {
  const ping = usePower((s) => s.ping);
  const spark = usePower((s) => s.spark);
  const deskErr = usePower((s) => s.err);
  const last = usePower((s) => s.last);
  const sending = usePower((s) => s.sending);
  const close =
    picture.threshold === Number.POSITIVE_INFINITY ? "—" : `${compact(picture.threshold)} GME`;

  return (
    <div className="flex flex-col gap-3">
      <Panel kicker="this epoch" live>
        <p className="mt-2 font-display text-5xl leading-none tracking-[-0.04em] tabular-nums">{picture.epoch}</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="border border-line p-3">
            <div className="font-mono text-micro text-mute">rings closed</div>
            <div className="mt-1 font-display text-2xl tabular-nums text-power">
              {picture.seats.length}/{RINGS}
            </div>
          </div>
          <div className="border border-line p-3">
            <div className="font-mono text-micro text-mute">close above</div>
            <div className="mt-1 font-display text-2xl tabular-nums">{close}</div>
          </div>
        </div>
        <p className="mt-3 font-mono text-xs leading-relaxed text-mute">
          Black pixels are ordinary buys. Red is a ring a large buy closed. Grey is a sell that cooled a pixel.
        </p>
      </Panel>

      <Panel kicker="the pool" live extra={<span className="font-mono text-micro text-mute">GME</span>}>
        <FlowCard rows={rows} />
      </Panel>

      <Panel kicker="the tape" live>
        <TradeTape rows={rows} err={err} />
      </Panel>

      <Panel kicker="ring closers" live>
        <ul className="mt-3 flex flex-col gap-1.5">
          {picture.seats.length === 0 ? (
            <li className="font-mono text-xs text-mute">No ring has closed in this epoch.</li>
          ) : (
            picture.seats.map((seat) => (
              <li key={`${seat.ring}-${seat.who}`} className="flex items-baseline justify-between gap-2 font-mono text-xs">
                <span className="text-power">
                  ring {seat.ring + 1} · {seat.who.slice(0, 6)}…{seat.who.slice(-4)}
                </span>
                <span className="tabular-nums text-mute">{compact(seat.gme)} GME</span>
              </li>
            ))
          )}
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
        <p className="mt-2 min-h-4 font-mono text-micro text-mute">
          {deskErr ?? last ?? "ping and spark glow the contract. they do not paint."}
        </p>
      </Panel>
    </div>
  );
}
