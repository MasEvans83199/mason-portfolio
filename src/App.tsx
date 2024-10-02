import React, { useState, useEffect } from 'react';
import Terminal from './components/Terminal';
import './styles/global.css';

const App: React.FC = () => {
  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    const bootTimer = setTimeout(() => setBootComplete(true), 3000);
    return () => clearTimeout(bootTimer);
  }, []);

  return (
    <div className="App">
      <div className="terminal-container">
        {!bootComplete ? (
          <div className="boot-screen">
            <div className="boot-text">
              Initializing Portfolio OS...
              <div className="progress-bar">
                <div className="progress"></div>
              </div>
            </div>
          </div>
        ) : (
          <Terminal />
        )}
      </div>
    </div>
  );
};

export default App;