const { app, BrowserWindow } = require('electron')
const path = require('path')
const { URL } = require('url')

let mainWindow
const dev = process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'development'

if (process.platform === 'win32') {
  app.commandLine.appendSwitch('high-dpi-support', 'true')
  app.commandLine.appendSwitch('force-device-scale-factor', '1')
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  if (dev && process.argv.indexOf('--noDevServer') === -1) {
    mainWindow.loadURL(new URL('index.html', 'http://localhost:8080').href)
  } else {
    mainWindow.loadURL(new URL(path.join(__dirname, 'dist', 'index.html'), 'file://').href)
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()

    if (dev) {
      const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')

      installExtension(REACT_DEVELOPER_TOOLS)
        .catch(err => console.log('Error loading React DevTools: ', err))
      mainWindow.webContents.openDevTools()
    }
  })

  mainWindow.on('closed', function() {
    mainWindow = null
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
