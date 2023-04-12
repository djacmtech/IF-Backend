module.exports = (app) => {
    const user = require("../controllers/user_controller");
    const job = require("../controllers/job_controller");
    const router = require("express").Router();

    router.post("/register", user.register);
    router.post("/login", user.login);
    
    router.post("/add-job", job.create);
    router.get("/get-jobs", job.findAll);

    app.use("/api/acm-if", router);
}