import React from 'react';
import { ChefHat, ClipboardList, Users, ShieldAlert, ArrowRight, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../context/AuthContext';

export const VendorDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Hero */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E7DFD1] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="default" className="bg-[#2F6B3F]/10 text-[#2F6B3F] border-[#2F6B3F]/20">
              Vendor Kitchen Workspace
            </Badge>
            <span className="text-xs text-[#2B2118]/60 flex items-center gap-1">
              <ChefHat className="w-3.5 h-3.5 text-[#2F6B3F]" />
              Role Verified: Vendor Chef
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#2B2118]">
            Kitchen Console: {user?.name || 'Chef'}
          </h1>
          <p className="text-sm text-[#2B2118]/70 mt-1">
            Manage your kitchen profile, menu planner, subscriber list, and tomorrow's cooking sheet.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="default" className="gap-2 bg-[#2F6B3F] hover:bg-[#235230]">
            <ClipboardList className="w-4 h-4" />
            <span>Tomorrow's Kitchen Sheet</span>
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2B2118]/60">
                Onboarding Status
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#E9A23B]/10 text-[#B45309] flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-serif text-[#B45309]">Pending Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[#2B2118]/70 mb-3">
              Complete your kitchen address, FSSAI document upload, and cutoff timings.
            </p>
            <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
              <span>Complete Kitchen Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2B2118]/60">
                Active Subscribers
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#C2410C]/10 text-[#C2410C] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[#2B2118]/70 mb-3">
              Customers in your delivery areas will appear here once approved.
            </p>
            <Button variant="outline" size="sm" className="w-full text-xs">
              View Subscriber List
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2B2118]/60">
                Dishes Catalog
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#2F6B3F]/10 text-[#2F6B3F] flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[#2B2118]/70 mb-3">
              Add rotis, subzis, dals, and diet tags to create weekly menus.
            </p>
            <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
              <span>Open Dish Library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
