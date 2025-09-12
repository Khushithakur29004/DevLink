const jwt = require("jsonwebtoken");
const User = require("../model/User");

const userAuth = async (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    let token = req.cookies.token;
    
    if (!token && req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login."
      });
    }

    try {
      // Verify token
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user
      const user = await User.findById(decoded._id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User no longer exists"
        });
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: "Invalid token. Please login again."
        });
      }
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: "Token expired. Please login again."
        });
      }
      throw err;
    }
  } catch (err) {
    next(err); // Pass to global error handler
  }
};

module.exports = {
  userAuth,
};
