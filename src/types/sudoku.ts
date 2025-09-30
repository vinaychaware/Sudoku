export type CellValue = number | null;
export type SudokuGrid = CellValue[][];
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type GameMode = 'play' | 'solver' | 'challenge' | 'daily';
export type ValidationStatus = 'none' | 'correct' | 'incorrect';

export interface Cell {
  value: CellValue;
  isOriginal: boolean;
  isHighlighted: boolean;
  validation: ValidationStatus;
  isHint: boolean;
}

export interface GameState {
  grid: SudokuGrid;
  solution: SudokuGrid;
  originalGrid: SudokuGrid;
  difficulty: Difficulty;
  mode: GameMode;
  timer: number;
  score: number;
  hintsRemaining: number;
  isComplete: boolean;
  history: HistoryEntry[];
  historyIndex: number;
}

export interface HistoryEntry {
  grid: SudokuGrid;
  timestamp: number;
}

export interface LeaderboardEntry {
  name: string;
  time: number;
  difficulty: Difficulty;
  date: string;
}
