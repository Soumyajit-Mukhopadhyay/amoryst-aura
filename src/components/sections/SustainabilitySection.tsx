import { motion } from 'framer-motion';

const SustainabilitySection = () => {
  const features = [
    {
      title: "Forever Bottle",
      description: "Crafted from heavy Italian flint glass, designed to be kept for a lifetime. Never discarded, only replenished.",
      icon: "💎"
    },
    {
      title: "Eco-Refill System",
      description: "Our high-precision refill pouches reduce plastic waste by 85% compared to purchasing a new bottle.",
      icon: "♻️"
    },
    {
      title: "Sustainable Reward",
      description: "Maintain your scent ritual while protecting the planet. Enjoy a perpetual 20% discount on all refills.",
      icon: "✨"
    }
  ];

  return (
    <section id="sustainability" className="relative py-32 bg-[#0a0a0a] overflow-hidden">
      {/* Premium Ambient Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Floating Eco Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: "110%", 
            scale: Math.random() * 0.5 + 0.5 
          }}
          animate={{ 
            y: "-10%",
            x: (Math.random() * 100 - 50) + "%",
            opacity: [0, 0.5, 0]
          }}
          transition={{ 
            duration: Math.random() * 10 + 10, 
            repeat: Infinity, 
            ease: "linear",
            delay: Math.random() * 5
          }}
          style={{ left: `${Math.random() * 100}%` }}
        />
      ))}

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-emerald-400 font-medium tracking-[0.3em] uppercase block mb-4"
          >
            The Cycle of Scent
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display text-white mb-8"
          >
            Luxury that <span className="text-emerald-200">Breathes</span> with the Earth
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-400 leading-relaxed"
          >
            Sustainability isn't a compromise; it's the ultimate refinement. 
            Amoryst Aura introduces the Refill Revolution, where your signature bottle 
            remains a permanent fixture of your vanity, while our refill rituals 
            minimize environmental footprint.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3 }}
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-500"
            >
              <div className="text-4xl mb-6">{feature.icon}</div>
              <h3 className="text-xl font-display text-white mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Visual Call-to-Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-20 p-12 rounded-3xl bg-gradient-to-r from-emerald-900/40 to-black border border-emerald-500/20 text-center relative overflow-hidden"
        >
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-display text-white mb-6">
              Join the Legacy. Save 20% Forever.
            </h3>
            <p className="text-emerald-100/70 mb-8 max-w-2xl mx-auto">
              Every refill purchase reduces your carbon footprint and rewards your loyalty to both the craft and the planet. Look for the "Eco-Refill" option in our collection.
            </p>
            <a 
              href="#collections"
              className="inline-block px-10 py-4 bg-emerald-500 text-black font-bold rounded-full hover:bg-emerald-400 transition-colors duration-300"
            >
              Explore the Collection
            </a>
          </div>
          
          {/* Decorative Ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full pointer-events-none">
            <div className="w-full h-full border border-emerald-500/10 rounded-full animate-[spin_20s_linear_infinite]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SustainabilitySection;
