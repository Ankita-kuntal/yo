const express = require('express');
const router = express.Router();

// 1. IMPORT getDiaryById HERE 👇
const { 
  getDiaries, 
  createDiary, 
  updateDiary, 
  deleteDiary, 
  getDiaryById   // <--- Add this!
} = require('../controllers/diaryController');

const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getDiaries)
  .post(protect, createDiary);

// 2. ADD THE .get() ROUTE HERE 👇
router.route('/:id')
  .get(protect, getDiaryById)    // <--- This allows "View Single Entry"
  .delete(protect, deleteDiary)
  .put(protect, updateDiary);

module.exports = router;