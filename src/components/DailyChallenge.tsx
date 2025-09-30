import React, { useEffect, useState } from 'react';
import { X, Calendar, Clock, Trophy } from 'lucide-react';
import type { Difficulty } from '../types/sudoku';

interface DailyChallengeProps {
  onClose: () => void;
  onStartChallenge: (difficulty: Difficulty) => void;
}

export function DailyChallenge({ onClose, onStartChallenge }: DailyChallengeProps) {
  const [hasCompletedToday, setHasCompletedToday] = useState(false);
  const [todaysBestTime, setTodaysBestTime] = useState<number | null>(null);

  useEffect(() => {
    const today = new Date().toDateString();
    const completed = localStorage.getItem(`daily_completed_${today}`);
    const bestTime = localStorage.getItem(`daily_best_time_${today}`);

    setHasCompletedToday(!!completed);
    setTodaysBestTime(bestTime ? parseInt(bestTime) : null);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleStart = () => {
    const today = new Date().toDateString();
    const seed = today;
    localStorage.setItem('daily_challenge_date', today);
    onStartChallenge('hard');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full border-2 border-gray-200 dark:border-gray-700 overflow-hidden animate-scale-in">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Calendar size={32} />
              <h2 className="text-2xl font-bold">Daily Challenge</h2>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-blue-100 text-sm">Complete today's puzzle and compete on the leaderboard!</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="text-blue-600 dark:text-blue-400" size={20} />
              <span className="font-semibold text-gray-900 dark:text-gray-100">Today's Challenge</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>Difficulty: <span className="font-semibold text-orange-600 dark:text-orange-400">Hard</span></p>
              <p>Date: <span className="font-semibold">{new Date().toLocaleDateString()}</span></p>
            </div>
          </div>

          {hasCompletedToday && todaysBestTime && (
            <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="text-green-600 dark:text-green-400" size={20} />
                <span className="font-semibold text-gray-900 dark:text-gray-100">Your Best Time Today</span>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatTime(todaysBestTime)}
              </p>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Rules</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Everyone gets the same puzzle each day</li>
              <li>• Your best time is recorded</li>
              <li>• Compete on the global leaderboard</li>
              <li>• New challenge available every 24 hours</li>
            </ul>
          </div>

          <button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
          >
            {hasCompletedToday ? 'Play Again' : 'Start Challenge'}
          </button>
        </div>
      </div>
    </div>
  );
}
