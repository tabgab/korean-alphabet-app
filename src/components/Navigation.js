import React from 'react';

const Navigation = ({ currentSection, setCurrentSection }) => {
  const navItems = [
    {
      id: 'learn',
      label: 'Learn',
      icon: '📚',
      ariaLabel: 'Learn Korean letters and pronunciation'
    },
    {
      id: 'practice',
      label: 'Practice',
      icon: '🎯',
      ariaLabel: 'Practice exercises for Korean letters'
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: '📊',
      ariaLabel: 'View your learning progress and achievements'
    },
    {
      id: 'cheatsheet',
      label: 'Cheat Sheet',
      icon: '📋',
      ariaLabel: 'Quick reference for all Korean letters'
    }
  ];

  return (
    <nav className="app-navigation" role="navigation" aria-label="Main navigation">
      <div className="nav-container">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentSection === item.id ? 'active' : ''}`}
            onClick={() => setCurrentSection(item.id)}
            aria-label={item.ariaLabel}
            aria-pressed={currentSection === item.id}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;