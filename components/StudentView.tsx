
import React, { useState, useMemo, useEffect } from 'react';
import { GameState } from '../types';
import { MATH_PROBLEMS, WINNING_COMBINATIONS } from '../constants';
import BingoCell from './BingoCell';

interface StudentViewProps {
  name: string;
  gameState: GameState;
  onBingo: (name: string) => void;
}

const StudentView: React.FC<StudentViewProps> = ({ name, gameState, onBingo }) => {
  const gridAnswers = useMemo(() => {
    const uniqueAnswers = Array.from(new Set(MATH_PROBLEMS.map(p => p.answer)));
    const shuffled = [...uniqueAnswers].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 16);
  }, []);

  const [markedIndices, setMarkedIndices] = useState<number[]>([]);
  const [hasClaimedBingo, setHasClaimedBingo] = useState(false);
  const [confetti, setConfetti] = useState<any[]>([]);

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
      
      // Create confetti
      const newConfetti = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: ['#4f46e5', '#f59e0b', '#10b981', '#ef4444', '#ec4899'][Math.floor(Math.random() * 5)],
        delay: Math.random() * 2
      }));
      setConfetti(newConfetti);

      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([100, 50, 100, 50, 300]);
      }
    }
  };

  const currentProblem = MATH_PROBLEMS.find(p => p.id === gameState.currentProblemId);

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12 relative">
      {/* Confetti Elements */}
      {confetti.map(c => (
        <div 
          key={c.id} 
          className="confetti" 
          style={{ 
            left: `${c.left}%`, 
            top: '-20px', 
            backgroundColor: c.color, 
            animationDelay: `${c.delay}s` 
          }}
        />
      ))}

      {/* Dynamic Task Card */}
      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden relative">
        <div className="h-2 w-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        <div className="p-8 text-center space-y-4">
          <div className="inline-block px-4 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-2">
            Моментална Задача
          </div>
          {currentProblem ? (
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 animate-fade-in leading-snug">
              {currentProblem.question}
            </h2>
          ) : (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-500 rounded-full animate-spin"></div>
              <p className="text-slate-400 font-bold">Чекање на наставникот...</p>
            </div>
          )}
        </div>
      </div>

      {/* Bingo Board Container */}
      <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl relative">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
        
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
          className={`w-full py-6 rounded-2xl text-3xl font-black shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 ${
            hasClaimedBingo 
            ? 'bg-emerald-500 text-white cursor-default scale-105' 
            : isBingo 
              ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white animate-bounce' 
              : 'bg-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          {hasClaimedBingo ? (
            <><i className="fa-solid fa-check-double"></i> БИНГО ПОТВРДЕНО!</>
          ) : (
            <>БИНГО! <i className="fa-solid fa-bullhorn text-xl"></i></>
          )}
        </button>
      </div>

      {/* Info Card */}
      <div className="flex items-start gap-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 shrink-0">
          <i className="fa-solid fa-circle-info text-xl"></i>
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-slate-800">Твојата цел</h4>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            Реши ја задачата што ја објавува наставникот. Ако го имаш одговорот на твојата табла, означи го. Поврзи 4 полиња во линија и веднаш притисни БИНГО!
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentView;
