import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDiaries } from '../../api/diaryApi';
import Card from '../../components/card/card';
import MoodWheel from '../../components/moodWheel/MoodWheel';
import Header from '../../components/header_home/header'; // 👈 IMPORT THE NEW HEADER
import styles from './home.module.css';

const Home = () => {
  const navigate = useNavigate();
  // We removed 'useAuth' from here because Header handles logout now!
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWheel, setShowWheel] = useState(false);

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

  const handleAddClick = () => {
    setShowWheel(true);
  };

  const handleMoodSelect = (mood) => {
    setShowWheel(false);
    navigate('/new-memory', { state: { selectedMood: mood } });
  };

  return (
    <section className={styles.home}>
      {/* 👇 NEW HEADER IS HERE */}
      <Header />

      {/* RECENT MEMORIES HEADER */}
      <div className={styles.sectionHeader}>
        <h2>Recent Memories</h2>
        <button className={styles.viewAllBtn} onClick={() => navigate('/all-memories')}>
          View All →
        </button>
      </div>

      {/* THE GRID (Limit to 6) */}
      <div className={styles.gridContainer}>
        {loading ? (
          <p>Loading...</p>
        ) : diaries.length > 0 ? (
          diaries.slice(0, 6).map((d) => (
            <div key={d._id} onClick={() => navigate(`/memory/${d._id}`)} style={{cursor: 'pointer'}}>
               <Card diary={d} />
            </div>
          ))
        ) : (
          <p className={styles.noEntries}>No memories yet. Tap + to add one!</p>
        )}
      </div>

      <button className={styles.fab} onClick={handleAddClick}>+</button>

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