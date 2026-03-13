import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUIZ, scoreQuizAnswers, type QuizOption } from '@/data/quiz';
import { getPerfumeById } from '@/data/perfumes';
import { BOTTLE_IMAGES } from '@/data/bottleImages';
import { useCartStore } from '@/store/useCartStore';
import { X, ArrowRight, Share2, ShoppingBag } from 'lucide-react';

// Quiz option images
import quizMorning from '@/assets/quiz-morning.jpg';
import quizEvening from '@/assets/quiz-evening.jpg';
import quizWeekend from '@/assets/quiz-weekend.jpg';
import quizOccasion from '@/assets/quiz-occasion.jpg';
import quizWood from '@/assets/quiz-wood.jpg';
import quizFlower from '@/assets/quiz-flower.jpg';
import quizSpice from '@/assets/quiz-spice.jpg';
import quizSmoke from '@/assets/quiz-smoke.jpg';

const QUIZ_IMAGES: Record<string, string> = {
  morning: quizMorning, evening: quizEvening, weekend: quizWeekend, occasion: quizOccasion,
  wood: quizWood, flower: quizFlower, spice: quizSpice, dark: quizSmoke,
};

interface ScentFinderProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScentFinder({ isOpen, onClose }: ScentFinderProps) {
  const [stage, setStage] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<QuizOption[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const addItem = useCartStore((s) => s.addItem);

  const handleStart = () => setStage('quiz');

  const handleSelect = (option: QuizOption) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);
    if (currentQ < QUIZ.questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setResults(scoreQuizAnswers(newAnswers));
      setStage('result');
    }
  };

  const handleReset = () => {
    setStage('intro');
    setCurrentQ(0);
    setAnswers([]);
    setResults([]);
  };

  const question = QUIZ.questions[currentQ];
  const progress = (currentQ + 1) / QUIZ.questions.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" onClick={onClose} />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative z-10 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <button onClick={onClose} className="absolute top-4 right-4 z-20 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-6 h-6" />
            </button>

            {/* INTRO */}
            {stage === 'intro' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16 px-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-8"
                >
                  <span className="text-3xl">✦</span>
                </motion.div>
                <p className="font-mono text-xs tracking-[0.3em] text-primary mb-6 uppercase">Scent Finder</p>
                <h2 className="font-display text-5xl md:text-6xl font-light text-foreground mb-4">{QUIZ.intro.headline}</h2>
                <p className="font-body text-lg text-muted-foreground mb-10">{QUIZ.intro.subhead}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStart}
                  className="inline-flex items-center gap-2 h-12 px-8 bg-primary text-primary-foreground font-body font-medium tracking-wider rounded-lg hover:bg-primary/80 transition-all"
                >
                  {QUIZ.intro.cta}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}

            {/* QUIZ */}
            {stage === 'quiz' && question && (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -80 }}
                transition={{ duration: 0.4 }}
                className="py-12 px-8"
              >
                {/* Progress */}
                <div className="flex justify-center mb-8">
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="26" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                    <motion.circle
                      cx="30" cy="30" r="26" fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 26}
                      initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - progress) }}
                      transition={{ duration: 0.5 }}
                      transform="rotate(-90 30 30)"
                    />
                    <text x="30" y="35" textAnchor="middle" className="fill-foreground font-body text-sm">
                      {currentQ + 1}/{QUIZ.questions.length}
                    </text>
                  </svg>
                </div>

                <h3 className="font-display text-2xl md:text-3xl text-foreground text-center mb-3">{question.question}</h3>
                {question.subtext && (
                  <p className="font-body text-sm text-muted-foreground text-center mb-8">{question.subtext}</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {question.options.map((opt, i) => {
                    const img = QUIZ_IMAGES[opt.id];
                    return (
                      <motion.button
                        key={opt.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.03, y: -4 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleSelect(opt)}
                        className="group glass-panel overflow-hidden text-left hover:border-primary/40 transition-all"
                      >
                        {img && (
                          <div className="relative h-32 overflow-hidden">
                            <img src={img} alt={opt.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                          </div>
                        )}
                        <div className="p-4">
                          {!img && opt.emoji && <span className="text-2xl mb-2 block">{opt.emoji}</span>}
                          <p className="font-body font-medium text-foreground mb-1">{opt.label}</p>
                          {opt.sensoryHint && (
                            <p className="font-body text-xs text-muted-foreground italic">{opt.sensoryHint}</p>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* RESULT */}
            {stage === 'result' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-12 px-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                >
                  <p className="font-mono text-xs tracking-[0.3em] text-primary mb-4 uppercase">Your Perfect Match</p>
                </motion.div>
                <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
                  {results.map((id, idx) => {
                    const perfume = getPerfumeById(id);
                    if (!perfume) return null;
                    return (
                      <motion.div
                        key={id}
                        initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ delay: 0.3 + idx * 0.2, type: 'spring' }}
                        className="glass-panel p-6 max-w-xs mx-auto group"
                      >
                        <div className="relative overflow-hidden rounded-lg mb-4">
                          <img
                            src={BOTTLE_IMAGES[id]}
                            alt={perfume.name}
                            className="w-48 h-48 object-cover mx-auto group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <h3 className="font-display text-2xl text-foreground mb-1">{perfume.name}</h3>
                        <p className="font-body text-sm text-muted-foreground italic mb-4">{perfume.tagline}</p>
                        <div className="flex flex-col gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              const size = perfume.sizes[0];
                              addItem({ perfumeId: perfume.id, name: perfume.name, size: size.ml, price: size.price, sku: size.sku });
                            }}
                            className="flex items-center justify-center gap-2 h-10 bg-primary text-primary-foreground font-body text-sm font-medium rounded-lg hover:bg-primary/80 transition-colors"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            Make it mine — ₹{perfume.sizes[0]?.price}
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="glass-panel p-6 max-w-md mx-auto">
                  <p className="font-body text-sm text-foreground mb-3">
                    Share this quiz with a friend. When they order, you both get <span className="text-primary font-semibold">₹150 Amorist Credit</span>.
                  </p>
                  <button className="inline-flex items-center gap-2 h-9 px-4 bg-secondary text-secondary-foreground font-body text-sm rounded-lg hover:bg-secondary/80 transition-colors">
                    <Share2 className="w-4 h-4" />
                    Share on WhatsApp
                  </button>
                </div>

                <button onClick={handleReset} className="mt-6 text-muted-foreground font-body text-sm hover:text-foreground transition-colors">
                  Take the quiz again
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
