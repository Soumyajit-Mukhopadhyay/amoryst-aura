import { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { SourcingMap } from '@/components/ui/SourcingMap';

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
  location: { lat: number; lng: number };
  image: string;
}

const INGREDIENT_ORIGINS: IngredientOrigin[] = [
  {
    name: 'Jasmine Sambac', origin: 'Tamil Nadu', region: 'South India',
    description: 'The Indian jasmine — more indolic and heady. Picked at night when the flowers are fully open.',
    usedIn: ['Elysium', 'Oasis'], location: { lat: 10.7905, lng: 78.7047 }, image: ingredientJasmine,
  },
  {
    name: 'Mysore Sandalwood', origin: 'Karnataka', region: 'South India',
    description: 'One of the most precious woody materials in perfumery. Creamy, milky warmth.',
    usedIn: ['Twilight', 'Oasis', 'Mirage'], location: { lat: 12.2958, lng: 76.6394 }, image: ingredientSandalwood,
  },
  {
    name: 'Lotus Absolute', origin: 'Rajasthan', region: 'Western India',
    description: 'Extracted from lotus flowers grown in Rajasthani lakes. Aquatic but warm.',
    usedIn: ['Oasis'], location: { lat: 26.9124, lng: 75.7873 }, image: ingredientLotus,
  },
  {
    name: 'Kashmiri Saffron', origin: 'Pampore, Kashmir', region: 'Northern India',
    description: 'Harvested by hand in October, one filament at a time. The most expensive spice in the world.',
    usedIn: ['Reserve: Saffron Dusk'], location: { lat: 34.0150, lng: 74.9332 }, image: ingredientSaffron,
  },
  {
    name: 'Cardamom', origin: 'Kerala', region: 'Southwest India',
    description: 'Warm-spiced and slightly camphoraceous. Kerala cardamom is uniquely bright.',
    usedIn: ['Horizon', 'Reserve: Saffron Dusk'], location: { lat: 10.8505, lng: 76.2711 }, image: ingredientCardamom,
  },
];

export function IngredientsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [activeIngredient, setActiveIngredient] = useState<IngredientOrigin | null>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section id="ingredients" ref={ref} className="py-16 md:py-20 relative overflow-hidden bg-background">
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
          <p className="font-mono text-xs tracking-[0.3em] text-primary mb-4 uppercase">Sourcing & Raw Materials</p>
          <h2 className="font-display text-4xl md:text-6xl font-light text-foreground mb-4">
            Nature's Canvas
          </h2>
          <p className="font-body text-muted-foreground max-w-lg mx-auto">
            We scour the earth for the finest absolutes, resins, and essences. The soil matters. The season matters. The harvest matters.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {INGREDIENT_ORIGINS.map((ing, i) => (
            <motion.div
              key={ing.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-2xl glass-panel border border-border/50 hover:border-primary/20 transition-all duration-500 cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={ing.image}
                  alt={ing.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-display text-xl text-foreground">{ing.name}</h4>
                  <span className="font-mono text-[10px] text-primary tracking-wider uppercase bg-primary/10 px-2 py-1 rounded-full">{ing.region}</span>
                </div>
                <p className="font-body text-sm text-foreground/80 mb-4">{ing.description}</p>
                <div className="flex items-center justify-between pb-2 border-b border-border/30 mb-3">
                  <span className="font-mono text-xs text-muted-foreground">Source</span>
                  <span className="font-display text-sm text-primary">{ing.origin}</span>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block mb-2">Found in</span>
                  <div className="flex gap-2 flex-wrap">
                    {ing.usedIn.map((name) => (
                      <span key={name} className="px-2 py-1 rounded-md bg-secondary text-xs font-body text-foreground">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
