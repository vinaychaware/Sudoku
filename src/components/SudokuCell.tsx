import React from 'react';
import type { CellValue } from '../types/sudoku';

interface SudokuCellProps {
  value: CellValue;
  isOriginal: boolean;
  isHighlighted: boolean;
  isError: boolean;
  row: number;
  col: number;
  onValueChange: (row: number, col: number, value: CellValue) => void;
  onFocus: (row: number, col: number) => void;
}

export function SudokuCell({
  value,
  isOriginal,
  isHighlighted,
  isError,
  row,
  col,
  onValueChange,
  onFocus
}: SudokuCellProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (val === '') {
      onValueChange(row, col, null);
    } else {
      const num = parseInt(val, 10);
      if (num >= 1 && num <= 9) {
        onValueChange(row, col, num);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      onValueChange(row, col, null);
      e.preventDefault();
    }
  };

  const getCellClasses = () => {
    const baseClasses = 'w-full h-full text-center font-bold text-lg outline-none transition-all duration-200';
    const borderClasses = 'border border-gray-300 dark:border-gray-600';
    const rightBorder = (col + 1) % 3 === 0 && col !== 8 ? 'border-r-[3px] border-r-gray-800 dark:border-r-gray-300' : '';
    const bottomBorder = (row + 1) % 3 === 0 && row !== 8 ? 'border-b-[3px] border-b-gray-800 dark:border-b-gray-300' : '';

    let bgClass = 'bg-white dark:bg-gray-800';
    let textClass = isOriginal ? 'text-gray-900 dark:text-gray-100' : 'text-blue-600 dark:text-blue-400';

    if (isHighlighted) {
      bgClass = 'bg-blue-100 dark:bg-blue-900/40';
    }

    if (isError) {
      bgClass = 'bg-red-100 dark:bg-red-900/40';
      textClass = 'text-red-600 dark:text-red-400';
    }

    const cursorClass = isOriginal ? 'cursor-not-allowed' : 'cursor-text hover:bg-gray-100 dark:hover:bg-gray-700';
    const focusClass = 'focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:z-10';

    return `${baseClasses} ${borderClasses} ${rightBorder} ${bottomBorder} ${bgClass} ${textClass} ${cursorClass} ${focusClass}`;
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={value ?? ''}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={() => onFocus(row, col)}
      disabled={isOriginal}
      className={getCellClasses()}
    />
  );
}
