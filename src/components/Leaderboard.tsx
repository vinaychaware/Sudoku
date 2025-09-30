import React, { useEffect, useState } from 'react';
import { X, Trophy, Medal } from 'lucide-react';
import type { LeaderboardEntry } from '../types/sudoku';

interface LeaderboardProps {
  onClose: () => void;
}

export function Leaderboard({ onClose }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const storedEntries = localStorage.getItem('leaderboard');
    if (storedEntries) {
      try {
        const parsed = JSON.parse(storedEntries);
        setEntries(parsed.sort((a: LeaderboardEntry, b: LeaderboardEntry) => a.time - b.time).slice(0, 10));
      } catch {
        setEntries([]);
      }
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="text-yellow-500" size={20} />;
    if (index === 1) return <Medal className="text-gray-400" size={20} />;
    if (index === 2) return <Medal className="text-orange-600" size={20} />;
    return <span className="text-gray-500 font-bold">{index + 1}</span>;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full border-2 border-gray-200 dark:border-gray-700 overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy size={32} />
              <h2 className="text-2xl font-bold">Leaderboard</h2>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="mx-auto mb-4 text-gray-300 dark:text-gray-700" size={64} />
              <p className="text-gray-500 dark:text-gray-400 text-lg">No entries yet</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                Complete a puzzle to appear on the leaderboard!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map((entry, index) => (
                <div
                  key={`${entry.name}-${entry.time}-${index}`}
                  className={`
                    flex items-center gap-4 p-4 rounded-lg transition-all duration-200
                    ${index === 0 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-2 border-yellow-400 dark:border-yellow-600' : ''}
                    ${index === 1 ? 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-2 border-gray-400 dark:border-gray-600' : ''}
                    ${index === 2 ? 'bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-2 border-orange-400 dark:border-orange-600' : ''}
                    ${index > 2 ? 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700' : ''}
                  `}
                >
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(index)}
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {entry.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {entry.difficulty.charAt(0).toUpperCase() + entry.difficulty.slice(1)} • {entry.date}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {formatTime(entry.time)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
