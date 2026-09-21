import { Footer, Header } from "@/components/chrome";
import { SITE } from "@/lib/site";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/how")({ component: How });

function How() {
  return (
    <div className="paper-grain flex min-h-dvh flex-col text-ink">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <p className="kicker">HOW</p>
        <h1 className="mt-2 font-display text-3xl font-medium tracking-[-0.03em]">
          The tape draws the face.
        </h1>
        <p className="mt-4 max-w-prose text-pretty text-base leading-relaxed text-ink/80">
          Desk toy of the Jacobian lens from <em>{SITE.paperTitle}</em>. The specimen is the paper’s
          ASCII face. The market is the ink. The lens linearly transports a residual vector at any
          layer and position into the final-layer basis, then unembeds it into a ranked list of
          vocabulary tokens.
        </p>
        <pre className="mt-6 overflow-x-auto border border-line bg-surface p-4 font-mono text-xs text-ink">
{`lens_l(h) = unembed( J_l @ h )
J_l = E[∂h_final / ∂h_l]`}
        </pre>
        <ul className="mt-8 space-y-4 font-mono text-sm leading-relaxed">
          <li>
            The dashed sketch is the empty residual. Each holder sits on a glyph. Buys paint that
            stroke solid. Sells fade it back to dashes. Mouth follows buy/sell. Eyes open with
            occupancy. The caret <span className="text-ws">^</span> is the nose.
          </li>
          <li>
            Click the face — especially <span className="text-ws">^</span>. Mid layers read “nose”
            although the prompt never says it. That is the paper’s example.
          </li>
          <li>
            <span className="text-ws">ping</span> — free sit on the part you clicked. Guest play is
            on. Your address, if you connect, hashes to a verbalizable word that occupies that
            column in the workspace band.
          </li>
          <li>
            <span className="text-ws">spark</span> — sit + {SITE.sparkEth} ETH. Plane CA pending.
            ETH is glow, not yield.
          </li>
          <li>
            <span className="text-ws">fit</span> — run the transport. Layers fill. Mid band is
            J-space. Last row is the model’s mouth.
          </li>
          <li>
            <span className="text-ws">swap</span> — paper’s probe-swap toy. Nose becomes beak.
            Same vector, different verbalization.
          </li>
          <li>
            <span className="text-ws">slice</span> — unfold the whole residual. Every prompt token
            × every layer.
          </li>
        </ul>
        <p className="mt-8 max-w-prose text-pretty text-sm leading-relaxed text-mute">
          Keys: space ping · j fit · s spark · x swap · arrows walk layers and tokens. Chain{" "}
          {SITE.chainId} {SITE.chainName}. Pair {SITE.pair}. Token CA empty until LONG mints $
          {SITE.ticker}. Overlay last. Desk tape is a local residual until the token CA is bound —
          then the same face reads the pair. Not affiliated with Anthropic. Apache-2.0 companion:{" "}
          <a className="underline" href={SITE.source}>
            anthropics/jacobian-lens
          </a>
          . Site{" "}
          <a className="underline" href={SITE.site}>
            jlens.lol
          </a>
          · {SITE.xHandle}.
        </p>
        <Link to="/" className="mt-8 inline-block font-mono text-xs text-ws underline">
          back to the specimen
        </Link>
      </main>
      <Footer />
    </div>
  );
}
