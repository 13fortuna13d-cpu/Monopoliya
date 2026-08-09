import React, { useState } from 'react';
import { X, Lock, Users, Zap, Plus, Globe } from 'lucide-react';
import { GameMode, Language } from '../types/monopoly';
import { t } from '../utils/translations';
import { soundFx } from '../utils/soundEngine';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onCreateRoom: (data: { roomName: string; password?: string; maxPlayers: number; isPrivate: boolean; mode: GameMode }) => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  language,
  onCreateRoom
}) => {
  if (!isOpen) return null;

  const [roomName, setRoomName] = useState('');
  const [password, setPassword] = useState('');
  const [maxPlayers, setMaxPlayers] = useState<number>(4);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [mode, setMode] = useState<GameMode>('classic');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playCashRegister();
    onCreateRoom({
      roomName: roomName.trim() || 'Monopoly Lounge',
      password: password.trim() || undefined,
      maxPlayers,
      isPrivate,
      mode
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
        
        <button
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black">{t(language, 'createRoom')}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Configure your lobby settings and invite friends</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t(language, 'roomName')}
            </label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g. Empire Masters"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t(language, 'passwordOptional')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave empty for public"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Max Players Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t(language, 'maxPlayers')}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setMaxPlayers(num)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    maxPlayers === num
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {num} Players
                </button>
              ))}
            </div>
          </div>

          {/* Game Mode Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t(language, 'gameMode')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMode('classic')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  mode === 'classic'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <p className="text-xs font-bold">{t(language, 'classicMode')}</p>
                <p className="text-[10px] opacity-75 mt-0.5">$1,500 Cash</p>
              </button>

              <button
                type="button"
                onClick={() => setMode('fast')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  mode === 'fast'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <p className="text-xs font-bold">{t(language, 'fastMode')}</p>
                <p className="text-[10px] opacity-75 mt-0.5">$2,500 Cash</p>
              </button>

              <button
                type="button"
                onClick={() => setMode('custom')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  mode === 'custom'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <p className="text-xs font-bold">{t(language, 'customMode')}</p>
                <p className="text-[10px] opacity-75 mt-0.5">Flexible Rules</p>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all cursor-pointer mt-4"
          >
            {t(language, 'createRoomBtn')}
          </button>

        </form>

      </div>
    </div>
  );
};
