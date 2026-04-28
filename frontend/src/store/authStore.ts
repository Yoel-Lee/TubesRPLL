import { create } from 'zustand';

// tipe data User
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff';
}

// tipe data untuk state autentikasi
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

// Membuat Global Store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  // fungsi login
  login: (userData) => set({ user: userData, isAuthenticated: true }),

  // fungsi logout
  logout: () => set({ user: null, isAuthenticated: false }),
}));