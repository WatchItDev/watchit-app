require('v8-compile-cache')
const fs = require('fs')
const path = require('path')
const mime = require('mime')
// Logs settings
const logger = require('logplease')
const log = logger.create('MAIN')

const { mainMenu } = require('./helpers/menu')
const {
  fadeWindowOut,
  fadeWindowIn
} = require('./helpers/screen')

const { autoUpdater } = require('electron-updater')
const {
  app,
  BrowserWindow,
  ipcMain,
  protocol,
  Menu,
  dialog
} = require('electron')

const ROOT_APP = process.cwd()
const ROOT_STORE = app.getPath('appData')
const ENV = process.env.NODE_ENV || 'production'
const inDev = Object.is(ENV, 'development')
let win
const isDarwin = Object.is(process.platform, 'darwin')
const isWin = Object.is(process.platform, 'win32')
const appIcon = path.join(ROOT_APP, '/src/render/media/icons/icon.png')
const appPath = inDev ? ROOT_APP : ROOT_STORE

// Setup logger
logger.setLogfile(`${appPath}/debug.log`)
logger.setLogLevel(logger.LogLevels.DEBUG)

// Dont move appPath from this line
process.env.appPath = appPath
const { removeFiles } = require('./core/utils')
const key = require('./core/key')
const node = require('./core')

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) app.quit()

// Override errors
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true
dialog.showErrorBox = (title, content) => {
  log.info(`${title}\n${content}`)
}

/*******************
 * FUNCTIONS
 *******************/
const registerMiddleware = () => {
  // Register "file" protocol to use locally
  protocol.registerFileProtocol('file', (request, cb) => {
    const file = request.url.substr(7)
    const headers = { 'Content-Type': mime.getType(file) }
    cb({
      path: file,
      headers: headers
    })
  })
}
const removeCacheDirs = () => {
  fs.readdirSync(appPath).filter(
    fn => fn.startsWith('w_alloc') || fn.startsWith('w_source')
  ).forEach(async (file) => {
    log.warn('Removing ' + file)
    await removeFiles(path.join(appPath, file))
  })
}
const wipeInvalidSync = () => {
  key.removeFromStorage('peers')
  const cache = key.readFromStorage()
  if (cache && !('tmp' in cache)) {
    removeCacheDirs()
  }
}
const initWindowing = (inDev) => {
  const indexUrl = inDev
    ? 'http://localhost:3000/splash.png'
    : 'file://' + path.join(__dirname, '../build/splash.png')

  const loadingScreen = new BrowserWindow({
    width: 600,
    height: 400,
    frame: false,
    show: false
  })

  loadingScreen.loadURL(indexUrl).then(() => {
    loadingScreen.setOpacity(0)
    loadingScreen.show()

    // fade in the splash screen
    fadeWindowIn(loadingScreen, 0.1, 30, () => {
      log.info('Fade in splash done')
      createMain(inDev, loadingScreen)
    })
  })
}

const createMain = (inDev, child) => {
  win = new BrowserWindow({
    ...inDev && { icon: appIcon },
    ...{
      title: 'WatchIt',
      width: 1280,
      height: 800,
      minWidth: 1280,
      minHeight: 800,
      backgroundColor: '#12191f',
      backgroundThrottling: false,
      center: true,
      frame: false,
      show: false,
      transparent: false,
      webPreferences: {
        spellCheck: false,
        enableRemoteModule: false,
        contextIsolation: false,
        nodeIntegration: true,
        webSecurity: false,
        preload: path.join(__dirname, '/core/preload.js')
      }
    }
  })

  const indexUrl = inDev
    ? 'http://localhost:3000/'
    : 'file://' + path.join(__dirname, '../build/index.html')

  // and load the index.html of the app.
  win.loadURL(indexUrl).then(() => {
    if (child) {
      // fade out the splash screen
      fadeWindowOut(child, 0.1, 10, () => {
        log.info('Fade out splash done!')
        child.close()
        // isDarwin ? win.setSimpleFullScreen(true)
        //     : win.setFullScreen(true);
        // win.setOpacity(0);
        win.show()
      })
    }
  })

  // Open the DevTools.
  if (inDev) win.webContents.openDevTools({ mode: 'detach' })
  // win.webContents.openDevTools()
  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null // Win close
  })
}

/*******************
 * END FUNCTIONS
 *******************/

/*******************
 * LISTENERS
 *******************/
// Auto update setup
autoUpdater.logger = log
autoUpdater.autoDownload = false
autoUpdater.on('update-available', async () => {
  log.info('New Update')
  win.webContents.send('update-available')
  await autoUpdater.downloadUpdate().catch(() => {
    console.log('Download update failed')
  })
})

autoUpdater.on('error', () => log.error('Error trying update app'))
autoUpdater.on('update-downloaded', async () => {
  log.info('Update Downloaded')
  setImmediate(() => autoUpdater.quitAndInstall())
})
// End auto update setup

// Behaviour on second instance for parent process- Pretty much optional
if (isDarwin) mainMenu(Menu, app)
// https://www.electronjs.org/docs/tutorial/offscreen-rendering
// app.disableHardwareAcceleration()
app.setPath('crashDumps', path.join(appPath, 'crashes'))
app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('window-all-closed', () => {
  if (!isDarwin) app.quit()
})

app.on('before-quit', () => {
  wipeInvalidSync()
})

app.on('ready', async () => {
  if (!key.existKey) {
    return removeCacheDirs()
  }

  if (isWin || isDarwin) {
    // Temp validation while updater failing
    log.info('Check for updates')
    await autoUpdater.checkForUpdates().catch(() => {
      log.warn('No updates available')
    })
  }
})

// Disable cors errors
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=512')
app.commandLine.appendSwitch('ignore-certificate-errors')
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors')

// On app ready open windows
app.whenReady().then(() => {
  // Load the dist build or connect to webpack-dev-server
  initWindowing(inDev)
  registerMiddleware()

  const orbitProcess = node(ipcMain)
  app.on('will-quit', async (e) => {
    log.warn('Closing')
    await orbitProcess.close()
    app.releaseSingleInstanceLock()

    if (!orbitProcess.closed()) {
      // Force loop quit if orbit fail closing!!
      log.warn('Quiting')
      e.preventDefault() && app.quit()
    }
  })

  ipcMain.on('close', async () => app.quit())
  ipcMain.on('party', async () => {
    if (key.existKey) await removeFiles(key.keyFile)
    ipcMain.emit('party-success') // Just after key being removed
    // removeCacheDirs(); // Clean old data dir
  })

  ipcMain.on('focus', () => win.focus())
  ipcMain.on('minimize', (e) => {
    win.minimize()
  })

  ipcMain.on('maximize', (e) => {
    if (!isDarwin) win.setFullScreen(!win.isFullScreen())
    if (isDarwin) win.setSimpleFullScreen(!win.isSimpleFullScreen())
  })
})

/*******************
 * END LISTENERS
 *******************/
