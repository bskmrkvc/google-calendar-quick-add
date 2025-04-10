const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const CREDENTIALS_PATH = path.join(__dirname, '../../config/credentials.json');
const TOKEN_PATH = path.join(__dirname, '../../config/token.json');

// Load client secrets from a local file.
function loadCredentials() {
  return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
}

/// Create an OAuth2 client with the given credentials
/// and authorize it with the token stored in the token.json file.
function authorize(callback) {
  const { client_id, client_secret, redirect_uris } = loadCredentials().web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  if (fs.existsSync(TOKEN_PATH)) {
    const token = fs.readFileSync(TOKEN_PATH, 'utf8');
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  } else {
    console.log('No token found.');
  }
}

/// Add an event to the user's primary calendar
/// using the Google Calendar API. The event data is passed as an argument.
/// The function returns a promise that resolves with the event data or rejects with an error.
/// The event data should include the following properties:
/// - summary: The title of the event
/// - description: A description of the event
/// - start: The start time of the event in ISO format (YYYY-MM-DDTHH:MM:SS)
/// - end: The end time of the event in ISO format (YYYY-MM-DDTHH:MM:SS)
/// The time zone is set to 'Europe/Belgrade'.
/// The function uses the Google Calendar API to insert the event into the user's calendar.
/// If the event is created successfully, it logs the event link to the console.
function addEvent(eventData) {
  return new Promise((resolve, reject) => {
    authorize(auth => {
      const calendar = google.calendar({ version: 'v3', auth });

      const event = {
        summary: eventData.summary,
        description: eventData.description,
        start: {
          dateTime: eventData.start + ':00', // Add seconds for ISO standard
          timeZone: 'Europe/Belgrade',
        },
        end: {
          dateTime: eventData.end + ':00', // Add seconds for ISO standard
          timeZone: 'Europe/Belgrade',
        },
      };

      calendar.events.insert(
        { calendarId: 'primary', resource: event },
        (err, res) => {
          if (err) return reject(err);
          console.log('Event created:', res.data.htmlLink);
          resolve(res.data);
        }
      );
    });
  });
}

module.exports = { addEvent };
