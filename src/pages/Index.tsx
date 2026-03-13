import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { CollectionsSection } from '@/components/sections/CollectionsSection';
import { PhilosophySection } from '@/components/sections/PhilosophySection';
import { IngredientsSection } from '@/components/sections/IngredientsSection';
import { LoyaltySection } from '@/components/sections/LoyaltySection';
import { Footer } from '@/components/sections/Footer';
import { ScentFinder } from '@/components/sections/ScentFinder';
import { AIAssistant } from '@/components/sections/AIAssistant';

const Index = () => {
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar onOpenQuiz={() => setQuizOpen(true)} />
      <HeroSection onOpenQuiz={() => setQuizOpen(true)} />
      <CollectionsSection />
      <PhilosophySection />
      <IngredientsSection />
      <LoyaltySection />
      <Footer />
      <ScentFinder isOpen={quizOpen} onClose={() => setQuizOpen(false)} />
      <AIAssistant />
    </div>
  );
};

export default Index;
