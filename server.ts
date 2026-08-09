import express from 'express';
import http from 'http';
import path from 'path';
import { Server, Socket } from 'socket.io';
import { createServer as createViteServer } from 'vite';
import { BOARD_TILES, CHANCE_CARDS, COMMUNITY_CHEST_CARDS, COLOR_GROUP_MAP } from './src/data/boardData';
import { GameState, Player, PropertyState, Room, TradeOffer, MoveLog, UserProfile, LeaderboardEntry } from './src/types/monopoly';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = 3000;

app.use(express.json());

// In-Memory Data Store
const rooms = new Map<string, Room>();
const games = new Map<string, GameState>();
const replays = new Map<string, { id: string; logs: MoveLog[]; winner: string; date: string }>();

// Seed Leaderboard
const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, username: 'MonopolyKing', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', wins: 48, totalGames: 60, coins: 15400, level: 24 },
  { rank: 2, username: 'CapitalistPRO', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', wins: 39, totalGames: 52, coins: 12100, level: 19 },
  { rank: 3, username: 'TycoonUz', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', wins: 32, totalGames: 45, coins: 9800, level: 16 },
  { rank: 4, username: 'BoardwalkMaster', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80', wins: 28, totalGames: 40, coins: 8400, level: 14 },
  { rank: 5, username: 'LuckyRoller', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80', wins: 21, totalGames: 35, coins: 6200, level: 11 }
];

// Helper: Generate 6-letter room code
function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Initialize default properties map
function createInitialProperties(): Record<number, PropertyState> {
  const properties: Record<number, PropertyState> = {};
  BOARD_TILES.forEach((tile) => {
    if (tile.type === 'property' || tile.type === 'railroad' || tile.type === 'utility') {
      properties[tile.id] = {
        tileId: tile.id,
        ownerId: null,
        houses: 0,
        isMortgaged: false
      };
    }
  });
  return properties;
}


function countOwnedRailroads(game: GameState, playerId: string): number {
  return BOARD_TILES.filter(t => t.type === 'railroad' && game.properties[t.id]?.ownerId === playerId).length;
}

function countOwnedUtilities(game: GameState, playerId: string): number {
  return BOARD_TILES.filter(t => t.type === 'utility' && game.properties[t.id]?.ownerId === playerId).length;
}

function calculateRent(game: GameState, tile: typeof BOARD_TILES[number], prop: PropertyState, dice: [number, number]): number {
  if (prop.isMortgaged || !prop.ownerId) return 0;

  if (tile.type === 'railroad') {
    return 25 * Math.pow(2, Math.max(0, countOwnedRailroads(game, prop.ownerId) - 1));
  }

  if (tile.type === 'utility') {
    const utilities = countOwnedUtilities(game, prop.ownerId);
    return (dice[0] + dice[1]) * (utilities >= 2 ? 10 : 4);
  }

  const base = tile.rent?.[0] || 0;
  const group = tile.group;
  const ownsMonopoly = !!group &&
    COLOR_GROUP_MAP[group]?.every(id => game.properties[id]?.ownerId === prop.ownerId);

  if (prop.houses > 0) return tile.rent?.[prop.houses] || base;
  return ownsMonopoly ? base * 2 : base;
}

function canBuildOnProperty(game: GameState, playerId: string, tileId: number): boolean {
  const tile = BOARD_TILES[tileId];
  const prop = game.properties[tileId];
  if (!tile || tile.type !== 'property' || !tile.group || !prop || prop.ownerId !== playerId || prop.isMortgaged || prop.houses >= 5) return false;

  const groupTiles = COLOR_GROUP_MAP[tile.group] || [];
  if (!groupTiles.every(id => game.properties[id]?.ownerId === playerId && !game.properties[id]?.isMortgaged)) return false;

  // Official even-building rule: build on the least-developed property first.
  const levels = groupTiles.map(id => game.properties[id]?.houses || 0);
  return prop.houses === Math.min(...levels);
}

// Bot AI helper
function handleBotTurn(gameId: string) {
  const game = games.get(gameId);
  if (!game || game.status !== 'playing') return;

  const currentPlayer = game.players[game.currentPlayerIndex];
  if (!currentPlayer || !currentPlayer.isBot || currentPlayer.isBankrupt) return;

  setTimeout(() => {
    const currentGame = games.get(gameId);
    if (!currentGame || currentGame.status !== 'playing') return;

    const bot = currentGame.players[currentGame.currentPlayerIndex];
    if (!bot || !bot.isBot || bot.id !== currentPlayer.id) return;

    // Handle Jail
    if (bot.inJail) {
      if (bot.money >= 50) {
        bot.money -= 50;
        bot.inJail = false;
        bot.jailTurns = 0;
        currentGame.logs.push({
          id: String(Date.now()),
          stepNumber: currentGame.logs.length + 1,
          playerId: bot.id,
          playerName: bot.name,
          action: 'PAY_JAIL_FINE',
          details: `${bot.name} paid $50 to get out of jail.`,
          timestamp: Date.now()
        });
      }
    }

    // Roll dice if not rolled
    let botRolledDouble = false;
    if (!currentGame.hasRolled) {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const isDouble = d1 === d2;
      botRolledDouble = isDouble;
      currentGame.dice = [d1, d2];
      currentGame.hasRolled = true;

      if (isDouble) {
        currentGame.doublesCount += 1;
      } else {
        currentGame.doublesCount = 0;
      }

      if (currentGame.doublesCount >= 3) {
        bot.position = 10;
        bot.inJail = true;
        bot.jailTurns = 0;
        currentGame.doublesCount = 0;
        currentGame.logs.push({
          id: String(Date.now()),
          stepNumber: currentGame.logs.length + 1,
          playerId: bot.id,
          playerName: bot.name,
          action: 'JAIL_3_DOUBLES',
          details: `${bot.name} rolled 3 doubles and went to Jail!`,
          dice: [d1, d2],
          timestamp: Date.now()
        });
      } else {
        const oldPos = bot.position;
        const newPos = (oldPos + d1 + d2) % 40;
        bot.position = newPos;

        if (newPos < oldPos) {
          bot.money += 200;
          currentGame.logs.push({
            id: String(Date.now()),
            stepNumber: currentGame.logs.length + 1,
            playerId: bot.id,
            playerName: bot.name,
            action: 'PASS_GO',
            details: `${bot.name} passed GO and collected $200!`,
            timestamp: Date.now()
          });
        }

        const tile = BOARD_TILES[newPos];

        // Check tile landing
        if (tile.type === 'go-to-jail') {
          bot.position = 10;
          bot.inJail = true;
          bot.jailTurns = 0;
        } else if (tile.type === 'tax') {
          bot.money -= tile.taxAmount || 100;
        } else if (tile.type === 'property' || tile.type === 'railroad' || tile.type === 'utility') {
          const prop = currentGame.properties[tile.id];
          if (prop && prop.ownerId === null && tile.price && bot.money >= tile.price + 100) {
            // Bot buys property
            prop.ownerId = bot.id;
            bot.money -= tile.price;
            currentGame.logs.push({
              id: String(Date.now()),
              stepNumber: currentGame.logs.length + 1,
              playerId: bot.id,
              playerName: bot.name,
              action: 'BUY_PROPERTY',
              details: `${bot.name} bought ${tile.name} for $${tile.price}.`,
              timestamp: Date.now()
            });
          } else if (prop && prop.ownerId && prop.ownerId !== bot.id && !prop.isMortgaged) {
            // Pay rent
            const rent = calculateRent(currentGame, tile, prop, currentGame.dice);
            bot.money -= rent;
            const owner = currentGame.players.find(p => p.id === prop.ownerId);
            if (owner) owner.money += rent;
            currentGame.logs.push({
              id: String(Date.now()),
              stepNumber: currentGame.logs.length + 1,
              playerId: bot.id,
              playerName: bot.name,
              action: 'PAY_RENT',
              details: `${bot.name} paid $${rent} rent to ${owner?.name} at ${tile.name}.`,
              timestamp: Date.now()
            });
          }
        }
      }
    }

    // Check bankruptcy
    if (bot.money < 0) {
      bot.isBankrupt = true;
      currentGame.logs.push({
        id: String(Date.now()),
        stepNumber: currentGame.logs.length + 1,
        playerId: bot.id,
        playerName: bot.name,
        action: 'BANKRUPT',
        details: `${bot.name} went bankrupt!`,
        timestamp: Date.now()
      });
    }

    // Doubles grant the bot another roll, matching the classic rules.
    setTimeout(() => {
      if (currentGame.status !== 'playing') return;
      if (botRolledDouble && !bot.inJail && currentGame.doublesCount > 0) {
        currentGame.hasRolled = false;
        io.to(gameId).emit('game_updated', currentGame);
        handleBotTurn(gameId);
      } else {
        advanceTurn(currentGame);
        io.to(gameId).emit('game_updated', currentGame);
      }
    }, 700);

    io.to(gameId).emit('game_updated', currentGame);
  }, 1200);
}

function advanceTurn(game: GameState) {
  const activePlayers = game.players.filter(p => !p.isBankrupt);
  if (activePlayers.length <= 1) {
    game.status = 'ended';
    game.winner = activePlayers[0] || game.players[0];
    game.logs.push({
      id: String(Date.now()),
      stepNumber: game.logs.length + 1,
      playerId: game.winner.id,
      playerName: game.winner.name,
      action: 'GAME_OVER',
      details: `🏆 ${game.winner.name} won the Monopoly Empire match!`,
      timestamp: Date.now()
    });

    // Save Replay
    replays.set(game.id, {
      id: game.id,
      logs: game.logs,
      winner: game.winner.name,
      date: new Date().toLocaleDateString()
    });

    return;
  }

  game.hasRolled = false;
  game.doublesCount = 0;
  let nextIdx = (game.currentPlayerIndex + 1) % game.players.length;
  while (game.players[nextIdx].isBankrupt) {
    nextIdx = (nextIdx + 1) % game.players.length;
  }
  game.currentPlayerIndex = nextIdx;
  game.currentTurnTimer = 30;

  if (game.players[nextIdx].isBot) {
    handleBotTurn(game.id);
  }
}

// API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/leaderboard', (req, res) => {
  res.json(leaderboardData);
});

app.get('/api/replays', (req, res) => {
  const list = Array.from(replays.values());
  res.json(list);
});

app.get('/api/replays/:id', (req, res) => {
  const replay = replays.get(req.params.id);
  if (!replay) return res.status(404).json({ error: 'Replay not found' });
  res.json(replay);
});

// Socket.IO Event Handling
io.on('connection', (socket: Socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Send current active public rooms
  socket.on('get_rooms', () => {
    const publicRooms = Array.from(rooms.values()).filter(r => !r.isPrivate);
    socket.emit('rooms_list', publicRooms);
  });

  // Create Room
  socket.on('create_room', (data: { roomName: string; password?: string; maxPlayers: number; isPrivate: boolean; mode: 'classic' | 'fast' | 'custom'; player: Player }) => {
    const code = generateRoomCode();
    const room: Room = {
      id: code,
      code,
      name: data.roomName || `${data.player.name}'s Room`,
      hostId: data.player.id,
      hasPassword: !!data.password,
      password: data.password,
      maxPlayers: data.maxPlayers || 4,
      isPrivate: !!data.isPrivate,
      mode: data.mode || 'classic',
      players: [{ ...data.player, isReady: true }],
      status: 'lobby'
    };

    rooms.set(code, room);
    socket.join(code);
    socket.emit('room_created', room);
    io.emit('rooms_list', Array.from(rooms.values()).filter(r => !r.isPrivate));
  });

  // Join Room
  socket.on('join_room', (data: { roomCode: string; password?: string; player: Player }) => {
    const room = rooms.get(data.roomCode.toUpperCase());
    if (!room) {
      socket.emit('error_message', 'Room not found.');
      return;
    }

    if (room.hasPassword && room.password !== data.password) {
      socket.emit('error_message', 'Incorrect password.');
      return;
    }

    if (room.players.length >= room.maxPlayers) {
      socket.emit('error_message', 'Room is full.');
      return;
    }

    // Check if player already in room
    const existing = room.players.find(p => p.id === data.player.id);
    if (!existing) {
      room.players.push({ ...data.player, isReady: false });
    }

    socket.join(room.code);
    io.to(room.code).emit('room_updated', room);
    io.emit('rooms_list', Array.from(rooms.values()).filter(r => !r.isPrivate));
  });

  // Add Bot to Room
  socket.on('add_bot', (data: { roomCode: string }) => {
    const room = rooms.get(data.roomCode);
    if (!room || room.players.length >= room.maxPlayers) return;

    const botColors = ['#f43f5e', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
    const botNames = ['AI Tycoon', 'Bot Monopoly', 'Robot Trader', 'Cyber Investor'];
    const botCount = room.players.filter(p => p.isBot).length;

    const botPlayer: Player = {
      id: `bot_${Date.now()}_${botCount}`,
      name: botNames[botCount % botNames.length] + ` #${botCount + 1}`,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=bot_${botCount}`,
      color: botColors[room.players.length % botColors.length],
      money: room.mode === 'fast' ? 2500 : 1500,
      position: 0,
      inJail: false,
      jailTurns: 0,
      hasJailCard: false,
      isBankrupt: false,
      isBot: true,
      isReady: true
    };

    room.players.push(botPlayer);
    io.to(room.code).emit('room_updated', room);
  });

  // Toggle Ready
  socket.on('toggle_ready', (data: { roomCode: string; playerId: string }) => {
    const room = rooms.get(data.roomCode);
    if (!room) return;

    const player = room.players.find(p => p.id === data.playerId);
    if (player) {
      player.isReady = !player.isReady;
      io.to(room.code).emit('room_updated', room);
    }
  });

  // Start Game
  socket.on('start_game', (data: { roomCode: string }) => {
    const room = rooms.get(data.roomCode);
    if (!room) return;

    room.status = 'in-game';

    const initialCash = room.mode === 'fast' ? 2500 : 1500;
    const formattedPlayers = room.players.map(p => ({
      ...p,
      money: initialCash,
      position: 0,
      inJail: false,
      jailTurns: 0,
      hasJailCard: false,
      isBankrupt: false
    }));

    const gameState: GameState = {
      id: room.code,
      roomCode: room.code,
      roomName: room.name,
      mode: room.mode,
      status: 'playing',
      players: formattedPlayers,
      currentPlayerIndex: 0,
      properties: createInitialProperties(),
      dice: [1, 1],
      hasRolled: false,
      doublesCount: 0,
      currentTurnTimer: 30,
      tradeOffer: null,
      activeCard: null,
      logs: [{
        id: String(Date.now()),
        stepNumber: 1,
        playerId: 'system',
        playerName: 'System',
        action: 'GAME_STARTED',
        details: `The Monopoly Empire match has officially started! Good luck!`,
        timestamp: Date.now()
      }],
      winner: null,
      chat: [],
      createdAt: Date.now()
    };

    games.set(room.code, gameState);
    io.to(room.code).emit('game_started', gameState);
    io.emit('rooms_list', Array.from(rooms.values()).filter(r => !r.isPrivate));

    // If first player is bot
    if (gameState.players[0].isBot) {
      handleBotTurn(gameState.id);
    }
  });

  // Roll Dice
  socket.on('roll_dice', (data: { gameId: string; playerId: string }) => {
    const game = games.get(data.gameId);
    if (!game || game.status !== 'playing' || game.hasRolled) return;

    const currentPlayer = game.players[game.currentPlayerIndex];
    if (!currentPlayer || currentPlayer.id !== data.playerId || currentPlayer.isBankrupt) return;

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const isDouble = d1 === d2;
    game.dice = [d1, d2];
    game.hasRolled = true;

    // Jail rules: doubles release the player; otherwise the attempt is consumed.
    if (currentPlayer.inJail) {
      if (isDouble) {
        currentPlayer.inJail = false;
        currentPlayer.jailTurns = 0;
        game.doublesCount = 0;
        game.logs.push({
          id: String(Date.now()),
          stepNumber: game.logs.length + 1,
          playerId: currentPlayer.id,
          playerName: currentPlayer.name,
          action: 'JAIL_ROLL',
          details: `${currentPlayer.name} rolled doubles and escaped Jail.`,
          dice: [d1, d2],
          timestamp: Date.now()
        });
      } else {
        currentPlayer.jailTurns += 1;
        if (currentPlayer.jailTurns >= 3) {
          if (currentPlayer.money >= 50) currentPlayer.money -= 50;
          currentPlayer.inJail = false;
          currentPlayer.jailTurns = 0;
          game.logs.push({
            id: String(Date.now()),
            stepNumber: game.logs.length + 1,
            playerId: currentPlayer.id,
            playerName: currentPlayer.name,
            action: 'JAIL_FINE',
            details: `${currentPlayer.name} failed three Jail rolls and paid $50.`,
            dice: [d1, d2],
            timestamp: Date.now()
          });
        } else {
          game.logs.push({
            id: String(Date.now()),
            stepNumber: game.logs.length + 1,
            playerId: currentPlayer.id,
            playerName: currentPlayer.name,
            action: 'JAIL_ATTEMPT',
            details: `${currentPlayer.name} did not roll doubles in Jail (${currentPlayer.jailTurns}/3).`,
            dice: [d1, d2],
            timestamp: Date.now()
          });
          io.to(data.gameId).emit('game_updated', game);
          return;
        }
      }
    } else {
      if (isDouble) game.doublesCount += 1;
      else game.doublesCount = 0;

      // Three consecutive doubles sends the player directly to Jail.
      if (game.doublesCount >= 3) {
        currentPlayer.position = 10;
        currentPlayer.inJail = true;
        currentPlayer.jailTurns = 0;
        game.doublesCount = 0;
        game.logs.push({
          id: String(Date.now()),
          stepNumber: game.logs.length + 1,
          playerId: currentPlayer.id,
          playerName: currentPlayer.name,
          action: 'JAIL_3_DOUBLES',
          details: `${currentPlayer.name} rolled three consecutive doubles and went to Jail.`,
          dice: [d1, d2],
          timestamp: Date.now()
        });
        io.to(data.gameId).emit('game_updated', game);
        return;
      }
    }

    const oldPos = currentPlayer.position;
    const newPos = (oldPos + d1 + d2) % 40;
    currentPlayer.position = newPos;

    if (newPos < oldPos) {
      currentPlayer.money += 200;
      game.logs.push({
        id: String(Date.now()),
        stepNumber: game.logs.length + 1,
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        action: 'PASS_GO',
        details: `${currentPlayer.name} passed GO and collected $200.`,
        timestamp: Date.now()
      });
    }

    const tile = BOARD_TILES[newPos];

    if (tile.type === 'go-to-jail') {
      currentPlayer.position = 10;
      currentPlayer.inJail = true;
      currentPlayer.jailTurns = 0;
      game.doublesCount = 0;
      game.logs.push({
        id: String(Date.now()),
        stepNumber: game.logs.length + 1,
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        action: 'SENT_TO_JAIL',
        details: `${currentPlayer.name} landed on Go To Jail.`,
        timestamp: Date.now()
      });
    } else if (tile.type === 'tax') {
      const tax = tile.taxAmount || 100;
      currentPlayer.money -= tax;
      game.logs.push({
        id: String(Date.now()),
        stepNumber: game.logs.length + 1,
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        action: 'TAX_PAID',
        details: `${currentPlayer.name} paid $${tax} in taxes.`,
        timestamp: Date.now()
      });
    } else if (tile.type === 'chance' || tile.type === 'community-chest') {
      const deck = tile.type === 'chance' ? CHANCE_CARDS : COMMUNITY_CHEST_CARDS;
      const card = deck[Math.floor(Math.random() * deck.length)];
      game.activeCard = card;

      if (card.action === 'money' && card.amount) {
        currentPlayer.money += card.amount;
      } else if (card.action === 'move' && card.destination !== undefined) {
        if (card.destination < currentPlayer.position) currentPlayer.money += 200;
        currentPlayer.position = card.destination;
      } else if (card.action === 'jail') {
        currentPlayer.position = 10;
        currentPlayer.inJail = true;
        currentPlayer.jailTurns = 0;
        game.doublesCount = 0;
      } else if (card.action === 'jail_free') {
        currentPlayer.hasJailCard = true;
      }

      game.logs.push({
        id: String(Date.now()),
        stepNumber: game.logs.length + 1,
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        action: tile.type === 'chance' ? 'CHANCE_CARD' : 'COMMUNITY_CARD',
        details: `${currentPlayer.name} drew ${tile.type === 'chance' ? 'Chance' : 'Community Chest'}: "${card.title}".`,
        timestamp: Date.now()
      });
    } else if (tile.type === 'property' || tile.type === 'railroad' || tile.type === 'utility') {
      const prop = game.properties[tile.id];

      if (prop?.ownerId && prop.ownerId !== currentPlayer.id && !prop.isMortgaged) {
        const rent = calculateRent(game, tile, prop, game.dice);
        currentPlayer.money -= rent;
        const owner = game.players.find(p => p.id === prop.ownerId);
        if (owner) owner.money += rent;

        game.logs.push({
          id: String(Date.now()),
          stepNumber: game.logs.length + 1,
          playerId: currentPlayer.id,
          playerName: currentPlayer.name,
          action: 'RENT_PAID',
          details: `${currentPlayer.name} paid $${rent} rent to ${owner?.name || 'the owner'} at ${tile.name}.`,
          timestamp: Date.now()
        });
      }
    }

    if (currentPlayer.money < 0) {
      currentPlayer.isBankrupt = true;
      game.logs.push({
        id: String(Date.now()),
        stepNumber: game.logs.length + 1,
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        action: 'BANKRUPT',
        details: `${currentPlayer.name} went bankrupt.`,
        timestamp: Date.now()
      });
    }

    io.to(data.gameId).emit('game_updated', game);
  });

  // Jail: pay $50 before rolling.
  socket.on('pay_jail_fine', (data: { gameId: string; playerId: string }) => {
    const game = games.get(data.gameId);
    if (!game || game.status !== 'playing' || game.hasRolled) return;
    const player = game.players[game.currentPlayerIndex];
    if (!player || player.id !== data.playerId || !player.inJail || player.money < 50) return;

    player.money -= 50;
    player.inJail = false;
    player.jailTurns = 0;
    game.logs.push({
      id: String(Date.now()),
      stepNumber: game.logs.length + 1,
      playerId: player.id,
      playerName: player.name,
      action: 'PAY_JAIL_FINE',
      details: `${player.name} paid $50 to leave Jail.`,
      timestamp: Date.now()
    });
    io.to(data.gameId).emit('game_updated', game);
  });

  // Jail: use a Get Out of Jail Free card before rolling.
  socket.on('use_jail_card', (data: { gameId: string; playerId: string }) => {
    const game = games.get(data.gameId);
    if (!game || game.status !== 'playing' || game.hasRolled) return;
    const player = game.players[game.currentPlayerIndex];
    if (!player || player.id !== data.playerId || !player.inJail || !player.hasJailCard) return;

    player.hasJailCard = false;
    player.inJail = false;
    player.jailTurns = 0;
    game.logs.push({
      id: String(Date.now()),
      stepNumber: game.logs.length + 1,
      playerId: player.id,
      playerName: player.name,
      action: 'USE_JAIL_CARD',
      details: `${player.name} used a Get Out of Jail Free card.`,
      timestamp: Date.now()
    });
    io.to(data.gameId).emit('game_updated', game);
  });

  // Buy Property
  socket.on('buy_property', (data: { gameId: string; playerId: string; tileId: number }) => {
    const game = games.get(data.gameId);
    if (!game) return;

    const player = game.players.find(p => p.id === data.playerId);
    const tile = BOARD_TILES[data.tileId];
    const prop = game.properties[data.tileId];

    const currentPlayer = game.players[game.currentPlayerIndex];
    if (
      player &&
      currentPlayer?.id === player.id &&
      game.hasRolled &&
      player.position === data.tileId &&
      tile &&
      prop &&
      prop.ownerId === null &&
      tile.price &&
      player.money >= tile.price &&
      (tile.type === 'property' || tile.type === 'railroad' || tile.type === 'utility')
    ) {
      player.money -= tile.price;
      prop.ownerId = player.id;

      game.logs.push({
        id: String(Date.now()),
        stepNumber: game.logs.length + 1,
        playerId: player.id,
        playerName: player.name,
        action: 'BUY_PROPERTY',
        details: `${player.name} purchased ${tile.name} for $${tile.price}.`,
        timestamp: Date.now()
      });

      io.to(data.gameId).emit('game_updated', game);
    }
  });

  // Build House
  socket.on('build_house', (data: { gameId: string; playerId: string; tileId: number }) => {
    const game = games.get(data.gameId);
    if (!game) return;

    const player = game.players.find(p => p.id === data.playerId);
    const tile = BOARD_TILES[data.tileId];
    const prop = game.properties[data.tileId];

    const currentPlayer = game.players[game.currentPlayerIndex];
    if (
      player &&
      currentPlayer?.id === player.id &&
      game.hasRolled &&
      tile &&
      prop &&
      tile.houseCost &&
      canBuildOnProperty(game, player.id, data.tileId) &&
      player.money >= tile.houseCost
    ) {
      player.money -= tile.houseCost;
      prop.houses += 1;

      const houseText = prop.houses === 5 ? 'Hotel' : `House #${prop.houses}`;
      game.logs.push({
        id: String(Date.now()),
        stepNumber: game.logs.length + 1,
        playerId: player.id,
        playerName: player.name,
        action: 'BUILD_HOUSE',
        details: `${player.name} built a ${houseText} on ${tile.name} for $${tile.houseCost}.`,
        timestamp: Date.now()
      });

      io.to(data.gameId).emit('game_updated', game);
    }
  });

  // End Turn
  socket.on('end_turn', (data: { gameId: string; playerId: string }) => {
    const game = games.get(data.gameId);
    if (!game || game.status !== 'playing') return;

    const currentPlayer = game.players[game.currentPlayerIndex];
    if (currentPlayer.id !== data.playerId) return;

    // Doubles grant an extra roll; the player must roll again instead of ending the turn.
    if (game.doublesCount > 0 && !currentPlayer.inJail) {
      game.hasRolled = false;
      game.currentTurnTimer = 30;
      io.to(data.gameId).emit('game_updated', game);
      return;
    }

    advanceTurn(game);
    io.to(data.gameId).emit('game_updated', game);
  });

  // Send Chat Message
  socket.on('send_chat', (data: { gameId: string; senderId: string; senderName: string; text: string; emoji?: string }) => {
    const game = games.get(data.gameId);
    if (!game) return;

    const msg = {
      id: String(Date.now()),
      senderId: data.senderId,
      senderName: data.senderName,
      text: data.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      emoji: data.emoji
    };

    game.chat.push(msg);
    io.to(data.gameId).emit('chat_received', msg);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Monopoly Empire Full-Stack Server running on http://localhost:${PORT}`);
  });
}

startServer();
