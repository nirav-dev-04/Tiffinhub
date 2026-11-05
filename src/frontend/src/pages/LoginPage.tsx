import React, { useState } from 'react';
import { Lock, LogIn, AlertCircle, Loader2, User, ChefHat, Bike, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

interface LoginPageProps {
  onSuccess: (role: Role) => void;
  onNavigateToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onNavigateToRegister }) => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);

    try {
      const auth = await login({ email: email.trim(), password });
      onSuccess(auth.user.role);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto py-6 sm:py-12">
      <Card className="shadow-md border-[#E7DFD1]">
        <CardHeader className="text-center pb-6">
          <div className="w-12 h-12 rounded-xl bg-[#C2410C]/10 text-[#C2410C] flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-serif">Welcome Back to TiffinHub</CardTitle>
          <CardDescription>
            Enter your credentials to access your dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 text-base gap-2 mt-2">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </Button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-[#E7DFD1]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2B2118]/60 block mb-3 text-center">
              Quick Role Test Fill (Demo)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemoFill('customer@tiffinhub.com', 'Pass@123')}
                className="p-2 rounded-lg border border-[#E7DFD1] hover:bg-[#FAF6EF] flex items-center gap-1.5 text-left cursor-pointer transition-colors"
              >
                <User className="w-3.5 h-3.5 text-[#C2410C]" />
                <span className="truncate">Customer</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('vendor@tiffinhub.com', 'Pass@123')}
                className="p-2 rounded-lg border border-[#E7DFD1] hover:bg-[#FAF6EF] flex items-center gap-1.5 text-left cursor-pointer transition-colors"
              >
                <ChefHat className="w-3.5 h-3.5 text-[#2F6B3F]" />
                <span className="truncate">Vendor Chef</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('rider@tiffinhub.com', 'Pass@123')}
                className="p-2 rounded-lg border border-[#E7DFD1] hover:bg-[#FAF6EF] flex items-center gap-1.5 text-left cursor-pointer transition-colors"
              >
                <Bike className="w-3.5 h-3.5 text-[#E9A23B]" />
                <span className="truncate">Delivery Rider</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('admin@tiffinhub.com', 'Admin@123')}
                className="p-2 rounded-lg border border-[#E7DFD1] hover:bg-[#FAF6EF] flex items-center gap-1.5 text-left cursor-pointer transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#2B2118]" />
                <span className="truncate">Platform Admin</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-[#2B2118]/70 border-t border-[#E7DFD1] pt-4">
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="text-[#C2410C] font-semibold hover:underline cursor-pointer"
            >
              Sign Up here
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
