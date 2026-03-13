import { motion } from 'framer-motion';
import logoImage from '@/assets/amorist-logo.png';

export function Footer() {
  return (
    <footer className="border-t border-border/30 py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Logo */}
          <div>
            <img src={logoImage} alt="Amorist" className="h-8 w-auto mb-4" />
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              A modern Indian fragrance house. Eight signatures. One is yours.
            </p>
          </div>

          {/* Collection */}
          <div>
            <h4 className="font-display text-lg text-foreground mb-4">Collection</h4>
            <ul className="space-y-2">
              {['Twilight', 'Horizon', 'Eclipse', 'Elysium', 'Mirage', 'Oasis', 'Reserve: Saffron Dusk'].map((name) => (
                <li key={name}>
                  <a href="#collections" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-display text-lg text-foreground mb-4">About</h4>
            <ul className="space-y-2">
              {['Our Philosophy', 'Ingredients', 'Sustainability', 'Press'].map((name) => (
                <li key={name}>
                  <a href="#philosophy" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display text-lg text-foreground mb-4">Support</h4>
            <ul className="space-y-2">
              {['Contact', 'Shipping', 'Returns', 'FAQ'].map((name) => (
                <li key={name}>
                  <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-muted-foreground">
            © 2026 Amorist. All rights reserved.
          </p>
          <p className="font-mono text-xs text-muted-foreground/50 tracking-wider">
            Made with intention in India
          </p>
        </div>
      </div>
    </footer>
  );
}
