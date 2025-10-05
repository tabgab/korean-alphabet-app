import React from 'react';
import { useProgress } from '../context/ProgressContext';

const Header = () => {
  const { getOverallProgress } = useProgress();

  return (
    <header className="app-header" role="banner">
      <div className="header-content">
        <div className="header-title">
          <h1>한글 Learn Korean</h1>
          <p className="subtitle">Master the Korean alphabet (Hangul) with interactive lessons</p>
        </div>

        <div className="progress-indicator">
          <span className="progress-label">Progress</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${getOverallProgress()}%` }}
            ></div>
          </div>
          <span className="progress-text">{getOverallProgress()}%</span>
        </div>
      </div>
    </header>
  );
};

export default Header;