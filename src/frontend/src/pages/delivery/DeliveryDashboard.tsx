import React, { useState } from 'react';
import { Bike, MapPin, CheckCircle2, Clock, Power, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../context/AuthContext';

export const DeliveryDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isOnDuty, setIsOnDuty] = useState(false);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Rider Header & Duty Toggle */}
      <div className="bg-white rounded-2xl p-6 border border-[#E7DFD1] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant={isOnDuty ? 'success' : 'outline'}>
              {isOnDuty ? 'On Duty — Ready for Routes' : 'Off Duty'}
            </Badge>
            <span className="text-xs text-[#2B2118]/60 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2F6B3F]" />
              Rider ID: {user?.id.slice(0, 8)}...
            </span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#2B2118]">
            Rider Console: {user?.name || 'Partner'}
          </h1>
          <p className="text-xs text-[#2B2118]/70 mt-1">
            Toggle your shift duty status to receive daily pickup assignments.
          </p>
        </div>

        <Button
          onClick={() => setIsOnDuty(!isOnDuty)}
          variant={isOnDuty ? 'default' : 'outline'}
          className={`gap-2 ${isOnDuty ? 'bg-[#2F6B3F] hover:bg-[#235230]' : ''}`}
        >
          <Power className="w-4 h-4" />
          <span>{isOnDuty ? 'Go Off Duty' : 'Go On Duty'}</span>
        </Button>
      </div>

      {/* Route Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2B2118]/60 block mb-1">
            Completed
          </span>
          <div className="text-2xl font-bold text-[#2F6B3F] font-mono">0</div>
        </Card>

        <Card className="text-center p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2B2118]/60 block mb-1">
            Remaining
          </span>
          <div className="text-2xl font-bold text-[#C2410C] font-mono">0</div>
        </Card>

        <Card className="text-center p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2B2118]/60 block mb-1">
            Failed / Return
          </span>
          <div className="text-2xl font-bold text-[#2B2118]/60 font-mono">0</div>
        </Card>
      </div>

      {/* Assigned Route Stops */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-serif">Today's Assigned Route</CardTitle>
            <Badge variant="outline">0 Stops</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#FAF6EF] text-[#2B2118]/40 flex items-center justify-center mx-auto">
              <Bike className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-[#2B2118]">No delivery stops currently assigned</p>
            <p className="text-xs text-[#2B2118]/60 max-w-sm mx-auto">
              Once vendors prepare meals, your delivery stops will appear here ordered by area with tap-to-call.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
