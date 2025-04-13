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

  const summary = sanitizeInput(document.getElementById('summary').value);
  const description = sanitizeInput(document.getElementById('description').value);
  const start = formatDateTime(document.getElementById('start').value);
  const end = formatDateTime(document.getElementById('end').value);

  // Validate inputs
  if (!summary || !start || !end) {
    document.getElementById('status').textContent = 'Please fill in all required fields.';
    return;
  }

  if (new Date(start) >= new Date(end)) {
    document.getElementById('status').textContent = 'End time must be after start time.';
    return;
  }

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

// Sanitize user input to prevent XSS or invalid characters
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input.trim();
  return div.textContent;
}

// Format date and time to ISO format without seconds, in 24-hour format
function formatDateTime(dateTime) {
  if (!dateTime) 
    return null;
  const date = new Date(dateTime);
  if (isNaN(date.getTime()))
    return null;
  return date.toISOString().slice(0, 16);
}