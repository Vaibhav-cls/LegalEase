const express = require("express");
const router = express.Router();

router.use("/", require("./login"));
router.use("/signup", require("./signup"));
router.use("/provider", require("./provider"));
router.use("/client", require("./client"));
router.use("/booking", require("./booking"));
router.use("/", require("./misc"));

module.exports = router;
