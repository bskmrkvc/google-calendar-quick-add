const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// Path to credentials and token
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');

// Load client secrets from a local file
function loadCredentials() {
  const content = fs.readFileSync(CREDENTIALS_PATH, 'utf8');
  return JSON.parse(content);
}

// Authorize with Google
function authorize(callback) {
  const credentials = loadCredentials();
  const { client_secret, client_id, redirect_uris } = credentials.web; // NOTE: using .web

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if token exists
  if (fs.existsSync(TOKEN_PATH)) {
    const token = fs.readFileSync(TOKEN_PATH, 'utf8');
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  } else {
    console.log('No token found. Please authorize the app first.');
  }
}

// Add event to Google Calendar
function addEvent(eventData) {
  console.log("clicked addEvent", eventData);
    return new Promise((resolve, reject) => {
      authorize((auth) => {
        const calendar = google.calendar({ version: 'v3', auth });
  
        const event = {
          summary: eventData.summary,
          description: eventData.description,
          start: {
            dateTime: eventData.start + ":00", // Convert to ISO string
            timeZone: 'Europe/Belgrade',
          },
          end: {
            dateTime: eventData.end + ":00", // Convert to ISO string, 
            timeZone: 'Europe/Belgrade',
          },
        };
  
        calendar.events.insert(
          {
            auth,
            calendarId: 'primary',
            resource: event,
          },
          (err, event) => {
            if (err) {
              console.error('Error contacting the Calendar service: ' + err);
              reject(err);
              return;
            }
            console.log('Event created: %s', event.data.htmlLink);
            resolve(event.data);
          }
        );
      });
    });
  }
  

module.exports = { addEvent };
