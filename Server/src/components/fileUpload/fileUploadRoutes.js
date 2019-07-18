const express = require('express');
const router = express.Router();
const fileUploadController = require('./fileUploadController')

router.get('/test', fileUploadController.test)

router.post('/uploadFile', fileUploadController.uploadFile)



module.exports = router