import { create } from 'zustand';
import { auth, googleProvider } from '../lib/firebase';
import { 
  signInWithRedirect,
  signOut, 
  onAuthStateChanged, 
  User,
  getRedirectResult
} from 'firebase/auth';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuthResult: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  isLoading: true,
  error: null,
  signInWithGoogle: async () => {
    try {
      set({ isLoading: true, error: null });
      await signInWithRedirect(auth, googleProvider);
    } catch (error: any) {
      console.error('Error initiating sign in:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  checkAuthResult: async () => {
    try {
      set({ isLoading: true, error: null });
      const result = await getRedirectResult(auth);
      if (result) {
        set({
          user: result.user,
          isAdmin: result.user.email === 'admin@example.com',
          isLoading: false,
          error: null
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error: any) {
      console.error('Error checking auth result:', error);
      set({
        error: error.message,
        isLoading: false
      });
    }
  },
  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      await signOut(auth);
      set({ user: null, isAdmin: false, isLoading: false });
    } catch (error: any) {
      console.error('Error signing out:', error);
      set({
        error: error.message,
        isLoading: false
      });
    }
  },
  clearError: () => set({ error: null })
}));

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
  useAuthStore.setState({
    user,
    isAdmin: user?.email === 'admin@example.com',
    isLoading: false
  });
});