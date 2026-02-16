import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnalytics } from '../../api/analyticsApi';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './analytics.module.css';

const Analytics = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await getAnalytics();
      setAnalytics(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading analytics...</div>;
  }

  if (!analytics || analytics.totalEntries === 0) {
    return (
      <div className={styles.pageWrapper}>
        <button onClick={() => navigate('/all-memories')} className={styles.backBtn}>
          ← Back
        </button>
        <div className={styles.emptyState}>
          <h2>No Data Yet!</h2>
          <p>Start writing entries to see your analytics</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF', '#C7CEEA', '#FFA07A'];

  return (
    <div className={styles.pageWrapper}>
      {/* Header */}
      <div className={styles.header}>
        <button onClick={() => navigate('/all-memories')} className={styles.backBtn}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className={styles.title}>📊 Your Analytics</h1>
      </div>

      {/* Statistics Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📝</div>
          <div className={styles.statValue}>{analytics.totalEntries}</div>
          <div className={styles.statLabel}>Total Entries</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🔥</div>
          <div className={styles.statValue}>{analytics.streak}</div>
          <div className={styles.statLabel}>Day Streak</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>😊</div>
          <div className={styles.statValue}>{analytics.mostCommonMood}</div>
          <div className={styles.statLabel}>Most Common Mood</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📅</div>
          <div className={styles.statValue}>{analytics.entriesThisMonth}</div>
          <div className={styles.statLabel}>This Month</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className={styles.chartsContainer}>
        {/* Mood Distribution */}
        <div className={styles.chartCard}>
          <h3>Mood Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.moodDistribution}
                dataKey="count"
                nameKey="mood"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.mood}: ${entry.count}`}
              >
                {analytics.moodDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Entries Over Time */}
        <div className={styles.chartCard}>
          <h3>Entries Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.entriesOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#4ECDC4" strokeWidth={2} name="Entries" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Stats */}
      <div className={styles.additionalStats}>
        <div className={styles.statItem}>
          <span className={styles.statItemLabel}>Average Entry Length:</span>
          <span className={styles.statItemValue}>{analytics.averageLength} words</span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;