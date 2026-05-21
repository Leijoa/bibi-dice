const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.join(ROOT, 'promo', 'steam', 'assets');

const SOURCES = {
  banner: path.join(ROOT, 'promo', 'steam', 'source', 'key_art_d8_banner.png'),
  home: path.join(ROOT, 'promo', 'steam', 'source', 'key_art_d8_portrait.png'),
  logoHome: path.join(ROOT, 'img', 'home_bg.webp'),
  favicon: path.join(ROOT, 'favicon.png')
};

const LIBRARY_ASSETS = [
  {
    file: 'library_capsule_600x900.png',
    width: 600,
    height: 900,
    source: 'home',
    kind: 'artOnly',
    bgPosition: 'center top',
    overlay: 'linear-gradient(180deg, rgba(3,2,8,.12), rgba(7,3,14,0) 42%, rgba(3,2,8,.24))'
  },
  {
    file: 'library_header_capsule_920x430.png',
    width: 920,
    height: 430,
    source: 'banner',
    kind: 'artOnly',
    bgPosition: 'center 48%',
    overlay: 'linear-gradient(90deg, rgba(3,2,8,.16), rgba(12,5,25,.03), rgba(3,2,8,.18))'
  }
];

function toDataUrl(file) {
  const ext = path.extname(file).toLowerCase();
  const mime = ext === '.webp' ? 'image/webp' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
  return `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;
}

function escapeCssUrl(url) {
  return url.replace(/"/g, '\\"');
}

function logoCss(size) {
  return `
    color: #f3e8ff;
    font-family: Georgia, "Times New Roman", "Microsoft JhengHei", serif;
    font-size: ${size}px;
    line-height: .95;
    font-weight: 900;
    letter-spacing: .02em;
    white-space: nowrap;
    text-shadow:
      0 3px 0 #2e0a56,
      0 0 12px rgba(216, 180, 254, .95),
      0 0 34px rgba(147, 51, 234, .92),
      0 0 68px rgba(76, 29, 149, .9);
    -webkit-text-stroke: ${Math.max(1, Math.round(size / 26))}px rgba(62, 14, 112, .92);
  `;
}

function buildLibraryHtml(asset, imageUrl) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    html, body {
      width: ${asset.width}px;
      height: ${asset.height}px;
      margin: 0;
      overflow: hidden;
      background: #05030a;
    }
    .asset {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background:
        ${asset.overlay},
        url("${escapeCssUrl(imageUrl)}") ${asset.bgPosition} / cover no-repeat;
    }
    .asset::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 50% 35%, rgba(190, 120, 255, .2), transparent 30%),
        radial-gradient(circle at 28% 28%, rgba(255, 197, 85, .13), transparent 28%),
        linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.08));
      pointer-events: none;
    }
    .title {
      position: absolute;
      left: 50%;
      top: ${asset.titleTop || 0}px;
      transform: translateX(-50%);
      width: 92%;
      text-align: center;
      ${logoCss(asset.titleSize || 72)}
      z-index: 2;
    }
    .hero-vignette {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse at center, transparent 0%, transparent 52%, rgba(0,0,0,.18) 100%),
        linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.1));
      pointer-events: none;
    }
  </style>
</head>
<body>
  <div class="asset">
    <div class="hero-vignette"></div>
  </div>
</body>
</html>`;
}

function buildLogoHtml() {
  return `<!doctype html>
<html><body></body></html>`;
}

function buildIconHtml(iconUrl, size, format) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    html, body {
      width: ${size}px;
      height: ${size}px;
      margin: 0;
      overflow: hidden;
      background: ${format === 'jpg' ? '#07020d' : 'transparent'};
    }
    .icon {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .icon::before {
      content: "";
      position: absolute;
      inset: 0;
      background: url("${escapeCssUrl(iconUrl)}") center / contain no-repeat;
    }
  </style>
</head>
<body>
  <div class="icon"></div>
</body>
</html>`;
}

async function screenshotHtml(browser, html, output, viewport, options = {}) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.screenshot({ path: output, ...options });
  await page.close();
  console.log(output);
}

async function extractLibraryLogo(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  const result = await page.evaluate(async ({ sourceUrl }) => {
    const image = new Image();
    image.src = sourceUrl;
    await image.decode();

    const crop = {
      x: Math.round(image.width * 0.075),
      y: Math.round(image.height * 0.025),
      width: Math.round(image.width * 0.85),
      height: Math.round(image.height * 0.18)
    };

    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawWidth = 1060;
    const drawHeight = Math.round(drawWidth * crop.height / crop.width);
    const dx = Math.round((canvas.width - drawWidth) / 2);
    const dy = Math.round((canvas.height - drawHeight) / 2);

    ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, dx, dy, drawWidth, drawHeight);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = data.data;
    for (let i = 0; i < pixels.length; i += 4) {
      const pixelIndex = i / 4;
      const py = Math.floor(pixelIndex / canvas.width);
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let alpha = Math.max(0, Math.min(255, (max - 42) * 6.2 + (max - min) * 0.9));
      if (max < 66) alpha = 0;
      if (py > dy + drawHeight * 0.75 && max < 115) alpha = 0;
      if (py > dy + drawHeight * 0.88 && max < 170) alpha = 0;
      pixels[i + 3] = Math.round(alpha);
      if (alpha < 28) {
        pixels[i] = 0;
        pixels[i + 1] = 0;
        pixels[i + 2] = 0;
        pixels[i + 3] = 0;
      }
    }
    ctx.putImageData(data, 0, 0);

    return canvas.toDataURL('image/png');
  }, { sourceUrl: toDataUrl(SOURCES.logoHome) });

  const base64 = result.replace(/^data:image\/png;base64,/, '');
  const output = path.join(ASSETS, 'library_logo_1280x720.png');
  fs.writeFileSync(output, Buffer.from(base64, 'base64'));
  await page.close();
  console.log(output);
}

async function main() {
  fs.mkdirSync(ASSETS, { recursive: true });
  for (const [name, file] of Object.entries(SOURCES)) {
    if (!fs.existsSync(file)) throw new Error(`Missing source image for ${name}: ${file}`);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    for (const asset of LIBRARY_ASSETS) {
      await screenshotHtml(
        browser,
        buildLibraryHtml(asset, toDataUrl(SOURCES[asset.source])),
        path.join(ASSETS, asset.file),
        { width: asset.width, height: asset.height }
      );
    }

    await extractLibraryLogo(browser);

    const iconUrl = toDataUrl(SOURCES.favicon);
    await screenshotHtml(
      browser,
      buildIconHtml(iconUrl, 256, 'png'),
      path.join(ASSETS, 'shortcut_icon_256x256.png'),
      { width: 256, height: 256 },
      { omitBackground: true }
    );
    await screenshotHtml(
      browser,
      buildIconHtml(iconUrl, 184, 'jpg'),
      path.join(ASSETS, 'app_icon_184x184.jpg'),
      { width: 184, height: 184 },
      { type: 'jpeg', quality: 92 }
    );
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
