const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
const User = require("../models/user");
const passport = require("passport");

router
  .route("/login")
  .get(loginController.renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    loginController.login
  );

router.get("/logout", loginController.logout);
module.exports = router;
