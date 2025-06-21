import React, { useState } from 'react';
import ConfigEditor from './components/ConfigEditor';

function App() {
  const [filename, setFilename] = useState('ServerSettings.ini');

  return (
    <div style={{ padding: 20 }}>
      <h1>SCUM Server Manager</h1>

      <label>
        Select config file:&nbsp;
        <select value={filename} onChange={(e) => setFilename(e.target.value)}>
          <option value="ServerSettings.ini">ServerSettings.ini</option>
          <option value="Game.ini">Game.ini</option>
        </select>
      </label>

      <ConfigEditor filename={filename} />
    </div>
  );
}

export default App;
