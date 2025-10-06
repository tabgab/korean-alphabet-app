import React, { useState } from 'react';
import './App.css';

// Import components (we'll create these next)
import Header from './components/Header';
import Navigation from './components/Navigation';
import LearnSection from './components/LearnSection';
import PracticeSection from './components/PracticeSection';
import WordBuilderSection from './components/WordBuilderSection';
import ProgressSection from './components/ProgressSection';
import CheatSheetSection from './components/CheatSheetSection';
import { ProgressProvider } from './context/ProgressContext';

function App() {
  const [currentSection, setCurrentSection] = useState('learn');

  const renderSection = () => {
    switch (currentSection) {
      case 'learn':
        return <LearnSection />;
      case 'practice':
        return <PracticeSection />;
      case 'wordbuilder':
        return <WordBuilderSection />;
      case 'progress':
        return <ProgressSection />;
      case 'cheatsheet':
        return <CheatSheetSection />;
      default:
        return <LearnSection />;
    }
  };

  return (
    <ProgressProvider>
      <div className="App">
        <Header />
        <div className="app-container">
          <Navigation
            currentSection={currentSection}
            setCurrentSection={setCurrentSection}
          />
          <main
            className="main-content"
            role="main"
            aria-label="Korean alphabet learning content"
          >
            {renderSection()}
          </main>
        </div>
      </div>
    </ProgressProvider>
  );
}

export default App;