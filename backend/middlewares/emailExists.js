const User = require("../models/user");

module.exports.checkEmailExists = async (req, res, next) => {
  try {
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      req.flash("error", "Email already exists");
      return res.redirect("/signup");
    }
    next(); // Proceed to Multer upload and controller
  } catch (error) {
    req.flash("error", "Something went wrong");
    return res.redirect("/signup");
  }
};