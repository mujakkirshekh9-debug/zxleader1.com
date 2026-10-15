import React, { useState, useEffect } from 'react';
import {
  Bell,
  UserCheck,
  LogOut,
  Wallet,
  Gift,
  CreditCard,
  ChevronRight,
  Gamepad2,
  Pencil,
  Share2,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  QrCode,
  Check,
  X,
  Lock,
} from 'lucide-react';
import {
  ActivityLog,
  Contest,
  PlatformSettings,
  TransactionRecord,
  UserAccount,
  WalletProvider,
} from './types';
import {
  DEFAULT_SETTINGS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_CONTESTS,
  INITIAL_TRANSACTIONS,
  INITIAL_USERS,
} from './data/initialData';
import { AuthScreen } from './components/AuthScreen';
import { ScanAndPayModal } from './components/ScanAndPayModal';
import { CreateContestModal } from './components/CreateContestModal';
import { WithdrawView } from './components/WithdrawView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { EsewaQrCard } from './components/EsewaQrCard';
import { ZxLogo } from './components/ZxLogo';

export default function App() {
  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('tournaop_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_USERS;
  });
  // Default to null so user sees the Auth gateway screen on first open
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('tournaop_active_user_id') || null;
    } catch {
      return null;
    }
  });
  const [hasSkippedToGuest, setHasSkippedToGuest] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('tournaop_users', JSON.stringify(users));
    } catch {
      // ignore
    }
  }, [users]);

  const [contests, setContests] = useState<Contest[]>(INITIAL_CONTESTS);
  const [transactions, setTransactions] =
    useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [activityLogs, setActivityLogs] =
    useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS);

  // Navigation & Modals
  const [activeNav, setActiveNav] = useState<'freefire' | 'withdraw' | 'admin'>(
    'freefire'
  );
  const [roomCategoryTab, setRoomCategoryTab] = useState<'fullmap' | 'cs'>('fullmap');
  const [showAllActiveContests, setShowAllActiveContests] = useState<boolean>(false);

  const [isScanPayOpen, setIsScanPayOpen] = useState(false);
  const [isCreateContestOpen, setIsCreateContestOpen] = useState(false);
  const [isEditIdentityOpen, setIsEditIdentityOpen] = useState(false);
  const [isQrQuickModalOpen, setIsQrQuickModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [editIgn, setEditIgn] = useState('');
  const [editUid, setEditUid] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentUser = users.find((u) => u.id === currentUserId) ?? null;
  const isAdmin = currentUser?.role === 'admin';

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const appendLog = (
    action: string,
    category: ActivityLog['category'],
    details: string,
    actor?: UserAccount | null
  ) => {
    const u = actor ?? currentUser;
    const newLog: ActivityLog = {
      id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      userId: u?.id ?? 'guest',
      userName: u?.name ?? 'Guest Player',
      userRole: u?.role ?? 'player',
      action,
      category,
      details,
      timestamp: new Date().toISOString(),
      ipHash: '103.163.182.xx',
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // If user is not logged in and hasn't explicitly skipped to guest, show the Entry Auth Screen
  if (!currentUser && !hasSkippedToGuest) {
    return (
      <AuthScreen
        users={users}
        onLoginSuccess={(user) => {
          setCurrentUserId(user.id);
          try {
            localStorage.setItem('tournaop_active_user_id', user.id);
          } catch {
            // ignore
          }
          setHasSkippedToGuest(false);
          appendLog(
            user.role === 'admin' ? 'Admin Portal Authenticated' : 'Player Signed In',
            'auth',
            `Authenticated as ${user.email}`,
            user
          );
          if (user.role === 'admin') {
            setActiveNav('admin');
            triggerToast('Welcome Admin Salman! Admin Command Center active.');
          } else {
            setActiveNav('freefire');
            triggerToast(`Welcome back, ${user.name}!`);
          }
        }}
        onSkipToGuest={() => {
          setHasSkippedToGuest(true);
          triggerToast('Browsing as Guest. Log in anytime to create contests or join rooms.');
        }}
        onRegisterUser={(newUser) => {
          setUsers((prev) => [newUser, ...prev]);
          appendLog(
            'New Account Registered',
            'auth',
            `Registered ${newUser.email} (IGN: ${newUser.ffIgn})`,
            newUser
          );
        }}
      />
    );
  }

  // Share Handler
  const handleShareApp = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ZX__ESPORTS — Free Fire Matches',
          text: 'Join ZX__ESPORTS Free Fire skill contests and win instant eSewa rewards!',
          url: shareUrl,
        });
        return;
      } catch {
        // fallback
      }
    }
    navigator.clipboard.writeText(shareUrl);
    triggerToast('App link copied to clipboard!');
  };

  // Claim Daily 4 Free Points
  const handleClaimDailyFreePoints = () => {
    if (!currentUser) {
      setHasSkippedToGuest(false);
      return;
    }
    const todayStr = new Date().toISOString().slice(0, 10);
    if (currentUser.lastDailyClaimDate === todayStr) {
      triggerToast('You have already claimed your 4 daily free points today!');
      return;
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? {
              ...u,
              freePoints: u.freePoints + settings.dailyFreePointsReward,
              lastDailyClaimDate: todayStr,
            }
          : u
      )
    );
    appendLog(
      `Claimed Daily ${settings.dailyFreePointsReward} Free Points`,
      'payment',
      `Free points updated to ${(
        currentUser.freePoints + settings.dailyFreePointsReward
      ).toFixed(2)}`
    );
    triggerToast(`+${settings.dailyFreePointsReward} Free points claimed successfully!`);
  };

  const handleOpenEditIdentity = () => {
    if (!currentUser) return;
    setEditIgn(currentUser.ffIgn);
    setEditUid(currentUser.ffUid);
    setIsEditIdentityOpen(true);
  };

  const handleSaveIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !editIgn.trim() || !editUid.trim()) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? { ...u, ffIgn: editIgn.trim(), ffUid: editUid.trim() }
          : u
      )
    );
    appendLog(
      'Updated Free Fire Identity',
      'auth',
      `IGN: ${editIgn.trim()} · UID: ${editUid.trim()}`
    );
    setIsEditIdentityOpen(false);
    triggerToast('Free Fire identity updated!');
  };

  // eSewa Deposit Submit
  const handleDepositSubmit = (
    amount: number,
    senderEsewaId: string,
    referenceCode: string,
    instantGateway: boolean
  ) => {
    if (!currentUser) return;
    const autoApprove = settings.autoApproveDeposits || instantGateway;

    const newTx: TransactionRecord = {
      id: 'TXN-' + Math.floor(10000 + Math.random() * 90000),
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      type: 'deposit',
      provider: 'eSewa',
      walletAccountId: senderEsewaId,
      referenceCode,
      amount,
      fee: 0,
      netAmount: amount,
      status: autoApprove ? 'completed' : 'pending',
      timestamp: new Date().toISOString(),
      note: `eSewa QR Payment to ${settings.esewaMerchantName} (${settings.esewaMerchantId})`,
    };

    setTransactions((prev) => [newTx, ...prev]);

    if (autoApprove) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === currentUser.id
            ? { ...u, walletBalance: u.walletBalance + amount }
            : u
        )
      );
      appendLog(
        `eSewa Instant Deposit Credited (+${amount} Pts)`,
        'payment',
        `Sender: ${senderEsewaId} · Ref: ${referenceCode}`
      );
      triggerToast(`${amount} Points added to your wallet!`);
    } else {
      appendLog(
        `Submitted eSewa QR Payment (${amount} Pts)`,
        'payment',
        `Sender: ${senderEsewaId} · Ref: ${referenceCode}`
      );
      triggerToast('eSewa payment submitted for live verification!');
    }
  };

  // Withdrawal Submit
  const handleWithdrawalSubmit = (
    provider: WalletProvider,
    walletAccountId: string,
    amount: number
  ) => {
    if (!currentUser) return;
    const fee = Math.round(amount * 0.1 * 100) / 100;
    const netAmount = Math.max(0, amount - fee);

    const newTx: TransactionRecord = {
      id: 'WD-' + Math.floor(10000 + Math.random() * 90000),
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      type: 'withdrawal',
      provider,
      walletAccountId,
      referenceCode: `WD-${provider.toUpperCase().slice(0, 3)}-${Math.floor(100 + Math.random() * 900)}`,
      amount,
      fee,
      netAmount,
      status: 'pending',
      timestamp: new Date().toISOString(),
      note: `10% charge (${fee} Pts) · Net payout Rs. ${netAmount}`,
    };

    setTransactions((prev) => [newTx, ...prev]);
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? { ...u, winningBalance: Math.max(0, u.winningBalance - amount) }
          : u
      )
    );
    appendLog(
      `Requested ${provider} Withdrawal (${amount} Pts)`,
      'payment',
      `${provider} ID: ${walletAccountId} · Net: Rs. ${netAmount}`
    );
    triggerToast('Withdrawal request submitted!');
  };

  // Create Contest
  const handleCreateContest = (
    contestData: Omit<Contest, 'id' | 'createdAt' | 'status' | 'participants'>
  ) => {
    if (!currentUser) return;

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== currentUser.id) return u;
        if (contestData.entryType === 'Free points') {
          return {
            ...u,
            freePoints: Math.max(0, u.freePoints - contestData.entryFee),
          };
        }
        return {
          ...u,
          walletBalance: Math.max(0, u.walletBalance - contestData.entryFee),
        };
      })
    );

    const newContest: Contest = {
      ...contestData,
      id: 'cnt-' + Date.now(),
      status: 'open',
      createdAt: new Date().toISOString(),
      participants: [
        {
          userId: currentUser.id,
          name: currentUser.name,
          ffIgn: currentUser.ffIgn,
          ffUid: currentUser.ffUid,
          joinedAt: new Date().toISOString(),
        },
      ],
    };

    setContests((prev) => [newContest, ...prev]);

    if (
      contestData.roomType === 'Rush Hour' ||
      contestData.roomType === 'Battle Cage'
    ) {
      setRoomCategoryTab('fullmap');
    } else {
      setRoomCategoryTab('cs');
    }

    appendLog(
      `Created ${contestData.roomType} Contest`,
      'contest',
      `Fee: ${contestData.entryFee} ${contestData.entryType}`
    );
    triggerToast(`${contestData.roomType} contest created!`);
  };

  // Join Contest
  const handleJoinContest = (contest: Contest) => {
    if (!currentUser) {
      setHasSkippedToGuest(false);
      return;
    }
    if (contest.participants.some((p) => p.userId === currentUser.id)) {
      triggerToast('You have already joined this contest room.');
      return;
    }
    if (contest.participants.length >= contest.maxContestants) {
      triggerToast('This contest room is already full.');
      return;
    }

    if (contest.entryType === 'Free points' && currentUser.freePoints < contest.entryFee) {
      triggerToast('Insufficient free points. Claim daily free points first!');
      return;
    }
    if (contest.entryType === 'Wallet' && currentUser.walletBalance < contest.entryFee) {
      triggerToast('Insufficient wallet points. Please top up via eSewa QR!');
      setIsScanPayOpen(true);
      return;
    }

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== currentUser.id) return u;
        if (contest.entryType === 'Free points') {
          return { ...u, freePoints: u.freePoints - contest.entryFee };
        }
        return { ...u, walletBalance: u.walletBalance - contest.entryFee };
      })
    );

    setContests((prev) =>
      prev.map((c) => {
        if (c.id !== contest.id) return c;
        const updatedParticipants = [
          ...c.participants,
          {
            userId: currentUser.id,
            name: currentUser.name,
            ffIgn: currentUser.ffIgn,
            ffUid: currentUser.ffUid,
            joinedAt: new Date().toISOString(),
          },
        ];
        return {
          ...c,
          participants: updatedParticipants,
          status:
            updatedParticipants.length >= c.maxContestants ? 'live' : 'open',
        };
      })
    );

    appendLog(
      `Joined ${contest.roomType} Contest`,
      'contest',
      `Room ${contest.id}`
    );
    triggerToast(`Joined ${contest.roomType} match successfully!`);
  };

  // Admin handlers
  const handleAdminApproveTx = (txId: string) => {
    const target = transactions.find((t) => t.id === txId);
    if (!target || target.status !== 'pending') return;

    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, status: 'completed' } : t))
    );

    if (target.type === 'deposit') {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === target.userId
            ? { ...u, walletBalance: u.walletBalance + target.amount }
            : u
        )
      );
      appendLog(
        `Admin Approved eSewa Deposit (+${target.amount} Pts)`,
        'admin',
        `User: ${target.userName}`
      );
      triggerToast(`Approved deposit of ${target.amount} Pts`);
    } else {
      appendLog(
        `Admin Settled Withdrawal (Rs. ${target.netAmount})`,
        'admin',
        `User: ${target.userName}`
      );
      triggerToast(`Marked withdrawal paid`);
    }
  };

  const handleAdminRejectTx = (txId: string) => {
    const target = transactions.find((t) => t.id === txId);
    if (!target || target.status !== 'pending') return;

    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, status: 'rejected' } : t))
    );

    if (target.type === 'withdrawal') {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === target.userId
            ? { ...u, winningBalance: u.winningBalance + target.amount }
            : u
        )
      );
    }

    appendLog('Admin Rejected Transaction', 'admin', `Ref: ${target.referenceCode}`);
    triggerToast(`Transaction rejected.`);
  };

  const handleAdminAdjustUserBalance = (
    userId: string,
    field: 'walletBalance' | 'winningBalance' | 'freePoints',
    delta: number
  ) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, [field]: Math.max(0, u[field] + delta) } : u
      )
    );
    appendLog(
      `Admin Adjusted Balance (${delta > 0 ? '+' : ''}${delta} Pts)`,
      'admin',
      `Target: ${target.name}`
    );
    triggerToast(`Updated ${target.name}'s balance.`);
  };

  const handleAdminToggleUserStatus = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    const nextStatus = target.status === 'active' ? 'suspended' : 'active';
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
    );
    appendLog(`Admin Changed Status to ${nextStatus}`, 'admin', target.name);
    triggerToast(`${target.name} is now ${nextStatus}.`);
  };

  const handleAdminDeleteUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (currentUserId === userId) setCurrentUserId(null);
    appendLog('Admin Deleted User', 'admin', target.name);
    triggerToast(`Deleted user ${target.name}.`);
  };

  const handleAdminPurgeBots = () => {
    const bots = users.filter((u) => u.isBot);
    if (bots.length > 0) {
      setUsers((prev) => prev.filter((u) => !u.isBot));
    }
    appendLog('Executed Anti-Bot Security Purge', 'security', `Purged ${bots.length} bot accounts`);
    return bots.length;
  };

  const handleAdminSettleWinner = (contestId: string, winnerUserId: string) => {
    const cnt = contests.find((c) => c.id === contestId);
    const winner = users.find((u) => u.id === winnerUserId);
    if (!cnt || !winner) return;

    setContests((prev) =>
      prev.map((c) =>
        c.id === contestId
          ? {
              ...c,
              status: 'completed',
              winnerUserId: winner.id,
              winnerIgn: winner.ffIgn,
            }
          : c
      )
    );

    setUsers((prev) =>
      prev.map((u) =>
        u.id === winnerUserId
          ? {
              ...u,
              winningBalance: u.winningBalance + cnt.prizePool,
              matchesPlayed: u.matchesPlayed + 1,
              matchesWon: u.matchesWon + 1,
            }
          : u
      )
    );

    appendLog(
      `Settled ${cnt.roomType} Winner: ${winner.ffIgn}`,
      'contest',
      `+${cnt.prizePool} Winning Points to ${winner.name}`
    );
    triggerToast(`Winner settled! +${cnt.prizePool} Winning Points credited.`);
  };

  const handleAdminUpdateRoomCredentials = (
    contestId: string,
    roomId: string,
    roomPassword: string
  ) => {
    setContests((prev) =>
      prev.map((c) =>
        c.id === contestId ? { ...c, roomId, roomPassword } : c
      )
    );
    appendLog('Updated Custom Room Credentials', 'contest', `Contest ${contestId}`);
    triggerToast('Room ID and Password updated!');
  };

  const handleAdminDeleteContest = (contestId: string) => {
    setContests((prev) => prev.filter((c) => c.id !== contestId));
    appendLog('Deleted Contest', 'admin', contestId);
    triggerToast('Contest room removed.');
  };

  const filteredContests = contests.filter((c) => {
    if (c.status === 'completed' || c.status === 'cancelled') return false;
    if (roomCategoryTab === 'fullmap') {
      return c.roomType === 'Rush Hour' || c.roomType === 'Battle Cage';
    }
    return (
      c.roomType === 'Clash Squad' ||
      c.roomType === 'Lone Wolf' ||
      c.roomType === 'Team Deathmatch'
    );
  });

  const userTransactions = transactions.filter(
    (t) => t.userId === currentUser?.id
  );
  const userWithdrawals = userTransactions.filter(
    (t) => t.type === 'withdrawal'
  );
  const pendingAdminTxCount = transactions.filter(
    (t) => t.status === 'pending'
  ).length;

  return (
    <div className="min-h-screen bg-[#F4F7FA] text-[#0F1E2E]">
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#0B233D] text-white text-xs font-bold shadow-lg flex items-center gap-2 border border-white/10">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-xl mx-auto px-4 pt-4 pb-24">
        {activeNav === 'freefire' && (
          <div className="space-y-5">
            {/* Top Header with ZX__ESPORTS Branding */}
            <header className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <ZxLogo size="lg" />
                <div className="min-w-0">
                  <h1 className="text-2xl font-black text-[#0B1F33] tracking-wider truncate">
                    ZX__ESPORTS
                  </h1>
                  <p className="text-xs text-slate-600 truncate font-medium">
                    Free Fire Matches · Skill Contests
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Admin Mode Badge: ONLY visible to Admin Salman */}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setActiveNav('admin')}
                    className="px-2.5 py-1.5 rounded-xl bg-[#084C70] text-amber-300 hover:bg-[#063B57] text-[11px] font-bold flex items-center gap-1 shadow-2xs"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Admin</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsQrQuickModalOpen(true)}
                  title="Show eSewa Merchant QR"
                  className="w-11 h-11 rounded-full bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center text-[#41A124] hover:bg-emerald-50 transition-colors"
                >
                  <QrCode className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  aria-label="Notifications"
                  className="relative w-11 h-11 rounded-full bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center text-[#0B1F33] hover:bg-slate-50 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {isAdmin && pendingAdminTxCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-red-500 absolute top-2.5 right-2.5" />
                  )}
                </button>
              </div>
            </header>

            {isNotificationsOpen && (
              <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    Live Platform Notifications
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsNotificationsOpen(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Close
                  </button>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  {activityLogs.slice(0, 3).map((item) => (
                    <div key={item.id} className="py-2">
                      <div className="font-semibold text-slate-800">{item.action}</div>
                      <div className="text-[11px] text-slate-500">{item.details}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Account Card (Clean, NO inline signup form) */}
            {currentUser ? (
              <section className="rounded-3xl p-5 bg-gradient-to-br from-[#07344E] via-[#0B4B6C] to-[#13698E] text-white shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white/12 border border-white/15 flex items-center justify-center shrink-0">
                      <UserCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-extrabold tracking-tight">
                          {currentUser.name}
                        </h2>
                        {isAdmin && (
                          <span className="text-[11px] font-bold text-amber-300">
                            (Admin)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/80">
                        Wallet, rewards and Free Fire identity
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      appendLog('Signed out of account', 'auth', currentUser.email);
                      try {
                        localStorage.removeItem('tournaop_active_user_id');
                      } catch {
                        // ignore
                      }
                      setCurrentUserId(null);
                      setHasSkippedToGuest(false);
                      triggerToast('Signed out securely.');
                    }}
                    title="Sign out"
                    className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white/90 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>

                <div className="rounded-2xl p-4 bg-white/10 border border-white/15 grid grid-cols-2 divide-x divide-white/15">
                  <div className="pr-3">
                    <div className="flex items-center gap-1.5 text-xs text-white/80">
                      <Wallet className="w-3.5 h-3.5" />
                      <span>Wallet balance</span>
                    </div>
                    <div className="mt-1.5 text-xl font-extrabold font-mono tabular-nums">
                      {currentUser.walletBalance.toFixed(2)} Points
                    </div>
                  </div>

                  <div className="pl-4">
                    <div className="flex items-center gap-1.5 text-xs text-white/80">
                      <Gift className="w-3.5 h-3.5" />
                      <span>Free points</span>
                    </div>
                    <div className="mt-1.5 text-xl font-extrabold font-mono tabular-nums">
                      {currentUser.freePoints.toFixed(2)}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsScanPayOpen(true)}
                  className="w-full p-3.5 rounded-2xl bg-white text-[#0B1F33] flex items-center justify-between shadow-2xs hover:bg-slate-50 transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF3F8] text-[#084C70] flex items-center justify-center shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-[#0B1F33]">
                        Add balance
                      </div>
                      <div className="text-xs text-slate-500">
                        Top up your wallet securely
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>

                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-white/12 flex items-center justify-center shrink-0">
                      <Gamepad2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-extrabold text-white truncate">
                        {currentUser.ffIgn}
                      </div>
                      <div className="text-xs text-white/80 font-mono tabular-nums truncate">
                        UID: {currentUser.ffUid}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenEditIdentity}
                    className="px-3.5 py-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleClaimDailyFreePoints}
                  className="w-full h-12 rounded-2xl bg-white hover:bg-slate-50 text-[#0B1F33] font-extrabold text-sm flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-[0.99]"
                >
                  <Gift className="w-4 h-4 text-[#0B1F33]" />
                  <span>Claim daily 4 free points</span>
                </button>
              </section>
            ) : (
              <section className="rounded-3xl p-5 bg-gradient-to-br from-[#07344E] via-[#0B4B6C] to-[#13698E] text-white shadow-sm space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/12 border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
                    <UserCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold tracking-tight">
                      Guest Player Mode
                    </h2>
                    <p className="mt-1 text-xs text-white/85 leading-relaxed">
                      You are previewing ZX__ESPORTS. Log in to create contests, join match rooms and withdraw winnings.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setHasSkippedToGuest(false)}
                  className="w-full h-12 rounded-2xl bg-white hover:bg-slate-50 text-[#0B1F33] font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-2xs transition-all active:scale-[0.99]"
                >
                  <Lock className="w-4 h-4 text-[#0B1F33]" />
                  <span>Open Login / Signup Portal</span>
                </button>
              </section>
            )}

            {/* Connect with ZX__ESPORTS Card: Share | YouTube (salman.2k) | TikTok */}
            <section className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EAF3F8] text-[#084C70] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#0B1F33]">
                    Connect with ZX__ESPORTS
                  </h2>
                  <p className="text-xs text-slate-500">
                    Share the app, subscribe on YouTube or follow on TikTok.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={handleShareApp}
                  className="p-3.5 rounded-2xl bg-[#F5F7FA] hover:bg-slate-200/70 flex flex-col items-center justify-center gap-2 transition-colors"
                >
                  <Share2 className="w-5 h-5 text-[#084C70]" />
                  <span className="text-xs font-bold text-[#0B1F33]">Share</span>
                </button>

                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-[#F5F7FA] hover:bg-red-50 flex flex-col items-center justify-center gap-2 transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-[#FF0000]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  <span className="text-xs font-bold text-[#0B1F33]">YouTube</span>
                </a>

                <a
                  href={settings.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-[#F5F7FA] hover:bg-slate-200/70 flex flex-col items-center justify-center gap-2 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-black"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                  <span className="text-xs font-bold text-[#0B1F33]">TikTok</span>
                </a>
              </div>
            </section>

            {/* Create a contest Card */}
            <button
              type="button"
              onClick={() => {
                if (!currentUser) {
                  setHasSkippedToGuest(false);
                  return;
                }
                setIsCreateContestOpen(true);
              }}
              className="w-full text-left rounded-3xl p-5 bg-[#FFF6E9] border border-[#F7DEC0] flex items-center justify-between gap-4 shadow-2xs hover:bg-[#FDF0DC] transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#F59E0B] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <PlusCircle className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-[#78350F]">
                    Create a contest
                  </h2>
                  <p className="mt-0.5 text-xs text-[#92400E] leading-relaxed">
                    Choose the room, rules, prize type and entry fee.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[#78350F] shrink-0" />
            </button>

            {/* Room Filter */}
            <div className="grid grid-cols-2 p-1.5 bg-[#E9EEF5] rounded-2xl">
              <button
                type="button"
                onClick={() => setRoomCategoryTab('fullmap')}
                className={`py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                  roomCategoryTab === 'fullmap'
                    ? 'bg-white text-[#0B1F33] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Full Map Rooms
              </button>
              <button
                type="button"
                onClick={() => setRoomCategoryTab('cs')}
                className={`py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                  roomCategoryTab === 'cs'
                    ? 'bg-white text-[#0B1F33] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                CS Rooms
              </button>
            </div>

            {/* Contests Feed */}
            {filteredContests.length === 0 || !showAllActiveContests ? (
              <div className="bg-white rounded-3xl p-7 border border-slate-200/80 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF3F8] text-[#084C70] flex items-center justify-center mx-auto">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-[#0B1F33]">
                  No active contests
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  {roomCategoryTab === 'fullmap'
                    ? 'No Rush Hour or Battle Cage contests are accepting players right now.'
                    : 'No Clash Squad, Lone Wolf or Team Deathmatch contests are accepting players right now.'}
                </p>

                {filteredContests.length > 0 && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAllActiveContests(true)}
                      className="px-4 py-2 rounded-xl bg-[#EAF3F8] hover:bg-[#D8E9F3] text-[#084C70] text-xs font-bold transition-colors"
                    >
                      Show {filteredContests.length} Open Player Room(s)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-slate-600">
                    Verified Rooms ({filteredContests.length}) · 0 Bots
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAllActiveContests(false)}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-600"
                  >
                    Hide sample rooms
                  </button>
                </div>

                {filteredContests.map((cnt) => {
                  const isJoined = cnt.participants.some(
                    (p) => p.userId === currentUser?.id
                  );
                  return (
                    <div
                      key={cnt.id}
                      className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-base font-extrabold text-[#0B1F33] flex items-center gap-2">
                            <span>
                              {cnt.roomType} · {cnt.teamType}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Host: <strong className="text-slate-700">{cnt.creatorIgn}</strong> ·{' '}
                            {cnt.winCondition} · {cnt.rounds} Rounds
                          </div>
                        </div>

                        <div className="text-right font-mono tabular-nums">
                          <div className="text-sm font-extrabold text-emerald-700">
                            Prize: {cnt.prizePool} Pts
                          </div>
                          <div className="text-xs text-slate-500">
                            Entry: {cnt.entryFee} {cnt.entryType}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 flex flex-wrap gap-x-3 gap-y-1">
                        <span>Throwable Limit: {cnt.throwableLimit}</span>
                        <span>·</span>
                        <span>Skill: {cnt.characterSkill}</span>
                        <span>·</span>
                        <span>Headshot: {cnt.headshotMode}</span>
                        <span>·</span>
                        <span>{cnt.gameplay}</span>
                      </div>

                      {isJoined && cnt.roomId && (
                        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 font-mono">
                          <span className="inline-flex items-center gap-1.5 font-bold">
                            <KeyRound className="w-3.5 h-3.5 text-emerald-700" />
                            Room ID: {cnt.roomId}
                          </span>
                          <span className="font-bold">
                            Pass: {cnt.roomPassword || 'None'}
                          </span>
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                        <div className="text-xs text-slate-500 font-mono tabular-nums">
                          Players: {cnt.participants.length}/{cnt.maxContestants}
                        </div>

                        {isJoined ? (
                          <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                            Joined Room ✓
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleJoinContest(cnt)}
                            className="px-5 py-2.5 rounded-xl bg-[#084C70] hover:bg-[#063B57] text-white text-xs font-bold transition-colors"
                          >
                            Join Contest ({cnt.entryFee} Pts)
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeNav === 'withdraw' && (
          <WithdrawView
            currentUser={currentUser}
            onRequireLogin={() => setHasSkippedToGuest(false)}
            onSubmitWithdrawal={handleWithdrawalSubmit}
            userWithdrawals={userWithdrawals}
          />
        )}

        {/* Admin Dashboard: ONLY accessible if logged in as Admin Salman */}
        {activeNav === 'admin' && isAdmin && (
          <AdminDashboardView
            users={users}
            contests={contests}
            transactions={transactions}
            activityLogs={activityLogs}
            settings={settings}
            onUpdateSettings={setSettings}
            onApproveTransaction={handleAdminApproveTx}
            onRejectTransaction={handleAdminRejectTx}
            onAdjustUserBalance={handleAdminAdjustUserBalance}
            onToggleUserStatus={handleAdminToggleUserStatus}
            onDeleteUser={handleAdminDeleteUser}
            onPurgeBots={handleAdminPurgeBots}
            onSettleContestWinner={handleAdminSettleWinner}
            onUpdateContestRoomCredentials={handleAdminUpdateRoomCredentials}
            onDeleteContest={handleAdminDeleteContest}
          />
        )}
      </div>

      {/* Fixed Bottom Navigation:
          - If Admin: 3 tabs (Free Fire, Withdraw, Admin Control)
          - If Normal Player or Guest: ONLY 2 tabs (Free Fire, Withdraw). Admin portal is completely hidden!
      */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 h-16">
        <div
          className={`max-w-xl mx-auto h-full grid ${
            isAdmin ? 'grid-cols-3' : 'grid-cols-2'
          } items-center px-4`}
        >
          <button
            type="button"
            onClick={() => setActiveNav('freefire')}
            className="flex flex-col items-center justify-center gap-1"
          >
            <div
              className={`px-5 py-1 rounded-full flex items-center justify-center transition-colors ${
                activeNav === 'freefire'
                  ? 'bg-[#E1EFF7] text-[#084C70]'
                  : 'text-slate-500'
              }`}
            >
              <Gamepad2 className="w-5 h-5" />
            </div>
            <span
              className={`text-[11px] font-bold ${
                activeNav === 'freefire' ? 'text-[#0B1F33]' : 'text-slate-500'
              }`}
            >
              Free Fire
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveNav('withdraw')}
            className="flex flex-col items-center justify-center gap-1"
          >
            <div
              className={`px-5 py-1 rounded-full flex items-center justify-center transition-colors ${
                activeNav === 'withdraw'
                  ? 'bg-[#E1EFF7] text-[#084C70]'
                  : 'text-slate-500'
              }`}
            >
              <Wallet className="w-5 h-5" />
            </div>
            <span
              className={`text-[11px] font-bold ${
                activeNav === 'withdraw' ? 'text-[#0B1F33]' : 'text-slate-500'
              }`}
            >
              Withdraw
            </span>
          </button>

          {/* Admin Control Tab: Strictly hidden from normal players */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => setActiveNav('admin')}
              className="flex flex-col items-center justify-center gap-1 relative"
            >
              <div
                className={`px-5 py-1 rounded-full flex items-center justify-center transition-colors ${
                  activeNav === 'admin'
                    ? 'bg-[#E1EFF7] text-[#084C70]'
                    : 'text-slate-500'
                }`}
              >
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span
                className={`text-[11px] font-bold ${
                  activeNav === 'admin' ? 'text-[#0B1F33]' : 'text-slate-500'
                }`}
              >
                Admin Control
              </span>
            </button>
          )}
        </div>
      </nav>

      {/* Modals */}
      <ScanAndPayModal
        isOpen={isScanPayOpen}
        onClose={() => setIsScanPayOpen(false)}
        settings={settings}
        onSubmitDeposit={handleDepositSubmit}
        recentUserTransactions={userTransactions}
      />

      <CreateContestModal
        isOpen={isCreateContestOpen}
        onClose={() => setIsCreateContestOpen(false)}
        currentUser={currentUser}
        onRequireLogin={() => setHasSkippedToGuest(false)}
        onCreateContest={handleCreateContest}
      />

      {isQrQuickModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-sm w-full">
            <button
              type="button"
              onClick={() => setIsQrQuickModalOpen(false)}
              className="absolute -top-11 right-0 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
            <EsewaQrCard
              merchantName={settings.esewaMerchantName}
              merchantId={settings.esewaMerchantId}
            />
            <button
              type="button"
              onClick={() => {
                setIsQrQuickModalOpen(false);
                setIsScanPayOpen(true);
              }}
              className="mt-3 w-full h-11 rounded-2xl bg-[#41A124] hover:bg-[#36881E] text-white font-bold text-xs shadow-sm"
            >
              Proceed to Add Points via eSewa →
            </button>
          </div>
        </div>
      )}

      {isEditIdentityOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveIdentity}
            className="bg-white rounded-3xl max-w-sm w-full p-6 border border-slate-200 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">
                Edit Free Fire Identity
              </h3>
              <button
                type="button"
                onClick={() => setIsEditIdentityOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Free Fire In-Game Name (IGN)
              </label>
              <input
                type="text"
                value={editIgn}
                onChange={(e) => setEditIgn(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:border-[#084C70]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Free Fire Numeric UID
              </label>
              <input
                type="text"
                value={editUid}
                onChange={(e) => setEditUid(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-mono tabular-nums focus:outline-none focus:border-[#084C70]"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditIdentityOpen(false)}
                className="w-1/3 h-11 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 h-11 rounded-xl bg-[#084C70] text-white text-xs font-bold"
              >
                Save Identity
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
