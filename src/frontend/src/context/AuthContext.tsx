import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthResponse, LoginPayload, RegisterPayload, Role, UserSummary } from '../types';
import { loginApi, registerApi, refreshTokenApi } from '../api/client';

interface AuthContextType {
  user: UserSummary | null;
  token: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<AuthResponse>;
  register: (payload: RegisterPayload) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore stored session on startup
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('tiffinhub_user');
      const savedToken = localStorage.getItem('tiffinhub_access_token');
      const savedRefresh = localStorage.getItem('tiffinhub_refresh_token');

      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
        setRefreshToken(savedRefresh);
      }
    } catch {
      localStorage.removeItem('tiffinhub_user');
      localStorage.removeItem('tiffinhub_access_token');
      localStorage.removeItem('tiffinhub_refresh_token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSession = (auth: AuthResponse) => {
    setUser(auth.user);
    setToken(auth.accessToken);
    setRefreshToken(auth.refreshToken);

    localStorage.setItem('tiffinhub_user', JSON.stringify(auth.user));
    localStorage.setItem('tiffinhub_access_token', auth.accessToken);
    localStorage.setItem('tiffinhub_refresh_token', auth.refreshToken);
  };

  const login = async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await loginApi(payload);
    saveSession(res);
    return res;
  };

  const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await registerApi(payload);
    saveSession(res);
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);

    localStorage.removeItem('tiffinhub_user');
    localStorage.removeItem('tiffinhub_access_token');
    localStorage.removeItem('tiffinhub_refresh_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
