import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../lib/api';
import toast from 'react-hot-toast';

// Define the shape of our User object
interface User {
  _id: string;
  email: string;
  credits: number;
  referralCode: string;
}

// Define the shape of our store's state
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Define the actions available to update the state
interface AuthActions {
  login: (userData: User, token: string) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
  updateUser: (userData: Partial<User>) => void;
}

// Initial state for SSR
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
};

// Create the store
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // --- Initial State ---
      ...initialState,

      // --- Actions ---
      setLoading: (isLoading) => set({ isLoading }),

      login: (userData, token) => {
        // When logging in, set the user, token, and auth status
        set({
          user: userData,
          token: token,
          isAuthenticated: true,
          isLoading: false,
        });
        // Set token for our api interceptor
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', token);
        }
      },

      logout: () => {
        // Clear all auth state
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        // Remove token from local storage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-token');
        }
        toast.success('Logged out successfully');
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },
    }),
    {
      // Configuration for persistence
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token && typeof window !== 'undefined') {
          localStorage.setItem('auth-token', state.token);
        }
      },
      skipHydration: false,
    }
  )
);