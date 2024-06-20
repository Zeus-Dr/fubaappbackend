const express = require("express");

//controller functions

const {
  loginUser,
  signupUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

const router = express.Router();

// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signupUser);

// forgotpassword route
router.post("/forgotpassword", forgotPassword);

//reset password route
router.post("/resetpassword", resetPassword);

module.exports = router;
