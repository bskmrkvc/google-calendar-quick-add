const { contextBridge, ipcRenderer } = require('electron');

/// Expose a limited API to the renderer process using contextBridge for security.
contextBridge.exposeInMainWorld('electronAPI', {
  sendEvent: (data) => ipcRenderer.send('add-event', data),
  onEventAdded: (callback) => ipcRenderer.on('event-added', (event, message) => callback(message))
});
