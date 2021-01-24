const fs = require('fs');
const path = require('path');
const mime = require('mime');
const rimarf = require('rimraf');
const log = require('electron-log');
const {
    autoUpdater
} = require('electron-updater');
const {
    app, BrowserWindow, ipcMain,
    protocol, Menu, dialog
} = require('electron');
const ROOT_APP = process.cwd();
const ROOT_STORE = app.getPath('appData');
const ENV = process.env.ENV || 'prod';
const inDev = Object.is(ENV, 'dev');
let win, loadingScreen,
    isDarwin = Object.is(process.platform, 'darwin'),
    appIcon = path.join(ROOT_APP, '/src/media/icons/icon.png'),
    appPath = inDev ? ROOT_APP : ROOT_STORE,
    windowParams = {show: false};

// Dont move appPath from this line
process.env.appPath = appPath;
const {ROOT_TMP_FOLDER} = require(__dirname + '/lib/settings/conf');
const Orbit = require(__dirname + '/lib/orbit');
const Auth = require(__dirname + '/lib/auth');
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) return app.quit();

// Initialize path
// crashReporter.start({
// 	productName: 'WatchIt',
// 	companyName: 'ZorrillosDev',
// 	ignoreSystemCrashHandler: true,
// 	submitURL: 'https://o122489.ingest.sentry.io/api/5262067/minidump/?sentry_key=f5c2bd81a0fb490cbf4d48dacb5308e5',
// });

// Override errors
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
dialog.showErrorBox = (title, content) => {
    console.log(`${title}\n${content}`);
};

const removeFiles = (dirOrFIle, options) => {
    rimarf(dirOrFIle, {
        ...{
            disableGlob: true,
            maxBusyTries: 20,
            emfileWait: 10 * 1000
        }, ...options
    }, () => {
        console.log('Delete file ' + dirOrFIle);
    });
}, removeCacheDirs = () => {
    //Auth.removeFromStorage('tmp')
    fs.readdirSync(appPath).filter(
        fn => fn.startsWith('w_alloc') || fn.startsWith('w_source')
    ).forEach((file) => {
        console.log('Removing ' + file);
        removeFiles(path.join(appPath, file))
    });
}, wipeInvalidSync = () => {
    Auth.removeFromStorage('peers')
    let cache = Auth.readFromStorage();
    if (cache && !('tmp' in cache)) {
        removeCacheDirs()
    }
}, wipeTmpSubs = () => {
    //Loop over files in dir
    fs.readdir(ROOT_TMP_FOLDER, (err, files) => {
        if (!files || !files.length) return false;
        for (const file of files) {
            if (/(srt|vtt|zip)$/g.test(file)) {
                removeFiles(path.join(ROOT_TMP_FOLDER, file));
            }
        }
    })
}, createLoadingScreen = (inDev) => {
    const indexUrl = inDev ? 'http://localhost:3000/loading.html'
        : 'file://' + path.join(__dirname, '../build/loading.html')

    loadingScreen = new BrowserWindow({
        ...windowParams, ...{
            width: 600, height: 400,
            parent: win, frame: false,
        }
    });

    loadingScreen.loadURL(indexUrl);
    loadingScreen.on('closed', () => loadingScreen = null);
    loadingScreen.webContents.on('did-finish-load', () => {
        loadingScreen.setOpacity(0);
        loadingScreen.show();

        // fade in the splash screen
        fadeWindowIn(loadingScreen, 0.1, 30, () => {
            console.log("fade in splash done");
        });
    });
}, createMain = (inDev) => {
    win = new BrowserWindow({
        ...windowParams,
        ...inDev && {icon: appIcon},
        ...{
            title: 'WatchIt',
            width: 1920, height: 1080,
            minWidth: 1280, minHeight: 800,
            backgroundColor: '#12191f',
            center: true, frame: false,
            transparent: false,
            webPreferences: {
                spellCheck: false,
                enableRemoteModule: false,
                nodeIntegration: true,
                webSecurity: false,
                preload: __dirname + '/preload.js'
            }
        }
    });

    const indexUrl = inDev ? 'http://localhost:3000/'
        : 'file://' + path.join(__dirname, '../build/index.html');

    // and load the index.html of the app.
    win.loadURL(indexUrl);
    win.once('ready-to-show', async () => {
        if (loadingScreen) {
            let loadingScreenBounds = loadingScreen.getBounds();
            win.setBounds(loadingScreenBounds);

            //fade out the splash screen
            fadeWindowOut(loadingScreen, 0.1, 10, () => {
                console.log("fade out splash done!")
                loadingScreen.close();
            });

            isDarwin ? win.setSimpleFullScreen(true)
                : win.setFullScreen(true);
            win.setOpacity(0);
            win.show();

            // a time put for let the app load on the screen
            setTimeout(() => {
                // make a fade in once passed the time
                fadeWindowIn(win, 0.1, 30, () => {
                    console.log("fade in window done");
                });
            }, 1500)
        }
    });


    // Open the DevTools.
    if (inDev) win.webContents.openDevTools();
    //win.webContents.openDevTools()
    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null; // Win close
    });

}, fadeWindowOut = (
    _window,
    step = 0.1,
    fadeEveryXSeconds = 10,
    cb = () => {
    }
) => {
    let opacity = _window ? _window.getOpacity() : 1;
    let interval = setInterval(() => {
        if (opacity <= 0) {
            clearInterval(interval);
            cb();
        }
        !_window.isDestroyed() &&
        _window.setOpacity(opacity);
        opacity -= step;
    }, fadeEveryXSeconds);
    return interval;
}, fadeWindowIn = (
    _window,
    step = 0.1,
    fadeEveryXSeconds = 10,
    cb = () => {
    }
) => {
    let opacity = _window ? _window.getOpacity() : 1;
    let interval = setInterval(() => {
        if (opacity >= 1) {
            clearInterval(interval);
            cb();
        }
        !_window.isDestroyed() &&
        _window.setOpacity(opacity);
        opacity += step;
    }, fadeEveryXSeconds);
    return interval;
}

