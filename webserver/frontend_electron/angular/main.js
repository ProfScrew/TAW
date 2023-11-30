const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

let mainWindow

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800, height: 600,
        webPreferences: { nodeIntegration: true, contextIsolation: false }
    })


mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/dist/angular/index.html'),
    protocol: 'file:',
    slashes: true
}))

mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()
})
