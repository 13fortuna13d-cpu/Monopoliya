import React, { useState, useEffect } from 'react';
import { Play, Pause, FastForward, RotateCcw, ArrowLeft, Film } from 'lucide-react';
import { MoveLog } from '../types/monopoly';
import { soundFx } from '../utils/soundEngine';

interface ReplayViewerProps {
  replayId: string;
  onBack: () => void;
}

export const ReplayViewer: React.FC<ReplayViewerProps> = ({ replayId, onBack }) => {
  const [logs, setLogs] = useState<MoveLog[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1);

  useEffect(() => {
    fetch(`/api/replays/${replayId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.logs) {
          setLogs(data.logs);
        }
      })
      .catch(() => {});
  }, [replayId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && logs.length > 0) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= logs.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          soundFx.playClick();
          return prev + 1;
        });
      }, 1500 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, logs.length, speed]);

  const activeLog = logs[currentStep];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 w-full space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              soundFx.playClick();
              onBack();
            }}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Film className="w-5 h-5 text-indigo-500" />
              Replay Match #{replayId}
            </h1>
            <p className="text-xs text-slate-500">Step {currentStep + 1} of {logs.length || 1}</p>
          </div>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          {[1, 2, 4].map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                speed === s ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              x{s}
            </button>
          ))}
        </div>
      </div>

      {/* Main Replay Player Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-2xl text-center space-y-6">
        
        {activeLog ? (
          <div className="space-y-4 max-w-lg mx-auto">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase border border-amber-500/30">
              {activeLog.action}
            </span>
            <h2 className="text-2xl font-black text-white">{activeLog.playerName}</h2>
            <p className="text-base text-slate-300 font-medium leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              {activeLog.details}
            </p>
          </div>
        ) : (
          <p className="text-slate-500 italic">Loading replay logs...</p>
        )}

        {/* Progress Scrubber */}
        <div className="space-y-2 max-w-lg mx-auto pt-4">
          <input
            type="range"
            min={0}
            max={Math.max(0, logs.length - 1)}
            value={currentStep}
            onChange={(e) => setCurrentStep(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={() => {
              soundFx.playClick();
              setCurrentStep(0);
            }}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setIsPlaying(!isPlaying);
            }}
            className="p-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-indigo-500/30 transition-all cursor-pointer"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
          </button>
        </div>

      </div>

    </div>
  );
};
