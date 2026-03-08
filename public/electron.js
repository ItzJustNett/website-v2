const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')

let mainWindow
const windows = new Map()

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../out/index.html')}`

  mainWindow.loadURL(startUrl)

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function createTestWindow(testData) {
  const testWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 600,
    minHeight: 500,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  const startUrl = isDev
    ? `http://localhost:3000/test?data=${encodeURIComponent(JSON.stringify(testData))}`
    : `file://${path.join(__dirname, '../out/test/index.html')}`

  testWindow.loadURL(startUrl)

  if (isDev) {
    testWindow.webContents.openDevTools()
  }

  windows.set('test-' + Date.now(), testWindow)

  testWindow.on('closed', () => {
    windows.delete('test-' + Date.now())
  })

  return testWindow
}

function createSummaryWindow(summaryData) {
  const summaryWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 500,
    minHeight: 500,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  const startUrl = isDev
    ? `http://localhost:3000/summary?data=${encodeURIComponent(JSON.stringify(summaryData))}`
    : `file://${path.join(__dirname, '../out/summary/index.html')}`

  summaryWindow.loadURL(startUrl)

  if (isDev) {
    summaryWindow.webContents.openDevTools()
  }

  windows.set('summary-' + Date.now(), summaryWindow)

  summaryWindow.on('closed', () => {
    windows.delete('summary-' + Date.now())
  })

  return summaryWindow
}

// IPC handlers for opening new windows
ipcMain.on('open-test-window', (event, testData) => {
  createTestWindow(testData)
})

ipcMain.on('open-summary-window', (event, summaryData) => {
  createSummaryWindow(summaryData)
})

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// Create menu
const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Exit',
        accelerator: 'CmdOrCtrl+Q',
        click: () => {
          app.quit()
        },
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
    ],
  },
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
