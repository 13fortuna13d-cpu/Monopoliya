import React, { useState } from 'react';
import { Copy, Check, Users, Bot, Play, Mic, MicOff, MessageSquare, Shield, Crown } from 'lucide-react';
import { Language, Player, Room } from '../types/monopoly';
import { t } from '../utils/translations';
import { soundFx } from '../utils/soundEngine';

interface LobbyProps {
  room: Room;
  currentPlayerId: string;
  language: Language;
  onToggleReady: () => void;
  onAddBot: () => void;
  onStartGame: () => void;
  onLeaveRoom: () => void;
}

export const Lobby: React.FC<LobbyProps> = ({
  room,
  currentPlayerId,
  language,
  onToggleReady,
  onAddBot,
  onStartGame,
  onLeaveRoom
}) => {
  const [copied, setCopied] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const isHost = room.hostId === currentPlayerId;
  const me = room.players.find(p => p.id === currentPlayerId);
  const allPlayersReady = room.players.every(p => p.isReady || p.isBot);
  const canStart = isHost && (allPlayersReady || room.players.length === 1);

  const copyCode = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{room.name}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {room.mode}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Waiting for players ({room.players.length}/{room.maxPlayers})
          </p>
        </div>

        {/* Room Code Copy Pill */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="px-3 py-1 bg-white dark:bg-slate-900 rounded-xl font-mono text-sm font-black text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-800">
            {room.code}
          </div>
          <button
            onClick={copyCode}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? t(language, 'copied') : t(language, 'copyLink')}
          </button>
        </div>
      </div>

      {/* Players List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {room.players.map((player) => (
          <div
            key={player.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg text-white shadow-md relative"
                style={{ backgroundColor: player.color }}
              >
                {player.name.charAt(0)}
                {player.id === room.hostId && (
                  <div className="absolute -top-1 -right-1 p-0.5 rounded-full bg-amber-400 text-slate-950" title="Host">
                    <Crown className="w-3 h-3 fill-current" />
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  {player.name}
                  {player.isBot && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      BOT
                    </span>
                  )}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Starting: ${player.money}</p>
              </div>
            </div>

            {/* Status Pill */}
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  player.isReady
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                    : 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                }`}
              >
                {player.isReady ? t(language, 'ready') : t(language, 'notReady')}
              </span>
            </div>
          </div>
        ))}

        {/* Empty Slot / Add Bot card */}
        {room.players.length < room.maxPlayers && (
          <div
            onClick={() => {
              soundFx.playClick();
              onAddBot();
            }}
            className="p-5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-indigo-500 flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-all"
          >
            <Bot className="w-5 h-5" />
            <span className="text-xs font-bold">{t(language, 'addBot')}</span>
          </div>
        )}
      </div>

      {/* Voice Room & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              isMuted
                ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
            }`}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {isMuted ? t(language, 'unmute') : t(language, 'mute')} Voice
          </button>
          <span className="text-xs text-slate-500 dark:text-slate-400">Voice Room Active</span>
        </div>

        <div className="flex items-center gap-3">
          
          {!isHost && (
            <button
              onClick={() => {
                soundFx.playClick();
                onToggleReady();
              }}
              className={`px-6 py-3 rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer ${
                me?.isReady
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
            >
              {me?.isReady ? t(language, 'notReady') : t(language, 'ready')}
            </button>
          )}

          {isHost && (
            <button
              disabled={!canStart}
              onClick={() => {
                soundFx.playVictory();
                onStartGame();
              }}
              className={`px-8 py-3.5 rounded-2xl font-bold text-xs shadow-xl transition-all flex items-center gap-2 cursor-pointer ${
                canStart
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:scale-105 shadow-emerald-500/20'
                  : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              {room.players.length === 1
                ? (language === 'uz' ? 'Bot bilan boshlash' : language === 'ru' ? 'Начать с ботом' : 'Start vs Bot')
                : t(language, 'startGame')}
            </button>
          )}

          <button
            onClick={() => {
              soundFx.playClick();
              onLeaveRoom();
            }}
            className="px-4 py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 font-bold text-xs transition-all cursor-pointer"
          >
            Leave
          </button>

        </div>

      </div>

    </div>
  );
};
