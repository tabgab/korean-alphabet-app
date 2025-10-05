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

// Visual description helper
const getVisualDescription = (letter) => {
  const descriptions = {
    'Kiyeok': 'a backwards "L" with a small horizontal line',
    'Nieun': 'a simple horizontal line',
    'Digeut': 'a square bracket facing right',
    'Rieul': 'two diagonal lines meeting',
    'Mieum': 'a perfect square',
    'Bieup': 'a square with a lid on top',
    'Si-ot': 'two horizontal lines, one above the other',
    'Ieung': 'a perfect circle',
    'Jieut': 'a backwards "C" with a horizontal line',
    'Chieut': 'three horizontal lines stacked',
    'Kieuk': 'ㄱ but with extra breath (aspirated)',
    'Tieut': 'ㄷ but with extra breath (aspirated)',
    'Pieup': 'ㅂ but with extra breath (aspirated)',
    'Hieut': 'two diagonal lines crossing',
    'A': 'a vertical line with a small horizontal branch to the right',
    'Ya': 'ㅏ but with an extra horizontal line above',
    'Eo': 'a horizontal line with a small vertical branch up',
    'Yeo': 'ㅓ but with an extra horizontal line above',
    'O': 'a horizontal line with a circle above it',
    'Yo': 'ㅗ but with an extra horizontal line below',
    'U': 'a horizontal line with a circle below it',
    'Yu': 'ㅜ but with an extra horizontal line below',
    'Eu': 'a single horizontal line',
    'I': 'a single vertical line'
  };
  return descriptions[letter.name] || 'a unique shape to remember';
};

// Practice tip helper
const getPracticeTip = (letter) => {
  const tips = {
    'Kiyeok': 'Start at the top and go down, then left - like drawing a backwards L',
    'Nieun': 'Just one horizontal line - simple and quick',
    'Digeut': 'Two lines: vertical then horizontal from the top',
    'Rieul': 'Two diagonal lines meeting at the bottom',
    'Mieum': 'Four lines forming a square - go clockwise',
    'Bieup': 'Three lines: start like ㄱ but add a top line',
    'Si-ot': 'Two parallel horizontal lines',
    'Ieung': 'One circular motion - smooth and continuous',
    'Jieut': 'Three strokes: curve, line, then small horizontal',
    'Chieut': 'Three horizontal lines from top to bottom',
    'Kieuk': 'Like Kiyeok but pronounce with more breath',
    'Tieut': 'Like Digeut but pronounce with more breath',
    'Pieup': 'Like Bieup but pronounce with more breath',
    'Hieut': 'Two diagonal lines crossing each other',
    'A': 'Vertical line down, then small branch to the right',
    'Ya': 'Like ㅏ but add an extra horizontal line above',
    'Eo': 'Horizontal line right, then small vertical up',
    'Yeo': 'Like ㅓ but add an extra horizontal line above',
    'O': 'Horizontal line, then circle above it',
    'Yo': 'Horizontal line, circle above, then line below',
    'U': 'Horizontal line, then circle below it',
    'Yu': 'Horizontal line, circle below, then line below that',
    'Eu': 'Single horizontal line - the simplest vowel',
    'I': 'Single vertical line - tall and straight'
  };
  return tips[letter.name] || 'Practice the stroke order carefully';
};

