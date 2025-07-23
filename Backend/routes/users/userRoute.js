const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} = require("../../controllers/users/userController");
const validateToken = require("../../middleware/Authentication/validateToken");

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/refresh").post(refreshAccessToken);

router.route("/logout").post(validateToken, logoutUser);

module.exports = router;
