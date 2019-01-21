const { app, BrowserWindow, ipcMain } = require('electron')
const isDev = require('electron-is-dev')
let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        frame: false
    })

    mainWindow.loadURL(
        isDev
            ? 'http://localhost:4200'
            : `file://${__dirname}/dist/YouTubeStats-app/index.html`,
    )

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

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
