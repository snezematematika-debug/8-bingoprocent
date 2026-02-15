
import React from 'react';
import { GameState } from '../types';
import { MATH_PROBLEMS } from '../constants';

interface TeacherViewProps {
  gameState: GameState;
  updateState: (newState: Partial<GameState>) => void;
}

const TeacherView: React.FC<TeacherViewProps> = ({ gameState, updateState }) => {
  const currentProblem = MATH_PROBLEMS.find(p => p.id === gameState.currentProblemId);

  const generateProblem = () => {
    const available = MATH_PROBLEMS.filter(p => !gameState.history.includes(p.id));
    if (available.length === 0) {
      alert("Честитки! Ги решивте сите достапни задачи!");
      return;
    }
    const randomIndex = Math.floor(Math.random() * available.length);
    const newProblem = available[randomIndex];
    updateState({
      currentProblemId: newProblem.id,
      history: [...gameState.history, newProblem.id]
    });
  };

  const resetGame = () => {
    if (confirm("Целосен ресет на играта и победниците?")) {
      updateState({ currentProblemId: null, history: [], bingoWinners: [] });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Main Action Area */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-8 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <i className="fa-solid fa-calculator text-9xl"></i>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em]">Активна Задача</h3>
              <p className="text-slate-400 text-xs font-bold">Прогрес: {gameState.history.length} од {MATH_PROBLEMS.length}</p>
            </div>
            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-500" 
                style={{ width: `${(gameState.history.length / MATH_PROBLEMS.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-3xl p-10 text-center min-h-[300px] flex flex-col items-center justify-center border-2 border-slate-50 group">
            {currentProblem ? (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight">
                  {currentProblem.question}
                </h2>
                <div className="inline-flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg border-b-4 border-green-500">
                  <span className="text-xs font-black text-slate-400 uppercase mb-2">Точен Одговор</span>
                  <span className="text-5xl font-black text-green-600 tracking-tighter">{currentProblem.answer}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-md text-indigo-400 text-3xl">
                  <i className="fa-solid fa-play"></i>
                </div>
                <p className="text-xl font-bold text-slate-400">Подготвени за нова партија?</p>
              </div>
            )}
          </div>

          <div className="mt-10 flex gap-4">
            <button 
              onClick={generateProblem}
              className="flex-1 py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-2xl rounded-2xl shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              СЛЕДНА ЗАДАЧА <i className="fa-solid fa-arrow-right text-lg"></i>
            </button>
            <button 
              onClick={resetGame}
              className="px-8 py-6 bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 font-bold rounded-2xl transition-all"
              title="Ресетирај"
            >
              <i className="fa-solid fa-rotate-right"></i>
            </button>
          </div>
        </div>

        {/* History Chips */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Претходни одговори</h4>
          <div className="flex flex-wrap gap-2">
            {gameState.history.length > 0 ? (
              gameState.history.slice(0, -1).reverse().map(id => (
                <div key={id} className="px-4 py-2 bg-slate-50 rounded-xl text-sm font-bold text-slate-600 border border-slate-100">
                  {MATH_PROBLEMS.find(p => p.id === id)?.answer}
                </div>
              ))
            ) : (
              <span className="text-slate-300 text-sm italic">Листата е празна...</span>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar - Winners */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-[#1e293b] rounded-[2rem] shadow-2xl overflow-hidden h-full">
          <div className="bg-indigo-600 p-8">
            <h3 className="text-xl font-black text-white flex items-center gap-3">
              <i className="fa-solid fa-crown text-yellow-400"></i> ПОБЕДНИЦИ
            </h3>
          </div>
          <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
            {gameState.bingoWinners.length > 0 ? (
              gameState.bingoWinners.map((winner, idx) => (
                <div key={idx} className={`flex items-center justify-between p-5 rounded-2xl transition-all ${idx === 0 ? 'bg-indigo-500/20 border border-indigo-500/30' : 'bg-slate-800/50'}`}>
                  <div className="flex items-center gap-4">
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${idx === 0 ? 'bg-yellow-400 text-yellow-900' : 'bg-slate-700 text-slate-400'}`}>
                      {idx + 1}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-lg">{winner.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Бинго Повик</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-indigo-400 text-xs font-black">
                      {new Date(winner.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 opacity-20">
                <i className="fa-solid fa-trophy text-6xl text-white mb-4"></i>
                <p className="text-white font-bold">Се чека првиот победник...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherView;
