import { Footer, Header } from "@/components/chrome";
import { SITE } from "@/lib/site";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/how")({ component: How });

function How() {
  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <p className="kicker">HOW</p>
        <h1 className="mt-2 font-display text-4xl tracking-[-0.03em]">{SITE.mark}</h1>
        <p className="mt-4 max-w-prose text-base leading-relaxed text-ink/80">
          {SITE.line} A seat holds a coefficient <em>a</em>. The board is the square of the sum.
          Your own power is <em>a²</em>. Everything between those two numbers is the cross term,
          and no single wallet owns it.
        </p>
        <pre className="mt-6 overflow-x-auto border border-line bg-surface p-4 font-mono text-xs">
{`(Σ a)²  =  Σ a²  +  2 Σ aᵢaⱼ
side     ≤  ${SITE.sideMax}`}
        </pre>
        <ul className="mt-8 space-y-3 font-mono text-sm leading-relaxed">
          <li>
            <span className="text-power">ping</span> — add 1. One more gnomon on the square. Guest play is on.
          </li>
          <li>
            <span className="text-power">spark</span> — add 3, and {SITE.sparkEth} ETH when the square contract is live. Glow, not yield.
          </li>
          <li>Side caps at {SITE.sideMax}. The next sit evicts the lightest other seat.</li>
          <li>
            Chain {SITE.chainId} {SITE.chainName}. Pair {SITE.pair}. Site{" "}
          <a className="underline" href={SITE.site}>
            sqpower.xyz
          </a>
          . Deploy <span className="text-ink">Power.sol</span>{" "}
            (0.8.24, optimizer 200, Cancun). Paste the CA. Then LONG mints ${SITE.ticker}. Owner{" "}
            <span className="text-power">bindToken</span> once. Never put the square CA in the LONG form.
          </li>
        </ul>
        <p className="mt-8 text-sm leading-relaxed text-mute">
          Not affiliated with Anthropic or GameStop. Token CA stays empty until LONG mints ${SITE.ticker}. Pair {SITE.pair} is not the token. Do not pass it to bindToken.
        </p>
        <Link to="/" className="mt-8 inline-block font-mono text-xs text-power underline">
          back to the square
        </Link>
      </main>
      <Footer />
    </div>
  );
}
