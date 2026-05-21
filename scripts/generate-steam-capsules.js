const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.join(ROOT, 'promo', 'steam', 'assets');

const SOURCES = {
  banner: path.join(ROOT, 'promo', 'steam', 'source', 'key_art_d8_banner.png'),
  home: path.join(ROOT, 'promo', 'steam', 'source', 'key_art_d8_portrait.png')
};

const CAPSULES = [
  {
    file: 'store_header_capsule_920x430.png',
    width: 920,
    height: 430,
    source: 'banner',
    bgPosition: 'center 48%',
    overlay: 'linear-gradient(90deg, rgba(3,2,8,.16), rgba(12,5,25,.03), rgba(3,2,8,.18))'
  },
  {
    file: 'store_small_capsule_462x174.png',
    width: 462,
    height: 174,
    source: 'banner',
    bgPosition: 'center 45%',
    overlay: 'linear-gradient(90deg, rgba(3,2,8,.2), rgba(21,8,42,.06), rgba(3,2,8,.22))'
  },
  {
    file: 'store_main_capsule_1232x706.png',
    width: 1232,
    height: 706,
    source: 'banner',
    bgPosition: 'center 50%',
    overlay: 'linear-gradient(90deg, rgba(3,2,8,.16), rgba(18,6,36,.03), rgba(3,2,8,.18))'
  },
  {
    file: 'store_vertical_capsule_748x896.png',
    width: 748,
    height: 896,
    source: 'home',
    bgPosition: 'center top',
    overlay: 'linear-gradient(180deg, rgba(3,2,8,.12), rgba(8,5,16,0) 45%, rgba(3,2,8,.22))'
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
