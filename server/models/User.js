const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true // No two users can have the same email
  },
  password: {
    type: String,
    required: true
  },
  theme: {
    type: String,
    default: 'light' // Default to light mode
  },
  diaryLockPin: {
    type: String,
    default: null // By default, no PIN set
  }
});

module.exports = mongoose.model('User', userSchema);