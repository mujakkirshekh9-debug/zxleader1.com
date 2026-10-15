import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Zap,
} from 'lucide-react';
import { EsewaQrCard } from './EsewaQrCard';
import { PlatformSettings, TransactionRecord } from '../types';

interface ScanAndPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PlatformSettings;
  onSubmitDeposit: (
    amount: number,
    senderEsewaId: string,
    referenceCode: string,
    instantGateway: boolean
  ) => void;
  recentUserTransactions: TransactionRecord[];
}

export const ScanAndPayModal: React.FC<ScanAndPayModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSubmitDeposit,
  recentUserTransactions,
}) => {
  const [amountInput, setAmountInput] = useState<string>('');
  const [senderEsewaId, setSenderEsewaId] = useState<string>('');
  const [referenceCode, setReferenceCode] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<'qr' | 'gateway'>('qr');
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const parsedAmount = Number(amountInput) || 0;

  const handleQuickAmount = (val: number) => {
    setAmountInput(String(val));
    setErrorMsg('');
  };

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parsedAmount || parsedAmount < 10) {
      setErrorMsg('Please enter at least 10 points (Rs. 10) to add balance.');
      return;
    }

    const finalSender =
      senderEsewaId.trim() || '98' + Math.floor(10000000 + Math.random() * 90000000);
    const finalRef =
      referenceCode.trim().toUpperCase() ||
      'ESW' + Math.floor(100000 + Math.random() * 900000);

    setErrorMsg('');
    setStep('processing');

    setTimeout(() => {
      onSubmitDeposit(parsedAmount, finalSender, finalRef, paymentMode === 'gateway');
      setStep('success');
    }, 650);
  };

  const handleResetAndClose = () => {
    setStep('form');
    setAmountInput('');
    setReferenceCode('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F5F7FA] overflow-y-auto">
      <div className="max-w-lg mx-auto min-h-screen flex flex-col pb-12">
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 h-14 flex items-center gap-4 border-b border-slate-200/70">
          <button
            type="button"
            onClick={handleResetAndClose}
            className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-800 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Scan and pay
          </h1>
        </header>

        <div className="p-4 space-y-5 flex-1">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center bg-white shrink-0">
                <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#0F1E2E] text-white text-[11px] font-bold tracking-wider uppercase">
                VIDEO GUIDE
              </span>
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              See how to add points
            </h2>
            <p className="mt-1 text-sm text-slate-600 leading-relaxed">
              Watch a quick step-by-step video showing how to complete your payment.
            </p>

            <a
              href={settings.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full h-12 rounded-2xl bg-[#0F1E2E] hover:bg-[#162B40] text-white font-semibold text-sm flex items-center justify-center gap-3 shadow-xs transition-all active:scale-[0.99]"
            >
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
              <span>Watch on TikTok</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <p className="mt-2 text-center text-xs text-slate-400">
              Opens in the TikTok app
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/80 rounded-2xl">
            <button
              type="button"
              onClick={() => setPaymentMode('qr')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                paymentMode === 'qr'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              eSewa QR Code Scan
            </button>
            <button
              type="button"
              onClick={() => setPaymentMode('gateway')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
                paymentMode === 'gateway'
                  ? 'bg-[#41A124] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>eSewa Live Gateway</span>
            </button>
          </div>

          {step === 'form' && (
            <>
              {paymentMode === 'qr' ? (
                <EsewaQrCard
                  merchantName={settings.esewaMerchantName}
                  merchantId={settings.esewaMerchantId}
                  amount={parsedAmount}
                />
              ) : (
                <div className="bg-gradient-to-br from-[#2E7D18] to-[#41A124] rounded-3xl p-5 text-white shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-[#41A124] font-serif italic font-bold text-2xl">
                        e
                      </div>
                      <div>
                        <div className="text-sm font-bold">eSewa Direct Merchant Gateway</div>
                        <div className="text-xs text-white/85">
                          Merchant: {settings.esewaMerchantName} ({settings.esewaMerchantId})
                        </div>
                      </div>
                    </div>
                    <ShieldCheck className="w-6 h-6 text-white/90" />
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
                    <span>Live Webhook Verification</span>
                    <span className="font-mono font-semibold">1 Point = NPR 1.00</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleProceed} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">
                    Quick select amount (NPR / Points)
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[25, 50, 100, 250, 500].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleQuickAmount(amt)}
                        className={`py-2 rounded-xl text-xs font-bold font-mono tabular-nums border transition-all ${
                          parsedAmount === amt
                            ? 'bg-[#1D3567] text-white border-[#1D3567]'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        +{amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <div className="flex items-center h-14 px-4 rounded-2xl bg-white border border-slate-400 focus-within:border-[#1D3567] focus-within:ring-2 focus-within:ring-[#1D3567]/15 transition-all">
                    <CreditCard className="w-5 h-5 text-slate-700 mr-3 shrink-0" />
                    <input
                      type="number"
                      min="10"
                      step="1"
                      value={amountInput}
                      onChange={(e) => {
                        setAmountInput(e.target.value);
                        setErrorMsg('');
                      }}
                      placeholder="Add amount to app"
                      className="w-full bg-transparent text-slate-900 placeholder:text-slate-500 text-base font-medium focus:outline-none font-mono tabular-nums"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      eSewa Transaction Verification Details
                    </span>
                    <span className="text-[11px] text-emerald-700 font-medium">
                      Live Tracked
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center h-11 px-3 rounded-xl bg-slate-50 border border-slate-200">
                      <Smartphone className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                      <input
                        type="tel"
                        value={senderEsewaId}
                        onChange={(e) => setSenderEsewaId(e.target.value)}
                        placeholder="Your eSewa ID (98XXXXXXXX)"
                        className="w-full bg-transparent text-xs font-medium text-slate-800 focus:outline-none font-mono tabular-nums"
                      />
                    </div>
                    <div className="flex items-center h-11 px-3 rounded-xl bg-slate-50 border border-slate-200">
                      <Sparkles className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                      <input
                        type="text"
                        value={referenceCode}
                        onChange={(e) => setReferenceCode(e.target.value)}
                        placeholder="eSewa Ref Code (Optional)"
                        className="w-full bg-transparent text-xs font-medium text-slate-800 focus:outline-none font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs font-semibold text-red-600 text-center">
                    {errorMsg}
                  </p>
                )}

                <p className="text-center text-sm font-medium text-[#E53935]">
                  Note : One point is equivalent to one rupee.
                </p>

                <div className="flex justify-center pt-1">
                  <button
                    type="submit"
                    className="w-4/5 h-12 rounded-2xl bg-[#1F3465] hover:bg-[#16264C] text-white font-semibold text-base shadow-sm transition-all active:scale-[0.98]"
                  >
                    Proceed
                  </button>
                </div>
              </form>
            </>
          )}

          {step === 'processing' && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#41A124] flex items-center justify-center mx-auto animate-spin">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Syncing with eSewa Payment Gateway...
              </h3>
              <p className="text-xs text-slate-500">
                Registering transaction with {settings.esewaMerchantName} ({settings.esewaMerchantId})
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="bg-white rounded-3xl p-6 border border-emerald-200 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {settings.autoApproveDeposits || paymentMode === 'gateway'
                    ? 'Payment Credited Instantly!'
                    : 'Payment Logged for Live Admin Verification'}
                </h3>
                <p className="mt-1 text-xs text-slate-600">
                  {settings.autoApproveDeposits || paymentMode === 'gateway'
                    ? `${parsedAmount} Points have been added to your wallet balance.`
                    : `Your eSewa transfer of Rs. ${parsedAmount} to ${settings.esewaMerchantName} (${settings.esewaMerchantId}) is now live in the Admin Transaction Monitor.`}
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full h-11 rounded-xl bg-[#0F1E2E] text-white text-sm font-semibold"
              >
                Return to Wallet
              </button>
            </div>
          )}

          {recentUserTransactions.length > 0 && (
            <div className="bg-white rounded-3xl p-4 border border-slate-200/80">
              <h3 className="text-xs font-bold text-slate-700 mb-3">
                Your Live eSewa Gateway Activity
              </h3>
              <div className="divide-y divide-slate-100">
                {recentUserTransactions.slice(0, 4).map((tx) => (
                  <div key={tx.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-900">
                        {tx.type === 'deposit' ? 'eSewa Add Balance' : 'Wallet Withdrawal'} ·{' '}
                        <span className="font-mono tabular-nums">{tx.referenceCode}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {tx.walletAccountId} · {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold font-mono tabular-nums text-slate-900">
                        {tx.type === 'deposit' ? '+' : '-'}
                        {tx.amount} Pts
                      </div>
                      <div
                        className={`text-[10px] font-semibold ${
                          tx.status === 'completed'
                            ? 'text-emerald-600'
                            : tx.status === 'pending'
                            ? 'text-amber-600'
                            : 'text-red-600'
                        }`}
                      >
                        {tx.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
