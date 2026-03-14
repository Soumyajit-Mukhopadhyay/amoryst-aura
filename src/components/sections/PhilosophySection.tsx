import { useRef, useMemo } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import ingredientsImage from '@/assets/ingredients-dissolve.jpg';

// Premium floating golden dust particles — large, bright, visible
const PARTICLES = [
  { left: '3%',  size: 8,  dur: 8,   delay: 0,   },
  { left: '10%', size: 12, dur: 10,  delay: 1,   },
  { left: '18%', size: 6,  dur: 7,   delay: 0.5, },
  { left: '25%', size: 10, dur: 9,   delay: 2.5, },
  { left: '32%', size: 14, dur: 11,  delay: 0.8, },
  { left: '38%', size: 7,  dur: 7.5, delay: 3,   },
  { left: '45%', size: 10, dur: 9.5, delay: 1.5, },
  { left: '52%', size: 16, dur: 12,  delay: 0.3, },
  { left: '58%', size: 8,  dur: 8,   delay: 2,   },
  { left: '65%', size: 12, dur: 10,  delay: 1.2, },
  { left: '72%', size: 6,  dur: 7,   delay: 3.5, },
  { left: '78%', size: 14, dur: 11,  delay: 0.6, },
  { left: '84%', size: 9,  dur: 8.5, delay: 2.2, },
  { left: '90%', size: 11, dur: 9,   delay: 1.8, },
  { left: '96%', size: 7,  dur: 7.5, delay: 0.4, },
  { left: '8%',  size: 10, dur: 10,  delay: 4,   },
  { left: '42%', size: 13, dur: 11,  delay: 3.2, },
  { left: '68%', size: 8,  dur: 8,   delay: 4.5, },
];

export function PhilosophySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const textY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  const paragraphs = [
    { title: 'Honest.', text: "At Amorist, the price on the bottle is the price. No ₹2,499 fictions. No fake urgency. Just fragrance worth what we ask." },
    { title: 'Indian.', text: "These are not European fragrances in Indian bottles. Jasmine from Tamil Nadu. Saffron from Kashmir. Lotus from Rajasthan. Every base note has an address." },
    { title: 'Yours.', text: "You don't need twelve perfumes. You need one that is yours — and perhaps one for when you become someone else for an evening." },
  ];

  return (
    <section id="philosophy" ref={ref} className="pt-8 md:pt-10 pb-16 md:pb-20 relative overflow-hidden">
      {/* Premium golden dust particles floating upward */}
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none z-0 rounded-full"
          style={{
            left: p.left,
            bottom: '0%',
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(235,193,126,1) 0%, rgba(235,193,126,0.6) 50%, rgba(235,193,126,0.1) 80%, transparent 100%)`,
            boxShadow: `0 0 ${p.size * 5}px ${p.size * 2}px rgba(235,193,126,0.35)`,
          }}
          animate={{
            y: [0, -900],
            x: [0, Math.sin(i * 1.5) * 50, -Math.sin(i) * 25, 0],
            opacity: [0, 0.9, 0.7, 0],
            scale: [0.6, 1.5, 1.8, 0.4],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Soft radial glow accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-primary/8 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div style={{ y: textY }}>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="font-mono text-xs tracking-[0.3em] text-primary mb-6 uppercase"
            >
              Our Philosophy
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-5xl md:text-7xl font-light text-foreground mb-12 leading-tight"
            >
              Honest.<br />Indian.<br />
              <span className="text-gradient-gold italic">Yours.</span>
            </motion.h2>

            <div className="space-y-8">
              {paragraphs.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
                  className="font-body text-muted-foreground leading-relaxed text-lg"
                >
                  {p.text}
                </motion.p>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
            style={{ y: imgY }}
          >
            <div className="relative rounded-2xl overflow-hidden aspect-square">
              <img src={ingredientsImage} alt="Amorist ingredients" className="w-full h-full object-cover" />
              {/* Fade edges to background */}
              <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-background via-background/50 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background via-background/50 to-transparent" />
              <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background via-background/50 to-transparent" />
              <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background via-background/50 to-transparent" />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-6 -right-6 w-32 h-32 border border-primary/20 rounded-2xl"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1 }}
              className="absolute -top-6 -left-6 w-24 h-24 border border-primary/10 rounded-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
