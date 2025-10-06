// Korean Alphabet (Hangul) Data Structure
// Contains all 14 consonants and 10 vowels with learning information

export const koreanConsonants = [
  {
    id: 1,
    name: 'Kiyeok',
    koreanLetter: 'ㄱ',
    romanization: 'g/k',
    englishSound: 'g/k',
    englishComparison: 'Like "g" in "go" or "k" in "kite" depending on position',
    pictogram: 'square-angle',
    exampleWords: ['go', 'kite', 'key'],
    category: 'consonant',
    difficulty: 1,
    visualAid: 'Like a backwards "L" with a small line',
    strokeOrder: [1, 2, 3],
    commonWords: [
      '가다 (to go)',
      '고양이 (cat)',
      '기다리다 (to wait)',
      '국물 (soup)',
      '김치 (kimchi)',
      '학교 (school)',
      '한국 (Korea)',
      '커피 (coffee)'
    ],
    syllablePosition: 'initial'
  },
  {
    id: 2,
    name: 'Nieun',
    koreanLetter: 'ㄴ',
    romanization: 'n',
    englishSound: 'n',
    englishComparison: 'Like "n" in "now"',
    pictogram: 'line-horizontal',
    exampleWords: ['now', 'noon', 'name'],
    category: 'consonant',
    difficulty: 1,
    visualAid: 'Like a horizontal line',
    strokeOrder: [1],
    commonWords: [
      '나 (I/me)',
      '나무 (tree)',
      '너 (you)',
      '노래 (song)',
      '눈 (eye/snow)',
      '날다 (to fly)',
      '남자 (man)',
      '내일 (tomorrow)',
      '나라 (country)',
      '노래하다 (to sing)'
    ],
    syllablePosition: 'initial'
  },
  {
    id: 3,
    name: 'Digeut',
    koreanLetter: 'ㄷ',
    romanization: 'd/t',
    englishSound: 'd/t',
    englishComparison: 'Like "d" in "dog" or "t" in "top" depending on position',
    pictogram: 'square-angle',
    exampleWords: ['dog', 'top', 'day'],
    category: 'consonant',
    difficulty: 1,
    visualAid: 'Like a square bracket facing right',
    strokeOrder: [1, 2],
    commonWords: [
      '다 (all)',
      '도시 (city)',
      '대하다 (to treat)',
      '독서 (reading)',
      '닭 (chicken)',
      '달 (moon)',
      '동물 (animal)',
      '땅 (ground)'
    ],
    syllablePosition: 'initial'
  },
  {
    id: 4,
    name: 'Rieul',
    koreanLetter: 'ㄹ',
    romanization: 'r/l',
    englishSound: 'r/l',
    englishComparison: 'Like "r" in "run" or "l" in "lamp" depending on position',
    pictogram: 'line-diagonal',
    exampleWords: ['run', 'lamp', 'red'],
    category: 'consonant',
    difficulty: 2,
    visualAid: 'Like two diagonal lines meeting',
    strokeOrder: [1, 2],
    commonWords: [
      '라 (as/like)',
      '로 (with/by)',
      '리 (lee)',
      '루 (roux)',
      '레 (re)',
      '러 (Russia)',
      '래 (ray)',
      '려 (yeo)'
    ],
    syllablePosition: 'initial'
  },
  {
    id: 5,
    name: 'Mieum',
    koreanLetter: 'ㅁ',
    romanization: 'm',
    englishSound: 'm',
    englishComparison: 'Like "m" in "mouse"',
    pictogram: 'square',
    exampleWords: ['mouse', 'man', 'more'],
    category: 'consonant',
    difficulty: 1,
    visualAid: 'Like a square',
    strokeOrder: [1, 2, 3, 4],
    commonWords: [
      '마 (ma)',
      '모 (mo)',
      '미 (mi)',
      '무 (mu)',
      '메 (me)',
      '머 (meo)',
      '매 (mae)',
      '먀 (mya)'
    ],
    syllablePosition: 'initial'
  },
  {
    id: 6,
    name: 'Bieup',
    koreanLetter: 'ㅂ',
    romanization: 'b/p',
    englishSound: 'b/p',
    englishComparison: 'Like "b" in "boy" or "p" in "park" depending on position',
    pictogram: 'square-angle',
    exampleWords: ['boy', 'park', 'big'],
    category: 'consonant',
    difficulty: 1,
    visualAid: 'Like a square with a lid',
    strokeOrder: [1, 2, 3],
    commonWords: [
      '바 (ba)',
      '보 (bo)',
      '비 (bi)',
      '부 (bu)',
      '베 (be)',
      '버 (beo)',
      '배 (bae)',
      '벼 (byeo)'
    ],
    syllablePosition: 'initial'
  },
  {
    id: 7,
    name: 'Si-ot',
    koreanLetter: 'ㅅ',
    romanization: 's/t',
    englishSound: 's/t',
    englishComparison: 'Like "s" in "sing" or "t" in "top" depending on position',
    pictogram: 'line-horizontal',
    exampleWords: ['sing', 'top', 'sit'],
    category: 'consonant',
    difficulty: 2,
    visualAid: 'Like two horizontal lines',
    strokeOrder: [1, 2],
    commonWords: [
      '사 (sa)',
      '소 (so)',
      '시 (si)',
      '수 (su)',
      '세 (se)',
      '서 (seo)',
      '새 (sae)',
      '셔 (syeo)'
    ],
    syllablePosition: 'initial'
  },
  {
    id: 8,
    name: 'Ieung',
    koreanLetter: 'ㅇ',
    romanization: 'ng/-',
    englishSound: 'ng/silent',
    englishComparison: 'Like "ng" in "sing" or silent at syllable start',
    pictogram: 'circle',
    exampleWords: ['sing', 'ring', 'song'],
    category: 'consonant',
    difficulty: 1,
    visualAid: 'Like a circle',
    strokeOrder: [1],
    commonWords: [
      '아 (ah)',
      '오 (oh)',
      '이 (ee)',
      '우 (oo)',
      '에 (eh)',
      '어 (uh)',
      '애 (ae)',
      '여 (yuh)'
    ],
    syllablePosition: 'initial/final'
  },
  {
    id: 9,
    name: 'Jieut',
    koreanLetter: 'ㅈ',
    romanization: 'j/t',
    englishSound: 'j/t',
    englishComparison: 'Like "j" in "jump" or "t" in "church" depending on position',
    pictogram: 'square-angle',
    exampleWords: ['jump', 'church', 'jet'],
    category: 'consonant',
    difficulty: 2,
    visualAid: 'Like a backwards "C" with a line',
    strokeOrder: [1, 2, 3],
    commonWords: [
      '자 (ja)',
      '조 (jo)',
      '지 (ji)',
      '주 (ju)',
      '제 (je)',
      '저 (jeo)',
      '재 (jae)',
      '져 (jyeo)'
    ],
    syllablePosition: 'initial'
  },
  {
    id: 10,
    name: 'Chieut',
    koreanLetter: 'ㅊ',
    romanization: 'ch/t',
    englishSound: 'ch/t',
    englishComparison: 'Like "ch" in "church" or "t" in "top" depending on position',
    pictogram: 'line-horizontal',
    exampleWords: ['church', 'top', 'chip'],
    category: 'consonant',
    difficulty: 3,
    visualAid: 'Like three horizontal lines',
    strokeOrder: [1, 2, 3],
    commonWords: [
      '차 (cha)',
      '초 (cho)',
      '치 (chi)',
      '추 (chu)',
      '체 (che)',
      '처 (cheo)',
      '채 (chae)',
      '쳐 (chyeo)'
    ],
    syllablePosition: 'initial'
  },
  {
    id: 11,
    name: 'Kieuk',
    koreanLetter: 'ㅋ',
    romanization: 'k',
    englishSound: 'k',
    englishComparison: 'Like "k" in "kite" (aspirated)',
    pictogram: 'square-angle',
    exampleWords: ['kite', 'key', 'car'],
    category: 'consonant',
    difficulty: 3,
    visualAid: 'Like ㄱ but with extra breath',
    strokeOrder: [1, 2, 3],
    commonWords: [
      '카 (ka)',
      '코 (ko)',
      '키 (ki)',
      '쿠 (ku)',
      '케 (ke)',
      '커 (keo)',
      '캐 (kae)',
      '켜 (kyeo)'
    ],
    syllablePosition: 'initial'
  },
  {
    id: 12,
    name: 'Tieut',
    koreanLetter: 'ㅌ',
    romanization: 't',
    englishSound: 't',
    englishComparison: 'Like "t" in "top" (aspirated)',
    pictogram: 'square-angle',
    exampleWords: ['top', 'time', 'take'],
    category: 'consonant',
    difficulty: 3,
    visualAid: 'Like ㄷ but with extra breath',
    strokeOrder: [1, 2],
    commonWords: [
      '타 (ta)',
      '토 (to)',
      '티 (ti)',
      '투 (tu)',
      '테 (te)',
      '터 (teo)',
      '태 (tae)',
      '터 (tyeo)'
    ],
    syllablePosition: 'initial'
  },
  {
    id: 13,
    name: 'Pieup',
    koreanLetter: 'ㅍ',
    romanization: 'p',
    englishSound: 'p',
    englishComparison: 'Like "p" in "park" (aspirated)',
    pictogram: 'square-angle',
    exampleWords: ['park', 'pie', 'put'],
    category: 'consonant',
    difficulty: 3,
    visualAid: 'Like ㅂ but with extra breath',
    strokeOrder: [1, 2, 3],
    commonWords: [
      '파 (pa)',
      '포 (po)',
      '피 (pi)',
      '푸 (pu)',
      '페 (pe)',
      '퍼 (peo)',
      '패 (pae)',
      '펴 (pyeo)'
    ],
    syllablePosition: 'initial'
  },
  {
    id: 14,
    name: 'Hieut',
    koreanLetter: 'ㅎ',
    romanization: 'h',
    englishSound: 'h',
    englishComparison: 'Like "h" in "house"',
    pictogram: 'line-diagonal',
    exampleWords: ['house', 'hat', 'hope'],
    category: 'consonant',
    difficulty: 2,
    visualAid: 'Like two diagonal lines',
    strokeOrder: [1, 2],
    commonWords: [
      '하 (ha)',
      '호 (ho)',
      '히 (hi)',
      '후 (hu)',
      '헤 (he)',
      '허 (heo)',
      '해 (hae)',
      '혀 (hyeo)'
    ],
    syllablePosition: 'initial'
  }
];

