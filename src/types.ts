export type RoomType =
  | 'Rush Hour'
  | 'Battle Cage'
  | 'Clash Squad'
  | 'Lone Wolf'
  | 'Team Deathmatch';

export type WinCondition = 'Highest kills' | 'Match Winner';

export type TeamType = '1v1' | '2v2' | '4v4';

export type EntryType = 'Wallet' | 'Free points';

export type WalletProvider = 'eSewa' | 'Khalti';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  avatar: string;
  role: 'admin' | 'player';
  ffIgn: string;
  ffUid: string;
  walletBalance: number;
  winningBalance: number;
  freePoints: number;
  lastDailyClaimDate: string | null;
  status: 'active' | 'suspended';
  isVerifiedGoogle: boolean;
  joinedAt: string;
  matchesPlayed: number;
  matchesWon: number;
  isBot?: boolean;
}

export interface Contest {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorIgn: string;
  creatorUid: string;
  roomType: RoomType;
  winCondition: WinCondition;
  teamType: TeamType;
  throwableLimit: 'Yes' | 'No';
  characterSkill: 'Yes' | 'No';
  headshotMode: 'Yes' | 'No';
  gameplay: 'Competitive' | 'Default';
  rounds: 9 | 13;
  maxContestants: number;
  entryType: EntryType;
  entryFee: number;
  prizePool: number;
  participants: {
    userId: string;
    name: string;
    ffIgn: string;
    ffUid: string;
    joinedAt: string;
  }[];
  roomId?: string;
  roomPassword?: string;
  status: 'open' | 'live' | 'completed' | 'cancelled';
  winnerUserId?: string;
  winnerIgn?: string;
  createdAt: string;
}

export interface TransactionRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: 'deposit' | 'withdrawal' | 'contest_entry' | 'contest_win' | 'daily_reward' | 'admin_adjustment';
  provider: WalletProvider | 'System';
  walletAccountId: string;
  referenceCode: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: 'pending' | 'completed' | 'rejected';
  timestamp: string;
  note?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: 'admin' | 'player';
  action: string;
  category: 'auth' | 'payment' | 'contest' | 'admin' | 'security';
  details: string;
  timestamp: string;
  ipHash: string;
}

export interface PlatformSettings {
  tiktokUrl: string;
  youtubeUrl: string;
  esewaMerchantName: string;
  esewaMerchantId: string;
  withdrawalChargePercent: number;
  minWithdrawalPoints: number;
  dailyFreePointsReward: number;
  autoApproveDeposits: boolean;
  antiBotProtectionEnabled: boolean;
  requireGoogleVerification: boolean;
}
