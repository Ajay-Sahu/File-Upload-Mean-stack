const express = require('express');
const router = express.Router();
const fileUploadController = require('./fileUploadController')


router.post('/uploadFile', fileUploadController.uploadFile)



module.exports = router