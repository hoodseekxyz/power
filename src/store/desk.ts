import { create } from "zustand";
import {
  FACE_TOKS,
  LAYERS,
  NOSE_LAYER,
  NOSE_POS,
  YOU_WORDS,
  youWord,
  type TapeEvent,
} from "@/lib/jlens";
import { moodFrom, sitPos, VISUAL_POS, type Mood, type Sitter, type Tape } from "@/lib/mood";
import { LIVE_PLANE, SITE } from "@/lib/site";
import { SEL, connect as walletConnect, sendCall, shortTx } from "@/lib/wallet";

export type Scope = "specimen" | "slice";
export type Sending = null | "ping" | "spark" | "fit";

type Desk = {
  account: string | null;
  you: string;
  guest: boolean;
  fittedTo: number;
  fitting: boolean;
  sending: Sending;
  selected: { layer: number; pos: number };
  pinned: string;
  injected: { pos: number; word: string } | null;
  focusLayer: number;
  scope: Scope;
  glow: number;
  hideWs: boolean;
  events: TapeEvent[];
  sitters: Sitter[];
  tape: Tape;
  lastTick: { side: "buy" | "sell"; word: string; t: number } | null;
  err: string | null;
  mood: () => Mood;
  hydrate: () => void;
  connect: (addr: string) => void;
  disconnect: () => void;
  select: (layer: number, pos: number, word: string) => void;
  setFocus: (layer: number) => void;
  setScope: (scope: Scope) => void;
  setHideWs: (v: boolean) => void;
  ping: () => void;
  spark: () => void;
  fit: () => void;
  swap: () => void;
  note: (kind: TapeEvent["kind"], label: string) => void;
  setErr: (e: string | null) => void;
};

let nid = 0;
let sid = 0;
let fitRaf = 0;
let tapeTimer = 0;
let taped = false;

function pickGuest() {
  const n = Math.floor(Math.random() * YOU_WORDS.length);
  return YOU_WORDS[n] ?? "holder";
}

function ghostSitter(i: number): Sitter {
  const seed = `tape-${i}`;
  return {
    id: `g${i}`,
    word: YOU_WORDS[i % YOU_WORDS.length]!,
    pos: sitPos(seed),
    weight: 0.45 + ((i * 17) % 10) / 20,
  };
}

function upsertSitter(list: Sitter[], next: Sitter): Sitter[] {
  const i = list.findIndex((s) => s.id === next.id || (next.you && s.you));
  if (i < 0) return [next, ...list].slice(0, 18);
  const copy = [...list];
  const prev = copy[i]!;
  copy[i] = { ...prev, ...next, weight: Math.min(3, prev.weight + next.weight) };
  return copy;
}

function sitLocal(
  set: (fn: (s: Desk) => Partial<Desk>) => void,
  get: () => Desk,
  kind: "ping" | "spark",
  weight: number,
  buyN: number,
) {
  const { you, selected, account } = get();
  const pos = selected.pos;
  set((s) => ({
    injected: { pos, word: you },
    err: null,
    glow: Date.now(),
    tape: { buy: s.tape.buy + buyN, sell: s.tape.sell },
    lastTick: { side: "buy", word: you, t: Date.now() },
    sitters: upsertSitter(s.sitters, {
      id: account?.toLowerCase() ?? `you-${you}`,
      word: you,
      pos,
      weight,
      you: true,
    }),
  }));
  const extra = kind === "spark" ? (LIVE_PLANE ? " + 0.0001 ETH" : " + 0.0001 ETH (plane pending)") : "";
  get().note(kind, `${you} at ${FACE_TOKS[pos]?.t ?? pos}${extra}`);
}

