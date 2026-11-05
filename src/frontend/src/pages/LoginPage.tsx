import React, { useState } from 'react';
import { Lock, LogIn, AlertCircle, Loader2, User, ChefHat, Bike, ShieldAlert, KeyRound, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext';
import { forgotPasswordApi, resetPasswordApi } from '../api/client';
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

  // Forgot password flow state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [tokenGenerated, setTokenGenerated] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);

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

  const handleRequestResetToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMessage(null);
    setError(null);
    setForgotLoading(true);

    try {
      const res = await forgotPasswordApi(forgotEmail.trim());
      setForgotMessage(res.message);
      if (res.demoResetToken) {
        setResetToken(res.demoResetToken);
        setTokenGenerated(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request reset token.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleExecuteResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMessage(null);
    setError(null);
    setForgotLoading(true);

    try {
      const res = await resetPasswordApi({
        email: forgotEmail.trim(),
        token: resetToken.trim(),
        newPassword,
      });

      setForgotMessage(res.message);
      setTimeout(() => {
        setShowForgot(false);
        setPassword('');
        setEmail(forgotEmail);
        setTokenGenerated(false);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-6 sm:py-12">
      <Card className="shadow-md border-[#E7DFD1]">
        <CardHeader className="text-center pb-6">
          <div className="w-12 h-12 rounded-xl bg-[#C2410C]/10 text-[#C2410C] flex items-center justify-center mx-auto mb-3">
            {showForgot ? <KeyRound className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <CardTitle className="text-2xl font-serif">
            {showForgot ? 'Reset Password' : 'Welcome Back to TiffinHub'}
          </CardTitle>
          <CardDescription>
            {showForgot
              ? 'Request a security token to reset your account password.'
              : 'Enter your credentials to access your dashboard.'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {showForgot ? (
            /* Forgot Password Form */
            <div className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {forgotMessage && (
                <div className="p-3.5 rounded-lg bg-[#2F6B3F]/10 border border-[#2F6B3F]/20 text-[#2F6B3F] text-sm flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{forgotMessage}</span>
                </div>
              )}

              {!tokenGenerated ? (
                <form onSubmit={handleRequestResetToken} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="forgotEmail">Registered Email Address</Label>
                    <Input
                      id="forgotEmail"
                      type="email"
                      placeholder="name@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={forgotLoading} className="w-full h-10 gap-2">
                    {forgotLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                    <span>Request Reset Token</span>
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleExecuteResetPassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="resetToken">Security Reset Token</Label>
                    <Input
                      id="resetToken"
                      type="text"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="newPassword">New Password (Min 6 chars)</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={forgotLoading} className="w-full h-10 gap-2">
                    {forgotLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    <span>Confirm Password Reset</span>
                  </Button>
                </form>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowForgot(false);
                  setError(null);
                  setForgotMessage(null);
                }}
                className="w-full text-center text-xs text-[#2B2118]/70 hover:text-[#C2410C] flex items-center justify-center gap-1.5 pt-2 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </div>
          ) : (
            /* Regular Login Form */
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
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgot(true);
                      setForgotEmail(email);
                      setError(null);
                    }}
                    className="text-xs text-[#C2410C] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
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
          )}

          {/* Quick Demo Credentials */}
          {!showForgot && (
            <div className="mt-8 pt-6 border-t border-[#E7DFD1]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2B2118]/60 block mb-3 text-center">
                Instant Demo Logins (Auto-Seeded)
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleDemoFill('customer@tiffinhub.com', 'Pass@123')}
                  className="p-2.5 rounded-lg border border-[#E7DFD1] hover:bg-[#FAF6EF] flex items-center gap-2 text-left cursor-pointer transition-colors"
                >
                  <User className="w-4 h-4 text-[#C2410C] shrink-0" />
                  <div>
                    <div className="font-semibold text-[#2B2118]">Customer</div>
                    <div className="text-[10px] text-[#2B2118]/50">Rahul Sharma</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoFill('vendor@tiffinhub.com', 'Pass@123')}
                  className="p-2.5 rounded-lg border border-[#E7DFD1] hover:bg-[#FAF6EF] flex items-center gap-2 text-left cursor-pointer transition-colors"
                >
                  <ChefHat className="w-4 h-4 text-[#2F6B3F] shrink-0" />
                  <div>
                    <div className="font-semibold text-[#2B2118]">Vendor Chef</div>
                    <div className="text-[10px] text-[#2B2118]/50">Anand Kitchen</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoFill('rider@tiffinhub.com', 'Pass@123')}
                  className="p-2.5 rounded-lg border border-[#E7DFD1] hover:bg-[#FAF6EF] flex items-center gap-2 text-left cursor-pointer transition-colors"
                >
                  <Bike className="w-4 h-4 text-[#E9A23B] shrink-0" />
                  <div>
                    <div className="font-semibold text-[#2B2118]">Rider Partner</div>
                    <div className="text-[10px] text-[#2B2118]/50">Vikram Rider</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoFill('admin@tiffinhub.com', 'Admin@123')}
                  className="p-2.5 rounded-lg border border-[#E7DFD1] hover:bg-[#FAF6EF] flex items-center gap-2 text-left cursor-pointer transition-colors"
                >
                  <ShieldAlert className="w-4 h-4 text-[#2B2118] shrink-0" />
                  <div>
                    <div className="font-semibold text-[#2B2118]">Platform Admin</div>
                    <div className="text-[10px] text-[#2B2118]/50">Platform Owner</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {!showForgot && (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};
