const express = require("express");
const router = express.Router();
const usermiddleware = require("../middleware/user.middleware")

const {
  createShortUrl,
  redirectUrl,
  getUserUrls,
  deleteUrl,
  handleGetAnalytics,
} = require("../controller/url.controller");

router.post("/shorten",usermiddleware, createShortUrl);
router.get("/myurls",usermiddleware, getUserUrls);
router.get("/:shortCode", redirectUrl);
router.delete("/:id",usermiddleware, deleteUrl);
router.get("/analytics/:shortId",usermiddleware, handleGetAnalytics);
module.exports = router;