const LearnSection = () => {
  const { isLetterUnlocked, getAvailableLetters, getLockedLettersCount } = useProgress();
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [filter, setFilter] = useState('available'); // 'all', 'available', 'locked', 'consonants', 'vowels'

  // Function to pronounce Korean words using Web Speech API
  const speakKorean = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Try to find a Korean voice
      const voices = window.speechSynthesis.getVoices();
      const koreanVoice = voices.find(voice =>
        voice.lang.startsWith('ko') || // Korean
        voice.name.toLowerCase().includes('korean')
      );

      if (koreanVoice) {
        utterance.voice = koreanVoice;
        utterance.lang = koreanVoice.lang;
      } else {
        // Fallback to English with Korean text
        utterance.lang = 'ko-KR';
        utterance.rate = 0.8; // Slightly slower for clarity
      }

      // Speak the text
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported in this browser');
    }
  };

  const getFilteredLetters = () => {
    switch (filter) {
      case 'available':
        return getAvailableLetters();
      case 'locked':
        return koreanAlphabet.filter(letter => !isLetterUnlocked(letter.id));
      case 'consonants':
        return getAvailableLetters().filter(letter => letter.category === 'consonant');
      case 'vowels':
        return getAvailableLetters().filter(letter => letter.category === 'vowel');
      default:
        return getAvailableLetters();
    }
  };

  const filteredLetters = getFilteredLetters();

  const LetterCard = ({ letter }) => {
    const { isLetterUnlocked, isLetterCompleted, getBestScore } = useProgress();
    const unlocked = isLetterUnlocked(letter.id);
    const completed = isLetterCompleted(letter.id);
    const bestScore = getBestScore(letter.id);

    return (
      <div
        className={`letter-card ${letter.category} ${selectedLetter?.id === letter.id ? 'selected' : ''} ${unlocked ? 'unlocked' : 'locked'}`}
        onClick={() => unlocked && setSelectedLetter(letter)}
        role="button"
        tabIndex={unlocked ? 0 : -1}
        aria-label={`${letter.name} Korean letter. ${unlocked ? 'Click to view details' : 'Locked - complete previous levels to unlock'}`}
        aria-pressed={selectedLetter?.id === letter.id}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && unlocked) {
            e.preventDefault();
            setSelectedLetter(letter);
          }
        }}
      >
        <div className="letter-display">
          <div className="letter-main">
            <span className={`korean-letter ${unlocked ? '' : 'locked'}`}>{letter.koreanLetter}</span>
            <span className="letter-name">{letter.name}</span>
            {!unlocked && <span className="lock-icon">🔒</span>}
          </div>
          <div className={`pictogram ${unlocked ? '' : 'locked'}`}>{getPictogram(letter.pictogram)}</div>
        </div>

        {unlocked ? (
          <>
            <div className="letter-sound">
              <span className="sound-text">/{letter.romanization}/</span>
            </div>
            <div className="letter-comparison">
              <span className="comparison-text">{letter.englishComparison}</span>
            </div>
            <div className="letter-progress">
              {completed && (
                <div className="completion-indicator">
                  <span className="completion-badge">✓</span>
                  <span className="best-score">{bestScore}%</span>
                </div>
              )}
            </div>
            <div className="difficulty-indicator">
              <span className={`difficulty-badge difficulty-${letter.difficulty}`}>
                Level {letter.difficulty}
              </span>
            </div>
          </>
        ) : (
          <div className="locked-message">
            <p>Complete Level {letter.difficulty - 1} letters to unlock</p>
          </div>
        )}
      </div>
    );
  };

  const LetterDetail = ({ letter }) => (
    <div className="letter-detail">
      <div className="detail-header">
        <div className="letter-visualization">
          <span className="detail-korean">{letter.koreanLetter}</span>
          <div className="pictogram-large">{getPictogram(letter.pictogram)}</div>
        </div>
        <div className="detail-info">
          <h3>{letter.name}</h3>
          <p className="pronunciation">Romanization: <strong>{letter.romanization}</strong></p>
          <div className="letter-category">
            <span className={`category-badge ${letter.category}`}>
              {letter.category.charAt(0).toUpperCase() + letter.category.slice(1)}
            </span>
            <span className={`difficulty-badge difficulty-${letter.difficulty}`}>
              Level {letter.difficulty}
            </span>
          </div>
        </div>
      </div>

      <div className="detail-content">
        <div className="comparison-section">
          <h4>🔍 English Comparison</h4>
          <p>{letter.englishComparison}</p>
        </div>

        <div className="visual-aid-section">
          <h4>👁️ Visual Learning Aid</h4>
          <p>{letter.visualAid}</p>
          <div className="visual-example">
            <span className="visual-prompt">Think of it as:</span>
            <span className="visual-description">{getVisualDescription(letter)}</span>
          </div>
        </div>

        {letter.strokeOrder && (
          <div className="stroke-order-section">
            <h4>✏️ Stroke Order</h4>
            <p className="stroke-count">Number of strokes: {letter.strokeOrder.length}</p>
            <div className="stroke-order">
              {letter.strokeOrder.map((stroke, index) => (
                <span key={index} className="stroke-number">{stroke}</span>
              ))}
            </div>
          </div>
        )}

        <div className="examples-section">
          <h4>📝 Example Words (English)</h4>
          <p className="examples-subtitle">Words that start with similar sounds:</p>
          <div className="example-words">
            {letter.exampleWords.map((word, index) => (
              <span key={index} className="example-word">{word}</span>
            ))}
          </div>
        </div>

        {letter.commonWords.length > 0 && (
          <div className="korean-words-section">
            <h4>🇰🇷 Korean Examples</h4>
            <p className="korean-subtitle">Common Korean words starting with this letter (click to hear pronunciation):</p>
            <div className="korean-words">
              {letter.commonWords.slice(0, 6).map((wordWithTranslation, index) => {
                // Split word and translation (format: "word (translation)")
                const match = wordWithTranslation.match(/^(.+?)\s*\((.+)\)$/);
                if (match) {
                  const koreanWord = match[1].trim();
                  const englishTranslation = match[2].trim();
                  return (
                    <div key={index} className="korean-word-item">
                      <div className="korean-word-container">
                        <span className="korean-word-text">{koreanWord}</span>
                        <button
                          className="pronunciation-btn"
                          onClick={() => speakKorean(koreanWord)}
                          aria-label={`Pronounce ${koreanWord}`}
                          title={`Hear pronunciation of ${koreanWord}`}
                        >
                          🔊
                        </button>
                      </div>
                      <span className="korean-word-translation">{englishTranslation}</span>
                    </div>
                  );
                }
                return (
                  <div key={index} className="korean-word-item">
                    <span className="korean-word">{wordWithTranslation}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="practice-section">
          <h4>🎯 Practice Tip</h4>
          <p>{getPracticeTip(letter)}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="learn-section">
      <div className="section-header">
        <h2>Learn the Korean Alphabet</h2>
        <p>Click on any letter to see detailed information and pronunciation guides.</p>
      </div>

      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === 'available' ? 'active' : ''}`}
          onClick={() => setFilter('available')}
        >
          Available ({getAvailableLetters().length})
        </button>
        <button
          className={`filter-btn ${filter === 'locked' ? 'active' : ''}`}
          onClick={() => setFilter('locked')}
        >
          Locked ({getLockedLettersCount()})
        </button>
        <button
          className={`filter-btn ${filter === 'consonants' ? 'active' : ''}`}
          onClick={() => setFilter('consonants')}
        >
          Consonants ({getAvailableLetters().filter(l => l.category === 'consonant').length})
        </button>
        <button
          className={`filter-btn ${filter === 'vowels' ? 'active' : ''}`}
          onClick={() => setFilter('vowels')}
        >
          Vowels ({getAvailableLetters().filter(l => l.category === 'vowel').length})
        </button>
      </div>

      <div className="letters-grid">
        {filteredLetters.map(letter => (
          <LetterCard key={letter.id} letter={letter} />
        ))}
      </div>

      {selectedLetter && (
        <div className="letter-detail-panel">
          <LetterDetail letter={selectedLetter} />
        </div>
      )}
    </div>
  );
};

export default LearnSection;