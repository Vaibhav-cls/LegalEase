const User = require("../models/user");
const Provider = require("../models/provider");
const Tag = require("../models/tag");
const Appointment = require("../models/appointment");
const Review = require("../models/review");
const { cloudinary } = require("../config/cloud");
const {dashboard} = require("../config/dashboard");

module.exports.ChangeUserImage = async (req, res, next) => {
  let { id } = req.params;
  let user = await User.findOne({ _id: id });
  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    user.image = { url, filename };
    await user.save();
  }
  res.redirect(`/${user.user_type}/dashboard/${id}`);
};

module.exports.loadMarketplace = async (req, res) => {
  let results = req.session.searchResults || [];
  let providers;
  const query = req.query.q;
  const q = query ? query.split(" ").join(",") : "";
  const providerIds = results.flatMap((service) => service.providers);
  if (results.length == 0) {
    providers = await Provider.find().populate("user").populate("tags");
  } else {
    providers = await Provider.find({ _id: { $in: providerIds } })
      .populate("user")
      .populate("tags");
  }
  console.log("len: " + providers[0].reviews.length);
  res.render("users/marketplace.ejs", { providers, q });
  req.session.searchResults = null;
};

module.exports.search = async (req, res) => {
  let { search } = req.body;
  try {
    const results = await Tag.find({ $text: { $search: search } });
    req.session.searchResults = results;
    const query = results.map((result) => result.name).join("+");
    res.redirect(`/marketplace?q=${query}`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports.ChangePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { old_pass, new_pass } = req.body;
    const user = await User.findById(id);
    // Validate input
    if (!old_pass || !new_pass) {
      req.flash("error", "Old and new password are required");
      return res.redirect(dashboard(user));
    }

    if (!user) {
      req.flash("error", "User not found");
      res.redirect("/login");
    }

    // Change password
    user.changePassword(old_pass, new_pass, (err) => {
      if (err) {
        req.flash("error", err.message);
        return res.redirect(dashboard(user));
      }
      
      req.flash("success", "Password changed successfully");
      return res.redirect(dashboard(user));
    });

  } catch (error) {
    console.error("Error changing password:", error);
    req.flash("error", "An unexpected error occurred. Please try again.");
    res.redirect("back");
  }
};


module.exports.home = (req, res) => {
  res.render("users/homepage.ejs");
};
