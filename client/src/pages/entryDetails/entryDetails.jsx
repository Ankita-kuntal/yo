import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDiaryById, deleteDiary } from '../../api/diaryApi';
import { moodList } from '../../utils/moodData';
import styles from './entryDetails.module.css';

const EntryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diary, setDiary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEntry = async () => {
      try {
        const data = await fetchDiaryById(id);
        setDiary(data);
      } catch (error) {
        console.error("Failed to load", error);
      } finally {
        setLoading(false);
      }
    };
    loadEntry();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this memory? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await deleteDiary(id);
      navigate('/dashboard');
    } catch (error) {
      alert('Failed to delete entry: ' + error.message);
    }
  };

  const handleEdit = () => {
    // Navigate to /new-memory with edit mode
    navigate('/new-memory', { state: { editMode: true, diaryData: diary } });
  };

  if (loading) return <div className={styles.loading}>Loading Memory...</div>;
  if (!diary) return <div className={styles.notFound}>Entry not found.</div>;

  // Find mood image
  const moodObj = moodList.find(m => m.name === diary.mood) || moodList[0];

  // Format date parts
  const dateObj = new Date(diary.date);
  const monthYear = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const dayNumber = dateObj.getDate();

  return (
    <div className={styles.pageWrapper}>
      {/* Back Button with Arrow Icon */}
      <button onClick={() => navigate(-1)} className={styles.backBtn}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>

      {/* Month and Year - Top center */}
      <div className={styles.monthYear}>{monthYear.toUpperCase()}</div>

      {/* Main Container */}
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.dateSection}>
            <div className={styles.dayNumber}>{dayNumber}</div>
            <div className={styles.dayName}>{dayName}</div>
          </div>
          
          <div className={styles.moodSection}>
            <img src={moodObj.image} alt={diary.mood} className={styles.moodIcon} />
          </div>
        </div>

        <h1 className={styles.title}>{diary.title}</h1>

        <div className={styles.contentSection}>
          <div className={styles.textContent}>
            <p>{diary.text}</p>
          </div>
          {diary.imageUrl && (
  <div className={styles.imageContent}>
    <img 
      src={diary.imageUrl} 
      alt="Memory"
      onError={(e) => {
        console.error('Failed to load image:', diary.image);
        e.target.style.display = 'none';
      }}
      onLoad={() => console.log('Image loaded successfully:', diary.image)}
    />
  </div>
)}
        </div>
      </div>

      {/* Action Buttons - OUTSIDE container, below it */}
      <div className={styles.actionButtons}>
        <button onClick={handleEdit} className={styles.editBtn} title="Edit Entry">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        
        <button onClick={handleDelete} className={styles.deleteBtn} title="Delete Entry">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default EntryDetails;