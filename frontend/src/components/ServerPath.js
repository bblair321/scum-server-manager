import React, { useState, useEffect } from 'react';
import styles from './ServerPath.module.css';

export default function ServerPath() {
  const [serverPath, setServerPath] = useState('');
  const [logPath, setLogPath] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch both paths
    fetch('http://localhost:5000/api/server/path')
      .then((res) => res.json())
      .then((data) => {
        setServerPath(data.path || '');
      });

    fetch('http://localhost:5000/api/server/log-path')
      .then((res) => res.json())
      .then((data) => {
        setLogPath(data.logPath || '');
      })
      .catch(() => setMessage('Failed to load log path.'));
  }, []);

  const savePaths = () => {
    const serverPathRequest = fetch('http://localhost:5000/api/server/path', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: serverPath }),
    });

    const logPathRequest = fetch('http://localhost:5000/api/server/log-path', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logPath }),
    });

    Promise.all([serverPathRequest, logPathRequest])
      .then(() => setMessage('Paths saved successfully!'))
      .catch(() => setMessage('Failed to save one or more paths.'));
  };

  return (
    <div className={styles.container}>
      <h2>SCUM Server Configuration</h2>

      <label className={styles.label}>
        Server Executable Path:
        <input
          type="text"
          value={serverPath}
          onChange={(e) => setServerPath(e.target.value)}
          className={styles.input}
        />
      </label>

      <label className={styles.label}>
        Log File Path:
        <input
          type="text"
          value={logPath}
          onChange={(e) => setLogPath(e.target.value)}
          className={styles.input}
        />
      </label>

      <button onClick={savePaths} className={styles.button}>
        Save Paths
      </button>

      <p className={styles.message}>{message}</p>
    </div>
  );
}
