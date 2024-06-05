const { DataTypes } = require("sequelize");
const sequelize = require("../db"); // Replace with your Sequelize instance
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const validator = require("validator");

const User = sequelize.define(
  "User",
  {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Email is not valid",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resetToken: {
      type: DataTypes.STRING,
    },
    resetTokenExpiration: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: true, // Disable timestamps (createdAt and updatedAt)
    modelName: "User",
  }
);

// static login method
User.login = async function (email, password) {
  // Validation
  if (!email || !password) {
    throw Error("All field must be filled!");
  }

  // check if user exists
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw Error("User not found!");
  }

  // compare passwords
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect password!");
  }

  return user;
};

// static signup method
User.signup = async function (firstname, lastname, email, password) {
  //Validate
  if (!firstname || !lastname || !email || !password) {
    throw Error("All field must be filled!");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password is not strong enough");
  }

  // check if user exists
  const exists = await User.findOne({ where: { email } });

  if (exists) {
    throw Error("Email already in use");
  }

  //Password Encryption
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // Create a new user using Sequelize
  const user = await User.create({
    firstname,
    lastname,
    email,
    password: hash,
  });

  return user;
};

// Reset password method
User.resetpassword = async function (token, newPassword) {
  // Validation
  if (!validator.isStrongPassword(newPassword)) {
    // return "Password is not strong enough";
    throw new Error("Password is not strong enough");
  }

  const user = await this.findOne({
    where: {
      resetToken: token,
      resetTokenExpiration: {
        [Op.gt]: new Date(),
      },
    },
  });
  if (!user) {
    throw new Error("Invalid or Expired token");
  }

  // Password Encryption
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);

  // Update the user's password and clear the reset token
  user.password = hash;
  user.resetToken = null;
  user.resetTokenExpiration = null;

  await user.save();

  return user;
};

module.exports = User;
