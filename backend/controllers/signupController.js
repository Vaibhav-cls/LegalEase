const User = require("../models/user");
const Provider = require("../models/provider");
const Tag = require("../models/tag");
const Client = require("../models/client");
const cloudinary = require("../config/cloud");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup1");
};

module.exports.signup = async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      username,
      password,
      email,
      phone_number,
      user_type,
    } = req.body;

    // const emailExists = await User.findOne({ email: email });
    // if (emailExists) {
    //   if (req.file) {
    //     await cloudinary.uploader.destroy(legalEase_User/req.file.filename); // Delete uploaded image
    //   }
    //   req.flash("error", "Email already exists");
    //   return res.redirect("/signup");
    // }

    const newUser = new User({
      first_name,
      last_name,
      username,
      email,
      phone_number,
      user_type,
    });

    if (req.file) {
      newUser.image = { url: req.file.path, filename: req.file.filename };
    }

    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, async (err) => {
      if (err) return next(err);
      req.flash("success", `Welcome, ${first_name} to LegalEase`);
      const id = registeredUser._id.toString();
      res.redirect(`/signup/${user_type}/${id}`);
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.providerSignupForm = async (req, res) => {
  const { id } = req.params;
  const providerDetails = await User.findOne({ _id: id });
  const allTags = await Tag.find();
  res.render("providers/signup2.ejs", { id, providerDetails, allTags });
};

module.exports.providerSignup = async (req, res) => {
  try {
    const { id } = req.params;
    const providerDetails = req.body;
    let { selectedTags } = providerDetails;
    selectedTags = JSON.parse(selectedTags);

    const user = await User.findById(id);
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/signup");
    }

    const newProvider = new Provider({
      user: user._id,
      ...providerDetails,
      tags: [],
    });

    await newProvider.save();
    const providerId = newProvider._id;
    const tagIds = [];

    for (let tag of selectedTags) {
      let tagData = await Tag.findOne({ name: tag });
      if (!tagData) {
        tagData = new Tag({ name: tag, providers: [providerId] });
        await tagData.save();
      } else {
        if (!tagData.providers.includes(providerId)) {
          tagData.providers.push(providerId);
          await tagData.save();
        }
      }
      tagIds.push(tagData._id);
    }
    newProvider.tags = tagIds;
    await newProvider.save();
    req.flash("success", "Provider details added successfully");
    res.redirect(`/provider/dashboard/${id}`);
  } catch (e) {
    req.flash("error", e.message);
    res.redirect(`/signup/provider/${req.params.id}`);
  }
};

module.exports.clientSignupForm = async (req, res) => {
  const { id } = req.params;
  const clientDetails = await User.findOne({ _id: id });
  res.render("clients/signup2.ejs", { id, clientDetails });
};

module.exports.clientSignup = async (req, res) => {
  try {
    const { id } = req.params;
    const clientDetails = req.body;

    const user = await User.findById(id);
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/signup");
    }

    const newClient = new Client({
      user: user._id,
      ...clientDetails,
    });
    await newClient.save();
    req.flash("success", "Client details added successfully");
    res.redirect(`/client/dashboard/${id}`);
  } catch (e) {
    req.flash("error", e.message);
    res.redirect(`/signup/client/${req.params.id}`);
  }
};
