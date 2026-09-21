import { cn } from "@/lib/cn";
import { SITE } from "@/lib/site";
import { useDesk } from "@/store/desk";

export function ActionPad({ compact }: { compact?: boolean }) {
  const fitting = useDesk((s) => s.fitting);
  const fittedTo = useDesk((s) => s.fittedTo);
  const ping = useDesk((s) => s.ping);
  const spark = useDesk((s) => s.spark);
  const fit = useDesk((s) => s.fit);
  const swap = useDesk((s) => s.swap);

  return (
    <div className={cn("grid grid-cols-2 gap-2", compact && "grid-cols-4")}>
      <Act k="space" label="ping" hint="sit + ink" onClick={ping} />
      <Act k="s" label="spark" hint={`${SITE.sparkEth} ETH`} onClick={spark} />
      <Act k="j" label="fit" hint={fitting ? "fitting…" : fittedTo < 0 ? "run J" : "fitted"} onClick={fit} />
      <Act k="x" label="swap" hint="nose ↔ beak" onClick={swap} />
    </div>
  );
}

function Act({
  k,
  label,
  hint,
  onClick,
}: {
  k: string;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-11 flex-col items-start justify-center gap-0.5 border border-line bg-surface px-3 py-2 text-left transition-[border-color,background-color,transform] duration-150 ease-out hover:border-ink hover:bg-paper active:scale-[0.96]"
    >
      <span className="font-mono text-xs font-medium tracking-wide text-ink">{label}</span>
      <span className="font-mono text-micro text-mute">
        {k} · {hint}
      </span>
    </button>
  );
}
