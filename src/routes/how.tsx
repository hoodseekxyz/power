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
          J-lens — ASCII face
        </h1>
        <p className="mt-4 max-w-prose text-pretty text-base leading-relaxed text-ink/80">
          Desk toy of the slice view in <em>{SITE.paperTitle}</em>. The specimen is the paper’s
          ASCII face. Click <span className="text-pin">^</span> (pos 28). At layer 42 the lens reads
          “nose” — a word that never appears in the prompt. The market sits on the same grid.
        </p>
        <pre className="mt-6 overflow-x-auto border border-line bg-surface p-4 font-mono text-xs text-ink">
{`lens_l(h) = unembed( J_l @ h )
J_l = E[∂h_final / ∂h_l]`}
        </pre>
        <ul className="mt-8 space-y-4 font-mono text-sm leading-relaxed">
          <li>
            The left grid is layer × position. Each cell is the lens top-1 word. Magenta is the
            selected cell. Mid layers over the face-parts name them: eyes, smile,{" "}
            <span className="text-pin">nose</span>.
          </li>
          <li>
            The small drawing is the prompt. Click a glyph. By Layer and By Pos are the paper’s
            two dumps. The heatmap is rank of the pinned word at every (pos, layer).
          </li>
          <li>
            <span className="text-ws">ping</span> — free sit on the column you clicked. Guest play
            is on. Workspace cells switch to your word.
          </li>
          <li>
            <span className="text-ws">spark</span> — sit + {SITE.sparkEth} ETH. Plane CA pending.
            ETH is glow, not yield.
          </li>
          <li>
            <span className="text-ws">fit</span> — run the transport. Layers fill. Last row is the
            model’s mouth.
          </li>
          <li>
            <span className="text-ws">swap</span> — paper’s probe-swap toy. Nose becomes beak.
            Same vector, different verbalization.
          </li>
          <li>
            Overlay last. Remix on chain {SITE.chainId}: deploy{" "}
            <span className="text-ink">JLensWorkspace.sol</span> (0.8.24, optimizer 200, Cancun).
            Write <span className="text-ws">unfold</span> once. Paste the plane CA. Then LONG mints
            ${SITE.ticker} — paste the token CA, owner <span className="text-ws">bindToken</span>{" "}
            once. Never put the plane CA in the LONG form.
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
