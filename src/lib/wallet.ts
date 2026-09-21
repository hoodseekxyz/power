import { SITE } from "./site";

export type Hex = `0x${string}`;

type Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (ev: string, fn: (...a: unknown[]) => void) => void;
  removeListener?: (ev: string, fn: (...a: unknown[]) => void) => void;
};

type Announce = {
  info: { uuid: string; name: string; rdns: string };
  provider: Provider;
};

function injected(): Provider | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { ethereum?: Provider };
  return w.ethereum ?? null;
}

function resolveProvider(): Promise<Provider> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("No window"));
      return;
    }
    const found: Provider[] = [];
    const onAnnounce = (ev: Event) => {
      const detail = (ev as CustomEvent<Announce>).detail;
      if (detail?.provider) found.push(detail.provider);
    };
    window.addEventListener("eip6963:announceProvider", onAnnounce);
    window.dispatchEvent(new Event("eip6963:requestProvider"));
    window.setTimeout(() => {
      window.removeEventListener("eip6963:announceProvider", onAnnounce);
      const eth = found[0] ?? injected();
      if (!eth) reject(new Error("No wallet. Inject MetaMask or OKX."));
      else resolve(eth);
    }, 90);
  });
}

export async function connect(): Promise<Hex> {
  const eth = await resolveProvider();
  const accs = (await eth.request({ method: "eth_requestAccounts" })) as string[];
  const addr = accs[0];
  if (!addr) throw new Error("No account");
  await ensureChain(eth);
  return addr as Hex;
}

async function ensureChain(eth: Provider) {
  const id = (await eth.request({ method: "eth_chainId" })) as string;
  const want = "0x" + SITE.chainId.toString(16);
  if (id.toLowerCase() === want.toLowerCase()) return;
  try {
    await eth.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: want }],
    });
  } catch {
    await eth.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: want,
          chainName: SITE.chainName,
          nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
          rpcUrls: [SITE.rpc],
          blockExplorerUrls: [SITE.explorer],
        },
      ],
    });
  }
}

export function shortAddr(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}
