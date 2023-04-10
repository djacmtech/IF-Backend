const multer = require("multer");

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

var imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,'./resources/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

uploadImage = multer({ storage: imageStorage, fileFilter: imageFilter });

module.exports = uploadImage;