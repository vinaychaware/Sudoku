import type { SudokuGrid, Difficulty } from '../types/sudoku';

export function generateSudoku(difficulty: Difficulty): SudokuGrid {
  const grid = createEmptyGrid();
  fillGrid(grid);
  const cellsToRemove = getCellsToRemove(difficulty);
  removeNumbers(grid, cellsToRemove);
  return grid;
}

function createEmptyGrid(): SudokuGrid {
  return Array(9).fill(null).map(() => Array(9).fill(null));
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

function fillGrid(grid: SudokuGrid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);

        for (const num of numbers) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;

            if (fillGrid(grid)) {
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

function getCellsToRemove(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy':
      return 35;
    case 'medium':
      return 45;
    case 'hard':
      return 52;
    case 'expert':
      return 60;
    default:
      return 40;
  }
}

function removeNumbers(grid: SudokuGrid, count: number): void {
  let removed = 0;

  while (removed < count) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (grid[row][col] !== null) {
      grid[row][col] = null;
      removed++;
    }
  }
}
