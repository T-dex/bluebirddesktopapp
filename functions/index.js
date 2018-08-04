const functions = require('firebase-functions');

const os= require('os');
const path= require('path');
const spawn = require('child-process-promise').spawn;
const cors= require('cors')({ origin: 'true' });
const Busboy= require('busboy');
const fs = require('fs')

const gcconfig={
    projectId:"bluebirdheli-dd1f5",
    keyFilename:"bluebirdheli-dd1f5-firebase-adminsdk-p4eoa-969b971336.json"
};
const gcs =require('@google-cloud/storage')(gcconfig);
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
    if(object.resourceState ==='not_exists'){
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


 exports.uploadFile = functions.https.onRequest((req, res)=>{
     cors(req,res,()=>{
         if(req.method!=="POST"){
             return res.status(500).json({
                 message:"Today is in Your way"
             });
         }
         const busboy = new Busboy({ headers: req.headers });
         let uploadData = null;

         busboy.on("file", (fieldname, file, filename, encoding ,mimetype)=>{
            const filepath= path.join(os.tmpdir(), filename);
            uploadData={ file: filepath, type: mimetype };
            file.pipe(fs.createWriteStream(filepath));
         });

         busboy.on("finish", ()=>{
             const bucket = gcs.bucket("bluebirdheli-dd1f5.appspot.com");
             bucket.upload(uploadData.file , {
                    uploadType:"media",
                    metadata:{
                        metadata:{
                            contentType: uploadData.type
                        }
                    }
                })
                .then(()=>{
                    return res.status(200).json({message:"holy Shit batman, it worked!"})})
                .catch(err=>{
                    res.status(500).json({
                        error:err,
                        message:"jesus why won't this play nice",
                        uploadData:uploadData
                    });
                });
         });
         busboy.end(req.rawBody);
     });
 }) ;
