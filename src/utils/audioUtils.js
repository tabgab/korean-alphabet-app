/**
 * Audio utilities for Korean learning app
 * Provides functions for playing sounds for letters, syllables, and words
 */

// Audio cache to avoid reloading sounds
const audioCache = new Map();

// Korean character compatibility database
// Some Korean characters have poor browser support, so we provide alternatives
const koreanCharacterSupport = {
  // Problematic characters that need special handling
  'ㅑ': {
    primary: 'ㅑ',
    fallbacks: ['ya', 'yah', '야'], // Romanization and full syllable fallbacks
    support: 'limited' // Known to have issues in many browsers
  },
  'ㅛ': {
    primary: 'ㅛ',
    fallbacks: ['yo', 'yoh', '요'],
    support: 'limited'
  },
  'ㅠ': {
    primary: 'ㅠ',
    fallbacks: ['yu', 'yoo', '유'],
    support: 'limited'
  },
  'ㅖ': {
    primary: 'ㅖ',
    fallbacks: ['ye', 'yeh', '예'],
    support: 'limited'
  },
  'ㅘ': {
    primary: 'ㅘ',
    fallbacks: ['wa', 'wah', '와'],
    support: 'limited'
  },
  'ㅚ': {
    primary: 'ㅚ',
    fallbacks: ['we', 'weh', '외'],
    support: 'limited'
  },
  'ㅝ': {
    primary: 'ㅝ',
    fallbacks: ['wo', 'wah', '워'],
    support: 'limited'
  },
  'ㅟ': {
    primary: 'ㅟ',
    fallbacks: ['wi', 'wee', '위'],
    support: 'limited'
  },
  'ㅢ': {
    primary: 'ㅢ',
    fallbacks: ['ui', 'ee', '의'],
    support: 'limited'
  },

  // Additional characters that might need fallbacks
  'ㄸ': {
    primary: 'ㄸ',
    fallbacks: ['tt', 'dd', '따'],
    support: 'limited'
  },
  'ㅃ': {
    primary: 'ㅃ',
    fallbacks: ['pp', 'bb', '빠'],
    support: 'limited'
  },
  'ㅉ': {
    primary: 'ㅉ',
    fallbacks: ['jj', 'zz', '짜'],
    support: 'limited'
  },
  'ㄲ': {
    primary: 'ㄲ',
    fallbacks: ['kk', 'gg', '까'],
    support: 'limited'
  },
  'ㅆ': {
    primary: 'ㅆ',
    fallbacks: ['ss', '싸'],
    support: 'limited'
  },
  'ㄹ': {
    primary: 'ㄹ',
    fallbacks: ['r', 'l', '라'],
    support: 'limited'
  }
};

// Build comprehensive database from koreanAlphabetData
export const buildKoreanCharacterDatabase = () => {
  const database = {};

  // This would be populated from the actual alphabet data
  // For now, we'll use the manual database above

  return database;
};

// Check if a Korean character needs special handling
export const getKoreanCharacterSupport = (character) => {
  return koreanCharacterSupport[character] || {
    primary: character,
    fallbacks: [],
    support: 'good'
  };
};

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

  if (!text || text.trim() === '') {
    console.warn('Empty text provided for speech synthesis');
    return Promise.reject(new Error('Empty text'));
  }

  console.log('Attempting to speak Korean text:', text);

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const koreanVoices = getKoreanVoices();

    // Configure audio options with enhanced settings for Korean
    utterance.rate = options.rate || 0.7; // Slower for Korean characters
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 0.9;

    if (koreanVoices.length > 0) {
      utterance.voice = koreanVoices[0];
      utterance.lang = utterance.voice.lang;
      console.log('Using Korean voice:', utterance.voice.name);
    } else {
      // Fallback to Korean locale
      utterance.lang = 'ko-KR';
      console.log('No Korean voice found, using ko-KR locale');
    }

    // Enhanced error handling
    utterance.onend = () => {
      console.log('Speech synthesis completed successfully');
      resolve();
    };

    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      console.error('Error details:', {
        text: text,
        voice: utterance.voice?.name,
        lang: utterance.lang,
        rate: utterance.rate,
        pitch: utterance.pitch,
        volume: utterance.volume
      });

      // Try fallback with English voice if Korean fails
      if (utterance.lang.startsWith('ko') && error.error !== 'canceled') {
        console.log('Attempting fallback with English voice');
        return fallbackToEnglish(text, options).then(resolve).catch(reject);
      }

      reject(error);
    };

    utterance.onstart = () => {
      console.log('Speech synthesis started for:', text);
      if (options.onStart) options.onStart();
    };

    // Speak the text
    window.speechSynthesis.speak(utterance);
  });
};

