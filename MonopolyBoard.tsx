import React, { useMemo, useState } from 'react';
import { BoardTile, Player, PropertyState } from '../types/monopoly';
import { BOARD_TILES, COLOR_HEX } from '../data/boardData';
import { ZoomIn, ZoomOut, RotateCcw, TrainFront, Zap, Droplets, Gift, Sparkles, CarFront, LockKeyhole, Landmark, Crown, ArrowRight, Siren } from 'lucide-react';

interface MonopolyBoardProps {
  properties: Record<number, PropertyState>;
  players: Player[];
  currentPlayerIndex: number;
  dice: [number, number];
  onTileClick: (tile: BoardTile) => void;
}

const TILE_ICONS: Record<number, string> = {
  0: 'GO', 1: '🏘️', 2: '🎁', 3: '🏘️', 4: '💵', 5: '🚂',
  6: '🌊', 7: '❓', 8: '🌊', 9: '🌊', 10: '🔒',
  11: '🌸', 12: '⚡', 13: '🌸', 14: '🌸', 15: '🚂',
  16: '🏙️', 17: '🎁', 18: '🏙️', 19: '🏙️', 20: '🅿️',
  21: '🌆', 22: '❓', 23: '🌆', 24: '🌆', 25: '🚂',
  26: '🌴', 27: '🌴', 28: '💧', 29: '🌴', 30: '🚨',
  31: '🌳', 32: '🌳', 33: '🎁', 34: '🌳', 35: '🚂',
  36: '❓', 37: '🏛️', 38: '👑', 39: '🏛️'
};

const getGridPosition = (id: number): { row: number; col: number } => {
  if (id >= 20 && id <= 30) return { row: 1, col: id - 19 };
  if (id >= 31 && id <= 39) return { row: id - 29, col: 11 };
  if (id === 0) return { row: 11, col: 11 };
  if (id >= 1 && id <= 9) return { row: 11, col: 11 - id };
  if (id === 10) return { row: 11, col: 1 };
  return { row: 21 - id, col: 1 };
};

const getTileSide = (id: number) => {
  if (id >= 20 && id <= 30) return 'top';
  if (id >= 31 && id <= 39) return 'right';
  if (id >= 1 && id <= 10) return 'bottom';
  return 'left';
};

const Icon = ({ tile }: { tile: BoardTile }) => {
  const cls = "w-4 h-4 sm:w-5 sm:h-5";
  if (tile.id === 5 || tile.id === 15 || tile.id === 25 || tile.id === 35) return <TrainFront className={cls} />;
  if (tile.type === 'utility') return tile.id === 12 ? <Zap className={cls} /> : <Droplets className={cls} />;
  if (tile.type === 'community-chest') return <Gift className={cls} />;
  if (tile.type === 'chance') return <Sparkles className={cls} />;
  if (tile.type === 'jail') return <LockKeyhole className={cls} />;
  if (tile.type === 'free-parking') return <CarFront className={cls} />;
  if (tile.type === 'tax') return tile.id === 38 ? <Crown className={cls} /> : <Landmark className={cls} />;
  if (tile.type === 'go') return <ArrowRight className={cls} />;
  if (tile.type === 'go-to-jail') return <Siren className={cls} />;
  return <span className="text-base sm:text-lg leading-none">{TILE_ICONS[tile.id] || '🏙️'}</span>;
};

