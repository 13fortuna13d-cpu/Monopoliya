import React, { useState } from 'react';
import { ShieldAlert, Users, Radio, Wrench, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import { soundFx } from '../utils/soundEngine';

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [maintenance, setMaintenance] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [broadcastLog, setBroadcastLog] = useState<string[]>([]);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcement.trim()) return;
    soundFx.playNotification();
    setBroadcastLog(prev => [announcement, ...prev]);
    setAnnouncement('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 w-full space-y-6 animate-fade-in">
      
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
              <ShieldAlert className="w-5 h-5 text-indigo-500" />
              Admin Console
            </h1>
            <p className="text-xs text-slate-500">Monitor rooms, system logs, and global announcements</p>
          </div>
        </div>

        {/* Maintenance Toggle */}
        <button
          onClick={() => {
            soundFx.playClick();
            setMaintenance(!maintenance);
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
            maintenance
              ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
              : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
          }`}
        >
          <Wrench className="w-4 h-4" />
          Maintenance: {maintenance ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Announcement Generator */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-indigo-500" />
            Global Announcement
          </h2>
          <form onSubmit={handleBroadcast} className="space-y-3">
            <textarea
              rows={3}
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder="Send global broadcast banner to all connected players..."
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer transition-colors shadow-sm"
            >
              Broadcast
            </button>
          </form>

          {broadcastLog.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Recent Broadcasts</p>
              {broadcastLog.map((msg, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  {msg}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Health */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            System Health & Socket Status
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-500">Socket.IO Gateway:</span>
              <span className="font-extrabold text-emerald-500">CONNECTED (0ms)</span>
            </div>
            <div className="flex justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-500">Active Express Server:</span>
              <span className="font-extrabold text-emerald-500">PORT 3000 HEALTHY</span>
            </div>
            <div className="flex justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-500">In-Memory Cache:</span>
              <span className="font-extrabold text-indigo-500">ACTIVE</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
