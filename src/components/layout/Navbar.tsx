import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Menu, Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { BOTTLE_IMAGES } from '@/data/bottleImages';
import logoImage from '@/assets/amorist-logo.png';

interface NavbarProps {
  onOpenQuiz: () => void;
}

export function Navbar({ onOpenQuiz }: NavbarProps) {
  const { items, isOpen, toggleCart, setCartOpen, removeItem, totalPrice, totalItems } = useCartStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass-panel py-3' : 'py-5'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <img src={logoImage} alt="Amorist" className="h-8 w-auto" />
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#collections" className="text-foreground/70 hover:text-primary font-body text-sm tracking-widest uppercase transition-colors">
              Collection
            </a>
            <a href="#philosophy" className="text-foreground/70 hover:text-primary font-body text-sm tracking-widest uppercase transition-colors">
              Philosophy
            </a>
            <a href="#ingredients" className="text-foreground/70 hover:text-primary font-body text-sm tracking-widest uppercase transition-colors">
              Ingredients
            </a>
            <button
              onClick={onOpenQuiz}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 text-primary font-body text-sm tracking-wider hover:bg-primary/10 transition-all animate-pulse-gold"
            >
              <Sparkles className="w-4 h-4" />
              New to fragrance?
            </button>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <button onClick={toggleCart} className="relative p-2 text-foreground/70 hover:text-primary transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {totalItems() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-body font-semibold"
                >
                  {totalItems()}
                </motion.span>
              )}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-foreground/70">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60]"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-96 max-w-full glass-panel z-[61] p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-2xl text-foreground">Your Cart</h2>
                <button onClick={() => setCartOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {items.length === 0 ? (
                <p className="text-muted-foreground font-body text-center mt-12">Your cart is empty</p>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-4">
                  {items.map((item) => (
                    <div key={item.sku} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                      <img src={BOTTLE_IMAGES[item.perfumeId] || ''} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1">
                        <p className="font-display text-sm text-foreground">{item.name}</p>
                        <p className="text-muted-foreground text-xs font-body">{item.size}ml × {item.quantity}</p>
                        <p className="text-primary font-body font-semibold text-sm">₹{item.price * item.quantity}</p>
                      </div>
                      <button onClick={() => removeItem(item.sku)} className="text-muted-foreground hover:text-destructive">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {items.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex justify-between mb-4">
                    <span className="text-foreground font-body">Total</span>
                    <span className="text-primary font-display text-xl">₹{totalPrice()}</span>
                  </div>
                  <button className="w-full py-3 bg-primary text-primary-foreground font-body font-semibold tracking-wider rounded-lg hover:bg-primary/90 transition-colors">
                    Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 glass-panel z-50 p-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              <a href="#collections" onClick={() => setMenuOpen(false)} className="text-foreground/70 hover:text-primary font-body text-sm tracking-widest uppercase">Collection</a>
              <a href="#philosophy" onClick={() => setMenuOpen(false)} className="text-foreground/70 hover:text-primary font-body text-sm tracking-widest uppercase">Philosophy</a>
              <a href="#ingredients" onClick={() => setMenuOpen(false)} className="text-foreground/70 hover:text-primary font-body text-sm tracking-widest uppercase">Ingredients</a>
              <button onClick={() => { onOpenQuiz(); setMenuOpen(false); }} className="flex items-center gap-2 text-primary font-body text-sm tracking-wider">
                <Sparkles className="w-4 h-4" /> New to fragrance?
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
