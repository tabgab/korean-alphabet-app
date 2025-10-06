/**
 * Audio utilities for Korean learning app
 * Provides functions for playing sounds for letters, syllables, and words
 */

// Audio cache to avoid reloading sounds
const audioCache = new Map();

// Check if browser supports speech synthesis
export const isSpeechSupported = () => {
  return 'speechSynthesis' in window;
};

// Get available Korean voices
export const getKoreanVoices = () => {
  if (!isSpeechSupported()) return [];

  const voices = window.speechSynthesis.getVoices();
  return voices.filter(voice =>
    voice.lang.startsWith('ko') ||
    voice.name.toLowerCase().includes('korean') ||
    voice.name.toLowerCase().includes('korea')
  );
};

// Play Korean text using speech synthesis
export const speakKorean = (text, options = {}) => {
  if (!isSpeechSupported()) {
    console.warn('Speech synthesis not supported in this browser');
    return Promise.reject(new Error('Speech synthesis not supported'));
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const koreanVoices = getKoreanVoices();

    // Configure audio options
    utterance.rate = options.rate || 0.8; // Slightly slower for clarity
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 0.8;

    if (koreanVoices.length > 0) {
      utterance.voice = koreanVoices[0];
      utterance.lang = utterance.voice.lang;
    } else {
      // Fallback to Korean locale
      utterance.lang = 'ko-KR';
    }

    // Handle speech events
    utterance.onend = () => resolve();
    utterance.onerror = (error) => reject(error);
    utterance.onstart = options.onStart || null;

    // Speak the text
    window.speechSynthesis.speak(utterance);
  });
};

// Play individual letter sound
export const playLetterSound = (letter) => {
  if (!letter || !letter.koreanLetter) {
    console.warn('Invalid letter provided for audio playback');
    return Promise.reject(new Error('Invalid letter'));
  }

  // For single letters, repeat them for clarity
  const textToSpeak = letter.koreanLetter.repeat(2);
  return speakKorean(textToSpeak, {
    rate: 0.6, // Slower for individual letters
    onStart: () => console.log(`Playing sound for letter: ${letter.name}`)
  });
};

// Play syllable sound
export const playSyllableSound = (syllable) => {
  if (!syllable) {
    console.warn('Invalid syllable provided for audio playback');
    return Promise.reject(new Error('Invalid syllable'));
  }

  // Use the syllable text if available, otherwise construct from components
  const textToSpeak = syllable.syllable || syllable.text ||
    (syllable.consonant && syllable.vowel ?
      syllable.consonant + syllable.vowel + (syllable.final || '') : '');

  if (!textToSpeak) {
    console.warn('No text found for syllable audio playback');
    return Promise.reject(new Error('No text for syllable'));
  }

  return speakKorean(textToSpeak, {
    rate: 0.7,
    onStart: () => console.log(`Playing sound for syllable: ${textToSpeak}`)
  });
};

// Play word sound
export const playWordSound = (word) => {
  if (!word) {
    console.warn('Invalid word provided for audio playback');
    return Promise.reject(new Error('Invalid word'));
  }

  // Use Korean text if available, otherwise fall back to romanization
  const textToSpeak = word.korean || word.text || word.romanization || '';

  if (!textToSpeak) {
    console.warn('No text found for word audio playback');
    return Promise.reject(new Error('No text for word'));
  }

  return speakKorean(textToSpeak, {
    rate: 0.8,
    onStart: () => console.log(`Playing sound for word: ${textToSpeak}`)
  });
};

// Play pronunciation guide (English sound description)
export const playPronunciationGuide = (letter) => {
  if (!letter || !letter.englishSound) {
    console.warn('Invalid letter or missing pronunciation guide');
    return Promise.reject(new Error('Invalid letter or missing pronunciation'));
  }

  // Use Web Speech API with English voice for pronunciation guide
  if (!isSpeechSupported()) {
    console.warn('Speech synthesis not supported');
    return Promise.reject(new Error('Speech synthesis not supported'));
  }

  window.speechSynthesis.cancel();

  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(letter.englishSound);

    // Use English voice for pronunciation guide
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(voice =>
      voice.lang.startsWith('en') &&
      (voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('woman'))
    ) || voices.find(voice => voice.lang.startsWith('en'));

    if (englishVoice) {
      utterance.voice = englishVoice;
      utterance.lang = englishVoice.lang;
    } else {
      utterance.lang = 'en-US';
    }

    utterance.rate = 0.9;
    utterance.pitch = 1.1; // Slightly higher pitch for clarity

    utterance.onend = () => resolve();
    utterance.onerror = (error) => reject(error);

    window.speechSynthesis.speak(utterance);
  });
};

// Stop all audio playback
export const stopAllAudio = () => {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
};

// Preload voices (call this when app starts)
export const preloadVoices = () => {
  if (isSpeechSupported()) {
    // Force browser to load voices
    window.speechSynthesis.getVoices();
  }
};

// Audio playback with visual feedback
export const playAudioWithFeedback = async (text, type = 'general', options = {}) => {
  try {
    // Add visual feedback class to body or specific element
    document.body.classList.add('audio-playing');

    await speakKorean(text, options);

    return Promise.resolve();
  } catch (error) {
    console.error(`Error playing ${type} audio:`, error);
    return Promise.reject(error);
  } finally {
    // Remove visual feedback
    document.body.classList.remove('audio-playing');
  }
};