import { BoardTile, CardEffect, GroupColor } from '../types/monopoly';

export const BOARD_TILES: BoardTile[] = [
  // Bottom Row (Right to Left: 0 to 10)
  { id: 0, name: 'GO', type: 'go', description: 'Collect $200 salary as you pass', iconName: 'ArrowRight' },
  { id: 1, name: 'Mediterranean Ave', type: 'property', group: 'brown', price: 60, rent: [2, 10, 30, 90, 160, 250], houseCost: 50, mortgageValue: 30 },
  { id: 2, name: 'Community Chest', type: 'community-chest', description: 'Draw a Community Chest card', iconName: 'Gift' },
  { id: 3, name: 'Baltic Ave', type: 'property', group: 'brown', price: 60, rent: [4, 20, 60, 180, 320, 450], houseCost: 50, mortgageValue: 30 },
  { id: 4, name: 'Income Tax', type: 'tax', taxAmount: 200, description: 'Pay $200 Tax', iconName: 'Landmark' },
  { id: 5, name: 'Reading Railroad', type: 'railroad', group: 'railroad', price: 200, rent: [25, 50, 100, 200], mortgageValue: 100, iconName: 'Train' },
  { id: 6, name: 'Oriental Ave', type: 'property', group: 'light-blue', price: 100, rent: [6, 30, 90, 270, 400, 550], houseCost: 50, mortgageValue: 50 },
  { id: 7, name: 'Chance', type: 'chance', description: 'Draw a Chance card', iconName: 'Sparkles' },
  { id: 8, name: 'Vermont Ave', type: 'property', group: 'light-blue', price: 100, rent: [6, 30, 90, 270, 400, 550], houseCost: 50, mortgageValue: 50 },
  { id: 9, name: 'Connecticut Ave', type: 'property', group: 'light-blue', price: 120, rent: [8, 40, 100, 300, 450, 600], houseCost: 50, mortgageValue: 60 },
  { id: 10, name: 'In Jail / Just Visiting', type: 'jail', description: 'Just Visiting or In Jail', iconName: 'Lock' },

  // Left Column (Bottom to Top: 11 to 20)
  { id: 11, name: 'St. Charles Place', type: 'property', group: 'pink', price: 140, rent: [10, 50, 150, 450, 625, 750], houseCost: 100, mortgageValue: 70 },
  { id: 12, name: 'Electric Company', type: 'utility', group: 'utility', price: 150, rent: [10, 20], mortgageValue: 75, iconName: 'Zap' },
  { id: 13, name: 'States Ave', type: 'property', group: 'pink', price: 140, rent: [10, 50, 150, 450, 625, 750], houseCost: 100, mortgageValue: 70 },
  { id: 14, name: 'Virginia Ave', type: 'property', group: 'pink', price: 160, rent: [12, 60, 180, 500, 700, 900], houseCost: 100, mortgageValue: 80 },
  { id: 15, name: 'Pennsylvania Railroad', type: 'railroad', group: 'railroad', price: 200, rent: [25, 50, 100, 200], mortgageValue: 100, iconName: 'Train' },
  { id: 16, name: 'St. James Place', type: 'property', group: 'orange', price: 180, rent: [14, 70, 200, 550, 750, 950], houseCost: 100, mortgageValue: 90 },
  { id: 17, name: 'Community Chest', type: 'community-chest', description: 'Draw a Community Chest card', iconName: 'Gift' },
  { id: 18, name: 'Tennessee Ave', type: 'property', group: 'orange', price: 180, rent: [14, 70, 200, 550, 750, 950], houseCost: 100, mortgageValue: 90 },
  { id: 19, name: 'New York Ave', type: 'property', group: 'orange', price: 200, rent: [16, 80, 220, 600, 800, 1000], houseCost: 100, mortgageValue: 100 },
  { id: 20, name: 'Free Parking', type: 'free-parking', description: 'Resting place - No penalty', iconName: 'Car' },

  // Top Row (Left to Right: 21 to 30)
  { id: 21, name: 'Kentucky Ave', type: 'property', group: 'red', price: 220, rent: [18, 90, 250, 700, 875, 1050], houseCost: 150, mortgageValue: 110 },
  { id: 22, name: 'Chance', type: 'chance', description: 'Draw a Chance card', iconName: 'Sparkles' },
  { id: 23, name: 'Indiana Ave', type: 'property', group: 'red', price: 220, rent: [18, 90, 250, 700, 875, 1050], houseCost: 150, mortgageValue: 110 },
  { id: 24, name: 'Illinois Ave', type: 'property', group: 'red', price: 240, rent: [20, 100, 300, 750, 925, 1100], houseCost: 150, mortgageValue: 120 },
  { id: 25, name: 'B. & O. Railroad', type: 'railroad', group: 'railroad', price: 200, rent: [25, 50, 100, 200], mortgageValue: 100, iconName: 'Train' },
  { id: 26, name: 'Atlantic Ave', type: 'property', group: 'yellow', price: 260, rent: [22, 110, 330, 800, 975, 1150], houseCost: 150, mortgageValue: 130 },
  { id: 27, name: 'Ventnor Ave', type: 'property', group: 'yellow', price: 260, rent: [22, 110, 330, 800, 975, 1150], houseCost: 150, mortgageValue: 130 },
  { id: 28, name: 'Water Works', type: 'utility', group: 'utility', price: 150, rent: [10, 20], mortgageValue: 75, iconName: 'Droplet' },
  { id: 29, name: 'Marvin Gardens', type: 'property', group: 'yellow', price: 280, rent: [24, 120, 360, 850, 1025, 1200], houseCost: 150, mortgageValue: 140 },
  { id: 30, name: 'Go To Jail', type: 'go-to-jail', description: 'Go directly to Jail!', iconName: 'Siren' },

  // Right Column (Top to Bottom: 31 to 39)
  { id: 31, name: 'Pacific Ave', type: 'property', group: 'green', price: 300, rent: [26, 130, 390, 900, 1100, 1275], houseCost: 200, mortgageValue: 150 },
  { id: 32, name: 'North Carolina Ave', type: 'property', group: 'green', price: 300, rent: [26, 130, 390, 900, 1100, 1275], houseCost: 200, mortgageValue: 150 },
  { id: 33, name: 'Community Chest', type: 'community-chest', description: 'Draw a Community Chest card', iconName: 'Gift' },
  { id: 34, name: 'Pennsylvania Ave', type: 'property', group: 'green', price: 320, rent: [28, 150, 450, 1000, 1200, 1400], houseCost: 200, mortgageValue: 160 },
  { id: 35, name: 'Short Line Railroad', type: 'railroad', group: 'railroad', price: 200, rent: [25, 50, 100, 200], mortgageValue: 100, iconName: 'Train' },
  { id: 36, name: 'Chance', type: 'chance', description: 'Draw a Chance card', iconName: 'Sparkles' },
  { id: 37, name: 'Park Place', type: 'property', group: 'dark-blue', price: 350, rent: [35, 175, 500, 1100, 1300, 1500], houseCost: 200, mortgageValue: 175 },
  { id: 38, name: 'Luxury Tax', type: 'tax', taxAmount: 100, description: 'Pay $100 Luxury Tax', iconName: 'Crown' },
  { id: 39, name: 'Boardwalk', type: 'property', group: 'dark-blue', price: 400, rent: [50, 200, 600, 1400, 1700, 2000], houseCost: 200, mortgageValue: 200 }
];