export const MonopolyBoard: React.FC<MonopolyBoardProps> = ({
  properties,
  players,
  currentPlayerIndex,
  dice,
  onTileClick
}) => {
  const [zoom, setZoom] = useState(1);

  const playersByTile = useMemo(() => {
    const map = new Map<number, Player[]>();
    players.filter(p => !p.isBankrupt).forEach(p => {
      const list = map.get(p.position) || [];
      list.push(p);
      map.set(p.position, list);
    });
    return map;
  }, [players]);

  const activePlayer = players[currentPlayerIndex];

  const renderTile = (tile: BoardTile) => {
    const prop = properties[tile.id];
    const owner = prop?.ownerId ? players.find(p => p.id === prop.ownerId) : undefined;
    const tilePlayers = playersByTile.get(tile.id) || [];
    const side = getTileSide(tile.id);
    const isActive = activePlayer?.position === tile.id;

    return (
      <button
        key={tile.id}
        onClick={() => onTileClick(tile)}
        className={`relative min-w-0 min-h-0 overflow-hidden border border-slate-300/90 dark:border-slate-700/90 bg-[#f7f2df] dark:bg-slate-800 text-slate-900 dark:text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.35)] hover:brightness-105 transition-all text-left ${
          isActive ? 'ring-2 ring-indigo-500 ring-inset z-10' : ''
        }`}
        style={{ gridRow: getGridPosition(tile.id).row, gridColumn: getGridPosition(tile.id).col }}
        aria-label={`${tile.name}${tile.price ? `, $${tile.price}` : ''}`}
      >
        {tile.group && (
          <div className="absolute inset-x-0 top-0 h-[20%] min-h-[7px]" style={{ backgroundColor: COLOR_HEX[tile.group] }} />
        )}

        <div className={`h-full w-full flex flex-col items-center justify-between pt-[22%] pb-1 px-0.5 ${
          side === 'left' || side === 'right' ? 'text-[6px] sm:text-[7px]' : 'text-[7px] sm:text-[9px]'
        }`}>
          <div className="flex flex-col items-center gap-0.5 w-full">
            <div className="opacity-90"><Icon tile={tile} /></div>
            <span className="font-black leading-[1.05] text-center line-clamp-2 uppercase tracking-tight">
              {tile.name}
            </span>
          </div>

          {tile.price !== undefined && (
            <span className="font-mono font-black text-[6px] sm:text-[8px] text-emerald-700 dark:text-emerald-400">
              ${tile.price}
            </span>
          )}

          {prop?.houses ? (
            <span className="absolute bottom-0.5 left-0.5 text-[7px] sm:text-[9px]" title={prop.houses === 5 ? 'Hotel' : `${prop.houses} houses`}>
              {prop.houses === 5 ? '🏨' : '🏠'.repeat(prop.houses)}
            </span>
          ) : null}
        </div>

        {owner && (
          <span
            className="absolute right-0.5 top-0.5 w-2 h-2 rounded-full ring-1 ring-white shadow"
            style={{ backgroundColor: owner.color }}
            title={`Owner: ${owner.name}`}
          />
        )}

        {tilePlayers.length > 0 && (
          <div className="absolute inset-x-0 bottom-0.5 flex flex-wrap justify-center gap-0.5 z-20 px-0.5">
            {tilePlayers.map(p => (
              <span
                key={p.id}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-white/80 shadow-md flex items-center justify-center text-[7px] sm:text-[8px] font-black text-white"
                style={{ backgroundColor: p.color }}
                title={`${p.name} — $${p.money}`}
              >
                {p.name.slice(0, 1).toUpperCase()}
              </span>
            ))}
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      <div className="flex items-center gap-1.5 mb-3 bg-slate-950/90 p-1.5 rounded-2xl border border-slate-700 shadow-xl">
        <button onClick={() => setZoom(z => Math.min(1.12, z + 0.06))} className="p-2 rounded-xl hover:bg-slate-800 text-slate-200" title="Zoom in"><ZoomIn className="w-4 h-4" /></button>
        <span className="px-2 text-[10px] font-black text-slate-400">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(z => Math.max(0.82, z - 0.06))} className="p-2 rounded-xl hover:bg-slate-800 text-slate-200" title="Zoom out"><ZoomOut className="w-4 h-4" /></button>
        <button onClick={() => setZoom(1)} className="p-2 rounded-xl hover:bg-slate-800 text-slate-200" title="Reset zoom"><RotateCcw className="w-4 h-4" /></button>
      </div>

      <div
        className="relative w-full max-w-[760px] aspect-square transition-transform duration-300 origin-center"
        style={{ transform: `scale(${zoom})` }}
      >
        <div
          className="absolute inset-0 grid grid-cols-11 grid-rows-11 gap-[2px] p-2 sm:p-3 rounded-[28px] border-[5px] border-amber-950/80 bg-[#1b6b43] shadow-[0_20px_70px_rgba(0,0,0,.45)]"
        >
          {BOARD_TILES.map(renderTile)}

          <div
            className="rounded-2xl border border-amber-900/40 bg-[#efe5c7] dark:bg-slate-900 flex flex-col items-center justify-center text-center p-3 sm:p-8 overflow-hidden"
            style={{ gridColumn: '2 / span 9', gridRow: '2 / span 9' }}
          >
            <div className="absolute opacity-[0.06] text-[11rem] font-black rotate-[-18deg] select-none">M</div>
            <div className="relative z-10 w-full max-w-md">
              <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-[24px] bg-slate-950 border-4 border-amber-500/70 flex items-center justify-center text-amber-400 shadow-2xl">
                <span className="text-4xl sm:text-5xl font-black">M</span>
              </div>
              <div className="mt-3 px-4 py-2 bg-slate-950 text-white rounded-xl inline-block">
                <h2 className="text-sm sm:text-2xl font-black tracking-[0.18em]">MONOPOLY EMPIRE</h2>
              </div>
              <p className="mt-3 text-[9px] sm:text-xs font-bold text-slate-600 dark:text-slate-400">
                CLASSIC BOARD • BUY • TRADE • BUILD • WIN
              </p>

              <div className="mt-5 flex justify-center gap-3">
                {[dice[0], dice[1]].map((d, i) => (
                  <div key={i} className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 shadow-lg flex items-center justify-center text-xl sm:text-2xl font-black">
                    {d}
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 max-w-sm mx-auto">
                <div className="rounded-xl bg-white/70 dark:bg-slate-800/80 p-2 border border-slate-300/70 dark:border-slate-700">
                  <div className="text-lg">🎲</div><div className="text-[8px] font-black uppercase">Roll</div>
                </div>
                <div className="rounded-xl bg-white/70 dark:bg-slate-800/80 p-2 border border-slate-300/70 dark:border-slate-700">
                  <div className="text-lg">🏠</div><div className="text-[8px] font-black uppercase">Build</div>
                </div>
                <div className="rounded-xl bg-white/70 dark:bg-slate-800/80 p-2 border border-slate-300/70 dark:border-slate-700">
                  <div className="text-lg">🤝</div><div className="text-[8px] font-black uppercase">Trade</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-[10px] text-slate-400 text-center">
        {activePlayer ? `${activePlayer.name} navbatda` : 'Navbat tayyor'} • Katakka bosib mulk ma'lumotlarini ko‘ring
      </p>
    </div>
  );
};
