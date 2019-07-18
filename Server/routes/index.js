var express = require('express');
var router = express.Router();
const files = require('../src/components/fileUpload/fileUploadRoutes')



module.exports = (app) => {
  //Test node 
  app.get('/', (req, res) => { res.status(200).json({ Message: "Welcome to File Upload Server project !", }) }),

  app.use('/files', files)
};
