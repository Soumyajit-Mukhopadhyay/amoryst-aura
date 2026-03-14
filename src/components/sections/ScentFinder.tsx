import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUIZ, scoreQuizAnswers, type QuizOption } from '@/data/quiz';
import { getPerfumeById } from '@/data/perfumes';
import { BOTTLE_IMAGES, BOTTLE_VIDEOS } from '@/data/bottleImages';
import { useCartStore } from '@/store/useCartStore';
import { X, ArrowRight, ArrowLeft, Share2, ShoppingBag, Sparkles, Flame, Trophy, Zap } from 'lucide-react';

import quizMorning from '@/assets/quiz-morning.jpg';
import quizEvening from '@/assets/quiz-evening.png';
import quizWeekend from '@/assets/quiz-weekend.jpg';
import quizOccasion from '@/assets/quiz-occasion.jpg';
import quizWood from '@/assets/quiz-wood.jpg';
import quizFlower from '@/assets/quiz-flower.jpg';
import quizSpice from '@/assets/quiz-spice.jpg';
import quizSmoke from '@/assets/quiz-smoke.jpg';
import quizRegionEast from '@/assets/quiz-region-east.png';
import quizRegionSouth from '@/assets/quiz-region-south.png';
import quizRegionWest from '@/assets/quiz-region-west.png';
import quizRegionNorth from '@/assets/quiz-region-north.png';
import freshImage from '@/assets/bottle-oasis.jpg';

const QUIZ_IMAGES: Record<string, string> = {
  morning: quizMorning, evening: quizEvening, weekend: quizWeekend, occasion: quizOccasion,
  wood: quizWood, flower: quizFlower, spice: quizSpice, dark: quizSmoke, fresh: freshImage,
  east: quizRegionEast, south: quizRegionSouth, west: quizRegionWest, north: quizRegionNorth,
};

interface ScentFinderProps {
  isOpen: boolean;
  onClose: () => void;
}

/* Floating particles for background */
function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/30"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}
    </div>
  );
}

/* Streak flame indicator */
function StreakIndicator({ streak }: { streak: number }) {
  if (streak < 2) return null;
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/30"
    >
      <Flame className="w-3.5 h-3.5 text-primary" />
      <span className="font-mono text-[10px] tracking-wider text-primary uppercase">{streak}x Streak</span>
    </motion.div>
  );
}

