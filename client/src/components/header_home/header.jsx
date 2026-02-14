import React from 'react';
import styles from './header.module.css';
import { useAuth } from '../../context/AuthContext'; // Assuming this is where your auth lives

const Header = () => {
  const { logout } = useAuth(); // Get logout function

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Mood Diary</h1>
      
      <button onClick={logout} className={styles.logoutBtn} title="Logout">
        {/* Simple Logout SVG Icon */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      </button>
    </header>
  );
};

export default Header;