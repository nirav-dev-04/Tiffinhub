import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Activity, 
  Users, 
  Store, 
  Bike, 
  ShieldAlert, 
  RefreshCw, 
  Server
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { checkApiHealth } from '../api/client';
import { HealthStatus } from '../types';

export const HomePage: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await checkApiHealth();
      setHealth(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to connect to API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="bg-white rounded-2xl p-6 sm:p-10 border border-[#E7DFD1] shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <Badge variant="default" className="text-xs uppercase tracking-wider">
            Architecture Milestone 1 Complete
          </Badge>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#2B2118] leading-tight">
            Fresh Home-Cooked Tiffins, Delivered Reliably.
          </h1>
          <p className="text-base sm:text-lg text-[#2B2118]/80 leading-relaxed font-sans">
            One multi-role platform replacing notebooks and WhatsApp groups with automated skips,
            wallet refunds, demand forecasting, and daily kitchen management.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Button onClick={fetchHealth} disabled={loading} className="gap-2">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Verify API Connection</span>
            </Button>
            <a 
              href="http://localhost:8080/swagger" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-lg text-sm font-medium border border-[#E7DFD1] bg-white text-[#2B2118] hover:bg-[#FAF6EF] h-10 py-2 px-4 shadow-sm"
            >
              Open API Swagger Docs
            </a>
          </div>
        </div>
      </section>

      {/* Live System Health Diagnostic Card */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-[#E7DFD1] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E7DFD1]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2B2118]/60 flex items-center gap-1.5">
                <Server className="w-4 h-4 text-[#C2410C]" />
                Backend Engine
              </span>
              <Badge variant={health ? 'success' : 'warning'}>
                {health ? 'Healthy 200 OK' : 'Checking'}
              </Badge>
            </div>
            <div className="mt-4 space-y-2">
              <div className="text-2xl font-serif font-bold text-[#2B2118]">
                ASP.NET Core 10 Web API
              </div>
              <p className="text-xs text-[#2B2118]/70">
                Layered Clean Architecture (Domain, Application, Infrastructure, Api)
              </p>
            </div>
          </div>
          <div className="mt-6 pt-3 border-t border-[#E7DFD1] text-xs text-[#2B2118]/60 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2F6B3F]" />
            <span>Serilog + RFC 7807 Problem Details</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#E7DFD1] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E7DFD1]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2B2118]/60 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#2F6B3F]" />
                TimeZone Helper (IST)
              </span>
              <Badge variant="success">8/8 Tests Passing</Badge>
            </div>
            <div className="mt-4 space-y-1">
              <div className="text-xs text-[#2B2118]/60 uppercase tracking-wider">Current IST Time</div>
              <div className="text-xl font-mono font-semibold text-[#2F6B3F]">
                {health ? new Date(health.istTime).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'Synchronizing...'}
              </div>
              <div className="text-xs text-[#2B2118]/70 pt-1">
                Cross-platform converter tested against midnight & cutoff crossovers
              </div>
            </div>
          </div>
          <div className="mt-6 pt-3 border-t border-[#E7DFD1] text-xs text-[#2B2118]/60 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2F6B3F]" />
            <span>Hangfire Nightly 9:00 PM IST (30 15 * * * UTC)</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#E7DFD1] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E7DFD1]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2B2118]/60 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#E9A23B]" />
                Phase 1 Database State
              </span>
              <Badge variant="outline">Hosted PostgreSQL Ready</Badge>
            </div>
            <div className="mt-4 space-y-2">
              <div className="text-2xl font-serif font-bold text-[#2B2118]">
                3 Core Entities
              </div>
              <ul className="text-xs text-[#2B2118]/70 space-y-1">
                <li>• <strong>User</strong> (IdentityUser&lt;Guid&gt; with role claims)</li>
                <li>• <strong>RefreshToken</strong> (Unique TokenHash index)</li>
                <li>• <strong>PlatformSettings</strong> (PK=1 Singleton seed)</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 pt-3 border-t border-[#E7DFD1] text-xs text-[#2B2118]/60 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2F6B3F]" />
            <span>PostgreSQL with EF Core 9 LTS</span>
          </div>
        </div>
      </section>

      {/* Role Architecture Preview */}
      <section className="space-y-4">
        <div className="border-b border-[#E7DFD1] pb-3">
          <h2 className="font-serif text-2xl font-bold text-[#2B2118]">
            Multi-Role Platform Architecture
          </h2>
          <p className="text-sm text-[#2B2118]/70">
            One single codebase and database with strict JWT claim-based tenant isolation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-xl border border-[#E7DFD1] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#C2410C]/10 text-[#C2410C] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#2B2118]">Customer</h3>
            <p className="text-xs text-[#2B2118]/70 leading-relaxed">
              Find local home-chefs, prepaid subscriptions, one-tap skip before cutoff with wallet credits.
            </p>
            <Badge variant="outline" className="text-[10px]">Mobile-First</Badge>
          </div>

          <div className="p-5 bg-white rounded-xl border border-[#E7DFD1] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#2F6B3F]/10 text-[#2F6B3F] flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#2B2118]">Vendor</h3>
            <p className="text-xs text-[#2B2118]/70 leading-relaxed">
              Kitchen sheet generator, daily menus, plans, subscriber notes and Gemini AI demand forecasting.
            </p>
            <Badge variant="outline" className="text-[10px]">Desktop-First</Badge>
          </div>

          <div className="p-5 bg-white rounded-xl border border-[#E7DFD1] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#E9A23B]/10 text-[#B45309] flex items-center justify-center">
              <Bike className="w-4 h-4" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#2B2118]">Delivery Rider</h3>
            <p className="text-xs text-[#2B2118]/70 leading-relaxed">
              Area-grouped daily routes, tap-to-call, status updates with failure reason handling.
            </p>
            <Badge variant="outline" className="text-[10px]">Mobile PWA</Badge>
          </div>

          <div className="p-5 bg-white rounded-xl border border-[#E7DFD1] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#2B2118]/10 text-[#2B2118] flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#2B2118]">Platform Admin</h3>
            <p className="text-xs text-[#2B2118]/70 leading-relaxed">
              FSSAI license verification queue, commission control, user roles and complaint resolution.
            </p>
            <Badge variant="outline" className="text-[10px]">Admin Console</Badge>
          </div>
        </div>
      </section>
    </div>
  );
};
