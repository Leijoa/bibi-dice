const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.join(ROOT, 'promo', 'steam', 'assets');

const SOURCES = {
  banner: path.join(ROOT, 'img', 'itch_banner.png'),
  home: path.join(ROOT, 'img', 'home_bg.webp')
};

const CAPSULES = [
  {
    file: 'store_header_capsule_920x430.png',
    width: 920,
    height: 430,
    source: 'banner',
    bgPosition: 'center 48%',
    titleSize: 76,
    subtitleSize: 26,
    titleTop: 96,
    subtitleTop: 186,
    overlay: 'linear-gradient(90deg, rgba(3,2,8,.82), rgba(12,5,25,.42), rgba(3,2,8,.84))'
  },
  {
    file: 'store_small_capsule_462x174.png',
    width: 462,
    height: 174,
    source: 'banner',
    bgPosition: 'center 45%',
    titleSize: 42,
    subtitleSize: 16,
    titleTop: 50,
    subtitleTop: 100,
    overlay: 'linear-gradient(90deg, rgba(3,2,8,.9), rgba(21,8,42,.52), rgba(3,2,8,.9))'
  },
  {
    file: 'store_main_capsule_1232x706.png',
    width: 1232,
    height: 706,
    source: 'banner',
    bgPosition: 'center 50%',
    titleSize: 96,
    subtitleSize: 32,
    titleTop: 148,
    subtitleTop: 260,
    overlay: 'linear-gradient(90deg, rgba(3,2,8,.86), rgba(18,6,36,.36), rgba(3,2,8,.84))'
  },
  {
    file: 'store_vertical_capsule_748x896.png',
    width: 748,
    height: 896,
    source: 'home',
    bgPosition: 'center top',
    titleSize: 86,
    subtitleSize: 28,
    titleTop: 82,
    subtitleTop: 184,
    overlay: 'linear-gradient(180deg, rgba(3,2,8,.58), rgba(8,5,16,.18) 45%, rgba(3,2,8,.72))'
  }
];

function toDataUrl(file) {
  const ext = path.extname(file).toLowerCase();
  const mime = ext === '.webp' ? 'image/webp' : 'image/png';
  return `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;
}

function escapeCssUrl(url) {
  return url.replace(/"/g, '\\"');
}

function buildHtml(capsule, imageUrl) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    html, body {
      width: ${capsule.width}px;
      height: ${capsule.height}px;
      margin: 0;
      overflow: hidden;
      background: #05030a;
      font-family: Georgia, "Times New Roman", "Microsoft JhengHei", serif;
    }
    .capsule {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background:
        ${capsule.overlay},
        url("${escapeCssUrl(imageUrl)}") ${capsule.bgPosition} / cover no-repeat;
    }
    .capsule::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 50% 42%, rgba(190, 120, 255, .18), transparent 34%),
        radial-gradient(circle at 28% 24%, rgba(255, 197, 85, .14), transparent 28%);
      pointer-events: none;
    }
    .title {
      position: absolute;
      left: 50%;
      top: ${capsule.titleTop}px;
      transform: translateX(-50%);
      width: 92%;
      text-align: center;
      color: #f3e8ff;
      font-size: ${capsule.titleSize}px;
      line-height: 0.95;
      font-weight: 900;
      letter-spacing: .02em;
      text-shadow:
        0 3px 0 #2e0a56,
        0 0 12px rgba(216, 180, 254, .95),
        0 0 34px rgba(147, 51, 234, .92),
        0 0 68px rgba(76, 29, 149, .9);
      -webkit-text-stroke: ${Math.max(1, Math.round(capsule.titleSize / 26))}px rgba(62, 14, 112, .92);
      z-index: 2;
    }
    .subtitle {
      position: absolute;
      left: 50%;
      top: ${capsule.subtitleTop}px;
      transform: translateX(-50%);
      min-width: 38%;
      padding: .18em .86em .24em;
      border: 1px solid rgba(216, 180, 254, .72);
      border-radius: 999px;
      background: rgba(18, 7, 36, .72);
      text-align: center;
      color: #d8b4fe;
      font-family: "Segoe UI", "Microsoft JhengHei", sans-serif;
      font-size: ${capsule.subtitleSize}px;
      font-weight: 700;
      letter-spacing: .26em;
      text-transform: lowercase;
      box-shadow: 0 0 18px rgba(147, 51, 234, .42);
      z-index: 2;
    }
    .shine {
      position: absolute;
      inset: 0;
      background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,.14) 46%, transparent 58%);
      transform: translateX(-34%);
      opacity: .42;
      z-index: 3;
      pointer-events: none;
    }
  </style>
</head>
<body>
  <div class="capsule">
    <div class="title">BIBI DICE</div>
    <div class="subtitle">bibi-dice</div>
    <div class="shine"></div>
  </div>
</body>
</html>`;
}

async function main() {
  fs.mkdirSync(ASSETS, { recursive: true });
  for (const [name, file] of Object.entries(SOURCES)) {
    if (!fs.existsSync(file)) throw new Error(`Missing source image for ${name}: ${file}`);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    for (const capsule of CAPSULES) {
      const page = await browser.newPage({
        viewport: { width: capsule.width, height: capsule.height },
        deviceScaleFactor: 1
      });
      const imageUrl = toDataUrl(SOURCES[capsule.source]);
      await page.setContent(buildHtml(capsule, imageUrl), { waitUntil: 'load' });
      await page.screenshot({ path: path.join(ASSETS, capsule.file) });
      await page.close();
      console.log(path.join(ASSETS, capsule.file));
    }
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
