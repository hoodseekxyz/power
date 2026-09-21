import { FaceMark } from "@/components/face-mark";
import { LIVE_PLANE, LIVE_TOKEN, SITE, shortCa } from "@/lib/site";
import { connect, shortAddr } from "@/lib/wallet";
import { useDesk } from "@/store/desk";
import { useState } from "react";

export function Header() {
  const account = useDesk((s) => s.account);
  const connectDesk = useDesk((s) => s.connect);
  const setErr = useDesk((s) => s.setErr);
  const [busy, setBusy] = useState(false);

  async function onConnect() {
    setBusy(true);
    try {
      const a = await connect();
      connectDesk(a);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "connect failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-line bg-paper px-3 py-2.5 sm:px-4">
      <a href="/" className="flex min-w-0 items-center gap-2.5">
        <FaceMark size={40} lit />
        <div className="min-w-0">
          <div className="truncate font-display text-lg font-medium leading-none tracking-[-0.03em] text-ink sm:text-xl">
            jacobian-lens
          </div>
          <div className="mt-0.5 font-mono text-micro tracking-wide text-mute">
            ${SITE.ticker} · {SITE.pair}
          </div>
        </div>
      </a>

      <div className="flex items-center gap-2 sm:gap-3">
        <CaChip label="token" value={LIVE_TOKEN ? shortCa(SITE.tokenCa) : "pending"} live={LIVE_TOKEN} />
        <CaChip
          label="JLensWorkspace"
          value={LIVE_PLANE ? shortCa(SITE.planeCa) : "pending"}
          live={LIVE_PLANE}
        />
        <button
          type="button"
          onClick={onConnect}
          disabled={busy}
          className="h-11 border border-ink bg-ink px-3 font-mono text-xs font-medium text-paper transition-[background-color,transform] duration-150 hover:bg-ink/90 active:scale-[0.96] disabled:opacity-50 sm:px-4"
        >
          {account ? shortAddr(account) : busy ? "…" : "Connect"}
        </button>
      </div>
    </header>
  );
}

function CaChip({ label, value, live }: { label: string; value: string; live: boolean }) {
  return (
    <div className="hidden min-w-0 flex-col sm:flex">
      <span className="font-mono text-micro tracking-wide text-mute">{label}</span>
      <span className={`font-mono text-xs tabular-nums ${live ? "text-ws" : "text-ink"}`}>{value}</span>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-line bg-paper px-3 py-2 font-mono text-micro text-mute sm:px-4">
      <span className="hidden max-w-[min(100%,42rem)] truncate md:inline">{SITE.paperTitle}</span>
      <span className="flex flex-wrap gap-3">
        <a className="hover:text-ink" href={SITE.site}>
          {SITE.site.replace("https://", "")}
        </a>
        <a className="hover:text-ink" href={SITE.x} target="_blank" rel="noreferrer">
          {SITE.xHandle}
        </a>
        <a className="hover:text-ink" href={SITE.github} target="_blank" rel="noreferrer">
          git
        </a>
        <a className="hover:text-ink" href={SITE.paper} target="_blank" rel="noreferrer">
          paper
        </a>
        <a className="hover:text-ink" href="/how">
          how
        </a>
        <span>Not affiliated with Anthropic.</span>
      </span>
    </footer>
  );
}
