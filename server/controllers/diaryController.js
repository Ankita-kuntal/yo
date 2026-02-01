const Diary = require('../models/Diary');
const User = require('../models/User');

// 1. GET ALL DIARIES (User specific)
const getDiaries = async (req, res) => {
  try {
    // Find diaries where user matches the logged in user
    const diaries = await Diary.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(diaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. CREATE DIARY
const createDiary = async (req, res) => {
  try {
    const { date, mood, text, title, label } = req.body;

    // Check if entry for this date already exists
    const existingDiary = await Diary.findOne({ user: req.user.id, date });
    if (existingDiary) {
      return res.status(400).json({ message: 'Diary entry for this date already exists' });
    }

    const diary = await Diary.create({
      user: req.user.id,
      date,
      mood,
      text,
      title: title || 'Untitled', // Default title if empty
      label: label || 'Daily'
    });

    res.status(201).json(diary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. UPDATE DIARY
const updateDiary = async (req, res) => {
  try {
    const diary = await Diary.findById(req.params.id);

    if (!diary) {
      return res.status(404).json({ message: 'Diary not found' });
    }

    // Check user ownership
    if (diary.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedDiary = await Diary.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedDiary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. DELETE DIARY
const deleteDiary = async (req, res) => {
  try {
    const diary = await Diary.findById(req.params.id);

    if (!diary) {
      return res.status(404).json({ message: 'Diary not found' });
    }

    if (diary.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await diary.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. GET SINGLE DIARY (The new function!)
const getDiaryById = async (req, res) => {
  try {
    const diary = await Diary.findById(req.params.id);

    if (!diary) {
      return res.status(404).json({ message: 'Diary not found' });
    }

    // Ensure the user owns this diary
    if (diary.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(diary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// EXPORT EVERYTHING
module.exports = {
  getDiaries,
  createDiary,
  updateDiary,
  deleteDiary,
  getDiaryById 
};