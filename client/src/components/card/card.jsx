import React from 'react';
import { moodList } from '../../utils/moodData';
import styles from './card.module.css';


const Card = ({ diary }) => {
  const moodObj = moodList.find((m) => m.name === diary.mood) || moodList[0];

  // 1. UPDATE DATE FORMATTING (Remove Time)
  const dateObj = new Date(diary.date);
  // Just Month and Day now (e.g., "Jan 28")
  const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  // REMOVED THE timeStr VARIABLE

  return (
    <div className={styles.card} style={{backgroundColor: diary.color || '#fff9c4'}}>
      <div className={styles.cardHeader}>
        {/* 2. UPDATE BADGE CONTENT (Only DateStr) */}
        <div className={styles.dateBadge}>
          {dateStr}
        </div>
        
        <div className={styles.moodEmoji} title={diary.mood}>
           <img src={moodObj.image} alt={diary.mood} width="45" />
        </div>
      </div>

      <h3 className={styles.title}>{diary.title}</h3>
      <p className={styles.preview}>{diary.text}</p>
    </div>
  );
};

export default Card;