import React from 'react';
import { SudokuCell } from './SudokuCell';
import type { SudokuGrid as GridType, ValidationStatus } from '../types/sudoku';

interface SudokuGridProps {
  grid: GridType;
  originalGrid: GridType;
  selectedCell: { row: number; col: number } | null;
  validateCell: (row: number, col: number) => ValidationStatus;
  onCellClick: (row: number, col: number) => void;
  hintCells?: Set<string>;
}

export function SudokuGrid({
  grid,
  originalGrid,
  selectedCell,
  validateCell,
  onCellClick,
  hintCells = new Set(),
}: SudokuGridProps) {
  const selectedValue = selectedCell ? grid[selectedCell.row][selectedCell.col] : null;

  const isHighlighted = (row: number, col: number) => {
    if (!selectedCell) return false;
    if (row === selectedCell.row && col === selectedCell.col) return false;

    const value = grid[row][col];
    if (value === null) return false;
    if (selectedValue === null) return false;

    return value === selectedValue;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-3 md:p-6 border-2 border-gray-800 dark:border-gray-300 transition-colors">
      <div className="grid grid-cols-9 aspect-square w-full max-w-[540px] mx-auto border-[3px] border-gray-800 dark:border-gray-300 rounded-lg overflow-hidden">
        {grid.map((row, rowIndex) =>
          row.map((value, colIndex) => (
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              value={value}
              isOriginal={originalGrid[rowIndex][colIndex] !== null}
              isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
              isHighlighted={isHighlighted(rowIndex, colIndex)}
              validation={validateCell(rowIndex, colIndex)}
              isHint={hintCells.has(`${rowIndex}-${colIndex}`)}
              row={rowIndex}
              col={colIndex}
              onClick={onCellClick}
            />
          ))
        )}
      </div>
    </div>
  );
}
