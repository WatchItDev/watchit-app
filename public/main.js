require('v8-compile-cache')
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const log = require('electron-log');

const {mainMenu} = require('./helpers/menu')
const {fadeWindowOut, fadeWindowIn} = require('./helpers/screen')

const {autoUpdater} = require('electron-updater');
const {
    app, BrowserWindow, ipcMain,
    protocol, Menu, dialog, session
} = require('electron');

const ROOT_APP = process.cwd();
const ROOT_STORE = app.getPath('appData');
const ENV = process.env.ENV || 'prod';
const inDev = Object.is(ENV, 'development');
let win, loadingScreen,
    isDarwin = Object.is(process.platform, 'darwin'),
    appIcon = path.join(ROOT_APP, '/src/media/icons/icon.png'),
    appPath = inDev ? ROOT_APP : ROOT_STORE,
    windowParams = {show: false};

// Dont move appPath from this line
process.env.appPath = appPath;
const {ROOT_TMP_FOLDER} = require(`${__dirname}/core/settings/`);
const {removeFiles} = require(`${__dirname}/core/utils`);
const key = require(`${__dirname}/core/key`);
const node = require(`${__dirname}/core`);

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) return app.quit();

// Override errors
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
dialog.showErrorBox = (title, content) => {
    log.info(`${title}\n${content}`);
};

/*******************
 * FUNCTIONS
 *******************/
const registerMiddleware = () => {
    //Register "file" protocol to use locally
    protocol.registerFileProtocol('file', (r, cb) => {
        let file = r.url.substr(7)
        let headers = {'Content-Type': mime.getType(file)}
        cb({path: file, headers: headers})
    })
}, removeCacheDirs = () => {
    //Auth.removeFromStorage('tmp')
    fs.readdirSync(appPath).filter(
        fn => fn.startsWith('w_alloc') || fn.startsWith('w_source')
    ).forEach(async (file) => {
        log.warn('Removing ' + file);
        await removeFiles(path.join(appPath, file))
    });
}, wipeInvalidSync = () => {
    key.removeFromStorage('peers')
    let cache = key.readFromStorage();
    if (cache && !('tmp' in cache)) {
        removeCacheDirs()
    }
}, wipeTmpSubs = () => {
    //Loop over files in dir
    fs.readdir(ROOT_TMP_FOLDER, async (err, files) => {
        if (!files || !files.length) return false;
        for (const file of files) {
            if (/(srt|vtt|zip)$/g.test(file)) {
                await removeFiles(path.join(ROOT_TMP_FOLDER, file));
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
            log.info("Fade in splash done");
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
                log.info("Fade out splash done!")
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
                    log.info("Fade in window done");
                });
            }, 1500)
        }
    });


    // Open the DevTools.
    if (inDev) win.webContents.openDevTools({ mode: 'detach' });
    //win.webContents.openDevTools()
    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null; // Win close
    });

}

/*******************
 * END FUNCTIONS
 *******************/

/*******************
 * LISTENERS
 *******************/
//Auto update setup
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
autoUpdater.autoDownload = false
autoUpdater.on('update-available', async () => {
    log.info('New Update');
    win.webContents.send('update_available');
    await autoUpdater.downloadUpdate().catch(() => {
        console.log('Download update failed');
    });
});

autoUpdater.on('error', () => log.error('Error trying update app'))
autoUpdater.on('update-downloaded', async () => {
    log.info('Update Downloaded');
    setImmediate(() => autoUpdater.quitAndInstall())
});
// End auto update setup

// Behaviour on second instance for parent process- Pretty much optional
if (isDarwin) mainMenu(Menu, app);
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

app.on('ready', () => {
    if (!key.existKey)
        removeCacheDirs();
})

// Disable cors errors
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=512')
app.commandLine.appendSwitch('ignore-certificate-errors');
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
app.whenReady().then(() => {

    // Load the dist build or connect to webpack-dev-server
    createLoadingScreen(inDev);
    createMain(inDev);
    registerMiddleware();

    const orbitProcess = node(ipcMain);
    app.on('will-quit', async (e) => {
        log.warn('Closing');
        await orbitProcess.close(win)
        app.releaseSingleInstanceLock()

        if (!orbitProcess.closed()) {
            // Force loop quit if orbit fail closing!!
            log.warn('Quiting');
            e.preventDefault() && app.quit();
        }
    })

    ipcMain.on('close', async () => app.quit())
    ipcMain.on('party', async () => {
        if (key.existKey)
            await removeFiles(key.keyFile)
        removeCacheDirs();
    })

    ipcMain.on('focus', () => win.focus())
    ipcMain.on('minimize', (e) => {
        win.minimize();
    })

    ipcMain.on('maximize', (e) => {
        let bounds = win.getNormalBounds();
        let {width} = win.getBounds();

        !isDarwin
                ? win.setFullScreen(!win.isFullScreen())
                : win.setSimpleFullScreen(!win.isSimpleFullScreen());

        if (isDarwin && !win.isSimpleFullScreen())
            win.setBounds(Object.assign(bounds,{width}));

    })

    ipcMain.on('check_update', async () => {
        if (inDev) return;
        log.info('Check for update');
        await autoUpdater.checkForUpdates().catch(() => {
            log.warn('No updates available');
        })
    });

})

/*******************
 * END LISTENERS
 *******************/
