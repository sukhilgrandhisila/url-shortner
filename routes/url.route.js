const express = require("express");
const router = express.Router();

const {
  createShortUrl,
  redirectUrl,
  getUserUrls,
  deleteUrl,
  handleGetAnalytics,
} = require("../controller/url.controller");

router.post("/shorten", createShortUrl);
router.get("/myurls", getUserUrls);
router.get("/:shortCode", redirectUrl);
router.delete("/:id", deleteUrl);
router.get("/analytics/:shortId", handleGetAnalytics);
module.exports = router;
