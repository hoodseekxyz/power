# jacobian-lens

Ticker `JLENS`. Pair: LONG × ANTHROPICx1L. Site: [jlens.lol](https://jlens.lol) · X [@jlensLOL](https://x.com/jlensLOL)

A full-window desk toy of the [Jacobian lens](https://transformer-circuits.pub/2026/workspace/index.html) (Gurnee, Sofroniew, Lindsey et al., Jul 2026). Companion code: [anthropics/jacobian-lens](https://github.com/anthropics/jacobian-lens). **Not affiliated with Anthropic.**

The paper’s treasure is a pair:

- **J-lens** — readout. `lens(h) = unembed(J_l @ h)`. Ping / spark / fit.
- **J-space** — sparse subframe. Points expressible as a nonnegative combination of at most **k = 25** J-lens vectors. A wallet is one coefficient. Full workspace evicts the lightest seat.

The specimen is the paper’s ASCII face. Selecting `^` (pos 28) at layer 42 reads **nose**.

## The pair on Robinhood 4663

One factory tx deploys both children.

`contracts/JLensWorkspace.sol` → `jlens()` + `jspace()`. Solidity 0.8.24, optimizer 200, Cancun.

1. Deploy the factory. Constructor none. `owner` = your wallet.
2. Read `jlens()` and `jspace()`. Paste into `src/lib/site.ts` as `jlensCa` / `jspaceCa`. Push.
3. Anyone: **`ping()`** on the lens — free sit in J-space. **`spark()`** sit + 0.0001 ETH, forwarded to J-space as glow.
4. Occupancy saturates at 25. The 26th sit evicts the lightest weight.
5. After LONG mints JLENS: `jlens.bindToken(token)` once (also binds J-space).
6. Do not put any of these CAs in the LONG token form.

```
lens_l(h) = unembed( J_l @ h )
J-space   = { Σ a_i v_i | a_i ≥ 0, |S| ≤ 25 }
```

### LONG description

```
A wallet is a token in J-space. The lens reads it. Click the nose. $JLENS on LONG × ANTHROPICx1L. Pair: J-lens + J-space, k≤25. Not affiliated with Anthropic.
```
