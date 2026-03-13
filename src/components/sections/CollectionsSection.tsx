import { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { getMainPerfumes, type Perfume } from '@/data/perfumes';
import { BOTTLE_IMAGES, BOTTLE_VIDEOS } from '@/data/bottleImages';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, Clock, Wind, Layers, X, ChevronRight } from 'lucide-react';

// Ingredient images for bisect
import ingredientJasmine from '@/assets/ingredient-jasmine.jpg';
import ingredientSandalwood from '@/assets/ingredient-sandalwood.jpg';
import ingredientSaffron from '@/assets/ingredient-saffron.jpg';
import ingredientCardamom from '@/assets/ingredient-cardamom.jpg';
import ingredientLotus from '@/assets/ingredient-lotus.jpg';

const INGREDIENT_IMAGES: Record<string, string> = {
  'Jasmine': ingredientJasmine, 'Jasmine Sambac': ingredientJasmine, 'Rose Absolute': ingredientJasmine,
  'Rose': ingredientJasmine, 'Rose de Mai': ingredientJasmine, 'Ylang Ylang': ingredientJasmine,
  'Magnolia': ingredientJasmine, 'Tuberose': ingredientJasmine, 'Neroli': ingredientJasmine, 'Iris': ingredientJasmine,
  'Peach Blossom': ingredientJasmine, 'Water Hyacinth': ingredientLotus, 'Geranium': ingredientJasmine,
  'Sandalwood': ingredientSandalwood, 'Mysore Sandalwood': ingredientSandalwood, 'Cedarwood': ingredientSandalwood,
  'Cedar Bark': ingredientSandalwood, 'Driftwood': ingredientSandalwood, 'Vetiver': ingredientSandalwood,
  'Patchouli': ingredientSandalwood, 'Oakmoss Accord': ingredientSandalwood, 'Leather Accord': ingredientSandalwood,
  'Saffron': ingredientSaffron, 'Kashmiri Saffron': ingredientSaffron, 'Amber': ingredientSaffron,
  'Benzoin': ingredientSaffron, 'Labdanum': ingredientSaffron, 'Tonka Bean': ingredientSaffron,
  'Dark Musk': ingredientSaffron, 'Musk': ingredientSaffron, 'White Musk': ingredientSaffron,
  'Ambrette': ingredientSaffron, 'Skin Musk': ingredientSaffron, 'Musks': ingredientSaffron,
  'Ambergris Accord': ingredientSaffron, 'Cashmeran': ingredientSaffron, 'Vanilla Absolute': ingredientSaffron,
  'Civet Accord': ingredientSaffron, 'Dark Plum': ingredientSaffron, 'Smoked Incense': ingredientSaffron,
  'Cardamom': ingredientCardamom, 'Cinnamon Bark': ingredientCardamom, 'Black Pepper': ingredientCardamom,
  'Pink Peppercorn': ingredientCardamom, 'Grapefruit': ingredientCardamom, 'Sea Salt': ingredientCardamom,
  'Bergamot': ingredientCardamom, 'Green Galbanum': ingredientCardamom, 'Aldehydes': ingredientCardamom,
  'Black Oud': ingredientCardamom, 'Oud Accord': ingredientCardamom,
  'Lotus': ingredientLotus, 'Lotus Absolute': ingredientLotus,
  'Aquatic Accord': ingredientLotus, 'Green Tea': ingredientLotus, 'White Tea': ingredientLotus,
  'Lemon Grass': ingredientLotus,
};

function getIngredientImage(name: string): string {
  return INGREDIENT_IMAGES[name] || ingredientSandalwood;
}

