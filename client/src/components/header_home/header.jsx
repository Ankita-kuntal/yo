import React from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './header.module.css';

const Header = () => {
  const { logout } = useAuth();

  return (
    <header className={styles.header}>
      {/* Tilted Paper Title */}
      <div className={styles.paperTitle}>
        Mood Diary
      </div>
      
      {/* Aesthetic Doodle Door */}
      <button onClick={logout} className={styles.logoutBtn} title="Log Out">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
      </button>
    </header>
  );
};

export default Header;