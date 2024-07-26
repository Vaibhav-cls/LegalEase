//RUN THIS CODE WITH NODE index.js AND IT WILL INITIALIZE THE DB

const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/LegalEase";
const User = require("../models/user.js");
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
const example = new User({
  username: "admin",
  email: "admin@gmail.com",
  phone_number: 9675846951,
  user_type: "admin",
});

example.save();
