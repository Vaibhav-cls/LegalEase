const { dashboard } = require("../config/dashboard");
const User = require("../models/user");

module.exports.isLoggedIn = (req, res, next) => {
  console.log(req.user);
  if (!req.isAuthenticated()) {
    // redirectUrl save
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let user = await User.findById(id);
  if (!user._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of that account");
    console.log("cowcow:" +user)
    return res.redirect(dashboard(res.locals.currUser));
  }
  next();
};
