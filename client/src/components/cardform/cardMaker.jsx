import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createDiary } from '../../api/diaryApi'; 
import { moodList } from '../../utils/moodData'; 
import styles from './cardMaker.module.css';

const CardMaker = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get mood from navigation state (default to Happy if missing)
  const initialMood = location.state?.selectedMood || 'Happy';

  const [moodName, setMoodName] = useState(initialMood);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); 
  const [loading, setLoading] = useState(false);

  const currentMoodObj = moodList.find(m => m.name === moodName) || moodList[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createDiary({ 
        date, 
        mood: moodName, 
        text,
        title: title || 'Untitled',
        label: 'Daily'
      });
      navigate('/dashboard'); // Go back home after saving
    } catch (error) {
      alert("Error saving: " + error.message);
      setLoading(false);
    }
  };

  return (
    <section className={styles.maker}>
      {/* HEADER: Big Quokka Display */}
      <div className={styles.selectedDisplay}>
        <img src={currentMoodObj.image} alt="Selected" className={styles.bigQuokka} />
        <div className={styles.moodLabel} style={{backgroundColor: currentMoodObj.color}}>
           {currentMoodObj.description}
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input 
          type="text" 
          placeholder="Title (e.g., Best Day Ever!)" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          className={styles.titleInput} 
        />

        <div className={styles.row}>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            className={styles.dateInput}
            required 
          />
          <button type="button" onClick={() => navigate('/dashboard')} className={styles.changeMoodBtn}>
             Change Mood (Cancel)
          </button>
        </div>
        
        <textarea 
          placeholder="Write your story..." 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          className={styles.textInput}
          required
        />
        
        <button 
          type="submit" 
          disabled={loading} 
          className={styles.submitBtn}
          style={{backgroundColor: currentMoodObj.color}}
        >
          {loading ? 'Saving...' : 'Add to Diary'}
        </button>
      </form>
    </section>
  );
};

export default CardMaker;