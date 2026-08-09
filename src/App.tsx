import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Language, UserProfile, Room, GameState, Player } from './types/monopoly';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { Lobby } from './components/Lobby';
import { BoardView } from './components/MonopolyBoard/BoardView';
import { ReplayViewer } from './components/ReplayViewer';
import { AdminPanel } from './components/AdminPanel';
import { soundFx } from './utils/soundEngine';
import { X, Plus, Users, Sparkles, Lock } from 'lucide-react';

let socket: Socket;

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // User Profile
  const [user, setUser] = useState<UserProfile | null>({
    id: 'usr_guest_100',
    username: 'TycoonUz',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    coins: 1500,
    level: 5,
    xp: 220,
    wins: 3,
    totalGames: 8,
    highestMoney: 3200,
    friends: [],
    achievements: ['first_win']
  });

  // Views & State
  const [activeView, setActiveView] = useState<'home' | 'lobby' | 'game' | 'dashboard' | 'admin' | 'replay'>('home');
  const [publicRooms, setPublicRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [currentGame, setCurrentGame] = useState<GameState | null>(null);
  const [selectedReplayId, setSelectedReplayId] = useState<string | null>(null);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [isJoinRoomModalOpen, setIsJoinRoomModalOpen] = useState(false);

  // Create Room Form State
  const [roomName, setRoomName] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [isPrivate, setIsPrivate] = useState(false);
  const [gameMode, setGameMode] = useState<'classic' | 'fast' | 'custom'>('classic');

  // Join Room Form State
  const [joinCode, setJoinCode] = useState('');
  const [joinPassword, setJoinPassword] = useState('');

  // Socket Connection setup
  useEffect(() => {
    socket = io();

    socket.on('connect', () => {
      console.log('Connected to Socket.IO Server');
      socket.emit('get_rooms');
    });

    socket.on('rooms_list', (rooms: Room[]) => {
      setPublicRooms(rooms);
    });

    socket.on('room_created', (room: Room) => {
      setCurrentRoom(room);
      setActiveView('lobby');
      setIsCreateRoomModalOpen(false);
    });

    socket.on('room_updated', (room: Room) => {
      setCurrentRoom(room);
    });

    socket.on('game_started', (game: GameState) => {
      setCurrentGame(game);
      setActiveView('game');
    });

    socket.on('game_updated', (game: GameState) => {
      setCurrentGame(game);
    });

    socket.on('chat_received', (msg) => {
      setCurrentGame(prev => {
        if (!prev) return null;
        return {
          ...prev,
          chat: [...prev.chat, msg]
        };
      });
    });

    socket.on('error_message', (msg: string) => {
      alert(msg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Update HTML dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const getPlayerObject = (): Player => ({
    id: user?.id || `guest_${Date.now()}`,
    name: user?.username || 'Guest Player',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    color: '#3b82f6',
    money: 1500,
    position: 0,
    inJail: false,
    jailTurns: 0,
    hasJailCard: false,
    isBankrupt: false,
    isBot: false,
    isReady: true
  });

  const handleCreateRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playCashRegister();
    socket.emit('create_room', {
      roomName: roomName || `${user?.username || 'Player'}'s Room`,
      password: roomPassword,
      maxPlayers,
      isPrivate,
      mode: gameMode,
      player: getPlayerObject()
    });
  };

  const handleJoinRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode) return;
    soundFx.playClick();
    socket.emit('join_room', {
      roomCode: joinCode.trim().toUpperCase(),
      password: joinPassword,
      player: getPlayerObject()
    });
    setIsJoinRoomModalOpen(false);
  };

  const handleQuickPlay = () => {
    soundFx.playCashRegister();
    if (publicRooms.length > 0) {
      const room = publicRooms[0];
      socket.emit('join_room', {
        roomCode: room.code,
        player: getPlayerObject()
      });
      setActiveView('lobby');
    } else {
      socket.emit('create_room', {
        roomName: `${user?.username || 'Guest'}'s Quick Room`,
        maxPlayers: 4,
        isPrivate: false,
        mode: 'fast',
        player: getPlayerObject()
      });
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-300`}>
      
      {/* Navigation */}
      <Navbar
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenDashboard={() => setActiveView('dashboard')}
        onOpenAdmin={() => setActiveView('admin')}
        onGoHome={() => setActiveView('home')}
        activeView={activeView}
      />

      {/* Main View Router */}
      <main>
        {activeView === 'home' && (
          <LandingPage
            language={language}
            user={user}
            publicRooms={publicRooms}
            onCreateRoomModal={() => setIsCreateRoomModalOpen(true)}
            onJoinRoomModal={() => setIsJoinRoomModalOpen(true)}
            onQuickPlay={handleQuickPlay}
            onJoinSpecificRoom={(code) => {
              socket.emit('join_room', { roomCode: code, player: getPlayerObject() });
              setActiveView('lobby');
            }}
            onRefreshRooms={() => socket.emit('get_rooms')}
          />
        )}

        {activeView === 'dashboard' && user && (
          <Dashboard
            language={language}
            user={user}
            onSelectReplay={(id) => {
              setSelectedReplayId(id);
              setActiveView('replay');
            }}
          />
        )}

        {activeView === 'lobby' && currentRoom && (
          <Lobby
            language={language}
            room={currentRoom}
            currentPlayerId={user?.id || ''}
            onToggleReady={() => socket.emit('toggle_ready', { roomCode: currentRoom.code, playerId: user?.id })}
            onAddBot={() => socket.emit('add_bot', { roomCode: currentRoom.code })}
            onStartGame={() => {
              if (currentRoom.players.length < 2) {
                // If only 1 player, auto-add bot first then start game
                socket.emit('add_bot', { roomCode: currentRoom.code });
                setTimeout(() => {
                  socket.emit('start_game', { roomCode: currentRoom.code });
                }, 300);
              } else {
                socket.emit('start_game', { roomCode: currentRoom.code });
              }
            }}
            onLeaveRoom={() => {
              setCurrentRoom(null);
              setActiveView('home');
            }}
          />
        )}

        {activeView === 'game' && currentGame && (
          <BoardView
            game={currentGame}
            myPlayerId={user?.id || ''}
            onRollDice={() => socket.emit('roll_dice', { gameId: currentGame.id, playerId: user?.id })}
            onBuyProperty={(tileId) => socket.emit('buy_property', { gameId: currentGame.id, playerId: user?.id, tileId })}
            onBuildHouse={(tileId) => socket.emit('build_house', { gameId: currentGame.id, playerId: user?.id, tileId })}
            onEndTurn={() => socket.emit('end_turn', { gameId: currentGame.id, playerId: user?.id })}
            onProposeTrade={(targetId, offerCash, requestCash) => {
              socket.emit('send_chat', {
                gameId: currentGame.id,
                senderId: user?.id,
                senderName: user?.username,
                text: `Proposed Trade: $${offerCash} offered for $${requestCash}`
              });
            }}
            onSendMessage={(text, emoji) => socket.emit('send_chat', { gameId: currentGame.id, senderId: user?.id, senderName: user?.username, text, emoji })}
            onLeaveGame={() => {
              setCurrentGame(null);
              setActiveView('home');
            }}
          />
        )}

        {activeView === 'replay' && selectedReplayId && (
          <ReplayViewer
            replayId={selectedReplayId}
            onBack={() => setActiveView('dashboard')}
          />
        )}

        {activeView === 'admin' && (
          <AdminPanel onBack={() => setActiveView('home')} />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        language={language}
        onAuthenticate={(u) => setUser(u)}
      />

      {/* Create Room Modal */}
      {isCreateRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
            <button
              onClick={() => setIsCreateRoomModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-black mb-1">Create Monopoly Lobby</h3>
            <p className="text-xs text-slate-500 mb-6">Customize your game mode, player count, and room privacy</p>

            <form onSubmit={handleCreateRoomSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Room Name</label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder={`${user?.username || 'Player'}'s Room`}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Game Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['classic', 'fast', 'custom'] as const).map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setGameMode(m)}
                      className={`py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                        gameMode === m ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Max Players ({maxPlayers})</label>
                <input
                  type="range"
                  min={2}
                  max={6}
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 transition-all cursor-pointer mt-4"
              >
                Create Room
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Join Room Modal */}
      {isJoinRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
            <button
              onClick={() => setIsJoinRoomModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-black mb-1">Join Room</h3>
            <p className="text-xs text-slate-500 mb-6">Enter the 6-character room code from your friend</p>

            <form onSubmit={handleJoinRoomSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Room Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="e.g. AB12CD"
                  className="w-full p-3 text-center tracking-widest font-mono text-lg font-black uppercase rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 transition-all cursor-pointer mt-2"
              >
                Join Game
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
