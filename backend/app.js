if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const MONGO_URL = process.env.MONGO_URL;
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const multer = require("multer");
const { storage } = require("./cloudConfig.js");
const upload = multer({ storage });

//MODELS REQUIRE
const User = require("./models/user");
const Service = require("./models/service.js");
const Tag = require("./models/tag.js");
const Provider = require("./models/provider.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

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

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// User signup
app.get("/signup", (req, res) => {
  res.render("users/signup");
});
app.post("/signup", upload.single("user[image]"), async (req, res, next) => {
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
      req.flash("success", `Welcome, ${first_name}!`);
      console.log("Signup success");
      const id = registeredUser._id.toString();
      res.redirect(`/signup/${user_type}/${id}`); // either client/dashboard OR provider/dashboard
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
});

//Provider additonal signup details
app.get("/signup/provider/:id", async (req, res) => {
  const { id } = req.params;
  const providerDetails = await User.findOne({ _id: id });
  const allTags = await Tag.find();
  res.render("providers/providerForm.ejs", { id, providerDetails, allTags });
});
app.post("/signup/provider/:id", async (req, res) => {
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
});

// Provider Dashboard
app.get("/provider/dashboard/:id", async (req, res) => {
  const { id } = req.params;
  const userInfo = await User.findOne({ _id: id });
  const userId = userInfo._id.toString();
  const providerInfo = await Provider.findOne({ user: userId }).populate(
    "tags"
  );
  res.render("providers/dashboard.ejs", {
    provider: providerInfo,
    user: userInfo,
  });
});

// Provider edit deteils
app.get("/provider/edit/:id", async (req, res) => {
  const { id } = req.params;
  const providerDetails = await Provider.findOne({ _id: id }).populate("tags");
  const userId = providerDetails.user.toString();
  const userDetails = await User.findOne({ _id: userId });
  const allTags = await Tag.find();
  res.render("providers/edit.ejs", {
    provider: providerDetails,
    user: userDetails,
    allTags,
  });
});
app.patch("/provider/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const newValues = req.body;
    let { tags } = newValues;

    try {
      tags = JSON.parse(tags);
    } catch (error) {
      return res.status(400).send("Invalid tags format");
    }

    const providerDetails = await Provider.findOne({ _id: id }).populate(
      "tags"
    );
    if (!providerDetails) {
      return res.status(404).send("Provider not found");
    }

    const oldTags = providerDetails.tags;
    const removedTags = oldTags.filter((item) => !tags.includes(item.name));
    const tagIds = [];

    // Update new tags
    for (let tag of tags) {
      let tagData = await Tag.findOne({ name: tag });
      if (!tagData) {
        tagData = new Tag({ name: tag, providers: [id] });
        await tagData.save();
      } else {
        if (!tagData.providers.includes(id)) {
          tagData.providers.push(id);
          await tagData.save();
        }
      }
      tagIds.push(tagData._id);
    }

    // Handle removed tags
    for (let tag of removedTags) {
      let tagData = await Tag.findOne({ name: tag.name });
      if (tagData) {
        tagData.providers = tagData.providers.filter(
          (item) => item.toString() != id
        );
        await tagData.save();
      }
    }

    newValues.tags = tagIds;
    const updatedData = await Provider.findByIdAndUpdate(id, newValues, {
      new: true,
    });

    res.redirect(`/provider/dashboard/${providerDetails.user.toString()}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating provider details");
  }
});
app.put("/:id", upload.single("user[image]"), async (req, res, next) => {
  let { id } = req.params;
  let user = await User.findOne({ _id: id });
  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    user.image = { url, filename };
    await user.save();
  }
  res.redirect(`/${user.user_type}/dashboard/${id}`);
});
//Provider delete route
// app.delete("/:id", (req, res) => {});
//------------------------------------------------------------------
// CLIENT SIDE ROUTES
app.get("/client/dashboard/:id", (req, res) => {
  res.send("client dashboard");
});

// User LOGIN api
app.get("/login", (req, res) => {
  res.render("users/login");
});
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
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
  }
);

//User LOGOUT api
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    // req.flash("success", "You are logged out!");
    console.log("Logged out");
    res.redirect("/login");
  });
});
// ROOT PATH
app.get("/", (req, res) => {
  res.render("homepage.ejs");
});

const PORT = process.env.CONNECTION_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
