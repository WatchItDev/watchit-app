const buildMenu = (menu, app) => {
    return menu.buildFromTemplate([{
        label: "Application",
        submenu: [
            {label: "About Application", selector: "orderFrontStandardAboutPanel:"},
            {type: "separator"},
            {label: "Quit", accelerator: "Command+Q", click: () => app.quit()}
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
    }])
}

const mainMenu = (menu, app) => {
    /***
     * Default menu for Mac
     */
    menu.setApplicationMenu(buildMenu(menu, app));
}

module.exports.mainMenu = mainMenu
module.exports.buildMenu = buildMenu