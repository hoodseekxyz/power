import { SITE } from "@/lib/site";
import { stats, usePower } from "@/store/power";

export function SitEvent() {
  const seats = usePower((s) => s.seats);
  const quip = usePower((s) => s.quip);
  const { s } = stats(seats);
  const full = s >= SITE.sideMax;

  return (
    <div className="shrink-0 border-b border-line bg-paper px-3 py-3 sm:px-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="kicker">{full ? "the sit · full" : "the sit · open"}</p>
        <p className="font-mono text-xs tabular-nums text-ink">
          {s}/{SITE.sideMax}
        </p>
      </div>
      <div className="mt-2 flex gap-1" aria-hidden>
        {Array.from({ length: SITE.sideMax }, (_, i) => (
          <span key={i} className={`h-1.5 flex-1 ${i < s ? "bg-power" : "bg-surface"}`} />
        ))}
      </div>
      <p className="mt-2 font-display text-lg leading-snug tracking-[-0.02em] text-ink sm:text-xl">{quip}</p>
    </div>
  );
}
