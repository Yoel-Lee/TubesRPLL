import { create } from 'zustand';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (userData) => set({ user: userData, isAuthenticated: true }),

  logout: () => set({ user: null, isAuthenticated: false }),
}));