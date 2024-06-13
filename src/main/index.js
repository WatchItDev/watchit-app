// require('v8-compile-cache')
const fs = require("fs");
const path = require("path");
const mime = require("mime");

// Logs settings
const logger = require("logplease");
const log = logger.create("MAIN");

const { mainMenu } = require("./helpers/menu");
const { fadeWindowOut, fadeWindowIn } = require("./helpers/screen");
const {
  app,
  BrowserWindow,
  ipcMain,
  protocol,
  Menu,
  dialog,
} = require("electron");

let win;
const ROOT_APP = process.cwd();
const ROOT_STORE = app.getPath("appData");
const ENV = process.env.NODE_ENV || "production";
const inDev = Object.is(ENV, "development");
const isDarwin = Object.is(process.platform, "darwin");
const isWin = Object.is(process.platform, "win32");
const appIcon = path.join(ROOT_APP, "/src/render/media/icons/icon.png");
const appPath = inDev ? ROOT_APP : ROOT_STORE;

// Setup logger
logger.setLogfile(`${appPath}/debug.log`);
logger.setLogLevel(logger.LogLevels.DEBUG);

// D'ont move appPath from this line
process.env.appPath = appPath;
const backend = require("./core");

const indexSplash = `file://${path.join(__dirname, "../build/splash2.png")}`;
const indexUrl = `file://${path.join(__dirname, "../build/index.html")}`;

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) app.quit();

// Override errors
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
dialog.showErrorBox = (title, content) => {
  log.info(`${title}\n${content}`);
};

/*******************
 * FUNCTIONS
 *******************/
const registerMiddleware = () => {
  // Register "file" protocol to use locally
  protocol.registerFileProtocol("file", (request, cb) => {
    const file = request.url.substr(7);
    const headers = { "Content-Type": mime.getType(file) };
    cb({
      path: file,
      headers: headers,
    });
  });
};


const initWindowing = (inDev) => {
  const loadingScreen = new BrowserWindow({
    width: 600,
    height: 400,
    frame: false,
    show: false,
  });

  loadingScreen.loadURL(indexSplash).then(() => {
    loadingScreen.setOpacity(0);
    loadingScreen.show();

    // fade in the splash screen
    fadeWindowIn(loadingScreen, 0.1, 30, () => {
      log.info("Fade in splash done");
      createMain(inDev, loadingScreen);
    });
  });
};

const createMain = (inDev, child) => {
  win = new BrowserWindow({
    ...(inDev && { icon: appIcon }),
    ...{
      title: "WatchIt",
      width: 1280,
      height: 800,
      minWidth: 1280,
      minHeight: 800,
      backgroundColor: "#12191f",
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
        preload: path.join(__dirname, "/core/preload.js"),
      },
    },
  });

  // and load the index.html of the app.
  win.loadURL(indexUrl).then(() => {
    if (child) {
      // fade out the splash screen
      fadeWindowOut(child, 0.1, 10, () => {
        log.info("Fade out splash done!");
        child.close();
        // isDarwin ? win.setSimpleFullScreen(true)
        //     : win.setFullScreen(true);
        // win.setOpacity(0);
        win.show();
      });
    }
  });

  // Open the DevTools.
  if (inDev) win.webContents.openDevTools({ mode: "detach" });
  // win.webContents.openDevTools()
  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null; // Win close
  });
};

/*******************
 * END FUNCTIONS
 *******************/

// Behaviour on second instance for parent process- Pretty much optional
if (isDarwin) mainMenu(Menu, app);
// https://www.electronjs.org/docs/tutorial/offscreen-rendering
// app.disableHardwareAcceleration()
app.setPath("crashDumps", path.join(appPath, "crashes"));
app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("window-all-closed", () => {
  if (!isDarwin) app.quit();
});

// On app ready open windows
// app.on('ready', async () => {})
app.whenReady().then(async () => {
  if (isWin || isDarwin) {
    // Temp validation while updater failing
    log.info("Check for updates");
    // await autoUpdater.checkForUpdates().catch(() => {
    //   log.warn("No updates available");
    // });
  }

  // Load the dist build or connect to webpack-dev-server
  initWindowing(inDev);
  registerMiddleware();

  // Initialize ipfs/helia node and assign underlying events.
  const helia = await import("./core/helia.mjs");
  const mainThread = await backend(ipcMain, helia);

  //
  app.on("will-quit", async (e) => {
    log.warn("Closing");
    await mainThread.stop();
    app.releaseSingleInstanceLock();
  });

  ipcMain.on("close", async () => app.quit());
  ipcMain.on("party", async () => {
    ipcMain.emit("party-success"); // Just after key being removed
    removeCacheDirs(); // Clean old data dir
  });

  ipcMain.on("focus", () => win.focus());
  ipcMain.on("minimize", (e) => {
    win.minimize();
  });

  ipcMain.on("maximize", (e) => {
    if (!isDarwin) win.setFullScreen(!win.isFullScreen());
    if (isDarwin) win.setSimpleFullScreen(!win.isSimpleFullScreen());
  });
});

// Disable cors errors
app.commandLine.appendSwitch("js-flags", "--max-old-space-size=512");
app.commandLine.appendSwitch("ignore-certificate-errors");
app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");

/*******************
 * END LISTENERS
 *******************/
