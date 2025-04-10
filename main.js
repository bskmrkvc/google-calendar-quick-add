const { app, BrowserWindow, globalShortcut, Tray, Menu, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const TOKEN_PATH = path.join(__dirname, 'token.json');
const express = require('express');
const http = require('http');
const { google } = require('googleapis');
const { addEvent } = require('./google-calendar');

// Create the hidden popup window
let win;
let tray = null;
let oauth2Client = null;

// Check if the token exists
function isAuthenticated() {
  return fs.existsSync(TOKEN_PATH); // Check if the token file exists
}

// Create the OAuth window and start OAuth flow
function createOAuthWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  

  if (fs.existsSync(TOKEN_PATH)) {
    // Token exists, skip OAuth and go to popup
    win.loadURL('http://localhost:3000/success');

    win.webContents.on('did-navigate', (event, url) => {
      if (url === 'http://localhost:3000/success') {
        win.loadFile('popup.html');
      }
    });
  } else {
    // No token, start OAuth flow
    win.loadURL('http://localhost:3000/oauth');

    // Handle the OAuth2 redirect URI
    win.webContents.on('did-navigate', (event, url) => {
      const regex = /code=([^&]+)/;
      const match = url.match(regex);

      if (match) {
        const code = match[1];
        console.log('Authorization code received: ', code);
        handleOAuthCode(code);
      }

      if (url === 'http://localhost:3000/success') {
        win.loadFile('popup.html');
      }
    });
  }

  win.on('close', (e) => {
    e.preventDefault();
    win.hide();
  });

  win.show();
}

function handleOAuthCode(code) {
    console.log('Received authorization code:', code); // Log the code for debugging

    // URL decode the code to ensure it is correctly formatted
    const decodedCode = decodeURIComponent(code);
    console.log('Decoded authorization code:', decodedCode); // Log the decoded code

    // Once we have the authorization code, exchange it for tokens
    oauth2Client.getToken(decodedCode, (err, tokens) => {
        if (err) {
            console.error('Error getting tokens: ', err); // Log error details for debugging
            return;
        }

        if (!tokens || !tokens.access_token || !tokens.refresh_token) {
            console.error('Missing tokens in the response.');
            return;
        }

        console.log('Tokens received and stored:', tokens);
        oauth2Client.setCredentials(tokens);

        // Save the tokens to a file
        try {
            fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
            console.log('Tokens saved to token.json');
        } catch (writeError) {
            console.error('Error saving tokens:', writeError);
        }
    });
}

// Express server to handle OAuth redirect
function createOAuthServer() {
    const oauthApp = express();
  
    oauthApp.get('/oauth', (req, res) => {
      const credentials = require('./credentials.json'); // Path to credentials JSON
  
      const { client_id, client_secret, redirect_uris } = credentials.web;
      oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar.events'],
      });
  
      res.redirect(authUrl); // Redirect user to Google OAuth consent screen
    });
  
    oauthApp.get('/oauth2callback', (req, res) => {
      const code = req.query.code;
      if (code) {
        handleOAuthCode(code); // Handle the authorization code
        res.redirect('http://localhost:3000/success');  // This will trigger an Electron action
      } else {
        res.send('No code found in query.');
      }
    });
  
    // Add the /success route to acknowledge OAuth success
    oauthApp.get('/success', (req, res) => {
        res.send('Authentication successful! You can now close this window.');
    });
      
    const server = http.createServer(oauthApp);
    server.listen(3000, () => {
      console.log('OAuth redirect server running on http://localhost:3000');
    });
  }

app.whenReady().then(() => {
  createOAuthServer();

  globalShortcut.register('CommandOrControl+Shift+G', () => {
    createOAuthWindow();
  });

  tray = new Tray(path.join(__dirname, 'icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show', click: () => createOAuthWindow() },
    { label: 'Quit', click: () => app.quit() },
  ]);
  tray.setToolTip('Calendar Shortcut App');
  tray.setContextMenu(contextMenu);
});

ipcMain.on('add-event', async (event, eventData) => {
    try {
      // Call addEvent function from google-calendar.js when the button is clicked
      await addEvent(eventData);
      event.reply('event-added', 'Event added to Google Calendar!');
    } catch (err) {
      console.error(err);
      event.reply('event-added', 'Failed to add event.');
    }
  });

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
