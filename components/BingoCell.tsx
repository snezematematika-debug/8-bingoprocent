
import React from 'react';

interface BingoCellProps {
  value: string;
  isMarked: boolean;
  onClick: () => void;
  disabled: boolean;
}

const BingoCell: React.FC<BingoCellProps> = ({ value, isMarked, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative aspect-square rounded-2xl text-xl md:text-2xl font-extrabold transition-all duration-300
        flex items-center justify-center border-b-4 active:border-b-0 active:translate-y-1
        ${isMarked 
          ? 'bg-gradient-to-br from-yellow-400 to-amber-500 border-amber-700 text-white shadow-lg animate-pop' 
          : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 shadow-sm'
        }
        ${disabled && !isMarked ? 'opacity-40 grayscale cursor-not-allowed' : ''}
      `}
    >
      {isMarked && (
        <span className="absolute top-1 right-2 text-xs opacity-50">
          <i className="fa-solid fa-check"></i>
        </span>
      )}
      {value}
    </button>
  );
};

export default BingoCell;
