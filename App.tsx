
import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, GameState, SyncMessage } from './types';
import { SyncService } from './services/syncService';
import TeacherView from './components/TeacherView';
import StudentView from './components/StudentView';

const App: React.FC = () => {
  const [user, setUser] = useState<UserRole>({ role: null, name: '' });
  const [gameState, setGameState] = useState<GameState>({
    currentProblemId: null,
    history: [],
    bingoWinners: []
  });

  const handleSyncMessage = useCallback((msg: SyncMessage) => {
    if (msg.type === 'UPDATE_GAME') {
      setGameState(prev => ({ ...prev, ...msg.payload }));
    } else if (msg.type === 'BINGO_CLAIM') {
      setGameState(prev => ({
        ...prev,
        bingoWinners: [...prev.bingoWinners, msg.payload].sort((a, b) => b.timestamp - a.timestamp)
      }));
    }
  }, []);

  const [syncService] = useState(() => new SyncService(handleSyncMessage));

  useEffect(() => {
    return () => syncService.close();
  }, [syncService]);

  const updateGlobalState = (newState: Partial<GameState>) => {
    const updated = { ...gameState, ...newState };
    setGameState(updated);
    syncService.sendMessage({ type: 'UPDATE_GAME', payload: newState });
  };

  const claimBingo = (name: string) => {
    const winner = { name, timestamp: Date.now() };
    syncService.sendMessage({ type: 'BINGO_CLAIM', payload: winner });
    // Local update
    setGameState(prev => ({
      ...prev,
      bingoWinners: [...prev.bingoWinners, winner].sort((a, b) => b.timestamp - a.timestamp)
    }));
  };

  if (!user.role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Математичко Бинго</h1>
          <p className="text-gray-500 font-medium">Изберете ја вашата улога за да започнете</p>
          
          <div className="space-y-4">
            <button 
              onClick={() => setUser({ role: 'teacher', name: 'Наставник' })}
              className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold text-xl rounded-2xl shadow-lg transition-all active:scale-95"
            >
              <i className="fa-solid fa-chalkboard-user mr-2"></i> Наставник (Admin)
            </button>
            
            <div className="relative pt-4">
              <input 
                type="text" 
                placeholder="Внеси твое име..." 
                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 outline-none transition-colors text-lg"
                value={user.name}
                onChange={(e) => setUser(prev => ({ ...prev, name: e.target.value }))}
              />
              <button 
                disabled={!user.name.trim()}
                onClick={() => setUser(prev => ({ ...prev, role: 'student' }))}
                className={`w-full mt-4 py-4 ${user.name.trim() ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'} text-white font-bold text-xl rounded-2xl shadow-lg transition-all active:scale-95`}
              >
                <i className="fa-solid fa-user-graduate mr-2"></i> Ученик
              </button>
            </div>
          </div>
          
          <p className="text-xs text-gray-400 mt-4 italic">
            * За тестирање во живо, отворете ја истата страница во нов таб.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b-2 border-gray-100 p-4 shadow-sm flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <i className="fa-solid fa-calculator text-lg"></i>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Математичко Бинго</h2>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-600 font-semibold text-sm">
          <i className={`fa-solid ${user.role === 'teacher' ? 'fa-user-tie text-blue-500' : 'fa-user text-green-500'}`}></i>
          {user.name}
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
        {user.role === 'teacher' ? (
          <TeacherView gameState={gameState} updateState={updateGlobalState} />
        ) : (
          <StudentView name={user.name} gameState={gameState} onBingo={claimBingo} />
        )}
      </main>

      <footer className="p-4 text-center text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} Интерактивна Математика - Сите права се задржани
      </footer>
    </div>
  );
};

export default App;
