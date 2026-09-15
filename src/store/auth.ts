import { create } from 'zustand';
import api from '@/lib/api';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string, remember?: boolean) => Promise<string>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<User | null>;
  signup: (data: Record<string, unknown>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user, loading: false }),

  login: async (email, password, remember = false) => {
    const { data } = await api.post('/auth/login', { email, password, remember_me: remember });
    set({ user: data.user, loading: false });
    return data.redirect;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      set({ user: null, loading: false });
    }
  },

  fetchUser: async () => {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.user, loading: false });
      return data.user;
    } catch {
      set({ user: null, loading: false });
      return null;
    }
  },

  signup: async (formData) => {
    await api.post('/auth/signup', formData);
  },
}));