// Fallback function to use English voice when Korean voice fails
const fallbackToEnglish = (text, options) => {
  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);

    // Use English voice for fallback
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => voice.lang.startsWith('en'));

    if (englishVoice) {
      utterance.voice = englishVoice;
      utterance.lang = englishVoice.lang;
    } else {
      utterance.lang = 'en-US';
    }

    utterance.rate = 0.8;
    utterance.pitch = 1.1;

    utterance.onend = () => resolve();
    utterance.onerror = (error) => reject(error);

    window.speechSynthesis.speak(utterance);
  });
};

// Play individual letter sound with enhanced Korean support
export const playLetterSound = async (letter) => {
  if (!letter || !letter.koreanLetter) {
    console.warn('Invalid letter provided for audio playback');
    return Promise.reject(new Error('Invalid letter'));
  }

  console.log('Playing letter sound for:', letter.koreanLetter, 'Name:', letter.name);

  const charSupport = getKoreanCharacterSupport(letter.koreanLetter);

  // Try different approaches based on character support level
  if (charSupport.support === 'limited') {
    console.log(`Character ${letter.koreanLetter} has limited support, using fallback methods`);
    return playLetterSoundWithFallback(letter, charSupport);
  }

  // For single letters, repeat them for clarity
  const textToSpeak = letter.koreanLetter.repeat(2);

  try {
    // Enhanced Korean character handling
    await speakKorean(textToSpeak, {
      rate: 0.5, // Even slower for individual letters
      pitch: 1.2, // Slightly higher pitch for clarity
      onStart: () => {
        console.log(`Playing sound for letter: ${letter.name} (${letter.koreanLetter})`);
      }
    });
  } catch (error) {
    console.error(`Error playing letter ${letter.name}:`, error);

    // Try fallback methods
    return playLetterSoundWithFallback(letter, charSupport);
  }
};

// Enhanced fallback system for problematic Korean characters
const playLetterSoundWithFallback = async (letter, charSupport) => {
  const attempts = [
    // Try primary Korean character with different settings
    { text: letter.koreanLetter.repeat(3), lang: 'ko-KR', rate: 0.3 },

    // Try romanization if available
    ...(letter.romanization ? [{ text: letter.romanization, lang: 'en-US', rate: 0.6 }] : []),

    // Try fallback pronunciations from database
    ...charSupport.fallbacks.map(fallback => ({
      text: fallback,
      lang: fallback.length === 1 ? 'ko-KR' : 'en-US',
      rate: 0.6
    })),

    // Try with English description
    ...(letter.englishSound ? [{ text: letter.englishSound, lang: 'en-US', rate: 0.7 }] : [])
  ];

  for (let i = 0; i < attempts.length; i++) {
    const attempt = attempts[i];
    console.log(`Attempting fallback ${i + 1}/${attempts.length}: "${attempt.text}" with lang: ${attempt.lang}`);

    try {
      await speakKorean(attempt.text, {
        rate: attempt.rate,
        pitch: 1.1,
        onStart: () => {
          console.log(`Fallback successful for letter: ${letter.name} using "${attempt.text}"`);
        }
      });
      return; // Success, exit the function
    } catch (error) {
      console.log(`Fallback attempt ${i + 1} failed:`, error);
      if (i === attempts.length - 1) {
        throw new Error(`All fallback attempts failed for Korean character: ${letter.koreanLetter}`);
      }
    }
  }
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

// Debug function to test Korean character pronunciation
export const testKoreanCharacter = (character) => {
  console.log('Testing Korean character:', character);
  console.log('Character code:', character.charCodeAt(0));
  console.log('Character hex:', character.charCodeAt(0).toString(16));

  // Try to speak the character
  return speakKorean(character, {
    rate: 0.3,
    onStart: () => console.log('Started speaking character'),
    onError: (error) => console.log('Error speaking character:', error)
  });
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