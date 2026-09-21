# JLENS — launch handoff

Open this file in the next session. Do not re-research the paper. Ship.

Last git: `38604e8` on `main` · [hoodseekxyz/jlens](https://github.com/hoodseekxyz/jlens)

---

## 0. One screen

| | |
|---|---|
| Token | jacobian-lens · ticker **JLENS** |
| Pair | LONG × **ANTHROPICx1L** `0x1937caD42b17D43bB2b347ce16d5288887C46c33` |
| Chain | Robinhood **4663** · rpc `https://rpc.mainnet.chain.robinhood.com` · [Blockscout](https://robinhoodchain.blockscout.com) |
| Site | [jlens.lol](https://jlens.lol) |
| X | [@jlensLOL](https://x.com/jlensLOL) |
| GitHub | [hoodseekxyz/jlens](https://github.com/hoodseekxyz/jlens) |
| Vercel | project name `JLENS` · team `useipra` · git-connected |
| Paper | [Verbalizable Representations Form a Global Workspace](https://transformer-circuits.pub/2026/workspace/index.html) · companion [anthropics/jacobian-lens](https://github.com/anthropics/jacobian-lens) |
| Face | `ornek.png` (ASCII dashed egg, magenta plate on `^`) |
| Line | *A wallet is a token in J-space. The lens reads it. Click the nose.* |

**Empty CAs. Do not invent them.** `src/lib/site.ts` → `tokenCa`, `jlensCa`, `jspaceCa`, `planeCa` are `""` until a real deploy / LONG mint.

Not affiliated with Anthropic. Copy is English. LONG form never gets a workspace CA.

---

## 1. What this is

A full-window desk toy of the Jacobian lens. Two on-chain children, one factory tx:

- **J-lens** — readout. `lens(h) = unembed(J_l @ h)`. `ping` / `spark` / `fit`.
- **J-space** — sparse subframe. Points expressible as a nonnegative combination of at most **k = 25** J-lens vectors. One wallet, one coefficient. Seat 26 evicts the lightest weight.

The specimen is the paper’s ASCII face. Click `^` (pos 28) at layer 42 → the lens says **nose** (a word not in the prompt).

Guest ping works with no wallet. Spark is 0.0001 ETH of glow, not yield. Swap is the paper’s probe-swap (nose → beak). Fit runs the toy transport down the layers.

This is not a chart. It is a workspace you sit in.

---

## 2. What is already done

### Product
- TanStack Start + React 19 + Tailwind v4 desk: header / face / side panels / footer.
- Home default = **specimen** (living SVG egg). Slice vis lives behind a tab. Do not put the heatmap on the landing page.
- Header chips: `token` · `J-lens` · `J-space`. Fun name is **J-lens / J-space**, not “plane contract”.
- `/how` explains the pair.
- Guest mode, EIP-6963 connect, ping/spark/fit/swap, occupancy bar `k/25`.
- Keys: space ping · j fit · s spark · x swap.

### Contracts (`contracts/`, Solidity 0.8.24, optimizer 200, Cancun)
- `JLensWorkspace.sol` — factory. Constructor **none**. Deploys both children, `bindLens`, emits `Pair(jlens, jspace)`.
- `JLens.sol` — `ping()` free sit · `spark()` 0.0001 ETH sit+glow · `fit()` signal · `bindToken(t)` once (also binds J-space).
- `JSpace.sol` — `K=25`, `N=45`, eviction of lightest seat, `onlyLens` sit, glow ETH.

### Face (do not “improve”)
North star is `ornek.png`. Short black chords, white paper, magenta `#c026d3` rounded rect on `^`.

Egg contour, left then right:

```
        -----
      /       \
    /           \
   (    0   0    )
   |      ^      |
   |    \   /    |     smile inside, not touching sides
    \           /      ← backslash on the LEFT under the ears
      \       /
        -----
        |   |
```

Upper-left `/`, lower-left `\`. If those flip, the egg becomes a diamond. Font `/` glyphs shift a column per row — use SVG chords (`living-face.tsx`), not IBM Plex `/` characters for the oval.

Wordmark **JLENS** is IBM Plex Mono 600. Fraunces `J` looks broken. Keep Fraunces only for “nose” / display phrases.

### Palette (`src/styles.css`)
```
--color-paper: #ffffff
--color-surface: #f7f7f7
--color-ink:    #111111
--color-mute:   #5c5c5c
--color-line:   #e8e8e8
--color-pin:    #c026d3
--color-ws:     #111111
```
White / black / magenta. No parchment, no teal leftover.

### Brand pack (`public/brand/`)
| File | Use |
|---|---|
| `x-logo.png` | X profile 800² |
| `x-banner.png` | X header 1500×500 (Plex Mono JLENS) |
| `x-post-1.png` | Post 1 — the pair (J-lens / J-space k≤25) |
| `x-post-2.png` | Post 2 — punchline “the specimen says / nose” |
| `og.png` / `../og.jpg` | Share card |
| `x-feed.png` / `../x-banner.jpg` | 50:11 feed card |
| `COPY.md` | Bio, LONG blurb, two posts |
| `favicon.svg` | Tab icon, same egg |

Regenerate: `node scripts/brand-shots.mjs`

### Repo / deploy plumbing
- GitHub `hoodseekxyz/jlens` · Vercel project `JLENS` (team `useipra`) · domain bought `jlens.lol`.
- Preview: `npm run dev` on `:8080`. Production check: `npm run build` then `npm run preview:restart` + smoke.

---

## 3. What is NOT done (launch list)

Do in this order. Stop if a CA is missing — never invent one.

### A. Wire `jlens.lol`
1. Vercel → project `JLENS` → Domains → add `jlens.lol` + `www`.
2. DNS at the registrar: Vercel A / CNAME as they show.
3. Confirm https://jlens.lol serves this app, HTTPS on, `jlens.lol` in footer.

### B. Remix the factory (Robinhood 4663)
1. Remix IDE, compiler **0.8.24**, optimizer **200**, EVM **cancun**.
2. Environment: Injected Provider, chain 4663. RPC if needed: `https://rpc.mainnet.chain.robinhood.com`.
3. Load all three files. Deploy **`JLensWorkspace`** only. No constructor args.
4. After tx: call `jlens()` and `jspace()`. Two child addresses.
5. Verify on [Blockscout](https://robinhoodchain.blockscout.com). Factory socials already baked: site / X / github.
6. Paste into `src/lib/site.ts`:
   ```
   jlensCa:  "0x…"   // child, the one people ping
   jspaceCa: "0x…"   // child, occupancy
   planeCa:  "0x…"   // factory alias only — header does not need to show it
   ```
   `tokenCa` stays `""`.
7. Commit, push `main`. Vercel rebuilds. Header chips go live (magenta).
8. **Do not paste factory or either child into the LONG token form.**

### C. LONG mint $JLENS
LONG form (English only):

- Name: `jacobian-lens`
- Ticker: `JLENS`
- Pair: `ANTHROPICx1L`
- Description:
  ```
  A wallet is a token in J-space. The lens reads it. Click the nose. $JLENS on LONG × ANTHROPICx1L. Pair: J-lens + J-space, k≤25. Desk toy of the Jacobian lens. Not affiliated with Anthropic.
  ```
- Image: `public/brand/x-logo.png` (or the egg favicon export).
- Website: `https://jlens.lol`
- Twitter: `https://x.com/jlensLOL`
- Telegram: none unless they create one.

After mint: paste token CA into `SITE.tokenCa`. Push.

### D. Bind
Owner wallet, once, on **JLens** (the child, not the factory):

```
bindToken(tokenCa)
```

This also binds J-space. Revert if called twice.

### E. Site follows the tape (optional same-day, better day-two)
`desk.ts` still uses a local tape + ghost sitters when CAs are empty. After CAs exist:
- Ping/spark already encode to `lensCa()` when `LIVE_PLANE`.
- Next: Blockscout / RPC read `Sat` / `Pinged` / `Sparked` into the tape so occupancy is real, not ghosts.
- Swap UI is local (probe-swap). Keep it.

### F. X, then go live
Handle `@jlensLOL`.

**Bio**
```
A wallet is a token in J-space. The lens reads it. Click the nose.

$JLENS · LONG × ANTHROPICx1L
jlens.lol
Not Anthropic.
```
Location: `J-space` · Website: `https://jlens.lol`

**Assets:** `x-logo.png` → avatar · `x-banner.png` → header.

**Post 1** (attach `x-post-1.png`) — after CAs + LONG are live, so the tweets can include the token CA if LONG gives one. Until then tweet the mechanic without a CA.

```
J-lens reads.
J-space holds.

k ≤ 25. One wallet, one coefficient. The 26th sit evicts the lightest seat.

Not a chart. A workspace.

$JLENS · LONG × ANTHROPICx1L
jlens.lol
```

**Post 2** (attach `x-post-2.png`)

```
the specimen says

nose

^ is pos 28. At layer 42 the lens names a word that is not in the prompt.

Click the nose. Sit in J-space.

$JLENS
jlens.lol
```

Do not dump a contract address in the first post unless LONG has minted.

---

## 4. Files the next session will touch

| Path | Why |
|---|---|
| `src/lib/site.ts` | **Only** place CAs go |
| `src/store/desk.ts` | Wire real events after deploy |
| `src/lib/wallet.ts` | Chain 4663, spark wei |
| `src/components/living-face.tsx` | Face. Touch only if ornek drifts |
| `src/components/face-mark.tsx` | Header mark |
| `src/styles.css` | Palette |
| `contracts/*.sol` | Remix source. Do not “clean up” for launch |
| `public/brand/*` | X / LONG images |
| `scripts/brand-shots.mjs` | Regen posters |
| `LAUNCH.md` | This file. Update CAs here when they exist |

Do not restyle the landing into a slice heatmap. Do not swap Fraunces onto the JLENS wordmark. Do not put teal back.

---

## 5. Mechanic cheat sheet

```
lens_l(h) = unembed( J_l @ h )
J-space   = { Σ a_i v_i | a_i ≥ 0, |S| ≤ 25 }
```

| Action | Chain | Site |
|---|---|---|
| ping | `JLens.ping()` → `JSpace.sit(who, pos, 1)` | guest or wallet sits on clicked glyph |
| spark | `JLens.spark()` 0.0001 ETH → sit weight 8 + ETH to J-space | ignition, not yield |
| fit | `JLens.fit()` event | toy transport, layers fill, last row = mouth |
| swap | — | local probe-swap, nose/beak |
| bindToken | owner, once, on JLens | after LONG mint |

Pos is `keccak(who, pings) % 45`. N=45 matches `FACE_TOKS`. Nose index `NOSE_I = 28`.

Occupancy UI: `sitters.length / 25`. Cap 25 on the client too (`upsertSitter` slices to 25).

---

## 6. Visual north star (ornek)

If the face “doesn’t look like GitHub”:
1. Open `ornek.png` (user attach) next to a smoke screenshot.
2. Check lower oval: left `\` right `/`. If `/ \` the chin is a diamond — that was the last face bug.
3. Upper ticks are short chords on the oval, not full-cell font slashes.
4. Magenta box hugs `^` only, rounded rect, stroke not fill.
5. Eyes are outlined `0`, not filled dots. Tildes are simple `~`.
6. Background `#ffffff`, ink `#111111`, pin `#c026d3`.

Header mark = same egg on a white tile (`FaceMark`). Favicon = same, simplified.

---

## 7. Copy rules

- English on site, LONG, X.
- Always: **Not affiliated with Anthropic.**
- Never invent a token address in UI or tweets.
- Punchline is **nose**, not a slogan farm.
- Pair line: `$JLENS · LONG × ANTHROPICx1L`

Site tagline (`SITE.line`): `A wallet is a token in J-space. The lens reads it.`

---

## 8. Next-session opener (paste this)

```
You are AI CTO on jacobian-lens / $JLENS.
Read /workspace/LAUNCH.md and /workspace/README.md.
Do not redesign the face or the landing.
Launch order: (1) confirm jlens.lol DNS if not live
(2) user deploys JLensWorkspace on Robinhood 4663 — they paste two child CAs
(3) write them into src/lib/site.ts, push
(4) LONG mint copy is already in LAUNCH.md — after they mint, paste tokenCa, owner bindToken
(5) then we go live on X with public/brand assets.
Never invent a CA. English copy. Not Anthropic.
```

When the user drops two child CAs, only edit `src/lib/site.ts`, smoke, push. Do not redeploy contracts from the sandbox unless they ask.

---

## 9. Secrets / what not to commit

GitHub PAT and Vercel token lived in an earlier chat. **They are not in this repo. Do not paste them into files.** Use the already-connected git remote and Vercel git integration.

If push auth dies: the user must rotate the PAT and send a new one in chat. Do not log tokens.

---

## 10. Launch-day checklist (print)

- [ ] `jlens.lol` resolves, HTTPS, this build
- [ ] X avatar + banner + bio + website
- [ ] Remix: JLensWorkspace on 4663, 0.8.24 / 200 / cancun
- [ ] `jlens()` + `jspace()` verified on Blockscout
- [ ] `site.ts` has both child CAs, `tokenCa` still empty, pushed
- [ ] Header chips show live J-lens / J-space
- [ ] Ping from a real wallet lands a `Pinged` + `Sat` on explorer
- [ ] Spark 0.0001 ETH lands on J-space as glow
- [ ] LONG mint $JLENS × ANTHROPICx1L, English description
- [ ] `tokenCa` pasted, pushed
- [ ] `bindToken` once on JLens
- [ ] X post 1 (pair) + post 2 (nose)
- [ ] No workspace CA in the LONG form
- [ ] Disclaimer still on /how and footer

When every box is ticked, update this file with the three CAs and the LONG pair URL. That is the archive.
