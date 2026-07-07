const { app, BrowserWindow, ipcMain, net, protocol, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');

const APP_NAME = 'BIBI DICE 比比丟八';
app.setName(APP_NAME);

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'bibi',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true
    }
  }
]);

const WINDOW_SIZES = {
  small: { label: 'Small 450 x 800', width: 450, height: 800, scaleClass: '' },
  medium: { label: 'Medium 540 x 960', width: 540, height: 960, scaleClass: '' },
  large: { label: 'Large 675 x 1200', width: 675, height: 1200, scaleClass: 'steam-portrait-large' }
};

const STEAM_APP_ID = Number(process.env.BIBI_DICE_STEAM_APP_ID) || 4792230;
const DEFAULT_SIZE = 'medium';
let mainWindow = null;
let currentSize = DEFAULT_SIZE;
let steamClient = null;

function getCloudSavePaths() {
  const cloudDir = path.join(app.getPath('userData'), 'steam-cloud');
  return {
    cloudDir,
    profilePath: path.join(cloudDir, 'profile-v1.json'),
    backupPath: path.join(cloudDir, 'profile-v1.backup.json'),
    tempPath: path.join(cloudDir, 'profile-v1.tmp.json')
  };
}

function getSteamWebDistName() {
  return process.env.BIBI_DICE_STEAM_WEB_DIST ||
    (packageJson.bibiDice && packageJson.bibiDice.steamWebDist) ||
    'steam-demo';
}

function getGameUrl(sizeKey) {
  const url = new URL('bibi://app/index.html');
  const size = WINDOW_SIZES[sizeKey] || WINDOW_SIZES[DEFAULT_SIZE];
  if (size.scaleClass) url.searchParams.set('steamClass', size.scaleClass);
  return url.toString();
}

function registerGameProtocol() {
  const root = path.resolve(__dirname, '..', 'dist', getSteamWebDistName());
  protocol.handle('bibi', request => {
    const requestUrl = new URL(request.url);
    let pathname = decodeURIComponent(requestUrl.pathname);
    if (pathname === '/' || pathname === '') pathname = '/index.html';
    const requestedPath = path.normalize(path.join(root, pathname));
    if (requestedPath !== root && !requestedPath.startsWith(root + path.sep)) {
      return new Response('Forbidden', { status: 403 });
    }
    return net.fetch(`file://${requestedPath.replace(/\\/g, '/')}`);
  });
}

function applyWindowSize(sizeKey) {
  if (!mainWindow) return currentSize;
  const normalizedSizeKey = WINDOW_SIZES[sizeKey] ? sizeKey : DEFAULT_SIZE;
  const size = WINDOW_SIZES[normalizedSizeKey];
  currentSize = normalizedSizeKey;
  mainWindow.setMinimumSize(450, 800);
  mainWindow.setAspectRatio(9 / 16);
  mainWindow.setContentSize(size.width, size.height);
  mainWindow.center();
  mainWindow.webContents.send('steam-portrait-size', { key: normalizedSizeKey, className: size.scaleClass });
  return currentSize;
}

function registerWindowSizeIpc() {
  ipcMain.handle('steam-portrait-set-size', (_event, sizeKey) => applyWindowSize(sizeKey));
  ipcMain.handle('steam-portrait-get-size', () => currentSize);
}

function saveSteamCloudProfile(profile) {
  if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
    return { ok: false, error: 'Invalid profile payload' };
  }

  const json = JSON.stringify(profile, null, 2);
  if (Buffer.byteLength(json, 'utf8') > 2 * 1024 * 1024) {
    return { ok: false, error: 'Profile payload too large' };
  }

  const { cloudDir, profilePath, backupPath, tempPath } = getCloudSavePaths();
  try {
    fs.mkdirSync(cloudDir, { recursive: true });
    if (fs.existsSync(profilePath)) {
      fs.copyFileSync(profilePath, backupPath);
    }
    fs.writeFileSync(tempPath, json, 'utf8');
    fs.rmSync(profilePath, { force: true });
    fs.renameSync(tempPath, profilePath);
    return { ok: true };
  } catch (error) {
    try { fs.rmSync(tempPath, { force: true }); } catch (_) {}
    return { ok: false, error: error.message };
  }
}

