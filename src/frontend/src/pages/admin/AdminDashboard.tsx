import React from 'react';
import { ShieldAlert, Users, Store, Percent, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Hero */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E7DFD1] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="default" className="bg-[#2B2118] text-white border-none">
              Super Admin Control Center
            </Badge>
            <span className="text-xs text-[#2B2118]/60 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-[#C2410C]" />
              Platform Owner
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#2B2118]">
            Platform Overview: {user?.name || 'Admin'}
          </h1>
          <p className="text-sm text-[#2B2118]/70 mt-1">
            Oversee vendor verification, commission policies, user roles, and platform audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="default" className="gap-2 bg-[#C2410C] hover:bg-[#9A3412]">
            <Store className="w-4 h-4" />
            <span>Review Vendor Queue</span>
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2B2118]/60">
              Pending Approvals
            </span>
            <CardTitle className="text-3xl text-[#C2410C]">0</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-[#2B2118]/70">
            Home chefs waiting for FSSAI verification
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2B2118]/60">
              Total Users
            </span>
            <CardTitle className="text-3xl">1</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-[#2B2118]/70">
            Active accounts across all 4 roles
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2B2118]/60">
              Platform Commission
            </span>
            <CardTitle className="text-3xl font-mono text-[#2F6B3F]">10.00%</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-[#2B2118]/70">
            PlatformSettings table singleton
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2B2118]/60">
              Nightly Hangfire Job
            </span>
            <CardTitle className="text-lg font-mono text-[#2F6B3F] flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>9:00 PM IST</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-[#2B2118]/70">
            Cron: <code className="bg-[#FAF6EF] px-1 py-0.5 rounded text-[11px]">30 15 * * * UTC</code>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
