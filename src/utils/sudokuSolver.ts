import type { SudokuGrid } from '../types/sudoku';

export function solveSudoku(grid: SudokuGrid): SudokuGrid | null {
  const gridCopy = grid.map(row => [...row]);

  if (solve(gridCopy)) {
    return gridCopy;
  }

  return null;
}

function solve(grid: SudokuGrid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;

            if (solve(grid)) {
              return true;
            }

            grid[row][col] = null;
          }
        }

        return false;
      }
    }
  }
  return true;
}

function isValid(grid: SudokuGrid, row: number, col: number, num: number): boolean {
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num || grid[x][col] === num) {
      return false;
    }
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[startRow + i][startCol + j] === num) {
        return false;
      }
    }
  }

  return true;
}

export function checkSolution(grid: SudokuGrid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const val = grid[row][col];

      if (val === null) {
        return false;
      }

      grid[row][col] = null;

      if (!isValid(grid, row, col, val)) {
        grid[row][col] = val;
        return false;
      }

      grid[row][col] = val;
    }
  }

  return true;
}

export function getHint(grid: SudokuGrid, solution: SudokuGrid): { row: number; col: number; value: number } | null {
  const emptyCells: Array<{ row: number; col: number }> = [];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        emptyCells.push({ row, col });
      }
    }
  }

  if (emptyCells.length === 0) {
    return null;
  }

  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  return {
    row: randomCell.row,
    col: randomCell.col,
    value: solution[randomCell.row][randomCell.col]!
  };
}
