import React from 'react';
import type { CellValue, ValidationStatus } from '../types/sudoku';

interface SudokuCellProps {
  value: CellValue;
  isOriginal: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  validation: ValidationStatus;
  isHint: boolean;
  row: number;
  col: number;
  onClick: (row: number, col: number) => void;
}

export function SudokuCell({
  value,
  isOriginal,
  isSelected,
  isHighlighted,
  validation,
  isHint,
  row,
  col,
  onClick,
}: SudokuCellProps) {
  const getBackgroundColor = () => {
    if (isSelected) return 'bg-blue-200 dark:bg-blue-900';
    if (isHighlighted) return 'bg-blue-50 dark:bg-blue-950';
    if (validation === 'correct') return 'bg-green-100 dark:bg-green-950';
    if (validation === 'incorrect') return 'bg-red-100 dark:bg-red-950';
    return 'bg-gray-50 dark:bg-gray-800';
  };

  const getTextColor = () => {
    if (isOriginal) return 'text-gray-900 dark:text-gray-100 font-bold';
    if (isHint) return 'text-green-600 dark:text-green-400 font-semibold';
    if (validation === 'incorrect') return 'text-red-600 dark:text-red-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  const getBorderClasses = () => {
    const classes = ['border'];
    if (col % 3 === 2 && col !== 8) classes.push('border-r-2 border-r-gray-900 dark:border-r-gray-300');
    if (row % 3 === 2 && row !== 8) classes.push('border-b-2 border-b-gray-900 dark:border-b-gray-300');
    return classes.join(' ');
  };

  return (
    <button
      className={`
        ${getBackgroundColor()}
        ${getTextColor()}
        ${getBorderClasses()}
        w-full aspect-square
        flex items-center justify-center
        text-lg md:text-2xl
        border-gray-300 dark:border-gray-600
        transition-all duration-150
        hover:bg-blue-100 dark:hover:bg-blue-900
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10
        ${!isOriginal ? 'cursor-pointer' : 'cursor-default'}
      `}
      onClick={() => onClick(row, col)}
      disabled={isOriginal}
    >
      {value || ''}
    </button>
  );
}
