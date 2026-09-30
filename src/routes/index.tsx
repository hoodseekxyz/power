import { Footer, Header } from "@/components/chrome";
import { Panel } from "@/components/panel";
import { PowerSide } from "@/components/power-side";
import { SitEvent } from "@/components/sit-event";
import { SquareBoard } from "@/components/square-board";
import { usePrints } from "@/components/use-prints";
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
  const { rows, err } = usePrints();

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
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      <Header />
      <SitEvent />
      <div className="grid flex-1 gap-3 p-3 lg:grid-cols-12 lg:items-start">
        <Panel kicker="the board" live className="lg:col-span-5">
          <div className="mt-3 flex justify-center">
            <SquareBoard seats={seats} onPing={ping} flash={flash} />
          </div>
        </Panel>
        <div className="lg:col-span-7">
          <PowerSide rows={rows} err={err} />
        </div>
      </div>
      <div className="sticky bottom-0 flex gap-2 border-t border-line bg-paper p-2 lg:hidden">
        <button type="button" onClick={ping} className="h-11 flex-1 border border-ink bg-ink font-mono text-xs text-paper">
          {sending === "ping" ? "…" : "ping +1"}
        </button>
        <button type="button" onClick={spark} className="h-11 flex-1 border border-power bg-power font-mono text-xs text-paper">
          {sending === "spark" ? "…" : "spark +3"}
        </button>
      </div>
      <Footer />
    </div>
  );
}