/* ── Bisect fullscreen overlay ── */
function BisectView({ perfume, onClose }: { perfume: Perfume; onClose: () => void }) {
  const videoSrc = BOTTLE_VIDEOS[perfume.id];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] bg-background/95 backdrop-blur-2xl overflow-y-auto"
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-[90] p-2 rounded-full bg-secondary/60 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-10"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-primary mb-2 uppercase">Bisect View</p>
          <h2 className="font-display text-4xl md:text-6xl font-light text-foreground mb-2">{perfume.name}</h2>
          <p className="font-body text-muted-foreground italic">{perfume.tagline}</p>
        </motion.div>

        {/* Animated bottle dissolving */}
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0.1, scale: 0.5, filter: 'blur(12px)' }}
          transition={{ duration: 2, delay: 0.5 }}
          className="relative w-64 h-64 mb-8"
        >
          {videoSrc ? (
            <video autoPlay muted loop playsInline className="w-full h-full object-cover rounded-full">
              <source src={videoSrc} type="video/mp4" />
            </video>
          ) : (
            <img src={BOTTLE_IMAGES[perfume.id]} alt={perfume.name} className="w-full h-full object-cover rounded-full" />
          )}
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping opacity-20" />
        </motion.div>

        {/* Arrow hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex items-center gap-2 text-primary mb-10"
        >
          <span className="font-mono text-xs tracking-wider uppercase">Dissolved into</span>
          <ChevronRight className="w-4 h-4" />
        </motion.div>

        {/* Notes grid */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Top Notes */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, type: 'spring', damping: 20 }}
          >
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-mono text-xs tracking-[0.2em] text-primary uppercase">Top Notes</span>
              </div>
              <p className="font-body text-[10px] text-muted-foreground mt-1">First 15 minutes</p>
            </div>
            <div className="space-y-3">
              {perfume.topNotes.map((note, idx) => (
                <motion.div
                  key={note}
                  initial={{ opacity: 0, x: -40, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: 1.5 + idx * 0.12, type: 'spring' }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50 hover:border-primary/30 transition-colors group"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={getIngredientImage(note)} alt={note} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-background/30" />
                  </div>
                  <span className="font-body text-sm text-foreground">{note}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Heart Notes */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, type: 'spring', damping: 20 }}
          >
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-mono text-xs tracking-[0.2em] text-primary uppercase">Heart Notes</span>
              </div>
              <p className="font-body text-[10px] text-muted-foreground mt-1">2–4 hours</p>
            </div>
            <div className="space-y-3">
              {perfume.heartNotes.map((note, idx) => (
                <motion.div
                  key={note}
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 1.7 + idx * 0.12, type: 'spring' }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-primary/20 hover:border-primary/40 transition-colors group"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={getIngredientImage(note)} alt={note} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-background/30" />
                  </div>
                  <span className="font-body text-sm text-foreground">{note}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Base Notes */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6, type: 'spring', damping: 20 }}
          >
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-secondary/40">
                <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">Base Notes</span>
              </div>
              <p className="font-body text-[10px] text-muted-foreground mt-1">4+ hours (dry-down)</p>
            </div>
            <div className="space-y-3">
              {perfume.baseNotes.map((note, idx) => (
                <motion.div
                  key={note}
                  initial={{ opacity: 0, x: 40, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: 1.9 + idx * 0.12, type: 'spring' }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50 hover:border-primary/20 transition-colors group"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={getIngredientImage(note)} alt={note} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-background/30" />
                  </div>
                  <span className="font-body text-sm text-foreground">{note}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Perfume details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
          className="mt-16 w-full max-w-3xl glass-panel p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase mb-1">Family</p>
              <p className="font-body text-sm text-foreground">{perfume.scentFamily}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase mb-1">Longevity</p>
              <p className="font-body text-sm text-foreground">{perfume.longevity} hours</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase mb-1">Sillage</p>
              <p className="font-body text-sm text-foreground">{perfume.sillage}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase mb-1">Season</p>
              <p className="font-body text-sm text-foreground">{perfume.season.join(', ')}</p>
            </div>
          </div>

          <div className="border-t border-border/30 mt-6 pt-6">
            <p className="font-body text-muted-foreground text-sm leading-relaxed mb-6">{perfume.story}</p>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-display text-2xl text-foreground">₹{perfume.sizes[0]?.price}</span>
                {perfume.sizes[0] && typeof perfume.sizes[0].ml === 'number' && (
                  <span className="text-muted-foreground font-body text-sm ml-2">/ {perfume.sizes[0].ml}ml</span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const size = perfume.sizes[0];
                  useCartStore.getState().addItem({ perfumeId: perfume.id, name: perfume.name, size: size.ml, price: size.price, sku: size.sku });
                }}
                className="inline-flex items-center gap-2 h-11 px-6 bg-primary text-primary-foreground font-body font-medium tracking-wider rounded-lg hover:bg-primary/80 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ── Main Collection Section ── */
export function CollectionsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const perfumes = getMainPerfumes();
  const addItem = useCartStore((s) => s.addItem);
  const [bisectedPerfume, setBisectedPerfume] = useState<Perfume | null>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section id="collections" ref={ref} className="py-24 relative overflow-hidden">
      <motion.div
        style={{ y: parallaxY }}
        className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px] pointer-events-none"
      />

      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-primary mb-4 uppercase">The Collection</p>
          <h2 className="font-display text-4xl md:text-6xl font-light text-foreground mb-4">Eight Signatures</h2>
          <p className="font-body text-muted-foreground max-w-md mx-auto">
            Each crafted for a version of you. Choose the one that speaks.
          </p>
        </motion.div>

        {/* Scrollable Video Cards */}
        <div className="overflow-x-auto pb-8 -mx-6 px-6 scrollbar-hide">
          <div className="flex gap-6 min-w-max">
            {perfumes.map((perfume, i) => {
              const videoSrc = BOTTLE_VIDEOS[perfume.id];
              return (
                <motion.div
                  key={perfume.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="w-[340px] flex-shrink-0 group"
                >
                  <div className="glass-panel overflow-hidden hover:-translate-y-3 transition-all duration-500 hover:border-primary/30">
                    {/* Video / Image */}
                    <div className="relative h-[380px] overflow-hidden bg-background">
                      {videoSrc ? (
                        <video
                          autoPlay muted loop playsInline
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          poster={BOTTLE_IMAGES[perfume.id]}
                        >
                          <source src={videoSrc} type="video/mp4" />
                        </video>
                      ) : (
                        <motion.img
                          src={BOTTLE_IMAGES[perfume.id]}
                          alt={perfume.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.08, rotate: 2 }}
                          transition={{ duration: 0.6 }}
                        />
                      )}
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
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-full border border-primary/30 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBisectedPerfume(perfume);
                        }}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span className="font-mono text-[10px] tracking-wider uppercase">Bisect</span>
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
              );
            })}
          </div>
        </div>
      </div>

      {/* Fullscreen Bisect Overlay */}
      <AnimatePresence>
        {bisectedPerfume && (
          <BisectView perfume={bisectedPerfume} onClose={() => setBisectedPerfume(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
