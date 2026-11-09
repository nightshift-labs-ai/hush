// Electron shell, following the official quickstart. Launch: SMARTSPECTRA_API_KEY=... npm start
// HUSH_RECORD=1 saves a short demo round (game + camera) to the Desktop; HUSH_RECORD=mosaic blurs the camera to blocks.
const path = require('path');
const { app, BrowserWindow, session, ipcMain } = require('electron');
const { bindSmartSpectraIpc } = require('@smartspectra/node-sdk/main');
app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((wc, permission, cb, details) => {
    const url = (details && details.requestingUrl) || (wc && wc.getURL()) || '';
    cb(permission === 'media' && url.startsWith('file://'));
  });
  session.defaultSession.on('will-download', (_e, item) => item.setSavePath(path.join(app.getPath('desktop'), `hush-demo-${Date.now()}.webm`)));
  const win = new BrowserWindow({ width: 1280, height: 800, backgroundColor: '#000', autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, 'dist', 'preload.bundle.js'), contextIsolation: true, sandbox: true, nodeIntegration: false } });
  bindSmartSpectraIpc(win);
  // The key stays out of URLs, logs and the page: the renderer asks for it once, after consent.
  ipcMain.handle('hush:key', () => process.env.SMARTSPECTRA_API_KEY || '');
  const query = {};
  if (process.env.HUSH_RECORD === '1' || process.env.HUSH_RECORD === 'mosaic') query.record = process.env.HUSH_RECORD;
  win.loadFile(path.join(__dirname, 'index.html'), { query });
});
app.on('window-all-closed', () => { setTimeout(() => process.kill(process.pid, 'SIGKILL'), 2500); app.quit(); });
