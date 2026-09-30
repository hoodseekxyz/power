import { SITE } from "@/lib/site";
import { stats, usePower } from "@/store/power";

export function PowerSide() {
  const seats = usePower((s) => s.seats);
  const ping = usePower((s) => s.ping);
  const spark = usePower((s) => s.spark);
  const err = usePower((s) => s.err);
  const last = usePower((s) => s.last);
  const sending = usePower((s) => s.sending);
  const { s, sq, own, cross } = stats(seats);

  return (
    <aside className="flex w-full shrink-0 flex-col gap-4 border-line bg-paper p-4 lg:w-80 lg:border-l lg:overflow-y-auto">
      <div>
        <p className="kicker">the square</p>
        <p className="mt-2 font-display text-5xl leading-none tracking-[-0.04em] text-ink tabular-nums">{sq}</p>
        <p className="mt-2 font-mono text-xs text-mute">
          (Σa)² · side {s} / {SITE.sideMax}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 border border-line p-3">
        <Stat k="Σ a²" v={own} />
        <Stat k="2Σab" v={cross} hot />
      </div>
      <p className="font-mono text-xs leading-relaxed text-mute">
        The cross term is the part no single seat owns. Sum the squares and you miss the pool.
      </p>

      <ul className="flex flex-col gap-1.5">
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

      <div className="hidden gap-2 lg:flex">
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
      <p className="min-h-4 font-mono text-micro text-mute">{err ?? last ?? "space ping · s spark"}</p>
    </aside>
  );
}

function Stat({ k, v, hot }: { k: string; v: number; hot?: boolean }) {
  return (
    <div>
      <div className="font-mono text-micro text-mute">{k}</div>
      <div className={`font-display text-2xl tabular-nums ${hot ? "text-power" : "text-ink"}`}>{v}</div>
    </div>
  );
}
