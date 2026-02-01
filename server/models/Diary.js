const mongoose = require('mongoose');

const diarySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: [true, 'Please add a title'], // New Field
    default: 'Untitled'
  },
  label: {
    type: String, // New Field (e.g., "Work", "Personal")
    default: 'Daily'
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: [true, 'Please add a date'],
  },
  mood: {
    type: String,
    required: [true, 'Please select a mood'],
  },
  text: {
    type: String,
    required: [true, 'Please add some text'],
  },
  imageUrl: {
    type: String, // New Field for images
    default: ''
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Diary', diarySchema);