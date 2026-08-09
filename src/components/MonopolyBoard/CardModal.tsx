import React from 'react';
import { CardEffect } from '../../types/monopoly';
import { Gift, Sparkles, Check } from 'lucide-react';
import { soundFx } from '../../utils/soundEngine';

interface CardModalProps {
  card: CardEffect | null;
  onClose: () => void;
}

export const CardModal: React.FC<CardModalProps> = ({ card, onClose }) => {
  if (!card) return null;

  const isChance = card.type === 'chance';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className={`relative w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl border text-white ${
        isChance
          ? 'bg-gradient-to-b from-amber-600 to-amber-900 border-amber-400/40'
          : 'bg-gradient-to-b from-indigo-600 to-indigo-900 border-indigo-400/40'
      }`}>
        
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
          {isChance ? <Sparkles className="w-8 h-8 text-amber-200" /> : <Gift className="w-8 h-8 text-indigo-200" />}
        </div>

        <span className="text-xs font-bold uppercase tracking-widest opacity-80">
          {isChance ? 'Chance Card' : 'Community Chest'}
        </span>

        <h3 className="text-xl font-black mt-1 mb-3">{card.title}</h3>

        <p className="text-sm font-medium opacity-90 leading-relaxed mb-6">
          {card.text}
        </p>

        <button
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="w-full py-3 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-xs shadow-lg cursor-pointer transition-all flex items-center justify-center gap-1.5"
        >
          <Check className="w-4 h-4" />
          Continue
        </button>

      </div>
    </div>
  );
};
