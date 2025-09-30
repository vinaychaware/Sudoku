export type CellValue = number | null;
export type SudokuGrid = CellValue[][];
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Cell {
  value: CellValue;
  isOriginal: boolean;
  isHighlighted: boolean;
  isError: boolean;
}