export function ScentFinder({ isOpen, onClose }: ScentFinderProps) {
  const [stage, setStage] = useState<'intro' | 'quiz' | 'analyzing' | 'result'>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [userName, setUserName] = useState('');
  const [answers, setAnswers] = useState<QuizOption[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [confidenceScores, setConfidenceScores] = useState<number[]>([95, 82]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [showXpGain, setShowXpGain] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleStart = () => setStage('quiz');

  const submitQuizToAI = async (finalAnswers: QuizOption[]) => {
    setStage('analyzing');
    
    const preferences = finalAnswers.map(a => a.label).join(', ');
    const prompt = `I am taking a scent finder quiz. My name is ${userName || 'a guest'}. My preferences are: ${preferences}. Based on your knowledge of Amoryst Aura perfumes, which ONE perfume from our collection is the absolute best match for me? You must also provide a confidence score between 85 and 99. Return your answer in this exact JSON format: {"perfume_id": "the_id", "confidence": 95}. Valid IDs are: twilight, horizon, eclipse, oasis, mirage, elysium, reserve-saffron. Do not output anything other than the JSON.`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s maximum wait for AI

      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: 'quiz_' + Date.now(), message: prompt }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (res.ok) {
        const data = await res.json();
        let jsonStr = data.response.replace(/```json/g, '').replace(/```/g, '').trim();
        const startIdx = jsonStr.indexOf('{');
        const endIdx = jsonStr.lastIndexOf('}');
        if (startIdx >= 0 && endIdx >= startIdx) {
           jsonStr = jsonStr.substring(startIdx, endIdx + 1);
           const result = JSON.parse(jsonStr);
           if (result.perfume_id) {
              const fallbackId = scoreQuizAnswers(finalAnswers).find(id => id !== result.perfume_id) || 'elysium';
              setResults([result.perfume_id, fallbackId]);
              const conf1 = result.confidence || (Math.floor(Math.random() * 10) + 90);
              const conf2 = conf1 - (Math.floor(Math.random() * 8) + 5);
              setConfidenceScores([conf1, conf2]);
              setStage('result');
              return;
           }
        }
      }
    } catch(err) {
      console.warn("AI Request Failed or Timed out", err);
    }
    
    // Fallback logic
    setResults(scoreQuizAnswers(finalAnswers));
    const conf1 = Math.floor(Math.random() * 10) + 88;
    const conf2 = conf1 - (Math.floor(Math.random() * 10) + 5);
    setConfidenceScores([conf1, conf2]);
    setStage('result');
  };

  const handleSelect = (option: QuizOption) => {
    setSelectedOption(option.id);
    setStreak(s => s + 1);
    const gained = 20 + streak * 5;
    setXp(x => x + gained);
    setShowXpGain(true);
    setTimeout(() => setShowXpGain(false), 800);

    setTimeout(() => {
      const newAnswers = [...answers, option];
      setAnswers(newAnswers);
      setSelectedOption(null);
      if (currentQ < QUIZ.questions.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        submitQuizToAI(newAnswers);
      }
    }, 400); // reduced from 600ms for snappier feel
  };

  const handleBack = () => {
    if (currentQ === 0) {
      setStage('intro');
      setAnswers([]);
      setStreak(0);
      setXp(0);
      setUserName('');
    } else {
      setCurrentQ(currentQ - 1);
      setAnswers(answers.slice(0, -1));
      if (streak > 0) setStreak(streak - 1);
    }
  };

  const handleReset = () => {
    setStage('intro');
    setCurrentQ(0);
    setAnswers([]);
    setResults([]);
    setStreak(0);
    setXp(0);
    setUserName('');
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
          <div className="absolute inset-0 bg-background/98 backdrop-blur-xl" onClick={onClose} />
          <FloatingParticles />

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

            {/* XP bar - visible during quiz */}
            {stage === 'quiz' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between px-8 pt-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="font-mono text-xs text-primary">{xp} XP</span>
                  </div>
                  <AnimatePresence>
                    {showXpGain && (
                      <motion.span
                        initial={{ opacity: 1, y: 0 }}
                        animate={{ opacity: 0, y: -20 }}
                        exit={{ opacity: 0 }}
                        className="font-mono text-xs text-primary font-bold"
                      >
                        +{20 + (streak - 1) * 5}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <StreakIndicator streak={streak} />
              </motion.div>
            )}

            {/* INTRO */}
            {stage === 'intro' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16 px-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-24 h-24 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-8"
                >
                  <Sparkles className="w-10 h-10 text-primary" />
                </motion.div>
                <p className="font-mono text-xs tracking-[0.3em] text-primary mb-6 uppercase">Scent Finder</p>
                <h2 className="font-display text-5xl md:text-6xl font-light text-foreground mb-4">{QUIZ.intro.headline}</h2>
                <p className="font-body text-lg text-muted-foreground mb-4">{QUIZ.intro.subhead}</p>
                <div className="flex items-center justify-center gap-4 mb-10">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50">
                    <Trophy className="w-3.5 h-3.5 text-primary" />
                    <span className="font-mono text-[10px] text-muted-foreground tracking-wider">Earn XP</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50">
                    <Flame className="w-3.5 h-3.5 text-primary" />
                    <span className="font-mono text-[10px] text-muted-foreground tracking-wider">Build Streaks</span>
                  </div>
                </div>
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
                className="py-8 px-8"
              >
                <div className="mb-6">
                  <button onClick={handleBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                </div>

                {/* Progress ring */}
                <div className="flex justify-center mb-6 mt-4">
                  <div className="relative">
                    <svg width="70" height="70" viewBox="0 0 70 70">
                      <circle cx="35" cy="35" r="30" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                      <motion.circle
                        cx="35" cy="35" r="30" fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="3" strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 30}
                        initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 30 * (1 - progress) }}
                        transition={{ duration: 0.6 }}
                        transform="rotate(-90 35 35)"
                      />
                      <text x="35" y="39" textAnchor="middle" className="fill-foreground font-body text-sm font-medium">
                        {currentQ + 1}/{QUIZ.questions.length}
                      </text>
                    </svg>
                    {/* Glow on progress */}
                    <motion.div
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full"
                      style={{ boxShadow: '0 0 20px 5px hsl(var(--primary) / 0.15)' }}
                    />
                  </div>
                </div>

                <h3 className="font-display text-2xl md:text-3xl text-foreground text-center mb-2">{question.question}</h3>
                {question.subtext && (
                  <p className="font-body text-sm text-muted-foreground text-center mb-8">{question.subtext}</p>
                )}

                {question.type === 'text-input' ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center max-w-sm mx-auto mt-8">
                    <input 
                      type="text" 
                      value={userName} 
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary/50 text-center text-lg mb-6 shadow-inner"
                      autoFocus
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                         if(userName.trim()) {
                            setCurrentQ(currentQ + 1);
                         }
                      }}
                      className="inline-flex items-center gap-2 h-12 px-8 bg-primary text-primary-foreground font-body font-medium tracking-wider rounded-lg hover:bg-primary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!userName.trim()}
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                    {question.options.map((opt, i) => {
                      const img = QUIZ_IMAGES[opt.id];
                      const isSelected = selectedOption === opt.id;
                      return (
                        <motion.button
                          key={opt.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          whileHover={{ scale: 1.03, y: -4 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => !selectedOption && handleSelect(opt)}
                          className={`group glass-panel overflow-hidden text-left transition-all relative ${
                            isSelected ? 'border-primary/60 ring-2 ring-primary/30' : 'hover:border-primary/40'
                          }`}
                        >
                          {img && (
                            <div className="relative h-32 overflow-hidden">
                              <img src={img} alt={opt.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                            </div>
                          )}
                          {/* Gamified Animated Emoji wrapper for options without images */}
                          <div className={`p-4 ${!img ? 'flex flex-col items-center justify-center text-center h-full min-h-[140px]' : ''}`}>
                            {!img && opt.emoji && (
                              <motion.div 
                                animate={{ y: [0, -6, 0] }} 
                                transition={{ duration: 3 + Math.random(), repeat: Infinity, ease: 'easeInOut' }}
                                className="relative w-14 h-14 mb-4 flex items-center justify-center rounded-full bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(255,215,0,0.1)]"
                              >
                                <span className="text-3xl relative z-10">{opt.emoji}</span>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 8 + Math.random() * 4, repeat: Infinity, ease: 'linear' }}
                                  className="absolute inset-x-0 w-full h-full border border-dashed border-primary/40 rounded-full"
                                />
                              </motion.div>
                            )}
                            <p className="font-body font-medium text-foreground mb-1">{opt.label}</p>
                            {opt.sensoryHint && (
                              <p className="font-body text-xs text-muted-foreground italic">{opt.sensoryHint}</p>
                            )}
                          </div>
                          {/* Selection flash */}
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: [0, 0.3, 0] }}
                              transition={{ duration: 0.6 }}
                              className="absolute inset-0 bg-primary pointer-events-none"
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* ANALYZING */}
            {stage === 'analyzing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-24 px-8 text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 mx-auto mb-8 rounded-full border-2 border-primary/30 border-t-primary"
                />
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="font-display text-2xl text-foreground mb-2"
                >
                  Analyzing your scent profile...
                </motion.p>
                <p className="font-body text-sm text-muted-foreground">Matching {xp} XP worth of preferences</p>

                {/* Animated scent words */}
                <div className="flex flex-wrap justify-center gap-2 mt-8 max-w-md mx-auto">
                  {answers.map((a, i) => (
                    <motion.span
                      key={a.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: [0, 1, 0.5], scale: [0, 1.1, 1] }}
                      transition={{ delay: i * 0.3, duration: 1 }}
                      className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-body text-primary"
                    >
                      {a.tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* RESULT */}
            {stage === 'result' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-12 px-8 text-center">
                {/* Achievement */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className="mb-6"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
                    <Trophy className="w-4 h-4 text-primary" />
                    <span className="font-mono text-xs text-primary tracking-wider">{xp} XP Earned • {streak}x Max Streak</span>
                  </div>
                  <p className="font-mono text-xs tracking-[0.3em] text-primary mb-4 uppercase">Your Perfect Match</p>
                </motion.div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
                  {results.map((id, idx) => {
                    const perfume = getPerfumeById(id);
                    if (!perfume) return null;
                    const videoSrc = BOTTLE_VIDEOS[id];
                    return (
                      <motion.div
                        key={id}
                        initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ delay: 0.3 + idx * 0.2, type: 'spring' }}
                        className="glass-panel p-6 max-w-xs mx-auto group"
                      >
                        <div className="relative overflow-hidden rounded-lg mb-4 h-48">
                          {videoSrc ? (
                            <video autoPlay muted loop playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                              <source src={videoSrc} type="video/mp4" />
                            </video>
                          ) : (
                            <img
                              src={BOTTLE_IMAGES[id]}
                              alt={perfume.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          )}
                        </div>
                        <h3 className="font-display text-2xl text-foreground mb-1">{perfume.name}</h3>
                        <p className="font-body text-sm text-muted-foreground italic mb-2">{perfume.tagline}</p>
                        {/* Match percentage */}
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${confidenceScores[idx]}%` }}
                              transition={{ delay: 0.8 + idx * 0.2, duration: 1 }}
                              className="h-full bg-primary rounded-full"
                            />
                          </div>
                          <span className="font-mono text-xs text-primary">{confidenceScores[idx]}%</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            const size = perfume.sizes[0];
                            addItem({ perfumeId: perfume.id, name: perfume.name, size: size.ml, price: size.price, sku: size.sku });
                          }}
                          className="w-full flex items-center justify-center gap-2 h-10 bg-primary text-primary-foreground font-body text-sm font-medium rounded-lg hover:bg-primary/80 transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Make it mine — ₹{perfume.sizes[0]?.price}
                        </motion.button>
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
