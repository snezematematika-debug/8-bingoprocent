
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
        aspect-square rounded-xl md:rounded-2xl text-xl md:text-2xl font-black transition-all
        flex items-center justify-center border-b-4
        ${isMarked 
          ? 'bg-yellow-400 border-yellow-600 text-yellow-900 scale-[0.98]' 
          : 'bg-white border-gray-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-200'
        }
        ${disabled && !isMarked ? 'opacity-50 grayscale cursor-not-allowed' : ''}
      `}
    >
      {value}
    </button>
  );
};

export default BingoCell;
