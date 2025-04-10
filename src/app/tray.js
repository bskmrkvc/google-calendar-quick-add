const { Tray, Menu, app } = require('electron');
const path = require('path');
const { createOAuthWindow } = require('./window');

let tray;

/// Creates a tray icon and sets up a context menu with options to show the OAuth window or quit the app
function createTray() {
  tray = new Tray(path.join(__dirname, '../../assets/icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show', click: createOAuthWindow },
    { label: 'Quit', click: () => app.quit() }
  ]);

  tray.setToolTip('Calendar Shortcut App');
  tray.setContextMenu(contextMenu);
}

module.exports = { createTray };
