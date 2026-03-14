import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { StoreMap, StoreLocation } from '@/components/ui/StoreMap';

const OFFLINE_STORES: StoreLocation[] = [
  { id: '1', name: 'Amoryst Aura Flagship', address: 'Palladium Mall, Lower Parel', city: 'Mumbai', lat: 18.9939, lng: 72.8258 },
  { id: '2', name: 'Amoryst Boutique', address: 'Khan Market', city: 'New Delhi', lat: 28.6001, lng: 77.2274 },
  { id: '3', name: 'Aura Atelier', address: 'UB City, Vittal Mallya Rd', city: 'Bengaluru', lat: 12.9715, lng: 77.5961 },
  { id: '4', name: 'Amoryst Gallery', address: 'Kala Ghoda, Fort', city: 'Mumbai', lat: 18.9271, lng: 72.8327 },
  { id: '5', name: 'The Perfume Bar', address: 'Banjara Hills, Road No. 2', city: 'Hyderabad', lat: 17.4170, lng: 78.4357 },
  { id: '6', name: 'Amoryst Aura Select', address: 'Phoenix Marketcity, Viman Nagar', city: 'Pune', lat: 18.5626, lng: 73.9167 },
  { id: '7', name: 'Heritage Scents', address: 'Colaba Causeway', city: 'Mumbai', lat: 18.9205, lng: 72.8315 },
  { id: '8', name: 'Aura Exclusives', address: 'Elante Mall, Ind. Area Phase I', city: 'Chandigarh', lat: 30.7055, lng: 76.8013 },
];

export function OfflineStoresSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [activeStore, setActiveStore] = useState<StoreLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Listen for AI-driven map commands
  useEffect(() => {
    const handleFlyTo = (e: Event) => {
      const customEvent = e as CustomEvent;
      const storeId = customEvent.detail?.storeId;
      const store = OFFLINE_STORES.find(s => s.id === storeId);
      if (store) {
        setActiveStore(store);
      }
    };
    window.addEventListener('fly-to-store', handleFlyTo);
    return () => window.removeEventListener('fly-to-store', handleFlyTo);
  }, []);

  const filteredStores = OFFLINE_STORES.filter(store => 
    store.city.toLowerCase().includes(searchQuery.toLowerCase()) || 
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="stores" ref={ref} className="py-16 md:py-20 relative overflow-hidden bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-primary mb-4 uppercase">Experience In Person</p>
          <h2 className="font-display text-4xl md:text-6xl font-light text-foreground mb-4">
            Our Boutiques
          </h2>
          <p className="font-body text-muted-foreground max-w-lg mx-auto">
            Discover our fragrances in their truest form at an Amoryst Aura location near you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 items-start h-[600px]">
          {/* Scrollable Sidebar with Search */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col h-full bg-secondary/10 rounded-2xl border border-border overflow-hidden"
          >
            <div className="p-6 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search by city, name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm font-body text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {filteredStores.length > 0 ? (
                filteredStores.map(store => (
                  <div 
                    key={store.id}
                    onClick={() => setActiveStore(store)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                      activeStore?.id === store.id 
                        ? 'border-primary bg-primary/5 shadow-md' 
                        : 'border-border hover:border-primary/40 hover:bg-secondary/20'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-display text-lg text-foreground group-hover:text-primary transition-colors">{store.name}</h4>
                      <MapPin className={`w-4 h-4 ${activeStore?.id === store.id ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <p className="font-body text-sm text-foreground mb-1">{store.address}</p>
                    <p className="font-mono text-xs text-muted-foreground uppercase">{store.city}</p>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 text-muted-foreground font-body text-sm">
                  No boutiques found matching your search.
                </div>
              )}
            </div>
          </motion.div>

          {/* Interactive Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2 relative h-full glass-panel p-2 overflow-hidden rounded-2xl"
          >
            <StoreMap 
              stores={filteredStores}
              activeStore={activeStore}
              onMarkerClick={(store) => setActiveStore(store)}
              className="w-full h-full rounded-xl"
            />
          </motion.div>
        </div>
      </div>

      {/* Inject custom scrollbar styles just for this panel */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(212, 175, 55, 0.6); }
        
        /* Premium light popup styles */
        .light-premium-popup .leaflet-popup-content-wrapper {
          background: #FAF9F5;
          color: #333;
          border: 1px solid rgba(212, 175, 55, 0.4);
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }
        .light-premium-popup .leaflet-popup-tip {
          background: #FAF9F5;
          border-bottom: 1px solid rgba(212, 175, 55, 0.4);
          border-right: 1px solid rgba(212, 175, 55, 0.4);
        }
      `}} />
    </section>
  );
}
