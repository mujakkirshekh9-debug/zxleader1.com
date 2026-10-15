import React, { useState } from 'react';
import {
  Wallet,
  Phone,
  Banknote,
  Percent,
  Info,
  Send,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { TransactionRecord, UserAccount, WalletProvider } from '../types';

interface WithdrawViewProps {
  currentUser: UserAccount | null;
  onRequireLogin: () => void;
  onSubmitWithdrawal: (
    provider: WalletProvider,
    walletAccountId: string,
    amount: number
  ) => void;
  userWithdrawals: TransactionRecord[];
}

export const WithdrawView: React.FC<WithdrawViewProps> = ({
  currentUser,
  onRequireLogin,
  onSubmitWithdrawal,
  userWithdrawals,
}) => {
  const [selectedWallet, setSelectedWallet] = useState<WalletProvider>('eSewa');
  const [walletId, setWalletId] = useState<string>('');
  const [amountStr, setAmountStr] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const winningBalance = currentUser?.winningBalance ?? 0;
  const amountNum = Number(amountStr) || 0;
  const chargeAmount = Math.round(amountNum * 0.1 * 100) / 100;
  const netReceivable = Math.max(0, amountNum - chargeAmount);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentUser) {
      onRequireLogin();
      return;
    }

    if (!walletId.trim() || walletId.trim().length < 8) {
      setErrorMsg(`Please enter a valid ${selectedWallet} ID / mobile number.`);
      return;
    }

    if (amountNum < 25) {
      setErrorMsg('Minimum withdrawal amount is 25 points.');
      return;
    }

    if (amountNum > winningBalance) {
      setErrorMsg(`Insufficient winning points. You have ${winningBalance.toFixed(0)} Winning Points.`);
      return;
    }

    onSubmitWithdrawal(selectedWallet, walletId.trim(), amountNum);
    setSuccessMsg(
      `Withdrawal request of ${amountNum} points (Net Rs. ${netReceivable}) to ${selectedWallet} (${walletId.trim()}) submitted!`
    );
    setAmountStr('');
  };

  return (
    <div className="space-y-5 pb-24">
      <div>
        <h1 className="text-3xl font-extrabold text-[#0B1F33] tracking-tight">
          Withdraw
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Withdraw your winning points securely.
        </p>
      </div>

      <div className="rounded-3xl p-6 bg-gradient-to-br from-[#073752] via-[#0A4D6E] to-[#11698E] text-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="text-base font-medium text-white/95">
            Winning Balance
          </span>
        </div>

        <div className="mt-4 text-3xl font-extrabold font-mono tabular-nums tracking-tight">
          {winningBalance} Points
        </div>
        <p className="mt-2 text-xs text-white/80">
          Only winning points can be withdrawn.
        </p>
      </div>

      <form
        onSubmit={handleWithdraw}
        className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-5"
      >
        <div>
          <h2 className="text-xl font-extrabold text-[#0B1F33]">
            Withdrawal details
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Choose your wallet and enter the amount.
          </p>
        </div>

        <div className="space-y-2.5">
          <label className="block text-sm font-bold text-[#0B1F33]">
            Select wallet
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedWallet('eSewa')}
              className={`p-3.5 rounded-2xl flex items-center justify-between transition-all ${
                selectedWallet === 'eSewa'
                  ? 'bg-[#EEF6FB] border-2 border-[#084C70]'
                  : 'bg-[#F8FAFC] border border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-2xs">
                  <span className="text-[#41A124] font-bold text-xl leading-none font-serif">
                    e-
                  </span>
                </div>
                <span className="text-sm font-bold text-[#0B1F33]">eSewa</span>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  selectedWallet === 'eSewa'
                    ? 'bg-[#084C70] text-white'
                    : 'border border-slate-300 bg-white'
                }`}
              >
                {selectedWallet === 'eSewa' && <Check className="w-3 h-3" />}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedWallet('Khalti')}
              className={`p-3.5 rounded-2xl flex items-center justify-between transition-all ${
                selectedWallet === 'Khalti'
                  ? 'bg-[#EEF6FB] border-2 border-[#084C70]'
                  : 'bg-[#F8FAFC] border border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-2xs">
                  <span className="px-1.5 py-0.5 rounded bg-[#5C2D91] text-white font-extrabold text-xs">
                    K
                  </span>
                </div>
                <span className="text-sm font-bold text-[#0B1F33]">Khalti</span>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  selectedWallet === 'Khalti'
                    ? 'bg-[#084C70] text-white'
                    : 'border border-slate-300 bg-white'
                }`}
              >
                {selectedWallet === 'Khalti' && <Check className="w-3 h-3" />}
              </div>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#0B1F33]">
            {selectedWallet} ID
          </label>
          <div className="flex items-center h-13 px-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 focus-within:border-[#084C70] focus-within:bg-white transition-all">
            <Phone className="w-4 h-4 text-[#084C70] mr-3 shrink-0" />
            <input
              type="tel"
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              placeholder={`Enter your ${selectedWallet} ID`}
              className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-500 focus:outline-none font-mono tabular-nums"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-[#0B1F33]">
              Withdrawal amount
            </label>
            {amountNum >= 25 && (
              <span className="text-xs font-mono font-semibold text-emerald-700 tabular-nums">
                You receive: Rs. {netReceivable.toFixed(1)}
              </span>
            )}
          </div>
          <div className="flex items-center h-13 px-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 focus-within:border-[#084C70] focus-within:bg-white transition-all">
            <Banknote className="w-4 h-4 text-[#084C70] mr-3 shrink-0" />
            <input
              type="number"
              min="25"
              step="1"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              placeholder="Minimum 25 points"
              className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-500 focus:outline-none font-mono tabular-nums"
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FEF8E8] border border-[#F5DFA0] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-white border border-[#F3D27A] flex items-center justify-center text-[#9A5B00] shrink-0">
            <Percent className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-[#5C3700]">
              Withdrawal charge
            </div>
            <div className="text-xs text-[#785118] mt-0.5">
              Withdraw ma 10% charge lagne chha.
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#F3F7FB] flex items-start gap-3">
          <Info className="w-4 h-4 text-[#084C70] shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 leading-relaxed">
            राति 12 baje भित्रमा तपाईंको {selectedWallet} मा पैसा लोड हुनेछ।
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full h-13 rounded-2xl bg-[#0B233D] hover:bg-[#133256] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-xs transition-all active:scale-[0.99]"
        >
          <Send className="w-4 h-4" />
          <span>Submit Withdrawal Request</span>
        </button>
      </form>

      {userWithdrawals.length > 0 && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 space-y-3">
          <h3 className="text-sm font-bold text-[#0B1F33]">
            Recent Withdrawal Requests
          </h3>
          <div className="divide-y divide-slate-100">
            {userWithdrawals.map((wd) => (
              <div
                key={wd.id}
                className="py-3 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">
                    {wd.provider} · {wd.walletAccountId}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Gross: {wd.amount} Pts · Fee: {wd.fee} Pts · Net: Rs. {wd.netAmount}
                  </div>
                </div>
                <span
                  className={`font-bold uppercase text-[11px] ${
                    wd.status === 'completed'
                      ? 'text-emerald-600'
                      : wd.status === 'pending'
                      ? 'text-amber-600'
                      : 'text-red-600'
                  }`}
                >
                  {wd.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
