const multer = require("multer");

//filter for pdf

const pdfFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("application/pdf")) {
    cb(null, true);
  } else {
    cb("Please upload only pdf.", false);
  }
};

//storage for pdf

var pdfStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'./resources/pdfs');
        }
    ,
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
        }
    ,
});

uploadPdf = multer({ storage: pdfStorage, fileFilter: pdfFilter });

module.exports = {
    uploadPdf
}