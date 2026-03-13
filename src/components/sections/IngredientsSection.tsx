import { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';

import ingredientJasmine from '@/assets/ingredient-jasmine.jpg';
import ingredientSandalwood from '@/assets/ingredient-sandalwood.jpg';
import ingredientLotus from '@/assets/ingredient-lotus.jpg';
import ingredientSaffron from '@/assets/ingredient-saffron.jpg';
import ingredientCardamom from '@/assets/ingredient-cardamom.jpg';

interface IngredientOrigin {
  name: string;
  origin: string;
  region: string;
  description: string;
  usedIn: string[];
  position: { x: string; y: string };
  image: string;
}

const INGREDIENT_ORIGINS: IngredientOrigin[] = [
  {
    name: 'Jasmine Sambac', origin: 'Tamil Nadu', region: 'South India',
    description: 'The Indian jasmine — more indolic and heady. Picked at night when the flowers are fully open.',
    usedIn: ['Elysium', 'Oasis'], position: { x: '52%', y: '75%' }, image: ingredientJasmine,
  },
  {
    name: 'Mysore Sandalwood', origin: 'Karnataka', region: 'South India',
    description: 'One of the most precious woody materials in perfumery. Creamy, milky warmth.',
    usedIn: ['Twilight', 'Oasis', 'Mirage'], position: { x: '46%', y: '68%' }, image: ingredientSandalwood,
  },
  {
    name: 'Lotus Absolute', origin: 'Rajasthan', region: 'Western India',
    description: 'Extracted from lotus flowers grown in Rajasthani lakes. Aquatic but warm.',
    usedIn: ['Oasis'], position: { x: '35%', y: '48%' }, image: ingredientLotus,
  },
  {
    name: 'Kashmiri Saffron', origin: 'Pampore, Kashmir', region: 'Northern India',
    description: 'Harvested by hand in October, one filament at a time. The most expensive spice in the world.',
    usedIn: ['Reserve: Saffron Dusk'], position: { x: '40%', y: '18%' }, image: ingredientSaffron,
  },
  {
    name: 'Cardamom', origin: 'Kerala', region: 'Southwest India',
    description: 'Warm-spiced and slightly camphoraceous. Kerala cardamom is uniquely bright.',
    usedIn: ['Horizon', 'Reserve: Saffron Dusk'], position: { x: '48%', y: '82%' }, image: ingredientCardamom,
  },
];

const INDIA_PATH = "M 45 4 L 48 3 L 52 4 L 56 3 L 60 5 L 63 4 L 67 6 L 70 5 L 73 8 L 71 12 L 74 14 L 72 17 L 74 20 L 76 22 L 74 25 L 76 28 L 78 32 L 80 28 L 82 25 L 84 28 L 82 32 L 80 36 L 78 34 L 76 36 L 78 40 L 80 44 L 82 48 L 80 52 L 78 56 L 76 60 L 74 64 L 70 68 L 66 72 L 62 76 L 58 80 L 56 84 L 54 88 L 52 92 L 50 96 L 48 94 L 50 90 L 48 86 L 46 90 L 44 86 L 42 82 L 40 78 L 38 74 L 36 70 L 34 66 L 32 62 L 30 58 L 28 54 L 26 50 L 24 46 L 22 42 L 24 38 L 26 34 L 28 30 L 30 26 L 32 22 L 34 18 L 36 14 L 38 10 L 40 8 L 42 6 L 45 4 Z";

export function IngredientsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [activeIngredient, setActiveIngredient] = useState<IngredientOrigin | null>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section id="ingredients" ref={ref} className="py-24 relative overflow-hidden">
      <motion.div
        style={{ y: parallaxY }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none"
      />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-primary mb-4 uppercase">Origins</p>
          <h2 className="font-display text-4xl md:text-6xl font-light text-foreground mb-4">
            Every note has an address.
          </h2>
          <p className="font-body text-muted-foreground max-w-lg mx-auto">
            We source from specific places. The soil matters. The season matters. The harvest matters.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* India Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-[3/4] max-h-[600px] glass-panel p-8"
          >
            <svg viewBox="0 0 105 100" className="w-full h-full" fill="none">
              <defs>
                <filter id="mapGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                </filter>
              </defs>
              <path
                d={INDIA_PATH}
                stroke="hsl(var(--primary) / 0.15)"
                strokeWidth="1.5"
                fill="none"
                filter="url(#mapGlow)"
              />
              <path
                d={INDIA_PATH}
                stroke="hsl(var(--primary) / 0.4)"
                strokeWidth="0.5"
                fill="hsl(var(--primary) / 0.03)"
              />
              <line x1="30" y1="55" x2="78" y2="55" stroke="hsl(var(--primary) / 0.08)" strokeWidth="0.3" strokeDasharray="2,2" />
              <line x1="36" y1="40" x2="80" y2="40" stroke="hsl(var(--primary) / 0.08)" strokeWidth="0.3" strokeDasharray="2,2" />
            </svg>

            {INGREDIENT_ORIGINS.map((ing, idx) => (
              <button
                key={ing.name}
                className="absolute group"
                style={{ left: ing.position.x, top: ing.position.y, transform: 'translate(-50%, -50%)' }}
                onMouseEnter={() => setActiveIngredient(ing)}
                onMouseLeave={() => setActiveIngredient(null)}
                onClick={() => setActiveIngredient(activeIngredient?.name === ing.name ? null : ing)}
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ delay: 0.5 + idx * 0.15, type: 'spring' }}
                  className="block w-3.5 h-3.5 rounded-full bg-primary relative cursor-pointer"
                >
                  <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30" />
                  <span className="absolute -inset-1 rounded-full border border-primary/30" />
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.8 + idx * 0.15 }}
                  className="absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[9px] tracking-wider text-primary/60 uppercase"
                >
                  {ing.origin}
                </motion.span>
              </button>
            ))}

            <AnimatePresence>
              {activeIngredient && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-4 left-4 right-4 glass-panel overflow-hidden z-10"
                >
                  <div className="flex">
                    <img src={activeIngredient.image} alt={activeIngredient.name} className="w-24 h-24 object-cover flex-shrink-0" />
                    <div className="p-3">
                      <div className="flex items-start gap-1 mb-1">
                        <MapPin className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-display text-base text-foreground">{activeIngredient.name}</h4>
                          <p className="font-mono text-[10px] text-primary tracking-wider">{activeIngredient.origin}</p>
                        </div>
                      </div>
                      <p className="font-body text-xs text-muted-foreground">{activeIngredient.description}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Ingredient List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4"
          >
            {INGREDIENT_ORIGINS.map((ing, i) => (
              <motion.div
                key={ing.name}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                whileHover={{ x: 4 }}
                className={`flex gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                  activeIngredient?.name === ing.name
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-border/50 hover:border-primary/20'
                }`}
                onMouseEnter={() => setActiveIngredient(ing)}
                onMouseLeave={() => setActiveIngredient(null)}
              >
                <img
                  src={ing.image}
                  alt={ing.name}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div>
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-display text-lg text-foreground">{ing.name}</h4>
                    <span className="font-mono text-[10px] text-primary tracking-wider">{ing.origin}</span>
                  </div>
                  <p className="font-body text-sm text-muted-foreground mb-2">{ing.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {ing.usedIn.map((name) => (
                      <span key={name} className="px-2 py-0.5 rounded-full bg-secondary text-xs font-body text-muted-foreground">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
