const express = require('express');
const http = require('http');
const { google } = require('googleapis');
const { handleOAuthCode } = require('./oauth-handler');
const credentials = require('../../config/credentials.json');

/// Create an Express server to handle OAuth redirection and authentication with GCalendar API.
function createOAuthServer() {
  const app = express();
  const { client_id, client_secret, redirect_uris } = credentials.web;

  app.get('/oauth', (_, res) => {
    const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar.events'],
    });
    res.redirect(authUrl);
  });

  app.get('/oauth2callback', (req, res) => {
    const code = req.query.code;
    if (code) {
      handleOAuthCode(code);
      res.redirect('http://localhost:3000/success');
    } else {
      res.send('No code found in query.');
    }
  });

  app.get('/success', (_, res) => {
    res.send('Authentication successful! You can now close this window.');
  });

  http.createServer(app).listen(3000, () => {
    console.log('OAuth redirect server running on http://localhost:3000');
  });
}

module.exports = { createOAuthServer };
