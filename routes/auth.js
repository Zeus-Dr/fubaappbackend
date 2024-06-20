const express = require("express");
const passport = require("passport");
const { generateJWT } = require("../utils/jwt"); // Adjust the path as needed
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/auth/failure" }),
  function (req, res) {
    // console.log("Request", req.user);
    const token = generateJWT(req.user); // Function to generate JWT
    res.redirect(`/api/auth/success?token=${token}`);
  }
);

router.get("/success", (req, res) => {
  res.send("Login Successful! Token: " + req.query.token);
});

router.get("/failure", (req, res) => {
  res.send("Login Failed");
});

module.exports = router;