export const useDesk = create<Desk>((set, get) => ({
  account: null,
  you: "holder",
  guest: true,
  fittedTo: LAYERS - 1,
  fitting: false,
  sending: null,
  selected: { layer: NOSE_LAYER, pos: NOSE_POS },
  pinned: "nose",
  injected: null,
  focusLayer: NOSE_LAYER,
  scope: "slice",
  glow: 0,
  hideWs: true,
  events: [
    {
      id: "g0",
      kind: "pin",
      label: "nose · ^ · workspace",
      t: 0,
    },
  ],
  sitters: [0, 1, 2, 3, 4].map(ghostSitter),
  tape: { buy: 4, sell: 2 },
  lastTick: null,
  err: null,

  mood: () => {
    const s = get();
    return moodFrom(s.tape, s.sitters, s.glow > 0 && Date.now() - s.glow < 900);
  },

  hydrate: () => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("jlens-you");
    if (saved && (YOU_WORDS as readonly string[]).includes(saved)) {
      set({ you: saved });
    } else {
      const you = pickGuest();
      window.localStorage.setItem("jlens-you", you);
      set({ you });
    }
    if (taped) return;
    taped = true;
    const loop = () => {
      const wait = 2400 + Math.floor(Math.random() * 2200);
      tapeTimer = window.setTimeout(() => {
        const buy = Math.random() > 0.42;
        const pos = VISUAL_POS[Math.floor(Math.random() * VISUAL_POS.length)]!;
        const word = YOU_WORDS[Math.floor(Math.random() * YOU_WORDS.length)]!;
        set((s) => {
          let sitters = s.sitters;
          if (buy) {
            sitters = upsertSitter(sitters, {
              id: `t${++sid}`,
              word,
              pos,
              weight: 0.35,
            });
          } else if (sitters.length > 3) {
            const victim = sitters.find((x) => !x.you) ?? sitters[sitters.length - 1]!;
            sitters = sitters
              .map((x) => (x.id === victim.id ? { ...x, weight: x.weight * 0.55 } : x))
              .filter((x) => x.you || x.weight > 0.18);
          }
          const ev: TapeEvent = {
            id: `e${++nid}`,
            kind: buy ? "buy" : "sell",
            label: `${buy ? "buy" : "sell"} · ${word} · ${FACE_TOKS[pos]?.t ?? pos}`,
            t: Date.now(),
          };
          return {
            sitters,
            tape: {
              buy: s.tape.buy + (buy ? 1 : 0),
              sell: s.tape.sell + (buy ? 0 : 1),
            },
            lastTick: { side: buy ? "buy" : "sell", word, t: Date.now() },
            events: [ev, ...s.events].slice(0, 24),
          };
        });
        loop();
      }, wait);
    };
    loop();
  },
  connect: (addr) => {
    const you = youWord(addr);
    if (typeof window !== "undefined") window.localStorage.setItem("jlens-you", you);
    const pos = get().selected.pos;
    set((s) => ({
      account: addr,
      you,
      guest: false,
      err: null,
      sitters: upsertSitter(s.sitters, {
        id: addr.toLowerCase(),
        word: you,
        pos,
        weight: 1,
        you: true,
      }),
    }));
    get().note("ping", `${you} sits in J-space`);
  },
  disconnect: () =>
    set((s) => ({
      account: null,
      guest: true,
      sitters: s.sitters.map((x) => (x.you ? { ...x, you: false } : x)),
    })),
  select: (layer, pos, word) => {
    set({ selected: { layer, pos }, pinned: word, focusLayer: layer });
    const tok = FACE_TOKS[pos]?.t ?? "?";
    get().note("pin", `${word} · ${tok} · L${layer}`);
  },
  setFocus: (layer) => {
    const pos = get().selected.pos;
    set({ focusLayer: layer, selected: { layer, pos } });
  },
  setScope: (scope) => set({ scope }),
  setHideWs: (hideWs) => set({ hideWs }),
  ping: () => {
    sitLocal(set, get, "ping", 0.7, 1);
    if (!LIVE_PLANE) return;
    void (async () => {
      set({ sending: "ping" });
      try {
        let addr = get().account;
        if (!addr) {
          addr = await walletConnect();
          get().connect(addr);
        }
        const h = await sendCall(SITE.planeCa, SEL.ping);
        get().note("ping", `tx ${shortTx(h)}`);
      } catch (e) {
        set({ err: e instanceof Error ? e.message : "ping failed" });
      } finally {
        set({ sending: null });
      }
    })();
  },
  spark: () => {
    sitLocal(set, get, "spark", 1.2, 2);
    if (!LIVE_PLANE) return;
    void (async () => {
      set({ sending: "spark" });
      try {
        let addr = get().account;
        if (!addr) {
          addr = await walletConnect();
          get().connect(addr);
        }
        const h = await sendCall(SITE.planeCa, SEL.spark, SITE.sparkWei);
        get().note("spark", `tx ${shortTx(h)}`);
      } catch (e) {
        set({ err: e instanceof Error ? e.message : "spark failed" });
      } finally {
        set({ sending: null });
      }
    })();
  },
  fit: () => {
    if (get().fitting) return;
    if (fitRaf) cancelAnimationFrame(fitRaf);
    set({ fitting: true, fittedTo: -1, err: null });
    get().note("fit", "J_l = E[∂h_final / ∂h_l]");
    let layer = 0;
    let last = 0;
    const tick = (t: number) => {
      if (t - last < 28 && layer > 0) {
        fitRaf = requestAnimationFrame(tick);
        return;
      }
      last = t;
      set({ fittedTo: layer, focusLayer: layer });
      layer += 1;
      if (layer < LAYERS) fitRaf = requestAnimationFrame(tick);
      else {
        set({ fitting: false, focusLayer: 42, selected: { ...get().selected, layer: 42 } });
      }
    };
    fitRaf = requestAnimationFrame(tick);
    if (!LIVE_PLANE || !get().account) return;
    void (async () => {
      set({ sending: "fit" });
      try {
        const h = await sendCall(SITE.planeCa, SEL.fit);
        get().note("fit", `tx ${shortTx(h)}`);
      } catch (e) {
        set({ err: e instanceof Error ? e.message : "fit failed" });
      } finally {
        set({ sending: null });
      }
    })();
  },
  swap: () => {
    const { pinned, selected } = get();
    const pos = selected.pos;
    const next = pinned === "nose" ? "beak" : pinned === "beak" ? "snout" : "nose";
    set({ injected: { pos, word: next }, pinned: next, glow: Date.now() });
    get().note("swap", `${pinned} → ${next}`);
  },
  note: (kind, label) =>
    set((s) => ({
      events: [{ id: `e${++nid}`, kind, label, t: Date.now() }, ...s.events].slice(0, 24),
    })),
  setErr: (err) => set({ err }),
}));

export function stopTape() {
  if (tapeTimer) window.clearTimeout(tapeTimer);
  taped = false;
}
