import React, { useState, useEffect } from 'react';
import { SudokuGrid } from './components/SudokuGrid';
import { GameControls } from './components/GameControls';
import { NumberPad } from './components/NumberPad';
import { ThemeToggle } from './components/ThemeToggle';
import { SuccessModal } from './components/SuccessModal';
import { DailyChallenge } from './components/DailyChallenge';
import { Leaderboard } from './components/Leaderboard';
import { useGameState } from './hooks/useGameState';
import { Menu, X } from 'lucide-react';

function App() {
  const {
    gameState,
    selectedCell,
    setSelectedCell,
    newGame,
    setValue,
    undo,
    redo,
    getHint,
    solve,
    restart,
    validateCell,
  } = useGameState();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDailyChallenge, setShowDailyChallenge] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [hintCells] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (gameState.isComplete && !showSuccessModal) {
      setShowSuccessModal(true);
    }
  }, [gameState.isComplete, showSuccessModal]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedCell) return;

      if (e.key >= '1' && e.key <= '9') {
        setValue(selectedCell.row, selectedCell.col, parseInt(e.key));
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        setValue(selectedCell.row, selectedCell.col, null);
      } else if (e.key === 'ArrowUp' && selectedCell.row > 0) {
        setSelectedCell({ row: selectedCell.row - 1, col: selectedCell.col });
      } else if (e.key === 'ArrowDown' && selectedCell.row < 8) {
        setSelectedCell({ row: selectedCell.row + 1, col: selectedCell.col });
      } else if (e.key === 'ArrowLeft' && selectedCell.col > 0) {
        setSelectedCell({ row: selectedCell.row, col: selectedCell.col - 1 });
      } else if (e.key === 'ArrowRight' && selectedCell.col < 8) {
        setSelectedCell({ row: selectedCell.row, col: selectedCell.col + 1 });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedCell, setValue, setSelectedCell]);

  const handleNumberPadClick = (num: number | null) => {
    if (selectedCell) {
      setValue(selectedCell.row, selectedCell.col, num);
    }
  };

  const handleNewGame = () => {
    setShowSuccessModal(false);
    newGame(gameState.difficulty, gameState.mode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
      <ThemeToggle />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <header className="text-center mb-6 md:mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 mb-2 tracking-tight">
            Sudoku Solver & Game
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base font-medium">
            Challenge your mind with classic Sudoku puzzles
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start justify-center">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden fixed top-4 right-4 z-40 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>

          <aside
            className={`
              ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}
              lg:translate-x-0
              fixed lg:relative
              top-0 left-0
              h-full lg:h-auto
              w-80 lg:w-auto
              z-30
              transition-transform duration-300
              lg:block
              overflow-y-auto
              lg:overflow-visible
              pt-16 lg:pt-0
              px-4 lg:px-0
              bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 lg:bg-none
            `}
          >
            <GameControls
              difficulty={gameState.difficulty}
              mode={gameState.mode}
              hintsRemaining={gameState.hintsRemaining}
              timer={gameState.timer}
              score={gameState.score}
              canUndo={gameState.historyIndex > 0}
              canRedo={gameState.historyIndex < gameState.history.length - 1}
              onNewGame={newGame}
              onUndo={undo}
              onRedo={redo}
              onHint={getHint}
              onSolve={solve}
              onRestart={restart}
              onShowLeaderboard={() => setShowLeaderboard(true)}
              onShowDailyChallenge={() => setShowDailyChallenge(true)}
            />
          </aside>

          <main className="flex-1 max-w-2xl mx-auto w-full">
            <SudokuGrid
              grid={gameState.grid}
              originalGrid={gameState.originalGrid}
              selectedCell={selectedCell}
              validateCell={validateCell}
              onCellClick={setSelectedCell}
              hintCells={hintCells}
            />

            <div className="mt-4">
              <NumberPad
                onNumberClick={handleNumberPadClick}
                disabled={!selectedCell || gameState.originalGrid[selectedCell.row][selectedCell.col] !== null}
              />
            </div>

            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              <p>Click a cell and use the number pad or keyboard (1-9) to play</p>
              <p className="mt-1">Use arrow keys to navigate</p>
            </div>
          </main>
        </div>
      </div>

      {showMobileMenu && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {showSuccessModal && (
        <SuccessModal
          time={gameState.timer}
          difficulty={gameState.difficulty}
          onClose={() => setShowSuccessModal(false)}
          onNewGame={handleNewGame}
        />
      )}

      {showDailyChallenge && (
        <DailyChallenge
          onClose={() => setShowDailyChallenge(false)}
          onStartChallenge={(difficulty) => {
            newGame(difficulty, 'daily');
          }}
        />
      )}

      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      )}
    </div>
  );
}

export default App;
