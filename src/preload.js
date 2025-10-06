const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    ipcRenderer: {
        invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
        on: (channel, func) => ipcRenderer.on(channel, func),
        send: (channel, ...args) => ipcRenderer.send(channel, ...args)
    }
});
