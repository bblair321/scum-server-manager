import React, { useEffect, useState } from 'react';
import styles from './PlayerList.module.css';

export default function PlayerList() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/players')
      .then((res) => res.json())
      .then(setPlayers)
      .catch((err) => console.error('Failed to fetch players:', err));
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Online Players</h2>
      {players.length === 0 ? (
        <p className={styles.noPlayers}>No players online.</p>
      ) : (
        <ul className={styles.list}>
          {players.map((player) => (
            <li key={player.id} className={styles.listItem}>
              {player.name} (ID: {player.id})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
