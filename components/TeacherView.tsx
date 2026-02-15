
import React from 'react';
import { GameState, MathProblem } from '../types';
import { MATH_PROBLEMS } from '../constants';

interface TeacherViewProps {
  gameState: GameState;
  updateState: (newState: Partial<GameState>) => void;
}

const TeacherView: React.FC<TeacherViewProps> = ({ gameState, updateState }) => {
  const currentProblem = MATH_PROBLEMS.find(p => p.id === gameState.currentProblemId);

  const generateProblem = () => {
    // Filter problems that haven't been picked yet
    const available = MATH_PROBLEMS.filter(p => !gameState.history.includes(p.id));
    
    if (available.length === 0) {
      alert("Сите задачи се веќе искористени!");
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
    if (confirm("Дали сте сигурни дека сакате да ја ресетирате играта?")) {
      updateState({
        currentProblemId: null,
        history: [],
        bingoWinners: []
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Control Panel */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 border-t-8 border-indigo-600 transition-all">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-700">Тековна задача</h3>
            <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-bold">
              {gameState.history.length} / {MATH_PROBLEMS.length}
            </span>
          </div>

          <div className="min-h-[200px] flex flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            {currentProblem ? (
              <>
                <p className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                  {currentProblem.question}
                </p>
                <div className="p-4 bg-green-100 border-2 border-green-500 rounded-xl">
                  <span className="text-green-800 font-bold text-xl uppercase tracking-wider block mb-1">Точен одговор:</span>
                  <span className="text-4xl font-black text-green-600">{currentProblem.answer}</span>
                </div>
              </>
            ) : (
              <p className="text-xl text-gray-400 font-medium">Кликнете на копчето за да започнете!</p>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={generateProblem}
              className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-2xl rounded-2xl shadow-lg transition-transform active:scale-95"
            >
              ГЕНЕРИРАЈ ЗАДАЧА
            </button>
            <button 
              onClick={resetGame}
              className="px-6 py-5 border-2 border-red-500 text-red-500 hover:bg-red-50 font-bold text-lg rounded-2xl transition-all"
            >
              <i className="fa-solid fa-rotate-right mr-1"></i> Ресет
            </button>
          </div>
        </div>

        {/* Recent History */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h4 className="font-bold text-gray-600 mb-4 uppercase tracking-widest text-sm">Претходни задачи</h4>
          <div className="flex flex-wrap gap-2">
            {gameState.history.length > 0 ? (
              gameState.history.slice().reverse().map(id => {
                const p = MATH_PROBLEMS.find(item => item.id === id);
                return (
                  <div key={id} className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-600">
                    <span className="font-bold">{p?.answer}</span>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 text-sm italic">Нема искористени задачи.</p>
            )}
          </div>
        </div>
      </div>

      {/* Leaderboard / Winners List */}
      <div className="space-y-6">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-yellow-400 p-6 flex items-center justify-between">
            <h3 className="text-xl font-bold text-yellow-900"><i className="fa-solid fa-trophy mr-2"></i> БИНГО ПОБЕДНИЦИ</h3>
            <span className="bg-white/30 text-yellow-900 px-2 py-1 rounded-md text-sm font-bold">{gameState.bingoWinners.length}</span>
          </div>
          <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
            {gameState.bingoWinners.length > 0 ? (
              gameState.bingoWinners.map((winner, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl animate-bounce-short">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-yellow-400 rounded-full font-bold text-yellow-900">
                      {idx + 1}
                    </div>
                    <span className="font-bold text-gray-800 text-lg">{winner.name}</span>
                  </div>
                  <span className="text-xs text-yellow-700 font-semibold uppercase">
                    {new Date(winner.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <i className="fa-solid fa-hourglass-half text-4xl text-gray-200 mb-4"></i>
                <p className="text-gray-400 font-medium">Сè уште нема Бинго повици...</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-indigo-900 p-6 rounded-3xl text-white shadow-lg">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <i className="fa-solid fa-circle-info text-indigo-300"></i> Упатство за наставник
          </h4>
          <ul className="text-sm text-indigo-200 space-y-2 list-disc list-inside">
            <li>Кликни на "Генерирај задача" за нова математичка задача.</li>
            <li>Задачата и одговорот ќе бидат видливи на овој екран.</li>
            <li>Следи го табелата за да видиш кој ученик прв ќе кликне Бинго!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeacherView;
