import { useRef, useState, useCallback } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { getMainPerfumes, type Perfume } from '@/data/perfumes';
import { BOTTLE_IMAGES, BOTTLE_VIDEOS } from '@/data/bottleImages';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, Clock, Wind, Layers, X, ChevronRight, Droplets, Star, Heart, Search } from 'lucide-react';

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

/* ── Spray particle animation ── */
function SprayAnimation({ active, color }: { active: boolean; color: string }) {
  if (!active) return null;
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 200,
    y: -Math.random() * 300 - 50,
    size: Math.random() * 6 + 2,
    delay: Math.random() * 0.3,
    duration: Math.random() * 1.5 + 1,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0.9, x: 0, y: 0, scale: 0 }}
          animate={{
            opacity: [0.9, 0.6, 0],
            x: p.x,
            y: p.y,
            scale: [0, 1.5, 0.5],
          }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            bottom: '40%',
            left: '50%',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: color,
            filter: 'blur(1px)',
          }}
        />
      ))}
      {/* Mist cloud */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: [0, 0.4, 0], scale: [0.3, 2, 3] }}
        transition={{ duration: 2 }}
        className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full"
        style={{ background: `radial-gradient(circle, ${color}40, transparent)` }}
      />
    </div>
  );
}

/* ── Mouse-tracked tilt card wrapper ── */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    setTilt({ x: y, y: x });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Bisect fullscreen overlay - video stays at top ── */
function BisectView({ perfume, onClose }: { perfume: Perfume; onClose: () => void }) {
  const videoSrc = BOTTLE_VIDEOS[perfume.id];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] bg-background/98 backdrop-blur-2xl overflow-y-auto"
    >
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-[90] p-2 rounded-full bg-secondary/60 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="min-h-screen flex flex-col items-center px-6 py-12">
        {/* Header + Video that keeps playing */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-6"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-primary mb-2 uppercase">Bisect View</p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mb-1">{perfume.name}</h2>
          <p className="font-body text-muted-foreground italic text-sm">{perfume.tagline}</p>
        </motion.div>

        {/* Video stays visible and playing - shrinks elegantly */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 0.7 }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-56 h-56 md:w-64 md:h-64 mb-4 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0"
        >
          {videoSrc ? (
            <video autoPlay muted loop playsInline className="w-full h-full object-cover">
              <source src={videoSrc} type="video/mp4" />
            </video>
          ) : (
            <img src={BOTTLE_IMAGES[perfume.id]} alt={perfume.name} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 rounded-full border border-primary/20" />
          <motion.div
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 rounded-full"
            style={{ boxShadow: '0 0 40px 10px hsl(var(--primary) / 0.15) inset' }}
          />
        </motion.div>

        {/* Arrow hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex items-center gap-2 text-primary mb-8"
        >
          <span className="font-mono text-xs tracking-wider uppercase">Dissolved into</span>
          <ChevronRight className="w-4 h-4" />
        </motion.div>

        {/* Notes grid */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Top Notes', notes: perfume.topNotes, time: 'First 15 minutes', delay: 0.8, dir: 'x', val: -80, color: 'primary' },
            { label: 'Heart Notes', notes: perfume.heartNotes, time: '2–4 hours', delay: 1.0, dir: 'y', val: 60, color: 'primary' },
            { label: 'Base Notes', notes: perfume.baseNotes, time: '4+ hours (dry-down)', delay: 1.2, dir: 'x', val: 80, color: 'muted-foreground' },
          ].map((section) => (
            <motion.div
              key={section.label}
              initial={{ opacity: 0, [section.dir]: section.val }}
              animate={{ opacity: 1, [section.dir]: 0 }}
              transition={{ delay: section.delay, type: 'spring', damping: 20 }}
            >
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-mono text-xs tracking-[0.2em] text-primary uppercase">{section.label}</span>
                </div>
                <p className="font-body text-[10px] text-muted-foreground mt-1">{section.time}</p>
              </div>
              <div className="space-y-3">
                {section.notes.map((note, idx) => (
                  <motion.div
                    key={note}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: section.delay + 0.3 + idx * 0.1, type: 'spring' }}
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
          ))}
        </div>

        {/* Longevity & Sillage Visual Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="mt-12 w-full max-w-3xl"
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="glass-panel p-5">
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase mb-3">Longevity</p>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((perfume.longevity / 18) * 100, 100)}%` }}
                    transition={{ delay: 2.2, duration: 1.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                  />
                </div>
                <span className="font-body text-sm text-foreground font-medium">{perfume.longevity}h</span>
              </div>
            </div>
            <div className="glass-panel p-5">
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase mb-3">Sillage</p>
              <div className="flex items-center gap-3">
                <Wind className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: perfume.sillage.includes('Heavy') ? '90%' : perfume.sillage.includes('Moderate') ? '60%' : '35%' }}
                    transition={{ delay: 2.4, duration: 1.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                  />
                </div>
                <span className="font-body text-sm text-foreground font-medium">{perfume.sillage}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Wardrobe Pairing + Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
          className="mt-8 w-full max-w-3xl glass-panel p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-6">
            <div>
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase mb-1">Family</p>
              <p className="font-body text-sm text-foreground">{perfume.scentFamily}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase mb-1">Best For</p>
              <p className="font-body text-sm text-foreground">{perfume.occasions.slice(0, 2).join(', ')}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase mb-1">Season</p>
              <p className="font-body text-sm text-foreground">{perfume.season.join(', ')}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase mb-1">Personality</p>
              <p className="font-body text-sm text-foreground">{perfume.personality || 'Versatile'}</p>
            </div>
          </div>

          {/* Wardrobe Pairing */}
          <div className="border-t border-border/30 pt-6 mb-6">
            <p className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase mb-3">Wardrobe Pairing</p>
            <div className="flex flex-wrap gap-2">
              {perfume.season.includes('Winter') || perfume.season.includes('Autumn')
                ? ['Dark blazers', 'Cashmere knits', 'Velvet', 'Leather jackets', 'Evening wear'].map(item => (
                    <span key={item} className="px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-body text-muted-foreground">{item}</span>
                  ))
                : ['Linen shirts', 'Light cotton', 'Summer dresses', 'Casual chic', 'Resort wear'].map(item => (
                    <span key={item} className="px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-body text-muted-foreground">{item}</span>
                  ))
              }
            </div>
          </div>

          <div className="border-t border-border/30 pt-6">
            <p className="font-body text-muted-foreground text-sm leading-relaxed mb-6">{perfume.story}</p>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-display text-2xl text-foreground">₹{perfume.sizes[0]?.price}</span>
                {perfume.sizes[0] && typeof perfume.sizes[0].ml === 'number' && (
                  <span className="text-muted-foreground font-body text-xs ml-2">/ {perfume.sizes[0].ml}ml</span>
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
  const [sprayingId, setSprayingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  const handleSpray = (perfumeId: string) => {
    setSprayingId(perfumeId);
    setTimeout(() => setSprayingId(null), 2500);
  };

  const filteredPerfumes = perfumes.filter(perfume => {
    const q = searchQuery.toLowerCase();
    return perfume.name.toLowerCase().includes(q) || 
           perfume.tagline.toLowerCase().includes(q) ||
           perfume.scentFamily.toLowerCase().includes(q) ||
           perfume.personality?.toLowerCase().includes(q) ||
           perfume.character.some(c => c.toLowerCase().includes(q));
  });

  return (
    <section id="collections" ref={ref} className="pt-16 pb-8 md:pt-20 md:pb-10 relative overflow-hidden">
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
          className="text-center mb-10"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-primary mb-4 uppercase">The Collection</p>
          <h2 className="font-display text-4xl md:text-6xl font-light text-foreground mb-4">Eight Signatures</h2>
          <p className="font-body text-muted-foreground max-w-md mx-auto mb-8">
            Each crafted for a version of you. Choose the one that speaks.
          </p>

          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search by name, scent family, or feeling..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background/50 border border-primary/20 text-foreground placeholder-muted-foreground text-sm rounded-full pl-12 pr-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-body"
            />
          </div>
        </motion.div>

        {/* Scrollable Video Cards with Tilt */}
        <div className="overflow-x-auto pb-8 -mx-6 px-6 scrollbar-hide min-h-[500px]">
          {filteredPerfumes.length === 0 ? (
            <div className="w-full text-center py-20 text-muted-foreground font-body">
              No signatures match your search. Try another feeling or scent family.
            </div>
          ) : (
            <div className="flex gap-6 min-w-max">
              {filteredPerfumes.map((perfume, i) => {
              const videoSrc = BOTTLE_VIDEOS[perfume.id];
              const isSpraying = sprayingId === perfume.id;
              return (
                <motion.div
                  key={perfume.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="w-[340px] flex-shrink-0 group"
                >
                  <TiltCard className="glass-panel overflow-hidden hover:-translate-y-3 transition-all duration-500 hover:border-primary/30">
                    {/* Video / Image */}
                    <div className="relative h-[380px] overflow-hidden bg-background cursor-pointer"
                      onClick={() => handleSpray(perfume.id)}
                    >
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

                      {/* Spray animation */}
                      <SprayAnimation active={isSpraying} color={perfume.bottle.particleColor} />

                      {/* Spray hint */}
                      <motion.div
                        initial={false}
                        animate={{ opacity: isSpraying ? 0 : 1 }}
                        className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-background/60 backdrop-blur-sm rounded-full text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Droplets className="w-3 h-3" />
                        <span className="font-mono text-[9px] tracking-wider uppercase">Tap to spray</span>
                      </motion.div>

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
                  </TiltCard>
                </motion.div>
              );
            })}
            </div>
          )}
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
