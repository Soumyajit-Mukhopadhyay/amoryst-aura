import { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { getMainPerfumes } from '@/data/perfumes';
import { BOTTLE_IMAGES } from '@/data/bottleImages';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, Clock, Wind, Layers, X } from 'lucide-react';
import heroVideo from '@/assets/perfume-hero-video.mp4';
import collectionVideo from '@/assets/perfume-collection-video.mp4';

// Ingredient images for bisect feature
import ingredientJasmine from '@/assets/ingredient-jasmine.jpg';
import ingredientSandalwood from '@/assets/ingredient-sandalwood.jpg';
import ingredientSaffron from '@/assets/ingredient-saffron.jpg';
import ingredientCardamom from '@/assets/ingredient-cardamom.jpg';
import ingredientLotus from '@/assets/ingredient-lotus.jpg';

const INGREDIENT_IMAGES: Record<string, string> = {
  'Jasmine': ingredientJasmine, 'Jasmine Sambac': ingredientJasmine, 'Rose Absolute': ingredientJasmine,
  'Rose': ingredientJasmine, 'Rose de Mai': ingredientJasmine, 'Ylang Ylang': ingredientJasmine,
  'Magnolia': ingredientJasmine, 'Tuberose': ingredientJasmine, 'Neroli': ingredientJasmine, 'Iris': ingredientJasmine,
  'Sandalwood': ingredientSandalwood, 'Mysore Sandalwood': ingredientSandalwood, 'Cedarwood': ingredientSandalwood,
  'Cedar Bark': ingredientSandalwood, 'Driftwood': ingredientSandalwood, 'Vetiver': ingredientSandalwood,
  'Patchouli': ingredientSandalwood, 'Oakmoss Accord': ingredientSandalwood,
  'Saffron': ingredientSaffron, 'Kashmiri Saffron': ingredientSaffron, 'Amber': ingredientSaffron,
  'Benzoin': ingredientSaffron, 'Labdanum': ingredientSaffron, 'Tonka Bean': ingredientSaffron,
  'Cardamom': ingredientCardamom, 'Cinnamon Bark': ingredientCardamom, 'Black Pepper': ingredientCardamom,
  'Pink Peppercorn': ingredientCardamom, 'Grapefruit': ingredientCardamom, 'Sea Salt': ingredientCardamom,
  'Lotus': ingredientLotus, 'Lotus Absolute': ingredientLotus, 'Water Hyacinth': ingredientLotus,
  'Aquatic Accord': ingredientLotus, 'Green Tea': ingredientLotus, 'White Tea': ingredientLotus,
  'Lemon Grass': ingredientLotus, 'Peach Blossom': ingredientLotus,
};

function getIngredientImage(name: string): string {
  return INGREDIENT_IMAGES[name] || ingredientSandalwood;
}

