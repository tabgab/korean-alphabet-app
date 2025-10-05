import React, { useState } from 'react';
import { koreanAlphabet } from '../koreanAlphabetData';
import { useProgress } from '../context/ProgressContext';

// Pictogram mapping for visual learning
const pictogramMap = {
  'square-angle': '⊏',
  'line-horizontal': '─',
  'line-vertical': '│',
  'line-diagonal': '╲',
  'square': '□',
  'circle': '○',
  'circle-half': '◐',
  'triangle': '△',
  'angle-right': '∟',
  'zap': '⚡',
  'h-square': '⊏',
  'bars': '≡',
  'table': '⊤',
  'r': '◟',
  's': 'Ͻ',
  't': '┬',
  'y': '◠',
  'trident': 'Ψ',
  'omega': 'Ω',
  'angle': '∠',
  'plus': '+',
  'star': '⭐'
};

const getPictogram = (iconName) => {
  return pictogramMap[iconName] || '◇';
};

const CheatSheetSection = () => {
  const { isLetterUnlocked, getBestScore, isLetterCompleted } = useProgress();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('unlocked');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const filteredLetters = koreanAlphabet.filter(letter => {
    const unlocked = isLetterUnlocked(letter.id);
    const matchesSearch = letter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         letter.romanization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         letter.englishComparison.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' ||
                         (filter === 'unlocked' && unlocked) ||
                         (filter === 'completed' && isLetterCompleted(letter.id)) ||
                         letter.category === filter;
    return matchesSearch && matchesFilter;
  });

  const CheatSheetCard = ({ letter }) => {
    const unlocked = isLetterUnlocked(letter.id);
    const completed = isLetterCompleted(letter.id);
    const bestScore = getBestScore(letter.id);

    return (
      <div className={`cheatsheet-card ${unlocked ? 'unlocked' : 'locked'} ${completed ? 'completed' : ''}`}>
        <div className="card-header">
          <div className="letter-visual">
            <span className={`korean-letter-display ${unlocked ? '' : 'locked'}`}>
              {letter.koreanLetter}
            </span>
            <div className="pictogram-display">{getPictogram(letter.pictogram)}</div>
          </div>
          <div className="letter-info">
            <h3>{letter.name}</h3>
            <p className="pronunciation">/{letter.romanization}/</p>
            {unlocked && (
              <div className="letter-badges">
                <span className={`status-badge ${completed ? 'completed' : 'available'}`}>
                  {completed ? '✓ Completed' : 'Available'}
                </span>
                {completed && (
                  <span className="score-badge">{bestScore}%</span>
                )}
              </div>
            )}
          </div>
        </div>

        {unlocked ? (
          <div className="card-content">
            <div className="letter-details">
              <p className="comparison"><strong>Like:</strong> {letter.englishComparison}</p>
              <p className="visual-aid"><strong>Think:</strong> {letter.visualAid}</p>
            </div>

            <div className="examples-section">
              <div className="example-words">
                <span className="examples-label">Examples:</span>
                {letter.exampleWords.slice(0, 3).map((word, index) => (
                  <span key={index} className="example-word">{word}</span>
                ))}
              </div>
            </div>

            {letter.commonWords.length > 0 && (
              <div className="korean-section">
                <div className="korean-words">
                  <span className="korean-label">한국어:</span>
                  {letter.commonWords.slice(0, 2).map((word, index) => (
                    <span key={index} className="korean-word">{word}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="letter-meta">
              <span className={`category-tag ${letter.category}`}>
                {letter.category}
              </span>
              <span className={`difficulty-tag difficulty-${letter.difficulty}`}>
                Level {letter.difficulty}
              </span>
            </div>
          </div>
        ) : (
          <div className="locked-content">
            <div className="lock-overlay">
              <span className="lock-icon">🔒</span>
              <p>Complete Level {letter.difficulty - 1} to unlock</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const CheatSheetListItem = ({ letter }) => {
    const unlocked = isLetterUnlocked(letter.id);
    const completed = isLetterCompleted(letter.id);

    if (!unlocked) return null;

    return (
      <div className={`cheatsheet-list-item ${completed ? 'completed' : ''}`}>
        <div className="list-item-main">
          <span className="list-letter">{letter.koreanLetter}</span>
          <span className="list-name">{letter.name}</span>
          <span className="list-sound">/{letter.romanization}/</span>
          <span className="list-comparison">{letter.englishComparison}</span>
        </div>
        <div className="list-item-details">
          <div className="list-examples">
            {letter.exampleWords.slice(0, 2).map((word, index) => (
              <span key={index} className="list-example">{word}</span>
            ))}
          </div>
          <div className="list-badges">
            {completed && <span className="completion-mark">✓</span>}
            <span className={`list-difficulty difficulty-${letter.difficulty}`}>
              L{letter.difficulty}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="cheatsheet-section">
      <div className="section-header">
        <h2>Korean Alphabet Cheat Sheet</h2>
        <p>Comprehensive quick reference for all Korean letters, pronunciations, and visual aids.</p>

        <div className="cheatsheet-controls">
          <input
            type="text"
            placeholder="Search letters, sounds, or examples..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid View
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List View
            </button>
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'unlocked' ? 'active' : ''}`}
              onClick={() => setFilter('unlocked')}
            >
              Available ({koreanAlphabet.filter(l => isLetterUnlocked(l.id)).length})
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed ({koreanAlphabet.filter(l => isLetterCompleted(l.id)).length})
            </button>
            <button
              className={`filter-btn ${filter === 'vowel' ? 'active' : ''}`}
              onClick={() => setFilter('vowel')}
            >
              Vowels ({koreanAlphabet.filter(l => l.category === 'vowel' && isLetterUnlocked(l.id)).length})
            </button>
            <button
              className={`filter-btn ${filter === 'consonant' ? 'active' : ''}`}
              onClick={() => setFilter('consonant')}
            >
              Consonants ({koreanAlphabet.filter(l => l.category === 'consonant' && isLetterUnlocked(l.id)).length})
            </button>
          </div>
        </div>
      </div>

      {filteredLetters.length > 0 ? (
        <div className={`cheatsheet-content ${viewMode}`}>
          {viewMode === 'grid' ? (
            <div className="cheatsheet-grid">
              {filteredLetters.map(letter => (
                <CheatSheetCard key={letter.id} letter={letter} />
              ))}
            </div>
          ) : (
            <div className="cheatsheet-list">
              <div className="list-header">
                <span>Letter</span>
                <span>Name</span>
                <span>Sound</span>
                <span>Comparison</span>
                <span>Examples</span>
                <span>Status</span>
              </div>
              {filteredLetters.map(letter => (
                <CheatSheetListItem key={letter.id} letter={letter} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No letters found</h3>
          <p>Try adjusting your search terms or filters.</p>
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      <div className="cheatsheet-footer">
        <div className="print-info">
          <span className="print-icon">🖨️</span>
          <span>Tip: Use Ctrl+P (Cmd+P on Mac) to print this cheat sheet for offline reference</span>
        </div>
      </div>
    </div>
  );
};

export default CheatSheetSection;