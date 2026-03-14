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

// ─── Fragrance Archetype System ─────────────────────────────────

export interface FragranceArchetype {
  id: string;
  name: string;
  tagline: string;
  family: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  intensity: 'light' | 'moderate' | 'heavy';
  longevity: string;
  bestFor: string[];
  personality: string[];
  primarySku: string;
  secondarySku: string | null;
  notForYouIf: string;
  discoveryLine: string;
}

export const ARCHETYPES: Record<string, FragranceArchetype> = {
  luminous: {
    id: 'luminous',
    name: 'The Luminous',
    tagline: 'Soft, warm, and entirely present.',
    family: 'Floral Musk',
    topNotes: ['Peach Blossom', 'Neroli', 'White Tea'],
    heartNotes: ['Jasmine Sambac', 'Ylang Ylang', 'Magnolia'],
    baseNotes: ['Cashmeran', 'White Musk', 'Vanilla Absolute'],
    intensity: 'light',
    longevity: '6–8 hours',
    bestFor: ['daytime', 'weekends', 'casual', 'gifting'],
    personality: ['warm', 'gentle', 'effortless', 'approachable'],
    primarySku: 'elysium',
    secondarySku: 'oasis',
    notForYouIf: 'You want something bold, smoky, or night-ready.',
    discoveryLine: 'You are drawn to warmth over drama. Elysium was made for the version of you that is simply, entirely at ease.',
  },
  ambitious: {
    id: 'ambitious',
    name: 'The Ambitious',
    tagline: 'Clean, purposeful, and quietly powerful.',
    family: 'Woody Aromatic',
    topNotes: ['Grapefruit', 'Cardamom', 'Sea Salt'],
    heartNotes: ['Cedarwood', 'Vetiver', 'Green Tea'],
    baseNotes: ['White Musk', 'Driftwood', 'Ambrette'],
    intensity: 'moderate',
    longevity: '8–10 hours',
    bestFor: ['daytime', 'work', 'travel', 'daily'],
    personality: ['crisp', 'purposeful', 'confident', 'unassuming'],
    primarySku: 'horizon',
    secondarySku: 'twilight',
    notForYouIf: 'You want something heavy, floral, or occasion-specific.',
    discoveryLine: 'You need a scent that works as hard as you do, without announcing itself. Horizon is for the day you own before it begins.',
  },
  magnetic: {
    id: 'magnetic',
    name: 'The Magnetic',
    tagline: 'Warm, confident, and deeply remembered.',
    family: 'Oriental Floral',
    topNotes: ['Black Pepper', 'Bergamot', 'Pink Peppercorn'],
    heartNotes: ['Rose Absolute', 'Oud Accord', 'Iris'],
    baseNotes: ['Mysore Sandalwood', 'Amber', 'Musk'],
    intensity: 'moderate',
    longevity: '10–12 hours',
    bestFor: ['evening', 'dates', 'formal', 'dinners'],
    personality: ['confident', 'warm', 'magnetic', 'compelling'],
    primarySku: 'twilight',
    secondarySku: 'mirage',
    notForYouIf: 'You want something light, daytime, or subtle.',
    discoveryLine: 'You are your most compelling in the evening. Twilight is the scent of the hour when the city exhales and you begin.',
  },
  midnight: {
    id: 'midnight',
    name: 'The Midnight',
    tagline: 'Smoky, seductive, and impossible to ignore.',
    family: 'Dark Oriental',
    topNotes: ['Oud', 'Dark Plum', 'Smoked Incense'],
    heartNotes: ['Labdanum', 'Patchouli', 'Leather Accord'],
    baseNotes: ['Tonka Bean', 'Benzoin', 'Dark Musk'],
    intensity: 'heavy',
    longevity: '12–14 hours',
    bestFor: ['night', 'special occasions', 'statement moments', 'bold evenings'],
    personality: ['mysterious', 'smoky', 'bold', 'intense'],
    primarySku: 'eclipse',
    secondarySku: 'twilight',
    notForYouIf: 'You want something wearable every day or suitable for the office.',
    discoveryLine: 'You do not want to be subtle. Eclipse is darker than Twilight and more dangerous, for the nights you intend to be remembered.',
  },
  elusive: {
    id: 'elusive',
    name: 'The Elusive',
    tagline: 'Sophisticated, rare, and quietly in command.',
    family: 'Powdery Chypre',
    topNotes: ['Aldehydes', 'Bergamot', 'Green Galbanum'],
    heartNotes: ['Oakmoss Accord', 'Geranium', 'Rose de Mai'],
    baseNotes: ['Vetiver', 'Sandalwood', 'Oakmoss'],
    intensity: 'moderate',
    longevity: '10–12 hours',
    bestFor: ['special', 'formal', 'power moments', 'important meetings'],
    personality: ['sophisticated', 'elusive', 'poised', 'powerful'],
    primarySku: 'mirage',
    secondarySku: 'reserve-saffron',
    notForYouIf: 'You want something casual, fresh, or easy-to-wear daily.',
    discoveryLine: 'You understand that the most powerful entrance is the one that does not try. Mirage is worn when you choose, deliberately, to be a little out of reach.',
  },
  settled: {
    id: 'settled',
    name: 'The Settled',
    tagline: 'Calm, aquatic, and deeply comforting.',
    family: 'Aquatic Woody',
    topNotes: ['Lotus', 'Water Hyacinth', 'Lemongrass'],
    heartNotes: ['Aquatic Accord', 'Jasmine', 'Cedar Bark'],
    baseNotes: ['Ambergris Accord', 'Sandalwood', 'Skin Musk'],
    intensity: 'light',
    longevity: '8–9 hours',
    bestFor: ['slow evenings', 'relaxation', 'intimate', 'summer'],
    personality: ['calm', 'grounded', 'inviting', 'unhurried'],
    primarySku: 'oasis',
    secondarySku: 'elysium',
    notForYouIf: 'You want something bold, smoky, or designed for a crowd.',
    discoveryLine: 'You are not chasing anything tonight. Oasis is for the evenings that are not meant to end — and the company that asks for nothing.',
  },
  collector: {
    id: 'collector',
    name: 'The Collector',
    tagline: 'Rare, heritage, and unapologetically Indian.',
    family: 'Spicy Floral Oriental',
    topNotes: ['Kashmiri Saffron', 'Rose', 'Oud'],
    heartNotes: ['Tuberose', 'Cardamom', 'Cinnamon Bark'],
    baseNotes: ['Amber', 'Vetiver', 'Benzoin', 'Musk'],
    intensity: 'heavy',
    longevity: '14–16 hours',
    bestFor: ['heritage moments', 'gifting', 'collector', 'statement occasions'],
    personality: ['rare', 'warm', 'deeply Indian', 'intentional'],
    primarySku: 'reserve-saffron',
    secondarySku: 'twilight',
    notForYouIf: 'You want an everyday scent. This is not for every day.',
    discoveryLine: 'You understand that some things are worth the price of rarity. Reserve: Saffron Dusk is 200 numbered bottles of Kashmiri saffron, and when they are gone, they are gone.',
  },
};

