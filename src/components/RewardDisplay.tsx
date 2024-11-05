import React from 'react';
import { Trophy } from 'lucide-react';

interface RewardDisplayProps {
  reward: string;
  visible: boolean;
}

export const RewardDisplay: React.FC<RewardDisplayProps> = ({ reward, visible }) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg">
      <div className="text-center">
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Congratulations!</h3>
        <p className="text-3xl font-bold text-blue-600">{reward}</p>
      </div>
    </div>
  );
};