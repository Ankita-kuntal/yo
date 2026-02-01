import React from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './header.module.css'; // Ensure you have this file

const Header = () => {
  const { logout, user } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/images/logo.png" alt="Logo" style={{height: '40px'}} />
        <span>Mood Diary</span>
      </div>
      
      <div className={styles.actions}>
         {/* Simple Logout Button */}
        <button onClick={logout} className={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;