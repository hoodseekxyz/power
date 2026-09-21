/** Public constants. Empty CA = pending. Do not invent an address. */
export const SITE = {
  name: "jacobian-lens",
  ticker: "JLENS",
  tagline: "The lens reads out what an activation is disposed to make the model say.",
  line: "A wallet is a token in J-space. The lens reads it.",
  tokenCa: "",
  planeCa: "",
  jlensCa: "",
  jspaceCa: "",
  pair: "ANTHROPICx1L",
  pairCa: "0x1937caD42b17D43bB2b347ce16d5288887C46c33",
  chainId: 4663,
  chainName: "Robinhood Chain",
  rpc: "https://rpc.mainnet.chain.robinhood.com",
  explorer: "https://robinhoodchain.blockscout.com",
  paper: "https://transformer-circuits.pub/2026/workspace/index.html",
  paperTitle: "Verbalizable Representations Form a Global Workspace in Language Models",
  source: "https://github.com/anthropics/jacobian-lens",
  github: "https://github.com/hoodseekxyz/jlens",
  x: "https://x.com/jlensLOL",
  xHandle: "@jlensLOL",
  site: "https://jlens.lol",
  sparkWei: "100000000000000",
  sparkEth: "0.0001",
  k: 25,
} as const;

export const LIVE_TOKEN = SITE.tokenCa.length === 42;
export const LIVE_JLENS = SITE.jlensCa.length === 42 || SITE.planeCa.length === 42;
export const LIVE_JSPACE = SITE.jspaceCa.length === 42;
export const LIVE_PLANE = LIVE_JLENS;

export function lensCa() {
  return SITE.jlensCa.length === 42 ? SITE.jlensCa : SITE.planeCa;
}

export function shortCa(ca: string, n = 4) {
  if (ca.length < 10) return "pending";
  return `${ca.slice(0, 2 + n)}…${ca.slice(-n)}`;
}

export function explorerAddress(ca: string) {
  return `${SITE.explorer}/address/${ca}`;
}

export const LONG_BLURB =
  "A wallet is a token in J-space. The lens reads it. Click the nose. $JLENS on LONG × ANTHROPICx1L. Pair: J-lens + J-space, k≤25. Not affiliated with Anthropic.";
