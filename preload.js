const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  searchNodeModules: (path) => ipcRenderer.invoke('search-node-modules', path),
  deleteFolder: (path, permanent) => ipcRenderer.invoke('delete-folder', path, permanent),
  cancelSearch: () => ipcRenderer.invoke('cancel-search'),
  onProgress: (cb) => {
    ipcRenderer.on('search-progress', (_, data) => cb(data))
    return () => ipcRenderer.removeAllListeners('search-progress')
  }
})
