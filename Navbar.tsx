import React from 'react';
import { Volume2, VolumeX, Moon, Sun, Globe, User, ShieldAlert, Sparkles, Trophy, LogOut } from 'lucide-react';
import { Language, UserProfile } from '../types/monopoly';
import { t } from '../utils/translations';
import { soundFx } from '../utils/soundEngine';

interface NavbarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
  onOpenAdmin: () => void;
  onGoHome: () => void;
  activeView: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  setLanguage,
  darkMode,
  setDarkMode,
  soundEnabled,
  setSoundEnabled,
  user,
  onOpenAuth,
  onOpenDashboard,
  onOpenAdmin,
  onGoHome,
  activeView
}) => {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-white font-black text-xl tracking-tighter">
              M
            </div>
          </div>
          <div>
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent tracking-tight">
              Monopoly Empire
            </span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full">
              LIVE MULTIPLAYER
            </span>
          </div>
        </button>

        {/* Center Nav Items */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-full border border-slate-200 dark:border-slate-800">
          <button
            onClick={onGoHome}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeView === 'home'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Home
          </button>
          <button
            onClick={onOpenDashboard}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeView === 'dashboard'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            Dashboard
          </button>
          <button
            onClick={onOpenAdmin}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeView === 'admin'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Admin
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Sound Toggle */}
          <button
            onClick={() => {
              soundFx.enabled = !soundEnabled;
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) soundFx.playClick();
            }}
            title="Toggle Sound Effects"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-800"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Dark / Light Mode */}
          <button
            onClick={() => {
              soundFx.playClick();
              setDarkMode(!darkMode);
            }}
            title="Toggle Dark/Light Mode"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-800"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center bg-slate-100 dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-800">
            <Globe className="w-3.5 h-3.5 ml-1.5 text-slate-400" />
            <select
              value={language}
              onChange={(e) => {
                soundFx.playClick();
                setLanguage(e.target.value as Language);
              }}
              className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 py-1 pl-1 pr-2 rounded-lg cursor-pointer focus:outline-none"
            >
              <option value="en">EN</option>
              <option value="uz">UZ</option>
              <option value="ru">RU</option>
            </select>
          </div>

          {/* User Profile / Auth Button */}
          {user ? (
            <button
              onClick={onOpenDashboard}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/50 hover:border-indigo-400 transition-all cursor-pointer"
            >
              <img
                src={user.avatar}
                alt={user.username}
                className="w-7 h-7 rounded-lg object-cover ring-2 ring-indigo-500/30"
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{user.username}</p>
                <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">Lvl {user.level} • 🪙 {user.coins}</p>
              </div>
            </button>
          ) : (
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenAuth();
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              {t(language, 'login')}
            </button>
          )}

        </div>

      </div>
    </nav>
  );
};