export const koreanVowels = [
  {
    id: 15,
    name: 'A',
    koreanLetter: 'ㅏ',
    romanization: 'a',
    englishSound: 'ah',
    englishComparison: 'Like "a" in "father"',
    pictogram: 'line-vertical',
    exampleWords: ['father', 'car', 'far'],
    category: 'vowel',
    difficulty: 1,
    visualAid: 'Like a vertical line with a small horizontal branch',
    strokeOrder: [1, 2],
    commonWords: [
      '가 (family)',
      '나 (I/me)',
      '다 (all)',
      '라 (as/like)',
      '마 (ma)',
      '바 (ba)',
      '사 (sa)',
      '자 (ja)'
    ],
    syllablePosition: 'medial'
  },
  {
    id: 16,
    name: 'Ya',
    koreanLetter: 'ㅑ',
    romanization: 'ya',
    englishSound: 'yah',
    englishComparison: 'Like "ya" in "yacht"',
    pictogram: 'line-vertical',
    exampleWords: ['yacht', 'yard', 'yam'],
    category: 'vowel',
    difficulty: 2,
    visualAid: 'Like ㅏ but with an extra line',
    strokeOrder: [1, 2, 3],
    commonWords: [
      '야 (ya)',
      '냐 (nya)',
      '댜 (dya)',
      '랴 (rya)',
      '먀 (mya)',
      '뱌 (bya)',
      '샤 (sya)',
      '쟈 (jya)'
    ],
    syllablePosition: 'medial'
  },
  {
    id: 17,
    name: 'Eo',
    koreanLetter: 'ㅓ',
    romanization: 'eo',
    englishSound: 'uh',
    englishComparison: 'Like "u" in "but"',
    pictogram: 'line-horizontal',
    exampleWords: ['but', 'cut', 'run'],
    category: 'vowel',
    difficulty: 1,
    visualAid: 'Like a horizontal line with a small vertical branch',
    strokeOrder: [1, 2],
    commonWords: [
      '거 (geo)',
      '너 (neo)',
      '더 (deo)',
      '러 (reo)',
      '머 (meo)',
      '버 (beo)',
      '서 (seo)',
      '저 (jeo)'
    ],
    syllablePosition: 'medial'
  },
  {
    id: 18,
    name: 'Yeo',
    koreanLetter: 'ㅕ',
    romanization: 'yeo',
    englishSound: 'yuh',
    englishComparison: 'Like "yu" in "yule"',
    pictogram: 'line-horizontal',
    exampleWords: ['yule', 'cute', 'pure'],
    category: 'vowel',
    difficulty: 2,
    visualAid: 'Like ㅓ but with an extra line',
    strokeOrder: [1, 2, 3],
    commonWords: [
      '겨 (gyeo)',
      '녀 (nyeo)',
      '뎌 (dyeo)',
      '려 (ryeo)',
      '며 (myeo)',
      '벼 (byeo)',
      '셔 (syeo)',
      '져 (jyeo)'
    ],
    syllablePosition: 'medial'
  },
  {
    id: 19,
    name: 'O',
    koreanLetter: 'ㅗ',
    romanization: 'o',
    englishSound: 'oh',
    englishComparison: 'Like "o" in "more"',
    pictogram: 'circle-half',
    exampleWords: ['more', 'door', 'four'],
    category: 'vowel',
    difficulty: 1,
    visualAid: 'Like a horizontal line with a circle above',
    strokeOrder: [1, 2],
    commonWords: [
      '고 (go)',
      '노 (no)',
      '도 (do)',
      '로 (ro)',
      '모 (mo)',
      '보 (bo)',
      '소 (so)',
      '조 (jo)'
    ],
    syllablePosition: 'medial'
  },
  {
    id: 20,
    name: 'Yo',
    koreanLetter: 'ㅛ',
    romanization: 'yo',
    englishSound: 'yoh',
    englishComparison: 'Like "yo" in "yodel"',
    pictogram: 'circle-half',
    exampleWords: ['yodel', 'yoke', 'yolk'],
    category: 'vowel',
    difficulty: 3,
    visualAid: 'Like ㅗ but with an extra line',
    strokeOrder: [1, 2, 3],
    commonWords: [
      '교 (gyo)',
      '뇨 (nyo)',
      '됴 (dyo - dyo)',
      '료 (ryo - ryo)',
      '묘 (myo - myo)',
      '뵤 (byo - byo)',
      '쇼 (syo - syo)',
      '죠 (jyo - jyo)'
    ],
    syllablePosition: 'medial'
  },
  {
    id: 21,
    name: 'U',
    koreanLetter: 'ㅜ',
    romanization: 'u',
    englishSound: 'oo',
    englishComparison: 'Like "u" in "rude"',
    pictogram: 'circle-half',
    exampleWords: ['rude', 'moon', 'food'],
    category: 'vowel',
    difficulty: 1,
    visualAid: 'Like a horizontal line with a circle below',
    strokeOrder: [1, 2],
    commonWords: [
      '구 (gu - gu)',
      '누 (nu - nu)',
      '두 (du - du)',
      '루 (ru - ru)',
      '무 (mu - mu)',
      '부 (bu - bu)',
      '수 (su - su)',
      '주 (ju - ju)'
    ],
    syllablePosition: 'medial'
  },
  {
    id: 22,
    name: 'Yu',
    koreanLetter: 'ㅠ',
    romanization: 'yu',
    englishSound: 'yoo',
    englishComparison: 'Like "yu" in "yule"',
    pictogram: 'circle-half',
    exampleWords: ['yule', 'cute', 'music'],
    category: 'vowel',
    difficulty: 3,
    visualAid: 'Like ㅜ but with an extra line',
    strokeOrder: [1, 2, 3],
    commonWords: [
      '규 (gyu)',
      '뉴 (nyu)',
      '듀 (dyu)',
      '류 (ryu)',
      '뮤 (myu)',
      '뷰 (byu)',
      '슈 (syu)',
      '쥬 (jyu)'
    ],
    syllablePosition: 'medial'
  },
  {
    id: 23,
    name: 'Eu',
    koreanLetter: 'ㅡ',
    romanization: 'eu',
    englishSound: 'eu',
    englishComparison: 'Like "eu" in "leur" (French)',
    pictogram: 'line-horizontal',
    exampleWords: ['leur', 'sir', 'her'],
    category: 'vowel',
    difficulty: 2,
    visualAid: 'Like a single horizontal line',
    strokeOrder: [1],
    commonWords: [
      '그 (geu)',
      '느 (neu)',
      '드 (deu)',
      '르 (reu)',
      '므 (meu)',
      '브 (beu)',
      '스 (seu)',
      '즈 (jeu)'
    ],
    syllablePosition: 'medial'
  },
  {
    id: 24,
    name: 'I',
    koreanLetter: 'ㅣ',
    romanization: 'i',
    englishSound: 'ee',
    englishComparison: 'Like "i" in "machine"',
    pictogram: 'line-vertical',
    exampleWords: ['machine', 'see', 'tree'],
    category: 'vowel',
    difficulty: 1,
    visualAid: 'Like a vertical line',
    strokeOrder: [1],
    commonWords: [
      '기 (gi)',
      '니 (ni)',
      '디 (di)',
      '리 (ri)',
      '미 (mi)',
      '비 (bi)',
      '시 (si)',
      '지 (ji)'
    ],
    syllablePosition: 'medial'
  }
];

