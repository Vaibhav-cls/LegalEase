//RUN THIS CODE WITH NODE index.js AND IT WILL INITIALIZE THE DB

const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/LegalEase";
const User = require("../models/user.js");
const Service = require("../models/service.js");
const Tag = require("../models/tag.js");
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
// const example = new User({
//   // pass - admin@123
//   first_name: "admin",
//   last_name: "admin",
//   username: "admin",
//   email: "admin123@gmail.com",
//   image: {
//     url: "https://res.cloudinary.com/djzomy8vf/image/upload/v1722064167/legalEase_User/nifpgtlhzgwoqis6efyo.png",
//     filename: "legalEase_User/nifpgtlhzgwoqis6efyo",
//   },
//   phone_number: 9644582521,
//   user_type: "admin",
//   salt: "adc188b27c12887e5331b2894b8aafb5a33c90ef6728d8908eb36abaeb75df3d",
//   hash: "fdfec440629c2f4f6ec8cfb21ac3c45951751e5d91b1cf7b6d1d17cb9beb2ff880c7e9524c3b582d4740415398f47d81ac410841033852e9577eb7e0f4938d453dbfe5fb8430759c6edc4259a173e9c8f22c4a3d35b9e85ac2aad71c57ff13264199a2cb507ebce07e8549e99cc187b9c26d3330afdae20737487d34582722465856175f2cd3dbde195f87de9745be22da8b10005008908dc96d965c39fe187d623d577172613f4db3b34219efcb689bb34e1a107f7cec6c01c150083f0e7ee1b5d61ac4b913b6728543181d692a2c5944cc78bbc04bd032a4f66ecea9fef739314111ca6bddf9bbb8fe96959cfe20bbd44c2f49f91512a44d36f62fe441e5056034e6e1299c11e3144e97847d948e7b056ec37c14282a7ac3b7fb0c5a8bb98a9fad3625c69d50084b01472173266791c9f776674ed4e1a68566f655cc4de8aa4f15eab6848ae9e7857bc509474e7c70db5716902fc052a81ae0f477dda03b52d1c06e89e18a44e9d60a7af8035b6539791de223f63243c5c1b152403ac582466e6116669b599932527457faa0376b13ed5ad390fd9efe7a3389b779196add18237fee017ae3a05949f63b00a903989819cb9fa39ccfb79cd2be1a04f202d1a338f499412a8ce616af215b16ca5559c51d6e93ee1a17d9a4446ec59177cba51051c5c98063232e260bb6e839c31a2f0f226638b9a5e1ef562a823729be6df86d",
// });


// const example = new Service({
//   service_name: "Aadhar Link",
//   description: "admin@gmail.com",
//   user: ["66a49de60e413a5f9a231024"]
// });

const example = new Tag({
  name:"lawyer",
})
example.save();
