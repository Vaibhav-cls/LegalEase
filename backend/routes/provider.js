const express = require("express");
const router = express.Router();
const providerController = require("../controllers/providerController");
const { isLoggedIn, isOwner } = require("../middleware");

// Provider Dashboard
router.get("/dashboard/:id", isLoggedIn, providerController.renderDashboard);

// Provider edit deteils
router
  .route("/edit/:id")
  .get(isLoggedIn, isOwner, providerController.renderProviderEditForm)
  .patch(isLoggedIn, isOwner, providerController.editProvider);

//Provider delete route
// app.delete("/:id", (req, res) => {});
//------------------------------------------------------------------
// CLIENT SIDE ROUTES

module.exports = router;