const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let fileUploadSchema = new Schema({

  fileName: { type: String, default: "" },
  filePath: { type: String, default: "" },
  


},
  {
    timestamps: { createdAt: 'createdAt', lastUpdated: 'lastUpdated' }
  })

module.exports = mongoose.model('files', fileUploadSchema)