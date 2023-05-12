const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../schemas.js");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});
router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new Express("Invalid Campground data", 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("success", "新增完成!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const c = await Campground.findById(id).populate("reviews");
    if (!c) {
      req.flash("error", "找不到指定的露營地");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { c });
  })
);
router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "編輯失敗");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);
router.put(
  "/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(
      id,
      {
        ...req.body.campground,
      },
      { new: true }
    );
    req.flash("success", "編輯成功!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "已刪除露營地");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
