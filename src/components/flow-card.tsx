import { compact } from "@/components/trade-tape";
import type { Print } from "@/lib/trades";

export function FlowCard({ rows }: { rows: Print[] | null }) {
  const buys = (rows ?? []).filter((r) => r.side === "buy");
  const sells = (rows ?? []).filter((r) => r.side === "sell");
  const buyG = buys.reduce((a, r) => a + r.gme, 0);
  const sellG = sells.reduce((a, r) => a + r.gme, 0);
  const max = Math.max(buyG, sellG, 1e-9);

  return (
    <div className="mt-3 flex flex-col gap-3">
      <Bar label="buy" n={buys.length} gme={buyG} width={(buyG / max) * 100} hot />
      <Bar label="sell" n={sells.length} gme={sellG} width={(sellG / max) * 100} />
      <p className="font-mono text-micro leading-relaxed text-mute">
        Last prints in the window. Buy sends SQ out of the pool. Sell sends it back.
      </p>
    </div>
  );
}

function Bar({
  label,
  n,
  gme,
  width,
  hot,
}: {
  label: string;
  n: number;
  gme: number;
  width: number;
  hot?: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between font-mono text-xs">
        <span className={hot ? "text-power" : "text-ink"}>
          {label} · {n}
        </span>
        <span className="tabular-nums text-mute">{compact(gme)} GME</span>
      </div>
      <div className="mt-1 h-2 bg-surface">
        <div className={`h-full ${hot ? "bg-power" : "bg-ink"}`} style={{ width: `${Math.max(width, n ? 4 : 0)}%` }} />
      </div>
    </div>
  );
}
