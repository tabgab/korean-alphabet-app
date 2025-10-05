import React from 'react';
import { useProgress } from '../context/ProgressContext';

const ProgressSection = () => {
  const {
    userProgress,
    getUnlockedAchievements,
    getLockedAchievements,
    getExerciseStats,
    getProgressMetrics,
    getAvailableLetters,
    isLetterCompleted,
    getBestScore,
    resetAllProgress
  } = useProgress();

  // Generate exercise recommendations based on progress
  const getExerciseRecommendations = () => {
    const availableLetters = getAvailableLetters();
    const currentLevel = Math.max(...availableLetters.map(letter => letter.difficulty), 1);
    const levelLetters = availableLetters.filter(letter => letter.difficulty === currentLevel);

    const recommendations = [];

    // Recommend practicing incomplete letters
    const incompleteLetters = levelLetters.filter(letter => !isLetterCompleted(letter.id));
    if (incompleteLetters.length > 0) {
      recommendations.push({
        icon: '🎯',
        title: 'Complete Current Level',
        description: `Practice ${incompleteLetters.length} remaining Level ${currentLevel} letters`,
        reason: `Finish ${incompleteLetters.map(l => l.name).join(', ')} to unlock Level ${currentLevel + 1}`
      });
    }

    // Recommend specific exercise types based on performance
    const avgScore = getProgressMetrics().averageScore;
    if (avgScore < 70) {
      recommendations.push({
        icon: '📝',
        title: 'Build Strong Foundations',
        description: 'Focus on Multiple Choice and Letter Matching exercises',
        reason: 'Strengthen your basics before advancing to harder content'
      });
    } else if (avgScore > 85) {
      recommendations.push({
        icon: '⚡',
        title: 'Challenge Yourself',
        description: 'Try Sound Association and Word Association exercises',
        reason: 'You\'re ready for more advanced pronunciation practice'
      });
    }

    // Recommend streak building
    if (userProgress.streakCount < 5) {
      recommendations.push({
        icon: '🔥',
        title: 'Build Your Streak',
        description: 'Practice daily to build momentum',
        reason: 'Consistent practice leads to better retention and unlocks streak achievements'
      });
    }

    return recommendations.slice(0, 3); // Limit to 3 recommendations
  };

  const progress = getProgressMetrics();
  const unlockedAchievements = getUnlockedAchievements();
  const lockedAchievements = getLockedAchievements();
  const stats = getExerciseStats();

  return (
    <div className="progress-section">
      <div className="section-header">
        <h2>Your Progress</h2>
        <p>Track your learning journey and celebrate your achievements!</p>

        <div className="progress-controls">
          <button
            className="reset-progress-btn"
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                resetAllProgress();
              }
            }}
          >
            🔄 Reset Progress (Testing)
          </button>
          <p className="reset-note">⚠️ This will clear all saved progress data</p>
        </div>
      </div>

      <div className="progress-stats">
        <div className="stat-card primary">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{progress.completedLetters}/24</h3>
            <p>Letters Mastered</p>
          </div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{progress.totalScore.toLocaleString()}</h3>
            <p>Total Points</p>
          </div>
        </div>

        <div className="stat-card accent">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>{userProgress.streakCount}</h3>
            <p>Day Streak</p>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{progress.averageScore}%</h3>
            <p>Average Score</p>
          </div>
        </div>
      </div>

      <div className="progress-overview">
        <div className="overview-item">
          <div className="overview-label">Current Level</div>
          <div className="overview-value level-{progress.currentLevel}">
            Level {progress.currentLevel}
          </div>
        </div>
        <div className="overview-item">
          <div className="overview-label">Unlocked Letters</div>
          <div className="overview-value">{progress.unlockedLetters}/24</div>
        </div>
        <div className="overview-item">
          <div className="overview-label">Study Time</div>
          <div className="overview-value">{Math.round(stats.studyTimeMinutes)}min</div>
        </div>
      </div>

      <div className="progress-details">
        <div className="progress-chart">
          <h3>Alphabet Progress</h3>
          <div className="chart-container">
            <div className="progress-circle">
              <svg viewBox="0 0 100 100" className="circular-progress">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress.completionProgress / 100)}`}
                  transform="rotate(-90 50 50)"
                  className="progress-ring"
                />
              </svg>
              <span className="progress-percentage">
                {progress.completionProgress}%
              </span>
            </div>
          </div>
        </div>

        <div className="detailed-stats">
          <h3>Exercise Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Questions Answered</span>
              <span className="stat-value">{stats.totalQuestions}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Correct Answers</span>
              <span className="stat-value">{stats.correctAnswers}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Accuracy Rate</span>
              <span className="stat-value">
                {stats.totalQuestions > 0 ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0}%
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Best Streak</span>
              <span className="stat-value">{stats.bestStreak} days</span>
            </div>
          </div>
        </div>

        <div className="progress-goals">
          <h3>🎯 Next Level Progress</h3>
          <div className="level-progress">
            <div className="current-level">
              <h4>Current Level: {progress.currentLevel}</h4>
              <p>Master Level {progress.currentLevel} letters to unlock Level {progress.currentLevel + 1}</p>

              {progress.currentLevel < 4 && (
                <div className="unlock-requirements">
                  <h5>Requirements for Level {progress.currentLevel + 1}:</h5>
                  <div className="requirements-list">
                    <div className="requirement">
                      <span className="req-icon">📚</span>
                      <span>Complete all Level {progress.currentLevel} letters</span>
                    </div>
                    <div className="requirement">
                      <span className="req-icon">⭐</span>
                      <span>Maintain {'>'}70% average score</span>
                    </div>
                    <div className="requirement">
                      <span className="req-icon">🎯</span>
                      <span>Practice regularly for consistent progress</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="level-letters">
              <h4>Level {progress.currentLevel} Letters ({getAvailableLetters().length} available)</h4>
              <div className="letters-status">
                {getAvailableLetters()
                  .filter(letter => letter.difficulty === progress.currentLevel)
                  .map(letter => {
                    const completed = isLetterCompleted(letter.id);
                    const bestScore = getBestScore(letter.id);
                    return (
                      <div key={letter.id} className={`letter-status ${completed ? 'completed' : 'in-progress'}`}>
                        <span className="letter-symbol">{letter.koreanLetter}</span>
                        <div className="letter-progress">
                          <span className="letter-name">{letter.name}</span>
                          {completed ? (
                            <span className="completion-score">✓ {bestScore}%</span>
                          ) : (
                            <span className="practice-needed">Needs Practice</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        <div className="exercise-recommendations">
          <h3>🎓 Recommended Exercises</h3>
          <div className="recommendations">
            {getExerciseRecommendations().map((rec, index) => (
              <div key={index} className="recommendation-card">
                <div className="rec-icon">{rec.icon}</div>
                <div className="rec-content">
                  <h4>{rec.title}</h4>
                  <p>{rec.description}</p>
                  <div className="rec-reason">
                    <strong>Why:</strong> {rec.reason}
                  </div>
                </div>
                <button className="rec-action" onClick={() => window.location.hash = 'practice'}>
                  Start Exercise
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="achievements">
          <h3>Achievements</h3>
          <div className="achievements-summary">
            <span className="achievement-count">
              {unlockedAchievements.length} of 8 unlocked
            </span>
          </div>

          <div className="achievements-list">
            {unlockedAchievements.map(achievement => (
              <div key={achievement.id} className="achievement unlocked">
                <span className="achievement-icon">{achievement.icon}</span>
                <div className="achievement-content">
                  <h4>{achievement.name}</h4>
                  <p>{achievement.description}</p>
                  <span className="achievement-reward">Reward: {achievement.reward}</span>
                </div>
                <span className="achievement-date">
                  {new Date(achievement.unlockedAt).toLocaleDateString()}
                </span>
              </div>
            ))}

            {lockedAchievements.slice(0, 3).map(achievement => (
              <div key={achievement.id} className="achievement locked">
                <span className="achievement-icon locked">🔒</span>
                <div className="achievement-content">
                  <h4>{achievement.name}</h4>
                  <p>{achievement.description}</p>
                  <span className="achievement-reward">Reward: {achievement.reward}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressSection;