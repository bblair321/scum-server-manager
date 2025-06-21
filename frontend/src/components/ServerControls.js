import React, { useState, useEffect } from 'react';

export default function ServerControls() {
  const [status, setStatus] = useState('unknown');
  const [error, setError] = useState(null);

  const fetchStatus = () => {
    fetch('http://localhost:5000/api/server/status')
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.running ? 'running' : 'stopped');
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
    <div style={{ marginTop: 20 }}>
      <h2>Server Controls</h2>
      <button onClick={startServer} disabled={status === 'running'}>
        Start Server
      </button>
      <button onClick={stopServer} disabled={status !== 'running'} style={{ marginLeft: 10 }}>
        Stop Server
      </button>
      <p>Status: <strong>{status}</strong></p>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
}
