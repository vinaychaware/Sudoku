import React from 'react';

interface NumberPadProps {
  onNumberClick: (num: number | null) => void;
  disabled?: boolean;
}

export function NumberPad({ onNumberClick, disabled = false }: NumberPadProps) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="grid grid-cols-5 gap-2">
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => onNumberClick(num)}
            disabled={disabled}
            className="
              bg-gradient-to-br from-blue-500 to-blue-600
              hover:from-blue-600 hover:to-blue-700
              text-white font-bold text-lg
              py-3 px-4 rounded-lg
              shadow-md hover:shadow-lg
              transform hover:scale-105 active:scale-95
              transition-all duration-150
              disabled:opacity-50 disabled:cursor-not-allowed
              disabled:hover:scale-100
            "
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => onNumberClick(null)}
          disabled={disabled}
          className="
            bg-gradient-to-br from-red-500 to-red-600
            hover:from-red-600 hover:to-red-700
            text-white font-bold text-sm
            py-3 px-4 rounded-lg
            shadow-md hover:shadow-lg
            transform hover:scale-105 active:scale-95
            transition-all duration-150
            disabled:opacity-50 disabled:cursor-not-allowed
            disabled:hover:scale-100
          "
        >
          Clear
        </button>
      </div>
    </div>
  );
}
