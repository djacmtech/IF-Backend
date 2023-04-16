//get multer middleware for pdf upload and destructure it
const { uploadPdf } = require("../middleware/upload.pdf.js");
//get multer middleware for image upload and destructure it
const { imageUpload } = require("../middleware/upload.image");

module.exports = (app) => {
  const user = require("../controllers/user_controller");
  const job = require("../controllers/job_controller");
  const cart = require("../controllers/cart_controller");

  const router = require("express").Router();

  router.post("/register", uploadPdf.single("resume"), user.register);
  router.post("/login", user.login);
  router.get("/get-users", user.findAll);
  router.get("/get-user/:id", user.findOne);

  router.post("/add-job", job.create);
  router.get("/get-jobs", job.findAll);
  router.get("/get-job/:id", job.findOne);

  router.post("/add-to-cart", cart.addTocart);
  router.get("/get-cart", cart.getCart);

  app.use("/api/acm-if", router);
};
