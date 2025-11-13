import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '@/lib/api';
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
  // We'll add registerUser and loginUser actions in the next step
}

// Create the store
export const useAuthStore = create<AuthState & AuthActions>()(
  // persist middleware wraps our store definition
  persist(
    (set) => ({
      // --- Initial State ---
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

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
        localStorage.setItem('auth-token', token);
      },

      logout: () => {
        // Clear all auth state
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        // Remove token from local storage
        localStorage.removeItem('auth-token');
        toast.success('Logged out successfully');
      },
    }),
    {
      // Configuration for persistence
      name: 'auth-storage', // Name of the item in localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage
      // We only want to persist the 'user' and 'token'
      partialize: (state) => ({ user: state.user, token: state.token }),
      // Re-hydrate the state
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          set({ isAuthenticated: true });
          // Re-set token for the api interceptor on page load
          localStorage.setItem('auth-token', state.token);
        }
      },
    }
  )
);

// --- Custom Hooks for convenience ---

// Hook to get actions
export const useAuthActions = () => useAuthStore((state) => ({
  login: state.login,
  logout: state.logout,
  setLoading: state.setLoading,
}));

// Hook to get state
export const useAuthUser = () => useAuthStore((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
}));