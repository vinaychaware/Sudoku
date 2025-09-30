import type { SudokuGrid, CellValue } from '../types/sudoku';

export function isValidMove(
  grid: SudokuGrid,
  row: number,
  col: number,
  num: number
): boolean {
  for (let x = 0; x < 9; x++) {
    if (x !== col && grid[row][x] === num) {
      return false;
    }
    if (x !== row && grid[x][col] === num) {
      return false;
    }
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const r = startRow + i;
      const c = startCol + j;
      if ((r !== row || c !== col) && grid[r][c] === num) {
        return false;
      }
    }
  }

  return true;
}

export function validateCell(
  grid: SudokuGrid,
  row: number,
  col: number,
  solution: SudokuGrid
): 'correct' | 'incorrect' | 'none' {
  const value = grid[row][col];

  if (value === null) {
    return 'none';
  }

  return value === solution[row][col] ? 'correct' : 'incorrect';
}

export function checkPuzzleComplete(grid: SudokuGrid, solution: SudokuGrid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] !== solution[row][col]) {
        return false;
      }
    }
  }
  return true;
}

export function hasErrors(grid: SudokuGrid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const val = grid[row][col];
      if (val !== null && !isValidMove(grid, row, col, val)) {
        return true;
      }
    }
  }
  return false;
}
