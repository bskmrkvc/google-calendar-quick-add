require('dotenv').config();
const { BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const { handleOAuthCode } = require('../auth/oauth-handler');

const TOKEN_PATH = process.env.TOKEN_PATH; 
const OAUTH_URL = process.env.OAUTH_URL;
const SUCCESS_URL = process.env.SUCCESS_URL;

let win;

/// Creates a new BrowserWindow instance for OAuth authentication and handles the OAuth flow. 
// If a token already exists, it loads the success page directly.
function createOAuthWindow() {
  if (win && !win.isDestroyed()) {
    win.show(); // Bring the existing window to the front
    win.focus(); // Focus the window
    return;
  }

  win = new BrowserWindow({
    width: 900,
    height: 800,
    frame: false,
    transparent: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, '../../preload.js'), // Preload script for secure context
    },
  });

  // Load the OAuth URL if no token exists, otherwise load the success page
  // and navigate to the scheduler page.
  if (fs.existsSync(TOKEN_PATH)) {
    win.loadURL(SUCCESS_URL);
    win.webContents.on('did-navigate', (_, url) => {
      if (url.includes('success')) 
        win.loadFile('src/views/event-scheduler/scheduler.html');
      if (url.includes('error')) {
        win.loadFile('src/views/error/error.html');
      }
    });
  } else {
    win.loadURL(OAUTH_URL);
    win.webContents.on('did-navigate', (_, url) => {
      const match = url.match(/code=([^&]+)/);
      if (match) 
        handleOAuthCode(decodeURIComponent(match[1]));
      if (url.includes('error')) {
        win.loadFile('src/views/error/error.html');
      }
      if (url.includes('success')) 
        win.loadFile('src/views/event-scheduler/scheduler.html');
    });
  }

  win.on('close', e => {
    e.preventDefault();
    win.hide();
  });

  win.show();
}

function getWindow() {
  return win;
}

module.exports = { createOAuthWindow, getWindow };
