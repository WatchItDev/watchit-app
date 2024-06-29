import log from '@/main/logger'
import helia from './core/helia'
import bootstrap from './core/bootstrap'

import { mainMenu } from './helpers/menu'
import { fadeWindowOut, fadeWindowIn } from './helpers/screen'
import { app, BrowserWindow, ipcMain, Menu, dialog } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { fileURLToPath } from 'url';

/**
 * Creates an absolute path from a relative one.
 * https://electron-vite.org/guide/dev#esm-support-in-electron
 * 
 * @param {*} relative 
 * @returns 
 */
function absPath(relative) {
  return fileURLToPath(new URL(relative, import.meta.url))
}

let win;
const appIcon = absPath('../../resources/icon.png')
const isDarwin = Object.is(process.platform, 'darwin')
const isWin = Object.is(process.platform, 'win32')
const isLinux = Object.is(process.platform, 'linux')

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) app.quit()

// Override errors
dialog.showErrorBox = (title, content) => {
  log.info(`${title}\n${content}`)
}

const initWindowing = () => {
  const indexSplash = `${absPath('../../resources/splash.png')}`
  const loadingScreen = new BrowserWindow({
    width: 600, height: 400, frame: false, show: false
  })

  // If dev load the local dev server else load production file
  loadingScreen.loadFile(indexSplash).then(() => {
    loadingScreen.setOpacity(0)
    loadingScreen.show()

    // fade in the splash screen
    fadeWindowIn(loadingScreen, 0.1, 30, () => {
      log.info('Fade in splash done')
      createMain(loadingScreen)
    })
  })
}

const createMain = (child) => {

  win = new BrowserWindow({
    ...{
      title: 'WatchIt',
      width: 1280,
      height: 800,
      minWidth: 1280,
      minHeight: 800,
      backgroundColor: '#12191f',
      backgroundThrottling: false,
      autoHideMenuBar: true,
      center: true,
      frame: false,
      show: false,
      transparent: false,
      ...(isLinux ? { icon: appIcon } : {}),
      webPreferences: {
        sandbox: false,
        contextIsolation: true,
        nodeIntegration: true,
        preload: `${absPath('../preload/index.mjs')}`
      }
    }
  })

  const indexUrl = is.dev && process.env.ELECTRON_RENDERER_URL
    ? win.loadURL(process.env.ELECTRON_RENDERER_URL)
    : win.loadFile(`${absPath('../renderer/index.html')}`)

  // and load the index.html of the app.
  indexUrl.then(() => {
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
  initWindowing()
  // Initialize ipfs/helia node and assign underlying events.
  bootstrap(ipcMain, { Helia: helia }).then(() => {
    log.info('Helia node ready')
  })

  app.on('will-quit', async (e) => {
    log.warn('Closing')
    app.releaseSingleInstanceLock()
  })

  optimizer.registerFramelessWindowIpc()
  ipcMain.on('ping', () => console.log('pong'))
})

// Disable cors errors
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=512')
app.commandLine.appendSwitch('ignore-certificate-errors')
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors')

/*******************
 * END LISTENERS
 *******************/
