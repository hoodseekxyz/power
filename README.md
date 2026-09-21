# jacobian-lens

Ticker `JLENS`. Pair: LONG × ANTHROPICx1L. Site: [jlens.lol](https://jlens.lol) · X [@jlensLOL](https://x.com/jlensLOL)

A full-window desk toy of the [Jacobian lens](https://transformer-circuits.pub/2026/workspace/index.html) (Gurnee, Sofroniew, Lindsey et al., Jul 2026). Companion code: [anthropics/jacobian-lens](https://github.com/anthropics/jacobian-lens). **Not affiliated with Anthropic.**

The specimen is the paper’s ASCII face. Selecting `^` (the nose) at mid layers reads **nose** — a word that is not in the prompt.

## The tape draws the face

Each wallet is a token in J-space. It sits on a glyph (eye, brow, nose, mouth…).

- **Buys** ink that stroke. The dashed sketch fills in. The mouth smiles.
- **Sells** fade the stroke back to dashes. The mouth frowns.
- **Ping** sits you on the part you clicked. Free.
- **Spark** sits + 0.0001 ETH. Glow, not yield.
- **Fit** runs `J_l = E[∂h_final / ∂h_l]` down the stack.
- **Swap** is the paper’s probe-swap toy: nose → beak → snout.

```
lens_l(h) = unembed( J_l @ h )
```

Token CA empty until LONG mints. Do not invent an address. Overlay last.

## Plane (Remix, before LONG token)

`contracts/JLensWorkspace.sol` — 0.8.24, optimizer 200, Cancun, chain 4663.

1. Deploy. Constructor none. `owner` = your wallet. Socials already point at jlens.lol / @jlensLOL / this repo.
2. Write **`unfold()`** — twenty-four face tokens. Once.
3. Read `socials()`.
4. Paste the plane CA into `src/lib/site.ts` as `planeCa`. Push.
5. Anyone: **`ping()`** free sit. **`spark()`** sit + 0.0001 ETH. Sending ETH is `Fed`. Not yield.
6. After LONG mints JLENS: `bindToken(token)` once.
7. `harvest(address(0))` counts ETH sitting on the plane. Anyone.

Do not put this CA in the LONG token form as a fake ticker. Token is last.

### LONG description

```
A wallet is a token in J-space. The tape draws the face. Click the nose. $JLENS on LONG × ANTHROPICx1L. Desk toy of the Jacobian lens. Not affiliated with Anthropic.
```
