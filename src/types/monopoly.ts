export type Language = 'en' | 'uz' | 'ru';

export type GameMode = 'classic' | 'fast' | 'custom';

export type TileType = 
  | 'go' 
  | 'property' 
  | 'community-chest' 
  | 'tax' 
  | 'railroad' 
  | 'chance' 
  | 'jail' 
  | 'utility' 
  | 'free-parking' 
  | 'go-to-jail';

export type GroupColor = 
  | 'brown' 
  | 'light-blue' 
  | 'pink' 
  | 'orange' 
  | 'red' 
  | 'yellow' 
  | 'green' 
  | 'dark-blue' 
  | 'railroad' 
  | 'utility' 
  | 'special';

export interface BoardTile {
  id: number;
  name: string;
  type: TileType;
  price?: number;
  rent?: number[]; // [base, 1 house, 2 houses, 3 houses, 4 houses, hotel]
  houseCost?: number;
  group?: GroupColor;
  mortgageValue?: number;
  taxAmount?: number;
  description?: string;
  iconName?: string;
}

export interface PropertyState {
  tileId: number;
  ownerId: string | null;
  houses: number; // 0-4 houses, 5 = hotel
  isMortgaged: boolean;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  color: string;
  money: number;
  position: number;
  inJail: boolean;
  jailTurns: number;
  hasJailCard: boolean;
  isBankrupt: boolean;
  isBot: boolean;
  isReady: boolean;
  isMuted?: boolean;
  isSpeaking?: boolean;
}

export interface TradeItem {
  money: number;
  properties: number[]; // tileIds
}

export interface TradeOffer {
  id: string;
  fromPlayerId: string;
  toPlayerId: string;
  offered: TradeItem;
  requested: TradeItem;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
  emoji?: string;
}

export interface CardEffect {
  title: string;
  text: string;
  type: 'chance' | 'community';
  action: 'money' | 'move' | 'jail' | 'jail_free' | 'repairs';
  amount?: number;
  destination?: number;
}

export interface MoveLog {
  id: string;
  stepNumber: number;
  playerId: string;
  playerName: string;
  action: string;
  details: string;
  dice?: [number, number];
  timestamp: number;
  boardStateSnapshot?: {
    players: Player[];
    properties: Record<number, PropertyState>;
  };
}

export interface GameState {
  id: string;
  roomCode: string;
  roomName: string;
  mode: GameMode;
  status: 'waiting' | 'playing' | 'ended';
  players: Player[];
  currentPlayerIndex: number;
  properties: Record<number, PropertyState>;
  dice: [number, number];
  hasRolled: boolean;
  doublesCount: number;
  currentTurnTimer: number;
  tradeOffer: TradeOffer | null;
  activeCard: CardEffect | null;
  logs: MoveLog[];
  winner: Player | null;
  chat: ChatMessage[];
  createdAt: number;
}

export interface Room {
  id: string;
  code: string;
  name: string;
  hostId: string;
  hasPassword: boolean;
  password?: string;
  maxPlayers: number;
  isPrivate: boolean;
  mode: GameMode;
  players: Player[];
  status: 'lobby' | 'in-game';
}

export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  coins: number;
  level: number;
  xp: number;
  wins: number;
  totalGames: number;
  highestMoney: number;
  friends: string[];
  achievements: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardCoins: number;
  rewardXp: number;
  unlocked: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  wins: number;
  totalGames: number;
  coins: number;
  level: number;
}
