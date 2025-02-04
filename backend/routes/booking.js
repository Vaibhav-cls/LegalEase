const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

router.get("/", bookingController.renderAppointmentForm);
router.patch("/:id", bookingController.editAppointment);

router.post("/:clientId/:providerId", bookingController.CreateAppointment);

module.exports = router;
