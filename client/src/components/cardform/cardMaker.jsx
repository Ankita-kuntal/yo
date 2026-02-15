import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createDiary, updateDiary } from '../../api/diaryApi'; 
import { moodList } from '../../utils/moodData'; 
import styles from './cardMaker.module.css';

const CardMaker = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const imageRef = useRef(null);
  
  // Check if we're in edit mode
  const editMode = location.state?.editMode || false;
  const existingDiary = location.state?.diaryData || null;
  
  // Get mood from navigation state (default to Happy if missing)
  const initialMood = editMode ? existingDiary.mood : (location.state?.selectedMood || 'Happy');

  const [moodName, setMoodName] = useState(initialMood);
  const [text, setText] = useState(editMode ? existingDiary.text : '');
  const [title, setTitle] = useState(editMode ? existingDiary.title : '');
  const [date, setDate] = useState(
    editMode ? existingDiary.date.split('T')[0] : new Date().toISOString().split('T')[0]
  ); 
  const [image, setImage] = useState(editMode && existingDiary.image ? existingDiary.image : null);
  const [loading, setLoading] = useState(false);
  const [showMoodSelector, setShowMoodSelector] = useState(false);

  const currentMoodObj = moodList.find(m => m.name === moodName) || moodList[0];

  // Adjust textarea height to match image height
  useEffect(() => {
    if (image && imageRef.current && textareaRef.current) {
      const adjustHeight = () => {
        const imageHeight = imageRef.current.offsetHeight;
        if (imageHeight > 0) {
          // Set textarea height to match image height
          textareaRef.current.style.height = `${Math.max(imageHeight, 300)}px`;
        }
      };

      // Adjust after image loads
      if (imageRef.current.complete) {
        adjustHeight();
      } else {
        imageRef.current.onload = adjustHeight;
      }

      // Also adjust on window resize
      window.addEventListener('resize', adjustHeight);
      return () => window.removeEventListener('resize', adjustHeight);
    } else if (!image && textareaRef.current) {
      // Reset to default height when no image
      textareaRef.current.style.height = '250px';
    }
  }, [image]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const diaryData = { 
        date, 
        mood: moodName, 
        text,
        title: title || 'Untitled',
        label: 'Daily',
        image: image || undefined
      };

      if (editMode) {
        // Update existing entry
        await updateDiary(existingDiary._id, diaryData);
      } else {
        // Create new entry
        await createDiary(diaryData);
      }
      
      navigate('/dashboard'); // Go back home after saving
    } catch (error) {
      // Better error handling
      if (error.response && error.response.status === 400) {
        alert("⚠️ You already have an entry for this date! Please choose a different date or edit the existing entry.");
      } else {
        alert("Error saving: " + error.message);
      }
      setLoading(false);
    }
  };

  const handleAddImage = () => {
    // Trigger file input click
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file!');
        return;
      }

      // Convert to base64 or blob URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    const confirmed = window.confirm('Are you sure you want to remove this image?');
    if (confirmed) {
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleMoodClick = () => {
    setShowMoodSelector(!showMoodSelector);
  };

  const handleMoodSelect = (mood) => {
    setMoodName(mood.name);
    setShowMoodSelector(false);
  };

  // Format date parts
  const dateObj = new Date(date);
  const monthYear = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const dayNumber = dateObj.getDate();

  return (
    <div className={styles.pageWrapper}>
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className={styles.backBtn}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>

      {/* Save Button - Top Right */}
      <button onClick={handleSubmit} disabled={loading} className={styles.saveBtn}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </button>

      {/* Month and Year - Top center */}
      <div className={styles.monthYear}>{monthYear.toUpperCase()}</div>

      {/* Hidden File Input */}
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Main Container */}
      <div className={styles.container}>
        {/* Header with Date and Mood - INSIDE CONTAINER */}
        <div className={styles.header}>
          <div className={styles.dateSection}>
            <div className={styles.dayNumber}>{dayNumber}</div>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className={styles.dayNameInput}
              disabled={editMode}
            />
          </div>
          
          <div className={styles.moodSection}>
            <div className={styles.moodWrapper}>
              <img 
                src={currentMoodObj.image} 
                alt={moodName} 
                className={styles.moodIcon}
                onClick={handleMoodClick}
                title="Click to change mood"
              />
              {showMoodSelector && (
                <div className={styles.moodSelector}>
                  {moodList.map((mood) => (
                    <div 
                      key={mood.name}
                      className={styles.moodOption}
                      onClick={() => handleMoodSelect(mood)}
                    >
                      <img src={mood.image} alt={mood.name} />
                      <span>{mood.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Title Input */}
        <input 
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title..."
          className={styles.titleInput}
        />

        {/* Content Section with Text and Image */}
        <div className={styles.contentSection}>
          <textarea 
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your story..."
            className={styles.textInput}
            required
          />
          {image && (
            <div className={styles.imageContent}>
              <img ref={imageRef} src={image} alt="Memory" />
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons - OUTSIDE container, below it */}
      <div className={styles.actionButtons}>
        <button onClick={handleAddImage} className={styles.addImageBtn} title="Add Image from System">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </button>
        
        <button onClick={handleDeleteImage} className={styles.deleteImageBtn} title="Delete Image" disabled={!image}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CardMaker;