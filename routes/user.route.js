const {
  register,
  login,
  logout,
  profile,
} = require("../controller/user.controller");
const express = require("express");
const router = express.Router();
const userMiddleware = require("../middleware/user.middleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", userMiddleware, profile);

module.exports = router;
