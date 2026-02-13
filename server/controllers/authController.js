const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to Generate Token - FIXED! ✅
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// REST OF YOUR CODE STAYS THE SAME...
// 1. REGISTER
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await User.create({ email, password: hashedPassword });
    
    res.status(201).json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. GOOGLE LOGIN
const googleLogin = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      res.json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      const randomPassword = Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = await User.create({
        email,
        password: hashedPassword 
      });

      res.status(201).json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, googleLogin };