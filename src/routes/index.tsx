import { ActionPad } from "@/components/action-pad";
import { Footer, Header } from "@/components/chrome";
import { PaperVis } from "@/components/paper-vis";
import { FACE_TOKS, LAYERS } from "@/lib/jlens";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useDesk } from "@/store/desk";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const ping = useDesk((s) => s.ping);
  const spark = useDesk((s) => s.spark);
  const fit = useDesk((s) => s.fit);
  const swap = useDesk((s) => s.swap);
  const setFocus = useDesk((s) => s.setFocus);
  const select = useDesk((s) => s.select);
  const hydrate = useDesk((s) => s.hydrate);
  const selected = useDesk((s) => s.selected);

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
      } else if (e.key === "j" || e.key === "J") fit();
      else if (e.key === "s" || e.key === "S") spark();
      else if (e.key === "x" || e.key === "X") swap();
      else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocus(Math.min(LAYERS - 1, selected.layer + 1));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocus(Math.max(0, selected.layer - 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const p = Math.max(0, selected.pos - 1);
        const tok = FACE_TOKS[p];
        if (tok) select(selected.layer, p, tok.role === "nose" ? "nose" : tok.role);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const p = Math.min(FACE_TOKS.length - 1, selected.pos + 1);
        const tok = FACE_TOKS[p];
        if (tok) select(selected.layer, p, tok.role === "nose" ? "nose" : tok.role);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ping, spark, fit, swap, setFocus, select, selected]);

  return (
    <div className="paper-grain flex h-dvh flex-col overflow-hidden text-ink">
      <Header />
      <PaperVis />
      <div className="shrink-0 border-t border-line bg-surface p-2 lg:hidden">
        <ActionPad compact />
      </div>
      <Footer />
    </div>
  );
}
