const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve('dist/steam-demo');
const OUT_ROOT = path.resolve(
  'promo/steam/playtest-random-screenshots',
  new Date().toISOString().replace(/[:.]/g, '-')
);
const LOCALES = ['zh-tw', 'zh-cn', 'en', 'ja'];
const GAMES_PER_LOCALE = 100;
const TOTAL_SHOTS = 100;
const VIEWPORT = { width: 540, height: 960 };

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav'
};

function startServer() {
  const server = http.createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split('?')[0]);
    if (urlPath === '/') urlPath = '/index.html';

    const filePath = path.join(ROOT, urlPath);
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }

      res.writeHead(200, {
        'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream'
      });
      res.end(data);
    });
  });

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

function randomDiceString() {
  return '12345678'.split('').sort(() => Math.random() - 0.5).join('');
}

function makeShotSlots(totalGames) {
  const slots = new Set();
  while (slots.size < Math.min(TOTAL_SHOTS, totalGames)) {
    slots.add(Math.floor(Math.random() * totalGames));
  }
  return slots;
}

async function safe(errors, label, fn) {
  try {
    return await fn();
  } catch (error) {
    errors.push({
      label,
      message: String(error && error.message ? error.message : error).slice(0, 300)
    });
    return undefined;
  }
}

async function maybeCapture(page, shots, shotSlots, gameIndex, locale, game, phase) {
  if (!shotSlots.has(gameIndex)) return;
  if (shots.some((shot) => shot.gameIndex === gameIndex)) return;

  await page.waitForTimeout(120);
  const file = path.join(
    OUT_ROOT,
    `${String(shots.length + 1).padStart(3, '0')}_${locale}_game${String(game).padStart(3, '0')}_${phase}.png`
  );

  await page.screenshot({ path: file, fullPage: false });
  const meta = await page.evaluate(() => ({
    locale: window.i18n?.getLocale?.(),
    titleHidden: document.querySelector('#title-screen')?.classList.contains('hidden'),
    shopVisible: !document.querySelector('#shop-overlay')?.classList.contains('hidden'),
    endVisible: !document.querySelector('#end-overlay')?.classList.contains('hidden'),
    tutorialVisible: !document.querySelector('#tutorial-overlay')?.classList.contains('hidden'),
    enemy: document.querySelector('#enemy-name')?.textContent,
    stage: document.querySelector('#stage-info')?.textContent
  })).catch(() => ({}));

  shots.push({ gameIndex, locale, game, phase, file, meta });
}

