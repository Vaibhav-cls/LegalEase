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
const bodyParser = require("body-parser");
// const textFlow = require("textflow");

const { isLoggedIn, isOwner } = require("./middleware.js");

//MODELS REQUIRE
const User = require("./models/user");
const Service = require("./models/service.js");
const Tag = require("./models/tag.js");
const Provider = require("./models/provider.js");
const Client = require("./models/client.js");
const Appointment = require("./models/appointment.js");
const Review = require("./models/review.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(bodyParser.json());
// textFlow.usekey(process.env.TEXTFLOW_API_KEY);
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
const setupIndexes = async () => {
  try {
    // Get a list of existing indexes
    const existingIndexes = await Tag.collection.indexes();

    // Check if the text index exists
    const indexExists = existingIndexes.some(
      (index) => index.name === "name_text_index" // Use the custom index name you provided
    );

    if (!indexExists) {
      // Create the text index if it doesn't exist
      await Tag.collection.createIndex(
        { name: "text" },
        { name: "name_text_index" }
      );
      console.log("Text index created successfully.");
    } else {
      console.log("Text index already exists.");
    }
  } catch (error) {
    console.error("Error setting up indexes:", error.message);
  }
};
setupIndexes();
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
  res.locals.results = req.results;
  next();
});

// User signup
app.get("/signup", (req, res) => {
  //const allTags = await Tag.find();
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
      console.log("login success");
      const id = registeredUser._id.toString();
      res.redirect(`/signup/${user_type}/${id}`);
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
app.get("/provider/dashboard/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const userInfo = await User.findOne({ _id: id });
  const userId = userInfo._id.toString();
  const providerInfo = await Provider.findOne({ user: userId })
    .populate("tags")
    .populate({
      path: "reviews",
      populate: {
        path: "author",
        model: "Client",
        populate: {
          path: "user",
          model: "User",
        },
      },
    });
  const providerId = providerInfo._id.toString();
  const clientId = req.session.clientId;
  req.session.providerId = providerId;
  const appointments = await Appointment.find({
    providerId: providerId,
  }).populate({
    path: "clientId",
    populate: {
      path: "user",
      model: "User",
    },
  });
  console.log(appointments, "\n");
  res.render("providers/dashboard.ejs", {
    provider: providerInfo,
    user: userInfo,
    clientId,
    appointment: appointments,
  });
});

// Provider edit deteils
app.get("/provider/edit/:id", isLoggedIn, isOwner, async (req, res) => {
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
app.patch("/provider/edit/:id", isLoggedIn, isOwner, async (req, res) => {
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

//Provider delete route
// app.delete("/:id", (req, res) => {});
//------------------------------------------------------------------
// CLIENT SIDE ROUTES

app.get("/client/dashboard/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const userDetails = await User.findOne({ _id: id.toString() });
  const clientDetails = await Client.findOne({ user: id });
  const clientId = clientDetails._id.toString();
  console.log("CLient id: ", clientId.toString());
  req.session.clientId = clientId.toString();
  const bookingDetails = await Appointment.find({
    clientId: clientId,
  }).populate({
    path: "providerId",
    populate: {
      path: "user", // Assuming each provider has a reference to a User document
      model: "User", // Adjust model name if needed
    },
  });
  res.render("clients/dashboard.ejs", {
    user: userDetails,
    clients: clientDetails,
    booking: bookingDetails,
  });
});

// Client additonal signup details
app.get("/signup/client/:id", async (req, res) => {
  const { id } = req.params;
  const clientDetails = await User.findOne({ _id: id });
  res.render("clients/clientForm.ejs", { id, clientDetails });
});
app.post("/signup/client/:id", async (req, res) => {
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
});
//Client edit details
app.get("/client/edit/:id", async (req, res) => {
  const { id } = req.params;
  const clientDetails = await Client.findOne({ _id: id });
  const userId = clientDetails.user.toString();
  const userDetails = await User.findOne({ _id: userId });
  res.render("clients/edit.ejs", {
    client: clientDetails,
    user: userDetails,
  });
});
app.patch("/client/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const newValues = req.body;
    console.log("value: ", newValues);

    const clientDetails = await Client.findOne({ _id: id });
    if (!clientDetails) {
      return res.status(404).send("Client not found");
    }
    const updatedData = await Client.findByIdAndUpdate(id, newValues);
    res.redirect(`/client/dashboard/${clientDetails.user.toString()}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating client details");
  }
});
// change user image
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

// User LOGIN api
app.get("/login", (req, res) => {
  res.render("users/login1");
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
    req.session.clientId = null;
    req.session.providerId = null;
    console.log("Logged out");
    res.redirect("/login");
  });
});

//Marketplace
app.get("/marketplace", async (req, res) => {
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
  res.render("users/marketplace.ejs", { providers, q });
  req.session.searchResults = null;
});

app.post("/search", async (req, res) => {
  let { search } = req.body;
  try {
    const results = await Tag.find({ $text: { $search: search } });
    req.session.searchResults = results;
    const query = results.map((result) => result.name).join("+");
    res.redirect(`/marketplace?q=${query}`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
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
app.get("/", (req, res) => {
  res.render("users/homepage.ejs");
});
app.get("/booking", (req, res) => {
  const sessionData = {
    clientId: req.session.clientId,
    providerId: req.session.providerId,
  };
  res.render("users/booking.ejs", { sessionData });
});
app.patch("/booking/:id", async (req, res) => {
  const { id } = req.params;
  const { confirmationStatus } = req.body;

  try {
    await Appointment.findByIdAndUpdate(id, {
      confirmationStatus: confirmationStatus,
    });
    const { user } = await Provider.findById(req.session.providerId);
    res.redirect(`/provider/dashboard/${user}`);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).send("Server error");
  }
});

app.post("/booking/:clientId/:providerId", async (req, res) => {
  const appointmentCreds = req.body;
  const { clientId, providerId } = req.params;
  // console.log(client,"...",provider)
  const bookingDetails = new Appointment({
    clientId: clientId,
    providerId: providerId,
    confirmationStatus: "pending",
    ...appointmentCreds,
  });
  await bookingDetails.save();
  console.log("Booking success");
  res.redirect(`/marketplace`);
});

app.post("/review", async (req, res) => {
  try {
    const { clientId, providerId } = req.session; // Extract client and provider IDs from the session

    // Validate session details
    if (!clientId || !providerId) {
      return res
        .status(400)
        .json({ error: "Client or Provider ID missing in session" });
    }

    // Fetch the details of the client and provider
    const clientDetails = await Client.findById(clientId).populate("user");
    const providerDetails = await Provider.findById(providerId);

    if (!clientDetails || !providerDetails) {
      return res.status(404).json({ error: "Client or Provider not found" });
    }

    // Create and save the review
    const data = req.body; // Contains review details like `rating`, `content`, etc.
    const reviewDetails = new Review({
      author: clientId, // Reference to the client who is submitting the review
      ...data,
    });
    await reviewDetails.save(); // Save the review in the `Review` database

    // Update the provider with the new review ID
    providerDetails.reviews.push(reviewDetails._id); // Add the review ID to the `reviews` array
    await providerDetails.save(); // Save the updated provider information

    // Send a success response
    res.status(201).redirect(`/provider/dashboard/${providerDetails.user}`);
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.CONNECTION_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
