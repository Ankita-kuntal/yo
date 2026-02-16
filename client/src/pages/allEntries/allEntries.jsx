import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDiaries } from '../../api/diaryApi';
import Card from '../../components/card/card';
import styles from './allEntries.module.css';

const AllEntries = () => {
  const navigate = useNavigate();
  const [diaries, setDiaries] = useState([]);
  const [filter, setFilter] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [filteredDiaries, setFilteredDiaries] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchDiaries();
      setDiaries(data);
      setFilteredDiaries(data);
    };
    load();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = diaries;

    // 1. Text Search (Title or Mood)
    if (filter) {
      result = result.filter(d => 
        d.title.toLowerCase().includes(filter.toLowerCase()) || 
        d.mood.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // 2. Date Search
    if (searchDate) {
      result = result.filter(d => d.date.startsWith(searchDate));
    }

    setFilteredDiaries(result);
  }, [filter, searchDate, diaries]);

  return (
    <div className={styles.container}>
      {/* UPDATED HEADER WITH ANALYTICS BUTTON */}
      <div className={styles.header}>
        <button onClick={() => navigate('/dashboard')} className={styles.backBtn}>
          ← Home
        </button>
        <h1>All Memories 📚</h1>
        <button onClick={() => navigate('/analytics')} className={styles.analyticsBtn}>
          📊 Analytics
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className={styles.searchBar}>
        <input 
          type="text" 
          placeholder="Search by mood or title..." 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={styles.searchInput}
        />
        <input 
          type="date" 
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className={styles.dateInput}
        />
      </div>

      <div className={styles.grid}>
        {filteredDiaries.map(d => (
          <div key={d._id} onClick={() => navigate(`/memory/${d._id}`)}>
            <Card diary={d} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllEntries;