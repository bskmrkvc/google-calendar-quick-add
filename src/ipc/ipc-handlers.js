const { addEvent } = require('../calendar/google-calendar');

/// Register IPC handlers for the main process to handle events from the renderer process.
function registerIpcHandlers(ipcMain) {
  ipcMain.on('add-event', async (event, eventData) => {
    try {
      await addEvent(eventData);
      event.reply('event-added', 'Event added to Google Calendar!');
    } catch (err) {
      console.error(err);
      event.reply('event-added', 'Failed to add event.');
    }
  });
}

module.exports = { registerIpcHandlers };
