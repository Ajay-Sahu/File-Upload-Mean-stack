const multer = require('multer')
const fs = require('fs')
// var zlib = require('zlib');
var dir = './uploads';
var fileUploadUrl = "http://localhost:4000/files/";

let uploadController = {}


if (!fs.existsSync(dir))
  fs.mkdirSync(dir);

// Destination and file name 
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    // console.log("Inside diskStorage ");
    console.log("file data: "); console.log(file);

    file.originalFileName = file.originalname;
    var dir = './uploads/files';
    if (!fs.existsSync(dir))
      fs.mkdirSync(dir);

    callback(null, './uploads/files/');
  },
  filename: function (req, file, callback) {

    if (file.originalname.indexOf("?") !== -1) {
      var array = file.originalname.split("?", 2);
      file.originalname = array[0];
    }
    console.log(file.originalname)
    var im = file.originalname.split('.')
    var ran = Math.floor((Math.random() * 100) + 1);
    callback(null, ran + Date.now() + '.' + im[im.length - 1]);

  },
});
var upload = multer({ storage: storage }).single('file');




uploadController.uploadImage = (req, res, callback) => {
  // console.log("Inside uploadImage ");
  upload(req, res, function (err) {
    if (err) return res.end("Error uploading file.", err);

    console.log("uploadImage Req  ")
    console.log(req.file)
    callback(null, req.file)
  })
}



// Uploading Files from multer
// -----------------------------
uploadController.uploadfileFromMulter = (req, res, callback) => {
  uploadController.uploadImage(req, res, (err, data) => {
    var fileBuffer = fs.createReadStream(req.file.path);
    console.log('fileBuffer:'); 

    var input = new Buffer(fileBuffer)
    console.log(input)
    
    var compressed = zlib.deflate(input);
    console.log('Compresssed...')
    console.log(compressed)

    var dir2 = './uploads/files2/' + req.file.filename;
    // if (!fs.existsSync(dir2))
    //   fs.mkdirSync(dir2);

    fs.writeFile(dir2, compressed, function (err) {
      if (err) throw err;
      console.log('compressed file added in files2...');
    });




    var output = zlib.inflate(compressed);
    console.log(output)

    var s3Res = {
      Location: fileUploadUrl + req.file.filename,
      key: req.file.filename,
      Key: req.file.filename,
      Bucket: 'dealmoney'
    }

    callback(err, s3Res)
  })
}


module.exports = uploadController;