// Combined alphabet for easy access
export const koreanAlphabet = [...koreanConsonants, ...koreanVowels];

// Helper function to get random letters
export const getRandomLetters = (count) => {
  const shuffled = [...koreanAlphabet].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to create syllables
export const createSyllable = (consonant, vowel) => {
  if (!consonant || !vowel) return '';
  return consonant.koreanLetter + vowel.koreanLetter;
};

// Example words for syllable assembly practice
export const exampleWords = [
  {
    id: 1,
    korean: '가다',
    romanization: 'gada',
    english: 'to go',
    syllables: [
      {
        syllable: '가',
        consonant: 'ㄱ',
        vowel: 'ㅏ',
        structure: 'CV'
      },
      {
        syllable: '다',
        consonant: 'ㄷ',
        vowel: 'ㅏ',
        structure: 'CV'
      }
    ]
  },
  {
    id: 2,
    korean: '사랑',
    romanization: 'sarang',
    english: 'love',
    syllables: [
      {
        syllable: '사',
        consonant: 'ㅅ',
        vowel: 'ㅏ',
        structure: 'CV'
      },
      {
        syllable: '랑',
        consonant: 'ㄹ',
        vowel: 'ㅏ',
        final: 'ㅇ',
        structure: 'CVC'
      }
    ]
  },
  {
    id: 3,
    korean: '학교',
    romanization: 'hakgyo',
    english: 'school',
    syllables: [
      {
        syllable: '학',
        consonant: 'ㅎ',
        vowel: 'ㅏ',
        final: 'ㄱ',
        structure: 'CVC'
      },
      {
        syllable: '교',
        consonant: 'ㄱ',
        vowel: 'ㅛ',
        structure: 'CV'
      }
    ]
  },
  {
    id: 4,
    korean: '사람',
    romanization: 'saram',
    english: 'person',
    syllables: [
      {
        syllable: '사',
        consonant: 'ㅅ',
        vowel: 'ㅏ',
        structure: 'CV'
      },
      {
        syllable: '람',
        consonant: 'ㄹ',
        vowel: 'ㅏ',
        final: 'ㅁ',
        structure: 'CVC'
      }
    ]
  },
  {
    id: 5,
    korean: '한국',
    romanization: 'hanguk',
    english: 'Korea',
    syllables: [
      {
        syllable: '한',
        consonant: 'ㅎ',
        vowel: 'ㅏ',
        final: 'ㄴ',
        structure: 'CVC'
      },
      {
        syllable: '국',
        consonant: 'ㄱ',
        vowel: 'ㅜ',
        final: 'ㄱ',
        structure: 'CVC'
      }
    ]
  }
];