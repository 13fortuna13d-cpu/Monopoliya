import React, { useEffect, useState } from 'react';
import { UserProfile, LeaderboardEntry } from '../types/monopoly';
import { Trophy, Award, Coins, Flame, Users, Play, Calendar, ShieldCheck, RefreshCw } from 'lucide-react';
import { soundFx } from '../utils/soundEngine';

interface DashboardProps {
  user: UserProfile | null;
  onStartReplay: (replayId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onStartReplay }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [replays, setReplays] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => setLeaderboard(data))
      .catch(() => {});

    fetch('/api/replays')
      .then(res => res.json())
      .then(data => setReplays(data))
      .catch(() => {});
  }, []);

  const achievementsList = [
    { id: 'first_login', title: 'Empire Citizen', desc: 'Logged into Monopoly Empire platform', icon: '👑', coins: 100 },
    { id: 'first_win', title: 'First Monopoly', desc: 'Won your first multiplayer match', icon: '🏆', coins: 500 },
    { id: 'millionaire', title: 'Tycoon Status', desc: 'Accumulated over $5,000 cash in a match', icon: '💼', coins: 1000 },
    { id: 'builder', title: 'Master Builder', desc: 'Built 5 Hotels across owned properties', icon: '🏨', coins: 750 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in space-y-8">
      
      {/* Profile Overview Card */}
      {user && (
        <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 text-white shadow-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-500/50 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-black">{user.username}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Level {user.level}
                </span>
              </div>
              <p className="text-xs text-indigo-300 mt-1">XP Progress: {user.xp}/500</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-center">
            <div>
              <p className="text-2xl font-black text-amber-400">🪙 {user.coins}</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Coins</p>
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-400">{user.wins}</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Wins</p>
            </div>
            <div>
              <p className="text-2xl font-black text-indigo-400">{user.totalGames}</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Games</p>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Leaderboard & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Leaderboard Column */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Global Leaderboard
            </h3>
            <span className="text-xs font-bold text-slate-400 uppercase">Top Tycoons</span>
          </div>

          <div className="space-y-3">
            {leaderboard.map((item) => (
              <div
                key={item.rank}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center ${
                    item.rank === 1 ? 'bg-amber-400 text-slate-950' : item.rank === 2 ? 'bg-slate-300 text-slate-950' : item.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    #{item.rank}
                  </span>
                  <img src={item.avatar} alt={item.username} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{item.username}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.wins} Wins • Lvl {item.level}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold font-mono text-amber-500">🪙 {item.coins}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Replay History Column */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-indigo-600" />
              Match Replay System
            </h3>
            <span className="text-xs font-bold text-slate-400 uppercase">Recorded Games</span>
          </div>

          {replays.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-12">No recorded replays yet. Play a match to save logs!</p>
          ) : (
            <div className="space-y-3">
              {replays.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Winner: 🏆 {rep.winner}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{rep.logs.length} Steps Logged • {rep.date}</p>
                  </div>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onStartReplay(rep.id);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    Replay
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
