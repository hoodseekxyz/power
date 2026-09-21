import { LivingFaceSvg } from "@/components/living-face";
import { LayerStrip } from "@/components/layer-column";
import { cn } from "@/lib/cn";
import {
  FACE_TOKS,
  OUTPUT_LAYER,
  WORKSPACE,
  beats,
  inWorkspace,
  readout,
} from "@/lib/jlens";
import { moodFrom } from "@/lib/mood";
import { useDesk } from "@/store/desk";
import { useEffect, useState } from "react";

export function FaceStage() {
  const selected = useDesk((s) => s.selected);
  const injected = useDesk((s) => s.injected);
  const focusLayer = useDesk((s) => s.focusLayer);
  const fittedTo = useDesk((s) => s.fittedTo);
  const glow = useDesk((s) => s.glow);
  const sitters = useDesk((s) => s.sitters);
  const tape = useDesk((s) => s.tape);
  const lastTick = useDesk((s) => s.lastTick);
  const select = useDesk((s) => s.select);
  const [blink, setBlink] = useState(false);
  const [glowing, setGlowing] = useState(false);

  useEffect(() => {
    let stop = false;
    let t: number;
    const loop = () => {
      const wait = 2800 + Math.floor(Math.random() * 2400);
      t = window.setTimeout(() => {
        if (stop) return;
        setBlink(true);
        window.setTimeout(() => setBlink(false), 140);
        loop();
      }, wait);
    };
    loop();
    return () => {
      stop = true;
      window.clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    if (!glow) return;
    setGlowing(true);
    const t = window.setTimeout(() => setGlowing(false), 900);
    return () => window.clearTimeout(t);
  }, [glow]);

  const pos = selected.pos;
  const shown = fittedTo >= focusLayer;
  const cell = readout(focusLayer, pos, injected);
  const tok = FACE_TOKS[pos]!;
  const trio = beats(pos, injected);
  const mood = moodFrom(tape, sitters, glowing);
  const vol = tape.buy + tape.sell;
  const buyPct = vol === 0 ? 50 : Math.round((tape.buy / vol) * 100);

  return (
    <section className="relative flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center overflow-hidden px-3 py-3 sm:px-6 sm:py-4">
      <div className="relative z-10 flex w-full max-w-xl flex-col items-center">
        <p className="kicker mb-1 sm:mb-2">the specimen says</p>
        <div key={`${cell.word}-${focusLayer}-${pos}`} className="say-pop text-center">
          <div
            className={cn(
              "font-display text-4xl font-medium tracking-[-0.04em] text-ink sm:text-6xl lg:text-7xl",
              !shown && "text-faint",
            )}
          >
            {shown ? cell.word : "·"}
          </div>
          <p className="mt-1 font-mono text-label tabular-nums text-mute">
            {tok.t} · L{String(focusLayer).padStart(2, "0")}
            {focusLayer === OUTPUT_LAYER ? " out" : inWorkspace(focusLayer) ? " workspace" : ""}
            {shown ? ` · rank ${cell.rank}°` : " · fit to read"}
          </p>
        </div>

        <div
          className={cn(
            "relative mt-3 flex w-full max-w-md justify-center sm:mt-4",
            glowing && "drop-shadow-[0_0_24px_color-mix(in_oklab,var(--color-ws)_45%,transparent)]",
          )}
        >
          <LivingFaceSvg
            highlight={pos}
            blink={blink}
            mood={mood}
            sitters={sitters}
            onPick={(p) => {
              const next = FACE_TOKS[p];
              if (!next) return;
              const word = readout(Math.max(focusLayer, 0), p, injected).word;
              select(focusLayer, p, word);
            }}
          />
          {lastTick && Date.now() - lastTick.t < 1400 ? (
            <span
              key={lastTick.t}
              className={cn(
                "say-pop pointer-events-none absolute right-2 top-6 font-mono text-label uppercase tracking-[0.14em]",
                lastTick.side === "buy" ? "text-ws" : "text-warn",
              )}
            >
              {lastTick.side}
            </span>
          ) : null}
        </div>

        <div className="mt-2 flex w-full max-w-md items-center gap-3 font-mono text-micro tabular-nums text-mute">
          <span className="w-10 text-ws">buy</span>
          <div className="h-1.5 min-w-0 flex-1 bg-ink/10">
            <div className="h-full bg-ws transition-[width] duration-500 ease-out" style={{ width: `${buyPct}%` }} />
          </div>
          <span className="w-10 text-right text-warn">sell</span>
          <span className="text-ink">
            {sitters.length} sitting · ink {Math.round(mood.ink * 100)}
          </span>
        </div>

        <div className="mt-3 hidden w-full max-w-md grid-cols-3 gap-2 sm:mt-4 sm:grid">
          <Beat label="early" cell={trio.early} on={focusLayer < WORKSPACE.lo} />
          <Beat label="workspace" cell={trio.workspace} on={inWorkspace(focusLayer)} accent />
          <Beat label="mouth" cell={trio.out} on={focusLayer === OUTPUT_LAYER} />
        </div>

        <div className="mt-3 w-full max-w-md sm:mt-4">
          <LayerStrip />
        </div>

        <p className="mt-2 hidden max-w-sm text-center font-mono text-micro leading-relaxed text-mute sm:mt-3 sm:block">
          Click <span className="text-pin">^</span>. Buys ink the face. Sells dash it back. Ping sits you.
        </p>
      </div>
    </section>
  );
}

function Beat({
  label,
  cell,
  on,
  accent,
}: {
  label: string;
  cell: { word: string; rank: number };
  on: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-md border px-2 py-2 text-center transition-colors duration-150",
        on ? (accent ? "border-ws bg-ws/10" : "border-ink bg-ink text-paper") : "border-line",
      )}
    >
      <div className={cn("kicker", on && !accent && "text-paper/70")}>{label}</div>
      <div className={cn("mt-1 font-mono text-sm", on && accent && "text-ws")}>{cell.word}</div>
    </div>
  );
}

