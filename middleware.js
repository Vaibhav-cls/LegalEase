module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user);
    if (!req.isAuthenticated()) {
      //redirectUrl save
    //   req.session.redirectUrl = req.originalUrl;
      req.flash("error", "You must be logged in to create/delete listing");
      return res.redirect("/login");
    }
    next();
  };