import path from 'path'
import log from '@/main/logger'
import backend from './core'

import { mainMenu } from './helpers/menu'
import { fadeWindowOut, fadeWindowIn } from './helpers/screen'

import { app, BrowserWindow, ipcMain, Menu, dialog } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

let win
const ROOT_APP = process.cwd()
const ROOT_STORE = app.getPath('appData')

const isDarwin = Object.is(process.platform, 'darwin')
const isWin = Object.is(process.platform, 'win32')
const appIcon = path.join(ROOT_APP, '/src/render/media/icons/icon.png')
const appPath = is.dev ? ROOT_APP : ROOT_STORE

// D'ont move appPath from this line
process.env.appPath = appPath
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) app.quit()

// Override errors
dialog.showErrorBox = (title, content) => {
  log.info(`${title}\n${content}`)
}

const initWindowing = (devMode) => {
  const indexSplash = is.dev && process.env.ELECTRON_RENDERER_URL
    ? `${process.env.ELECTRON_RENDERER_URL}/splash.png`
    : `${path.join(__dirname, '../renderer/splash.png')}`

  const loadingScreen = new BrowserWindow({
    width: 600, height: 400, frame: false, show: false
  })

  loadingScreen.loadURL(indexSplash).then(() => {
    loadingScreen.setOpacity(0)
    loadingScreen.show()

    // fade in the splash screen
    fadeWindowIn(loadingScreen, 0.1, 30, () => {
      log.info('Fade in splash done')
      createMain(devMode, loadingScreen)
    })
  })
}

const createMain = (devMode, child) => {
  const indexUrl = is.dev && process.env.ELECTRON_RENDERER_URL
    ? process.env.ELECTRON_RENDERER_URL
    : `${path.join(__dirname, '../renderer/index.html')}`

  win = new BrowserWindow({
    ...(devMode && { icon: appIcon }),
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
        preload: path.join(__dirname, '../preload/index.mjs')
      }
    }
  })

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
  if (is.dev) win.webContents.openDevTools({ mode: 'detach' })
  // win.webContents.openDevTools()
  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null // Win close
  })
}

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

// On app ready open windows
// app.on('ready', async () => {})
app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  if (isWin || isDarwin) {
    // Temp validation while updater failing
    log.info('Check for updates')
    // await autoUpdater.checkForUpdates().catch(() => {
    //   log.warn("No updates available");
    // });
  }

  // Load the dist build or connect to webpack-dev-server
  initWindowing(is.dev)
  // Initialize ipfs/helia node and assign underlying events.
  const helia = await import('./core/helia.mjs')
  const mainThread = await backend(ipcMain, helia)

  app.on('will-quit', async (e) => {
    log.warn('Closing')
    await mainThread.stop()
    app.releaseSingleInstanceLock()
  })

  optimizer.registerFramelessWindowIpc()
  ipcMain.on('ping', () => console.log('pong'))

  // ipcMain.on("close", async () => app.quit());

  // ipcMain.on("focus", () => win.focus());
  // ipcMain.on("minimize", (e) => {
  //   win.minimize();
  // });

  // ipcMain.on("maximize", (e) => {
  //   if (!isDarwin) win.setFullScreen(!win.isFullScreen());
  //   if (isDarwin) win.setSimpleFullScreen(!win.isSimpleFullScreen());
  // });
})

// Disable cors errors
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=512')
app.commandLine.appendSwitch('ignore-certificate-errors')
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors')

/*******************
 * END LISTENERS
 *******************/
