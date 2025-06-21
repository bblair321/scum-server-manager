import React, { useState, useEffect } from 'react';
import styles from './ServerPath.module.css';

export default function ServerPath() {
  const [path, setPath] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/server/path')
      .then((res) => res.json())
      .then((data) => setPath(data.path || ''))
      .catch(() => setMessage('Failed to load server path.'));
  }, []);

  const savePath = () => {
    fetch('http://localhost:5000/api/server/path', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    })
      .then((res) => res.json())
      .then(() => setMessage('Saved successfully!'))
      .catch(() => setMessage('Failed to save path.'));
  };

  return (
    <div className={styles.container}>
      <h2>SCUM Server Path</h2>
      <input
        type="text"
        value={path}
        onChange={(e) => setPath(e.target.value)}
        className={styles.input}
      />
      <button onClick={savePath} className={styles.button}>
        Save Path
      </button>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
