import { ownerAt, SIDE_MAX, sumA, type Seat } from "@/lib/power";
import { cn } from "@/lib/cn";

const STEPS = Array.from({ length: SIDE_MAX * SIDE_MAX }, (_, i) => i);

export function SquareBoard({
  seats,
  onPing,
  flash,
}: {
  seats: Seat[];
  onPing: () => void;
  flash: number;
}) {
  const hot = sumA(seats) - 1;
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
          const step = Math.max(row, col);
          const owner = ownerAt(seats, row, col);
          const popped = flash > 0 && owner && step === hot;
          return (
            <span
              key={popped ? `${i}-${flash}` : i}
              className={cn(
                "block min-h-0 min-w-0",
                !owner && "bg-surface",
                owner?.you && "bg-power",
                owner && !owner.you && "bg-ink",
                popped && "cell-pop",
              )}
              style={owner && !owner.you ? { opacity: 0.28 + (owner.a % 5) * 0.12 } : undefined}
            />
          );
        })}
      </div>
    </button>
  );
}
