module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "請先登入帳號!");
    return res.redirect("/login");
  }
  next();
};
