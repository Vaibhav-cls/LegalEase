const User = require("../models/user");

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login1");
};

module.exports.login = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username: username });

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/login");
    }

    const { user_type, _id } = user;
    if (user_type === "provider") {
      return res.redirect(`/provider/dashboard/${_id}`);
    } else if (user_type === "client") {
      return res.redirect(`/client/dashboard/${_id}`);
    } else {
      // Default case for unknown user types or admin user_type
      return res.redirect("/admin/dashboard");
    }
  } catch (error) {
    console.error("Login error:", error);
    req.flash("error", "An error occurred during login. Please try again.");
    return res.redirect("/login");
  }
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    // req.flash("success", "You are logged out!");
    req.session.clientId = null;
    req.session.providerId = null;
    console.log("Logged out");
    res.redirect("/login");
  });
};
