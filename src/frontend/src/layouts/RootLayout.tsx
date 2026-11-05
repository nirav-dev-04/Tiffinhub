import React from 'react';
import { UtensilsCrossed, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Badge } from '../components/ui/badge';

export const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6EF] text-[#2B2118]">
      {/* Top Banner / Navbar */}
      <header className="border-b border-[#E7DFD1] bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#C2410C] flex items-center justify-center text-white shadow-sm">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold tracking-tight text-[#2B2118]">
                  TiffinHub
                </span>
                <Badge variant="success">Phase 1 Live</Badge>
              </div>
              <p className="text-xs text-[#2B2118]/60 hidden sm:block">
                Home-cooked subscription marketplace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 text-[#2F6B3F] font-medium bg-[#2F6B3F]/10 px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4" />
              <span>Clean Architecture</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E7DFD1] bg-white py-6 text-center text-xs text-[#2B2118]/60">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} TiffinHub. Clean Architecture on .NET 10 & React 19.</span>
          <div className="flex items-center gap-1 text-[#2B2118]/70">
            <HeartHandshake className="w-3.5 h-3.5 text-[#C2410C]" />
            <span>Built with warm food aesthetics</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
