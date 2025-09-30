import { useState, useCallback, useEffect, useRef } from 'react';
import type { GameState, SudokuGrid, Difficulty, GameMode, HistoryEntry } from '../types/sudoku';
import { generateSudoku } from '../utils/sudokuGenerator';
import { solveSudoku } from '../utils/sudokuSolver';
import { checkPuzzleComplete, validateCell } from '../utils/validation';

const MAX_HINTS = {
  easy: 5,
  medium: 3,
  hard: 2,
  expert: 1,
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedState = localStorage.getItem('sudokuGameState');
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch {
        return initializeGame('medium', 'play');
      }
    }
    return initializeGame('medium', 'play');
  });

  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!gameState.isComplete && gameState.mode !== 'solver') {
      timerRef.current = window.setInterval(() => {
        setGameState(prev => ({ ...prev, timer: prev.timer + 1 }));
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.isComplete, gameState.mode]);

  useEffect(() => {
    localStorage.setItem('sudokuGameState', JSON.stringify(gameState));
  }, [gameState]);

  const newGame = useCallback((difficulty: Difficulty, mode: GameMode) => {
    const newState = initializeGame(difficulty, mode);
    setGameState(newState);
    setSelectedCell(null);
  }, []);

  const setValue = useCallback((row: number, col: number, value: number | null) => {
    setGameState(prev => {
      if (prev.originalGrid[row][col] !== null) {
        return prev;
      }

      const newGrid = prev.grid.map(r => [...r]);
      newGrid[row][col] = value;

      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push({
        grid: newGrid,
        timestamp: Date.now(),
      });

      const isComplete = checkPuzzleComplete(newGrid, prev.solution);

      return {
        ...prev,
        grid: newGrid,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        isComplete,
      };
    });
  }, []);

  const undo = useCallback(() => {
    setGameState(prev => {
      if (prev.historyIndex <= 0) {
        return prev;
      }

      const newIndex = prev.historyIndex - 1;
      return {
        ...prev,
        grid: prev.history[newIndex].grid,
        historyIndex: newIndex,
      };
    });
  }, []);

  const redo = useCallback(() => {
    setGameState(prev => {
      if (prev.historyIndex >= prev.history.length - 1) {
        return prev;
      }

      const newIndex = prev.historyIndex + 1;
      return {
        ...prev,
        grid: prev.history[newIndex].grid,
        historyIndex: newIndex,
      };
    });
  }, []);

  const getHint = useCallback(() => {
    setGameState(prev => {
      if (prev.hintsRemaining <= 0) {
        return prev;
      }

      const emptyCells: Array<{ row: number; col: number }> = [];
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (prev.grid[row][col] === null) {
            emptyCells.push({ row, col });
          }
        }
      }

      if (emptyCells.length === 0) {
        return prev;
      }

      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const newGrid = prev.grid.map(r => [...r]);
      newGrid[randomCell.row][randomCell.col] = prev.solution[randomCell.row][randomCell.col];

      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push({
        grid: newGrid,
        timestamp: Date.now(),
      });

      return {
        ...prev,
        grid: newGrid,
        hintsRemaining: prev.hintsRemaining - 1,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  const solve = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      grid: prev.solution.map(r => [...r]),
      isComplete: true,
    }));
  }, []);

  const restart = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      grid: prev.originalGrid.map(r => [...r]),
      timer: 0,
      isComplete: false,
      hintsRemaining: MAX_HINTS[prev.difficulty],
      history: [{ grid: prev.originalGrid, timestamp: Date.now() }],
      historyIndex: 0,
    }));
    setSelectedCell(null);
  }, []);

  const loadCustomPuzzle = useCallback((grid: SudokuGrid) => {
    const solution = solveSudoku(grid);
    if (!solution) {
      alert('This puzzle has no solution!');
      return;
    }

    setGameState({
      grid: grid.map(r => [...r]),
      solution,
      originalGrid: grid.map(r => [...r]),
      difficulty: 'medium',
      mode: 'solver',
      timer: 0,
      score: 0,
      hintsRemaining: 0,
      isComplete: false,
      history: [{ grid, timestamp: Date.now() }],
      historyIndex: 0,
    });
    setSelectedCell(null);
  }, []);

  return {
    gameState,
    selectedCell,
    setSelectedCell,
    newGame,
    setValue,
    undo,
    redo,
    getHint,
    solve,
    restart,
    loadCustomPuzzle,
    validateCell: (row: number, col: number) =>
      validateCell(gameState.grid, row, col, gameState.solution),
  };
}

function initializeGame(difficulty: Difficulty, mode: GameMode): GameState {
  const originalGrid = generateSudoku(difficulty);
  const solution = solveSudoku(originalGrid)!;

  return {
    grid: originalGrid.map(r => [...r]),
    solution,
    originalGrid: originalGrid.map(r => [...r]),
    difficulty,
    mode,
    timer: 0,
    score: 0,
    hintsRemaining: MAX_HINTS[difficulty],
    isComplete: false,
    history: [{ grid: originalGrid, timestamp: Date.now() }],
    historyIndex: 0,
  };
}
