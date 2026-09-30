import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

const OUT = "/workspace/public/brand";

/** Side-6 square. Last gnomon (step 5) is you, in vermillion. */
function square(size) {
  const cells = [];
  for (let r = 0; r < 12; r++) {
    for (let c = 0; c < 12; c++) {
      const step = Math.max(r, c);
      let fill = "#e7e1d4";
      if (step < 2) fill = "#1a1a1a";
      else if (step < 3) fill = "rgba(26,26,26,0.55)";
      else if (step < 5) fill = "rgba(26,26,26,0.78)";
      else if (step === 5) fill = "#c2412d";
      cells.push(`<rect x="${c}" y="${r}" width="0.92" height="0.92" fill="${fill}"/>`);
    }
  }
  return `<svg viewBox="0 0 12 12" width="${size}" height="${size}" shape-rendering="crispEdges">${cells.join("")}</svg>`;
}

function mark(size) {
  return `<svg viewBox="0 0 40 40" width="${size}" height="${size}"><rect width="40" height="40" fill="#1a1a1a"/><text x="30" y="15" text-anchor="end" fill="#f3efe6" font-family="Newsreader, Georgia, serif" font-size="14">2</text></svg>`;
}

const CSS = `
  @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Newsreader:opsz,wght@6..72,500&display=swap");
  html, body { margin: 0; background: #f3efe6; color: #1a1a1a; font-family: "IBM Plex Mono", ui-monospace, monospace; }
  * { box-sizing: border-box; }
  .word { font-family: "IBM Plex Mono", ui-monospace, monospace; font-weight: 500; letter-spacing: 0.14em; margin: 0; line-height: 1; }
  .display { font-family: Newsreader, Georgia, serif; font-weight: 500; letter-spacing: -0.03em; margin: 0; line-height: 0.95; }
  .kicker { font-size: 13px; letter-spacing: 0.22em; text-transform: uppercase; color: #6b6560; }
  .hot { color: #c2412d; }
`;

