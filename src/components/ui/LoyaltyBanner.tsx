import { motion, AnimatePresence } from 'framer-motion';
import { useGamificationStore } from '@/store/useGamificationStore';
import { Flame, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export function LoyaltyBanner() {
  const { auraPoints, streakDays, checkIn } = useGamificationStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkIn(); // Give daily points if applicable
  }, [checkIn]);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div className="w-full bg-primary/5 border-b border-primary/10 overflow-hidden relative z-[60]">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center sm:justify-between gap-4 text-xs font-mono tracking-wider "
      >
        <div className="flex items-center gap-4 text-muted-foreground">
          <span className="hidden sm:inline">AMORYST AURA MEMBER</span>
          <div className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-primary">{streakDays} Day Streak</span>
          </div>
        </div>

        <div className="flex items-center gap-2 group cursor-pointer">
          <Sparkles className="w-3.5 h-3.5 text-primary group-hover:animate-spin" />
          <span className="text-foreground">
            <span className="text-primary font-semibold">{auraPoints.toLocaleString()}</span> AURA POINTS
          </span>
          <span className="hidden sm:inline ml-2 text-muted-foreground opacity-60 hover:opacity-100 transition-opacity">
            | Redeem for exclusive gifts
          </span>
        </div>
      </motion.div>
    </div>
  );
}
