require('electron-reload')(__dirname)
const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')
const url = require('url')
const shell = require('electron').shell
const ipc = require('electron').ipcMain


//Keep a global reference of the window object, if you don't, the window will be closed automatically
//when the javascript object is garabage collected
let win

function createWindow(){
    //create the browser window
    win = new BrowserWindow({
        width: 800, 
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        }
    })

    //and load the index.html of the app
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'src/index.html'),
        protocol: 'file',
        slashes: true
    }))

    //For Development Only, open the DevTools
    //win.webContents.openDevTools()


    //Send when the window is closed
    win.on('closed', () => {
        //Dereference the window object, usually you owuld store windows in an array if your app supports 
        //multi-windows, this is the time when you should delete the corresponding element
        win = null
    })

    var menu = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                {label: 'Load'},
                {label: 'Save'},
            ],
        },
        {
            label: 'User Preferences',
            submenu: [
                {label: 'Edit Metrics'},
                {type: 'separator'},
        
                {label: 'Edit Fuel & Materials'},  
            ],
        },
        {
            label: 'Info',
            submenu: [
                {label: 'Documentation'},
                {type: 'separator'},
        
                {
                    label: 'Assumptions',
                    click() {
                        shell.openExternal('https://www.google.com')
                    }
                },
                {label: 'About this software'}
            ],
        },
        {
            label: 'Exit',
            click(){
                app.quit()
            }
        }
    ])

    Menu.setApplicationMenu(menu);
}

//This method will be called when Electron has finished initalization and is ready to create browser windows.
//Some APIs can only be used after this event occurs
app.on('ready', createWindow)


//Quit when all windows are closed
app.on('window-all-closed', () => {
    //on macOS it is common for applications and their menu bar to stay active until the user quits explicitly 
    //with Cmd + Q
    if(process.platform !== 'darwin'){
        app.quit()
    }
})

app.on('activate', () => {
    //On macOS it's common to re-create a window in the app when the dock icon is clicked and there is no other
    //windows open
    if(win == null){
        createWindow()
    }
})

//catches message from add.html, and send it back to the index.html
ipc.on('update-notify-value', function(event, arg) {
    win.webContents.send('targetPriceVal', arg)
})