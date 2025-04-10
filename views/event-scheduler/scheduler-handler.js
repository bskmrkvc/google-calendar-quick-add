document.getElementById('event-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const summary = document.getElementById('summary').value;
  const description = document.getElementById('description').value;
  const start = document.getElementById('start').value;
  const end = document.getElementById('end').value;

  // Send event data to main process
  window.electronAPI.sendEvent({ summary, description, start, end });
});

window.electronAPI.onEventAdded((message) => {
  document.getElementById('status').textContent = message;
});

document.getElementById('event-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const summary = document.getElementById('summary').value;
  const description = document.getElementById('description').value;
  const start = document.getElementById('start').value;
  const end = document.getElementById('end').value;

  // Send event data to main process when the user clicks "Add Event"
  ipcRenderer.send('add-event', {
    summary,
    description,
    start,
    end,
  });
});

ipcRenderer.on('event-added', (event, message) => {
  document.getElementById('status').textContent = message;
});
