const setupEvents = require('./installers/setupEvents')
if (setupEvents.handleSquirrelEvent()) {
    return;
}

const { app, BrowserWindow, ipcMain } = require('electron')
const notifier = require('node-notifier')
const isDev = require('electron-is-dev')
let mainWindow

function createWindow() {

    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        frame: false
    })

    mainWindow.loadURL(
       `file://${__dirname}/dist/client/index.html`,
    )

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

ipcMain.on('show-notification', (event, username) => {
    notifier.notify({ 
        title: 'New Message', 
        message: `${username} sent you a message`, 
        wait: true 
    })
    notifier.on('click', (notifierObject, options) => {
        mainWindow.show()
    })
})

ipcMain.on('close-window', event => {
    mainWindow.close()
})

ipcMain.on('minimize-window', event => {
    mainWindow.minimize()
})

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
})
