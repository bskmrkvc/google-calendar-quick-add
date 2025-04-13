const { globalShortcut } = require('electron');
const { createOAuthWindow } = require('./window');

// Registers a global shortcut that opens the OAuth window when the user presses CommandOrControl+Shift+G
function registerGlobalShortcut() {
  globalShortcut.register('CommandOrControl+Shift+G', () => {
    createOAuthWindow(); // This will now check if the window is already open
  });
}

module.exports = { registerGlobalShortcut };
