import type { User } from './user';

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

  clearState: () => void;
  signUp: (
    username: string,
    email: string,
    password: string,
    language?: string,
    theme?: string
  ) => Promise<{ success: boolean; banned?: boolean; details?: any }>;
  signIn: (
    identifier: string,
    password: string
  ) => Promise<{
    success: boolean;
    banned?: boolean;
    details?: { reason: string; expiry: string | null };
  }>;
  signOut: () => Promise<void>;
  fetchMe: (silent?: boolean) => Promise<void>;
  refresh: (silent?: boolean) => Promise<void>;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: User | null) => void;
}
