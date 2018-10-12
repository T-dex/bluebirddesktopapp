const electron  =require('electron');
const path=require('path');
const url=require('url')
const isDev= require('electron-is-dev')
const {app, Tray}=electron;
const BrowserWindow= electron.BrowserWindow;
const Menu = electron.Menu

const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');




let mainWindow
app.on("ready",_=>{
mainWindow= new BrowserWindow({
    height:1500,
    width:1500
})
new Tray(path.join('public', 'trayImages/mainlogo.png'))
installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${REACT_DEVELOPER_TOOLS}`))
    .catch((err) => console.log('An error occurred: ', err));
mainWindow.loadURL(isDev? 'http://localhost:3000': `file://${path.join(__dirname, '../build/index.html')}`);
mainWindow.webContents.openDevTools();

const name=electron.app.getName();
const template=[
    {
    label:name,
    submenu:[{
    label:`About ${name}`,
    click:()=>{
        console.log("Shit was clicked!!!!")
    },
    role:'about'
    },{
        type:'separator'
    },
    {
        label:'Quit',
        click:()=>{app.quit()},
        accelerator:'Cmd+Q'
    }
]
}
]
const menu=Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
mainWindow.on('close',_=>{
    console.log("closed")
    mainWindow=null
})
})

app.on("window-all-closed",_=>{
    if(process.platform!=='darwin'){
        app.quit()
    }

})