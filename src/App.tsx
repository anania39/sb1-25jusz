import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ScratchCard } from './components/ScratchCard';
import { RewardDisplay } from './components/RewardDisplay';
import { SignInButton } from './components/auth/SignInButton';
import { UserMenu } from './components/auth/UserMenu';
import { AdminPanel } from './components/AdminPanel';
import { useAuthStore } from './store/authStore';

function App() {
  const { user, isAdmin, isLoading, checkAuthResult } = useAuthStore();
  const [isRevealed, setIsRevealed] = React.useState(false);
  const [reward] = React.useState('10% OFF');

  useEffect(() => {
    checkAuthResult();
  }, [checkAuthResult]);

  const handleReveal = (percentage: number) => {
    if (percentage > 50 && !isRevealed) {
      setIsRevealed(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <h1 className="text-xl font-bold">Scratch & Win</h1>
              {user ? <UserMenu /> : null}
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                        Daily Scratch Card
                      </h2>
                      
                      <div className="relative w-full aspect-video bg-gray-50 rounded-lg overflow-hidden">
                        <ScratchCard
                          width={400}
                          height={200}
                          onReveal={handleReveal}
                        />
                        <RewardDisplay
                          reward={reward}
                          visible={isRevealed}
                        />
                      </div>

                      <div className="mt-6 text-center text-sm text-gray-600">
                        Scratch the card to reveal your prize!
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-md mx-auto text-center">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                      <h2 className="text-2xl font-bold mb-6">Welcome to Scratch & Win!</h2>
                      <p className="text-gray-600 mb-8">Sign in to start playing and winning rewards.</p>
                      <SignInButton />
                    </div>
                  </div>
                )
              }
            />
            <Route
              path="/admin"
              element={
                isAdmin ? (
                  <AdminPanel />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;