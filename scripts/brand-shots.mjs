import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

const OUT = "/workspace/public/brand";

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
      <div class="pair">$SQPOWER · LONG × GME · sqpower.xyz</div>
    </div></div>`,
  },
  "x-cover": {
    w: 1600,
    h: 900,
    html: `<style>${CSS}
      .p{width:1600px;height:900px;display:flex;align-items:center;background:#f3efe6}
      .t{padding:0 64px}
      h1{font-size:64px;max-width:14ch}
      .eq{margin-top:28px;font-size:22px}
    </style>
    <div class="p">${mark(900)}<div class="t">
      <div class="kicker">an article · ANTHROPIC²</div>
      <h1 class="display" style="margin-top:16px">The square of the sum is not the sum of the squares.</h1>
      <div class="eq">(Σa)² = Σa² <span class="hot">+ 2Σab</span></div>
      <div class="kicker" style="margin-top:28px">sqpower.xyz</div>
    </div></div>`,
  },
  "x-post-1": {
    w: 1600,
    h: 900,
    html: `<style>${CSS}
      .p{width:1600px;height:900px;display:flex;align-items:center;background:#f3efe6}
      .t{padding:0 72px}
      h2{font-size:88px}
      p{font-size:22px;line-height:1.45;max-width:28ch;margin-top:22px}
    </style>
    <div class="p">${mark(900)}<div class="t">
      <div class="kicker">the identity</div>
      <h2 class="display" style="margin-top:14px">(Σa)² ≠ Σa²</h2>
      <p>Add the squares and you miss the pool.</p>
      <div class="kicker" style="margin-top:28px">$SQPOWER · sqpower.xyz</div>
    </div></div>`,
  },
  "x-post-2": {
    w: 1080,
    h: 1080,
    html: `<style>${CSS}
      .p{width:1080px;height:1080px;display:flex;align-items:center;background:#f3efe6}
      .nums{display:flex;flex-direction:column;gap:28px;padding:0 56px}
      .row{display:flex;align-items:baseline;gap:18px}
      .n{font-size:84px}
      .l{font-size:16px;color:#6b6560;letter-spacing:0.12em}
    </style>
    <div class="p">${mark(560)}
      <div class="nums">
        <div class="kicker">nobody owns this alone</div>
        <div class="row"><div class="display n">36</div><div class="l">(Σa)²</div></div>
        <div class="row"><div class="display n">10</div><div class="l">Σa²</div></div>
        <div class="row"><div class="display n hot">26</div><div class="l">2Σab</div></div>
      </div>
    </div>`,
  },
  "x-post-3": {
    w: 1080,
    h: 1080,
    html: `<style>${CSS}
      .p{width:1080px;height:1080px;display:flex;align-items:center;background:#f3efe6}
      .t{padding:56px 48px;display:flex;flex-direction:column;justify-content:space-between}
      h2{font-size:64px}
      li{font-size:26px;line-height:1.55}
      ul{list-style:none;padding:0;margin:28px 0 0}
    </style>
    <div class="p">${mark(420)}<div class="t">
      <div>
        <div class="kicker">how a seat works</div>
        <h2 class="display" style="margin-top:16px">Side caps at 12.</h2>
        <ul>
          <li><span class="hot">ping</span> adds 1</li>
          <li><span class="hot">spark</span> adds 3</li>
          <li>the next step evicts the lightest other seat</li>
        </ul>
      </div>
      <div class="kicker">$SQPOWER · sqpower.xyz</div>
    </div></div>`,
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
