import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import ingredientsImage from '@/assets/ingredients-dissolve.jpg';

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
    <section id="philosophy" ref={ref} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
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
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
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
