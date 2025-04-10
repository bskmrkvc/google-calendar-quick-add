const { app, ipcMain } = require('electron');
const { registerGlobalShortcut } = require('./src/app/shortcuts');
const { createTray } = require('./src/app/tray');
const { createOAuthServer } = require('./src/auth/server');
const { registerIpcHandlers } = require('./src/ipc/ipc-handlers');

/// Main process for Electron application
app.whenReady().then(() => {
  createOAuthServer();
  registerGlobalShortcut();
  createTray();
  registerIpcHandlers(ipcMain);
});

/// Quit the app when all windows are closed, except on macOS
app.on('will-quit', () => {
  require('electron').globalShortcut.unregisterAll();
});
