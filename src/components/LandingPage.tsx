import React, { useState } from 'react';
import { Play, Plus, Users, Sparkles, Shield, Volume2, Award, ArrowRight, Zap, RefreshCw, MessageSquare } from 'lucide-react';
import { Language, Room, UserProfile } from '../types/monopoly';
import { t } from '../utils/translations';
import { soundFx } from '../utils/soundEngine';

interface LandingPageProps {
  language: Language;
  user: UserProfile | null;
  publicRooms: Room[];
  onCreateRoomModal: () => void;
  onJoinRoomModal: () => void;
  onQuickPlay: () => void;
  onJoinSpecificRoom: (roomCode: string) => void;
  onRefreshRooms: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  language,
  user,
  publicRooms,
  onCreateRoomModal,
  onJoinRoomModal,
  onQuickPlay,
  onJoinSpecificRoom,
  onRefreshRooms
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: language === 'uz' ? 'Monopoly Empire o\'yini bepulmi?' : language === 'ru' ? 'Игра Монополия бесплатна?' : 'Is Monopoly Empire free to play?',
      a: language === 'uz' ? 'Ha, platforma to\'liq bepul! Registratsiyasiz mehmon sifatida ham o\'ynashingiz mumkin.' : language === 'ru' ? 'Да, платформа полностью бесплатна! Вы можете играть как гость без регистрации.' : 'Yes! You can play completely free with friends or online players without any cost.'
    },
    {
      q: language === 'uz' ? 'Nechta o\'yinchi qatnashishi mumkin?' : language === 'ru' ? 'Сколько игроков могут играть?' : 'How many players can join a room?',
      a: language === 'uz' ? 'Har bir xonada 2 tadan 6 tagacha real o\'yinchilar yoki AI botlar qatnashishi mumkin.' : language === 'ru' ? 'В каждой комнате могут играть от 2 до 6 игроков или ИИ-ботов.' : 'Each room supports 2 to 6 real players or AI bots.'
    },
    {
      q: language === 'uz' ? 'O\'yin qayta tiklanishi (Reconnect) bormi?' : language === 'ru' ? 'Есть ли переподключение при обрыве связи?' : 'Does the game support reconnecting?',
      a: language === 'uz' ? 'Ha, internet uzilsa xona kodi orqali qayta kirishingiz va o\'yinni davom ettirishingiz mumkin.' : language === 'ru' ? 'Да, вы можете повторно подключиться по коду комнаты.' : 'Yes! Auto-reconnect syncs your position and properties instantly.'
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-x-hidden">
      
      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 w-full">
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>Next-Gen Multiplayer Board Engine</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
              {t(language, 'heroTitle').split('Monopoly')[0]}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Monopoly
              </span>
              {t(language, 'heroTitle').split('Monopoly')[1] || ''}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {t(language, 'heroSubtitle')}
            </p>

            {/* Main CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              
              <button
                onClick={() => {
                  soundFx.playClick();
                  onCreateRoomModal();
                }}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                {t(language, 'createRoom')}
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onJoinRoomModal();
                }}
                className="px-6 py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold text-sm shadow-lg transition-all hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                {t(language, 'joinRoom')}
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onQuickPlay();
                }}
                className="px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm transition-all flex items-center gap-2 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-500" />
                {t(language, 'quickPlay')}
              </button>

            </div>

            {/* Live Stats Pill */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 max-w-lg">
              <div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">1,420+</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t(language, 'onlinePlayers')}</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">18,900+</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t(language, 'totalGamesPlayed')}</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-emerald-500">99.9%</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Uptime Latency</p>
              </div>
            </div>

          </div>

          {/* Right Visual 3D Monopoly Board Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl p-6 bg-gradient-to-b from-slate-900 via-slate-900/90 to-indigo-950 text-white shadow-2xl border border-slate-800 overflow-hidden transform hover:rotate-1 transition-transform duration-500">
              
              {/* Card Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">Live Board Sync</span>
                </div>
                <span className="text-xs font-mono bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-500/30">
                  Socket.IO Active
                </span>
              </div>

              {/* Board Graphics Mockup */}
              <div className="grid grid-cols-3 gap-3 my-4">
                
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
                  <div className="w-8 h-8 mx-auto mb-2 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center">
                    🏰
                  </div>
                  <p className="text-xs font-bold text-amber-300">Boardwalk</p>
                  <p className="text-[10px] text-amber-400/80">$400 • Dark Blue</p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                  <div className="w-8 h-8 mx-auto mb-2 rounded-xl bg-indigo-500 text-white font-black flex items-center justify-center">
                    🎲
                  </div>
                  <p className="text-xs font-bold text-indigo-300">Double Roll</p>
                  <p className="text-[10px] text-indigo-400/80">Extra Turn!</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <div className="w-8 h-8 mx-auto mb-2 rounded-xl bg-emerald-500 text-white font-black flex items-center justify-center">
                    💵
                  </div>
                  <p className="text-xs font-bold text-emerald-300">Passed GO</p>
                  <p className="text-[10px] text-emerald-400/80">+$200 Cash</p>
                </div>

              </div>

              {/* Sample Turn Status */}
              <div className="mt-6 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-sm">
                    P1
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Player #1 Turn</p>
                    <p className="text-[10px] text-slate-400">Time remaining: 24s</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  Turn Active
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Active Public Lobbies Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-indigo-600" />
              {t(language, 'activeLobbies')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Join an open lobby directly and start playing right now</p>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onRefreshRooms();
            }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        {publicRooms.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">{t(language, 'noLobbies')}</p>
            <button
              onClick={onCreateRoomModal}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-500/20 hover:bg-indigo-500 cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              {t(language, 'createRoomBtn')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {publicRooms.map((room) => (
              <div
                key={room.code}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{room.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                      #{room.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Mode: <span className="font-semibold text-slate-700 dark:text-slate-300 uppercase">{room.mode}</span> • Players: {room.players.length}/{room.maxPlayers}
                  </p>
                </div>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onJoinSpecificRoom(room.code);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1"
                >
                  Join
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div className="bg-slate-100/70 dark:bg-slate-900/40 py-16 border-y border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Full-Featured Multiplayer Engine</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Built with real-time Socket.IO synchronization, instant voice room state, and move replays</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Real-time Socket Sync</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Dice rolls, player movement along 40 board spaces, property purchases, and rent transfers happen seamlessly with zero latency.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">In-Game Chat & Voice Room</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Communicate with property trade proposals, quick reaction emojis, and real-time voice room indicators.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Replays & Leaderboard</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Every move is recorded in step logs. Watch full match replays at x2 or x4 speed and climb the global rankings.
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer shadow-sm transition-all"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{faq.q}</p>
                <span className="text-indigo-600 dark:text-indigo-400 font-black text-lg">
                  {activeFaq === idx ? '−' : '+'}
                </span>
              </div>
              {activeFaq === idx && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 bg-white dark:bg-slate-950 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Monopoly Empire Platform. All rights reserved.</p>
          <p className="text-[11px]">Crafted with React, Express, Socket.IO & Tailwind CSS</p>
        </div>
      </footer>

    </div>
  );
};
