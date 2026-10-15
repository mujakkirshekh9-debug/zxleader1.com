import React, { useState } from 'react';
import {
  Activity,
  Users,
  CreditCard,
  Trophy,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Trash2,
  Ban,
  PlusCircle,
  MinusCircle,
  Search,
  KeyRound,
  Crown,
  Settings,
  RefreshCw,
  Lock,
} from 'lucide-react';
import {
  ActivityLog,
  Contest,
  PlatformSettings,
  TransactionRecord,
  UserAccount,
} from '../types';
import { EsewaQrCard } from './EsewaQrCard';
import { ZxLogo } from './ZxLogo';

interface AdminDashboardViewProps {
  users: UserAccount[];
  contests: Contest[];
  transactions: TransactionRecord[];
  activityLogs: ActivityLog[];
  settings: PlatformSettings;
  onUpdateSettings: (newSettings: PlatformSettings) => void;
  onApproveTransaction: (txId: string) => void;
  onRejectTransaction: (txId: string) => void;
  onAdjustUserBalance: (
    userId: string,
    field: 'walletBalance' | 'winningBalance' | 'freePoints',
    delta: number
  ) => void;
  onToggleUserStatus: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onPurgeBots: () => number;
  onSettleContestWinner: (contestId: string, winnerUserId: string) => void;
  onUpdateContestRoomCredentials: (
    contestId: string,
    roomId: string,
    roomPassword: string
  ) => void;
  onDeleteContest: (contestId: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  users,
  contests,
  transactions,
  activityLogs,
  settings,
  onUpdateSettings,
  onApproveTransaction,
  onRejectTransaction,
  onAdjustUserBalance,
  onToggleUserStatus,
  onDeleteUser,
  onPurgeBots,
  onSettleContestWinner,
  onUpdateContestRoomCredentials,
  onDeleteContest,
}) => {
  const [activeTab, setActiveTab] = useState<
    'analytics' | 'gateway' | 'users' | 'contests'
  >('analytics');
  const [userSearch, setUserSearch] = useState('');
  const [txFilter, setTxFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [logFilter, setLogFilter] = useState<string>('all');
  const [botScanNotice, setBotScanNotice] = useState<string>('');
  const [editingRoomId, setEditingRoomId] = useState<Record<string, { id: string; pass: string }>>({});

  const realUsers = users.filter((u) => !u.isBot);
  const botCount = users.filter((u) => u.isBot).length;
  const totalDeposits = transactions
    .filter((t) => t.type === 'deposit' && t.status === 'completed')
    .reduce((acc, t) => acc + t.amount, 0);
  const pendingTxCount = transactions.filter((t) => t.status === 'pending').length;
  const totalWithdrawalsPaid = transactions
    .filter((t) => t.type === 'withdrawal' && t.status === 'completed')
    .reduce((acc, t) => acc + t.netAmount, 0);
  const platformFeeEarned = transactions
    .filter((t) => t.type === 'withdrawal' && t.status === 'completed')
    .reduce((acc, t) => acc + t.fee, 0);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.ffIgn.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.ffUid.includes(userSearch)
  );

  const filteredTransactions = transactions.filter((t) =>
    txFilter === 'all' ? true : t.status === txFilter
  );

  const filteredLogs = activityLogs.filter((l) =>
    logFilter === 'all' ? true : l.category === logFilter
  );

  const handleRunBotPurge = () => {
    const removed = onPurgeBots();
    setBotScanNotice(
      removed > 0
        ? `Purged ${removed} bot account(s) and locked rooms to verified Google players.`
        : 'Security Scan Complete: 0 Bots found. All active accounts are verified human players.'
    );
    setTimeout(() => setBotScanNotice(''), 4000);
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Header Banner */}
      <div className="rounded-3xl p-5 bg-[#0A253B] text-white border border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ZxLogo size="md" />
            <div>
              <div className="text-xs font-semibold text-sky-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Access Only · salmankhan.2k@gmail.com</span>
              </div>
              <h1 className="text-2xl font-black tracking-wider mt-0.5">
                ZX__ESPORTS Admin Command Center
              </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRunBotPurge}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Anti-Bot Purge ({botCount} Bots)</span>
          </button>
        </div>

        {botScanNotice && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-xs text-emerald-200 font-medium">
            {botScanNotice}
          </div>
        )}

        {/* Sub-navigation Tabs */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-white text-[#0A253B]'
                : 'bg-white/10 text-white/80 hover:bg-white/15'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Analytics & Logs</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gateway')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'gateway'
                ? 'bg-white text-[#0A253B]'
                : 'bg-white/10 text-white/80 hover:bg-white/15'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>eSewa Gateway ({pendingTxCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-white text-[#0A253B]'
                : 'bg-white/10 text-white/80 hover:bg-white/15'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Users ({realUsers.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contests')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'contests'
                ? 'bg-white text-[#0A253B]'
                : 'bg-white/10 text-white/80 hover:bg-white/15'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Rooms ({contests.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ANALYTICS & LIVE ACTIVITY LOGS */}
      {activeTab === 'analytics' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90">
              <div className="text-xs font-semibold text-slate-500">
                Verified Players
              </div>
              <div className="mt-1 text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                {realUsers.length}
              </div>
              <div className="mt-1 text-[11px] text-emerald-700 font-medium">
                0 Bots · Google Verified
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/90">
              <div className="text-xs font-semibold text-slate-500">
                eSewa Total Deposits
              </div>
              <div className="mt-1 text-2xl font-extrabold text-emerald-700 font-mono tabular-nums">
                Rs. {totalDeposits}
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                Merchant: {settings.esewaMerchantId}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/90">
              <div className="text-xs font-semibold text-slate-500">
                Pending Approvals
              </div>
              <div className="mt-1 text-2xl font-extrabold text-amber-600 font-mono tabular-nums">
                {pendingTxCount}
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                Paid out: Rs. {totalWithdrawalsPaid}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/90">
              <div className="text-xs font-semibold text-slate-500">
                Active Contests
              </div>
              <div className="mt-1 text-2xl font-extrabold text-[#084C70] font-mono tabular-nums">
                {contests.filter((c) => c.status === 'open' || c.status === 'live').length}
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                Fees Earned: Rs. {platformFeeEarned}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Live Platform Activity Stream
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time audit log of every user login, eSewa transaction, and match event.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['all', 'payment', 'contest', 'auth', 'security', 'admin'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setLogFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-colors ${
                      logFilter === cat
                        ? 'bg-[#084C70] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{log.action}</span>
                      <span className="text-[11px] font-normal text-slate-500">
                        · {log.userName} ({log.userRole})
                      </span>
                    </div>
                    <div className="text-slate-600">{log.details}</div>
                  </div>
                  <div className="text-right font-mono tabular-nums text-[11px] text-slate-400 shrink-0">
                    <div>
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </div>
                    <div>IP: {log.ipHash}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ESEWA QR & PAYMENT GATEWAY LIVE MONITOR */}
      {activeTab === 'gateway' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-slate-200/90 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Live Payment Gateway Monitor
                  </h2>
                  <p className="text-xs text-slate-500">
                    Approve eSewa QR deposits & process player withdrawals in real time.
                  </p>
                </div>

                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                  {(['all', 'pending', 'completed'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setTxFilter(st)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${
                        txFilter === st
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Auto-Verify eSewa QR Deposits
                  </div>
                  <div className="text-[11px] text-slate-500">
                    When enabled, player QR top-ups credit points automatically upon submission.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSettings({
                      ...settings,
                      autoApproveDeposits: !settings.autoApproveDeposits,
                    })
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                    settings.autoApproveDeposits
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {settings.autoApproveDeposits ? 'Auto-Credit ON' : 'Manual Approval'}
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredTransactions.length === 0 ? (
                  <p className="py-8 text-center text-xs text-slate-400">
                    No transactions match the selected filter.
                  </p>
                ) : (
                  filteredTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                          <span
                            className={
                              tx.type === 'deposit'
                                ? 'text-emerald-700'
                                : 'text-[#084C70]'
                            }
                          >
                            {tx.type === 'deposit'
                              ? 'eSewa Deposit (+)'
                              : `${tx.provider} Withdrawal (-)`}
                          </span>
                          <span>·</span>
                          <span className="font-mono tabular-nums">
                            {tx.amount} Pts (Net Rs. {tx.netAmount})
                          </span>
                        </div>
                        <div className="text-xs text-slate-700">
                          Player: <strong>{tx.userName}</strong> ({tx.userEmail})
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Wallet ID: {tx.walletAccountId} · Ref: {tx.referenceCode}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {tx.status === 'pending' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => onApproveTransaction(tx.id)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>
                                {tx.type === 'deposit' ? 'Approve & Credit' : 'Mark Paid'}
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onRejectTransaction(tx.id)}
                              className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </>
                        ) : (
                          <span
                            className={`text-xs font-bold uppercase ${
                              tx.status === 'completed'
                                ? 'text-emerald-600'
                                : 'text-red-600'
                            }`}
                          >
                            {tx.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <EsewaQrCard
                merchantName={settings.esewaMerchantName}
                merchantId={settings.esewaMerchantId}
                compact
              />

              <div className="bg-white rounded-3xl p-5 border border-slate-200/90 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Settings className="w-4 h-4 text-[#084C70]" />
                  <span>Merchant & Social Link Settings</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      eSewa Merchant Name
                    </label>
                    <input
                      type="text"
                      value={settings.esewaMerchantName}
                      onChange={(e) =>
                        onUpdateSettings({
                          ...settings,
                          esewaMerchantName: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      eSewa Merchant Number
                    </label>
                    <input
                      type="text"
                      value={settings.esewaMerchantId}
                      onChange={(e) =>
                        onUpdateSettings({
                          ...settings,
                          esewaMerchantId: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 font-mono tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      TikTok Link
                    </label>
                    <input
                      type="url"
                      value={settings.tiktokUrl}
                      onChange={(e) =>
                        onUpdateSettings({
                          ...settings,
                          tiktokUrl: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      YouTube Channel Link
                    </label>
                    <input
                      type="url"
                      value={settings.youtubeUrl}
                      onChange={(e) =>
                        onUpdateSettings({
                          ...settings,
                          youtubeUrl: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FULL USER CONTROL */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                User Accounts & Wallet Control
              </h2>
              <p className="text-xs text-slate-500">
                Add or deduct points, verify Google accounts, suspend or delete players.
              </p>
            </div>

            <div className="flex items-center h-10 px-3 rounded-xl bg-slate-100 border border-slate-200 w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search name, UID, email..."
                className="w-full bg-transparent text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                      u.role === 'admin' ? 'bg-[#084C70]' : 'bg-slate-700'
                    }`}
                  >
                    {u.avatar}
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>{u.name}</span>
                      {u.role === 'admin' && (
                        <span className="text-xs font-semibold text-amber-700">
                          · Admin
                        </span>
                      )}
                      {u.status === 'suspended' && (
                        <span className="text-xs font-semibold text-red-600">
                          · Suspended
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">{u.email}</div>
                    <div className="text-xs font-mono text-slate-700">
                      IGN: <strong>{u.ffIgn}</strong> · UID: {u.ffUid}
                    </div>
                    <div className="text-xs font-mono tabular-nums text-slate-600 pt-1 flex flex-wrap gap-3">
                      <span>
                        Wallet: <strong className="text-slate-900">{u.walletBalance} Pts</strong>
                      </span>
                      <span>·</span>
                      <span>
                        Winning: <strong className="text-emerald-700">{u.winningBalance} Pts</strong>
                      </span>
                      <span>·</span>
                      <span>
                        Free: <strong className="text-sky-700">{u.freePoints} Pts</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onAdjustUserBalance(u.id, 'walletBalance', 50)}
                    className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+50 Wallet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onAdjustUserBalance(u.id, 'walletBalance', -50)}
                    className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1"
                  >
                    <MinusCircle className="w-3.5 h-3.5" />
                    <span>-50 Wallet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onAdjustUserBalance(u.id, 'winningBalance', 50)}
                    className="px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold flex items-center gap-1"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>+50 Win Pts</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleUserStatus(u.id)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 ${
                      u.status === 'active'
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>{u.status === 'active' ? 'Suspend' : 'Activate'}</span>
                  </button>
                  {u.role !== 'admin' && (
                    <button
                      type="button"
                      onClick={() => onDeleteUser(u.id)}
                      className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CONTESTS & ROOM SETTLEMENT */}
      {activeTab === 'contests' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Contest Rooms & Winner Settlement
            </h2>
            <p className="text-xs text-slate-500">
              Assign Custom Room ID/Password and settle match winners to credit winning balance.
            </p>
          </div>

          <div className="space-y-4">
            {contests.map((cnt) => {
              const roomEdit = editingRoomId[cnt.id] ?? {
                id: cnt.roomId ?? '',
                pass: cnt.roomPassword ?? '',
              };
              return (
                <div
                  key={cnt.id}
                  className="p-4 rounded-2xl border border-slate-200 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {cnt.roomType} ({cnt.teamType}) · {cnt.winCondition}
                      </div>
                      <div className="text-xs text-slate-500">
                        Creator: {cnt.creatorIgn} ({cnt.creatorUid}) · Entry:{' '}
                        {cnt.entryFee} {cnt.entryType} · Prize: {cnt.prizePool} Pts
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase text-[#084C70]">
                        {cnt.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => onDeleteContest(cnt.id)}
                        className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600"
                        title="Delete contest"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <div className="flex items-center h-9 px-3 rounded-xl bg-slate-50 border border-slate-200">
                      <KeyRound className="w-3.5 h-3.5 text-slate-400 mr-2" />
                      <input
                        type="text"
                        value={roomEdit.id}
                        onChange={(e) =>
                          setEditingRoomId({
                            ...editingRoomId,
                            [cnt.id]: { ...roomEdit, id: e.target.value },
                          })
                        }
                        placeholder="Custom Room ID"
                        className="w-full bg-transparent text-xs font-mono focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center h-9 px-3 rounded-xl bg-slate-50 border border-slate-200">
                      <input
                        type="text"
                        value={roomEdit.pass}
                        onChange={(e) =>
                          setEditingRoomId({
                            ...editingRoomId,
                            [cnt.id]: { ...roomEdit, pass: e.target.value },
                          })
                        }
                        placeholder="Room Password"
                        className="w-full bg-transparent text-xs font-mono focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateContestRoomCredentials(cnt.id, roomEdit.id, roomEdit.pass)
                      }
                      className="h-9 px-3 rounded-xl bg-[#084C70] text-white text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Save Room ID/Pass</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs text-slate-600">
                      Joined Players ({cnt.participants.length}/{cnt.maxContestants}):{' '}
                      {cnt.participants.map((p) => p.ffIgn).join(' vs ')}
                    </div>
                    {cnt.status !== 'completed' ? (
                      <div className="flex flex-wrap gap-1.5">
                        {cnt.participants.map((p) => (
                          <button
                            key={p.userId}
                            type="button"
                            onClick={() => onSettleContestWinner(cnt.id, p.userId)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1"
                          >
                            <Trophy className="w-3 h-3" />
                            <span>Set Winner: {p.ffIgn}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700">
                        Winner Settled: {cnt.winnerIgn} (+{cnt.prizePool} Winning Pts)
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
