import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDiaryById } from '../../api/diaryApi';
import { moodList } from '../../utils/moodData';
import styles from './entryDetails.module.css'; // We'll create this next

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

  if (loading) return <div className="loading">Loading Memory...</div>;
  if (!diary) return <div>Entry not found.</div>;

  // Find mood image
  const moodObj = moodList.find(m => m.name === diary.mood) || moodList[0];

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backBtn}>← Back</button>
      
      <div className={styles.paper}>
        <div className={styles.header}>
            <div className={styles.date}>{new Date(diary.date).toDateString()}</div>
            <div className={styles.moodBadge} style={{backgroundColor: moodObj.color}}>
                <img src={moodObj.image} alt={diary.mood} className={styles.moodIcon}/>
                <span>{diary.mood}</span>
            </div>
        </div>

        <h1 className={styles.title}>{diary.title}</h1>
        <p className={styles.text}>{diary.text}</p>
      </div>
    </div>
  );
};

export default EntryDetails;