export const CHANCE_CARDS: CardEffect[] = [
  { title: 'Advance to GO', text: 'Advance to GO. Collect $200.', type: 'chance', action: 'move', destination: 0, amount: 200 },
  { title: 'Bank Dividend', text: 'Bank pays you dividend of $50.', type: 'chance', action: 'money', amount: 50 },
  { title: 'Go to Jail', text: 'Go directly to Jail. Do not pass GO, do not collect $200.', type: 'chance', action: 'jail' },
  { title: 'Advance to Boardwalk', text: 'Take a trip to Boardwalk.', type: 'chance', action: 'move', destination: 39 },
  { title: 'Get Out of Jail Free', text: 'This card may be kept until needed.', type: 'chance', action: 'jail_free' },
  { title: 'Speeding Fine', text: 'Pay speeding fine of $15.', type: 'chance', action: 'money', amount: -15 },
  { title: 'Advance to Illinois Ave', text: 'If you pass GO, collect $200.', type: 'chance', action: 'move', destination: 24, amount: 200 },
  { title: 'Building Loan Matures', text: 'Collect $150 from the bank.', type: 'chance', action: 'money', amount: 150 }
];

export const COMMUNITY_CHEST_CARDS: CardEffect[] = [
  { title: 'Bank Error in Your Favor', text: 'Collect $200.', type: 'community', action: 'money', amount: 200 },
  { title: 'Doctor\'s Fee', text: 'Pay $50.', type: 'community', action: 'money', amount: -50 },
  { title: 'From Sale of Stock', text: 'You get $50.', type: 'community', action: 'money', amount: 50 },
  { title: 'Get Out of Jail Free', text: 'This card may be kept until needed.', type: 'community', action: 'jail_free' },
  { title: 'Go to Jail', text: 'Go directly to Jail.', type: 'community', action: 'jail' },
  { title: 'Holiday Fund Matures', text: 'Receive $100.', type: 'community', action: 'money', amount: 100 },
  { title: 'Income Tax Refund', text: 'Collect $20.', type: 'community', action: 'money', amount: 20 },
  { title: 'Life Insurance Matures', text: 'Collect $100.', type: 'community', action: 'money', amount: 100 }
];

export const COLOR_GROUP_MAP: Record<string, number[]> = {
  'brown': [1, 3],
  'light-blue': [6, 8, 9],
  'pink': [11, 13, 14],
  'orange': [16, 18, 19],
  'red': [21, 23, 24],
  'yellow': [26, 27, 29],
  'green': [31, 32, 34],
  'dark-blue': [37, 39],
  'railroad': [5, 15, 25, 35],
  'utility': [12, 28]
};

export const COLOR_HEX: Record<GroupColor, string> = {
  'brown': '#92400e',
  'light-blue': '#38bdf8',
  'pink': '#ec4899',
  'orange': '#f97316',
  'red': '#ef4444',
  'yellow': '#eab308',
  'green': '#22c55e',
  'dark-blue': '#1e40af',
  'railroad': '#475569',
  'utility': '#d97706',
  'special': '#64748b'
};
