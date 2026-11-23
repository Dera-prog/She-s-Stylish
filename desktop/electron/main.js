const { app, BrowserWindow, protocol, net, shell } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const APP_HOST = 'app://shes';
const APP_ROOT = path.join(__dirname, '..', 'app');
const ICON = path.join(__dirname, '..', 'build', 'icon.png');

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true },
  },
]);

let win = null;

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (!win) return;
    if (win.isMinimized()) win.restore();
    win.focus();
  });

  app.whenReady().then(() => {
    protocol.handle('app', (request) => {
      const { pathname } = new URL(request.url);
      let filePath = path.join(APP_ROOT, decodeURIComponent(pathname));
      if (!filePath.startsWith(APP_ROOT + path.sep)) {
        return new Response('Not found', { status: 404 });
      }
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(APP_ROOT, 'index.html');
      }
      return net.fetch(pathToFileURL(filePath).toString());
    });

    win = new BrowserWindow({
      width: 460,
      height: 940,
      minWidth: 380,
      minHeight: 640,
      backgroundColor: '#f5f6f8',
      title: "She's Stylish",
      icon: ICON,
      show: false,
      autoHideMenuBar: true,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
      },
    });

    win.removeMenu();
    win.once('ready-to-show', () => win.show());
    win.loadURL(`${APP_HOST}/`);

    win.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('https://')) shell.openExternal(url);
      return { action: 'deny' };
    });

    win.webContents.on('will-navigate', (event, url) => {
      if (url.startsWith(`${APP_HOST}/`)) return;
      event.preventDefault();
      if (url.startsWith('https://')) shell.openExternal(url);
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}
