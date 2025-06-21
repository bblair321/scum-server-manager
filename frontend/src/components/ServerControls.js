import React, { useState, useEffect } from 'react';
import styles from './ServerControls.module.css';

export default function ServerControls() {
  const [status, setStatus] = useState('unknown');
  const [error, setError] = useState(null);

  const fetchStatus = () => {
    fetch('http://localhost:5000/api/server/status')
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.running ? 'running' : 'stopped');
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to fetch status:', err);
        setStatus('unknown');
      });
  };

  const startServer = () => {
    fetch('http://localhost:5000/api/server/start', { method: 'POST' })
      .then(res => res.json())
      .then(() => fetchStatus())
      .catch(err => setError(err.message));
  };

  const stopServer = () => {
    fetch('http://localhost:5000/api/server/stop', { method: 'POST' })
      .then(res => res.json())
      .then(() => fetchStatus())
      .catch(err => setError(err.message));
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <h2>Server Controls</h2>
      <button
        onClick={startServer}
        disabled={status === 'running'}
        className={styles.button}
      >
        Start Server
      </button>
      <button
        onClick={stopServer}
        disabled={status !== 'running'}
        className={styles.button}
      >
        Stop Server
      </button>
      <p>
        Status: <span className={styles.status}>{status}</span>
      </p>
      {error && <p className={styles.error}>Error: {error}</p>}
    </div>
  );
}
