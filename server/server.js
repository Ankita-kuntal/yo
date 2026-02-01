require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const diaryRoutes = require('./routes/diaryRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect("mongodb+srv://ankitaa3586_db_user:lCxvK9hiHAMGJYVW@cluster0.qsw9n16.mongodb.net/mood-diary?appName=Cluster0")
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// USE ROUTES
app.use('/api/auth', authRoutes); // <--- This enables /api/auth/login
app.use('/api/diaries', diaryRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));