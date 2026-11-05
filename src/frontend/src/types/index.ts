export type Role = 'Admin' | 'Vendor' | 'Customer' | 'DeliveryPartner';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  photoUrl?: string;
  role: Role;
  isActive: boolean;
  createdAtUtc: string;
}

export interface HealthStatus {
  status: string;
  service: string;
  version: string;
  environment: string;
  utcTime: string;
  istTime: string;
  timezone: string;
}

export interface PlatformSettings {
  commissionPercent: number;
  defaultLunchDinnerCutoffHour: number;
  defaultBreakfastCutoffHour: number;
  pauseExtendsEndDate: boolean;
}
