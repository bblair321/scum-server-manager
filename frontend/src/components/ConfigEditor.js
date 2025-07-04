import React, { useEffect, useState } from 'react';
import styles from './ConfigEditor.module.css';

export default function ConfigEditor({ filename = 'ServerSettings.ini' }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/config/${filename}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch config');
        return res.json();
      })
      .then((data) => {
        setConfig(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [filename]);

  const handleChange = (section, key, value) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    fetch(`http://localhost:5000/api/config/${filename}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to save config');
        alert('Config saved!');
      })
      .catch((err) => alert(err.message));
  };

  if (loading) return <div>Loading config...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!config) return <div>No config loaded.</div>;

  return (
    <div className={styles.container}>
      <h2>Editing {filename}</h2>
      {Object.entries(config).map(([section, pairs]) => (
        <div key={section} className={styles.section}>
          <h3 className={styles.sectionTitle}>{section}</h3>
          {Object.entries(pairs).map(([key, value]) => (
            <div key={key} className={styles.field}>
              <label className={styles.label}>
                {key}:
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(section, key, e.target.value)}
                  className={styles.input}
                />
              </label>
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleSave} className={styles.saveButton}>
        Save Config
      </button>
    </div>
  );
}
