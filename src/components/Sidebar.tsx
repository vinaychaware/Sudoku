import React from 'react';
import { Check, Lightbulb, RefreshCw, Zap } from 'lucide-react';
import type { Difficulty } from '../types/sudoku';

interface SidebarProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onNewPuzzle: () => void;
  onSolvePuzzle: () => void;
  onCheckSolution: () => void;
  onHint: () => void;
}

export function Sidebar({
  difficulty,
  onDifficultyChange,
  onNewPuzzle,
  onSolvePuzzle,
  onCheckSolution,
  onHint
}: SidebarProps) {
  const buttonBaseClasses = 'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-lg active:scale-[0.98]';

  const primaryButton = `${buttonBaseClasses} bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700`;
  const secondaryButton = `${buttonBaseClasses} bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400`;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 space-y-5 w-full max-w-xs border border-gray-200 dark:border-gray-700 transition-colors">
      <div>
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">Difficulty Level</h3>
        <div className="flex gap-2">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
            <button
              key={level}
              onClick={() => onDifficultyChange(level)}
              className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                difficulty === level
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-5 space-y-3">
        <button onClick={onNewPuzzle} className={primaryButton}>
          <RefreshCw size={18} />
          New Puzzle
        </button>

        <button onClick={onSolvePuzzle} className={secondaryButton}>
          <Zap size={18} />
          Solve Puzzle
        </button>

        <button onClick={onCheckSolution} className={secondaryButton}>
          <Check size={18} />
          Check Solution
        </button>

        <button onClick={onHint} className={secondaryButton}>
          <Lightbulb size={18} />
          Get Hint
        </button>
      </div>
    </div>
  );
}
