import React, { useState } from 'react';
import { BoardTile, GameState, Player, PropertyState } from '../types/monopoly';
import { BOARD_TILES, COLOR_HEX, COLOR_GROUP_MAP } from '../data/boardData';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Send, Building, Home, ShieldAlert, ArrowRight, DollarSign, MessageSquare, History } from 'lucide-react';
import { t } from '../utils/translations';
import { soundFx } from '../utils/soundEngine';

interface GameHUDProps {
  game: GameState;
  currentPlayerId: string;
  selectedTile: BoardTile | null;
  onRollDice: () => void;
  onBuyProperty: (tileId: number) => void;
  onBuildHouse: (tileId: number) => void;
  onEndTurn: () => void;
  onPayJailFine: () => void;
  onUseJailCard: () => void;
  onSendChat: (text: string, emoji?: string) => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  game,
  currentPlayerId,
  selectedTile,
  onRollDice,
  onBuyProperty,
  onBuildHouse,
  onEndTurn,
  onPayJailFine,
  onUseJailCard,
  onSendChat
}) => {
  const [chatInput, setChatInput] = useState('');
  const [activeTab, setActiveTab] = useState<'players' | 'chat' | 'logs'>('players');

  const activePlayer = game.players[game.currentPlayerIndex];
  const isMyTurn = activePlayer?.id === currentPlayerId;

  const myPlayer = game.players.find(p => p.id === currentPlayerId);
  const currentTile = myPlayer ? BOARD_TILES[myPlayer.position] : null;
  const currentPropertyState = currentTile ? game.properties[currentTile.id] : null;
  const ownsFullGroup = !!currentPlayerId && !!selectedTile?.group &&
    (COLOR_GROUP_MAP[selectedTile.group] || []).every(id => game.properties[id]?.ownerId === currentPlayerId);

  const canBuyCurrentTile = 
    isMyTurn &&
    game.hasRolled &&
    currentTile &&
    (currentTile.type === 'property' || currentTile.type === 'railroad' || currentTile.type === 'utility') &&
    currentPropertyState?.ownerId === null &&
    currentTile.price &&
    (myPlayer?.money || 0) >= currentTile.price;

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !myPlayer) return;
    soundFx.playClick();
    onSendChat(chatInput.trim());
    setChatInput('');
  };

  const renderDiceIcon = (val: number) => {
    switch (val) {
      case 1: return <Dice1 className="w-8 h-8 text-indigo-600" />;
      case 2: return <Dice2 className="w-8 h-8 text-indigo-600" />;
      case 3: return <Dice3 className="w-8 h-8 text-indigo-600" />;
      case 4: return <Dice4 className="w-8 h-8 text-indigo-600" />;
      case 5: return <Dice5 className="w-8 h-8 text-indigo-600" />;
      default: return <Dice6 className="w-8 h-8 text-indigo-600" />;
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6">
      
      {/* Left Control Column */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        
        {/* Turn Status Panel */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Current Turn</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              {game.currentTurnTimer}s remaining
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-base shadow-sm"
              style={{ backgroundColor: activePlayer?.color }}
            >
              {activePlayer?.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{activePlayer?.name}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">${activePlayer?.money}</p>
            </div>
          </div>

          {/* Turn Action Buttons */}
          <div className="space-y-2">
            {isMyTurn && myPlayer?.inJail && !game.hasRolled && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25">
                <p className="text-[11px] font-black text-amber-500 mb-2">🔒 QAMOQDA • {myPlayer.jailTurns}/3 urinish</p>
                <div className="grid grid-cols-2 gap-2">
                  {myPlayer.money >= 50 && (
                    <button
                      onClick={() => { soundFx.playCashRegister(); onPayJailFine(); }}
                      className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] cursor-pointer"
                    >
                      $50 TO‘LASH
                    </button>
                  )}
                  {myPlayer.hasJailCard && (
                    <button
                      onClick={() => { soundFx.playClick(); onUseJailCard(); }}
                      className="py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] cursor-pointer"
                    >
                      KARTANI ISHLATISH
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {isMyTurn && !game.hasRolled && (
              <button
                onClick={() => {
                  soundFx.playDiceRoll();
                  onRollDice();
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  {renderDiceIcon(game.dice[0])}
                  {renderDiceIcon(game.dice[1])}
                </div>
                <span>{myPlayer?.inJail ? 'ROLL FOR DOUBLES' : t('en', 'rollDice')}</span>
              </button>
            )}

            {canBuyCurrentTile && (
              <button
                onClick={() => {
                  soundFx.playBuyProperty();
                  if (currentTile) onBuyProperty(currentTile.id);
                }}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Building className="w-4 h-4" />
                Buy {currentTile?.name} (${currentTile?.price})
              </button>
            )}

            {isMyTurn && game.hasRolled && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onEndTurn();
                }}
                className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {t('en', 'endTurn')}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

          </div>
        </div>

        {/* Selected Tile Inspector */}
        {selectedTile && (
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Property Info</span>
              {selectedTile.group && (
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase"
                  style={{ backgroundColor: COLOR_HEX[selectedTile.group] }}
                >
                  {selectedTile.group}
                </span>
              )}
            </div>

            <h4 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">{selectedTile.name}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{selectedTile.description || 'Standard Monopoly Estate'}</p>

            {selectedTile.price && (
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold mb-3">
                <div>
                  <span className="text-slate-400 block text-[10px]">PRICE</span>
                  <span className="text-emerald-600 font-bold">${selectedTile.price}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">BASE RENT</span>
                  <span className="text-indigo-600 font-bold">${selectedTile.rent ? selectedTile.rent[0] : 'N/A'}</span>
                </div>
              </div>
            )}

            {/* Build House button if owned by player */}
            {isMyTurn && game.properties[selectedTile.id]?.ownerId === currentPlayerId && selectedTile.houseCost && (
              ownsFullGroup ? <button
                onClick={() => {
                  soundFx.playCashRegister();
                  onBuildHouse(selectedTile.id);
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                Build House (${selectedTile.houseCost})
              </button> : (
                <p className="text-[10px] text-slate-400 mt-2">Uy qurish uchun shu rangdagi barcha mulklar sizniki bo‘lishi kerak.</p>
              )
            )}
          </div>
        )}

      </div>

      {/* Right Drawer Column (Players, Chat, Move Logs) */}
      <div className="flex-1 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        
        {/* Tab Header */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
          <button
            onClick={() => setActiveTab('players')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'players' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Players ({game.players.length})
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'chat' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Game Chat ({game.chat.length})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'logs' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Move Logs ({game.logs.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-h-[220px] max-h-[280px] overflow-y-auto space-y-3 pr-2">
          
          {activeTab === 'players' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {game.players.map((p) => (
                <div
                  key={p.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                    p.isBankrupt
                      ? 'bg-rose-500/10 border-rose-500/20 opacity-60'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white text-xs shadow-xs"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{p.name}</p>
                      <p className="text-[10px] text-slate-400">Pos: {p.position} ({BOARD_TILES[p.position]?.name})</p>
                    </div>
                  </div>
                  <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {p.isBankrupt ? 'BANKRUPT' : `$${p.money}`}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="space-y-2">
              {game.chat.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">No messages yet. Say hello!</p>
              ) : (
                game.chat.map((msg) => (
                  <div key={msg.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{msg.senderName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200">{msg.text}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-2">
              {game.logs.map((log) => (
                <div key={log.id} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-[11px] flex items-start gap-2">
                  <span className="font-bold text-indigo-500 font-mono">#{log.stepNumber}</span>
                  <p className="text-slate-700 dark:text-slate-300">{log.details}</p>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Chat Input Bar */}
        {activeTab === 'chat' && (
          <form onSubmit={handleChatSubmit} className="mt-4 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={t('en', 'typeMessage')}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>

    </div>
  );
};