const pages = {
  "x-logo": {
    w: 800,
    h: 800,
    html: `<style>${CSS}
      .w{width:800px;height:800px;background:#1a1a1a}
      svg{width:800px;height:800px;display:block}
    </style><div class="w"><svg viewBox="0 0 40 40" width="800" height="800">
      <rect width="40" height="40" fill="#1a1a1a"/>
      <text x="30" y="15" text-anchor="end" fill="#f3efe6" font-family="Newsreader, Georgia, serif" font-size="14">2</text>
    </svg></div>`,
  },
  "x-banner": {
    w: 1500,
    h: 500,
    html: `<style>${CSS}
      .b{width:1500px;height:500px;display:flex;align-items:center;background:#f3efe6}
      .mark{width:500px;height:500px;flex-shrink:0}
      h1{font-size:84px}
      .t{padding:0 72px}
      .sub{margin-top:16px;font-size:22px}
      .k{margin-top:10px;font-size:26px}
      .pair{margin-top:18px;font-size:16px;color:#6b6560;letter-spacing:0.08em}
    </style>
    <div class="b">${mark(500)}<div class="t">
      <div class="kicker">ANTHROPIC²</div>
      <h1 class="word" style="margin-top:12px;font-size:84px">POWER</h1>
      <div class="sub">(Σa)² is not Σa²</div>
      <div class="k hot">the cross term is the pool</div>
      <div class="pair">$POWER · LONG × ANTHROPICx1L · sqpower.xyz</div>
    </div></div>`,
  },
  "x-cover": {
    w: 1600,
    h: 900,
    html: `<style>${CSS}
      .p{width:1600px;height:900px;background:#f3efe6;display:flex;flex-direction:column;justify-content:space-between;padding:72px 80px}
      h1{font-size:92px;max-width:16ch}
      .row{display:flex;justify-content:space-between;align-items:flex-end}
      .eq{font-size:28px}
    </style>
    <div class="p">
      <div class="kicker">an article · ANTHROPIC²</div>
      <h1 class="display">The square of the sum is not the sum of the squares.</h1>
      <div class="row">
        <div class="eq">(Σa)² = Σa² <span class="hot">+ 2Σab</span></div>
        <div class="kicker">$POWER</div>
      </div>
    </div>`,
  },
  "x-post-1": {
    w: 1600,
    h: 900,
    html: `<style>${CSS}
      .p{width:1600px;height:900px;background:#f3efe6;display:flex;align-items:center;gap:72px;padding:64px 80px}
      .sq{width:520px;height:520px;flex-shrink:0}
      h2{font-size:64px;max-width:12ch}
      p{font-size:22px;line-height:1.45;max-width:28ch;margin-top:18px}
    </style>
    <div class="p"><div class="sq">${square(520)}</div><div>
      <div class="kicker">the identity</div>
      <h2 class="display">(Σa)² ≠ Σa²</h2>
      <p>Add the squares and you miss the pool. The red gnomon is the seat you just took.</p>
    </div></div>`,
  },
  "x-post-2": {
    w: 1080,
    h: 1080,
    html: `<style>${CSS}
      .p{width:1080px;height:1080px;background:#f3efe6;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;padding:64px}
      .nums{display:flex;gap:48px;text-align:center}
      .n{font-size:92px}
      .l{font-size:16px;color:#6b6560;letter-spacing:0.14em}
    </style>
    <div class="p">
      <div class="kicker">nobody owns this alone</div>
      <div class="nums">
        <div><div class="display n">36</div><div class="l">(Σa)²</div></div>
        <div><div class="display n">10</div><div class="l">Σa²</div></div>
        <div><div class="display n hot">26</div><div class="l">2Σab</div></div>
      </div>
      ${square(420)}
      <div style="font-size:18px;color:#6b6560">side 6 · the red band is you</div>
    </div>`,
  },
  "x-post-3": {
    w: 1080,
    h: 1080,
    html: `<style>${CSS}
      .p{width:1080px;height:1080px;background:#1a1a1a;color:#f3efe6;display:flex;flex-direction:column;justify-content:space-between;padding:72px}
      h2{font-size:84px;color:#f3efe6}
      li{font-size:28px;line-height:1.6}
      ul{list-style:none;padding:0;margin:0}
      .hot{color:#e07060}
    </style>
    <div class="p">
      <div class="kicker" style="color:#b7b0a4">how a seat works</div>
      <h2 class="display">Side caps at 12.</h2>
      <ul>
        <li><span class="hot">ping</span> adds 1</li>
        <li><span class="hot">spark</span> adds 3 · 0.0001 ETH glow</li>
        <li>the 13th step evicts the lightest other seat</li>
      </ul>
      <div style="font-size:18px;letter-spacing:0.12em;color:#b7b0a4">$POWER · ANTHROPIC² · NOT ANTHROPIC</div>
    </div>`,
  },
};

const browser = await chromium.launch({ args: ["--no-sandbox"] });
await mkdir(OUT, { recursive: true });
for (const [name, spec] of Object.entries(pages)) {
  const page = await browser.newPage({ viewport: { width: spec.w, height: spec.h }, deviceScaleFactor: 2 });
  await page.setContent(spec.html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const file = join(OUT, `${name}.png`);
  await mkdir(dirname(file), { recursive: true });
  await page.screenshot({ path: file, type: "png" });
  if (name === "x-cover") {
    await page.screenshot({ path: "/workspace/public/og.jpg", type: "jpeg", quality: 88 });
  }
  if (name === "x-banner") {
    await page.setViewportSize({ width: 1200, height: 264 });
    await page.setContent(
      `<style>${CSS}.b{width:1200px;height:264px;display:flex;align-items:center;background:#f3efe6}.t{padding:0 36px}h1{font-size:52px}.sub{margin-top:8px;font-size:16px}</style>
      <div class="b">${mark(264)}<div class="t"><div class="kicker">ANTHROPIC²</div><h1 class="word" style="margin-top:8px">POWER</h1><div class="sub hot">sqpower.xyz</div></div></div>`,
      { waitUntil: "networkidle" },
    );
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: "/workspace/public/x-banner.jpg", type: "jpeg", quality: 88 });
  }
  await page.close();
  console.log("wrote", file);
}
await browser.close();
