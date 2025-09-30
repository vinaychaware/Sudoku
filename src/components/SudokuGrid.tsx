import React from 'react';
import { SudokuCell } from './SudokuCell';
import type { Cell, CellValue } from '../types/sudoku';

interface SudokuGridProps {
  grid: Cell[][];
  onCellChange: (row: number, col: number, value: CellValue) => void;
  onCellFocus: (row: number, col: number) => void;
}

export function SudokuGrid({ grid, onCellChange, onCellFocus }: SudokuGridProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 border-2 border-gray-800 dark:border-gray-300 transition-colors">
      <div className="grid grid-cols-9 aspect-square max-w-[540px] border-[3px] border-gray-800 dark:border-gray-300 rounded-lg overflow-hidden">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              value={cell.value}
              isOriginal={cell.isOriginal}
              isHighlighted={cell.isHighlighted}
              isError={cell.isError}
              row={rowIndex}
              col={colIndex}
              onValueChange={onCellChange}
              onFocus={onCellFocus}
            />
          ))
        )}
      </div>
    </div>
  );
}
