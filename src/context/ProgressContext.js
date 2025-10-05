import React, { createContext, useContext, useState, useEffect } from 'react';
import { koreanAlphabet } from '../koreanAlphabetData';

const ProgressContext = createContext();

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export const ProgressProvider = ({ children }) => {
  // Initialize state from localStorage or defaults
  const [userProgress, setUserProgress] = useState(() => {
    const saved = localStorage.getItem('korean-alphabet-progress');
    return saved ? JSON.parse(saved) : {
      completedLetters: [],
      scores: {},
      currentLevel: 1,
      totalScore: 0,
      streakCount: 0,
      lastPracticeDate: null,
      achievements: [],
      unlockedLetters: [1, 2, 3, 4, 5, 15, 16, 17, 18, 19], // Start with first 5 consonants and 5 vowels
      exerciseStats: {
        totalQuestions: 0,
        correctAnswers: 0,
        currentStreak: 0,
        bestStreak: 0,
        totalScore: 0,
        averageScore: 0,
        studyTimeMinutes: 0,
        longestStreak: 0
      },
      milestones: {
        lettersCompleted: 0,
        perfectScores: 0,
        weeklyGoal: false,
        monthlyGoal: false
      }
    };
  });

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('korean-alphabet-progress', JSON.stringify(userProgress));
  }, [userProgress]);

  // Mark a letter as completed
  const markLetterCompleted = (letterId) => {
    setUserProgress(prev => ({
      ...prev,
      completedLetters: [...new Set([...prev.completedLetters, letterId])]
    }));
  };

  // Update score for a letter
  const updateScore = (letterId, score) => {
    setUserProgress(prev => {
      const newScores = {
        ...prev.scores,
        [letterId]: Math.max(prev.scores[letterId] || 0, score)
      };

      // Mark letter as completed if score is high enough (>= 80%)
      const shouldMarkCompleted = score >= 80 && !prev.completedLetters.includes(letterId);
      const newCompletedLetters = shouldMarkCompleted
        ? [...new Set([...prev.completedLetters, letterId])]
        : prev.completedLetters;

      // Update exercise statistics
      const newStats = {
        ...prev.exerciseStats,
        totalQuestions: prev.exerciseStats.totalQuestions + 1,
        correctAnswers: score >= 70 ? prev.exerciseStats.correctAnswers + 1 : prev.exerciseStats.correctAnswers,
        totalScore: prev.exerciseStats.totalScore + score,
        averageScore: Math.round((prev.exerciseStats.totalScore + score) / (prev.exerciseStats.totalQuestions + 1))
      };

      // Check if we should unlock new letters based on performance
      const unlockedLetters = checkForUnlocks(newScores, prev.unlockedLetters);

      // Check for new achievements
      const currentProgress = {
        ...prev,
        scores: newScores,
        completedLetters: newCompletedLetters,
        unlockedLetters: unlockedLetters,
        exerciseStats: newStats
      };
      const newAchievements = checkAchievements(currentProgress);

      return {
        ...prev,
        scores: newScores,
        completedLetters: newCompletedLetters,
        totalScore: prev.totalScore + score,
        lastPracticeDate: new Date().toISOString(),
        unlockedLetters: unlockedLetters,
        exerciseStats: newStats,
        achievements: [...prev.achievements, ...newAchievements]
      };
    });
  };

  // Increment streak
  const incrementStreak = () => {
    setUserProgress(prev => ({
      ...prev,
      streakCount: prev.streakCount + 1
    }));
  };

  // Reset streak
  const resetStreak = () => {
    setUserProgress(prev => ({
      ...prev,
      streakCount: 0
    }));
  };

  // Add achievement
  const addAchievement = (achievement) => {
    setUserProgress(prev => ({
      ...prev,
      achievements: [...new Set([...prev.achievements, achievement])]
    }));
  };

  // Get progress percentage
  const getProgressPercentage = () => {
    return Math.round((userProgress.completedLetters.length / 24) * 100);
  };

  // Check if letter is completed
  const isLetterCompleted = (letterId) => {
    return userProgress.completedLetters.includes(letterId);
  };

  // Get best score for a letter
  const getBestScore = (letterId) => {
    return userProgress.scores[letterId] || 0;
  };

  // Get average score across all letters
  const getAverageScore = () => {
    const scores = Object.values(userProgress.scores);
    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  };

  // Achievement definitions
  const ACHIEVEMENTS = {
    firstSteps: {
      id: 'firstSteps',
      name: 'First Steps',
      description: 'Complete your first Korean letter',
      icon: '🎯',
      requirement: (progress) => progress.completedLetters.length >= 1,
      reward: 'Unlocks letter practice'
    },
    basicConsonants: {
      id: 'basicConsonants',
      name: 'Basic Consonants',
      description: 'Complete first 5 consonants',
      icon: '🔤',
      requirement: (progress) => {
        const firstFiveConsonants = [1, 2, 3, 4, 5];
        return firstFiveConsonants.every(id => progress.completedLetters.includes(id));
      },
      reward: 'Unlocks basic vowels'
    },
    basicVowels: {
      id: 'basicVowels',
      name: 'Basic Vowels',
      description: 'Complete first 5 vowels',
      icon: '📝',
      requirement: (progress) => {
        const firstFiveVowels = [15, 16, 17, 18, 19];
        return firstFiveVowels.every(id => progress.completedLetters.includes(id));
      },
      reward: 'Unlocks compound vowels'
    },
    koreanScholar: {
      id: 'koreanScholar',
      name: 'Korean Scholar',
      description: 'Complete 12 letters',
      icon: '🎓',
      requirement: (progress) => progress.completedLetters.length >= 12,
      reward: 'Unlocks advanced exercises'
    },
    hangulMaster: {
      id: 'hangulMaster',
      name: 'Hangul Master',
      description: 'Complete all 24 letters',
      icon: '👑',
      requirement: (progress) => progress.completedLetters.length >= 24,
      reward: 'Complete alphabet mastery'
    },
    perfectionist: {
      id: 'perfectionist',
      name: 'Perfectionist',
      description: 'Get 100% on an exercise',
      icon: '💎',
      requirement: (progress) => Object.values(progress.scores).some(score => score >= 100),
      reward: 'Shows exceptional understanding'
    },
    streakMaster: {
      id: 'streakMaster',
      name: 'Streak Master',
      description: 'Achieve a 10-day streak',
      icon: '🔥',
      requirement: (progress) => progress.streakCount >= 10,
      reward: 'Consistent dedication'
    },
    speedLearner: {
      id: 'speedLearner',
      name: 'Speed Learner',
      description: 'Complete 10 letters in one session',
      icon: '⚡',
      requirement: (progress) => progress.milestones.lettersCompleted >= 10,
      reward: 'Rapid progress recognition'
    },
    dedicated: {
      id: 'dedicated',
      name: 'Dedicated Student',
      description: 'Study for 60 minutes total',
      icon: '📚',
      requirement: (progress) => progress.exerciseStats.studyTimeMinutes >= 60,
      reward: 'Commitment to learning'
    }
  };

  // Check and unlock achievements
  const checkAchievements = (currentProgress) => {
    const newAchievements = [];
    const existingAchievementIds = currentProgress.achievements.map(a => a.id);

    Object.values(ACHIEVEMENTS).forEach(achievement => {
      if (!existingAchievementIds.includes(achievement.id) && achievement.requirement(currentProgress)) {
        newAchievements.push({
          ...achievement,
          unlockedAt: new Date().toISOString()
        });
      }
    });

    return newAchievements;
  };

  // Check if letter is unlocked
  const isLetterUnlocked = (letterId) => {
    return userProgress.unlockedLetters.includes(letterId);
  };

  // Get next letters to unlock based on performance
  const checkForUnlocks = (currentScores, currentlyUnlocked) => {
    const unlocked = [...currentlyUnlocked];
    const currentLevel = Math.max(...koreanAlphabet
      .filter(letter => currentlyUnlocked.includes(letter.id))
      .map(letter => letter.difficulty), 1);

    // Unlock letters of next difficulty level if performance is good
    const currentLevelLetters = koreanAlphabet.filter(letter =>
      letter.difficulty === currentLevel && currentlyUnlocked.includes(letter.id)
    );

    const averageCurrentLevelScore = currentLevelLetters.length > 0
      ? currentLevelLetters.reduce((sum, letter) => sum + (currentScores[letter.id] || 0), 0) / currentLevelLetters.length
      : 0;

    // If average score for current level is > 70%, unlock next level
    if (averageCurrentLevelScore > 70 && currentLevel < 4) {
      const nextLevelLetters = koreanAlphabet.filter(letter => letter.difficulty === currentLevel + 1);
      nextLevelLetters.forEach(letter => {
        if (!unlocked.includes(letter.id)) {
          unlocked.push(letter.id);
        }
      });
    }

    return unlocked;
  };

  // Get letters available for practice (unlocked letters)
  const getAvailableLetters = () => {
    return koreanAlphabet.filter(letter => isLetterUnlocked(letter.id));
  };

  // Get locked letters count
  const getLockedLettersCount = () => {
    return 24 - userProgress.unlockedLetters.length;
  };

  // Calculate overall progress percentage
  const getOverallProgress = () => {
    const unlockedCount = userProgress.unlockedLetters.length;
    return Math.round((unlockedCount / 24) * 100);
  };

  // Get unlocked achievements
  const getUnlockedAchievements = () => {
    return userProgress.achievements;
  };

  // Get locked achievements
  const getLockedAchievements = () => {
    const unlockedIds = userProgress.achievements.map(a => a.id);
    return Object.values(ACHIEVEMENTS).filter(achievement => !unlockedIds.includes(achievement.id));
  };

  // Get exercise statistics
  const getExerciseStats = () => {
    return userProgress.exerciseStats;
  };

  // Get detailed progress metrics
  const getProgressMetrics = () => {
    const totalLetters = 24;
    const unlockedLetters = userProgress.unlockedLetters.length;
    const completedLetters = userProgress.completedLetters.length;
    const totalScore = userProgress.totalScore;
    const averageScore = getAverageScore();

    return {
      totalLetters,
      unlockedLetters,
      completedLetters,
      totalScore,
      averageScore,
      unlockProgress: Math.round((unlockedLetters / totalLetters) * 100),
      completionProgress: Math.round((completedLetters / totalLetters) * 100),
      currentLevel: Math.max(...koreanAlphabet
        .filter(letter => userProgress.unlockedLetters.includes(letter.id))
        .map(letter => letter.difficulty), 1)
    };
  };

  // Reset all progress (for testing purposes)
  const resetAllProgress = () => {
    const initialProgress = {
      completedLetters: [],
      scores: {},
      currentLevel: 1,
      totalScore: 0,
      streakCount: 0,
      lastPracticeDate: null,
      achievements: [],
      unlockedLetters: [1, 2, 3, 4, 5, 15, 16, 17, 18, 19], // Start with first 5 consonants and 5 vowels
      exerciseStats: {
        totalQuestions: 0,
        correctAnswers: 0,
        currentStreak: 0,
        bestStreak: 0,
        totalScore: 0,
        averageScore: 0,
        studyTimeMinutes: 0,
        longestStreak: 0
      },
      milestones: {
        lettersCompleted: 0,
        perfectScores: 0,
        weeklyGoal: false,
        monthlyGoal: false
      }
    };

    setUserProgress(initialProgress);
    localStorage.setItem('korean-alphabet-progress', JSON.stringify(initialProgress));
  };

  const value = {
    userProgress,
    markLetterCompleted,
    updateScore,
    incrementStreak,
    resetStreak,
    addAchievement,
    getProgressPercentage,
    isLetterCompleted,
    getBestScore,
    getAverageScore,
    isLetterUnlocked,
    getAvailableLetters,
    getLockedLettersCount,
    getOverallProgress,
    getUnlockedAchievements,
    getLockedAchievements,
    getExerciseStats,
    getProgressMetrics,
    resetAllProgress,
    ACHIEVEMENTS
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};