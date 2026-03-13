import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Gift, Star, Crown, Share2 } from 'lucide-react';

const TIERS = [
  { name: 'Circle', icon: Gift, description: 'All Customers', benefits: ['Story card with every order', 'Birthday month offer (15%)', 'Post-purchase fragrance journey'], style: 'border-border/50' },
  { name: 'Signature', icon: Star, description: '2nd Purchase', benefits: ['Free 5ml sample per order', '10% refill pricing', 'Early access to new releases'], style: 'border-primary/40 gold-glow' },
  { name: 'Collectors', icon: Crown, description: '3rd+ Purchase / ₹5,000+', benefits: ['Numbered limited editions', 'Annual fragrance gift', 'Personal concierge access'], style: 'border-primary/60 gold-glow bg-secondary/30' },
];

export function LoyaltySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="loyalty" ref={ref} className="py-24 relative overflow-hidden">
      <motion.div
        style={{ y: parallaxY }}
        className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-primary/5 blur-[100px] pointer-events-none"
      />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-primary mb-4 uppercase">Loyalty</p>
          <h2 className="font-display text-3xl md:text-5xl font-light text-foreground mb-4 max-w-2xl mx-auto leading-tight">
            The more you choose Amorist, the more Amorist chooses you.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {TIERS.map((tier, i) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`p-6 rounded-2xl border ${tier.style} transition-all`}
              >
                <Icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-display text-2xl text-foreground mb-1">{tier.name}</h3>
                <p className="font-mono text-xs text-muted-foreground tracking-wider mb-6">{tier.description}</p>
                <ul className="space-y-3">
                  {tier.benefits.map((b, j) => (
                    <motion.li
                      key={j}
                      initial={{ opacity: 0, x: -10 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.5 + i * 0.15 + j * 0.1 }}
                      className="flex items-start gap-2 text-sm font-body text-muted-foreground"
                    >
                      <span className="text-primary mt-0.5">✓</span>
                      {b}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="glass-panel p-8 max-w-2xl mx-auto text-center"
        >
          <Share2 className="w-8 h-8 text-primary mx-auto mb-4" />
          <h3 className="font-display text-2xl text-foreground mb-3">Refer a Friend</h3>
          <p className="font-body text-muted-foreground mb-6">
            When they place their first order, you both receive <span className="text-primary font-semibold">₹150 Amorist Credit</span> — applied automatically at checkout.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 h-11 px-6 bg-primary text-primary-foreground font-body font-medium tracking-wider rounded-lg hover:bg-primary/80 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share Your Link
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
