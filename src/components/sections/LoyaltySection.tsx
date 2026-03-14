import { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Gift, Star, Crown, Share2, Copy, Check, Users, Sparkles, Award, Flower2 } from 'lucide-react';

const TIERS = [
  { name: 'Circle', icon: Gift, points: '0', description: 'All Customers', benefits: ['Story card with every order', 'Birthday month offer (15%)', 'Post-purchase fragrance journey', '50 welcome points'], style: 'border-primary/30 gold-glow' },
  { name: 'Signature', icon: Star, points: '500', description: '500+ Points', benefits: ['Free 5ml sample per order', '10% refill pricing', 'Early access to new releases', 'Double referral bonus'], style: 'border-primary/40 gold-glow' },
  { name: 'Collectors', icon: Crown, points: '1500', description: '1500+ Points', benefits: ['Numbered limited editions', 'Annual fragrance gift', 'Personal concierge access', 'Triple referral bonus'], style: 'border-primary/60 gold-glow bg-secondary/30' },
];

const EARN_ACTIONS = [
  { action: 'Sign up', points: 50, icon: Sparkles },
  { action: 'First purchase', points: 100, icon: Gift },
  { action: 'Write a review', points: 30, icon: Star },
  { action: 'Refer a friend', points: 150, icon: Users },
  { action: 'Birthday bonus', points: 75, icon: Award },
  { action: 'Share on social', points: 20, icon: Share2 },
];

export function LoyaltySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const [copied, setCopied] = useState(false);
  const [showReferral, setShowReferral] = useState(false);

  const referralCode = 'AMORIST-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://amorist.in/ref/${referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="loyalty" ref={ref} className="pt-8 md:pt-10 pb-16 md:pb-20 relative overflow-hidden">
      {/* Premium Floating Animations */}
      <motion.div animate={{ y: [0, -25, 0], rotate: [0, 10, 0], opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }} className="absolute z-0 top-[5%] right-[10%] text-primary pointer-events-none">
        <Sparkles className="w-8 h-8 md:w-12 md:h-12" />
      </motion.div>
      <motion.div animate={{ y: [0, 20, 0], rotate: [0, -20, 0], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="absolute z-0 top-[30%] left-[5%] text-primary pointer-events-none">
        <Star className="w-6 h-6 md:w-10 md:h-10" />
      </motion.div>
      <motion.div animate={{ y: [0, -15, 0], rotate: [0, 15, 0], opacity: [0.05, 0.2, 0.05] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }} className="absolute z-0 bottom-[20%] left-[15%] text-primary pointer-events-none">
        <Flower2 className="w-8 h-8 md:w-14 md:h-14" />
      </motion.div>

      <motion.div
        style={{ y: parallaxY }}
        className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-primary/5 blur-[100px] pointer-events-none z-0"
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-primary mb-4 uppercase">Loyalty & Rewards</p>
          <h2 className="font-display text-3xl md:text-5xl font-light text-foreground mb-4 max-w-2xl mx-auto leading-tight">
            The more you choose Amorist, the more Amorist chooses you.
          </h2>
        </motion.div>

        {/* Tiers */}
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
                className={`p-6 rounded-2xl border ${tier.style} transition-all relative overflow-hidden`}
              >
                {/* Points badge */}
                <div className="absolute top-4 right-4">
                  <span className="font-mono text-[10px] text-primary/60 tracking-wider">{tier.points} pts</span>
                </div>
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

        {/* How to Earn Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="glass-panel p-8 mb-10 max-w-4xl mx-auto"
        >
          <h3 className="font-display text-2xl text-foreground text-center mb-6">How to Earn Points</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {EARN_ACTIONS.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.action}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50 hover:border-primary/20 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-body text-sm text-foreground">{item.action}</p>
                    <p className="font-mono text-[10px] text-primary tracking-wider">+{item.points} pts</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Referral Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="glass-panel p-8 max-w-2xl mx-auto text-center"
        >
          <Users className="w-8 h-8 text-primary mx-auto mb-4" />
          <h3 className="font-display text-2xl text-foreground mb-3">Refer & Earn</h3>
          <p className="font-body text-muted-foreground mb-6">
            Share your unique link. When they place their first order, you both receive <span className="text-primary font-semibold">₹150 Amorist Credit + 150 bonus points</span>.
          </p>

          {/* Referral link */}
          <div className="flex items-center gap-2 max-w-md mx-auto mb-6">
            <div className="flex-1 flex items-center gap-2 h-10 px-4 bg-secondary/50 rounded-lg border border-border/50">
              <span className="font-mono text-xs text-muted-foreground truncate">amorist.in/ref/{referralCode}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="h-10 px-4 bg-primary text-primary-foreground font-body text-sm font-medium rounded-lg hover:bg-primary/80 transition-colors flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </motion.button>
          </div>

          {/* Share buttons */}
          <div className="flex justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 h-9 px-4 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 font-body text-sm rounded-lg hover:bg-[#25D366]/20 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              WhatsApp
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 h-9 px-4 bg-secondary text-secondary-foreground font-body text-sm rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Instagram
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 h-9 px-4 bg-secondary text-secondary-foreground font-body text-sm rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Twitter
            </motion.button>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-8 pt-6 border-t border-border/30">
            <div className="text-center">
              <p className="font-display text-2xl text-foreground">0</p>
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">Friends Referred</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl text-primary">0</p>
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">Points Earned</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl text-foreground">₹0</p>
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">Credit Balance</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
