// declare imports
const express = require('express');
const fs=require('fs');
const multer=require('multer');
const { TesseractWorker }=require('tesseract.js');
const path=require('path');
const sharp=require('sharp');


// set global constants
const PORT = process.env.PORT || 5000;
const app=express();
const worker = new TesseractWorker();


// Storage
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './views/css')
    },

    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});




let fileName='';
let filePath;

    // fill multer storage with uploaded file
const upload = multer({storage: storage});

// implement front end
app.set('view engine', 'ejs');

// routes
app.get('/', (req, res) => {
    res.render('index');
});


    // redirects
app.get('/preview', (req, res) => {
    res.redirect('/');
});

app.get('/upload', (req, res) => {
    res.redirect('/');
});


    // what happens after form gets submitted
app.post('/preview', (req, res) => {
    upload.single("userPicture")(req, res, err => {
        //configure sharp to resize image
        let targetWidth=0;
        let targetHeight=0;

        //get meta data and resize image
        async function resizeImageAsync() { 
            let promise = new Promise((resolve, reject) => {
                let filePath=req.file.path;
                let image = sharp(req.file.path);
                image
                    .metadata()
                    .then(data => {
                        if(data.width > 1000 || data.heigth > 1000) {
                            targetWidth=Math.floor(data.width/5);
                            targetHeight=Math.floor(data.height/5);
                        }
                        else {
                            targetWidth=data.width;
                            targetHeight=data.height;
                        }
    
                        return image 
                            .resize(targetWidth,targetHeight)
                            .toFile(`./views/css/thumb_${req.file.originalname}`, (err, data) => {
                                if(err) {
                                    console.log(err)
                                }
                                else {
                                    resolve('sharp applied');
                                }
                            });
                    });
            });
            await promise;
        }
        
        //read in thumb
        resizeImageAsync().then(() => {
            fs.readFile(`./views/css/thumb_${req.file.originalname}`, (err, data) => {
                if(err) {
                    return console.log('Error occurred: '+err);
                }
                else {
                    fileName=req.file.originalname;
    
                    res.render('imgPreview', {
                        imgName: req.file.originalname,
                    });
                }
            });
        });
    });
});

        
app.post('/upload', (req, res) => {
    upload.single('rotationToRight')(req, res, err => {  
        let rotation=+req.body.rotationToRight; //get desired rotation from frontend form
        
        async function rotateImageAsync() { 
            let promise = new Promise((resolve, reject) => {
                sharp(`./views/css/thumb_${fileName}`)
                    .rotate(rotation)
                    .toFile(`./views/css/thumb_rotate_${fileName}`, (err, data) => {
                        if(err) {
                            console.log(err)
                        }
                        else {
                            resolve('sharp applied');
                        }
                    });
                });
            await promise;
        }


        rotateImageAsync().then(() => {
            fs.readFile(`./views/css/thumb_rotate_${fileName}`, (err, data) => {
                if(err) {
                    return console.log('Error occurred: '+err);
                }
                else {
                    worker
                    .recognize(data, 'eng', {})     // arguments: dataInformation, Language, Object (more specification, example for pdf output: "tessjs_create_pdf: '1',")
                    .progress(progress => {
                        res.status(200);
                        console.log(progress);
                    })
                    .then(result => {
                        res.render('uploaded', {
                            result: escape(result.text),
                        });
                    })
                    .finally(()=>{
                        worker.terminate();
                    });
                }
            });
        })
        .then(() => {
            fs.unlink(`./views/css/${fileName}`, err => {    //delete file after completion
                if(err) {
                    return console.log('Error occurred: '+err);
                }
            });
            fs.unlink(`./views/css/thumb_${fileName}`, err => {    //delete thumb after completion
                if(err) {
                    return console.log('Error occurred: '+err);
                }
            });
            fs.unlink(`./views/css/thumb_rotate_${fileName}`, err => {    //delete thumb after completion
                if(err) {
                    return console.log('Error occurred: '+err);
                }
            });
        });
    });
});


//create front-end
app.use(express.static(path.join(__dirname, 'views')));

//Start up server
app.listen(PORT, () => {
    console.log('server running on port ' + PORT);
});