import React from 'react';
import { LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';

export const UserMenu: React.FC = () => {
  const { user, isAdmin, logout } = useAuthStore();

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {user.photoURL && (
          <img 
            src={user.photoURL} 
            alt={user.displayName || 'User'} 
            className="w-8 h-8 rounded-full"
          />
        )}
        <span className="text-sm font-medium">{user.displayName}</span>
      </div>
      
      {isAdmin && (
        <Link 
          to="/admin"
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
        >
          <Settings className="w-4 h-4" />
          <span>Admin</span>
        </Link>
      )}
      
      <button
        onClick={logout}
        className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign out</span>
      </button>
    </div>
  );
};