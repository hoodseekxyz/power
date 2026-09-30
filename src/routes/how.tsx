import { Footer, Header } from "@/components/chrome";
import { SITE } from "@/lib/site";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export const Route = createFileRoute("/how")({ component: How });

function How() {
  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      <Header />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10">
        <header>
          <p className="kicker">the square</p>
          <h1 className="mt-2 font-display text-4xl tracking-[-0.03em] sm:text-5xl">{SITE.line}</h1>
        </header>

        <figure className="grid items-center gap-6 border border-line p-4 sm:grid-cols-[220px_1fr] sm:p-6">
          <Gnomon />
          <figcaption className="text-sm leading-relaxed text-ink/80">
            Each ring is an odd number of new cells. Odds only know how to finish a square. The red ring is the
            seat that just sat. Everything inside it was already there.
          </figcaption>
        </figure>

        <section className="grid gap-3 sm:grid-cols-2">
          <article className="border border-line p-4">
            <p className="kicker">Σ a²</p>
            <p className="mt-3 font-display text-4xl tracking-[-0.03em]">what you can point at</p>
            <p className="mt-3 text-sm leading-relaxed text-mute">
              A seat holds a number, <em>a</em>. Square it and that piece is yours. Add every seat’s square and you
              still do not have the board.
            </p>
          </article>
          <article className="border border-power p-4">
            <p className="kicker text-power">2 Σ ab</p>
            <p className="mt-3 font-display text-4xl tracking-[-0.03em] text-power">the part nobody owns</p>
            <p className="mt-3 text-sm leading-relaxed text-mute">
              The board is the square of everyone together. The gap between that and the sum of the squares only
              exists because two seats share a room. That gap is the pool.
            </p>
          </article>
        </section>

        <p className="border border-line bg-surface px-4 py-5 text-center font-display text-2xl tracking-[-0.03em] sm:text-3xl">
          (Σa)² = Σa² <span className="text-power">+ 2Σab</span>
        </p>

        <section className="grid gap-3 sm:grid-cols-3">
          <Card kicker="ping" title="+1">
            One more ring. The side grows by one. The room holds {SITE.sideMax}.
          </Card>
          <Card kicker="spark" title="+3">
            Three rings at once, and {SITE.sparkEth} ETH of glow on the square contract. Glow, not yield.
          </Card>
          <Card kicker="the door" title="12">
            The next sit past the cap throws the lightest other seat. Your own seat is spared until you are the only
            mass left.
          </Card>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <article className="border border-line p-4">
            <p className="kicker text-power">buy</p>
            <Arrow from="GME" to="$SQPOWER" />
            <p className="mt-3 text-sm leading-relaxed text-mute">
              The pool takes GME and pays the token out. A buy is the market, not a seat.
            </p>
          </article>
          <article className="border border-line p-4">
            <p className="kicker">sell</p>
            <Arrow from="$SQPOWER" to="GME" />
            <p className="mt-3 text-sm leading-relaxed text-mute">
              The token goes back into the pool and GME comes out. The tape on the desk is these two motions, live.
            </p>
          </article>
        </section>

        <p className="text-sm leading-relaxed text-mute">
          The pixels on the desk are the pool, shared. A buy heats one. A large buy closes the ring in red and takes the seat. A sell cools a pixel and leaves it there. Twelve rings make an epoch. Then a blank square opens.
        </p>
        <Link to="/" className="font-mono text-xs text-power underline">
          back to the live desk
        </Link>
      </main>
      <Footer />
    </div>
  );
}

function Card({ kicker, title, children }: { kicker: string; title: string; children: ReactNode }) {
  return (
    <article className="border border-line p-4">
      <p className="kicker">{kicker}</p>
      <p className="mt-2 font-display text-3xl tracking-[-0.03em]">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-mute">{children}</p>
    </article>
  );
}

function Arrow({ from, to }: { from: string; to: string }) {
  return (
    <p className="mt-4 flex items-center gap-2 font-mono text-sm">
      <span>{from}</span>
      <span className="text-power" aria-hidden>
        →
      </span>
      <span>{to}</span>
    </p>
  );
}

function Gnomon() {
  const n = 8;
  const cells = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const step = Math.max(r, c);
      let fill = "#e7e1d4";
      if (step < 2) fill = "#1a1a1a";
      else if (step < 5) fill = "rgba(26,26,26,0.72)";
      else if (step === 5) fill = "#c2412d";
      cells.push(<rect key={`${r}-${c}`} x={c} y={r} width="0.92" height="0.92" fill={fill} />);
    }
  }
  return (
    <svg viewBox={`0 0 ${n} ${n}`} className="w-full max-w-[220px]" shapeRendering="crispEdges" aria-hidden>
      {cells}
    </svg>
  );
}
