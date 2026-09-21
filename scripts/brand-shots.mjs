import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

const OUT = "/workspace/public/brand";

const EGG = `
<svg viewBox="0 0 200 272" fill="none" stroke="#111" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
  <path d="M 80 20 H 120"/>
  <path d="M 72 34 L 60 50"/>
  <path d="M 128 34 L 140 50"/>
  <path d="M 52 60 L 40 80"/>
  <path d="M 148 60 L 160 80"/>
  <path d="M 34 90 Q 24 108 34 126"/>
  <path d="M 166 90 Q 176 108 166 126"/>
  <path d="M 30 134 V 154"/>
  <path d="M 170 134 V 154"/>
  <path d="M 30 164 V 184"/>
  <path d="M 170 164 V 184"/>
  <path d="M 78 168 L 90 182"/>
  <path d="M 122 168 L 110 182"/>
  <path d="M 90 186 H 110"/>
  <path d="M 40 198 L 54 216"/>
  <path d="M 160 198 L 146 216"/>
  <path d="M 58 222 L 76 238"/>
  <path d="M 142 222 L 124 238"/>
  <path d="M 76 240 H 124"/>
  <path d="M 86 250 V 266"/>
  <path d="M 114 250 V 266"/>
  <path d="M 60 70 Q 65 63 70 70 T 80 70"/>
  <path d="M 120 70 Q 125 63 130 70 T 140 70"/>
  <path d="M 91 140 L 100 124 L 109 140"/>
  <ellipse cx="68" cy="104" rx="8.2" ry="9"/>
  <ellipse cx="132" cy="104" rx="8.2" ry="9"/>
  <rect x="85" y="116" width="30" height="32" rx="7" stroke="#c026d3" stroke-width="2.1"/>
</svg>
`;

const CSS = `
  @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Mono:wght@400;500;600&display=swap");
  html, body { margin: 0; background: #fff; color: #111; font-family: "IBM Plex Mono", ui-monospace, monospace; }
  * { box-sizing: border-box; }
`;

