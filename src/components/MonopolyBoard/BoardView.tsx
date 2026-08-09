import React, { useState } from 'react';
import { BoardTile, GameState } from '../../types/monopoly';
import { MonopolyBoard } from '../MonopolyBoard';
import { GameHUD } from '../GameHUD';
import { CardModal } from './CardModal';
import { ArrowLeft, Trophy, Crown, RefreshCw } from 'lucide-react';
import { soundFx } from '../../utils/soundEngine';

interface BoardViewProps {
  game: GameState;
  myPlayerId: string;
  onRollDice: () => void;
  onBuyProperty: (tileId: number) => void;
  onBuildHouse: (tileId: number) => void;
  onEndTurn: () => void;
  onProposeTrade: (targetId: string, offerCash: number, requestCash: number) => void;
  onSendMessage: (text: string, emoji?: string) => void;
  onLeaveGame: () => void;
}

export const BoardView: React.FC<BoardViewProps> = ({
  game,
  myPlayerId,
  onRollDice,
  onBuyProperty,
  onBuildHouse,
  onEndTurn,
  onSendMessage,
  onLeaveGame
}) => {
  const [selectedTile, setSelectedTile] = useState<BoardTile | null>(null);
  const [showCardModal, setShowCardModal] = useState(true);

  const activePlayer = game.players[game.currentPlayerIndex];
  const isMyTurn = activePlayer?.id === myPlayerId;

  return (
    <div className="min-h-[calc(100vh-4rem)] p-2 sm:p-4 md:p-6 bg-slate-950 text-white flex flex-col gap-4">
      {/* Top Game Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundFx.playClick();
              onLeaveGame();
            }}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Leave Game</span>
          </button>

          <div>
            <h2 className="text-sm sm:text-lg font-black text-white flex items-center gap-2">
              {game.roomName}
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                {game.mode} Mode
              </span>
            </h2>
          </div>
        </div>

        {/* Turn Indicator Banner */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700">
            <div
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: activePlayer?.color || '#3b82f6' }}
            />
            <span className="text-xs font-bold">
              Turn: <span className="text-white">{activePlayer?.name || 'Player'}</span>
            </span>
            {isMyTurn && (
              <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500 text-slate-950">
                YOUR TURN
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Board + Game HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Board View Area */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-slate-900/50 border border-slate-800/80 p-2 sm:p-4 rounded-3xl overflow-x-auto min-h-[500px]">
          <MonopolyBoard
            properties={game.properties}
            players={game.players}
            currentPlayerIndex={game.currentPlayerIndex}
            dice={game.dice}
            onTileClick={(tile) => setSelectedTile(tile)}
          />
        </div>

        {/* HUD Controls & Info Area */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <GameHUD
            game={game}
            currentPlayerId={myPlayerId}
            selectedTile={selectedTile}
            onRollDice={onRollDice}
            onBuyProperty={onBuyProperty}
            onBuildHouse={onBuildHouse}
            onEndTurn={onEndTurn}
            onSendChat={onSendMessage}
          />
        </div>
      </div>

      {/* Chance / Community Card Modal */}
      {game.activeCard && showCardModal && (
        <CardModal
          card={game.activeCard}
          onClose={() => setShowCardModal(false)}
        />
      )}

      {/* Game Ended Winner Overlay */}
      {game.status === 'ended' && game.winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-8 text-center shadow-2xl">
            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>

            <span className="text-xs font-black uppercase tracking-widest text-amber-400">Match Victory!</span>
            <h2 className="text-3xl font-black text-white my-2">{game.winner.name}</h2>
            <p className="text-xs text-slate-400 mb-6">Congratulations! You are the Monopoly Empire Tycoon!</p>

            <button
              onClick={onLeaveGame}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg cursor-pointer"
            >
              Return to Lobby
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
