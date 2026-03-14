import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Menu, Sparkles, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { BOTTLE_IMAGES } from '@/data/bottleImages';
import logoImage from '@/assets/amorist-logo.png';

interface NavbarProps {
  onOpenQuiz: () => void;
}

export function Navbar({ onOpenQuiz }: NavbarProps) {
  const { items, isOpen, toggleCart, setCartOpen, removeItem, updateQuantity, totalPrice, totalItems, notification } = useCartStore();
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
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'top-0 md:top-[40px] glass-panel py-3' : 'top-0 md:top-[40px] py-5'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-12">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2">
              <img src={logoImage} alt="Amorist" className="h-12 w-auto drop-shadow-[0_0_8px_rgba(235,193,126,0.4)]" />
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
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-body font-semibold shadow-[0_0_20px_rgba(235,193,126,0.5)] hover:shadow-[0_0_30px_rgba(235,193,126,0.8)] hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 animate-pulse-gold group"
              >
                <Sparkles className="w-4 h-4 text-primary-foreground group-hover:rotate-12 transition-transform duration-300" />
                New to fragrance?
              </button>
            </div>
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

      {/* Floating Notification */}
      <AnimatePresence>
        {notification.visible && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed top-24 right-6 z-[100] glass-panel px-6 py-4 flex items-center gap-4 border-primary/30 shadow-[0_0_30px_rgba(235,193,126,0.15)]"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-display text-sm text-foreground">{notification.message}</p>
              <p className="font-body text-xs text-muted-foreground">{notification.itemName}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.sku} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 border border-border/50 group transition-all hover:border-primary/30">
                      <div className="w-20 h-20 shrink-0 overflow-hidden rounded-lg bg-background">
                        <img src={BOTTLE_IMAGES[item.perfumeId] || ''} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-display text-base text-foreground truncate">{item.name}</p>
                          {item.purchaseType === 'refill' && (
                            <span className="shrink-0 px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[8px] font-mono border border-emerald-500/30 rounded">
                              REFILL
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground text-xs font-body mb-2">{item.size}ml</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-border/50 rounded-md bg-background/50 overflow-hidden">
                            <button 
                              onClick={() => updateQuantity(item.sku, -1)}
                              className="p-1 px-2 hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 font-mono text-xs text-foreground min-w-[24px] text-center">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.sku, 1)}
                              className="p-1 px-2 hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-primary font-mono font-semibold text-sm">₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.sku)} className="text-muted-foreground/50 hover:text-destructive transition-colors shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {items.length > 0 && (
                <div className="mt-auto pt-6 border-t border-border/50">
                  <div className="flex justify-between mb-6">
                    <div>
                      <span className="text-muted-foreground font-body block text-xs uppercase tracking-widest">Total cost</span>
                      <span className="text-primary font-display text-2xl drop-shadow-[0_0_10px_rgba(235,193,126,0.3)]">₹{totalPrice()}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-muted-foreground font-body block text-xs uppercase tracking-widest">Items</span>
                      <span className="text-foreground font-display text-2xl">{totalItems()}</span>
                    </div>
                  </div>
                  <button className="w-full py-4 bg-primary text-primary-foreground font-body font-semibold tracking-widest uppercase rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-[0_0_20px_rgba(235,193,126,0.3)] hover:shadow-[0_0_30px_rgba(235,193,126,0.5)]">
                    Checkout Now
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
              <button onClick={() => { onOpenQuiz(); setMenuOpen(false); }} className="flex w-full items-center justify-center gap-2 px-4 py-3 mt-4 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-body font-semibold shadow-[0_0_15px_rgba(235,193,126,0.4)]">
                <Sparkles className="w-5 h-5 text-primary-foreground" /> New to fragrance?
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
