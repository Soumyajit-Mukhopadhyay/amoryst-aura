import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { LoyaltyBanner } from '@/components/ui/LoyaltyBanner';
import { CustomCursor } from '@/components/ui/CustomCursor';

import { HeroSection } from '@/components/sections/HeroSection';
import { CollectionsSection } from '@/components/sections/CollectionsSection';
import { PhilosophySection } from '@/components/sections/PhilosophySection';
import { IngredientsSection } from '@/components/sections/IngredientsSection';
import { LoyaltySection } from '@/components/sections/LoyaltySection';
import { Footer } from '@/components/sections/Footer';
import { ScentFinder } from '@/components/sections/ScentFinder';
import { AIAssistant } from '@/components/sections/AIAssistant';
import { OfflineStoresSection } from '@/components/sections/OfflineStoresSection';

const Index = () => {
  const [quizOpen, setQuizOpen] = useState(false);

  useEffect(() => {
    const handleOpenQuiz = () => setQuizOpen(true);
    window.addEventListener('open-scent-quiz', handleOpenQuiz);
    return () => window.removeEventListener('open-scent-quiz', handleOpenQuiz);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <CustomCursor />
      <div className="fixed top-0 left-0 right-0 z-[60] bg-background/95 backdrop-blur-sm border-b border-primary/10">
        <LoyaltyBanner />
      </div>
      <Navbar onOpenQuiz={() => setQuizOpen(true)} />
      <HeroSection onOpenQuiz={() => setQuizOpen(true)} />

      {/* Transition: Hero → Collections */}
      <div className="h-24 bg-gradient-to-b from-background via-background to-background pointer-events-none -mt-24 relative z-20" />

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background pointer-events-none" />
        <CollectionsSection />
      </div>

      {/* Transition: Collections → Philosophy */}
      <div className="h-16 bg-gradient-to-b from-background to-background pointer-events-none" />

      <PhilosophySection />

      {/* Transition: Philosophy → Ingredients */}
      <div className="h-16 bg-gradient-to-b from-background to-background pointer-events-none" />

      <div className="bg-secondary/10">
        <IngredientsSection />
      </div>

      {/* Transition: Ingredients → Stores */}
      <div className="h-16 bg-gradient-to-b from-background to-background pointer-events-none" />

      <OfflineStoresSection />

      {/* Transition: Stores → Loyalty */}
      <div className="h-16 bg-gradient-to-b from-background to-background pointer-events-none" />

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
        <LoyaltySection />
      </div>

      {/* Transition: Loyalty → Footer */}
      <div className="h-16 bg-gradient-to-b from-background to-background pointer-events-none" />

      <Footer />
      <ScentFinder isOpen={quizOpen} onClose={() => setQuizOpen(false)} />
      <AIAssistant />
    </div>
  );
};

export default Index;
