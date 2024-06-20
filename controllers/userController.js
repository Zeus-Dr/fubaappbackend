const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { error } = require("console");
const bcrypt = require("bcrypt");
const validator = require("validator");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: "3d" });
};

// login user (done)
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    const { firstname, lastname } = user;

    // Create a token for the authenticated user
    const token = createToken(user.id);

    res.status(200).json({ firstname, lastname, email, token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(400).json({ error: error.message });
  }
};

// signup user (done)
const signupUser = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    const user = await User.signup(firstname, lastname, email, password);

    // Create a token for the newly signed-up user
    const token = createToken(user.id);

    res.status(200).json({ firstname, lastname, email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// forgot password (done)
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    // Generate a six-digit password reset token
    const generateResetToken = () => {
      return Math.floor(100000 + Math.random() * 900000);
    };

    const token = generateResetToken();
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; //expires in 1hr

    await user.save();

    //Send a password reset email with a link containing the token
    const transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      host: process.env.HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      html: `
        <p>Your password reset token is ${token} and it expires in 1 hour.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// reset password (done)
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  console.log("Token and newPassowrd", token, newPassword);
  try {
    const user = await User.resetpassword(token, newPassword);

    return res.status(200).json({ message: "Password reset successfully!!" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { loginUser, signupUser, forgotPassword, resetPassword };
