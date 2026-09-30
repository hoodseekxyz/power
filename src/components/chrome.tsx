import { LIVE_SQUARE, LIVE_TOKEN, SITE, shortCa } from "@/lib/site";
import { connectPower } from "@/store/power";
import { usePower } from "@/store/power";
import { shortAddr } from "@/lib/wallet";
import { useState } from "react";

export function Header() {
  const account = usePower((s) => s.account);
  const connect = usePower((s) => s.connect);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onConnect() {
    setBusy(true);
    setErr(null);
    try {
      connect(await connectPower());
    } catch (e) {
      setErr(e instanceof Error ? e.message : "connect failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-line bg-paper px-3 py-2.5 sm:px-4">
      <a href="/" className="flex min-w-0 items-center gap-2.5">
        <Mark />
        <div className="min-w-0">
          <div className="truncate font-display text-lg leading-none tracking-[-0.03em] text-ink sm:text-xl">
            {SITE.name}
          </div>
          <div className="mt-0.5 font-mono text-micro tracking-wide text-mute">
            {SITE.mark} · ${SITE.ticker} · {SITE.pair}
          </div>
        </div>
      </a>
      <div className="flex items-center gap-2 sm:gap-3">
        <Chip label="token" value={LIVE_TOKEN ? shortCa(SITE.tokenCa) : "pending"} live={LIVE_TOKEN} />
        <Chip label="square" value={LIVE_SQUARE ? shortCa(SITE.squareCa) : "pending"} live={LIVE_SQUARE} />
        <button
          type="button"
          onClick={onConnect}
          disabled={busy}
          className="h-11 border border-ink bg-ink px-3 font-mono text-xs text-paper transition-[background-color,transform] duration-150 hover:bg-ink/90 active:scale-[0.98] disabled:opacity-50"
        >
          {account ? shortAddr(account) : busy ? "…" : "Connect"}
        </button>
      </div>
      {err ? <span className="sr-only">{err}</span> : null}
    </header>
  );
}

function Mark() {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden className="shrink-0">
      <rect width="40" height="40" fill="var(--color-ink)" />
      <text
        x="30"
        y="14"
        textAnchor="end"
        fill="var(--color-paper)"
        fontFamily="var(--font-display), serif"
        fontSize="14"
      >
        2
      </text>
    </svg>
  );
}

function Chip({ label, value, live }: { label: string; value: string; live: boolean }) {
  return (
    <div className="hidden min-w-0 flex-col sm:flex">
      <span className="font-mono text-micro tracking-wide text-mute">{label}</span>
      <span className={`font-mono text-xs tabular-nums ${live ? "text-power" : "text-ink"}`}>{value}</span>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-line bg-paper px-3 py-2 font-mono text-micro text-mute sm:px-4">
      <span className="truncate">{SITE.line}</span>
      <span className="flex gap-3">
        <a className="hover:text-ink" href={SITE.site}>
          sqpower.xyz
        </a>
        <span className="text-ink">{SITE.pair}</span>
        <a className="hover:text-ink" href="/how">
          how
        </a>
      </span>
    </footer>
  );
}
