import { createServerFn } from "@tanstack/react-start";
import { SITE } from "@/lib/site";

const SWAP = "0x40e9cecb9f5f1f1c5b9c97dec2917b7ee92e57ba5563708daca94dd84ad7112f";

export type Print = {
  side: "buy" | "sell";
  sq: number;
  gme: number;
  hash: string;
  block: number;
};

async function rpc(method: string, params: unknown[]) {
  const res = await fetch(SITE.rpc, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const body = (await res.json()) as { result?: unknown; error?: { message?: string } };
  if (body.error) throw new Error(body.error.message || "rpc");
  return body.result;
}

function intWord(word: string) {
  const n = BigInt("0x" + word);
  return n >= 1n << 255n ? n - (1n << 256n) : n;
}

function fromWei(n: bigint) {
  const v = n < 0n ? -n : n;
  const whole = v / 10n ** 18n;
  const frac = v % 10n ** 18n;
  return Number(whole) + Number(frac) / 1e18;
}

export const getTrades = createServerFn({ method: "GET" }).handler(async (): Promise<Print[]> => {
  const head = (await rpc("eth_blockNumber", [])) as string;
  const bn = Number.parseInt(head, 16);
  const logs = (await rpc("eth_getLogs", [
    {
      fromBlock: "0x" + Math.max(0, bn - 12000).toString(16),
      toBlock: "latest",
      address: SITE.poolManager,
      topics: [SWAP, SITE.poolId],
    },
  ])) as { data: string; transactionHash: string; blockNumber: string; logIndex: string }[];

  const byTx = new Map<string, Print>();
  for (const lg of logs) {
    const data = lg.data.slice(2);
    const a0 = intWord(data.slice(0, 64));
    const a1 = intWord(data.slice(64, 128));
    const sq = fromWei(a1);
    const gme = fromWei(a0);
    const side: Print["side"] = a1 < 0n ? "buy" : "sell";
    const prev = byTx.get(lg.transactionHash);
    if (prev && prev.sq >= sq) continue;
    byTx.set(lg.transactionHash, {
      side,
      sq,
      gme,
      hash: lg.transactionHash,
      block: Number.parseInt(lg.blockNumber, 16),
    });
  }
  return [...byTx.values()].sort((a, b) => b.block - a.block).slice(0, 12);
});
