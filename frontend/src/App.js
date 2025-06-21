import React, { useState } from 'react';
import ConfigEditor from './components/ConfigEditor';
import ServerControls from './components/ServerControls';
import PlayerList from './components/PlayerList';
import ServerPath from './components/ServerPath';
import styles from './App.module.css';

function App() {
  const [filename, setFilename] = useState('ServerSettings.ini');

  return (
    <div className={styles.container}>
      <h1>SCUM Server Manager</h1>

      <label className={styles.selectLabel}>
        Select config file:&nbsp;
        <select value={filename} onChange={(e) => setFilename(e.target.value)}>
          <option value="ServerSettings.ini">ServerSettings.ini</option>
          <option value="Game.ini">Game.ini</option>
        </select>
      </label>

      <ConfigEditor filename={filename} />
      <ServerControls />
      <PlayerList />
      <ServerPath />
    </div>
  );
}

export default App;
