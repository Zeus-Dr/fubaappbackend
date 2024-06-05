const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
  //verify user is authenticated
  const { authorization } = req.headers;
  // console.log("Authorization", authorization);

  if (!authorization) {
    return res.status(401).json({ error: "Authorizaion token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { id } = jwt.verify(token, process.env.SECRET);

    // console.log("The id is ", id);

    // Add user to the request object
    req.user = await User.findOne({
      where: { id },
    });
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;
