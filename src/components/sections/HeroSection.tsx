import { Suspense, lazy, useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { PERFUMES } from '@/data/perfumes';
import heroImage from '@/assets/hero-bottle.jpg';

const BottleScene = lazy(() => import('@/components/3d/BottleScene').then(m => ({ default: m.BottleScene })));

interface HeroSectionProps {
  onOpenQuiz: () => void;
}

export function HeroSection({ onOpenQuiz }: HeroSectionProps) {
  const [show3D, setShow3D] = useState(false);
  const twilight = PERFUMES[0];

  useEffect(() => {
    const timer = setTimeout(() => setShow3D(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt=""
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/60" />
      </div>

      {/* 3D Bottle */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
        {show3D && (
          <Suspense fallback={null}>
            <BottleScene perfume={twilight} scale={1.4} showParticles interactive />
          </Suspense>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pt-24">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="font-mono text-sm tracking-[0.3em] text-primary mb-6 uppercase">
              Modern Indian Fragrance House
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-light leading-[0.95] text-foreground mb-8"
          >
            Your scent
            <br />
            <span className="text-gradient-gold italic">is your signature.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-body text-lg text-muted-foreground max-w-md leading-relaxed mb-10"
          >
            Amorist is a modern Indian fragrance house. Eight signatures. One is yours.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#collections"
              className="inline-flex items-center justify-center h-12 px-8 bg-primary text-primary-foreground font-body font-medium tracking-wider uppercase text-sm rounded-lg border border-primary/30 shadow-lg shadow-primary/20 hover:bg-primary/80 transition-all"
            >
              Explore Collection
            </a>
            <button
              onClick={onOpenQuiz}
              className="inline-flex items-center justify-center h-12 px-8 border border-primary/40 text-primary font-body font-medium tracking-wider uppercase text-sm rounded-lg hover:bg-primary/10 transition-all"
            >
              Find My Signature
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-5 h-5 text-primary/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
