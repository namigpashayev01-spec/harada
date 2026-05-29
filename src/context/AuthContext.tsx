'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import apiClient from '@/api';
import authService, {
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from '@/services/auth.service';
import userService from '@/services/user.service';
import { authStorage } from '@/lib/authStorage';

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
};

const AuthContext = createContext<AuthState | null>(null);

const WRAPPER_KEYS = ['data', 'result', 'original', 'authorisation', 'authorization', 'auth'];

const looksLikeUser = (o: Record<string, unknown>) =>
  ('email' in o && typeof o.email === 'string') ||
  ('name' in o && 'id' in o);

const pickUser = (obj: unknown, depth = 0): AuthUser | undefined => {
  if (!obj || typeof obj !== 'object' || depth > 3) return undefined;
  const o = obj as Record<string, unknown>;
  if (o.user && typeof o.user === 'object') return o.user as AuthUser;
  if (looksLikeUser(o)) return o as unknown as AuthUser;
  for (const key of WRAPPER_KEYS) {
    if (o[key] && typeof o[key] === 'object') {
      const found = pickUser(o[key], depth + 1);
      if (found) return found;
    }
  }
  return undefined;
};

const pickToken = (
  obj: unknown,
  keys: string[],
  depth = 0,
): string | undefined => {
  if (!obj || typeof obj !== 'object' || depth > 3) return undefined;
  const o = obj as Record<string, unknown>;
  for (const k of keys) {
    const v = o[k];
    if (typeof v === 'string' && v) return v;
  }
  for (const wrapper of WRAPPER_KEYS) {
    if (o[wrapper] && typeof o[wrapper] === 'object') {
      const found = pickToken(o[wrapper], keys, depth + 1);
      if (found) return found;
    }
  }
  return undefined;
};

const extractTokens = (res: AuthResponse) => {
  const access = pickToken(res, ['access_token', 'token', 'accessToken']);
  const refresh = pickToken(res, ['refresh_token', 'refreshToken']);
  const user = pickUser(res);
  return { access, refresh, user };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const langRef = useRef('en');

  useEffect(() => {
    const seg = pathname?.split('/')[1];
    if (seg) langRef.current = seg;
  }, [pathname]);

  const refreshUser = useCallback(async () => {
    if (!authStorage.getAccessToken()) {
      setUser(null);
      return;
    }
    try {
      const res = await userService.getProfile();
      const profile = pickUser(res) ?? null;
      setUser(profile);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await refreshUser();
      setIsInitializing(false);
    })();
  }, [refreshUser]);

  useEffect(() => {
    apiClient.setAuthFailedHandler(() => {
      setUser(null);
      const lang = langRef.current || 'en';
      router.push(`/${lang}/login`);
    });
    return () => apiClient.setAuthFailedHandler(null);
  }, [router]);

  const login = useCallback<AuthState['login']>(
    async (payload) => {
      const res = await authService.login(payload);
      const { access, refresh, user: returnedUser } = extractTokens(res);
      if (!access) throw new Error('Login failed: no access token returned');
      authStorage.setTokens(access, refresh);
      if (returnedUser) {
        setUser(returnedUser);
      } else {
        await refreshUser();
      }
    },
    [refreshUser],
  );

  const register = useCallback<AuthState['register']>(
    async (payload) => {
      const res = await authService.register(payload);
      const { access, refresh, user: returnedUser } = extractTokens(res);
      if (access) {
        authStorage.setTokens(access, refresh);
        if (returnedUser) {
          setUser(returnedUser);
        } else {
          await refreshUser();
        }
      }
    },
    [refreshUser],
  );

  const logout = useCallback<AuthState['logout']>(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore — clear local state regardless
    }
    authStorage.clear();
    setUser(null);
    const lang = langRef.current || 'en';
    router.push(`/${lang}/login`);
  }, [router]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      isAuthenticated: !!user,
      isInitializing,
      login,
      register,
      logout,
      refreshUser,
      setUser,
    }),
    [user, isInitializing, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
