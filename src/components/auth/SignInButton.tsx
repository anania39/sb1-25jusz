import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { LogIn } from 'lucide-react';

export const SignInButton: React.FC = () => {
  const { signInWithGoogle, isLoading, error, clearError, checkAuthResult } = useAuthStore();

  useEffect(() => {
    checkAuthResult();
  }, [checkAuthResult]);

  const handleSignIn = async () => {
    try {
      clearError();
      await signInWithGoogle();
    } catch (err) {
      console.error('Sign in error:', err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleSignIn}
        disabled={isLoading}
        className="flex items-center gap-2 px-6 py-3 bg-white text-gray-800 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
        ) : (
          <LogIn className="w-5 h-5" />
        )}
        <span className="font-medium">
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </span>
      </button>
      {error && (
        <div 
          className="px-4 py-2 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between"
          role="alert"
        >
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={clearError}
            className="ml-3 text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};