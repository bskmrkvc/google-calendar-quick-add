const { app, ipcMain } = require('electron');
const { registerGlobalShortcut } = require('./src/app/shortcuts');
const { createTray } = require('./src/app/tray');
const { createOAuthServer } = require('./src/auth/server');
const { registerIpcHandlers } = require('./src/ipc/ipc-handlers');
const { getWindow } = require('./src/app/window');

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

// Handle window control events
ipcMain.on('minimize-window', () => {
  const mainWindow = getWindow(); 
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.on('close-window', () => {
  const mainWindow = getWindow();
  if (mainWindow) {
    mainWindow.close();
  }
});