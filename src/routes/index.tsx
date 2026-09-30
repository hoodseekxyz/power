import { Footer, Header } from "@/components/chrome";
import { PowerSide } from "@/components/power-side";
import { SitEvent } from "@/components/sit-event";
import { SquareBoard } from "@/components/square-board";
import { usePower } from "@/store/power";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const seats = usePower((s) => s.seats);
  const ping = usePower((s) => s.ping);
  const spark = usePower((s) => s.spark);
  const hydrate = usePower((s) => s.hydrate);
  const sending = usePower((s) => s.sending);
  const flash = usePower((s) => s.flash);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        ping();
      } else if (e.key === "s" || e.key === "S") spark();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ping, spark]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-paper text-ink">
      <Header />
      <SitEvent />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        <main className="flex shrink-0 items-center justify-center p-4 sm:p-8 lg:min-h-0 lg:flex-1">
          <SquareBoard seats={seats} onPing={ping} flash={flash} />
        </main>
        <PowerSide />
      </div>
      <div className="flex shrink-0 gap-2 border-t border-line bg-paper p-2 lg:hidden">
        <button
          type="button"
          onClick={ping}
          className="h-11 flex-1 border border-ink bg-ink font-mono text-xs text-paper"
        >
          {sending === "ping" ? "…" : "ping +1"}
        </button>
        <button
          type="button"
          onClick={spark}
          className="h-11 flex-1 border border-power bg-power font-mono text-xs text-paper"
        >
          {sending === "spark" ? "…" : `spark +3`}
        </button>
      </div>
      <Footer />
    </div>
  );
}