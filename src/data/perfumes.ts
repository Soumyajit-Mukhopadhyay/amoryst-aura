export interface PerfumeIngredient {
  name: string;
  origin: string;
  note: 'top' | 'heart' | 'base';
  description: string;
}

export interface PerfumeSize {
  ml: number | string;
  price: number;
  sku: string;
}

export interface PerfumeBottle {
  shape: string;
  profilePoints: number[][];
  liquidColor: string;
  liquidOpacity: number;
  glassColor: string;
  glassOpacity: number;
  capColor: string;
  capStyle: string;
  labelAccentColor: string;
  particleColor: string;
  lightingTint: string;
  envIntensity: number;
}

export interface Perfume {
  id: string;
  name: string;
  tagline: string;
  story: string;
  personality: string | null;
  occasionLabel: string;
  scentFamily: string;
  character: string[];
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  ingredients: PerfumeIngredient[];
  longevity: number;
  sillage: string;
  season: string[];
  occasions: string[];
  sizes: PerfumeSize[];
  bottle: PerfumeBottle;
  monthlyVolume: number | null;
  bestSeller?: boolean;
  limited?: boolean;
  totalBottles?: number;
  bottlesRemaining?: number;
  isKit?: boolean;
}

export const PERFUMES: Perfume[] = [
  {
    id: 'twilight', name: 'Twilight', tagline: 'For your most compelling self.',
    story: 'Twilight is the hour when the city exhales and the evening begins. Worn by the version of you that walks into a room and stays remembered.',
    personality: 'The Evening Self', occasionLabel: 'Evenings. Dinners. Moments that matter.',
    scentFamily: 'Oriental Floral', character: ['Magnetic', 'Warm', 'Confident'],
    topNotes: ['Black Pepper', 'Bergamot', 'Pink Peppercorn'],
    heartNotes: ['Rose Absolute', 'Oud Accord', 'Iris'],
    baseNotes: ['Sandalwood', 'Amber', 'Musk', 'Vetiver'],
    ingredients: [
      { name: 'Rose Absolute', origin: 'Grasse, France', note: 'heart', description: 'Steam-distilled from Centifolia roses harvested at dawn.' },
      { name: 'Mysore Sandalwood', origin: 'Karnataka, India', note: 'base', description: 'Creamy, milky warmth that anchors the fragrance for 10-12 hours.' },
    ],
    longevity: 12, sillage: 'Moderate to Heavy', season: ['Autumn', 'Winter'],
    occasions: ['Evening', 'Date', 'Formal'],
    sizes: [{ ml: 15, price: 499, sku: 'TWLT-15' }, { ml: 100, price: 1999, sku: 'TWLT-100' }],
    bottle: { shape: 'tall-angular', profilePoints: [[0,0],[0.6,0],[0.65,0.5],[0.55,1.5],[0.45,3],[0.35,4.2],[0.3,5],[0.25,5.8],[0.2,6.2],[0.18,6.5],[0.1,6.8],[0.08,7]], liquidColor: '#4A1942', liquidOpacity: 0.85, glassColor: '#1A0A1A', glassOpacity: 0.3, capColor: '#B8922A', capStyle: 'faceted-hexagon', labelAccentColor: '#B8922A', particleColor: '#FFD4A3', lightingTint: '#6B1A35', envIntensity: 1.4 },
    monthlyVolume: 1034, bestSeller: true,
  },
  {
    id: 'horizon', name: 'Horizon', tagline: 'The scent of a future already decided.',
    story: 'Clean, sharp, and purposeful — the fragrance of ambition that does not announce itself.',
    personality: 'The Forward Self', occasionLabel: 'Mornings. Boardrooms. Days you lead.',
    scentFamily: 'Woody Aromatic', character: ['Crisp', 'Purposeful', 'Unassuming'],
    topNotes: ['Grapefruit', 'Cardamom', 'Sea Salt'], heartNotes: ['Cedarwood', 'Vetiver', 'Green Tea'],
    baseNotes: ['White Musk', 'Driftwood', 'Ambrette'],
    ingredients: [{ name: 'Cardamom', origin: 'Kerala, India', note: 'top', description: 'Warm-spiced and uniquely bright.' }],
    longevity: 10, sillage: 'Light to Moderate', season: ['Spring', 'Summer', 'Autumn'],
    occasions: ['Daily', 'Work', 'Travel'],
    sizes: [{ ml: 15, price: 499, sku: 'HRZ-15' }, { ml: 100, price: 1999, sku: 'HRZ-100' }],
    bottle: { shape: 'cylindrical-clean', profilePoints: [[0,0],[0.55,0],[0.6,0.3],[0.6,4.5],[0.58,5.2],[0.5,5.8],[0.35,6.2],[0.25,6.5],[0.2,6.8],[0.15,7]], liquidColor: '#1A4A3A', liquidOpacity: 0.7, glassColor: '#0A1A2A', glassOpacity: 0.25, capColor: '#4A6A5A', capStyle: 'flat-disc', labelAccentColor: '#7ABBA0', particleColor: '#B0FFEA', lightingTint: '#1A6B5F', envIntensity: 1.2 },
    monthlyVolume: 873, bestSeller: true,
  },
  {
    id: 'eclipse', name: 'Eclipse', tagline: 'You after the evening gets interesting.',
    story: 'Darker than Twilight. More dangerous. Worn when you intend to be remembered.',
    personality: 'The Midnight Self', occasionLabel: 'Late nights. Encounters.',
    scentFamily: 'Dark Oriental', character: ['Mysterious', 'Smoky', 'Seductive'],
    topNotes: ['Black Oud', 'Dark Plum', 'Smoked Incense'], heartNotes: ['Labdanum', 'Patchouli', 'Leather Accord'],
    baseNotes: ['Benzoin', 'Tonka Bean', 'Dark Musk'],
    ingredients: [{ name: 'Labdanum Absolute', origin: 'Spain', note: 'heart', description: 'The most complex natural material in perfumery.' }],
    longevity: 14, sillage: 'Heavy', season: ['Autumn', 'Winter'],
    occasions: ['Night', 'Special occasions'],
    sizes: [{ ml: 15, price: 499, sku: 'ECL-15' }, { ml: 100, price: 1999, sku: 'ECL-100' }],
    bottle: { shape: 'gothic-tapered', profilePoints: [[0,0],[0.7,0],[0.75,0.4],[0.6,2],[0.45,4],[0.35,5.5],[0.28,6.2],[0.2,6.8],[0.15,7]], liquidColor: '#0A0212', liquidOpacity: 0.95, glassColor: '#0A0510', glassOpacity: 0.4, capColor: '#1A0A0A', capStyle: 'pyramid', labelAccentColor: '#4A0A1A', particleColor: '#9A3A5A', lightingTint: '#2C0A3B', envIntensity: 1.6 },
    monthlyVolume: 638,
  },
  {
    id: 'elysium', name: 'Elysium', tagline: 'The version of you that is simply, entirely present.',
    story: 'Soft, luminous, and undemanding — worn not to impress but to inhabit your own ease.',
    personality: 'The Present Self', occasionLabel: 'Weekends. Leisure. Simply being.',
    scentFamily: 'Floral Musk', character: ['Soft', 'Luminous', 'Effortless'],
    topNotes: ['Peach Blossom', 'Neroli', 'White Tea'], heartNotes: ['Jasmine Sambac', 'Ylang Ylang', 'Magnolia'],
    baseNotes: ['Cashmeran', 'Musks', 'Vanilla Absolute'],
    ingredients: [{ name: 'Jasmine Sambac', origin: 'Tamil Nadu, India', note: 'heart', description: 'The Indian jasmine — picked at night when the flowers are fully open.' }],
    longevity: 8, sillage: 'Light', season: ['Spring', 'Summer'],
    occasions: ['Daytime', 'Weekend', 'Casual'],
    sizes: [{ ml: 15, price: 499, sku: 'ELY-15' }, { ml: 100, price: 1999, sku: 'ELY-100' }],
    bottle: { shape: 'soft-oval', profilePoints: [[0,0],[0.5,0],[0.6,0.5],[0.65,2],[0.6,4],[0.5,5.5],[0.35,6.2],[0.22,6.7],[0.15,7]], liquidColor: '#F4D4A0', liquidOpacity: 0.6, glassColor: '#FFF8EE', glassOpacity: 0.15, capColor: '#D4A060', capStyle: 'soft-dome', labelAccentColor: '#D4A060', particleColor: '#FFE8B0', lightingTint: '#6B4A1A', envIntensity: 1.0 },
    monthlyVolume: 819,
  },
  {
    id: 'mirage', name: 'Mirage', tagline: 'Your most unforgettable entrance.',
    story: 'The fragrance equivalent of walking into a room and having the conversation change.',
    personality: 'The Elusive Self', occasionLabel: 'Grand arrivals. Quiet power.',
    scentFamily: 'Powdery Chypre', character: ['Sophisticated', 'Elusive', 'Powerful'],
    topNotes: ['Aldehydes', 'Bergamot', 'Green Galbanum'], heartNotes: ['Oakmoss Accord', 'Geranium', 'Rose de Mai'],
    baseNotes: ['Vetiver', 'Civet Accord', 'Sandalwood'],
    ingredients: [{ name: 'Rose de Mai', origin: 'Grasse, France', note: 'heart', description: 'Harvested only in May, only in Grasse.' }],
    longevity: 12, sillage: 'Moderate', season: ['Spring', 'Autumn'],
    occasions: ['Special', 'Gala', 'Important meetings'],
    sizes: [{ ml: 15, price: 499, sku: 'MRG-15' }, { ml: 100, price: 1999, sku: 'MRG-100' }],
    bottle: { shape: 'art-deco-stepped', profilePoints: [[0,0],[0.65,0],[0.68,0.2],[0.68,1],[0.6,1.2],[0.6,2],[0.5,2.2],[0.5,4],[0.42,4.2],[0.42,5.5],[0.32,5.8],[0.22,6.5],[0.15,7]], liquidColor: '#3A1A4A', liquidOpacity: 0.8, glassColor: '#1A0A2A', glassOpacity: 0.35, capColor: '#C8A850', capStyle: 'art-deco-stepped', labelAccentColor: '#C8A850', particleColor: '#E8C870', lightingTint: '#4A1A6B', envIntensity: 1.5 },
    monthlyVolume: 735,
  },
  {
    id: 'oasis', name: 'Oasis', tagline: 'The evening you slow down and stay.',
    story: 'The scent of still water and warm stone at dusk.',
    personality: 'The Settled Self', occasionLabel: 'Slow evenings. Good company.',
    scentFamily: 'Aquatic Woody', character: ['Calm', 'Deep', 'Inviting'],
    topNotes: ['Lotus', 'Water Hyacinth', 'Lemon Grass'], heartNotes: ['Aquatic Accord', 'Jasmine', 'Cedar Bark'],
    baseNotes: ['Ambergris Accord', 'Sandalwood', 'Skin Musk'],
    ingredients: [{ name: 'Lotus Absolute', origin: 'Rajasthan, India', note: 'top', description: 'Aquatic but warm, like water that has held the sun all day.' }],
    longevity: 9, sillage: 'Light to Moderate', season: ['Summer', 'Spring'],
    occasions: ['Evening', 'Relaxation', 'Intimate'],
    sizes: [{ ml: 15, price: 499, sku: 'OAS-15' }, { ml: 100, price: 1999, sku: 'OAS-100' }],
    bottle: { shape: 'water-drop', profilePoints: [[0,0],[0.4,0],[0.55,0.8],[0.65,2],[0.65,4],[0.55,5.5],[0.38,6.3],[0.22,6.8],[0.12,7]], liquidColor: '#0A2A3A', liquidOpacity: 0.65, glassColor: '#0A1A2A', glassOpacity: 0.2, capColor: '#3A6A7A', capStyle: 'ripple-disc', labelAccentColor: '#5AAABB', particleColor: '#80E0FF', lightingTint: '#0D4F45', envIntensity: 1.1 },
    monthlyVolume: 419,
  },
  {
    id: 'reserve-saffron', name: 'Reserve: Saffron Dusk', tagline: 'One ingredient. One region. One season. 200 bottles.',
    story: 'Crafted with Kashmiri saffron harvested in October 2025. Each bottle numbered.',
    personality: 'The Collector Self', occasionLabel: 'The rare occasions.',
    scentFamily: 'Spicy Floral Oriental', character: ['Rare', 'Warm', 'Deeply Indian'],
    topNotes: ['Saffron', 'Rose', 'Oud'], heartNotes: ['Tuberose', 'Cardamom', 'Cinnamon Bark'],
    baseNotes: ['Amber', 'Vetiver', 'Benzoin', 'Musk'],
    ingredients: [{ name: 'Kashmiri Saffron', origin: 'Pampore, Kashmir', note: 'top', description: 'The most expensive spice in the world, harvested by hand.' }],
    longevity: 16, sillage: 'Heavy', season: ['Autumn', 'Winter'],
    occasions: ['Gifting', 'Collector', 'Heritage'],
    sizes: [{ ml: 15, price: 999, sku: 'RSV-SAFF-15' }, { ml: 100, price: 3499, sku: 'RSV-SAFF-100' }],
    bottle: { shape: 'heritage-urn', profilePoints: [[0,0],[0.55,0],[0.75,0.5],[0.8,1.5],[0.75,3],[0.6,4.5],[0.5,5.5],[0.35,6.2],[0.22,6.8],[0.15,7]], liquidColor: '#8B1A1A', liquidOpacity: 0.9, glassColor: '#1A0A08', glassOpacity: 0.5, capColor: '#8B6914', capStyle: 'crown', labelAccentColor: '#C8A030', particleColor: '#FFB830', lightingTint: '#8B3A14', envIntensity: 1.8 },
    monthlyVolume: null, limited: true, totalBottles: 200, bottlesRemaining: 147,
  },
  {
    id: 'sampler-kit', name: 'Discovery Kit', tagline: 'Three signatures. One is yours.',
    story: 'Choose any three 5ml samples. Find your signature before committing.',
    personality: null, occasionLabel: 'First steps into fragrance.',
    scentFamily: 'Curated Selection', character: ['Explorative', 'Smart', 'Accessible'],
    topNotes: [], heartNotes: [], baseNotes: [], ingredients: [],
    longevity: 0, sillage: '', season: [], occasions: ['Discovery', 'Gift'],
    sizes: [{ ml: '3x5ml', price: 299, sku: 'DSC-KIT' }],
    bottle: { shape: 'trio-display', profilePoints: [[0,0],[0.3,0],[0.35,0.3],[0.35,3],[0.3,3.5],[0.2,4],[0.1,4.5]], liquidColor: '#B8922A', liquidOpacity: 0.5, glassColor: '#1A1A2A', glassOpacity: 0.2, capColor: '#B8922A', capStyle: 'flat-disc', labelAccentColor: '#B8922A', particleColor: '#FFEBB0', lightingTint: '#4A3A1A', envIntensity: 1.0 },
    monthlyVolume: null, isKit: true,
  },
];

export const getPerfumeById = (id: string) => PERFUMES.find(p => p.id === id);
export const getMainPerfumes = () => PERFUMES.filter(p => !p.isKit);