function registerSteamCloudIpc() {
  ipcMain.handle('steam-cloud-load-profile', async () => {
    const { profilePath } = getCloudSavePaths();
    if (!fs.existsSync(profilePath)) {
      return { ok: true, exists: false, profile: null };
    }

    try {
      const stat = fs.statSync(profilePath);
      if (stat.size > 2 * 1024 * 1024) {
        return { ok: false, exists: true, error: 'Profile payload too large' };
      }
      const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
      return { ok: true, exists: true, profile };
    } catch (error) {
      return { ok: false, exists: true, error: error.message };
    }
  });

  ipcMain.handle('steam-cloud-save-profile', async (_event, profile) => {
    return saveSteamCloudProfile(profile);
  });

  ipcMain.on('steam-cloud-save-profile-sync', (event, profile) => {
    event.returnValue = saveSteamCloudProfile(profile);
  });
}

function addSteamworksDllPath() {
  if (process.platform !== 'win32') return;
  const win64Path = path.resolve(__dirname, '..', 'node_modules', 'steamworks.js', 'dist', 'win64');
  if (!fs.existsSync(win64Path)) return;

  const pathParts = (process.env.PATH || '').split(path.delimiter);
  if (!pathParts.some(part => path.resolve(part || '.') === win64Path)) {
    process.env.PATH = `${win64Path}${path.delimiter}${process.env.PATH || ''}`;
  }
}

function getSteamClient() {
  if (steamClient) return { ok: true, client: steamClient };

  try {
    addSteamworksDllPath();
    const steamworks = require('steamworks.js');
    steamClient = steamworks.init(STEAM_APP_ID);
    return { ok: true, client: steamClient };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

function registerSteamAchievementIpc() {
  ipcMain.handle('steam-achievement-unlock', async (_event, achievementId) => {
    if (typeof achievementId !== 'string' || !/^ACH_[A-Z0-9_]+$/.test(achievementId)) {
      return { ok: false, error: 'Invalid achievement id' };
    }

    const steam = getSteamClient();
    if (!steam.ok) {
      return { ok: false, pending: true, reason: 'steamworks_init_failed', error: steam.error };
    }

    try {
      const alreadyActivated = steam.client.achievement.isActivated(achievementId);
      const activated = alreadyActivated || steam.client.achievement.activate(achievementId);
      const stored = activated && steam.client.stats.store();

      if (!activated) {
        return { ok: false, pending: true, reason: 'steamworks_achievement_activate_failed' };
      }
      if (!stored) {
        return { ok: false, pending: true, reason: 'steamworks_stats_store_failed', activated: true };
      }

      return { ok: true, stored: true, alreadyActivated };
    } catch (error) {
      return { ok: false, pending: true, reason: 'steamworks_achievement_unlock_failed', error: error.message };
    }
  });

  ipcMain.handle('open-external-url', (_event, url) => {
    const allowed = /^https:\/\/store\.steampowered\.com\//;
    if (typeof url === 'string' && allowed.test(url)) {
      shell.openExternal(url);
      return { ok: true };
    }
    return { ok: false, error: 'URL not allowed' };
  });
}

function createWindow() {
  const size = WINDOW_SIZES[DEFAULT_SIZE];
  mainWindow = new BrowserWindow({
    width: size.width,
    height: size.height,
    minWidth: WINDOW_SIZES.small.width,
    minHeight: WINDOW_SIZES.small.height,
    backgroundColor: '#09090c',
    show: false,
    resizable: false,
    maximizable: false,
    useContentSize: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.setAspectRatio(9 / 16);
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadURL(getGameUrl(DEFAULT_SIZE));
  mainWindow.once('ready-to-show', () => {
    applyWindowSize(currentSize);
    mainWindow.show();
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

}

app.whenReady().then(() => {
  registerWindowSizeIpc();
  registerSteamCloudIpc();
  registerSteamAchievementIpc();
  registerGameProtocol();
  createWindow();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (steamClient && typeof steamClient.shutdown === 'function') {
    try { steamClient.shutdown(); } catch (_) {}
  }
});
