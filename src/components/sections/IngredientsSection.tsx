import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface IngredientOrigin {
  name: string;
  origin: string;
  region: string;
  description: string;
  usedIn: string[];
  position: { x: string; y: string };
}

const INGREDIENT_ORIGINS: IngredientOrigin[] = [
  {
    name: 'Jasmine Sambac',
    origin: 'Tamil Nadu',
    region: 'South India',
    description: 'The Indian jasmine — more indolic and heady. Picked at night when the flowers are fully open.',
    usedIn: ['Elysium', 'Oasis'],
    position: { x: '55%', y: '78%' },
  },
  {
    name: 'Mysore Sandalwood',
    origin: 'Karnataka',
    region: 'South India',
    description: 'One of the most precious woody materials in perfumery. Creamy, milky warmth.',
    usedIn: ['Twilight', 'Oasis', 'Mirage'],
    position: { x: '48%', y: '72%' },
  },
  {
    name: 'Lotus Absolute',
    origin: 'Rajasthan',
    region: 'Western India',
    description: 'Extracted from lotus flowers grown in Rajasthani lakes. Aquatic but warm.',
    usedIn: ['Oasis'],
    position: { x: '38%', y: '50%' },
  },
  {
    name: 'Kashmiri Saffron',
    origin: 'Pampore, Kashmir',
    region: 'Northern India',
    description: 'Harvested by hand in October, one filament at a time. The most expensive spice in the world.',
    usedIn: ['Reserve: Saffron Dusk'],
    position: { x: '35%', y: '18%' },
  },
  {
    name: 'Cardamom',
    origin: 'Kerala',
    region: 'Southwest India',
    description: 'Warm-spiced and slightly camphoraceous. Kerala cardamom is uniquely bright.',
    usedIn: ['Horizon', 'Reserve: Saffron Dusk'],
    position: { x: '45%', y: '82%' },
  },
];

export function IngredientsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [activeIngredient, setActiveIngredient] = useState<IngredientOrigin | null>(null);

  return (
    <section id="ingredients" ref={ref} className="py-24 relative">
      <div className="container mx-auto px-6">
        {/* Header */}
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

        {/* Map & Ingredients */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* India Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-[3/4] max-h-[600px] glass-panel p-8"
          >
            {/* Simplified India shape SVG */}
            <svg viewBox="0 0 100 120" className="w-full h-full" fill="none">
              <path
                d="M35 5 L55 3 L65 8 L72 5 L75 10 L68 15 L70 22 L75 25 L78 30 L80 40 L82 50 L78 60 L72 70 L65 80 L58 90 L52 100 L48 110 L45 105 L42 95 L38 85 L32 75 L28 65 L25 55 L22 45 L25 35 L28 25 L32 15 L35 5Z"
                stroke="hsl(var(--amorist-gold) / 0.3)"
                strokeWidth="0.5"
                fill="hsl(var(--amorist-gold) / 0.03)"
              />
            </svg>

            {/* Ingredient dots */}
            {INGREDIENT_ORIGINS.map((ing) => (
              <button
                key={ing.name}
                className="absolute group"
                style={{ left: ing.position.x, top: ing.position.y, transform: 'translate(-50%, -50%)' }}
                onMouseEnter={() => setActiveIngredient(ing)}
                onMouseLeave={() => setActiveIngredient(null)}
                onClick={() => setActiveIngredient(activeIngredient?.name === ing.name ? null : ing)}
              >
                <span className="block w-3 h-3 rounded-full bg-primary relative">
                  <span className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />
                </span>
              </button>
            ))}

            {/* Active Ingredient Popup */}
            {activeIngredient && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute bottom-4 left-4 right-4 glass-panel p-4 z-10"
              >
                <div className="flex items-start gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-display text-lg text-foreground">{activeIngredient.name}</h4>
                    <p className="font-mono text-xs text-primary tracking-wider">{activeIngredient.origin}</p>
                  </div>
                </div>
                <p className="font-body text-sm text-muted-foreground mb-2">{activeIngredient.description}</p>
                <p className="font-body text-xs text-muted-foreground">
                  Used in: <span className="text-primary">{activeIngredient.usedIn.join(', ')}</span>
                </p>
              </motion.div>
            )}
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
                className={`p-5 rounded-xl border transition-all cursor-pointer ${
                  activeIngredient?.name === ing.name
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-border/50 hover:border-primary/20'
                }`}
                onMouseEnter={() => setActiveIngredient(ing)}
                onMouseLeave={() => setActiveIngredient(null)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-display text-xl text-foreground">{ing.name}</h4>
                  <span className="font-mono text-xs text-primary tracking-wider">{ing.origin}</span>
                </div>
                <p className="font-body text-sm text-muted-foreground mb-3">{ing.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {ing.usedIn.map((name) => (
                    <span key={name} className="px-2 py-0.5 rounded-full bg-secondary text-xs font-body text-muted-foreground">
                      {name}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
