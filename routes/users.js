const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.flash("success", "歡迎來到YelpCamp");
    res.redirect("/campgrounds");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
});

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    req.flash("success", "登入成功!");
    res.redirect("/campgrounds");
  }
);

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    } else {
      req.flash("success", "已登出帳號!");
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
