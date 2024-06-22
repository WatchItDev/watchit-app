import path from "path";
import "uint8arrays/concat";
import "uint8arrays/to-string";
import "it-all";
import { app, dialog, ipcMain, BrowserWindow, Menu } from "electron";
import { is, electronApp, optimizer } from "@electron-toolkit/utils";
import __cjs_url__ from "node:url";
import __cjs_path__ from "node:path";
import __cjs_mod__ from "node:module";
const __filename = __cjs_url__.fileURLToPath(import.meta.url);
const __dirname = __cjs_path__.dirname(__filename);
const require2 = __cjs_mod__.createRequire(import.meta.url);
const log = console;
const buildMenu = (menu, app2) => {
  return menu.buildFromTemplate([{
    label: "Application",
    submenu: [
      { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
      { type: "separator" },
      { label: "Quit", accelerator: "Command+Q", click: () => app2.quit() }
    ]
  }, {
    label: "Edit",
    submenu: [
      { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
      { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
      { type: "separator" },
      { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
      { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
      { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" }
    ]
  }]);
};
const mainMenu = (menu, app2) => {
  menu.setApplicationMenu(buildMenu(menu, app2));
};
const fadeWindowOut = (_window, step = 0.1, fadeEveryXSeconds = 10, cb = () => {
}) => {
  let opacity = _window ? _window.getOpacity() : 1;
  const interval = setInterval(() => {
    if (opacity <= 0) {
      clearInterval(interval);
      cb();
    }
    !_window.isDestroyed() && _window.setOpacity(opacity);
    opacity -= step;
  }, fadeEveryXSeconds);
  return interval;
};
const fadeWindowIn = (_window, step = 0.1, fadeEveryXSeconds = 10, cb = () => {
}) => {
  let opacity = _window ? _window.getOpacity() : 1;
  const interval = setInterval(() => {
    if (opacity >= 1) {
      clearInterval(interval);
      cb();
    }
    !_window.isDestroyed() && _window.setOpacity(opacity);
    opacity += step;
  }, fadeEveryXSeconds);
  return interval;
};
let win;
const ROOT_APP = process.cwd();
const ROOT_STORE = app.getPath("appData");
const isDarwin = Object.is(process.platform, "darwin");
const isWin = Object.is(process.platform, "win32");
const appIcon = path.join(ROOT_APP, "/src/render/media/icons/icon.png");
const appPath = is.dev ? ROOT_APP : ROOT_STORE;
process.env.appPath = appPath;
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) app.quit();
dialog.showErrorBox = (title, content) => {
  log.info(`${title}
${content}`);
};
const initWindowing = (devMode) => {
  const indexSplash = is.dev && process.env["ELECTRON_RENDERER_URL"] ? `${process.env["ELECTRON_RENDERER_URL"]}/splash.png` : `${path.join(__dirname, "../renderer/splash.png")}`;
  const loadingScreen = new BrowserWindow({
    width: 600,
    height: 400,
    frame: false,
    show: false
  });
  loadingScreen.loadURL(indexSplash).then(() => {
    loadingScreen.setOpacity(0);
    loadingScreen.show();
    fadeWindowIn(loadingScreen, 0.1, 30, () => {
      log.info("Fade in splash done");
      createMain(devMode, loadingScreen);
    });
  });
};
const createMain = (devMode, child) => {
  const indexUrl = is.dev && process.env["ELECTRON_RENDERER_URL"] ? process.env["ELECTRON_RENDERER_URL"] : `${path.join(__dirname, "../renderer/index.html")}`;
  win = new BrowserWindow({
    ...devMode && { icon: appIcon },
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
        preload: path.join(__dirname, "../preload/index.mjs")
      }
    }
  });
  win.loadURL(indexUrl).then(() => {
    if (child) {
      fadeWindowOut(child, 0.1, 10, () => {
        log.info("Fade out splash done!");
        child.close();
        win.show();
      });
    }
  });
  if (is.dev) win.webContents.openDevTools({ mode: "detach" });
  win.on("closed", () => {
    win = null;
  });
};
if (isDarwin) mainMenu(Menu, app);
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
app.whenReady().then(async () => {
  electronApp.setAppUserModelId("com.electron");
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });
  if (isWin || isDarwin) {
    log.info("Check for updates");
  }
  initWindowing(is.dev);
  app.on("will-quit", async (e) => {
    log.warn("Closing");
    await mainThread.stop();
    app.releaseSingleInstanceLock();
  });
  optimizer.registerFramelessWindowIpc();
  ipcMain.on("ping", () => console.log("pong"));
});
app.commandLine.appendSwitch("js-flags", "--max-old-space-size=512");
app.commandLine.appendSwitch("ignore-certificate-errors");
app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");
