const jwt = require("jsonwebtoken");
const User = require("../model/User");

const userAuth = async (req, res, next) => {
  try {
    // read the token from the req cookies
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      return res.status(401).send("Please Login!!");
    }

    //validate the token
    const decodedMessage = await jwt.verify(token,process.env.JWT_SECRET);
    const { _id } = decodedMessage;

    //find the token
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).send("ERROR :" + err.message);
  }
};

module.exports = {
  userAuth,
};
