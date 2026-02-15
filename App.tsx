
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
    setGameState(prev => ({
      ...prev,
      bingoWinners: [winner, ...prev.bingoWinners]
    }));
  };

  if (!user.role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 overflow-hidden relative">
        {/* Decorative Background Blobs */}
        <div className="absolute top-0 -left-20 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 -right-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        
        <div className="max-w-xl w-full glass rounded-[2.5rem] shadow-2xl p-8 md:p-12 text-center space-y-10 z-10 fade-in-up">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-3xl text-white text-4xl shadow-xl mb-4 rotate-3">
              <i className="fa-solid fa-shapes"></i>
            </div>
            <h1 className="text-5xl font-black text-slate-800 tracking-tight">
              Math<span className="text-indigo-600">Bingo</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg">Интерактивно учење кроз игра</p>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="group relative">
              <button 
                onClick={() => setUser({ role: 'teacher', name: 'Професор' })}
                className="w-full p-6 bg-white hover:bg-indigo-50 border-2 border-slate-100 hover:border-indigo-200 rounded-3xl shadow-sm transition-all text-left flex items-center gap-6"
              >
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-chalkboard-user"></i>
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-800">Наставник</h3>
                  <p className="text-sm text-slate-500">Управувајте со задачите и победниците</p>
                </div>
              </button>
            </div>

            <div className="p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2rem] shadow-lg">
              <div className="bg-white rounded-[1.8rem] p-6 space-y-4">
                <input 
                  type="text" 
                  placeholder="Внеси твое име..." 
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-400 outline-none text-lg font-semibold text-slate-700 placeholder:text-slate-300"
                  value={user.name}
                  onChange={(e) => setUser(prev => ({ ...prev, name: e.target.value }))}
                />
                <button 
                  disabled={!user.name.trim()}
                  onClick={() => setUser(prev => ({ ...prev, role: 'student' }))}
                  className={`w-full py-4 rounded-2xl font-extrabold text-xl shadow-md transition-all active:scale-95 ${
                    user.name.trim() 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <i className="fa-solid fa-play mr-2"></i> Приклучи се како ученик
                </button>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest pt-4">
            Вкупно 80 задачи во базата
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <header className="glass border-b border-slate-200 p-4 shadow-sm flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <i className="fa-solid fa-square-root-variable"></i>
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 hidden sm:block">MathBingo</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold text-sm shadow-sm">
            <span className={`w-2 h-2 rounded-full animate-pulse ${user.role === 'teacher' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
            {user.name}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full fade-in-up">
        {user.role === 'teacher' ? (
          <TeacherView gameState={gameState} updateState={updateGlobalState} />
        ) : (
          <StudentView name={user.name} gameState={gameState} onBingo={claimBingo} />
        )}
      </main>

      <footer className="p-6 text-center">
        <p className="text-slate-400 text-sm font-medium">
          Направено за современи училници &bull; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default App;
