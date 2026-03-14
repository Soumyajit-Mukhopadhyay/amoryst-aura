import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import heroImage from '@/assets/hero-bottle.jpg';
import { useRef } from 'react';

interface HeroSectionProps {
  onOpenQuiz: () => void;
}

export function HeroSection({ onOpenQuiz }: HeroSectionProps) {
  const ref = useRef<HTMLSelectElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  
  // Parallax and Scroll
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  
  // 3D Mouse Gamification
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [0, 1], [10, -10]);
  const rotateY = useTransform(smoothMouseX, [0, 1], [-10, 10]);
  const orbX = useTransform(smoothMouseX, [0, 1], [-50, 50]);
  const orbY = useTransform(smoothMouseY, [0, 1], [-50, 50]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <section 
      ref={ref as any} 
      className="relative min-h-screen flex items-center overflow-hidden [perspective:1000px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0.5); mouseY.set(0.5); }}
    >
      {/* Gamified Background layer */}
      <motion.div className="absolute inset-0 z-0 flex justify-end" style={{ scale: heroScale }}>
        <div className="relative w-full md:w-2/3 h-full">
          <img src={heroImage} alt="" className="w-full h-full object-cover opacity-80 object-[70%_center]" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-background/40 to-background" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
          
          {/* Single subtle glow orb - GPU optimized */}
          <motion.div 
            style={{ x: orbX, y: orbY }}
            className="absolute top-1/4 right-1/4 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none will-change-transform"
          />
        </div>
      </motion.div>
      
      {/* Bottom fade shadow to hide scaled edge */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background via-background/90 to-transparent z-10 pointer-events-none" />

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-primary/60 shadow-[0_0_12px_rgba(255,215,0,1)]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -60, 0],
              opacity: [0.2, 1, 0.2],
              scale: [1, 2.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Content with 3D Gamified Tilt */}
      <motion.div 
        className="relative z-10 container mx-auto px-6 pt-32 pb-12 flex flex-col justify-center items-start text-left transform-gpu h-full" 
        style={{ y: textY, opacity: heroOpacity, rotateX, rotateY }}
      >
        <div className="max-w-2xl p-8 md:p-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent -z-10 blur-xl rounded-full scale-150" />
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="flex items-center justify-start gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <p className="font-mono text-[10px] md:text-sm tracking-[0.3em] text-primary uppercase m-0">Modern Indian Fragrance</p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-7xl font-light leading-[1.05] text-foreground mb-6"
          >
            Your scent<br />
            <span className="text-gradient-gold italic leading-tight pb-2 block">is your signature.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-body text-lg text-muted-foreground max-w-md leading-relaxed mb-10 text-left"
          >
            Amorist is a modern Indian fragrance house. Eight signatures. One is yours.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="flex flex-col sm:flex-row justify-start gap-4 relative z-20 w-full sm:w-auto">
            <motion.a
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,215,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
              href="#collections"
              className="inline-flex items-center justify-center h-12 px-8 bg-primary text-primary-foreground font-body font-medium tracking-wider uppercase text-sm rounded-lg border border-primary/30 shadow-lg hover:bg-primary/90 transition-all"
            >
              Explore Collection
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,215,0,0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenQuiz}
              className="inline-flex items-center justify-center h-12 px-8 border border-primary/40 text-primary font-body font-medium tracking-wider uppercase text-sm rounded-lg hover:border-primary transition-all relative overflow-hidden group"
            >
              <span className="relative z-10">Find My Signature</span>
              <motion.div 
                className="absolute inset-0 bg-primary/20 blur-md translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" 
              />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
        <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Scroll to explore</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown className="w-5 h-5 text-primary/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
