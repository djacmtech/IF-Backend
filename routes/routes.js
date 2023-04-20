//get multer middleware for pdf upload and destructure it
const { uploadPdf } = require("../middleware/upload.pdf.js");
//get multer middleware for image upload and destructure it
const { logoUpload } = require("../middleware/upload.logo.js");
const { receiptUpload } = require("../middleware/upload.receipt.js");


module.exports = (app) => {
  const user = require("../controllers/user_controller");
  const job = require("../controllers/job_controller");
  const cart = require("../controllers/cart_controller");
  const summary = require("../controllers/summary_controller");
  const order = require("../controllers/order_controller");

  const router = require("express").Router();

  router.post("/register", uploadPdf.single("resume"), user.register);
  router.post("/login", user.login);
  router.get("/get-users", user.findAll);
  router.get("/get-user", user.findOne);
  router.get("/get-users-data", user.findAllUsersWithOrders);

  router.post("/add-job", logoUpload.single("logo"), job.create);
  router.get("/get-jobs", job.findAll);
  router.get("/get-job", job.findOne);
  //web
  router.get("/view-job/:jobId", job.viewJob);

  router.post("/add-to-cart", cart.addTocart);
  router.post("/remove-from-cart", cart.removeFromCart);
  router.get("/get-cart", cart.getCart);
  //web
  router.get("/view-cart/:userId", cart.viewCart);

  router.get("/get-summary", summary.calculateSummary);
  //web
  router.get("/view-summary/:userId", summary.viewSummary);

  router.post("/create-order",receiptUpload.single("paymentProof"), order.addOrder);
  router.get("/get-history", order.getHistory);
  router.get("/get-order", order.findOneOrder);
  //web
  router.get("/view-order/:orderId", order.viewOrder);
  router.get("/view-orders/:userId", order.viewHistory);

  app.use("/api/acm-if", router);
};
