const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Check if the "Authorization" header exists and starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Get the token (remove "Bearer " from the string)
      token = req.headers.authorization.split(' ')[1];

      // 3. Decode the token to get the User ID
      const decoded = jwt.verify(token, "MY_SUPER_SECRET_KEY_123");

      // 4. Find the user in DB and attach it to the request object
      // (We exclude the password for security)
      req.user = await User.findById(decoded.id).select('-password');

      // 5. Allow them to pass to the Controller
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };