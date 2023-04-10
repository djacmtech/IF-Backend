const multer = require("multer");

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

var pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,'./resources/pdfs');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

uploadImage = multer({ storage: pdfStorage, fileFilter: imageFilter });

module.exports = uploadImage;