/** Public constants. Empty CA = pending. Do not invent an address. */
export const SITE = {
  name: "POWER",
  mark: "GME",
  ticker: "SQPOWER",
  line: "The square of the sum is not the sum of the squares.",
  tokenCa: "0xf35561b228cd1208f16cb9bbc5ee28b872fc1e18",
  squareCa: "0x303C627d93Fd8418fa6ea62e7d746FE484749d25",
  pair: "GME",
  pairCa: "0x1b0e319c6a659f002271b69db8a7df2f911c153e",
  chainId: 4663,
  chainName: "Robinhood Chain",
  rpc: "https://rpc.mainnet.chain.robinhood.com",
  explorer: "https://robinhoodchain.blockscout.com",
  sparkWei: "100000000000000",
  sparkEth: "0.0001",
  sideMax: 12,
  site: "https://sqpower.xyz",
  longUrl: "https://app.long.xyz/tokens/0xf35561b228CD1208F16Cb9bBc5ee28b872fC1e18",
  poolManager: "0x8366a39cc670b4001a1121b8f6a443a643e40951",
  poolId: "0xbd218d19e63b9be4d096e31139c3ece7f787409175c55e62b54d38d12014824c",
} as const;

export const LIVE_TOKEN = SITE.tokenCa.length === 42;
export const LIVE_SQUARE = SITE.squareCa.length === 42;

export function shortCa(ca: string, n = 4) {
  if (ca.length < 10) return "pending";
  return `${ca.slice(0, 2 + n)}…${ca.slice(-n)}`;
}
