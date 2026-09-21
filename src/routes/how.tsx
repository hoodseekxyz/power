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
          J-lens · J-space
        </h1>
        <p className="mt-4 max-w-prose text-pretty text-base leading-relaxed text-ink/80">
          The paper’s treasure is a pair. The <span className="text-pin">J-lens</span> reads what an
          activation is poised to say. <span className="text-pin">J-space</span> is the set of
          points expressible as a sparse nonnegative combination of those vectors, with occupancy{" "}
          <em>k ≤ {SITE.k}</em>. One wallet, one coefficient. Full workspace evicts the lightest
          seat. Desk toy of <em>{SITE.paperTitle}</em>. Click <span className="text-pin">^</span>{" "}
          (pos 28). Layer 42 reads “nose”.
        </p>
        <pre className="mt-6 overflow-x-auto border border-line bg-surface p-4 font-mono text-xs text-ink">
{`lens_l(h) = unembed( J_l @ h )
J-space  = { Σ a_i v_i  |  a_i ≥ 0,  |S| ≤ 25 }`}
        </pre>
        <ul className="mt-8 space-y-4 font-mono text-sm leading-relaxed">
          <li>
            Specimen is the ASCII face. Magenta plate sits on <span className="text-pin">^</span>.
            Slice is the paper dump, behind a tab.
          </li>
          <li>
            <span className="text-pin">ping</span> — free sit in J-space on the glyph you clicked.
            Guest play is on. k counts toward 25.
          </li>
          <li>
            <span className="text-pin">spark</span> — sit + {SITE.sparkEth} ETH. Ignition. ETH
            forwards to J-space as glow, not yield.
          </li>
          <li>
            <span className="text-pin">fit</span> — run the transport. Layers fill. Last row is the
            mouth.
          </li>
          <li>
            <span className="text-pin">swap</span> — paper’s probe-swap. Nose becomes beak.
          </li>
          <li>
            Overlay last. Remix on chain {SITE.chainId}: deploy{" "}
            <span className="text-ink">JLensWorkspace.sol</span> (0.8.24, optimizer 200, Cancun).
            One tx deploys two children — <span className="text-ink">jlens()</span> and{" "}
            <span className="text-ink">jspace()</span>. Paste those CAs. Then LONG mints $
            {SITE.ticker}. Owner <span className="text-pin">bindToken</span> once on the lens.
            Never put a workspace CA in the LONG form.
          </li>
        </ul>
        <p className="mt-8 max-w-prose text-pretty text-sm leading-relaxed text-mute">
          Keys: space ping · j fit · s spark · x swap. Chain {SITE.chainId} {SITE.chainName}. Pair{" "}
          {SITE.pair}. Token CA empty until LONG mints ${SITE.ticker}. Not affiliated with
          Anthropic. Apache-2.0 companion:{" "}
          <a className="underline" href={SITE.source}>
            anthropics/jacobian-lens
          </a>
          . Site{" "}
          <a className="underline" href={SITE.site}>
            jlens.lol
          </a>{" "}
          · {SITE.xHandle}.
        </p>
        <Link to="/" className="mt-8 inline-block font-mono text-xs text-pin underline">
          back to the specimen
        </Link>
      </main>
      <Footer />
    </div>
  );
}
