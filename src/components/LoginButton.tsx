import React from 'react';
import { LogIn, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const LoginButton: React.FC = () => {
  const { user, signInWithGoogle, logout } = useAuthStore();

  if (user) {
    return (
      <button
        onClick={logout}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    );
  }

  return (
    <button
      onClick={signInWithGoogle}
      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      <LogIn className="w-5 h-5" />
      <span>Login with Google</span>
    </button>
  );
};