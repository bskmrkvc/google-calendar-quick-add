const { BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const { handleOAuthCode } = require('../auth/oauth-handler');
const TOKEN_PATH = path.join(__dirname, '../../config/token.json');

let win;

/// Creates a new BrowserWindow instance for OAuth authentication and handles the OAuth flow. 
// If a token already exists, it loads the success page directly.
function createOAuthWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, '../../preload.js'), // Preload script for secure context
    },
  });

  // Load the OAuth URL if no token exists, otherwise load the success page
  // and navigate to the scheduler page.
  if (fs.existsSync(TOKEN_PATH)) {
    win.loadURL('http://localhost:3000/success');
    win.webContents.on('did-navigate', (_, url) => {
      if (url.includes('success')) 
        win.loadFile('views/event-scheduler/scheduler.html');
      if (url.includes('error')) {
        win.loadFile('views/error/error.html');
      }
    });
  } 
  else {
    win.loadURL('http://localhost:3000/oauth');
    win.webContents.on('did-navigate', (_, url) => {
      const match = url.match(/code=([^&]+)/);
      if (match) 
        handleOAuthCode(decodeURIComponent(match[1])); // Handle the OAuth code
      if (url.includes('error')) {
        win.loadFile('views/error/error.html');
      }
      if (url.includes('success')) 
        win.loadFile('views/event-scheduler/scheduler.html');
    });
  }

  // Hide the window when it is closed
  win.on('close', e => {
    e.preventDefault();
    win.hide();
  });

  win.show();
}

module.exports = { createOAuthWindow };
