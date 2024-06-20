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
    try {
      const token = generateJWT(req.user); // Function to generate JWT

      // Return a JSON response with the JWT token
      res.status(200).json({
        message: "Authentication successful",
        token: token,
        user: {
          id: req.user.id,
          firstname: req.user.firstname,
          lastname: req.user.lastname,
          email: req.user.email,
          // Add other user information as needed
        },
      });
    } catch (error) {
      console.error("Error generating JWT:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }
);

router.get("/failure", (req, res) => {
  res.status(401).json({ status: "error", message: "Authentication failed" });
});

module.exports = router;
