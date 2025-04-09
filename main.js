const { app, BrowserWindow, globalShortcut, Tray, Menu, ipcMain } = require('electron');
const path = require('path');

let win;
let tray = null;

function createWindow() {
  win = new BrowserWindow({
    width: 500,
    height: 400,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('popup.html');

  // Hide window instead of closing
  win.on('close', (e) => {
    e.preventDefault();
    win.hide();
  });
}

app.whenReady().then(() => {
  createWindow();

  // Global hotkey: Ctrl+Shift+G (or Cmd+Shift+G)
  globalShortcut.register('CommandOrControl+Shift+G', () => {
    win.show();
    win.focus();
  });

  // Tray icon
  tray = new Tray(path.join(__dirname, 'icon.png')); // Add your tray icon
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show', click: () => win.show() },
    { label: 'Quit', click: () => app.quit() }
  ]);
  tray.setToolTip('Calendar Shortcut App');
  tray.setContextMenu(contextMenu);
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
