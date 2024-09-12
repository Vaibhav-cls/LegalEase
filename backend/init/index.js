//RUN THIS CODE WITH NODE index.js AND IT WILL INITIALIZE THE DB

const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/LegalEase";
const User = require("../models/user.js");
const Appointment = require("../models/appointment.js");
const initUser = require("./userData.js");
const Tag = require("../models/tag.js");
const initTag = require("./tagData.js");
const Provider = require("../models/provider.js");
const initProvider = require("./providerData.js");
const Client = require("../models/user.js");
const initClient = require("./clientData.js");
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}
// const initUserDB = async () => {
//   await User.insertMany(initUser.data);
//   console.log("--> Users initialized");
// };
// const initTagDB = async () => {
//   await Tag.insertMany(initTag.data);
//   console.log("--> Tags initialized");
// };
// const initProviderDB = async () => {
//   await Provider.insertMany(initProvider.data);
//   console.log("--> Providers initialized");
// };
// const initClientDB = async () => {
//   await Client.insertMany(initClient.data);
//   console.log("--> Clients initialized");
// };
// initUserDB();
// initTagDB();
// initProviderDB();
// initClientDB();

const sampleAppointment = new Appointment({
  date: new Date("2024-09-12T10:00:00Z"),
  clientId: "66ae214f47512c3c4b34a862",
  providerId: "66a68efa6edf1234d9fb71f3",
  status: false,
  description: "Legal consultation for property dispute.",
  confirmationStatus: "confirmed",
});

sampleAppointment.save();
