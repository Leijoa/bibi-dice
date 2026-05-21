const { _electron: electron } = require('playwright');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist', 'steam-demo');
const MAIN = path.join(ROOT, 'steam-app', 'main.js');
const STORAGE_KEY = 'bibi_steam_verify_sentinel';
const EXPECTED_SIZES = {
  small: { label: 'Small 450 x 800', width: 450, height: 800, largeClass: false },
  medium: { label: 'Medium 540 x 960', width: 540, height: 960, largeClass: false },
  large: { label: 'Large 675 x 1200', width: 675, height: 1200, largeClass: true }
};

async function readWindowState(page) {
  return page.evaluate(() => ({
    href: window.location.href,
    width: window.innerWidth,
    height: window.innerHeight,
    bodyClass: document.body.className,
    hasGameContainer: Boolean(document.querySelector('#game-container')),
    hasScaler: Boolean(document.querySelector('#game-scaler'))
  }));
}

async function applySizeProfile(app, page, size) {
  const browserWindow = await app.browserWindow(page);
  await browserWindow.evaluate((win, nextSize) => {
    win.setMinimumSize(450, 800);
    win.setAspectRatio(9 / 16);
    win.setContentSize(nextSize.width, nextSize.height);
    win.center();
    win.webContents.send('steam-portrait-size', {
      key: nextSize.key,
      className: nextSize.largeClass ? 'steam-portrait-large' : ''
    });
  }, size);
}

async function verifySize(page, key, size) {
  await page.waitForFunction(
    expected => window.innerWidth === expected.width && window.innerHeight === expected.height,
    size,
    { timeout: 3000 }
  );

  const state = await readWindowState(page);
  const hasLargeClass = state.bodyClass.includes('steam-portrait-large');
  return {
    key,
    viewport: `${state.width}x${state.height}`,
    bodyClass: state.bodyClass,
    ok: state.width === size.width && state.height === size.height && hasLargeClass === size.largeClass
  };
}

async function main() {
  if (!fs.existsSync(DIST)) throw new Error(`Missing dist folder: ${DIST}`);
  for (const dir of ['bgm', 'css', 'img', 'js', 'sfx']) {
    const fullPath = path.join(DIST, dir);
    if (!fs.existsSync(fullPath)) throw new Error(`Missing dist asset folder: ${fullPath}`);
  }

  const app = await electron.launch({ args: [MAIN] });
  let storageValue = `steam-verify-${Date.now()}`;
  try {
    const page = await app.firstWindow();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(800);

    const userData = await app.evaluate(({ app }) => app.getPath('userData'));
    const appName = await app.evaluate(({ app }) => app.getName());
    const bounds = await readWindowState(page);
    const sizeChecks = [];
    sizeChecks.push(await verifySize(page, 'medium', EXPECTED_SIZES.medium));
    await applySizeProfile(app, page, { key: 'small', ...EXPECTED_SIZES.small });
    sizeChecks.push(await verifySize(page, 'small', EXPECTED_SIZES.small));
    await applySizeProfile(app, page, { key: 'large', ...EXPECTED_SIZES.large });
    sizeChecks.push(await verifySize(page, 'large', EXPECTED_SIZES.large));
    await applySizeProfile(app, page, { key: 'medium', ...EXPECTED_SIZES.medium });
    sizeChecks.push(await verifySize(page, 'medium-again', EXPECTED_SIZES.medium));

    await page.evaluate(
      ([key, value]) => window.localStorage.setItem(key, value),
      [STORAGE_KEY, storageValue]
    );

    const result = {
      appName,
      userData,
      href: bounds.href,
      viewport: `${bounds.width}x${bounds.height}`,
      bodyClass: bounds.bodyClass,
      hasGameContainer: bounds.hasGameContainer,
      hasScaler: bounds.hasScaler,
      sizeChecks,
      checks: {
        distExists: true,
        appName: appName === 'BIBI DICE 比比丟八' || appName === 'bibi-dice',
        userData: /bibi-dice|BIBI DICE/i.test(userData),
        protocol: bounds.href.startsWith('bibi://app/'),
        viewport: bounds.width === 540 && bounds.height === 960,
        portraitClass: bounds.bodyClass.includes('steam-portrait'),
        dom: bounds.hasGameContainer && bounds.hasScaler,
        sizeSwitch: sizeChecks.every(check => check.ok)
      }
    };

    await app.close();

    const reopenedApp = await electron.launch({ args: [MAIN] });
    try {
      const reopenedPage = await reopenedApp.firstWindow();
      await reopenedPage.waitForLoadState('domcontentloaded');
      await reopenedPage.waitForTimeout(800);
      const restoredValue = await reopenedPage.evaluate(key => window.localStorage.getItem(key), STORAGE_KEY);
      await reopenedPage.evaluate(key => window.localStorage.removeItem(key), STORAGE_KEY);
      result.storage = {
        key: STORAGE_KEY,
        expected: storageValue,
        restored: restoredValue
      };
      result.checks.storagePersistence = restoredValue === storageValue;
    } finally {
      await reopenedApp.close();
    }

    console.log(JSON.stringify(result, null, 2));

    const failed = Object.entries(result.checks).filter(([, ok]) => !ok);
    if (failed.length) {
      throw new Error(`Electron verification failed: ${failed.map(([name]) => name).join(', ')}`);
    }
  } catch (error) {
    try {
      await app.close();
    } catch (_) {
      // App may already be closed after the restart persistence check.
    }
    throw error;
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
