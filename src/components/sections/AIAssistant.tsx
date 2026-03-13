import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ShoppingBag } from 'lucide-react';
import { PERFUMES, getPerfumeById } from '@/data/perfumes';
import { BOTTLE_IMAGES } from '@/data/bottleImages';
import { useCartStore } from '@/store/useCartStore';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  perfumeRecommendation?: string;
}

const AMARA_RESPONSES: Record<string, string> = {
  default: "That is a wonderful question. Let me think about which fragrance might be right for this moment. Could you tell me — is this for yourself, or are you considering a gift for someone?",
  evening: "For an evening that truly matters, I would gently point you toward Twilight. It opens with black pepper and bergamot, and as the evening deepens, rose absolute and Mysore sandalwood take over. It is the kind of fragrance that makes people lean in rather than step back.",
  daily: "For something you can wear every day without it wearing you, Horizon is exceptional. Cardamom from Kerala, cedarwood from Morocco — crisp and purposeful without ever being loud. It lasts a solid ten hours, which means it is still there when you get home.",
  gift: "For a gift, the Discovery Kit is a beautiful entry point — three 5ml samples of their choosing, plus ₹150 credit toward their first full bottle. It says: 'I trust your taste.' Which is often the best gift of all.",
  strong: "If longevity and presence are what matter most, Eclipse is unmistakable. Fourteen hours of wear. Black oud, labdanum, tonka bean. It is the fragrance you wear when you intend to leave an impression that lasts longer than the conversation.",
  light: "Elysium is precisely this — a fragrance that exists close to the skin, like a second thought rather than a declaration. Jasmine sambac from Tamil Nadu, neroli, and a cashmeran base that people describe as addictive.",
  special: "For something truly extraordinary, Reserve: Saffron Dusk is our collector piece. Kashmiri saffron harvested by hand in October 2025, only 200 numbered bottles exist. When they are gone, this fragrance disappears entirely.",
};

function getAmaraResponse(input: string): { text: string; perfumeId?: string } {
  const lower = input.toLowerCase();
  if (lower.includes('evening') || lower.includes('night') || lower.includes('date'))
    return { text: AMARA_RESPONSES.evening, perfumeId: 'twilight' };
  if (lower.includes('daily') || lower.includes('work') || lower.includes('office') || lower.includes('day'))
    return { text: AMARA_RESPONSES.daily, perfumeId: 'horizon' };
  if (lower.includes('gift') || lower.includes('someone'))
    return { text: AMARA_RESPONSES.gift, perfumeId: 'sampler-kit' };
  if (lower.includes('strong') || lower.includes('long') || lower.includes('last') || lower.includes('powerful'))
    return { text: AMARA_RESPONSES.strong, perfumeId: 'eclipse' };
  if (lower.includes('light') || lower.includes('soft') || lower.includes('gentle') || lower.includes('subtle'))
    return { text: AMARA_RESPONSES.light, perfumeId: 'elysium' };
  if (lower.includes('special') || lower.includes('rare') || lower.includes('collector') || lower.includes('unique'))
    return { text: AMARA_RESPONSES.special, perfumeId: 'reserve-saffron' };
  return { text: AMARA_RESPONSES.default };
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello. I am Amara, your Amorist fragrance guide. Tell me — are you looking for something for yourself, or a gift for someone?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = getAmaraResponse(input);
      const assistantMsg: Message = {
        role: 'assistant',
        content: response.text,
        perfumeRecommendation: response.perfumeId,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: 'spring' }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[65] w-14 h-14 rounded-full bg-card border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-shadow animate-pulse-gold"
        title="Ask Amara"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-primary" />
        ) : (
          <span className="font-display text-xl text-primary">A</span>
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
            className="fixed bottom-24 right-6 z-[65] w-80 sm:w-96 h-[480px] glass-panel flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border/30">
              <p className="font-mono text-xs tracking-[0.2em] text-primary">AMARA</p>
              <p className="font-body text-xs text-muted-foreground">Amorist Fragrance Concierge</p>
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
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-secondary/50 text-foreground rounded-bl-sm'
                    }`}
                  >
                    <p className="font-body text-sm leading-relaxed">{msg.content}</p>

                    {/* Perfume Recommendation Card */}
                    {msg.perfumeRecommendation && (() => {
                      const perfume = getPerfumeById(msg.perfumeRecommendation);
                      if (!perfume) return null;
                      return (
                        <div className="mt-3 p-3 bg-background/50 rounded-lg flex items-center gap-3">
                          <img
                            src={BOTTLE_IMAGES[perfume.id]}
                            alt={perfume.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-display text-sm text-foreground truncate">{perfume.name}</p>
                            <p className="font-body text-xs text-primary">₹{perfume.sizes[0]?.price}</p>
                          </div>
                          <button
                            onClick={() => {
                              const size = perfume.sizes[0];
                              addItem({ perfumeId: perfume.id, name: perfume.name, size: size.ml, price: size.price, sku: size.sku });
                            }}
                            className="p-1.5 bg-primary text-primary-foreground rounded hover:bg-primary/80 transition-colors flex-shrink-0"
                          >
                            <ShoppingBag className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-1 px-4 py-3 bg-secondary/50 rounded-2xl rounded-bl-sm w-fit">
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
            <div className="p-3 border-t border-border/30">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Amara anything..."
                  className="flex-1 h-10 px-4 rounded-lg bg-secondary/30 border border-border/30 text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
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
