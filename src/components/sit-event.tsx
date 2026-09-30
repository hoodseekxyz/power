import { RINGS, type Picture } from "@/lib/paint";
import { compact } from "@/components/trade-tape";

export function SitEvent({ picture }: { picture: Picture }) {
  const close =
    picture.threshold === Number.POSITIVE_INFINITY ? "waiting for a crowd" : `close above ${compact(picture.threshold)} GME`;

  return (
    <div className="shrink-0 border-b border-line bg-paper px-3 py-3 sm:px-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="kicker">{picture.full ? `epoch ${picture.epoch} · full` : `epoch ${picture.epoch}`}</p>
        <p className="font-mono text-xs tabular-nums text-ink">
          ring {Math.min(picture.ring + (picture.full ? 0 : 1), RINGS)}/{RINGS}
        </p>
      </div>
      <div className="mt-2 flex gap-1" aria-hidden>
        {Array.from({ length: RINGS }, (_, i) => (
          <span key={i} className={`h-1.5 flex-1 ${i < picture.ring ? "bg-power" : "bg-surface"}`} />
        ))}
      </div>
      <p className="mt-2 font-mono text-xs text-mute">
        {picture.filled}/{picture.ringCells} pixels in this ring · {close}. A sell cools a pixel. It does not erase it.
      </p>
    </div>
  );
}
