const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  openTestWindow: (testData) => ipcRenderer.send('open-test-window', testData),
  openSummaryWindow: (summaryData) => ipcRenderer.send('open-summary-window', summaryData),
  isDev: process.env.NODE_ENV === 'development',
})
