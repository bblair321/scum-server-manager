import React, { useState } from 'react';

export default function ServerControls() {
  const [status, setStatus] = useState('stopped');
  const [error, setError] = useState(null);

  const startServer = () => {
    fetch('http://localhost:5000/api/server/start', { method: 'POST' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to start server');
        return res.json();
      })
      .then(data => {
        setStatus('starting');
        setError(null);
      })
      .catch(err => setError(err.message));
  };

  const stopServer = () => {
    fetch('http://localhost:5000/api/server/stop', { method: 'POST' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to stop server');
        return res.json();
      })
      .then(data => {
        setStatus('stopped');
        setError(null);
      })
      .catch(err => setError(err.message));
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Server Controls</h2>
      <button onClick={startServer} disabled={status === 'starting'}>
        Start Server
      </button>
      <button onClick={stopServer} disabled={status === 'stopped'} style={{ marginLeft: 10 }}>
        Stop Server
      </button>
      <p>Status: <strong>{status}</strong></p>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
}
