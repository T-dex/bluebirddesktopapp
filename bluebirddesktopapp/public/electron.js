const electron  =require('electron');
const path=require('path');
const url=require('url')
const {app, Tray}=electron;
const BrowserWindow= electron.BrowserWindow;
const Menu = electron.Menu
const isDev = require("electron-is-dev");





let mainWindow
app.on("ready",_=>{
mainWindow= new BrowserWindow({
    height:1500,
    width:1500
});
mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

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