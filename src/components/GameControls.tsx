import React from 'react';
import { Play, Undo2, Redo2, Lightbulb, Zap, RotateCcw, Trophy, Calendar } from 'lucide-react';
import type { Difficulty, GameMode } from '../types/sudoku';

interface GameControlsProps {
  difficulty: Difficulty;
  mode: GameMode;
  hintsRemaining: number;
  timer: number;
  score: number;
  canUndo: boolean;
  canRedo: boolean;
  onNewGame: (difficulty: Difficulty, mode: GameMode) => void;
  onUndo: () => void;
  onRedo: () => void;
  onHint: () => void;
  onSolve: () => void;
  onRestart: () => void;
  onShowLeaderboard: () => void;
  onShowDailyChallenge: () => void;
}

export function GameControls({
  difficulty,
  mode,
  hintsRemaining,
  timer,
  score,
  canUndo,
  canRedo,
  onNewGame,
  onUndo,
  onRedo,
  onHint,
  onSolve,
  onRestart,
  onShowLeaderboard,
  onShowDailyChallenge,
}: GameControlsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const buttonClass = 'flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95';
  const primaryButton = `${buttonClass} bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white`;
  const secondaryButton = `${buttonClass} bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400`;
  const iconButton = `${buttonClass} bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 disabled:opacity-40 disabled:cursor-not-allowed`;

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Time</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatTime(timer)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Hints</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{hintsRemaining}</div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Difficulty</label>
          <div className="grid grid-cols-4 gap-2">
            {(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map((level) => (
              <button
                key={level}
                onClick={() => onNewGame(level, mode)}
                className={`px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-200 ${
                  difficulty === level
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Game Mode</label>
          <div className="grid grid-cols-2 gap-2">
            {(['play', 'challenge'] as GameMode[]).map((m) => (
              <button
                key={m}
                onClick={() => onNewGame(difficulty, m)}
                className={`px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-200 ${
                  mode === m
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {m === 'play' ? 'Practice' : 'Challenge'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button onClick={onUndo} disabled={!canUndo} className={iconButton}>
            <Undo2 size={18} />
            Undo
          </button>
          <button onClick={onRedo} disabled={!canRedo} className={iconButton}>
            <Redo2 size={18} />
            Redo
          </button>
        </div>

        <div className="space-y-2">
          <button onClick={onHint} disabled={hintsRemaining === 0} className={secondaryButton}>
            <Lightbulb size={18} />
            Hint ({hintsRemaining})
          </button>

          <button onClick={onSolve} className={secondaryButton}>
            <Zap size={18} />
            Auto Solve
          </button>

          <button onClick={onRestart} className={secondaryButton}>
            <RotateCcw size={18} />
            Restart
          </button>

          <button onClick={() => onNewGame(difficulty, mode)} className={primaryButton}>
            <Play size={18} />
            New Game
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 transition-colors">
        <button onClick={onShowDailyChallenge} className={secondaryButton}>
          <Calendar size={18} />
          Daily Challenge
        </button>

        <button onClick={onShowLeaderboard} className={`${secondaryButton} mt-2`}>
          <Trophy size={18} />
          Leaderboard
        </button>
      </div>
    </div>
  );
}
