import { create } from "zustand";
import { cross, SIDE_MAX, squareOfSum, sumA, sumSq, type Seat } from "@/lib/power";
import { LIVE_SQUARE, SITE } from "@/lib/site";
import { SEL, connect as walletConnect, sendCall, shortTx } from "@/lib/wallet";

const KEY = "power-square";

const WORDS = ["watt", "gnomon", "cross", "exponent", "term", "square", "odd"];

type Desk = {
  account: string | null;
  you: string;
  seats: Seat[];
  err: string | null;
  last: string | null;
  sending: null | "ping" | "spark";
  hydrate: () => void;
  connect: (addr: string) => void;
  ping: () => void;
  spark: () => void;
};

function ghosts(): Seat[] {
  return [
    { id: "g1", label: "alpha", a: 2 },
    { id: "g2", label: "beta", a: 1 },
    { id: "g3", label: "gamma", a: 2 },
  ];
}

function pickYou() {
  return WORDS[Math.floor(Math.random() * WORDS.length)] ?? "term";
}

function evict(seats: Seat[], da: number): Seat[] | null {
  const next = seats.map((s) => ({ ...s }));
  while (sumA(next) + da > SIDE_MAX) {
    let bi = -1;
    let best = Infinity;
    next.forEach((s, i) => {
      if (s.you) return;
      if (s.a < best) {
        best = s.a;
        bi = i;
      }
    });
    if (bi < 0) return null;
    next.splice(bi, 1);
  }
  return next;
}

export const usePower = create<Desk>((set, get) => ({
  account: null,
  you: "term",
  seats: ghosts(),
  err: null,
  last: null,
  sending: null,
  hydrate: () => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) {
        set({ you: pickYou() });
        return;
      }
      const saved = JSON.parse(raw) as { you?: string; seats?: Seat[] };
      set({
        you: saved.you || pickYou(),
        seats: saved.seats?.length ? saved.seats : ghosts(),
      });
    } catch {
      set({ you: pickYou(), seats: ghosts() });
    }
  },
  connect: (addr) => set({ account: addr, err: null }),
  ping: () => add(set, get, 1, "ping"),
  spark: () => add(set, get, 3, "spark"),
}));

function add(
  set: (p: Partial<Desk>) => void,
  get: () => Desk,
  da: number,
  kind: "ping" | "spark",
) {
  const state = get();
  const grown = evict(state.seats, da);
  if (!grown) {
    set({ err: "The square is full. Side caps at 12." });
    return;
  }
  let you = grown.find((s) => s.you);
  if (!you) {
    you = { id: "you", label: state.you, a: 0, you: true };
    grown.push(you);
  }
  you.a += da;
  set({ seats: grown, err: null, last: kind === "spark" ? "spark +3" : "ping +1" });
  try {
    localStorage.setItem(KEY, JSON.stringify({ you: state.you, seats: grown }));
  } catch {
    /* ignore */
  }
  if (kind === "spark" && LIVE_SQUARE) {
    set({ sending: "spark" });
    sendCall(SITE.squareCa, SEL.spark, SITE.sparkWei)
      .then((h) => set({ sending: null, last: shortTx(h) }))
      .catch((e) => set({ sending: null, err: e instanceof Error ? e.message : "spark failed" }));
  } else if (kind === "ping" && LIVE_SQUARE && state.account) {
    set({ sending: "ping" });
    sendCall(SITE.squareCa, SEL.ping)
      .then((h) => set({ sending: null, last: shortTx(h) }))
      .catch((e) => set({ sending: null, err: e instanceof Error ? e.message : "ping failed" }));
  }
}

export async function connectPower() {
  return walletConnect();
}

export function stats(seats: Seat[]) {
  return { s: sumA(seats), sq: squareOfSum(seats), own: sumSq(seats), cross: cross(seats) };
}
