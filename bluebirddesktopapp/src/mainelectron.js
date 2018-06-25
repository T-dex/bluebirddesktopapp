const electron =require('electron');
const path=require('path');
const app=electron.app;
const BrowserWindow= electron.BrowserWindow;


let mainWindow
app.on("ready",_=>{
mainWindow= new BrowserWindow({
    height:500,
    width:500
})
mainWindow.loadURL('http://localhost:3000');
mainWindow.webContents.openDevTools();
mainWindow.on('close',_=>
    mainWindow=null
)
})
app.on("window-all-closed",_=>{
    if(process.platform!=='darwin'){
        app.quit()
    }

})