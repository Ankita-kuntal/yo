import React, { useEffect, useRef, useState } from 'react';
import { moodList } from '../../utils/moodData';
import styles from './MoodWheel.module.css';

// TUNING
const FRICTION = 0.95; 
const SPEED = 0.006;   
const RADIUS = 170; 

const MoodWheel = ({ onMoodSelect, onClose }) => {
  const [rotation, setRotation] = useState(0);
  
  // Physics Refs
  const velocity = useRef(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const requestRef = useRef();
  const rotationRef = useRef(0);

  const animate = () => {
    if (!isDragging.current) {
      velocity.current *= FRICTION;
      if (Math.abs(velocity.current) < 0.0001) {
        velocity.current = 0;
      }
      rotationRef.current += velocity.current;
      setRotation(rotationRef.current);
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    
    // 1. LOCK SCROLLING (Make background static)
    document.body.style.overflow = 'hidden';

    // Global Listeners
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return () => {
      cancelAnimationFrame(requestRef.current);
      // 2. UNLOCK SCROLLING (When closed)
      document.body.style.overflow = 'auto';
      
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, []);

  const handleStart = (e) => {
    e.preventDefault(); 
    isDragging.current = true;
    lastX.current = e.touches ? e.touches[0].clientX : e.clientX;
    velocity.current = 0;
  };

  const handleMove = (e) => {
    if (!isDragging.current) return;
    const clientX = e.clientX;
    const delta = clientX - lastX.current;
    lastX.current = clientX;
    
    velocity.current = delta * SPEED;
    rotationRef.current += velocity.current;
    setRotation(rotationRef.current);
  };

  const handleTouchMove = (e) => {
    // Always prevent default to stop any background pull effects
    e.preventDefault(); 
    
    if (!isDragging.current) return;
    const clientX = e.touches[0].clientX;
    const delta = clientX - lastX.current;
    lastX.current = clientX;

    velocity.current = delta * SPEED;
    rotationRef.current += velocity.current;
    setRotation(rotationRef.current);
  };

  const handleEnd = () => {
    isDragging.current = false;
  };

  return (
    <div 
      className={styles.overlay} 
      onMouseDown={handleStart}
      onTouchStart={handleStart}
    >
      <div className={styles.instruction}>Spin & Choose!</div>

      <div className={styles.wheelContainer}>
        <div className={styles.wheel}>
          {moodList.map((mood, index) => {
            const total = moodList.length;
            const angle = (Math.PI * 2 / total) * index + rotation;
            
            const x = Math.cos(angle - Math.PI / 2) * RADIUS;
            const y = Math.sin(angle - Math.PI / 2) * RADIUS;

            return (
              <div 
                key={mood.name}
                className={styles.moodItem}
                style={{
                  transform: `translate(${x}px, ${y}px)`
                }}
              >
                <button 
                  className={styles.moodBtn}
                  onClick={(e) => {
                    e.stopPropagation(); 
                    onMoodSelect(mood.name);
                  }}
                >
                  <img 
                    src={mood.image} 
                    alt={mood.name} 
                    className={styles.moodImage}
                    draggable="false" 
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className={styles.closeZone} onClick={onClose}></div>
    </div>
  );
};

export default MoodWheel;