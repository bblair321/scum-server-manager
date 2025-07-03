import React, { useEffect, useState } from 'react';
import styles from './PlayerList.module.css';

export default function PlayerList() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/api/players')
      .then((res) => res.json())
      .then((data) => setCount(data.count || 0))
      .catch((err) => console.error('Failed to fetch player count:', err));
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Online Players</h2>
      <p className={styles.count}>
        {count === 0 ? 'No players online.' : `${count} player(s) online.`}
      </p>
    </div>
  );
}
