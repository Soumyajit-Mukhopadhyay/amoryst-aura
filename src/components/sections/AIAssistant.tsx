import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

interface AmaraMessage {
  role: 'user' | 'assistant';
  content: string;
}

const CHAT_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/chat`;

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AmaraMessage[]>([
    { role: 'assistant', content: "Hello. I am Amara, your Amorist fragrance guide. What kind of scent profile are you drawn to today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Execute UI automations sent by Python backend
  const executeUIActions = (actions: any[]) => {
    actions.forEach(action => {
      try {
        if (action.type === 'navigate') {
          const element = document.getElementById(action.payload);
          if (element) {
            setIsOpen(false); // Close chat so they can see navigation
            element.scrollIntoView({ behavior: 'smooth' });
          }
        } 
        else if (action.type === 'map') {
          // Scroll to the stores section and dispatch event to fly map to store
          const storesEl = document.getElementById('stores');
          if (storesEl) {
            setIsOpen(false);
            storesEl.scrollIntoView({ behavior: 'smooth' });
          }
          // Give scroll time then dispatch fly-to event
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('fly-to-store', { detail: { storeId: action.payload } }));
          }, 600);
        }
        else if (action.type === 'add_to_cart') {
          // Note parameter might be string or int based on parsing
          const sizeInt = parseInt(action.payload.size) || 50; 
          useCartStore.getState().addItem({
            perfumeId: action.payload.id,
            name: action.payload.id.charAt(0).toUpperCase() + action.payload.id.slice(1), // Basic formatting
            size: sizeInt,
            price: sizeInt === 50 ? 12000 : 18000, 
            sku: `${action.payload.id}-${sizeInt}`
          });
          useCartStore.getState().setCartOpen(true);
        }
        else if (action.type === 'open_quiz') {
           setIsOpen(false);
           // Requires exposing ScentFinder globally or via context, or dispatching an event.
           // For now, we'll dispatch a custom window event that Index.tsx can listen to.
           window.dispatchEvent(new CustomEvent('open-scent-quiz'));
        }
      } catch(e) {
        console.error("Failed to execute UI action:", e);
      }
    });
  };

  const clearChat = async () => {
    setMessages([{ role: 'assistant', content: "Memory cleared. How may I assist you anew?" }]);
    try {
      await fetch("http://localhost:8000/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: SESSION_ID })
      });
    } catch(e) {
      console.error("Failed to clear backend memory", e);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userText = input;
    setInput('');
    setIsTyping(true);
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    
    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: SESSION_ID, message: userText })
      });

      if (!response.ok) throw new Error("Backend API Error");

      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      
      if (data.ui_actions && data.ui_actions.length > 0) {
        executeUIActions(data.ui_actions);
      }
      
    } catch (error) {
      console.error("AI API Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I apologize, my connection to the backend seems to have drifted. Ensure the Python API is running on port 8000." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: 'spring' }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[65] w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/70 border border-primary/50 flex items-center justify-center shadow-[0_0_25px_rgba(235,193,126,0.5)] hover:shadow-[0_0_35px_rgba(235,193,126,0.7)] hover:scale-110 transition-all duration-300 animate-pulse-gold"
        title="Ask Amara"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-primary-foreground" />
        ) : (
          <span className="font-display text-2xl font-bold text-primary-foreground drop-shadow-sm">A</span>
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-24 right-6 z-[65] w-80 sm:w-96 h-[480px] glass-panel flex flex-col overflow-hidden shadow-2xl border border-primary/20"
          >
            {/* Header */}
            <div className="p-4 border-b border-border/30 flex justify-between items-center bg-background/50 backdrop-blur-md">
              <div>
                <p className="font-mono text-xs tracking-[0.2em] text-primary">AMARA</p>
                <p className="font-body text-xs text-muted-foreground">Amorist Fragrance Concierge</p>
              </div>
              <button 
                onClick={clearChat}
                className="p-2 rounded-full hover:bg-secondary/50 text-muted-foreground transition-colors group"
                title="New Chat / Clear Memory"
              >
                <Trash2 className="w-4 h-4 group-hover:text-destructive transition-colors" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-sm shadow-md'
                        : 'bg-secondary/50 text-foreground rounded-bl-sm border border-border/50'
                    }`}
                  >
                    <p className="font-body text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>') }} />
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-1 px-4 py-3 bg-secondary/50 rounded-2xl rounded-bl-sm w-fit border border-border/50">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-primary"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border/30 bg-background/50 backdrop-blur-md">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Amara anything..."
                  className="flex-1 h-10 px-4 rounded-lg bg-secondary/30 border border-border/30 text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:bg-background transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/80 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