//Auto update setup
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
autoUpdater.autoDownload = false
autoUpdater.on('update-available', async () => {
    console.log('New Update');
    win.webContents.send('update_available');
    await autoUpdater.downloadUpdate().catch(() => {
        console.log('Download update failed');
    });
});

autoUpdater.on('error', () => console.log('Error trying update app'))
autoUpdater.on('update-downloaded', async () => {
    console.log('Update Downloaded');
    setImmediate(() => autoUpdater.quitAndInstall())
});
// End auto update setup

// Behaviour on second instance for parent process- Pretty much optional
if (isDarwin) Menu.setApplicationMenu(
    Menu.buildFromTemplate([{
        label: "Application",
        submenu: [
            {label: "About Application", selector: "orderFrontStandardAboutPanel:"},
            {type: "separator"},
            {
                label: "Quit", accelerator: "Command+Q", click: () => {
                    app.quit();
                }
            }
        ]
    }, {
        label: "Edit",
        submenu: [
            {label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:"},
            {label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:"},
            {type: "separator"},
            {label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:"},
            {label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:"},
            {label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:"}
        ]
    }
    ])
);

//app.disableHardwareAcceleration();
app.setPath('crashDumps', path.join(appPath, 'crashes'));
app.on('second-instance', () => {
    if (win) {
        if (win.isMinimized()) win.restore();
        win.focus()
    }
});

app.on('window-all-closed', () => {
    if (!isDarwin) app.quit();
});

app.on('before-quit', () => {
    wipeTmpSubs();
    wipeInvalidSync();
})

app.on('will-quit', () => {
    console.log('Will quit');
    app.releaseSingleInstanceLock()
    ipcMain.emit('orbit-close')
})

app.on('ready', () => {
    if (!Auth.existKey)
        removeCacheDirs();
})

// Disable cors errors
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=512')
app.commandLine.appendSwitch('ignore-certificate-errors');
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
app.whenReady().then(() => {
    global.isElectron = true

    //Register
    protocol.registerFileProtocol('file', (r, cb) => {
        let file = r.url.substr(7)
        let headers = {'Content-Type': mime.getType(file)}
        cb({path: file, headers: headers})
    })

    // Load the dist build or connect to webpack-dev-server
    createLoadingScreen(inDev);
    createMain(inDev);

    //Main tools
    Orbit(ipcMain);

    // Window event
    ipcMain.on('rmrf', (dir) => {
        removeFiles(dir)
    })

    ipcMain.on('close', () => app.quit())
    ipcMain.on('party', () => {
        if (Auth.existKey) removeFiles(Auth.keyFile)
        removeCacheDirs();
    })

    ipcMain.on('focus', () => win.focus())
    ipcMain.on('minimize', (e) => {
        win.minimize();
    })

    ipcMain.on('maximize', (e) => {
        if (!isDarwin) win.setFullScreen(!win.isFullScreen());
        if (isDarwin) win.setSimpleFullScreen(!win.isSimpleFullScreen());
    })

    ipcMain.on('check_update', async () => {
        if (inDev) return;
        console.log('Check for update');
        await autoUpdater.checkForUpdates().catch(() => {
            console.log('No updates available');
        })
    });

})
