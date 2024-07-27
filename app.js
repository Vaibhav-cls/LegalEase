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
      res.redirect(`/signup/${id}/${user_type}`); // either client/dashboard OR provider/dashboard
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
});

// User login api
app.get("/login", (req, res) => {
  res.render("users/login");
});
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    console.log("login success");
    res.redirect("/");
  }
);

//User logout api
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

app.get("/signup/:id/provider", async (req, res) => {
  const { id } = req.params;
  const providerDetails = await User.findOne({ _id: id });
  res.render("providers/providerForm.ejs", { id, providerDetails });
});
app.post("/signup/:id/provider", (req, res) => {
  const providerDetails = req.body;
  console.log(providerDetails);
  res.send("Details added");
});

app.get("/tags", async (req, res) => {});

// app.get("/services", async(req, res) => {
//   const services = await Service.find({}).populate("user");
//   console.log(services);
//   res.render("services/index.ejs", { services });
// });

// ROOT PATH
app.get("/", (req, res) => {
  res.send("Welcome to homepage");
});

const PORT = process.env.CONNECTION_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
