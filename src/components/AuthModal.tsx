import React, { useState } from 'react';
import { X, User, Lock, Mail, Sparkles, CheckCircle, Github } from 'lucide-react';
import { Language, UserProfile } from '../types/monopoly';
import { t } from '../utils/translations';
import { soundFx } from '../utils/soundEngine';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onAuthenticate: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  language,
  onAuthenticate
}) => {
  if (!isOpen) return null;

  const [tab, setTab] = useState<'login' | 'register' | 'guest'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [remember, setRemember] = useState(true);

  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80'
  ];

  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playCashRegister();

    const finalName = username.trim() || (tab === 'guest' ? `Guest_${Math.floor(Math.random() * 8999 + 1000)}` : 'MonopolyPlayer');

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      username: finalName,
      avatar: selectedAvatar,
      coins: tab === 'guest' ? 500 : 2000,
      level: 1,
      xp: 0,
      wins: 0,
      totalGames: 0,
      highestMoney: tab === 'guest' ? 500 : 2000,
      friends: [],
      achievements: ['first_login']
    };

    onAuthenticate(newUser);
    onClose();
  };

  const handleOAuth = (provider: string) => {
    soundFx.playCashRegister();
    const oauthUser: UserProfile = {
      id: `oauth_${provider}_${Date.now()}`,
      username: `${provider}_Player`,
      avatar: selectedAvatar,
      coins: 2500,
      level: 2,
      xp: 150,
      wins: 1,
      totalGames: 2,
      highestMoney: 2500,
      friends: [],
      achievements: ['oauth_connected']
    };
    onAuthenticate(oauthUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
        
        {/* Close Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-500/30">
            M
          </div>
          <h3 className="text-2xl font-black">{t(language, 'welcomeBack')}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Connect to track achievements, wins, and leaderboard rank
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              tab === 'login' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t(language, 'login')}
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              tab === 'register' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t(language, 'register')}
          </button>
          <button
            type="button"
            onClick={() => setTab('guest')}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              tab === 'guest' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Guest
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {tab !== 'guest' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t(language, 'username')}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {tab === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {tab !== 'guest' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t(language, 'password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Select Avatar
            </label>
            <div className="flex items-center gap-3">
              {avatars.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Avatar ${idx}`}
                  onClick={() => setSelectedAvatar(img)}
                  className={`w-10 h-10 rounded-xl object-cover cursor-pointer transition-all ${
                    selectedAvatar === img ? 'ring-4 ring-indigo-500 scale-105' : 'opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all cursor-pointer mt-4"
          >
            {tab === 'login' ? t(language, 'login') : tab === 'register' ? t(language, 'register') : t(language, 'guest')}
          </button>

        </form>

        {/* OAuth Dividers */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800" /></div>
          <span className="relative px-3 bg-white dark:bg-slate-900 text-[10px] text-slate-400 font-bold uppercase">Or Quick OAuth</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleOAuth('Google')}
            className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            Google
          </button>
          <button
            onClick={() => handleOAuth('Discord')}
            className="py-2.5 px-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            Discord
          </button>
          <button
            onClick={() => handleOAuth('GitHub')}
            className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            GitHub
          </button>
        </div>

      </div>
    </div>
  );
};
