import React, { useState, useEffect } from 'react';
import { SudokuGrid } from './components/SudokuGrid';
import { Sidebar } from './components/Sidebar';
import { ThemeToggle } from './components/ThemeToggle';
import { generateSudoku } from './utils/sudokuGenerator';
import { solveSudoku, checkSolution, getHint } from './utils/sudokuSolver';
import type { Cell, CellValue, Difficulty, SudokuGrid as GridType } from './types/sudoku';

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [originalGrid, setOriginalGrid] = useState<GridType>([]);
  const [currentGrid, setCurrentGrid] = useState<Cell[][]>([]);
  const [solution, setSolution] = useState<GridType>([]);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    initializeNewPuzzle(difficulty);
  }, []);

  const initializeNewPuzzle = (diff: Difficulty) => {
    const puzzle = generateSudoku(diff);
    const solved = solveSudoku(puzzle);

    if (!solved) {
      return;
    }

    setOriginalGrid(puzzle);
    setSolution(solved);

    const cellGrid: Cell[][] = puzzle.map((row, rowIndex) =>
      row.map((value, colIndex) => ({
        value,
        isOriginal: value !== null,
        isHighlighted: false,
        isError: false
      }))
    );

    setCurrentGrid(cellGrid);
    setMessage(null);
  };

  const handleNewPuzzle = () => {
    initializeNewPuzzle(difficulty);
    showMessage('New puzzle generated!', 'info');
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    initializeNewPuzzle(newDifficulty);
    showMessage(`Difficulty changed to ${newDifficulty}!`, 'info');
  };

  const handleCellChange = (row: number, col: number, value: CellValue) => {
    if (currentGrid[row][col].isOriginal) {
      return;
    }

    const newGrid = currentGrid.map((r, rIdx) =>
      r.map((cell, cIdx) =>
        rIdx === row && cIdx === col
          ? { ...cell, value, isError: false }
          : cell
      )
    );

    setCurrentGrid(newGrid);
    setMessage(null);
  };

  const handleCellFocus = (row: number, col: number) => {
    const value = currentGrid[row][col].value;

    if (value === null) {
      const newGrid = currentGrid.map(r =>
        r.map(cell => ({ ...cell, isHighlighted: false }))
      );
      setCurrentGrid(newGrid);
      return;
    }

    const newGrid = currentGrid.map((r, rIdx) =>
      r.map((cell, cIdx) => ({
        ...cell,
        isHighlighted: cell.value === value && cell.value !== null
      }))
    );

    setCurrentGrid(newGrid);
  };

  const handleSolvePuzzle = () => {
    if (!solution) {
      showMessage('Unable to solve puzzle', 'error');
      return;
    }

    const newGrid = currentGrid.map((row, rowIndex) =>
      row.map((cell, colIndex) => ({
        ...cell,
        value: solution[rowIndex][colIndex],
        isHighlighted: false,
        isError: false
      }))
    );

    setCurrentGrid(newGrid);
    showMessage('Puzzle solved!', 'success');
  };

  const handleCheckSolution = () => {
    const gridValues: GridType = currentGrid.map(row => row.map(cell => cell.value));
    const isComplete = gridValues.every(row => row.every(val => val !== null));

    if (!isComplete) {
      showMessage('Puzzle is not complete yet!', 'info');
      return;
    }

    if (checkSolution(gridValues)) {
      showMessage('Congratulations! Solution is correct!', 'success');
    } else {
      const newGrid = currentGrid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (!cell.isOriginal && cell.value !== solution[rowIndex][colIndex]) {
            return { ...cell, isError: true };
          }
          return { ...cell, isError: false };
        })
      );
      setCurrentGrid(newGrid);
      showMessage('Some cells are incorrect. Please try again!', 'error');
    }
  };

  const handleHint = () => {
    const gridValues: GridType = currentGrid.map(row => row.map(cell => cell.value));
    const hint = getHint(gridValues, solution);

    if (!hint) {
      showMessage('No hints available - puzzle is complete!', 'info');
      return;
    }

    const newGrid = currentGrid.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (rowIndex === hint.row && colIndex === hint.col) {
          return {
            ...cell,
            value: hint.value,
            isHighlighted: true,
            isError: false
          };
        }
        return { ...cell, isHighlighted: false };
      })
    );

    setCurrentGrid(newGrid);
    showMessage('Hint added!', 'success');
  };

  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const getMessageClasses = () => {
    if (!message) return '';

    const baseClasses = 'px-5 py-3 rounded-xl font-semibold shadow-lg transition-all transform animate-in fade-in slide-in-from-top-2 duration-300';

    switch (message.type) {
      case 'success':
        return `${baseClasses} bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border-2 border-green-300 dark:border-green-700`;
      case 'error':
        return `${baseClasses} bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border-2 border-red-300 dark:border-red-700`;
      case 'info':
        return `${baseClasses} bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-2 border-blue-300 dark:border-blue-700`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 py-8 px-4 transition-colors duration-300">
      <ThemeToggle />

      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 mb-3 tracking-tight">
            Sudoku Solver & Game
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Challenge your mind with classic Sudoku puzzles</p>
        </header>

        {message && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className={getMessageClasses()}>
              {message.text}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row items-start justify-center gap-6 lg:gap-8">
          <SudokuGrid
            grid={currentGrid}
            onCellChange={handleCellChange}
            onCellFocus={handleCellFocus}
          />

          <Sidebar
            difficulty={difficulty}
            onDifficultyChange={handleDifficultyChange}
            onNewPuzzle={handleNewPuzzle}
            onSolvePuzzle={handleSolvePuzzle}
            onCheckSolution={handleCheckSolution}
            onHint={handleHint}
          />
        </div>

        <footer className="text-center mt-10 text-gray-500 dark:text-gray-400 text-sm">
          <p className="font-medium">Select a cell and enter a number (1-9) to play</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
