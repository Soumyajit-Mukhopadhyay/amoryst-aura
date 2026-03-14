export interface QuizOption {
  id: string;
  label: string;
  emoji?: string;
  sensoryHint?: string;
  tag: string;
  scents?: string[];
  boost?: string[];
  filter?: string[];
  recommend?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  subtext?: string;
  type: string;
  options: QuizOption[];
}

export const QUIZ = {
  intro: {
    headline: 'Find Your Signature',
    subhead: 'Answer 5 questions. We find your scent. Takes 90 seconds.',
    cta: 'Begin',
  },
  questions: [
    {
      id: 'name', question: 'What should we call you?', type: 'text-input',
      options: [],
    },
    {
      id: 'region', question: 'Which region of the country do you come from?', type: 'single-image-card',
      options: [
        { id: 'north', label: 'North India', emoji: '🏔️', tag: 'north', boost: ['horizon', 'eclipse'] },
        { id: 'south', label: 'South India', emoji: '🌴', tag: 'south', boost: ['elysium', 'oasis'] },
        { id: 'east', label: 'East India', emoji: '🌿', tag: 'east', boost: ['twilight'] },
        { id: 'west', label: 'West India', emoji: '🏜️', tag: 'west', boost: ['reserve-saffron', 'mirage'] },
      ],
    },
    {
      id: 'preference', question: 'What do you most want to smell like?', type: 'single-image-card',
      options: [
        { id: 'flower', label: 'Floral (rose, jasmine)', sensoryHint: 'Warm, soft, alive', tag: 'floral', boost: ['elysium', 'twilight'] },
        { id: 'spice', label: 'Oriental (warm, spicy)', sensoryHint: 'Bright, spiced, comforting', tag: 'oriental', boost: ['horizon', 'reserve-saffron'] },
        { id: 'wood', label: 'Woody (earthy woody notes)', sensoryHint: 'Dry, cedarwood, grounded', tag: 'woody', boost: ['eclipse', 'mirage'] },
        { id: 'fresh', label: 'Fresh (citrusy, aquatic)', sensoryHint: 'Breezy, clean, energized', tag: 'fresh', boost: ['oasis', 'horizon'] },
      ],
    },
    {
      id: 'moment', question: 'Which moment do you most want a fragrance for?', type: 'single-image-card',
      options: [
        { id: 'morning', label: 'The start of a day I own', emoji: '☀', tag: 'daytime', boost: ['horizon'] },
        { id: 'evening', label: 'An evening that matters', emoji: '🌆', tag: 'evening', boost: ['twilight', 'eclipse'] },
        { id: 'weekend', label: 'Sunday slowness', emoji: '🌿', tag: 'leisure', boost: ['elysium', 'oasis'] },
        { id: 'occasion', label: 'A moment I want remembered', emoji: '✦', tag: 'special', boost: ['mirage', 'reserve-saffron'] },
      ],
    },
    {
      id: 'longevity', question: 'How long do you want the scent to last?', type: 'single-image-card',
      options: [
        { id: 'light', label: '4-6 hours — a presence, not a statement', emoji: '🌸', tag: 'light', filter: ['elysium', 'oasis'] },
        { id: 'medium', label: '8-10 hours — all day, effortlessly', emoji: '⏳', tag: 'medium', filter: ['horizon', 'twilight'] },
        { id: 'long', label: '12+ hours — still there at midnight', emoji: '🌙', tag: 'long', filter: ['eclipse', 'mirage', 'reserve-saffron'] },
      ],
    },
    {
      id: 'relationship', question: 'What is your relationship with perfume right now?', type: 'single-image-card',
      options: [
        { id: 'first', label: 'This would be my first real perfume', emoji: '✨', tag: 'newcomer', boost: ['elysium', 'horizon'] },
        { id: 'casual', label: 'I wear perfume but never had a signature', emoji: '🔍', tag: 'explorer', boost: ['twilight', 'horizon'] },
        { id: 'serious', label: 'I know what I like — I want exceptional', emoji: '🏆', tag: 'enthusiast', boost: ['mirage', 'reserve-saffron'] },
        { id: 'gifting', label: 'I am buying this as a gift', emoji: '🎁', tag: 'gifter', boost: ['twilight', 'elysium'] },
      ],
    },
  ] as QuizQuestion[],
};

export function scoreQuizAnswers(answers: QuizOption[]): string[] {
  const scores: Record<string, number> = {};
  answers.forEach(a => {
    (a.boost || []).forEach(id => { scores[id] = (scores[id] || 0) + 2; });
    (a.filter || []).forEach(id => { scores[id] = (scores[id] || 0) + 1; });
  });
  return Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 2).map(e => e[0]);
}