// ─── Answer → Archetype Scoring Matrix ─────────────────────────

export const ANSWER_ARCHETYPE_MAP: Record<string, Partial<Record<string, number>>> = {
  // REGION (1 point — soft signal)
  north:    { midnight: 1, collector: 1 },
  south:    { luminous: 1, settled: 1 },
  east:     { magnetic: 1, luminous: 1 },
  west:     { elusive: 1, collector: 1 },

  // PREFERENCE (strongest — 3 points)
  flower:   { luminous: 3, magnetic: 2 },
  spice:    { collector: 3, ambitious: 2 },
  wood:     { midnight: 3, elusive: 2 },
  fresh:    { settled: 3, ambitious: 2 },

  // MOMENT (strong — 2–3 points)
  morning:  { ambitious: 3 },
  evening:  { magnetic: 2, midnight: 2 },
  weekend:  { luminous: 2, settled: 2 },
  occasion: { elusive: 3, collector: 2 },

  // LONGEVITY (tie-breaker — 1 point)
  light:    { luminous: 1, settled: 1 },
  medium:   { ambitious: 1, magnetic: 1 },
  long:     { midnight: 1, elusive: 1, collector: 1 },

  // RELATIONSHIP (1–2 points)
  first:    { luminous: 2, ambitious: 1 },
  casual:   { magnetic: 1, ambitious: 1 },
  serious:  { elusive: 2, collector: 2 },
  gifting:  { magnetic: 2, luminous: 1 },
};

// ─── Quiz Data ──────────────────────────────────────────────────

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
        { id: 'light', label: '4-6 hours, a presence, not a statement', emoji: '🌸', tag: 'light', filter: ['elysium', 'oasis'] },
        { id: 'medium', label: '8-10 hours, all day, effortlessly', emoji: '⏳', tag: 'medium', filter: ['horizon', 'twilight'] },
        { id: 'long', label: '12+ hours, still there at midnight', emoji: '🌙', tag: 'long', filter: ['eclipse', 'mirage', 'reserve-saffron'] },
      ],
    },
    {
      id: 'relationship', question: 'What is your relationship with perfume right now?', type: 'single-image-card',
      options: [
        { id: 'first', label: 'This would be my first real perfume', emoji: '✨', tag: 'newcomer', boost: ['elysium', 'horizon'] },
        { id: 'casual', label: 'I wear perfume but never had a signature', emoji: '🔍', tag: 'explorer', boost: ['twilight', 'horizon'] },
        { id: 'serious', label: 'I know what I like; I want exceptional', emoji: '🏆', tag: 'enthusiast', boost: ['mirage', 'reserve-saffron'] },
        { id: 'gifting', label: 'I am buying this as a gift', emoji: '🎁', tag: 'gifter', boost: ['twilight', 'elysium'] },
      ],
    },
  ] as QuizQuestion[],
};

// ─── Archetype Scoring Function ─────────────────────────────────

export function scoreQuizToArchetype(answers: QuizOption[]): {
  primary: FragranceArchetype;
  secondary: FragranceArchetype;
} {
  const scores: Record<string, number> = {};
  Object.keys(ARCHETYPES).forEach(k => { scores[k] = 0; });

  answers.forEach(answer => {
    const mapping = ANSWER_ARCHETYPE_MAP[answer.id];
    if (!mapping) return;
    Object.entries(mapping).forEach(([archetype, score]) => {
      scores[archetype] = (scores[archetype] || 0) + (score || 0);
    });
  });

  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const primary = ARCHETYPES[ranked[0][0]];
  const secondary = ARCHETYPES[ranked[1][0]];

  return { primary, secondary };
}

// Legacy fallback — keep for compatibility
export function scoreQuizAnswers(answers: QuizOption[]): string[] {
  const scores: Record<string, number> = {};
  answers.forEach(a => {
    (a.boost || []).forEach(id => { scores[id] = (scores[id] || 0) + 2; });
    (a.filter || []).forEach(id => { scores[id] = (scores[id] || 0) + 1; });
  });
  return Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 2).map(e => e[0]);
}
