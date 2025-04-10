const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendEvent: (data) => ipcRenderer.send('add-event', data),
  onEventAdded: (callback) => ipcRenderer.on('event-added', (event, message) => callback(message))
});
