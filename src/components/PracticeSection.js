import React, { useState, useCallback } from 'react';
import { useProgress } from '../context/ProgressContext';

// Exercise configuration with multiple question patterns
const EXERCISE_TYPES = {
  'multiple-choice': {
    name: 'Multiple Choice',
    description: 'Choose the correct answer from options',
    icon: '🔘',
    questionCount: 3
  },
  'letter-to-sound': {
    name: 'Letter to Sound',
    description: 'Match Korean letters to their English sounds',
    icon: '🔊',
    questionCount: 2
  },
  'sound-to-letter': {
    name: 'Sound to Letter',
    description: 'Find the Korean letter that makes a specific sound',
    icon: '📝',
    questionCount: 3
  },
  'letter-matching': {
    name: 'Letter Matching',
    description: 'Match letters to their pronunciations',
    icon: '🔗',
    questionCount: 2
  },
  'word-association': {
    name: 'Sound Association',
    description: 'Match letters to words containing their sounds',
    icon: '🌐',
    questionCount: 3
  }
};

const PracticeSection = () => {
  const { updateScore, getAvailableLetters } = useProgress();
  const [selectedExerciseType, setSelectedExerciseType] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);

  // Generate focused questions about a specific letter with multiple variations
  const generateQuestion = useCallback((exerciseType, targetLetter = null) => {
    const availableLetters = getAvailableLetters();

    if (availableLetters.length < 2) {
      return {
        type: 'insufficient-letters',
        question: 'Complete more letters to unlock practice exercises!',
        correctAnswer: null,
        options: []
      };
    }

    // Select a target letter to focus questions on
    let focusLetter;
    if (targetLetter && availableLetters.some(l => l.id === targetLetter.id)) {
      focusLetter = targetLetter;
    } else {
      focusLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
    }

    // Get other letters for options (excluding the focus letter)
    const otherLetters = availableLetters.filter(l => l.id !== focusLetter.id);
    const distractorLetters = otherLetters.sort(() => Math.random() - 0.5).slice(0, 3);

    let question = {};

    switch (exerciseType) {
      case 'multiple-choice':
        const letterQuestionPatterns = [
          `What is the name of this Korean letter: "${focusLetter.koreanLetter}"?`,
          `Which letter makes the "${focusLetter.englishSound}" sound?`,
          `What letter should you use for the "${focusLetter.englishSound}" sound?`
        ];
        const randomLetterPattern = letterQuestionPatterns[Math.floor(Math.random() * letterQuestionPatterns.length)];

        question = {
          type: 'multiple-choice',
          question: randomLetterPattern,
          correctAnswer: focusLetter.name,
          options: [focusLetter, ...distractorLetters].map(l => l.name).sort(() => Math.random() - 0.5),
          letter: focusLetter
        };
        break;

      case 'letter-to-sound':
        const soundQuestionPatterns = [
          `What sound does "${focusLetter.koreanLetter}" make?`,
          `How do you pronounce "${focusLetter.koreanLetter}"?`,
          `What is the English sound for "${focusLetter.koreanLetter}"?`
        ];
        const randomSoundQuestionPattern = soundQuestionPatterns[Math.floor(Math.random() * soundQuestionPatterns.length)];

        question = {
          type: 'letter-to-sound',
          question: randomSoundQuestionPattern,
          correctAnswer: focusLetter.englishSound,
          options: [focusLetter, ...distractorLetters].map(l => l.englishSound).sort(() => Math.random() - 0.5),
          letter: focusLetter
        };
        break;

      case 'sound-to-letter':
        const reverseQuestionPatterns = [
          `Which Korean letter makes the "${focusLetter.englishSound}" sound?`,
          `What letter should you use for the "${focusLetter.englishSound}" sound?`,
          `If you want to make the "${focusLetter.englishSound}" sound, which letter do you use?`
        ];
        const randomReversePattern = reverseQuestionPatterns[Math.floor(Math.random() * reverseQuestionPatterns.length)];

        question = {
          type: 'sound-to-letter',
          question: randomReversePattern,
          correctAnswer: focusLetter.koreanLetter,
          options: [focusLetter, ...distractorLetters].map(l => l.koreanLetter).sort(() => Math.random() - 0.5),
          letter: focusLetter
        };
        break;

      case 'letter-matching':
        const matchQuestionPatterns = [
          `What is the romanization of "${focusLetter.koreanLetter}"?`,
          `How do you write "${focusLetter.koreanLetter}" in English letters?`,
          `What is the English spelling for "${focusLetter.koreanLetter}"?`
        ];
        const randomMatchQuestionPattern = matchQuestionPatterns[Math.floor(Math.random() * matchQuestionPatterns.length)];

        question = {
          type: 'letter-matching',
          question: randomMatchQuestionPattern,
          correctAnswer: focusLetter.romanization,
          options: [focusLetter, ...distractorLetters].map(l => l.romanization).sort(() => Math.random() - 0.5),
          letter: focusLetter
        };
        break;

      case 'word-association':
        const wordOptions = focusLetter.exampleWords.slice(0, 3);
        const displayWord = wordOptions[Math.floor(Math.random() * wordOptions.length)];

        const associationQuestionPatterns = [
          `Which letter makes the "${focusLetter.englishSound}" sound found in "${displayWord}"?`,
          `What letter would you use to start writing "${displayWord}" in Korean?`,
          `Which Korean letter sounds like the beginning of "${displayWord}"?`
        ];
        const randomAssociationQuestionPattern = associationQuestionPatterns[Math.floor(Math.random() * associationQuestionPatterns.length)];

        question = {
          type: 'word-association',
          question: randomAssociationQuestionPattern,
          correctAnswer: focusLetter.name,
          options: [focusLetter, ...distractorLetters].map(l => l.name).sort(() => Math.random() - 0.5),
          letter: focusLetter
        };
        break;

      default:
        return generateQuestion('multiple-choice', focusLetter);
    }

    return question;
  }, [getAvailableLetters]);

  const startExercise = (exerciseType) => {
    setSelectedExerciseType(exerciseType);

    // Generate first question
    const firstQuestion = generateQuestion(exerciseType);
    setCurrentQuestion(firstQuestion);

    setSelectedAnswer(null);
    setShowResult(false);
    setQuestionNumber(1);
    setScore(0);
  };

  const checkAnswer = () => {
    if (!selectedAnswer) return;

    setShowResult(true);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    if (isCorrect) {
      const points = Math.max(10, 20 - (questionNumber * 2));
      setScore(prev => prev + points);

      // Update score for the letter
      if (currentQuestion.letter) {
        updateScore(currentQuestion.letter.id, 100);
      }
    }
  };

  const nextQuestion = () => {
    if (questionNumber >= 10) {
      finishExercise();
      return;
    }

    setQuestionNumber(prev => prev + 1);
    const newQuestion = generateQuestion(selectedExerciseType);
    setCurrentQuestion(newQuestion);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const finishExercise = () => {
    setSelectedExerciseType(null);
    setCurrentQuestion(null);
    setScore(0);
  };

  const getOptionButtonClass = (option) => {
    let baseClass = 'option-btn';
    if (selectedAnswer === option) baseClass += ' selected';
    if (showResult) {
      if (option === currentQuestion.correctAnswer) {
        baseClass += ' correct';
      } else if (selectedAnswer === option) {
        baseClass += ' incorrect';
      }
    }
    return baseClass;
  };

  if (!selectedExerciseType) {
    return (
      <div className="practice-section">
        <div className="section-header">
          <h2>Practice Exercises</h2>
          <p>Choose an exercise type to test your Korean alphabet knowledge.</p>

          <div className="exercise-types">
            {Object.entries(EXERCISE_TYPES).map(([type, config]) => (
              <button
                key={type}
                className="exercise-type-btn"
                onClick={() => startExercise(type)}
              >
                <div className="exercise-icon">{config.icon}</div>
                <div className="exercise-info">
                  <h3>{config.name}</h3>
                  <p>{config.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="practice-section">
      <div className="section-header">
        <div className="exercise-header">
          <h2>{EXERCISE_TYPES[selectedExerciseType].name}</h2>
          <div className="exercise-progress">
            <span>Question {questionNumber}/10</span>
            <span>Score: {score}</span>
          </div>
        </div>
      </div>

      <div className="exercise-container">
        <div className="exercise-question">
          <h3>{currentQuestion.question}</h3>
          {currentQuestion.type === 'insufficient-letters' ? (
            <div className="insufficient-letters">
              <p>📚 You need at least 2 unlocked letters to practice.</p>
              <p>Complete some letters in the Learn section first!</p>
            </div>
          ) : (
            currentQuestion.letter && (
              <div className="question-letter">
                <span className="korean-letter-large">{currentQuestion.letter.koreanLetter}</span>
                <div className="letter-metadata">
                  <span className={`category-tag ${currentQuestion.letter.category}`}>
                    {currentQuestion.letter.category}
                  </span>
                  <span className={`difficulty-tag difficulty-${currentQuestion.letter.difficulty}`}>
                    Level {currentQuestion.letter.difficulty}
                  </span>
                </div>
              </div>
            )
          )}

          <div className="answer-options">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${getOptionButtonClass(option)}`}
                onClick={() => !showResult && setSelectedAnswer(option)}
                disabled={showResult}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>

          {showResult && (
            <div className="result-section">
              <div className={`feedback ${selectedAnswer === currentQuestion.correctAnswer ? 'correct' : 'incorrect'}`}>
                <p>
                  {selectedAnswer === currentQuestion.correctAnswer
                    ? 'Correct! Well done!'
                    : `Incorrect. The correct answer is "${currentQuestion.correctAnswer}".`
                  }
                </p>
              </div>

              <div className="letter-explanation">
                <h4>{currentQuestion.letter.name} ({currentQuestion.letter.koreanLetter})</h4>
                <p><strong>Romanization:</strong> {currentQuestion.letter.romanization}</p>
                <p><strong>Pronunciation:</strong> {currentQuestion.letter.englishComparison}</p>
              </div>

              <button className="next-btn" onClick={nextQuestion}>
                {questionNumber >= 10 ? 'Finish Exercise' : 'Next Question'}
              </button>
            </div>
          )}

          {!showResult && (
            <button className="check-btn" onClick={checkAnswer} disabled={!selectedAnswer}>
              Check Answer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeSection;