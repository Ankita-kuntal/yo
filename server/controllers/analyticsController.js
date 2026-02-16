const Diary = require('../models/Diary');

// Get user analytics
const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all user entries
    const allEntries = await Diary.find({ user: userId }).sort({ date: -1 });

    if (allEntries.length === 0) {
      return res.json({
        totalEntries: 0,
        streak: 0,
        mostCommonMood: null,
        entriesThisMonth: 0,
        moodDistribution: [],
        entriesOverTime: [],
        averageLength: 0
      });
    }

    // Total entries
    const totalEntries = allEntries.length;

    // Mood distribution
    const moodCount = {};
    allEntries.forEach(entry => {
      moodCount[entry.mood] = (moodCount[entry.mood] || 0) + 1;
    });

    const moodDistribution = Object.keys(moodCount).map(mood => ({
      mood,
      count: moodCount[mood]
    }));

    // Most common mood
    const mostCommonMood = Object.keys(moodCount).reduce((a, b) => 
      moodCount[a] > moodCount[b] ? a : b
    );

    // Entries this month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const entriesThisMonth = allEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === currentMonth && 
             entryDate.getFullYear() === currentYear;
    }).length;

    // Calculate streak (consecutive days)
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sortedDates = allEntries
      .map(e => new Date(e.date))
      .sort((a, b) => b - a);

    let checkDate = new Date(today);
    
    for (let date of sortedDates) {
      date.setHours(0, 0, 0, 0);
      const diff = Math.floor((checkDate - date) / (1000 * 60 * 60 * 24));
      
      if (diff === 0 || diff === 1) {
        streak++;
        checkDate = new Date(date);
      } else {
        break;
      }
    }

    // Entries over time (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const entriesOverTime = {};
    allEntries.forEach(entry => {
      const date = new Date(entry.date);
      if (date >= sixMonthsAgo) {
        const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        entriesOverTime[monthYear] = (entriesOverTime[monthYear] || 0) + 1;
      }
    });

    const entriesOverTimeArray = Object.keys(entriesOverTime).map(key => ({
      month: key,
      count: entriesOverTime[key]
    })).reverse();

    // Average entry length
    const totalWords = allEntries.reduce((sum, entry) => {
      return sum + entry.text.split(' ').length;
    }, 0);
    const averageLength = Math.round(totalWords / totalEntries);

    res.json({
      totalEntries,
      streak,
      mostCommonMood,
      entriesThisMonth,
      moodDistribution,
      entriesOverTime: entriesOverTimeArray,
      averageLength
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};

module.exports = { getAnalytics };