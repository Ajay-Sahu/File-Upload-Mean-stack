const filesModel = require('./fileUploadModel');
const upload = require('../../service/upload');
let fileUploadController = {}






fileUploadController.uploadFile = (req, res) => {
  // console.log('Inside uploadFile ')
  upload.uploadfileFromMulter(req, res, (err, data) => {
    if (err) return res.status(400).send({ msg: err });

    // console.log('Data: ', data)

  })


  res.send({ status: 'File Uploaded' });

}

module.exports = fileUploadController;