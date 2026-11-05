import React, { useState } from 'react';
import { Utensils, ChefHat, Bike, ArrowRight, AlertCircle, Loader2, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

interface RegisterPageProps {
  onSuccess: (role: Role) => void;
  onNavigateToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSuccess, onNavigateToLogin }) => {
  const { register } = useAuth();

  const [selectedRole, setSelectedRole] = useState<Role>('Customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }

    if (!email.trim()) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const auth = await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
        role: selectedRole,
      });

      onSuccess(auth.user.role);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-8">
      <Card className="shadow-md border-[#E7DFD1]">
        <CardHeader className="text-center pb-6">
          <div className="w-12 h-12 rounded-xl bg-[#C2410C]/10 text-[#C2410C] flex items-center justify-center mx-auto mb-3">
            <Utensils className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-serif">Create Your TiffinHub Account</CardTitle>
          <CardDescription>
            Join the platform connecting local home kitchens with daily tiffin subscribers.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Role Selection Cards */}
            <div className="space-y-2">
              <Label>Select Account Type</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {/* Customer Role */}
                <button
                  type="button"
                  onClick={() => setSelectedRole('Customer')}
                  className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                    selectedRole === 'Customer'
                      ? 'border-[#C2410C] bg-[#FAF6EF] ring-1 ring-[#C2410C]'
                      : 'border-[#E7DFD1] bg-white hover:bg-[#FAF6EF]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-9 h-9 rounded-lg bg-[#C2410C]/10 text-[#C2410C] flex items-center justify-center">
                      <Utensils className="w-5 h-5" />
                    </div>
                    {selectedRole === 'Customer' && (
                      <div className="w-5 h-5 rounded-full bg-[#C2410C] text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#2B2118]">Customer</h4>
                    <p className="text-xs text-[#2B2118]/70 mt-1">
                      Subscribe to healthy home-cooked meals with auto-refund skips.
                    </p>
                  </div>
                </button>

                {/* Vendor Role */}
                <button
                  type="button"
                  onClick={() => setSelectedRole('Vendor')}
                  className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                    selectedRole === 'Vendor'
                      ? 'border-[#2F6B3F] bg-[#FAF6EF] ring-1 ring-[#2F6B3F]'
                      : 'border-[#E7DFD1] bg-white hover:bg-[#FAF6EF]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-9 h-9 rounded-lg bg-[#2F6B3F]/10 text-[#2F6B3F] flex items-center justify-center">
                      <ChefHat className="w-5 h-5" />
                    </div>
                    {selectedRole === 'Vendor' && (
                      <div className="w-5 h-5 rounded-full bg-[#2F6B3F] text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#2B2118]">Vendor Chef</h4>
                    <p className="text-xs text-[#2B2118]/70 mt-1">
                      Manage kitchen menus, subscriber lists, and cooking forecast.
                    </p>
                  </div>
                </button>

                {/* Delivery Partner Role */}
                <button
                  type="button"
                  onClick={() => setSelectedRole('DeliveryPartner')}
                  className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                    selectedRole === 'DeliveryPartner'
                      ? 'border-[#E9A23B] bg-[#FAF6EF] ring-1 ring-[#E9A23B]'
                      : 'border-[#E7DFD1] bg-white hover:bg-[#FAF6EF]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-9 h-9 rounded-lg bg-[#E9A23B]/10 text-[#B45309] flex items-center justify-center">
                      <Bike className="w-5 h-5" />
                    </div>
                    {selectedRole === 'DeliveryPartner' && (
                      <div className="w-5 h-5 rounded-full bg-[#E9A23B] text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#2B2118]">Delivery Partner</h4>
                    <p className="text-xs text-[#2B2118]/70 mt-1">
                      Complete area-grouped delivery routes on duty.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g. Nirav Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 text-base gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create {selectedRole} Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[#2B2118]/70 border-t border-[#E7DFD1] pt-4">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="text-[#C2410C] font-semibold hover:underline cursor-pointer"
            >
              Sign In here
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
