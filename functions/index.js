const functions = require('firebase-functions');
const gcs =require('@google-cloud/storage')();
const os= require('os');
const path= require('path');
const spawn = require('child-process-promise').spawn
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.onFileChange = functions.storage.object().onFinalize(event => {
    const object= event;
    console.log(object, event);
    const bucket= object.bucket;
    const contentType= object.contentType;
    const filePath= object.name;
    console.log('File change detected, function execution started');
    if(object.resourceState==='not_exists'){
        console.log('File deleted');
        return;
    }
    if(path.basename(filePath).startsWith('resized-')){
        console.log("already there")
        return;
    }
    const distBucket=gcs.bucket(bucket);
    const tempPath=path.join(os.tmpdir(), path.basename(filePath));
    const metadata={ contentType:contentType };
    return distBucket.file(filePath).download({
        destination:tempPath
    }).then(()=>{
        return spawn('convert', [tempPath,'-resize','500x500',tempPath]).then(()=>{
            return distBucket.upload(tempPath,{
                destination:'resized-' +path.basename(filePath),
                metadata:metadata
            })
        })
        
    
    })
});


 