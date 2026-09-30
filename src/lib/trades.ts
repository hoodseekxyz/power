import { createServerFn } from "@tanstack/react-start";
import { SITE } from "@/lib/site";

const SWAP = "0x40e9cecb9f5f1f1c5b9c97dec2917b7ee92e57ba5563708daca94dd84ad7112f";
const TRANSFER = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
const HOOK = "0x4e3468951d49f2eea976ed0d6e75ffcb44a9a544";
const ROUTERS = new Set([
  "0x6f02324d20cc679d0e585290caa6b16bacbc0f77",
  "0x8876789976decbfcbbbe364623c63652db8c0904",
  HOOK,
]);

export type Print = {
  side: "buy" | "sell";
  sq: number;
  gme: number;
  hash: string;
  block: number;
  who: string;
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

type Log = {
  data: string;
  transactionHash: string;
  blockNumber: string;
  logIndex: string;
  topics: string[];
};

function addr(topic: string) {
  return `0x${topic.slice(-40)}`.toLowerCase();
}

export const getTrades = createServerFn({ method: "GET" }).handler(async (): Promise<Print[]> => {
  const head = (await rpc("eth_blockNumber", [])) as string;
  const bn = Number.parseInt(head, 16);
  const from = Math.max(SITE.poolStartBlock, bn - 80_000);
  const span = { fromBlock: `0x${from.toString(16)}`, toBlock: "latest" };
  const [swapLogs, transferLogs] = (await Promise.all([
    rpc("eth_getLogs", [
      { ...span, address: SITE.poolManager, topics: [SWAP, SITE.poolId] },
    ]),
    rpc("eth_getLogs", [{ ...span, address: SITE.tokenCa, topics: [TRANSFER] }]),
  ])) as [Log[], Log[]];

  const pool = SITE.poolManager.toLowerCase();
  const moved = new Map<string, { from: string; to: string; amt: bigint }[]>();
  for (const lg of transferLogs) {
    const row = { from: addr(lg.topics[1] ?? ""), to: addr(lg.topics[2] ?? ""), amt: BigInt(lg.data) };
    const list = moved.get(lg.transactionHash) ?? [];
    list.push(row);
    moved.set(lg.transactionHash, list);
  }

  const who = (hash: string, side: Print["side"], fallback: string) => {
    const rows = moved.get(hash) ?? [];
    const hit =
      side === "buy"
        ? rows.filter((r) => r.from === pool && r.to !== pool).sort((a, b) => (a.amt > b.amt ? -1 : 1))[0]
        : rows.filter((r) => r.to === pool && r.from !== pool).sort((a, b) => (a.amt > b.amt ? -1 : 1))[0];
    let wallet = (side === "buy" ? hit?.to : hit?.from) ?? fallback;
    if (ROUTERS.has(wallet)) {
      const hop = rows
        .filter((r) => r.from === wallet && !ROUTERS.has(r.to) && r.to !== pool)
        .sort((a, b) => (a.amt > b.amt ? -1 : 1))[0];
      if (hop) wallet = hop.to;
    }
    return wallet;
  };

  const byTx = new Map<string, Print>();
  for (const lg of swapLogs) {
    const data = lg.data.slice(2);
    const a0 = intWord(data.slice(0, 64));
    const a1 = intWord(data.slice(64, 128));
    const sq = fromWei(a1);
    const gme = fromWei(a0);
    const side: Print["side"] = a1 > 0n ? "buy" : "sell";
    const prev = byTx.get(lg.transactionHash);
    if (prev && prev.sq >= sq) continue;
    byTx.set(lg.transactionHash, {
      side,
      sq,
      gme,
      hash: lg.transactionHash,
      block: Number.parseInt(lg.blockNumber, 16),
      who: who(lg.transactionHash, side, addr(lg.topics[2] ?? "0x")),
    });
  }
  return [...byTx.values()].sort((a, b) => b.block - a.block).slice(0, 400);
});
