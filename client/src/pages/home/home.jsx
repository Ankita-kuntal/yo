import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDiaries } from '../../api/diaryApi';
import Card from '../../components/card/card';
import MoodWheel from '../../components/moodWheel/MoodWheel'; // Import Wheel
import { useAuth } from '../../context/AuthContext';
import styles from './home.module.css';

const Home = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWheel, setShowWheel] = useState(false); // Control wheel visibility

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await fetchDiaries();
      setDiaries(data);
    } finally {
      setLoading(false);
    }
  };

  // 1. Click "+" -> Show Wheel (on this page)
  const handleAddClick = () => {
    setShowWheel(true);
  };

  // 2. Select Mood -> Navigate to Editor Page with mood state
  // ... inside Home component

  const handleMoodSelect = (mood) => {
    setShowWheel(false);
    // Go DIRECTLY to the editor page
    navigate('/new-memory', { state: { selectedMood: mood } });
  };

  return (
    <section className={styles.home}>
      <button onClick={logout} className={styles.logoutBtn}>Logout</button>
      <h1 className={styles.appTitle}>Mood Diary</h1>

      {/* RECENT MEMORIES HEADER */}
      <div className={styles.sectionHeader}>
        <h2>Recent Memories</h2>
        <button className={styles.viewAllBtn} onClick={() => navigate('/all-memories')}>
          View All →
        </button>
      </div>

      {/* THE GRID (Limit to 4) */}
      <div className={styles.gridContainer}>
        {loading ? (
          <p>Loading...</p>
        ) : diaries.length > 0 ? (
          // SLICE TAKES ONLY THE FIRST 6
          diaries.slice(0, 6).map((d) => (
            <div key={d._id} onClick={() => navigate(`/memory/${d._id}`)} style={{cursor: 'pointer'}}>
               <Card diary={d} />
            </div>
          ))
        ) : (
          <p className={styles.noEntries}>No memories yet. Tap + to add one!</p>
        )}
      </div>

      {/* THE FLOATING "+" BUTTON (Bottom Middle) */}
      <button className={styles.fab} onClick={handleAddClick}>
        +
      </button>

      {/* THE WHEEL POPUP (Blurs background) */}
      {showWheel && (
        <MoodWheel 
          onMoodSelect={handleMoodSelect} 
          onClose={() => setShowWheel(false)} 
        />
      )}

    </section>
  );
};

export default Home;