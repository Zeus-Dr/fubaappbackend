const jwt = require("jsonwebtoken");

function generateJWT(user) {
  // Ensure the user object is valid and has the expected properties
  if (!user || !user.id) {
    throw new Error("Invalid user data");
  }

  // Define the payload for the JWT
  const payload = {
    id: user.id,
    email: user.email,
  };

  // Sign the JWT with a secret key
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  return token;
}

module.exports = { generateJWT };
