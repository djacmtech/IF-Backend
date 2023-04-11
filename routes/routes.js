module.exports = (app) => {
    const user = require("../controllers/user_controller");

    const router = require("express").Router();

    router.post("/register", user.register);
    router.post("/login", user.login);

    app.use("/api/acm-if", router);
}