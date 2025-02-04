const Appointment = require("../models/appointment");
const Provider = require("../models/provider");

module.exports.renderAppointmentForm = (req, res) => {
  const sessionData = {
    clientId: req.session.clientId,
    providerId: req.session.providerId,
  };
  res.render("users/booking.ejs", { sessionData });
};

module.exports.editAppointment = async (req, res) => {
  const { id } = req.params;
  const { confirmationStatus } = req.body;

  try {
    await Appointment.findByIdAndUpdate(id, {
      confirmationStatus: confirmationStatus,
    });
    const { user } = await Provider.findById(req.session.providerId);
    res.redirect(`/provider/dashboard/${user}`);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).send("Server error");
  }
};

module.exports.CreateAppointment = async (req, res) => {
  const appointmentCreds = req.body;
  const { clientId, providerId } = req.params;
  // console.log(client,"...",provider)
  const bookingDetails = new Appointment({
    clientId: clientId,
    providerId: providerId,
    confirmationStatus: "pending",
    ...appointmentCreds,
  });
  await bookingDetails.save();
  console.log("Booking success");
  res.redirect(`/marketplace`);
};
