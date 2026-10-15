import React, { useState } from 'react';
import {
  ArrowLeft,
  Flame,
  Trophy,
  Check,
  Gift,
  ListChecks,
  ArrowRight,
  Gamepad2,
  X,
} from 'lucide-react';
import {
  Contest,
  EntryType,
  RoomType,
  TeamType,
  UserAccount,
  WinCondition,
} from '../types';
import { FAIR_PLAY_RULES } from '../data/initialData';

interface CreateContestModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onRequireLogin: () => void;
  onCreateContest: (contestData: Omit<Contest, 'id' | 'createdAt' | 'status' | 'participants'>) => void;
}

const ROOM_TYPES: RoomType[] = [
  'Rush Hour',
  'Battle Cage',
  'Clash Squad',
  'Lone Wolf',
  'Team Deathmatch',
];

export const CreateContestModal: React.FC<CreateContestModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onRequireLogin,
  onCreateContest,
}) => {
  const [roomType, setRoomType] = useState<RoomType>('Lone Wolf');
  const [winCondition, setWinCondition] = useState<WinCondition>('Match Winner');
  const [teamType, setTeamType] = useState<TeamType>('1v1');
  const [throwableLimit, setThrowableLimit] = useState<'Yes' | 'No'>('Yes');
  const [characterSkill, setCharacterSkill] = useState<'Yes' | 'No'>('No');
  const [headshotMode, setHeadshotMode] = useState<'Yes' | 'No'>('No');
  const [gameplay, setGameplay] = useState<'Competitive' | 'Default'>('Competitive');
  const [rounds, setRounds] = useState<9 | 13>(9);
  const [maxContestants, setMaxContestants] = useState<number>(2);
  const [entryType, setEntryType] = useState<EntryType>('Free points');
  const [walletFee, setWalletFee] = useState<number>(50);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const availableFreePoints = currentUser?.freePoints ?? 0;
  const availableWallet = currentUser?.walletBalance ?? 0;

  const handleSubmit = () => {
    setError('');
    if (!currentUser) {
      onRequireLogin();
      return;
    }

    const fee = entryType === 'Free points' ? 4 : walletFee;

    if (entryType === 'Free points' && availableFreePoints < 4) {
      setError('No free points are currently available. Claim them from the Free Fire home screen first or switch to Wallet.');
      return;
    }

    if (entryType === 'Wallet' && availableWallet < walletFee) {
      setError(`Insufficient wallet balance (${availableWallet.toFixed(2)} Points). Please add balance via eSewa QR first.`);
      return;
    }

    const totalPool = fee * maxContestants;
    const prizePool = entryType === 'Free points' ? 7 : Math.round(totalPool * 0.9);

    onCreateContest({
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      creatorIgn: currentUser.ffIgn,
      creatorUid: currentUser.ffUid,
      roomType,
      winCondition,
      teamType,
      throwableLimit,
      characterSkill,
      headshotMode,
      gameplay,
      rounds,
      maxContestants,
      entryType,
      entryFee: fee,
      prizePool,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F4F7FA] overflow-y-auto">
      <div className="max-w-lg mx-auto min-h-screen flex flex-col pb-10">
        <header className="sticky top-0 z-30 bg-[#F4F7FA]/95 backdrop-blur-md px-4 h-14 flex items-center gap-3 border-b border-slate-200/60">
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-slate-200/70 flex items-center justify-center text-slate-800 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-extrabold text-[#0F1E2E] tracking-tight">
            Create Free Fire Contest
          </h1>
        </header>

        <div className="p-4 space-y-6 flex-1">
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#0F1E2E]">Room Type</h2>
            <div className="flex flex-wrap gap-2.5">
              {ROOM_TYPES.map((rt) => {
                const active = roomType === rt;
                return (
                  <button
                    key={rt}
                    type="button"
                    onClick={() => setRoomType(rt)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                      active
                        ? 'bg-[#084C70] text-white shadow-xs'
                        : 'bg-white text-[#1E293B] border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {rt}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-3">
            <div>
              <h2 className="text-base font-bold text-[#0F1E2E]">Who wins</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose how the winner of this contest will be decided.
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setWinCondition('Highest kills')}
                className={`w-full text-left p-4 rounded-3xl transition-all flex items-start gap-3.5 ${
                  winCondition === 'Highest kills'
                    ? 'bg-[#EAF3F8] border-2 border-[#084C70]'
                    : 'bg-white border border-slate-200/90'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    winCondition === 'Highest kills'
                      ? 'bg-[#084C70] text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <Flame className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[#0F1E2E]">
                    Highest kills
                  </div>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Match जितेपनि हारेपनि जसले धेरै kills गर्छ त्यो player winner हुन्छ तर full match खेल्न पर्छ, full match नखेली सुरुमा kills high हुदा fight avoid गरेमा win prize आउदैन।
                  </p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    winCondition === 'Highest kills'
                      ? 'bg-[#084C70] text-white'
                      : 'border-2 border-slate-400'
                  }`}
                >
                  {winCondition === 'Highest kills' && <Check className="w-3.5 h-3.5" />}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setWinCondition('Match Winner')}
                className={`w-full text-left p-4 rounded-3xl transition-all flex items-center gap-3.5 ${
                  winCondition === 'Match Winner'
                    ? 'bg-[#EAF3F8] border-2 border-[#084C70]'
                    : 'bg-white border border-slate-200/90'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                    winCondition === 'Match Winner'
                      ? 'bg-[#084C70] text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[#0F1E2E]">
                    Match Winner
                  </div>
                  <p className="mt-0.5 text-xs text-slate-600">
                    Match जित्ने player winner हुन्छ।
                  </p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    winCondition === 'Match Winner'
                      ? 'bg-[#084C70] text-white'
                      : 'border-2 border-slate-400'
                  }`}
                >
                  {winCondition === 'Match Winner' && <Check className="w-3.5 h-3.5" />}
                </div>
              </button>
            </div>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-bold text-[#0F1E2E]">Team Type</h2>
            <div className="flex gap-2.5">
              {(['1v1', '2v2'] as TeamType[]).map((tt) => (
                <button
                  key={tt}
                  type="button"
                  onClick={() => setTeamType(tt)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    teamType === tt
                      ? 'bg-[#084C70] text-white'
                      : 'bg-white text-slate-800 border border-slate-200'
                  }`}
                >
                  {tt}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-bold text-[#0F1E2E]">Throwable Limit</h2>
            <div className="flex gap-2.5">
              {(['Yes', 'No'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setThrowableLimit(opt)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    throwableLimit === opt
                      ? 'bg-[#084C70] text-white'
                      : 'bg-white text-slate-800 border border-slate-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-bold text-[#0F1E2E]">Character Skill</h2>
            <div className="flex gap-2.5">
              {(['Yes', 'No'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setCharacterSkill(opt)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    characterSkill === opt
                      ? 'bg-[#084C70] text-white'
                      : 'bg-white text-slate-800 border border-slate-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-bold text-[#0F1E2E]">Headshot Mode</h2>
            <div className="flex gap-2.5">
              {(['Yes', 'No'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setHeadshotMode(opt)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    headshotMode === opt
                      ? 'bg-[#084C70] text-white'
                      : 'bg-white text-slate-800 border border-slate-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-bold text-[#0F1E2E]">Gameplay</h2>
            <div className="flex gap-2.5">
              {(['Competitive', 'Default'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setGameplay(opt)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    gameplay === opt
                      ? 'bg-[#084C70] text-white'
                      : 'bg-white text-slate-800 border border-slate-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-bold text-[#0F1E2E]">Rounds</h2>
            <div className="flex gap-2.5">
              {([9, 13] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRounds(r)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold font-mono tabular-nums transition-all ${
                    rounds === r
                      ? 'bg-[#084C70] text-white'
                      : 'bg-white text-slate-800 border border-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-2.5">
            <div>
              <h2 className="text-base font-bold text-[#0F1E2E]">
                Number of contestants
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                This is the total number of ZX__ESPORTS parties required, including the creator.
              </p>
            </div>
            <div className="flex gap-2.5">
              {[2].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setMaxContestants(num)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold font-mono tabular-nums transition-all ${
                    maxContestants === num
                      ? 'bg-[#084C70] text-white'
                      : 'bg-white text-slate-800 border border-slate-200'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#0F1E2E]">Entry fee</h2>
            <div className="flex gap-2.5">
              {(['Wallet', 'Free points'] as EntryType[]).map((et) => (
                <button
                  key={et}
                  type="button"
                  onClick={() => {
                    setEntryType(et);
                    setError('');
                  }}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    entryType === et
                      ? 'bg-[#084C70] text-white'
                      : 'bg-white text-slate-800 border border-slate-200'
                  }`}
                >
                  {et}
                </button>
              ))}
            </div>

            {entryType === 'Free points' ? (
              <div className="p-4 rounded-2xl bg-[#EBF3F9] flex items-start gap-3 text-xs text-[#1E3A5F]">
                <Gift className="w-4 h-4 text-[#084C70] shrink-0 mt-0.5" />
                <span>
                  {availableFreePoints >= 4
                    ? `You have ${availableFreePoints.toFixed(2)} free points available. Entry costs 4 free points (Winner gets 7 points).`
                    : 'No free points are currently available. Claim them from the Free Fire home screen first.'}
                </span>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">
                    Select Entry Points (1 Pt = Rs. 1)
                  </span>
                  <span className="font-mono font-bold text-[#084C70] tabular-nums">
                    Prize Pool: {Math.round(walletFee * maxContestants * 0.9)} Pts
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[20, 50, 100, 200, 500].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setWalletFee(amt)}
                      className={`py-2 rounded-xl text-xs font-bold font-mono tabular-nums border ${
                        walletFee === amt
                          ? 'bg-[#084C70] text-white border-[#084C70]'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          <div className="bg-white rounded-3xl p-4 border border-slate-200/90 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#084C70] text-white flex items-center justify-center shrink-0">
              <ListChecks className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-[#0F1E2E]">
                  Rules & Fair Play
                </h3>
                <span className="text-xs font-bold text-[#084C70]">
                  6 rules
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Know the important contest rules before creating your room.
              </p>
              <button
                type="button"
                onClick={() => setShowRulesModal(true)}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#084C70] hover:underline"
              >
                <span>View all rules</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full h-14 rounded-2xl bg-[#084C70] hover:bg-[#063B57] text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-sm transition-all active:scale-[0.99]"
          >
            <Gamepad2 className="w-5 h-5" />
            <span>Create contest</span>
          </button>
        </div>
      </div>

      {showRulesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                ZX__ESPORTS Fair Play Rules (6 Rules)
              </h3>
              <button
                type="button"
                onClick={() => setShowRulesModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {FAIR_PLAY_RULES.map((rule) => (
                <div
                  key={rule.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1"
                >
                  <div className="text-xs font-bold text-[#084C70]">
                    0{rule.id}. {rule.title}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {rule.nepali}
                  </p>
                  <p className="text-[11px] text-slate-500">{rule.english}</p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowRulesModal(false)}
              className="w-full h-11 rounded-xl bg-[#084C70] text-white text-xs font-bold"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
