import React, { useEffect, useState } from 'react';
import { UserProfile, LeaderboardEntry } from '../types/monopoly';
import { Trophy, Play, Target, WalletCards, Medal, Crown } from 'lucide-react';
import { soundFx } from '../utils/soundEngine';

interface DashboardProps {
  user: UserProfile | null;
  onStartReplay: (replayId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onStartReplay }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [replays, setReplays] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/leaderboard').then(res => res.json()).then(setLeaderboard).catch(() => {});
    fetch('/api/replays').then(res => res.json()).then(setReplays).catch(() => {});
  }, []);

  const achievementsList = [
    { id: 'first_login', title: 'Empire Citizen', desc: 'Logged into Monopoly Empire platform', icon: '👑', coins: 100 },
    { id: 'first_win', title: 'First Monopoly', desc: 'Won your first multiplayer match', icon: '🏆', coins: 500 },
    { id: 'millionaire', title: 'Tycoon Status', desc: 'Accumulated over $5,000 cash in a match', icon: '💼', coins: 1000 },
    { id: 'builder', title: 'Master Builder', desc: 'Built 5 Hotels across owned properties', icon: '🏨', coins: 750 }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-5 sm:py-8 animate-fade-in space-y-5 sm:space-y-8">
      {user && (
        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 text-white border border-indigo-500/20 shadow-2xl">
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative p-4 sm:p-6 lg:p-8 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_auto] gap-6 items-center">
            <div className="min-w-0 flex items-center gap-3 sm:gap-5">
              <img
                src={user.avatar}
                alt={user.username}
                className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-indigo-400/30 shadow-xl"
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-black truncate max-w-full">{user.username}</h2>
                  <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-black bg-amber-400/15 text-amber-300 border border-amber-400/20">
                    LEVEL {user.level}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-indigo-200/80 mt-1">Monopoly Empire Tycoon</p>
                <div className="mt-3 w-full max-w-md">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                    <span>XP PROGRESS</span><span>{user.xp}/500</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-400" style={{ width: `${Math.min(100, (user.xp / 500) * 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full xl:w-auto">
              {[
                { label: 'Coins', value: `🪙 ${user.coins}`, cls: 'text-amber-300', icon: WalletCards },
                { label: 'Wins', value: user.wins, cls: 'text-emerald-300', icon: Crown },
                { label: 'Games', value: user.totalGames, cls: 'text-indigo-300', icon: Target }
              ].map(stat => (
                <div key={stat.label} className="min-w-0 sm:min-w-[110px] p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <stat.icon className={`w-4 h-4 mx-auto mb-1 ${stat.cls}`} />
                  <p className={`text-base sm:text-xl font-black truncate ${stat.cls}`}>{stat.value}</p>
                  <p className="text-[9px] text-slate-400 uppercase font-black">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 sm:gap-8">
        <section className="xl:col-span-7 p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" /> Global Leaderboard
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase">Top Tycoons</span>
          </div>
          <div className="space-y-2.5">
            {leaderboard.map(item => (
              <div key={item.rank} className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3 min-w-0">
                <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
                  <span className="shrink-0 w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">#{item.rank}</span>
                  <img src={item.avatar} alt={item.username} className="shrink-0 w-9 h-9 rounded-xl object-cover" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.username}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{item.wins} Wins • Lvl {item.level}</p>
                  </div>
                </div>
                <p className="shrink-0 text-xs sm:text-sm font-bold font-mono text-amber-500">🪙 {item.coins}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="xl:col-span-5 p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-indigo-600" /> Match Replay
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase">Recorded Games</span>
          </div>

          {replays.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-10">No recorded replays yet. Play a match to save logs!</p>
          ) : (
            <div className="space-y-2.5">
              {replays.map(rep => (
                <div key={rep.id} className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">🏆 Winner: {rep.winner}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{rep.logs.length} steps • {rep.date}</p>
                  </div>
                  <button onClick={() => { soundFx.playClick(); onStartReplay(rep.id); }} className="shrink-0 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all">
                    Replay
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <Medal className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">Achievements</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {achievementsList.map(a => (
            <div key={a.id} className={`p-4 rounded-2xl border ${user?.achievements.includes(a.id) ? 'border-amber-400/30 bg-amber-50 dark:bg-amber-500/5' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'}`}>
              <div className="text-2xl">{a.icon}</div>
              <p className="mt-2 text-sm font-black text-slate-900 dark:text-white">{a.title}</p>
              <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">{a.desc}</p>
              <p className="mt-2 text-[10px] font-black text-amber-500">+{a.coins} coins</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
