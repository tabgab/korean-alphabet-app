import React, { useState, useCallback, useEffect } from 'react';
import { exampleWords, koreanConsonants, koreanVowels } from '../koreanAlphabetData';
import { playSyllableSound, playWordSound, preloadVoices } from '../utils/audioUtils';

const WordBuilderSection = () => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [currentStage, setCurrentStage] = useState(1); // 1: jamo, 2: syllables, 3: word
  const [selectedJamo, setSelectedJamo] = useState({
    consonants: [],   // Array of selected consonants (can include duplicates for different positions)
    vowels: []        // Array of selected vowels
  });
  const [builtSyllables, setBuiltSyllables] = useState([]);
  const [userWord, setUserWord] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  // Preload voices when component mounts
  useEffect(() => {
    preloadVoices();
  }, []);

  // Audio playback handlers
  const handlePlaySyllableSound = async (syllable) => {
    if (isPlaying) return;

    setIsPlaying(true);
    try {
      await playSyllableSound(syllable);
    } catch (error) {
      console.error('Error playing syllable sound:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handlePlayWordSound = async (word) => {
    if (isPlaying) return;

    setIsPlaying(true);
    try {
      await playWordSound(word);
    } catch (error) {
      console.error('Error playing word sound:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const selectWord = useCallback((word) => {
    setSelectedWord(word);
    setCurrentStage(1);
    setSelectedJamo({ consonants: [], vowels: [] });
    setBuiltSyllables([]);
    setUserWord([]);
    setShowHint(false);
  }, []);

  const getRequiredJamo = useCallback(() => {
    if (!selectedWord) return { consonants: [], vowels: [] };

    const required = { consonants: [], vowels: [] };

    selectedWord.syllables.forEach(syllable => {
      // Add initial consonant
      if (syllable.consonant) {
        const consonant = koreanConsonants.find(c => c.koreanLetter === syllable.consonant);
        if (consonant && !required.consonants.find(c => c.id === consonant.id)) {
          required.consonants.push(consonant);
        }
      }

      // Add vowel
      if (syllable.vowel) {
        const vowel = koreanVowels.find(v => v.koreanLetter === syllable.vowel);
        if (vowel && !required.vowels.find(v => v.id === vowel.id)) {
          required.vowels.push(vowel);
        }
      }

      // Add final consonant (for CVC syllables)
      if (syllable.final) {
        const finalConsonant = koreanConsonants.find(c => c.koreanLetter === syllable.final);
        if (finalConsonant && !required.consonants.find(c => c.id === finalConsonant.id)) {
          required.consonants.push(finalConsonant);
        }
      }
    });

    return required;
  }, [selectedWord]);

  const getHints = useCallback(() => {
    if (!selectedWord) return [];

    const hints = [];

    if (currentStage === 1) {
      const required = getRequiredJamo();
      const missingConsonants = required.consonants.filter(reqC =>
        !selectedJamo.consonants?.some(selC => selC.id === reqC.id)
      );
      const missingVowels = required.vowels.filter(reqV =>
        !selectedJamo.vowels?.some(selV => selV.id === reqV.id)
      );

      if (missingConsonants.length > 0) {
        hints.push(`Select the consonant: ${missingConsonants[0].koreanLetter} (${missingConsonants[0].name})`);
      } else if (missingVowels.length > 0) {
        hints.push(`Select the vowel: ${missingVowels[0].koreanLetter} (${missingVowels[0].name})`);
      } else {
        hints.push("Great! You've selected all required letters. Click 'Next' to build syllables.");
      }
    }

    if (currentStage === 2) {
      const currentSyllableIndex = builtSyllables.length;
      if (currentSyllableIndex < selectedWord.syllables.length) {
        const targetSyllable = selectedWord.syllables[currentSyllableIndex];

        if (!selectedJamo.initial && !selectedJamo.vowel) {
          if (targetSyllable.structure === 'CVC') {
            hints.push(`Build "${targetSyllable.syllable}" (CVC): Select ${targetSyllable.consonant} (initial) + ${targetSyllable.vowel} + ${targetSyllable.final} (final)`);
          } else {
            hints.push(`Build "${targetSyllable.syllable}" (CV): Select ${targetSyllable.consonant} + ${targetSyllable.vowel}`);
          }
        } else if (selectedJamo.initial && !selectedJamo.vowel) {
          hints.push(`Now select ${targetSyllable.vowel}${targetSyllable.final ? ' (and optionally ' + targetSyllable.final + ' for final consonant)' : ''}`);
        } else if (!selectedJamo.initial && selectedJamo.vowel) {
          hints.push(`Select ${targetSyllable.consonant} as initial consonant`);
        } else if (selectedJamo.initial && selectedJamo.vowel && !selectedJamo.final) {
          if (targetSyllable.final) {
            // Check if we can reuse the same consonant for final position
            const availableConsonants = requiredJamo.consonants.filter(c =>
              c.koreanLetter === targetSyllable.final ||
              c.koreanLetter === targetSyllable.consonant
            );
            if (availableConsonants.length > 0) {
              hints.push(`Add ${targetSyllable.final} as final consonant (you can reuse ${targetSyllable.consonant} if it's the same letter)`);
            } else {
              hints.push(`Add ${targetSyllable.final} as final consonant`);
            }
          } else {
            hints.push(`Click "Build Syllable" to create "${targetSyllable.syllable}" (CV structure)`);
          }
        } else if (selectedJamo.initial && selectedJamo.vowel && selectedJamo.final) {
          hints.push(`Click "Build Syllable" to create "${targetSyllable.syllable}" (CVC structure)`);
        }
      }
    }

    if (currentStage === 3) {
      if (userWord.length < selectedWord.syllables.length) {
        const nextSyllable = selectedWord.syllables[userWord.length];
        const availableSyllable = builtSyllables.find(bs => bs.syllable === nextSyllable.syllable);
        if (availableSyllable) {
          hints.push(`Drag "${availableSyllable.syllable}" to the next empty slot`);
        } else {
          hints.push(`Build "${nextSyllable.syllable}" first in Stage 2`);
        }
      } else {
        hints.push(`Click "Check Word" to verify your word construction`);
      }
    }

    return hints;
  }, [selectedWord, currentStage, selectedJamo, builtSyllables, userWord, getRequiredJamo]);

  const requiredJamo = getRequiredJamo();
  const stageHints = getHints();

  const showHintForCurrentStage = useCallback(() => {
    const hints = getHints();
    if (hints.length > 0) {
      setCurrentHint(hints[0]);
      setShowHint(true);
    }
  }, [getHints]);

  const handleJamoSelection = useCallback((jamo, type) => {
    console.log('Jamo selected:', jamo, type);

    setSelectedJamo(prev => {
      if (type === 'consonant') {
        // For consonants, allow multiple selections of the same jamo for different positions
        // Check if this exact jamo is already selected
        const isAlreadySelected = prev.consonants.some(c => c.id === jamo.id);

        if (isAlreadySelected) {
          // If already selected, we can still add it again for reuse
          // This allows the same consonant to be used in multiple positions
          console.log('Adding another instance of consonant for reuse');
          return {
            ...prev,
            consonants: [...prev.consonants, jamo]
          };
        } else {
          // If not selected, add it
          console.log('Adding new consonant selection');
          return {
            ...prev,
            consonants: [...prev.consonants, jamo]
          };
        }
      } else if (type === 'vowel') {
        // For vowels, toggle behavior (usually only need one vowel per syllable)
        const isAlreadySelected = prev.vowels.some(v => v.id === jamo.id);

        if (isAlreadySelected) {
          console.log('Toggling vowel selection');
          return {
            ...prev,
            vowels: prev.vowels.filter(v => v.id !== jamo.id)
          };
        } else {
          console.log('Adding vowel selection');
          return {
            ...prev,
            vowels: [...prev.vowels, jamo]
          };
        }
      }

      return prev;
    });
  }, []);

  const canBuildSyllable = useCallback(() => {
    // Need at least 1 consonant and 1 vowel to build a syllable
    // For CVC syllables, we'll need 2 consonants and 1 vowel
    const hasConsonant = selectedJamo.consonants.length >= 1;
    const hasVowel = selectedJamo.vowels.length >= 1;

    return hasConsonant && hasVowel;
  }, [selectedJamo]);


  const buildSyllable = useCallback(() => {
    if (!canBuildSyllable()) return;

    console.log('Building syllable with:', selectedJamo);

    const initialConsonant = selectedJamo.consonants[0];
    const vowel = selectedJamo.vowels[0];
    const finalConsonant = selectedJamo.consonants.length > 1 ? selectedJamo.consonants[1] : null;

    // Create syllable text based on structure
    let syllableText = initialConsonant.koreanLetter + vowel.koreanLetter;
    if (finalConsonant) {
      syllableText += finalConsonant.koreanLetter;
    }

    console.log('Looking for target syllable with:', {
      consonant: initialConsonant.koreanLetter,
      vowel: vowel.koreanLetter,
      final: finalConsonant ? finalConsonant.koreanLetter : null
    });

    // Find the matching syllable in the target word to get complete structure
    const targetSyllable = selectedWord.syllables.find(ts => {
      const consonantMatch = ts.consonant === initialConsonant.koreanLetter;
      const vowelMatch = ts.vowel === vowel.koreanLetter;
      const finalMatch = finalConsonant
        ? ts.final === finalConsonant.koreanLetter
        : !ts.final; // No final consonant expected

      console.log('Checking syllable:', ts, { consonantMatch, vowelMatch, finalMatch });
      return consonantMatch && vowelMatch && finalMatch;
    });

    console.log('Found target syllable:', targetSyllable);

    const newSyllable = {
      syllable: targetSyllable ? targetSyllable.syllable : syllableText,
      consonant: initialConsonant.koreanLetter,
      vowel: vowel.koreanLetter,
      final: finalConsonant ? finalConsonant.koreanLetter : (targetSyllable ? targetSyllable.final : null),
      structure: targetSyllable ? targetSyllable.structure : (finalConsonant ? 'CVC' : 'CV'),
      completed: true
    };

    console.log('Created new syllable:', newSyllable);

    setBuiltSyllables(prev => {
      const updated = [...prev, newSyllable];
      console.log('Updated builtSyllables:', updated);
      return updated;
    });

    // Clear selections after building
    setSelectedJamo({ consonants: [], vowels: [] });
  }, [canBuildSyllable, selectedJamo, selectedWord]);

  const handleSyllableDrop = useCallback((syllable) => {
    console.log('Dropping syllable:', syllable);

    if (!selectedWord) {
      console.error('selectedWord is undefined');
      return;
    }

    if (userWord.length >= selectedWord.syllables.length) {
      console.log('Word is already complete');
      return;
    }

    if (userWord.some(userSyl => userSyl.syllable === syllable.syllable)) {
      console.log('Syllable already used');
      return;
    }

    setUserWord(prev => {
      const newWord = [...prev, syllable];
      console.log('New userWord:', newWord);
      return newWord;
    });
  }, [selectedWord, userWord]);

  const removeSyllable = useCallback((index) => {
    console.log('Removing syllable at index:', index);
    setUserWord(prev => {
      const newWord = prev.filter((_, i) => i !== index);
      console.log('New userWord after removal:', newWord);
      return newWord;
    });
  }, []);

  const checkStageCompletion = useCallback(() => {
    console.log('Checking stage completion:', { currentStage, userWord, selectedWord });

    if (currentStage === 1) {
      // For Stage 1, we need to check if all required jamo have been collected
      // But since we're now using the old array-based structure for Stage 1,
      // we need to maintain backward compatibility
      const required = getRequiredJamo();
      console.log('Stage 1 validation:', { required, selectedJamo });

      // Check if all required consonants are in the collected jamo
      const hasAllConsonants = required.consonants.every(reqC =>
        selectedJamo.consonants?.some(selC => selC.id === reqC.id)
      );

      // Check if all required vowels are in the collected jamo
      const hasAllVowels = required.vowels.every(reqV =>
        selectedJamo.vowels?.some(selV => selV.id === reqV.id)
      );

      console.log('Stage 1 completion check:', { hasAllConsonants, hasAllVowels });
      return hasAllConsonants && hasAllVowels;
    }

    if (currentStage === 2) {
      return builtSyllables.length === selectedWord.syllables.length &&
             builtSyllables.every(bs => bs.completed);
    }

    if (currentStage === 3) {
      console.log('Stage 3 validation:', { userWord, selectedWord });

      if (!selectedWord || !selectedWord.syllables) {
        console.error('selectedWord or syllables is undefined');
        return false;
      }

      if (userWord.length !== selectedWord.syllables.length) {
        console.log('User word length mismatch:', userWord.length, selectedWord.syllables.length);
        return false;
      }

      // Check each syllable with proper error handling
      for (let index = 0; index < userWord.length; index++) {
        const userSyl = userWord[index];
        const targetSyllable = selectedWord.syllables[index];

        console.log(`Checking index ${index}:`, { userSyl, targetSyllable });

        if (!userSyl) {
          console.error('userSyl is undefined at index:', index);
          return false;
        }

        if (!targetSyllable) {
          console.error('targetSyllable is undefined at index:', index);
          return false;
        }

        if (!userSyl.syllable || !targetSyllable.syllable) {
          console.error('Syllable text is undefined:', { userSyl, targetSyllable });
          return false;
        }

        const isCorrect = userSyl.syllable === targetSyllable.syllable;
        console.log(`Comparing: "${userSyl.syllable}" vs "${targetSyllable.syllable}" = ${isCorrect}`);

        if (!isCorrect) {
          return false;
        }
      }

      return true;
    }

    return false;
  }, [currentStage, selectedJamo, builtSyllables, userWord, selectedWord, getRequiredJamo]);

  const advanceToNextStage = useCallback(() => {
    if (currentStage < 3) {
      setCurrentStage(prev => prev + 1);
      setShowHint(false);
    }
  }, [currentStage]);

  const resetExercise = useCallback(() => {
    setCurrentStage(1);
    setSelectedJamo({ consonants: [], vowels: [] });
    setBuiltSyllables([]);
    setUserWord([]);
    setShowHint(false);
  }, []);

  const getJamoButtonClass = (jamo, type) => {
    let isSelected = false;

    if (type === 'consonant') {
      isSelected = selectedJamo.consonants.some(c => c.id === jamo.id);
    } else if (type === 'vowel') {
      isSelected = selectedJamo.vowels.some(v => v.id === jamo.id);
    }

    return `jamo-btn ${isSelected ? 'selected' : 'available'}`;
  };

  const getSyllableButtonClass = (syllable) => {
    const isUsed = userWord.some(userSyl => userSyl.syllable === syllable.syllable);
    return `syllable-btn ${isUsed ? 'used' : 'available'}`;
  };

  const renderSyllableWithSound = (syllable, index) => {
    const isUsed = userWord.some(userSyl => userSyl.syllable === syllable.syllable);
    return (
      <div key={index} className="syllable-container">
        <button
          className={`syllable-btn ${isUsed ? 'used' : 'available'}`}
          onClick={() => handleSyllableDrop(syllable)}
          disabled={isUsed}
        >
          {syllable.syllable}
        </button>
        <button
          className={`syllable-sound-btn ${isPlaying ? 'playing' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            handlePlaySyllableSound(syllable);
          }}
          disabled={isPlaying}
          aria-label={`Play sound for syllable ${syllable.syllable}`}
          title={`Hear pronunciation of "${syllable.syllable}"`}
        >
          🔊
        </button>
      </div>
    );
  };


  if (!selectedWord) {
    return (
      <div className="word-builder-section">
        <div className="section-header">
          <h2>Progressive Word Builder</h2>
          <p>Learn Korean writing step by step: from individual letters to complete words.</p>
        </div>

        <div className="word-selection">
          <h3>Select a word to build:</h3>
          <div className="word-cards">
            {exampleWords.map(word => (
              <button
                key={word.id}
                className="word-card"
                onClick={() => selectWord(word)}
              >
                <div className="word-korean">{word.korean}</div>
                <div className="word-romanization">{word.romanization}</div>
                <div className="word-english">"{word.english}"</div>
                <div className="syllable-count">{word.syllables.length} syllables</div>
                <button
                  className={`word-sound-btn ${isPlaying ? 'playing' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayWordSound(word);
                  }}
                  disabled={isPlaying}
                  aria-label={`Play pronunciation for ${word.english}`}
                  title={`Hear how to pronounce "${word.english}" in Korean`}
                >
                  🔊
                </button>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="word-builder-section">
      <div className="section-header">
        <div className="exercise-header">
          <button className="back-btn" onClick={() => setSelectedWord(null)}>
            ← Back to Word Selection
          </button>
          <h2>Build: {selectedWord.english}</h2>
          <div className="word-info">
            <span className="target-word">{selectedWord.korean}</span>
            <span className="romanization">({selectedWord.romanization})</span>
            <button
              className={`word-sound-btn ${isPlaying ? 'playing' : ''}`}
              onClick={() => handlePlayWordSound(selectedWord)}
              disabled={isPlaying}
              aria-label={`Play pronunciation for ${selectedWord.english}`}
              title={`Hear how to pronounce "${selectedWord.english}"`}
            >
              🔊
            </button>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="stage-progress">
          <div className={`stage ${currentStage === 1 ? 'active' : ''} ${currentStage > 1 ? 'completed' : ''}`}>
            <span className="stage-number">1</span>
            <span className="stage-label">Jamo</span>
          </div>
          <div className={`stage ${currentStage === 2 ? 'active' : ''} ${currentStage > 2 ? 'completed' : ''}`}>
            <span className="stage-number">2</span>
            <span className="stage-label">Syllables</span>
          </div>
          <div className={`stage ${currentStage === 3 ? 'active' : ''}`}>
            <span className="stage-number">3</span>
            <span className="stage-label">Word</span>
          </div>
        </div>
      </div>

      <div className="word-builder-container">
        {/* Stage 1: Jamo Selection */}
        {currentStage === 1 && (
          <div className="stage-container">
            <div className="stage-header">
              <h3>Stage 1: Select Required Letters (Jamo)</h3>
              <p>Choose all the consonants and vowels needed to build this word.</p>
            </div>

            <div className="jamo-selection">
              <div className="jamo-section">
                <h4>Required Consonants:</h4>
                <div className="jamo-grid">
                  {requiredJamo.consonants.map(consonant => (
                    <div
                      key={consonant.id}
                      className={getJamoButtonClass(consonant, 'consonant')}
                      onClick={() => handleJamoSelection(consonant, 'consonant')}
                    >
                      <span className="jamo-letter">{consonant.koreanLetter}</span>
                      <span className="jamo-name">{consonant.name}</span>
                      <span className="jamo-sound">({consonant.romanization})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="jamo-section">
                <h4>Required Vowels:</h4>
                <div className="jamo-grid">
                  {requiredJamo.vowels.map(vowel => (
                    <div
                      key={vowel.id}
                      className={getJamoButtonClass(vowel, 'vowel')}
                      onClick={() => handleJamoSelection(vowel, 'vowel')}
                    >
                      <span className="jamo-letter">{vowel.koreanLetter}</span>
                      <span className="jamo-name">{vowel.name}</span>
                      <span className="jamo-sound">({vowel.romanization})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="stage-controls">
              <button
                className="hint-btn"
                onClick={showHintForCurrentStage}
                disabled={stageHints.length === 0}
              >
                💡 Show Hint
              </button>
              {showHint && <div className="hint-text">{currentHint}</div>}
            </div>

            <div className="stage-navigation">
              <button
                className="next-stage-btn"
                onClick={advanceToNextStage}
                disabled={!checkStageCompletion()}
              >
                Next: Build Syllables →
              </button>
            </div>
          </div>
        )}

        {/* Stage 2: Syllable Building */}
        {currentStage === 2 && (
          <div className="stage-container">
            <div className="stage-header">
              <h3>Stage 2: Build Syllable Blocks</h3>
              <p>Combine consonants and vowels to create syllable blocks. Build them one at a time.</p>
            </div>

            <div className="syllable-building">
              {/* Available Jamo Pool for Syllable Building */}
              <div className="jamo-pool-stage2">
                <h4>Available Letters:</h4>
                <p>Select consonants and vowels to build the next syllable. You can reuse consonants for different positions.</p>
                <div className="jamo-pool-grid">
                  {requiredJamo.consonants.map(consonant => {
                    const selectedCount = selectedJamo.consonants.filter(c => c.id === consonant.id).length;
                    const maxNeeded = 2; // Can be used as both initial and final

                    return (
                      <button
                        key={`${consonant.id}-${consonant.koreanLetter}`}
                        className={`jamo-btn ${selectedCount > 0 ? 'selected' : 'available'}`}
                        onClick={() => handleJamoSelection(consonant, 'consonant')}
                      >
                        <span className="jamo-letter">{consonant.koreanLetter}</span>
                        <span className="jamo-name">{consonant.name}</span>
                        {selectedCount > 0 && (
                          <span className="usage-count">({selectedCount}/{maxNeeded})</span>
                        )}
                      </button>
                    );
                  })}
                  {requiredJamo.vowels.map(vowel => (
                    <button
                      key={vowel.id}
                      className={getJamoButtonClass(vowel, 'vowel')}
                      onClick={() => handleJamoSelection(vowel, 'vowel')}
                    >
                      <span className="jamo-letter">{vowel.koreanLetter}</span>
                      <span className="jamo-name">{vowel.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="jamo-workspace">
                <h4>Selected for Current Syllable:</h4>
                <div className="selected-jamo">
                  {selectedJamo.consonants.map((c, index) => {
                    const position = index === 0 ? 'initial' : 'final';
                    const positionKorean = position === 'initial' ? '초성' : '종성';
                    return (
                      <span key={`${c.id}-${index}-${position}`} className={`selected-jamo-item ${position === 'initial' ? 'consonant' : 'final-consonant'}`}>
                        {c.koreanLetter} ({c.name}) - {positionKorean}
                      </span>
                    );
                  })}
                  {selectedJamo.vowels.map(v => (
                    <span key={v.id} className="selected-jamo-item vowel">
                      {v.koreanLetter} ({v.name}) - Vowel
                    </span>
                  ))}
                </div>

                <div className="selection-summary">
                  {selectedJamo.consonants.length > 0 && selectedJamo.vowels.length > 0 && (
                    <div className="structure-info">
                      {selectedJamo.consonants.length === 1 && selectedJamo.vowels.length === 1 && (
                        <span className="structure-badge cv">CV Structure</span>
                      )}
                      {selectedJamo.consonants.length === 2 && selectedJamo.vowels.length === 1 && (
                        <span className="structure-badge cvc">CVC Structure</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="syllable-preview">
                  {selectedJamo.consonants.length > 0 && selectedJamo.vowels.length > 0 && (
                    <div className="preview-syllable">
                      <span className="preview-text">
                        Preview: {selectedJamo.consonants[0].koreanLetter + selectedJamo.vowels[0].koreanLetter}
                        {selectedJamo.consonants.length > 1 && selectedJamo.consonants[1].koreanLetter}
                      </span>
                      <span className="preview-structure">
                        ({selectedJamo.consonants.length > 1 ? 'CVC' : 'CV'})
                      </span>
                    </div>
                  )}
                </div>

                <div className="workspace-buttons">
                  <button
                    className="build-syllable-btn"
                    onClick={() => {
                      console.log('Build Syllable clicked');
                      console.log('Selected Jamo:', selectedJamo);
                      console.log('Can build:', canBuildSyllable());
                      buildSyllable();
                    }}
                    disabled={!canBuildSyllable()}
                  >
                    {canBuildSyllable()
                      ? `Build Syllable (${selectedJamo.consonants.length > 1 ? 'CVC' : 'CV'}) →`
                      : 'Select 1 consonant + 1 vowel (+ optional final consonant)'
                    }
                  </button>

                  <button
                    className="clear-selection-btn"
                    onClick={() => setSelectedJamo({ consonants: [], vowels: [] })}
                  >
                    Clear Selection
                  </button>
                </div>
              </div>

              <div className="built-syllables">
                <h4>Built Syllables ({builtSyllables.length}/{selectedWord.syllables.length}):</h4>
                <div className="syllables-display">
                  {builtSyllables.map((syllable, index) => (
                    <div key={index} className="built-syllable">
                      <div className="syllable-header">
                        <span className="syllable-text">{syllable.syllable}</span>
                        <button
                          className={`syllable-sound-btn ${isPlaying ? 'playing' : ''}`}
                          onClick={() => handlePlaySyllableSound(syllable)}
                          disabled={isPlaying}
                          aria-label={`Play sound for syllable ${syllable.syllable}`}
                          title={`Hear pronunciation of "${syllable.syllable}"`}
                        >
                          🔊
                        </button>
                      </div>
                      <div className="syllable-components">
                        {syllable.consonant} + {syllable.vowel}
                        {syllable.final && ` + ${syllable.final}`}
                      </div>
                      <div className="syllable-structure">{syllable.structure}</div>
                    </div>
                  ))}
                </div>

                {builtSyllables.length < selectedWord.syllables.length && (
                  <div className="next-syllable-hint">
                    Next: Build "{selectedWord.syllables[builtSyllables.length].syllable}"
                  </div>
                )}
              </div>
            </div>

            <div className="stage-controls">
              <button className="hint-btn" onClick={showHintForCurrentStage}>
                💡 Show Hint
              </button>
              {showHint && <div className="hint-text">{currentHint}</div>}
            </div>

            <div className="stage-navigation">
              <button className="prev-stage-btn" onClick={() => setCurrentStage(1)}>
                ← Back to Jamo
              </button>
              <button
                className="next-stage-btn"
                onClick={advanceToNextStage}
                disabled={!checkStageCompletion()}
              >
                Next: Build Word →
              </button>
            </div>
          </div>
        )}

        {/* Stage 3: Word Building */}
        {currentStage === 3 && (
          <div className="stage-container">
            <div className="stage-header">
              <h3>Stage 3: Build the Complete Word</h3>
              <p>Arrange the syllable blocks to form the complete word.</p>
            </div>

            <div className="word-building">
              <div className="target-word-area">
                <h4>Word Structure:</h4>
                <div className="word-slots">
                  {selectedWord.syllables.map((targetSyllable, index) => {
                    console.log(`Rendering word slot ${index}:`, { targetSyllable, userSyllable: userWord[index] });

                    if (!targetSyllable) {
                      console.error('targetSyllable is undefined at index:', index);
                      return null;
                    }

                    const isCorrect = userWord[index] && userWord[index].syllable === targetSyllable.syllable;
                    return (
                      <div key={index} className={`word-slot ${isCorrect ? 'correct' : ''}`}>
                        {userWord[index] ? (
                          <div className={`syllable-in-word ${isCorrect ? 'correct' : ''}`}>
                            <span className="syllable-text">{userWord[index].syllable}</span>
                            <button
                              className="remove-syllable"
                              onClick={() => removeSyllable(index)}
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <div className="empty-word-slot">
                            Drop syllable here
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {userWord.length > 0 && (
                  <div className="current-word">
                    Current: <span className="current-word-display">
                      {userWord.map(s => s.syllable).join('')}
                    </span>
                  </div>
                )}

                {checkStageCompletion() && currentStage === 3 && (
                  <div className="success-message">
                    🎉 Congratulations! You successfully built "{selectedWord.korean}" ({selectedWord.english})!
                  </div>
                )}
              </div>

              <div className="available-syllables">
                <h4>Available Syllables:</h4>
                <div className="syllables-pool">
                  {builtSyllables.map((syllable, index) => (
                    <div key={index} className="syllable-container">
                      <div
                        className={getSyllableButtonClass(syllable)}
                        draggable={!userWord.some(userSyl => userSyl.syllable === syllable.syllable)}
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', syllable.syllable);
                        }}
                        onClick={() => handleSyllableDrop(syllable)}
                      >
                        <span className="syllable-display">{syllable.syllable}</span>
                      </div>
                      <button
                        className={`syllable-sound-btn ${isPlaying ? 'playing' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaySyllableSound(syllable);
                        }}
                        disabled={isPlaying}
                        aria-label={`Play sound for syllable ${syllable.syllable}`}
                        title={`Hear pronunciation of "${syllable.syllable}"`}
                      >
                        🔊
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="stage-controls">
              <button className="hint-btn" onClick={showHintForCurrentStage}>
                💡 Show Hint
              </button>
              {showHint && <div className="hint-text">{currentHint}</div>}
            </div>

            <div className="stage-navigation">
              <button className="prev-stage-btn" onClick={() => setCurrentStage(2)}>
                ← Back to Syllables
              </button>
              <button className="check-word-btn" onClick={() => {
                try {
                  console.log('Check Word button clicked');
                  console.log('userWord:', userWord);
                  console.log('selectedWord:', selectedWord);

                  if (checkStageCompletion()) {
                    setShowHint(false);
                    setCurrentHint(`Perfect! You successfully built "${selectedWord.korean}" (${selectedWord.english})!`);
                    setShowHint(true);
                  } else {
                    // Find the first incorrect syllable
                    let errorMessage = 'Check your syllable placement and try again.';
                    if (userWord.length > 0 && selectedWord && selectedWord.syllables) {
                      const firstIncorrect = userWord.findIndex((userSyl, index) => {
                        if (!userSyl || !selectedWord.syllables[index]) return true;
                        return userSyl.syllable !== selectedWord.syllables[index].syllable;
                      });

                      if (firstIncorrect >= 0) {
                        errorMessage = `Check position ${firstIncorrect + 1}. Make sure "${selectedWord.syllables[firstIncorrect].syllable}" is in the correct place.`;
                      }
                    }

                    setShowHint(false);
                    setCurrentHint(errorMessage);
                    setShowHint(true);
                  }
                } catch (error) {
                  console.error('Error in Check Word:', error);
                  setShowHint(false);
                  setCurrentHint('An error occurred. Please try again or refresh the page.');
                  setShowHint(true);
                }
              }}>
                Check Word
              </button>
            </div>
          </div>
        )}

        {/* Overall Controls */}
        <div className="exercise-controls">
          <button className="reset-btn" onClick={resetExercise}>
            Start Over
          </button>
          <button className="new-word-btn" onClick={() => setSelectedWord(null)}>
            Try Another Word
          </button>
        </div>

        {/* Hints */}
        {showHint && (
          <div className="hint-section">
            <div className="hint-content">
              <span className="hint-icon">💡</span>
              <span className="hint-text">{currentHint}</span>
              <button className="close-hint" onClick={() => setShowHint(false)}>×</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordBuilderSection;