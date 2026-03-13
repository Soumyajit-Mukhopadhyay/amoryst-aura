import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { getMainPerfumes } from '@/data/perfumes';
import { BOTTLE_IMAGES } from '@/data/bottleImages';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, Clock, Wind } from 'lucide-react';

export function CollectionsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const perfumes = getMainPerfumes();
  const addItem = useCartStore((s) => s.addItem);

  return (
    <section id="collections" ref={ref} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
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
          <p className="font-body text-muted-foreground max-w-md mx-auto">
            Each crafted for a version of you. Choose the one that speaks.
          </p>
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
                  {/* Image */}
                  <div className="relative h-[360px] overflow-hidden">
                    <img
                      src={BOTTLE_IMAGES[perfume.id]}
                      alt={perfume.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
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
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    {perfume.personality && (
                      <p className="font-mono text-xs tracking-widest text-primary mb-2 uppercase">{perfume.personality}</p>
                    )}
                    <h3 className="font-display text-2xl text-foreground mb-1">{perfume.name}</h3>
                    <p className="font-body text-sm text-muted-foreground mb-4 italic">{perfume.tagline}</p>

                    {/* Details */}
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

                    {/* Character Tags */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {perfume.character.map((c) => (
                        <span key={c} className="px-2 py-0.5 rounded-full border border-border text-xs font-body text-muted-foreground">
                          {c}
                        </span>
                      ))}
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-display text-xl text-foreground">₹{perfume.sizes[0]?.price}</span>
                        {perfume.sizes[0] && typeof perfume.sizes[0].ml === 'number' && (
                          <span className="text-muted-foreground font-body text-xs ml-1">/ {perfume.sizes[0].ml}ml</span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          const size = perfume.sizes[0];
                          addItem({
                            perfumeId: perfume.id,
                            name: perfume.name,
                            size: size.ml,
                            price: size.price,
                            sku: size.sku,
                          });
                        }}
                        className="p-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
