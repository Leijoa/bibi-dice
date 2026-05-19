const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist', 'steam-demo');
const ASSETS = path.join(ROOT, 'promo', 'steam', 'assets');
const TMP = path.join(ROOT, 'promo', 'steam', 'review', 'capture-temp');
const PORT = 4193;
const LEGACY_SCREENSHOTS = [
  'store_screenshot_04_relic_shop_1920x1080.png',
  'store_screenshot_05_boss_shackle_1920x1080.png'
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

function ensureDirs() {
  fs.mkdirSync(ASSETS, { recursive: true });
  fs.mkdirSync(TMP, { recursive: true });
  for (const file of LEGACY_SCREENSHOTS) {
    fs.rmSync(path.join(ASSETS, file), { force: true });
  }
}

function startServer(root, port) {
  const server = http.createServer((req, res) => {
    let pathname = decodeURIComponent(new URL(req.url, `http://127.0.0.1:${port}`).pathname);
    if (pathname === '/') pathname = '/index.html';
    const filePath = path.normalize(path.join(root, pathname));
    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    fs.readFile(filePath, (err, body) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
      res.end(body);
    });
  });
  return new Promise(resolve => server.listen(port, '127.0.0.1', () => resolve(server)));
}

async function waitTitleReady(page) {
  await page.waitForSelector('#btn-new-game');
  await page.waitForTimeout(3500);
}

async function capturePortrait(page, name) {
  const out = path.join(TMP, `${name}.png`);
  await page.screenshot({ path: out });
  return out;
}

async function renderStoreScreenshot(browser, portraitPath, outputName) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const portraitUrl = `data:image/png;base64,${fs.readFileSync(portraitPath).toString('base64')}`;
  const bgPath = path.join(DIST, 'img', 'home_bg.webp');
  const bgUrl = fs.existsSync(bgPath)
    ? `data:image/webp;base64,${fs.readFileSync(bgPath).toString('base64')}`
    : portraitUrl;
  await page.setContent(`<!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          html, body {
            width: 1920px;
            height: 1080px;
            margin: 0;
            overflow: hidden;
            background: #08070d;
          }
          body::before {
            content: "";
            position: fixed;
            inset: -36px;
            background:
              linear-gradient(90deg, rgba(4, 3, 8, 0.9), rgba(11, 6, 18, 0.48), rgba(4, 3, 8, 0.9)),
              url("${bgUrl}") center / cover no-repeat;
            filter: blur(18px) brightness(0.46) saturate(1.16);
            transform: scale(1.05);
          }
          body::after {
            content: "";
            position: fixed;
            inset: 0;
            background:
              radial-gradient(circle at 50% 50%, rgba(167, 139, 250, 0.16), transparent 34%),
              linear-gradient(180deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5));
          }
          .window {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 540px;
            height: 960px;
            transform: translate(-50%, -50%);
            border: 1px solid rgba(216, 180, 254, 0.36);
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 34px 120px rgba(0, 0, 0, 0.7), 0 0 46px rgba(124, 58, 237, 0.34);
            z-index: 2;
            background: #131315;
          }
          .window img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        </style>
      </head>
      <body>
        <div class="window"><img src="${portraitUrl}" alt=""></div>
      </body>
    </html>`);
  await page.waitForFunction(() => Array.from(document.images).every(img => img.complete && img.naturalWidth > 0));
  await page.screenshot({ path: path.join(ASSETS, outputName) });
  await page.close();
}

async function newGamePage(browser) {
  const context = await browser.newContext({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 1 });
  await context.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  const page = await context.newPage();
  const issues = [];
  page.on('console', msg => {
    if (['error', 'warning'].includes(msg.type())) issues.push(`${msg.type()}: ${msg.text()}`);
  });
  page.on('pageerror', err => issues.push(`pageerror: ${err.message}`));
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' });
  return { context, page, issues };
}

async function run() {
  ensureDirs();
  if (!fs.existsSync(path.join(DIST, 'index.html'))) {
    throw new Error(`Missing Steam Demo build: ${path.join(DIST, 'index.html')}`);
  }

  const server = await startServer(DIST, PORT);
  const browser = await chromium.launch({ headless: true });
  const allIssues = [];

  try {
    const game = await newGamePage(browser);
    const { page, context, issues } = game;

    await waitTitleReady(page);
    await renderStoreScreenshot(browser, await capturePortrait(page, '01_title'), 'store_screenshot_01_title_1920x1080.png');

    await page.click('#btn-new-game');
    await page.waitForFunction(() => document.querySelector('#title-screen')?.classList.contains('hidden'), null, { timeout: 10000 });
    await page.waitForTimeout(800);
    await renderStoreScreenshot(browser, await capturePortrait(page, '02_battle_start'), 'store_screenshot_02_battle_start_1920x1080.png');

    await page.evaluate(() => window.devSetDice && window.devSetDice('11111111'));
    await page.waitForTimeout(600);
    await renderStoreScreenshot(browser, await capturePortrait(page, '03_combo_preview'), 'store_screenshot_03_combo_preview_1920x1080.png');

    await page.click('#btn-rules');
    await page.waitForFunction(() => !document.querySelector('#rules-modal')?.classList.contains('hidden'), null, { timeout: 10000 });
    await page.waitForTimeout(300);
    await renderStoreScreenshot(browser, await capturePortrait(page, '04_rules_table'), 'store_screenshot_04_rules_table_1920x1080.png');
    await page.click('#btn-close-rules');

    await page.evaluate(() => window.devKillEnemy && window.devKillEnemy());
    await page.waitForFunction(() => !document.querySelector('#shop-overlay')?.classList.contains('hidden'), null, { timeout: 5000 }).catch(async () => {
      await page.waitForTimeout(3000);
    });
    await page.waitForTimeout(600);
    await renderStoreScreenshot(browser, await capturePortrait(page, '05_relic_shop'), 'store_screenshot_05_relic_shop_1920x1080.png');

    allIssues.push(...issues);
    await context.close();

    const soulsGame = await newGamePage(browser);
    await waitTitleReady(soulsGame.page);
    await soulsGame.page.click('#btn-souls');
    await soulsGame.page.waitForFunction(() => !document.querySelector('#souls-modal')?.classList.contains('hidden'), null, { timeout: 10000 });
    await soulsGame.page.waitForTimeout(500);
    await renderStoreScreenshot(browser, await capturePortrait(soulsGame.page, '06_soul_offering'), 'store_screenshot_06_soul_offering_1920x1080.png');
    allIssues.push(...soulsGame.issues);
    await soulsGame.context.close();
  } finally {
    await browser.close();
    server.close();
  }

  const relevantIssues = allIssues.filter(line => !line.includes('favicon'));
  if (relevantIssues.length > 0) {
    console.warn('Capture finished with warnings:');
    relevantIssues.forEach(line => console.warn(line));
  }

  console.log('Steam portrait screenshots captured:');
  [
    'store_screenshot_01_title_1920x1080.png',
    'store_screenshot_02_battle_start_1920x1080.png',
    'store_screenshot_03_combo_preview_1920x1080.png',
    'store_screenshot_04_rules_table_1920x1080.png',
    'store_screenshot_05_relic_shop_1920x1080.png',
    'store_screenshot_06_soul_offering_1920x1080.png'
  ].forEach(file => console.log(path.join(ASSETS, file)));
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
