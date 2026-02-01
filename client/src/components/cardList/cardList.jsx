import React from 'react';
import Card from '../card/card'; // We import the single Card component
import styles from './cardList.module.css';

const CardList = ({ diaries }) => {
  if (!diaries || diaries.length === 0) {
    return <p className={styles.empty}>No memories yet. Write your first one!</p>;
  }

  return (
    <div className={styles.grid}>
      {diaries.map((diary) => (
        // Pass the "diary" data to the Card
        <Card key={diary._id} diary={diary} />
      ))}
    </div>
  );
};

export default CardList;