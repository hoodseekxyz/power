import { PIX, type Pix } from "@/lib/paint";

export function MarketBoard({ cells }: { cells: Pix[] }) {
  return (
    <div
      className="grid aspect-square w-full max-w-[min(100%,34rem)] gap-px border border-line bg-paper p-1.5"
      style={{ gridTemplateColumns: `repeat(${PIX}, minmax(0, 1fr))` }}
      aria-label="The shared square, painted by the pool."
    >
      {cells.map((cell, i) => (
        <span
          key={i}
          className={
            cell.closed ? "bg-power" : cell.heat >= 1 ? "bg-ink" : cell.heat > 0 ? "bg-ink/35" : "bg-surface"
          }
        />
      ))}
    </div>
  );
}
