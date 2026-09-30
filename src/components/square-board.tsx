import { ownerAt, SIDE_MAX, type Seat } from "@/lib/power";
import { cn } from "@/lib/cn";

const STEPS = Array.from({ length: SIDE_MAX * SIDE_MAX }, (_, i) => i);

export function SquareBoard({ seats, onPing }: { seats: Seat[]; onPing: () => void }) {
  return (
    <button
      type="button"
      onClick={onPing}
      aria-label="Ping. Add one to your coefficient."
      className="group relative aspect-square w-full max-w-[16rem] border border-line bg-paper p-2 transition-transform duration-150 active:scale-[0.99] sm:max-w-[min(100%,28rem)] sm:p-3"
    >
      <div
        className="grid h-full w-full gap-px"
        style={{ gridTemplateColumns: `repeat(${SIDE_MAX}, minmax(0, 1fr))` }}
      >
        {STEPS.map((i) => {
          const row = Math.floor(i / SIDE_MAX);
          const col = i % SIDE_MAX;
          const owner = ownerAt(seats, row, col);
          return (
            <span
              key={i}
              className={cn(
                "block min-h-0 min-w-0",
                !owner && "bg-surface",
                owner?.you && "bg-power",
                owner && !owner.you && "bg-ink",
              )}
              style={owner && !owner.you ? { opacity: 0.28 + (owner.a % 5) * 0.12 } : undefined}
            />
          );
        })}
      </div>
    </button>
  );
}
