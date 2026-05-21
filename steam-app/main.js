const { app, BrowserWindow, Menu, net, protocol } = require('electron');
const path = require('path');
const packageJson = require('../package.json');

const APP_NAME = packageJson.productName || packageJson.name || 'bibi-dice';
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

const DEFAULT_SIZE = 'medium';
let mainWindow = null;
let currentSize = DEFAULT_SIZE;

function getGameUrl(sizeKey) {
  const url = new URL('bibi://app/index.html');
  const size = WINDOW_SIZES[sizeKey] || WINDOW_SIZES[DEFAULT_SIZE];
  if (size.scaleClass) url.searchParams.set('steamClass', size.scaleClass);
  return url.toString();
}

function registerGameProtocol() {
  const root = path.resolve(__dirname, '..', 'dist', 'steam-demo');
  protocol.handle('bibi', request => {
    const requestUrl = new URL(request.url);
    let pathname = decodeURIComponent(requestUrl.pathname);
    if (pathname === '/' || pathname === '') pathname = '/index.html';
    const requestedPath = path.normalize(path.join(root, pathname));
    if (!requestedPath.startsWith(root)) {
      return new Response('Forbidden', { status: 403 });
    }
    return net.fetch(`file://${requestedPath.replace(/\\/g, '/')}`);
  });
}

function applyWindowSize(sizeKey) {
  if (!mainWindow) return;
  const size = WINDOW_SIZES[sizeKey] || WINDOW_SIZES[DEFAULT_SIZE];
  currentSize = sizeKey;
  mainWindow.setMinimumSize(450, 800);
  mainWindow.setAspectRatio(9 / 16);
  mainWindow.setContentSize(size.width, size.height);
  mainWindow.center();
  mainWindow.webContents.send('steam-portrait-size', { key: sizeKey, className: size.scaleClass });
}

function createMenu() {
  const template = [
    {
      label: 'View',
      submenu: [
        {
          label: WINDOW_SIZES.small.label,
          type: 'radio',
          checked: currentSize === 'small',
          click: () => applyWindowSize('small')
        },
        {
          label: WINDOW_SIZES.medium.label,
          type: 'radio',
          checked: currentSize === 'medium',
          click: () => applyWindowSize('medium')
        },
        {
          label: WINDOW_SIZES.large.label,
          type: 'radio',
          checked: currentSize === 'large',
          click: () => applyWindowSize('large')
        },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'toggleDevTools' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
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
    resizable: true,
    useContentSize: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.setAspectRatio(9 / 16);
  mainWindow.loadURL(getGameUrl(DEFAULT_SIZE));
  mainWindow.once('ready-to-show', () => {
    applyWindowSize(DEFAULT_SIZE);
    mainWindow.show();
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  createMenu();
}

app.whenReady().then(() => {
  registerGameProtocol();
  createWindow();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
