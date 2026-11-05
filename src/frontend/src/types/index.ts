export type Role = 'Admin' | 'Vendor' | 'Customer' | 'DeliveryPartner';

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresInMinutes: number;
  user: UserSummary;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: Role;
}

export interface LoginPayload {
  email: string;
  password: string;
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
