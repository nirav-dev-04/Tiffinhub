import React from 'react';
import { Utensils, LogOut, LogIn, UserPlus, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';

interface RootLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const RootLayout: React.FC<RootLayoutProps> = ({ children, currentPage, onNavigate }) => {
  const { user, isAuthenticated, logout, role } = useAuth();

  const getDashboardRoute = () => {
    switch (role) {
      case 'Vendor':
        return 'vendor-dashboard';
      case 'DeliveryPartner':
        return 'delivery-dashboard';
      case 'Admin':
        return 'admin-dashboard';
      default:
        return 'customer-dashboard';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6EF] text-[#2B2118]">
      {/* Top Navigation Bar */}
      <header className="border-b border-[#E7DFD1] bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-[0_1px_2px_rgba(43,33,24,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Platform Name */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-3 cursor-pointer text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-[#C2410C] flex items-center justify-center text-white shadow-sm">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold tracking-tight text-[#2B2118]">
                  TiffinHub
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#2F6B3F]/10 text-[#2F6B3F] border border-[#2F6B3F]/20 px-2 py-0.5 rounded-full">
                  v1.0 Live
                </span>
              </div>
              <p className="text-xs text-[#2B2118]/60 hidden sm:block">
                Daily home-cooked meal subscriptions
              </p>
            </div>
          </button>

          {/* User Nav Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate(getDashboardRoute())}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E7DFD1] hover:bg-[#FAF6EF] text-xs font-medium cursor-pointer transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#C2410C]" />
                  <span>My Workspace</span>
                </button>

                <div className="flex items-center gap-2 pl-2 border-l border-[#E7DFD1]">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-semibold text-[#2B2118] leading-tight">{user.name}</div>
                    <span className="text-[10px] font-semibold uppercase text-[#C2410C] tracking-wider">
                      {user.role}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      logout();
                      onNavigate('home');
                    }}
                    className="gap-1.5 text-xs text-[#2B2118]/70 hover:text-red-700"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('login')}
                  className="gap-1.5 text-xs font-medium"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onNavigate('register')}
                  className="gap-1.5 text-xs font-medium"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create Account</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {children}
      </main>

      {/* Clean Food Product Footer */}
      <footer className="border-t border-[#E7DFD1] bg-white py-6 text-center text-xs text-[#2B2118]/60">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#2B2118]">TiffinHub</span>
            <span>&bull;</span>
            <span>Enterprise Multi-Role Tiffin Management Platform</span>
          </div>
          <div className="flex items-center gap-3 text-[#2B2118]/70">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2F6B3F]" />
              Role Isolated JWT Security
            </span>
            <span>&bull;</span>
            <span>All times stored in UTC / displayed in IST</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
