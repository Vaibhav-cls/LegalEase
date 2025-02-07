if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const MONGO_URL = process.env.MONGO_URL;
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bodyParser = require("body-parser");

//Routers
const routes = require("./routes/index.js");

//MODELS
const User = require("./models/user");
const Provider = require("./models/provider.js");
const Client = require("./models/client.js");
const Review = require("./models/review.js");
const connectDB = require("./config/db");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(bodyParser.json());
app.engine("ejs", ejsMate);

connectDB(MONGO_URL);

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

app.use("/", routes); // All routes



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
