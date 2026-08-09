import React, { useState } from 'react';
import { BoardTile, Player, PropertyState } from '../types/monopoly';
import { BOARD_TILES, COLOR_HEX } from '../data/boardData';
import { ZoomIn, ZoomOut, RotateCcw, Building, Lock, Home, Sparkles } from 'lucide-react';

interface MonopolyBoardProps {
  properties: Record<number, PropertyState>;
  players: Player[];
  currentPlayerIndex: number;
  dice: [number, number];
  onTileClick: (tile: BoardTile) => void;
}

export const MonopolyBoard: React.FC<MonopolyBoardProps> = ({
  properties,
  players,
  currentPlayerIndex,
  dice,
  onTileClick
}) => {
  const [zoom, setZoom] = useState<number>(1);

  // Classify tiles into corners, top, bottom, left, right
  // Bottom: 0 to 10
  // Left: 10 to 20
  // Top: 20 to 30
  // Right: 30 to 39

  const getPlayersAtTile = (tileId: number) => {
    return players.filter(p => !p.isBankrupt && p.position === tileId);
  };

  const renderTileContent = (tile: BoardTile) => {
    const prop = properties[tile.id];
    const tilePlayers = getPlayersAtTile(tile.id);
    const owner = tilePlayers.length > 0 ? null : (prop?.ownerId ? players.find(p => p.id === prop.ownerId) : null);

    return (
      <div
        onClick={() => onTileClick(tile)}
        className={`relative flex flex-col justify-between p-1 text-[10px] sm:text-xs font-semibold cursor-pointer select-none transition-all hover:brightness-110 border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 ${
          owner ? 'ring-2 ring-inset' : ''
        }`}
        style={{
          borderColor: owner ? owner.color : undefined
        }}
      >
        {/* Color Bar for Property */}
        {tile.group && (
          <div
            className="w-full h-3 sm:h-4 rounded-xs mb-1 flex items-center justify-between px-1 text-[8px] text-white font-black"
            style={{ backgroundColor: COLOR_HEX[tile.group] }}
          >
            {prop && prop.houses > 0 && (
              <span className="flex items-center gap-0.5">
                {prop.houses === 5 ? '🏨' : `🏠${prop.houses}`}
              </span>
            )}
          </div>
        )}

        {/* Tile Title */}
        <div className="leading-tight text-center truncate font-bold text-slate-800 dark:text-slate-200">
          {tile.name}
        </div>

        {/* Price or Rent */}
        {tile.price && (
          <div className="text-[9px] text-center font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-auto">
            ${tile.price}
          </div>
        )}

        {/* Owner Color Marker */}
        {owner && (
          <div
            className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full ring-1 ring-white shadow-xs"
            style={{ backgroundColor: owner.color }}
            title={`Owned by ${owner.name}`}
          />
        )}

        {/* Player Tokens on this tile */}
        {tilePlayers.length > 0 && (
          <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-1 p-1 bg-slate-950/20 backdrop-blur-xs rounded-sm z-10">
            {tilePlayers.map((p) => (
              <div
                key={p.id}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-black text-[9px] text-white shadow-lg transform hover:scale-125 transition-transform"
                style={{ backgroundColor: p.color }}
                title={`${p.name} ($${p.money})`}
              >
                {p.name.charAt(0)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      
      {/* Board Controls Bar */}
      <div className="flex items-center gap-2 mb-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm z-20">
        <button
          onClick={() => setZoom(prev => Math.min(prev + 0.15, 1.4))}
          className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(prev => Math.max(prev - 0.15, 0.7))}
          className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(1)}
          className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          title="Reset Zoom"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Square Board Grid */}
      <div
        className="w-full max-w-[700px] aspect-square grid grid-cols-11 grid-rows-11 gap-0.5 p-2 bg-slate-200 dark:bg-slate-950 rounded-3xl shadow-2xl border-4 border-slate-300 dark:border-slate-800 transition-transform duration-300 overflow-hidden"
        style={{ transform: `scale(${zoom})` }}
      >
        {/* Top Row: 20 to 30 */}
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[20])}</div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[21])}</div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[22])}</div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[23])}</div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[24])}</div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[25])}</div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[26])}</div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[27])}</div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[28])}</div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[29])}</div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[30])}</div>

        {/* Left and Right Columns */}
        {/* Row 2: 19 (Left), 31 (Right) */}
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[19])}</div>
        <div className="col-span-9 row-span-9 bg-slate-100 dark:bg-slate-900/90 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden border border-slate-200 dark:border-slate-800">
          
          {/* Center Logo */}
          <div className="text-center space-y-2 z-10">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white font-black text-3xl flex items-center justify-center shadow-xl shadow-indigo-500/30">
              M
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              MONOPOLY EMPIRE
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-xs">
              Buy properties, build hotels, and bankrupt opponents!
            </p>

            {/* Current Dice Display */}
            <div className="flex items-center justify-center gap-3 pt-3">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-md flex items-center justify-center text-xl font-black text-slate-900 dark:text-white animate-bounce">
                {dice[0]}
              </div>
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-md flex items-center justify-center text-xl font-black text-slate-900 dark:text-white animate-bounce">
                {dice[1]}
              </div>
            </div>
          </div>

        </div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[31])}</div>

        {/* Row 3: 18, 32 */}
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[18])}</div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[32])}</div>

        {/* Row 4: 17, 33 */}
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[17])}</div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[33])}</div>

        {/* Row 5: 16, 34 */}
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[16])}</div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[34])}</div>

        {/* Row 6: 15, 35 */}
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[15])}</div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[35])}</div>

        {/* Row 7: 14, 36 */}
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[14])}</div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[36])}</div>

        {/* Row 8: 13, 37 */}
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[13])}</div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[37])}</div>

        {/* Row 9: 12, 38 */}
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[12])}</div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[38])}</div>

        {/* Row 10: 11, 39 */}
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[11])}</div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[39])}</div>

        {/* Bottom Row: 10 to 0 (Right to Left: 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0) */}
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[10])}</div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[9])}</div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[8])}</div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[7])}</div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[6])}</div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[5])}</div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[4])}</div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[3])}</div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[2])}</div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[1])}</div>
        <div className="col-span-1 row-span-1">{renderTileContent(BOARD_TILES[0])}</div>

      </div>

    </div>
  );
};
