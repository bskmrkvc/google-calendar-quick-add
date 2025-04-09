const { ipcRenderer } = require('electron');

document.getElementById('event-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const summary = document.getElementById('summary').value;
  const start = document.getElementById('start').value;
  const end = document.getElementById('end').value;

  ipcRenderer.send('add-event', { summary, start, end });

  alert('Event data sent (not yet saved to Google Calendar)');
  window.close();
});
