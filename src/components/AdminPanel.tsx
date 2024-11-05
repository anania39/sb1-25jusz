import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Plus, Trash2 } from 'lucide-react';

interface Reward {
  id: string;
  type: string;
  value: string;
  probability: number;
}

export const AdminPanel: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [newReward, setNewReward] = useState({
    type: '',
    value: '',
    probability: 0,
  });

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    const querySnapshot = await getDocs(collection(db, 'rewards'));
    const rewardsList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Reward[];
    setRewards(rewardsList);
  };

  const addReward = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'rewards'), newReward);
      setNewReward({ type: '', value: '', probability: 0 });
      loadRewards();
    } catch (error) {
      console.error('Error adding reward:', error);
    }
  };

  const deleteReward = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'rewards', id));
      loadRewards();
    } catch (error) {
      console.error('Error deleting reward:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Reward Management</h2>
      
      <form onSubmit={addReward} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Type (e.g., discount)"
            value={newReward.type}
            onChange={(e) => setNewReward({ ...newReward, type: e.target.value })}
            className="border rounded-lg px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Value (e.g., 10% OFF)"
            value={newReward.value}
            onChange={(e) => setNewReward({ ...newReward, value: e.target.value })}
            className="border rounded-lg px-3 py-2"
            required
          />
          <input
            type="number"
            placeholder="Probability (0-100)"
            value={newReward.probability}
            onChange={(e) => setNewReward({ ...newReward, probability: Number(e.target.value) })}
            className="border rounded-lg px-3 py-2"
            required
            min="0"
            max="100"
          />
        </div>
        <button
          type="submit"
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          <Plus className="w-5 h-5" />
          Add Reward
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Type</th>
              <th className="text-left py-2">Value</th>
              <th className="text-left py-2">Probability</th>
              <th className="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rewards.map((reward) => (
              <tr key={reward.id} className="border-b">
                <td className="py-2">{reward.type}</td>
                <td className="py-2">{reward.value}</td>
                <td className="py-2">{reward.probability}%</td>
                <td className="py-2">
                  <button
                    onClick={() => deleteReward(reward.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};