export function CollectionsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const perfumes = getMainPerfumes();
  const addItem = useCartStore((s) => s.addItem);
  const [bisectedId, setBisectedId] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  const bisectedPerfume = bisectedId ? perfumes.find(p => p.id === bisectedId) : null;

  return (
    <section id="collections" ref={ref} className="py-24 relative overflow-hidden">
      {/* Parallax floating glow */}
      <motion.div
        style={{ y: parallaxY }}
        className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px] pointer-events-none"
      />

      <div className="container mx-auto px-6">
        {/* Header with video */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-primary mb-4 uppercase">The Collection</p>
          <h2 className="font-display text-4xl md:text-6xl font-light text-foreground mb-4">
            Eight Signatures
          </h2>
          <p className="font-body text-muted-foreground max-w-md mx-auto mb-8">
            Each crafted for a version of you. Choose the one that speaks.
          </p>

          {/* Hero Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden border border-primary/10 mb-8"
          >
            <video
              autoPlay muted loop playsInline
              className="w-full aspect-video object-cover"
              poster={BOTTLE_IMAGES['twilight']}
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </motion.div>

        {/* Scrollable Cards */}
        <div className="overflow-x-auto pb-8 -mx-6 px-6 scrollbar-hide">
          <div className="flex gap-6 min-w-max">
            {perfumes.map((perfume, i) => (
              <motion.div
                key={perfume.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="w-[320px] flex-shrink-0 group"
              >
                <div className="glass-panel overflow-hidden hover:-translate-y-3 transition-all duration-500">
                  {/* Image with hover spin */}
                  <div className="relative h-[360px] overflow-hidden">
                    <motion.img
                      src={BOTTLE_IMAGES[perfume.id]}
                      alt={perfume.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.08, rotate: 2 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

                    {/* Badges */}
                    {perfume.bestSeller && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-body font-semibold rounded-full tracking-wider uppercase">
                        Best Seller
                      </span>
                    )}
                    {perfume.limited && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-destructive/90 text-destructive-foreground text-xs font-body font-semibold rounded-full tracking-wider uppercase">
                        {perfume.bottlesRemaining}/{perfume.totalBottles} Left
                      </span>
                    )}

                    {/* Bisect Button */}
                    <motion.button
                      initial={{ opacity: 0 }}
                      whileHover={{ scale: 1.1 }}
                      className="absolute bottom-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-full border border-primary/30 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBisectedId(perfume.id);
                      }}
                    >
                      <Layers className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    {perfume.personality && (
                      <p className="font-mono text-xs tracking-widest text-primary mb-2 uppercase">{perfume.personality}</p>
                    )}
                    <h3 className="font-display text-2xl text-foreground mb-1">{perfume.name}</h3>
                    <p className="font-body text-sm text-muted-foreground mb-4 italic">{perfume.tagline}</p>

                    <div className="flex items-center gap-4 mb-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="font-body text-xs">{perfume.longevity}h</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Wind className="w-3 h-3" />
                        <span className="font-body text-xs">{perfume.sillage}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {perfume.character.map((c) => (
                        <span key={c} className="px-2 py-0.5 rounded-full border border-border text-xs font-body text-muted-foreground">
                          {c}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-display text-xl text-foreground">₹{perfume.sizes[0]?.price}</span>
                        {perfume.sizes[0] && typeof perfume.sizes[0].ml === 'number' && (
                          <span className="text-muted-foreground font-body text-xs ml-1">/ {perfume.sizes[0].ml}ml</span>
                        )}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          const size = perfume.sizes[0];
                          addItem({ perfumeId: perfume.id, name: perfume.name, size: size.ml, price: size.price, sku: size.sku });
                        }}
                        className="p-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Collection video strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 relative rounded-2xl overflow-hidden border border-primary/10"
        >
          <video autoPlay muted loop playsInline className="w-full aspect-[21/9] object-cover">
            <source src={collectionVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80 flex items-center justify-center">
            <p className="font-display text-3xl md:text-5xl text-foreground text-center font-light">
              Crafted to be <span className="text-gradient-gold italic">remembered.</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Bisect Modal */}
      <AnimatePresence>
        {bisectedPerfume && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-background/90 backdrop-blur-xl" onClick={() => setBisectedId(null)} />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="relative z-10 w-full max-w-3xl mx-4 glass-panel p-8"
            >
              <button onClick={() => setBisectedId(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <p className="font-mono text-xs tracking-[0.3em] text-primary mb-2 uppercase">Bisect View</p>
                <h3 className="font-display text-3xl text-foreground">{bisectedPerfume.name}</h3>
                <p className="font-body text-sm text-muted-foreground italic">{bisectedPerfume.tagline}</p>
              </div>

              {/* Dissolve Animation - Bottle splits into ingredient images */}
              <div className="relative">
                {/* Center bottle fading out */}
                <motion.div
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ opacity: 0.15, scale: 0.7 }}
                  transition={{ duration: 1.2 }}
                  className="flex justify-center mb-6"
                >
                  <img src={BOTTLE_IMAGES[bisectedPerfume.id]} alt={bisectedPerfume.name} className="w-40 h-40 object-cover rounded-full" />
                </motion.div>

                {/* Ingredient images flying out */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Top Notes */}
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.2em] text-primary mb-3 uppercase text-center">Top Notes</p>
                    <div className="space-y-3">
                      {bisectedPerfume.topNotes.map((note, idx) => (
                        <motion.div
                          key={note}
                          initial={{ opacity: 0, x: -60, rotate: -10 }}
                          animate={{ opacity: 1, x: 0, rotate: 0 }}
                          transition={{ delay: 0.3 + idx * 0.15, type: 'spring' }}
                          className="flex items-center gap-2 p-2 rounded-lg bg-secondary/40 border border-border/50"
                        >
                          <img src={getIngredientImage(note)} alt={note} className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
                          <span className="font-body text-xs text-foreground">{note}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Heart Notes */}
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.2em] text-primary mb-3 uppercase text-center">Heart Notes</p>
                    <div className="space-y-3">
                      {bisectedPerfume.heartNotes.map((note, idx) => (
                        <motion.div
                          key={note}
                          initial={{ opacity: 0, y: -40, scale: 0.5 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: 0.5 + idx * 0.15, type: 'spring' }}
                          className="flex items-center gap-2 p-2 rounded-lg bg-secondary/40 border border-primary/20"
                        >
                          <img src={getIngredientImage(note)} alt={note} className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
                          <span className="font-body text-xs text-foreground">{note}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Base Notes */}
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.2em] text-primary mb-3 uppercase text-center">Base Notes</p>
                    <div className="space-y-3">
                      {bisectedPerfume.baseNotes.map((note, idx) => (
                        <motion.div
                          key={note}
                          initial={{ opacity: 0, x: 60, rotate: 10 }}
                          animate={{ opacity: 1, x: 0, rotate: 0 }}
                          transition={{ delay: 0.7 + idx * 0.15, type: 'spring' }}
                          className="flex items-center gap-2 p-2 rounded-lg bg-secondary/40 border border-border/50"
                        >
                          <img src={getIngredientImage(note)} alt={note} className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
                          <span className="font-body text-xs text-foreground">{note}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
