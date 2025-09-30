import React, { useEffect, useRef } from 'react';
import { Trophy, Clock, Star } from 'lucide-react';
import { createConfetti } from '../utils/confetti';
import type { Difficulty } from '../types/sudoku';

interface SuccessModalProps {
  time: number;
  difficulty: Difficulty;
  onClose: () => void;
  onNewGame: () => void;
}

export function SuccessModal({ time, difficulty, onClose, onNewGame }: SuccessModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const cleanup = createConfetti(canvasRef.current);
      return cleanup;
    }
  }, []);

  useEffect(() => {
    const leaderboard = localStorage.getItem('leaderboard');
    const entries = leaderboard ? JSON.parse(leaderboard) : [];

    const newEntry = {
      name: 'Player',
      time,
      difficulty,
      date: new Date().toLocaleDateString(),
    };

    entries.push(newEntry);
    localStorage.setItem('leaderboard', JSON.stringify(entries));

    const today = new Date().toDateString();
    const existing = localStorage.getItem(`daily_best_time_${today}`);

    if (!existing || time < parseInt(existing)) {
      localStorage.setItem(`daily_best_time_${today}`, time.toString());
      localStorage.setItem(`daily_completed_${today}`, 'true');
    }
  }, [time, difficulty]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreMessage = () => {
    if (time < 180) return 'Amazing! Lightning fast!';
    if (time < 300) return 'Excellent work!';
    if (time < 600) return 'Great job!';
    return 'Well done!';
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ width: '100%', height: '100%' }}
      />

      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full border-2 border-gray-200 dark:border-gray-700 overflow-hidden animate-scale-in">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 rounded-full p-4 backdrop-blur-sm">
                <Trophy size={48} />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-2">Puzzle Complete!</h2>
            <p className="text-green-100 text-lg">{getScoreMessage()}</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 text-center border border-blue-200 dark:border-blue-800">
                <Clock className="mx-auto mb-2 text-blue-600 dark:text-blue-400" size={24} />
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Time</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatTime(time)}</div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-950 rounded-lg p-4 text-center border border-purple-200 dark:border-purple-800">
                <Star className="mx-auto mb-2 text-purple-600 dark:text-purple-400" size={24} />
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Difficulty</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 capitalize">{difficulty}</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onNewGame}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
              >
                New Game
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-200 font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