const pages = {
  "x-logo": {
    w: 800,
    h: 800,
    html: `<style>${CSS} .wrap{width:800px;height:800px;display:flex;align-items:center;justify-content:center;background:#fff} svg{width:560px;height:auto}</style><div class="wrap">${EGG}</div>`,
  },
  "x-banner": {
    w: 1500,
    h: 500,
    html: `<style>${CSS}
      .b{width:1500px;height:500px;display:flex;align-items:center;gap:48px;padding:36px 64px;background:#fff}
      svg{width:280px;height:auto;flex-shrink:0}
      .t{display:flex;flex-direction:column;gap:10px}
      h1{font-family:Fraunces,serif;font-weight:500;font-size:92px;margin:0;letter-spacing:-0.04em;line-height:0.9}
      .sub{font-size:22px;letter-spacing:0.04em}
      .k{color:#c026d3;font-size:28px}
      .pair{font-size:16px;color:#5c5c5c;letter-spacing:0.08em}
    </style>
    <div class="b">${EGG}<div class="t">
      <h1>JLENS</h1>
      <div class="sub">J-lens reads. J-space holds.</div>
      <div class="k">k ≤ 25</div>
      <div class="pair">$JLENS · LONG × ANTHROPICx1L</div>
    </div></div>`,
  },
  "x-post-1": {
    w: 1600,
    h: 900,
    html: `<style>${CSS}
      .p{width:1600px;height:900px;background:#fff;display:flex;flex-direction:column;padding:48px 64px 40px}
      .row{display:flex;gap:0;flex:1;min-height:0}
      .col{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:12px 32px}
      .col + .col{border-left:1px solid #e8e8e8}
      .kicker{font-size:14px;letter-spacing:0.22em;text-transform:uppercase;color:#5c5c5c}
      h2{font-family:Fraunces,serif;font-weight:500;font-size:52px;margin:0;letter-spacing:-0.03em}
      .cap{font-size:18px;color:#111;text-align:center;max-width:28ch;line-height:1.45}
      svg{width:240px;height:auto}
      .grid{display:grid;grid-template-columns:repeat(5,28px);gap:10px}
      .seat{width:28px;height:28px;border:1.5px solid #111;border-radius:6px}
      .seat.on{background:#c026d3;border-color:#c026d3}
      .foot{border-top:1px solid #e8e8e8;padding-top:22px;font-size:20px;letter-spacing:0.04em}
    </style>
    <div class="p">
      <div class="row">
        <div class="col">
          <div class="kicker">the readout</div>
          <h2>J-lens</h2>
          ${EGG}
          <div class="cap">reads what an activation is poised to say</div>
        </div>
        <div class="col">
          <div class="kicker">the workspace</div>
          <h2>J-space</h2>
          <div class="grid">${Array.from({ length: 25 }, (_, i) => `<div class="seat${i < 5 ? " on" : ""}"></div>`).join("")}</div>
          <div class="cap">k ≤ 25 · one wallet, one coefficient. the 26th evicts the lightest seat.</div>
        </div>
      </div>
      <div class="foot">a wallet is a token in J-space · $JLENS · LONG × ANTHROPICx1L</div>
    </div>`,
  },
  "x-post-2": {
    w: 1080,
    h: 1080,
    html: `<style>${CSS}
      .p{width:1080px;height:1080px;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;padding:48px}
      .kicker{font-size:14px;letter-spacing:0.22em;text-transform:uppercase;color:#5c5c5c}
      .say{font-family:Fraunces,serif;font-weight:500;font-size:88px;letter-spacing:-0.04em;line-height:1}
      .meta{font-size:18px;color:#5c5c5c}
      svg{width:420px;height:auto}
    </style>
    <div class="p">
      <div class="kicker">the specimen says</div>
      <div class="say">nose</div>
      ${EGG}
      <div class="meta">^ · pos 28 · L42 workspace · $JLENS</div>
    </div>`,
  },
  "og": {
    w: 1200,
    h: 630,
    html: `<style>${CSS}
      .p{width:1200px;height:630px;background:#fff;display:flex;align-items:center;gap:56px;padding:48px 72px}
      svg{width:320px;height:auto;flex-shrink:0}
      h1{font-family:Fraunces,serif;font-weight:500;font-size:84px;margin:0;letter-spacing:-0.04em;line-height:0.9}
      .sub{margin-top:14px;font-size:22px}
      .k{margin-top:10px;color:#c026d3;font-size:24px}
      .pair{margin-top:18px;font-size:16px;color:#5c5c5c}
    </style>
    <div class="p">${EGG}<div>
      <h1>JLENS</h1>
      <div class="sub">J-lens reads. J-space holds.</div>
      <div class="k">k ≤ 25</div>
      <div class="pair">$JLENS · LONG × ANTHROPICx1L · jlens.lol</div>
    </div></div>`,
  },
  "x-feed": {
    w: 1200,
    h: 264,
    html: `<style>${CSS}
      .b{width:1200px;height:264px;display:flex;align-items:center;gap:36px;padding:20px 48px;background:#fff}
      svg{width:160px;height:auto;flex-shrink:0}
      h1{font-family:Fraunces,serif;font-weight:500;font-size:64px;margin:0;letter-spacing:-0.04em}
      .sub{font-size:18px;margin-top:6px}
      .k{color:#c026d3;font-size:18px;margin-top:4px}
    </style>
    <div class="b">${EGG}<div>
      <h1>JLENS</h1>
      <div class="sub">J-lens reads. J-space holds.</div>
      <div class="k">k ≤ 25 · LONG × ANTHROPICx1L</div>
    </div></div>`,
  },
};

const browser = await chromium.launch({ args: ["--no-sandbox"] });
await mkdir(OUT, { recursive: true });
for (const [name, spec] of Object.entries(pages)) {
  const page = await browser.newPage({ viewport: { width: spec.w, height: spec.h }, deviceScaleFactor: 2 });
  await page.setContent(spec.html, { waitUntil: "networkidle" });
  const file = join(OUT, `${name}.png`);
  await mkdir(dirname(file), { recursive: true });
  await page.screenshot({ path: file, type: "png" });
  if (name === "og") {
    await page.screenshot({ path: "/workspace/public/og.jpg", type: "jpeg", quality: 88 });
  }
  if (name === "x-feed") {
    await page.screenshot({ path: "/workspace/public/x-banner.jpg", type: "jpeg", quality: 88 });
  }
  await page.close();
  console.log("wrote", file);
}
await browser.close();
