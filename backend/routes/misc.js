const express = require("express");
const router = express.Router();
const miscController = require("../controllers/miscController");
const multer = require("multer");
const { storage } = require("../config/cloud.js");
const { isLoggedIn } = require("../middlewares/middleware.js");
const upload = multer({ storage });
// const textFlow = require("../middleware/textFlow");
// const { verificationOptions } = require("../middleware/textFlow");

// change user image
router.put(
  "/:id",
  upload.single("user[image]"),
  miscController.ChangeUserImage
);

//Marketplace
router.get("/marketplace", miscController.loadMarketplace);

router.post("/search", miscController.search);
// app.post("/verify", async (req, res) => {
//   const { phone_number } = req.body;
//   var result = await textFlow.sendVerificationSMS(
//     phone_number,
//     verificationOptions
//   );
//   res.send(result);
//   // if (result.ok) return res.status(200).json({ success: true });
//   // return res.status(400).json({ success: false });
// });
// ROOT PATH
router.get("/", miscController.home);

router.post("/check-email", async (req, res) => {
  try {
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/changePassword/:id", isLoggedIn, miscController.ChangePassword);
module.exports = router;
