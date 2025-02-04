const Client = require("../models/client");
const User = require("../models/user");
const Appointment = require("../models/appointment");

module.exports.renderDashboard = async (req, res) => {
  const { id } = req.params;
  const userDetails = await User.findOne({ _id: id.toString() });
  const clientDetails = await Client.findOne({ user: id });
  const clientId = clientDetails._id.toString();
  console.log("CLient id: ", clientId.toString());
  req.session.clientId = clientId.toString();
  const bookingDetails = await Appointment.find({
    clientId: clientId,
  }).populate({
    path: "providerId",
    populate: {
      path: "user", // Assuming each provider has a reference to a User document
      model: "User", // Adjust model name if needed
    },
  });
  res.render("clients/dashboard.ejs", {
    user: userDetails,
    clients: clientDetails,
    booking: bookingDetails,
  });
};

module.exports.renderEditClient = async (req, res) => {
  const { id } = req.params;
  const clientDetails = await Client.findOne({ _id: id });
  const userId = clientDetails.user.toString();
  const userDetails = await User.findOne({ _id: userId });
  res.render("clients/edit.ejs", {
    client: clientDetails,
    user: userDetails,
  });
};

module.exports.editClient = async (req, res) => {
  try {
    const { id } = req.params;
    const newValues = req.body;
    console.log("value: ", newValues);

    const clientDetails = await Client.findOne({ _id: id });
    if (!clientDetails) {
      return res.status(404).send("Client not found");
    }
    const updatedData = await Client.findByIdAndUpdate(id, newValues);
    res.redirect(`/client/dashboard/${clientDetails.user.toString()}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating client details");
  }
};
