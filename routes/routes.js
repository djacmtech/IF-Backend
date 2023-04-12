module.exports = (app) => {
    const user = require("../controllers/user_controller");
    const job = require("../controllers/jdesc_controller");
    const router = require("express").Router();

    router.post("/register", user.register);
    router.post("/login", user.login);
    
    router.post("/create", job.create);
    router.get("/find_job", job.findAll);

    app.use("/api/acm-if", router);
}