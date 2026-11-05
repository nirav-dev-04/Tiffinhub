import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RootLayout } from './layouts/RootLayout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { VendorDashboard } from './pages/vendor/VendorDashboard';
import { DeliveryDashboard } from './pages/delivery/DeliveryDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Role } from './types';

function MainRouter() {
  const { user, isAuthenticated, role } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('home');

  const handleAuthSuccess = (userRole: Role) => {
    switch (userRole) {
      case 'Vendor':
        setCurrentPage('vendor-dashboard');
        break;
      case 'DeliveryPartner':
        setCurrentPage('delivery-dashboard');
        break;
      case 'Admin':
        setCurrentPage('admin-dashboard');
        break;
      default:
        setCurrentPage('customer-dashboard');
        break;
    }
  };

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <LoginPage
            onSuccess={handleAuthSuccess}
            onNavigateToRegister={() => setCurrentPage('register')}
          />
        );

      case 'register':
        return (
          <RegisterPage
            onSuccess={handleAuthSuccess}
            onNavigateToLogin={() => setCurrentPage('login')}
          />
        );

      case 'customer-dashboard':
        return isAuthenticated ? <CustomerDashboard /> : <LoginPage onSuccess={handleAuthSuccess} onNavigateToRegister={() => setCurrentPage('register')} />;

      case 'vendor-dashboard':
        return isAuthenticated ? <VendorDashboard /> : <LoginPage onSuccess={handleAuthSuccess} onNavigateToRegister={() => setCurrentPage('register')} />;

      case 'delivery-dashboard':
        return isAuthenticated ? <DeliveryDashboard /> : <LoginPage onSuccess={handleAuthSuccess} onNavigateToRegister={() => setCurrentPage('register')} />;

      case 'admin-dashboard':
        return isAuthenticated ? <AdminDashboard /> : <LoginPage onSuccess={handleAuthSuccess} onNavigateToRegister={() => setCurrentPage('register')} />;

      case 'home':
      default:
        return (
          <div className="space-y-6">
            <HomePage />
            {!isAuthenticated && (
              <div className="p-8 rounded-2xl bg-white border border-[#E7DFD1] text-center max-w-xl mx-auto shadow-sm">
                <h3 className="font-serif text-2xl font-bold text-[#2B2118] mb-2">
                  Ready to experience TiffinHub?
                </h3>
                <p className="text-sm text-[#2B2118]/70 mb-5">
                  Sign in or create your role-based account to explore meal subscriptions and kitchen sheets.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentPage('register')}
                    className="inline-flex items-center justify-center rounded-lg text-sm font-medium bg-[#C2410C] text-white hover:bg-[#9A3412] h-10 py-2 px-5 shadow-sm cursor-pointer"
                  >
                    Create Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage('login')}
                    className="inline-flex items-center justify-center rounded-lg text-sm font-medium border border-[#E7DFD1] bg-white text-[#2B2118] hover:bg-[#FAF6EF] h-10 py-2 px-5 shadow-sm cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <RootLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </RootLayout>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainRouter />
    </AuthProvider>
  );
}

export default App;
