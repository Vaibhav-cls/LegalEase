const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../config/cloud.js");
const signupController = require("../controllers/signupController.js");
const { checkEmailExists } = require("../middlewares/emailExists.js");
const upload = multer({ storage });

// User signup
router
  .route("/")
  .get(signupController.renderSignupForm)
  .post(checkEmailExists,upload.single("user[image]"), signupController.signup);

//Provider Signup
router
  .route("/provider/:id")
  .get(signupController.providerSignupForm)
  .post(signupController.providerSignup);

// Client Signup
router
  .route("/client/:id")
  .get(signupController.clientSignupForm)
  .post(signupController.clientSignup);

module.exports = router;