async function runGame(page, errors, shots, shotSlots, gameIndex, locale, game) {
  const phasePlan = ['start', 'dice', 'after-roll', 'shop', 'modal', 'end'];
  const chosenPhase = phasePlan[Math.floor(Math.random() * phasePlan.length)];

  await safe(errors, 'new-game', () => page.evaluate(() => {
    document.querySelector('#rules-modal')?.classList.add('hidden');
    document.querySelector('#how-to-play-modal')?.classList.add('hidden');
    document.querySelector('#collection-modal')?.classList.add('hidden');
    document.querySelector('#history-modal')?.classList.add('hidden');
    document.querySelector('#settings-modal')?.classList.add('hidden');
    document.querySelector('#souls-modal')?.classList.add('hidden');
    document.querySelector('#tutorial-overlay')?.classList.add('hidden');
    document.querySelector('#shop-overlay')?.classList.add('hidden');
    document.querySelector('#end-overlay')?.classList.add('hidden');
    const newGameButton = document.querySelector('#btn-new-game');
    if (typeof newGameButton?.onclick === 'function') newGameButton.onclick();
    else newGameButton?.click();
  }));
  await page.waitForTimeout(25);

  if (chosenPhase === 'start') {
    await maybeCapture(page, shots, shotSlots, gameIndex, locale, game, 'start');
  }

  await safe(errors, 'devSetDice', () => page.evaluate((dice) => window.devSetDice?.(dice), randomDiceString()));
  await page.waitForTimeout(25);

  if (chosenPhase === 'dice') {
    await maybeCapture(page, shots, shotSlots, gameIndex, locale, game, 'dice');
  }

  if (Math.random() < 0.65) {
    await safe(errors, 'reroll', () => page.evaluate(() => window.executeRoll?.(false)));
    await page.waitForTimeout(80);
    if (chosenPhase === 'after-roll') {
      await maybeCapture(page, shots, shotSlots, gameIndex, locale, game, 'after-roll');
    }
  }

  if (Math.random() < 0.2) {
    await safe(errors, 'rules', () => page.evaluate(() => document.querySelector('#btn-rules')?.onclick?.()));
    await page.waitForTimeout(40);
    if (chosenPhase === 'modal') {
      await maybeCapture(page, shots, shotSlots, gameIndex, locale, game, 'rules');
    }
    await safe(errors, 'close-rules', () => page.evaluate(() => document.querySelector('#btn-close-rules')?.onclick?.()));
  }

  if (Math.random() < 0.2) {
    await safe(errors, 'how-to-play', () => page.evaluate(() => document.querySelector('#btn-how-to-play')?.onclick?.()));
    await page.waitForTimeout(40);
    if (chosenPhase === 'modal') {
      await maybeCapture(page, shots, shotSlots, gameIndex, locale, game, 'howto');
    }
    await safe(errors, 'close-how-to-play', () => page.evaluate(() => document.querySelector('#btn-close-how-to-play')?.onclick?.()));
  }

  await safe(errors, 'devKillEnemy', () => page.evaluate(() => window.devKillEnemy?.()));
  await page.waitForTimeout(70);

  if (chosenPhase === 'shop') {
    await maybeCapture(page, shots, shotSlots, gameIndex, locale, game, 'shop');
  }

  if (Math.random() < 0.35) {
    await safe(errors, 'shop-select', () => page.evaluate(() => document.querySelector('#shop-items button')?.click()));
    await page.waitForTimeout(40);
  }

  if (chosenPhase === 'end') {
    await safe(errors, 'fast-clear', () => page.evaluate(() => {
      for (let i = 0; i < 12; i += 1) window.devKillEnemy?.();
    }));
    await page.waitForTimeout(80);
    await maybeCapture(page, shots, shotSlots, gameIndex, locale, game, 'end-or-late');
  }

  await maybeCapture(page, shots, shotSlots, gameIndex, locale, game, 'fallback');
}

async function main() {
  fs.mkdirSync(OUT_ROOT, { recursive: true });

  const totalGames = LOCALES.length * GAMES_PER_LOCALE;
  const shotSlots = makeShotSlots(totalGames);
  const shots = [];
  const errors = [];
  let gameIndex = 0;

  const server = await startServer();
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/?steam=portrait`;
  const browser = await chromium.launch({ headless: true });

  for (const locale of LOCALES) {
    const context = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: 1
    });
    await context.addInitScript((selectedLocale) => {
      localStorage.clear();
      localStorage.setItem('bibbidiba_lang', selectedLocale);
      localStorage.setItem('bibbidiba_tutorial_done', 'true');
    }, locale);

    const page = await context.newPage();
    page.on('dialog', (dialog) => dialog.accept());
    page.on('pageerror', (error) => errors.push({ locale, label: 'pageerror', message: error.message }));
    page.on('console', (message) => {
      if (message.type() === 'error') {
        errors.push({ locale, label: 'console', message: message.text().slice(0, 300) });
      }
    });

    await page.goto(baseUrl, { waitUntil: 'networkidle' });

    for (let game = 1; game <= GAMES_PER_LOCALE; game += 1) {
      await runGame(page, errors, shots, shotSlots, gameIndex, locale, game);
      gameIndex += 1;
    }

    await context.close();
  }

  await browser.close();
  server.close();

  const report = {
    outRoot: OUT_ROOT,
    requested: {
      locales: LOCALES,
      gamesPerLocale: GAMES_PER_LOCALE,
      totalGames,
      totalShots: TOTAL_SHOTS
    },
    created: shots.length,
    shots,
    errors: errors.slice(0, 120)
  };
  const reportPath = path.join(OUT_ROOT, 'report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

  console.log(JSON.stringify({
    outRoot: OUT_ROOT,
    report: reportPath,
    created: shots.length,
    totalGames,
    errorCount: errors.length
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
