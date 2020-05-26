const path = require('path');
const os = require('os');
const {app, BrowserWindow, Menu, ipcMain, shell} = require('electron');
const imagemin = require('imagemin');
const imageminMozjpep = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const slash = require('slash');
const log = require('electron-log');

//set environment
process.env.NODE_ENV = 'production';

const isDev = process.env.NODE_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;

let mainWindow;
let aboutWindow;

// create a new window
function createMainWindow (){
    mainWindow = new BrowserWindow({
        title: 'ImageShrink',
        width: isDev ? 800 : 500,
        height: 600,
        icon: `${__dirname}/assets/icons/Icon_256x256.png`,
        resizable: isDev ? true : false,
        backgroundColor: 'white',
        webPreferences: {
            nodeIntegration: true
        },
    });

    if(isDev){
        mainWindow.webContents.openDevTools();
    }

    // you can load a url like google or a file to a local directory
    // get path using __dirname

    // mainWindow.loadURL(`file://${__dirname}/app/index.html`);
    // OR
    mainWindow.loadFile('./app/index.html');
}

function createAboutWindow (){
    aboutWindow = new BrowserWindow({
        title: 'About Image Shrink',
        width: 300,
        height: 300,
        icon: `${__dirname}/assets/icons/Icon_256x256.png`,
        resizable: isDev ? true : false,
        backgroundColor: 'white'
    });

    aboutWindow.loadFile('./app/about.html');
}

// create the window using the ready event
app.on('ready', () => {
    createMainWindow();

    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    // register shortcuts

    // globalShortcut.register('CmdOrCtrl+R', () => mainWindow.reload())
    // globalShortcut.register(isMac ? 'Command+Alt+I' : 'Ctrl+Shift+I', () => mainWindow.toggleDevTools())

    mainWindow.on('ready', () => mainWindow = null);
});

// menu template
const menu = [
    ...(isMac ? [
        {
            label: app.name,
            submenu: [
                {
                    label: 'About',
                    click: createAboutWindow
                }
            ]
        }
    ] : []),
    ...(!isMac ? [
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About',
                    click: createAboutWindow
                }
            ]
        }
    ] : []),
    ...(isDev ? [
        {
            label: 'Developer',
            submenu: [
                {role: 'reload'},
                {role: 'forceReload'},
                {type: 'separator'},
                {role: 'toggledevtools'}
            ]
        }
    ] : [])
];

ipcMain.on('image:minimize', (e, values) => {
    values.dest = path.join(`${os.homedir()}/Desktop/`, 'imageshrink');
    shrinkImage(values)
});

async function shrinkImage({imgPath, quality, dest}){
    try {
        const pngQuality = quality / 100;

        const files = await imagemin([slash(imgPath)], {
            destination: dest,
            plugins: [
                imageminMozjpep({quality}),
                imageminPngquant({
                    quality: [pngQuality, pngQuality]
                })
            ]
        });
        log.info(files);

        // open up the folder destination using the shell
        shell.openPath(dest);

        // send event from the main process back to the renderer
        mainWindow.webContents.send('image:done')

    } catch (error) {
        console.error(error);
        log.error(error);
    }
}

app.on('window-all-closed', () => {
    if(isMac){
        app.quit();
    }
});

app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0){
        createMainWindow();
    }
})