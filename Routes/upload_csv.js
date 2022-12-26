const express = require("express");
const fs = require("fs");
const { Worker } = require("worker_threads");
const { AuthenticateToken } = require("../Middlewares/AuthenticateToken");
const router = express.Router();
const contact = require("../Modals/contacts");
const { Error, Success } = require("../Modules/Response");

const { RemoveFile } = require("../Modules/tool");
const contacts = require("../Modals/contacts");

router.post("/", AuthenticateToken, async (req, res) => {
  try {
    const file = req.files?.csv;

    if (!file || (file && file.name.search(".csv") == -1)) {
      RemoveFile(file.tempFilePath);
      return Error(res, "Only CSV is Accepted", 422);
    }

    fs.renameSync(file.tempFilePath, file.tempFilePath + ".csv");
    var filename = file.tempFilePath.split("/");
    filename = filename[filename.length - 1];
    const path = "./tmp/" + filename + ".csv";

    // WORKER SERVICE
    const ReadCSV_Service_Worker = new Worker("./Workers/ReadCSV.js");

    ReadCSV_Service_Worker.postMessage(path);

    ReadCSV_Service_Worker.on("message", (data) => {
      console.log(data);
      if (data?.status !== 200)
        return Error(res, data?.message, data?.status, data?.data);

      const contactdata = data?.data?.map((x) => new contacts(x));

      contacts
        .bulkSave(contactdata)
        .then(() => {
          RemoveFile(path);
          return Success(res, "CSV Data saved Successfully", data?.data);
        })
        .catch((err) => {
          console.log(err);
          RemoveFile(path);
          return Error(res, "Something went wrong", undefined, err);
        });
    });
  } catch (err) {
    console.log(err);
    RemoveFile(path);
    return Error(res, undefined, undefined, err);
  }
});

module.exports = router;
