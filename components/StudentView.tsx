
import React, { useState, useEffect, useMemo } from 'react';
import { GameState, MathProblem } from '../types';
import { MATH_PROBLEMS, WINNING_COMBINATIONS } from '../constants';
import BingoCell from './BingoCell';

interface StudentViewProps {
  name: string;
  gameState: GameState;
  onBingo: (name: string) => void;
}

const StudentView: React.FC<StudentViewProps> = ({ name, gameState, onBingo }) => {
  // Select 16 unique random answers for the student's grid on mount
  const gridAnswers = useMemo(() => {
    // Collect all unique answers from the pool
    const uniqueAnswers = Array.from(new Set(MATH_PROBLEMS.map(p => p.answer)));
    const shuffled = [...uniqueAnswers].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 16);
  }, []);

  const [markedIndices, setMarkedIndices] = useState<number[]>([]);
  const [hasClaimedBingo, setHasClaimedBingo] = useState(false);

  const toggleMark = (index: number) => {
    if (hasClaimedBingo) return;
    setMarkedIndices(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const isBingo = useMemo(() => {
    return WINNING_COMBINATIONS.some(combo => 
      combo.every(idx => markedIndices.includes(idx))
    );
  }, [markedIndices]);

  const handleBingoClick = () => {
    if (isBingo && !hasClaimedBingo) {
      onBingo(name);
      setHasClaimedBingo(true);
      // Native notification
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([100, 30, 100, 30, 200]);
      }
    }
  };

  const currentProblem = MATH_PROBLEMS.find(p => p.id === gameState.currentProblemId);

  return (
    <div className="max-w-xl mx-auto space-y-8">
      {/* Current Problem Display for Student */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-indigo-100">
        <div className="bg-indigo-600 px-6 py-3 flex justify-between items-center">
          <span className="text-white font-bold text-sm uppercase tracking-wider">Тековна задача</span>
          <span className="text-indigo-200 text-xs font-bold">Ученик: {name}</span>
        </div>
        <div className="p-6 text-center">
          {currentProblem ? (
            <p className="text-2xl md:text-3xl font-black text-gray-800 animate-fade-in">
              {currentProblem.question}
            </p>
          ) : (
            <p className="text-gray-400 italic">Чекање наставникот да започне...</p>
          )}
        </div>
      </div>

      {/* Bingo Grid */}
      <div className="bg-white p-6 rounded-[2rem] shadow-2xl border-b-8 border-gray-200">
        <div className="bingo-grid mb-8">
          {gridAnswers.map((ans, idx) => (
            <BingoCell 
              key={idx} 
              value={ans} 
              isMarked={markedIndices.includes(idx)} 
              onClick={() => toggleMark(idx)} 
              disabled={hasClaimedBingo}
            />
          ))}
        </div>

        <button 
          onClick={handleBingoClick}
          disabled={!isBingo || hasClaimedBingo}
          className={`w-full py-6 rounded-2xl text-3xl font-black shadow-xl transition-all active:scale-95 flex items-center justify-center gap-4 ${
            hasClaimedBingo 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : isBingo 
              ? 'bg-green-500 hover:bg-green-600 text-white animate-pulse' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {hasClaimedBingo ? (
            <>БИНГО ПОТВРДЕНО! <i className="fa-solid fa-check"></i></>
          ) : (
            <>БИНГО! <i className="fa-solid fa-bullhorn"></i></>
          )}
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-3xl">
        <h4 className="text-blue-800 font-bold mb-2 flex items-center gap-2">
          <i className="fa-solid fa-lightbulb"></i> Како се игра?
        </h4>
        <p className="text-blue-700 text-sm leading-relaxed">
          Реши ја задачата на екранот. Ако твојот резултат е на твојата табла, кликни го полето за да го обоиш.
          Потребно е да поврзеш <strong>4 полиња</strong> хоризонтално, вертикално или дијагонално за да добиеш БИНГО!
        </p>
      </div>
    </div>
  );
};

export default StudentView;
