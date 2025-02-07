const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner } = require("../middlewares/middleware.js");
const clientController = require("../controllers/clientController");

router.get("/dashboard/:id", isLoggedIn,isOwner, clientController.renderDashboard);

//Client edit details
router
  .route("/edit/:id")
  .get(clientController.renderEditClient)
  .patch(clientController.editClient);

module.exports = router;
