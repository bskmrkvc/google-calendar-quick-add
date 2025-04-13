const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const credentials = require('../../config/credentials.json');

const TOKEN_PATH = process.env.TOKEN_PATH; 
let oauth2Client;

// // Load client secrets from a local file. 
function handleOAuthCode(code) {
  const { client_id, client_secret, redirect_uris } = credentials.web;
  oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  oauth2Client.getToken(code, (err, tokens) => {
    if (err) return console.error('Error retrieving tokens:', err);

    oauth2Client.setCredentials(tokens);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    console.log('Tokens saved to', TOKEN_PATH);
  });
}

module.exports = { handleOAuthCode, oauth2Client };
