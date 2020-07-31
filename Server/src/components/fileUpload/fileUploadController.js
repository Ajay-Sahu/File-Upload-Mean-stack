const filesModel = require('./fileUploadModel');
const upload = require('../../service/upload');
const xlstojson = require("xls-to-json");
const xlsxtojson = require("xlsx-to-json");
const async = require('async');
let fileUploadController = {}


fileUploadController.uploadFile = (req, res) => {
  console.log('Inside uploadFile ')
  let exceltojson
  upload.uploadfileFromMulter(req, res, (err, data) => {
    if (err) return res.status(400).send({ msg: err });
    if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
      console.log("xlsx: ")
      exceltojson = xlsxtojson;
    } else {
      exceltojson = xlstojson;
    }

    try {
      console.log("File Path: ", req.file.path);
      exceltojson({
        input: req.file.path,
        output: null, //since we don't need output.json
        lowerCaseHeaders: true
      }, function (err, result) {
        if (err) {
          res.status(400).json({ msg: "Server Error Found ", err: err });
        }
        else {
          let processArr = [{ name: 'PRCD', value: 'PR Creation Date', step: 1 }, { name: 'PRRD', value: 'PR Release Date', step: 2 },
          { name: 'POCD', value: 'PO Creation Date', step: 3 }, { name: 'POFRDT', value: 'PO Final Rel DT', step: 4 },
          { name: 'ASNCD', value: 'ASN creation date', step: 5 }, { name: 'MRRD', value: 'MRR_DATE', step: 6 },
          { name: 'GRND', value: 'GRN Date', step: 7 }, { name: 'UDD', value: 'UD Date', step: 8 }]

          // console.log("File Data: ", result[0])
          let finalData = [], count = 0
          async.eachSeries(result, (data, callback) => {
            count = count + 1
            console.log("Data: ", data)
            let averageTime = "00:0:0"

            processArr.forEach((process, ind) => {
              console.log("process.step: ", process.step)

              if (process.step == processArr[0].step || data[process.name] == '0' || data[processArr[ind].name] == '0') {
                averageTime = "00:0:0"
              } else {
                ind = ind - 1
                console.log("Diff: ", data[processArr[ind].name], " -- ", data[process.name])
                averageTime = getTimeDiff(data[processArr[ind].name], data[process.name])
          
              }
              console.log("averageTime: ", averageTime)

              finalData.push({
                id: count,
                PRNO: data.PRN,
                PRItem: data.PRI,
                processName: process.value,
                step: process.step,
                processingDate: data[process.name],
                averageTime: averageTime
              })
            });

            console.log("finalData: ", finalData)
            setImmediate(callback)

          }, (err) => {
            if (err) {
              console.log("err", err);
              return res.status(400).json({ msg: "Invalid Data", 'err': 'not uploaded file' });
            }
            else {
              console.log("Final exits");
              // res.status(200).json({ 'message': 'Successfully uploaded', finalData: finalData });
              res.status(200).json(finalData);
            }
          })
        }
      })
    }
    catch (e) { res.json({ error_code: 1, err_desc: "Corupted excel file" }); }

  })

}


function getTimeDiff(fd, sd) {
  let firstDate = new Date(fd), secondDate = new Date(sd), s = Math.abs(secondDate.getTime() - firstDate.getTime());
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;
  return hrs + ':' + mins + ':' + secs;
}

module.exports = fileUploadController;