const electron =require('electron');
const path=require('path');
const app=electron.app;
const BrowserWindow= electron.BrowserWindow;
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');




let mainWindow
app.on("ready",_=>{
mainWindow= new BrowserWindow({
    height:1500,
    width:1500
})
installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${REACT_DEVELOPER_TOOLS}`))
    .catch((err) => console.log('An error occurred: ', err));
mainWindow.loadURL('http://localhost:3000');
mainWindow.webContents.openDevTools();
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