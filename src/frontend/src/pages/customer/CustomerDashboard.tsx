import React from 'react';
import { Utensils, Wallet, Calendar, ShieldCheck, ArrowUpRight, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../context/AuthContext';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Hero */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E7DFD1] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="default">Customer Workspace</Badge>
            <span className="text-xs text-[#2B2118]/60 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2F6B3F]" />
              Role Verified: Customer
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#2B2118]">
            Welcome back, {user?.name || 'Customer'}!
          </h1>
          <p className="text-sm text-[#2B2118]/70 mt-1">
            Manage your tiffin subscriptions, upcoming meals, and wallet credits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="default" className="gap-2">
            <Utensils className="w-4 h-4" />
            <span>Discover Kitchens</span>
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2B2118]/60">
                Wallet Balance
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#2F6B3F]/10 text-[#2F6B3F] flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <CardTitle className="text-3xl font-mono text-[#2F6B3F]">₹0.00</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[#2B2118]/70 mb-3">
              Automated credits for meal skips and refunds are credited here.
            </p>
            <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
              <span>Top-up Wallet (Razorpay)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2B2118]/60">
                Active Subscriptions
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#C2410C]/10 text-[#C2410C] flex items-center justify-center">
                <Utensils className="w-4 h-4" />
              </div>
            </div>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[#2B2118]/70 mb-3">
              You do not have an active tiffin subscription yet.
            </p>
            <Button variant="outline" size="sm" className="w-full text-xs">
              Browse Weekly & Monthly Plans
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2B2118]/60">
                Today's Meal Status
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#E9A23B]/10 text-[#B45309] flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <CardTitle className="text-xl font-serif">No deliveries today</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[#2B2118]/70 mb-3">
              Subscribe to a plan to receive morning and evening home-cooked meals.
            </p>
            <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>Open Meal Calendar</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Role Security Note */}
      <div className="p-4 rounded-xl border border-[#E7DFD1] bg-white flex items-center gap-3 text-xs text-[#2B2118]/70">
        <ShieldCheck className="w-5 h-5 text-[#2F6B3F] shrink-0" />
        <span>
          <strong>Role-Based Access Verified:</strong> Your session is secured with JWT claims bound to Customer ID{' '}
          <code className="bg-[#FAF6EF] px-1.5 py-0.5 rounded text-[#2B2118] font-mono">{user?.id}</code>.
        </span>
      </div>
    </div>
  );
};
