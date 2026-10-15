import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  ShieldCheck,
  ChevronDown,
  Gamepad2,
} from 'lucide-react';
import { UserAccount } from '../types';
import { ZxLogo } from './ZxLogo';

interface AuthScreenProps {
  onLoginSuccess: (user: UserAccount) => void;
  onSkipToGuest: () => void;
  users: UserAccount[];
  onRegisterUser: (newUser: UserAccount) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  onSkipToGuest,
  users,
  onRegisterUser,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign up specific fields
  const [name, setName] = useState('');
  const [ffIgn, setFfIgn] = useState('');
  const [ffUid, setFfUid] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (authMode === 'login') {
      const identifier = loginMethod === 'email' ? email.trim() : phone.trim();

      if (!identifier) {
        setErrorMsg(`Please enter your ${loginMethod === 'email' ? 'email' : 'phone number'}.`);
        return;
      }
      if (!password) {
        setErrorMsg('Please enter your password.');
        return;
      }

      // Check Admin credentials securely: salmankhan.2k@gmail.com / salmankhan1414k
      if (
        (identifier.toLowerCase() === 'salmankhan.2k@gmail.com' || identifier === '9841200000') &&
        password === 'salmankhan1414k'
      ) {
        let adminUser = users.find((u) => u.email.toLowerCase() === 'salmankhan.2k@gmail.com');
        if (!adminUser) {
          adminUser = {
            id: 'usr-admin-1',
            name: 'Salman (Admin)',
            email: 'salmankhan.2k@gmail.com',
            phone: '9841200000',
            password: 'salmankhan1414k',
            avatar: 'SK',
            role: 'admin',
            ffIgn: '▄︻デ══━一:ZXx',
            ffUid: '10952780064',
            walletBalance: 850,
            winningBalance: 520,
            freePoints: 12,
            lastDailyClaimDate: null,
            status: 'active',
            isVerifiedGoogle: true,
            joinedAt: new Date().toISOString(),
            matchesPlayed: 45,
            matchesWon: 32,
            isBot: false,
          };
          onRegisterUser(adminUser);
        }
        onLoginSuccess(adminUser);
        return;
      }

      // Check regular user login with stored credentials
      const matched = users.find((u) => {
        if (loginMethod === 'email') {
          return (
            u.email.toLowerCase() === identifier.toLowerCase() ||
            (u.phone && u.phone === identifier)
          );
        }
        return (
          u.phone === identifier ||
          u.email.toLowerCase() === identifier.toLowerCase()
        );
      });

      if (!matched) {
        setErrorMsg('Account not found. If you are a first time user, please click "Signup Now" below.');
        return;
      }

      if (matched.password && matched.password !== password) {
        setErrorMsg('Incorrect password. Please try again.');
        return;
      }

      if (matched.status === 'suspended') {
        setErrorMsg('Your account has been suspended by Admin.');
        return;
      }

      onLoginSuccess(matched);
    } else {
      // Sign up flow for first time users
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      const identifier = loginMethod === 'email' ? email.trim() : phone.trim();
      if (!identifier) {
        setErrorMsg(`Please enter your ${loginMethod === 'email' ? 'email' : 'phone number'}.`);
        return;
      }
      if (!ffIgn.trim() || !ffUid.trim()) {
        setErrorMsg('Free Fire IGN and numeric UID are required to participate in matches.');
        return;
      }
      if (!password || password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }

      // Check if user already exists
      const existing = users.find(
        (u) =>
          u.email.toLowerCase() === (loginMethod === 'email' ? identifier.toLowerCase() : '') ||
          u.phone === (loginMethod === 'phone' ? identifier : '')
      );
      if (existing) {
        setErrorMsg('An account with this email or phone already exists. Please log in.');
        return;
      }

      // Check if registering admin account
      const isAdminEmail =
        identifier.toLowerCase() === 'salmankhan.2k@gmail.com' &&
        password === 'salmankhan1414k';

      const newUser: UserAccount = {
        id: 'usr-' + Date.now(),
        name: name.trim(),
        email:
          loginMethod === 'email'
            ? identifier.toLowerCase()
            : `${identifier.replace(/\D/g, '')}@tournaop.com`,
        phone: loginMethod === 'phone' ? identifier : undefined,
        password,
        avatar: name.trim().slice(0, 2).toUpperCase() || 'OP',
        role: isAdminEmail ? 'admin' : 'player',
        ffIgn: ffIgn.trim(),
        ffUid: ffUid.trim(),
        walletBalance: 0,
        winningBalance: 0,
        freePoints: 4,
        lastDailyClaimDate: null,
        status: 'active',
        isVerifiedGoogle: true,
        joinedAt: new Date().toISOString(),
        matchesPlayed: 0,
        matchesWon: 0,
        isBot: false,
      };

      onRegisterUser(newUser);
      onLoginSuccess(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0F1E2E] flex flex-col justify-between max-w-md mx-auto px-6 py-6 font-sans">
      {/* Top Header with Skip Button matching Screenshot_20261015-101750.png */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ZxLogo size="xs" showGlow={false} />
          <span className="text-xs font-black tracking-wider text-[#0F2942]">ZX__ESPORTS</span>
        </div>
        <button
          type="button"
          onClick={onSkipToGuest}
          className="text-sm font-bold text-[#E53935] hover:text-red-700 transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Main Form Content */}
      <div className="my-auto py-6 space-y-6">
        {/* Title & Logo: Welcome to ZX__ESPORTS */}
        <div className="text-center flex flex-col items-center">
          <ZxLogo size="xl" className="mb-3" />
          <h1 className="text-2xl font-black tracking-wider text-[#0A253B]">
            Welcome to <span className="text-[#0891B2]">ZX__ESPORTS</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            {authMode === 'login'
              ? 'Enter your credentials to access matches and wallet'
              : 'Create your account to start playing Free Fire skill contests'}
          </p>
        </div>

        {/* Input Form matching Screenshot */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sign Up extra fields for first-time user registration */}
          {authMode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Your Full Name"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F4C81] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Free Fire IGN
                  </label>
                  <div className="flex items-center h-12 px-3 rounded-xl border border-slate-200 focus-within:border-[#0F4C81]">
                    <Gamepad2 className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      value={ffIgn}
                      onChange={(e) => setFfIgn(e.target.value)}
                      placeholder="e.g. ▄︻デ══━一"
                      className="w-full bg-transparent text-xs font-medium focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Free Fire UID
                  </label>
                  <input
                    type="text"
                    value={ffUid}
                    onChange={(e) => setFfUid(e.target.value)}
                    placeholder="10952780064"
                    className="w-full h-12 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F4C81] text-xs font-mono tabular-nums"
                  />
                </div>
              </div>
            </>
          )}

          {/* Identifier Toggle: Phone vs Email matching Screenshot */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-[#1D2D50]">
                {loginMethod === 'phone' ? 'Phone' : 'Email'}
              </label>
              <button
                type="button"
                onClick={() => {
                  setLoginMethod(loginMethod === 'phone' ? 'email' : 'phone');
                  setErrorMsg('');
                }}
                className="text-xs font-bold text-[#E53935] hover:underline"
              >
                {loginMethod === 'phone' ? 'Login with Email' : 'Login with Phone'}
              </button>
            </div>

            {loginMethod === 'phone' ? (
              /* Nepal Phone input matching Screenshot */
              <div className="flex items-center h-13 px-3 rounded-xl border border-slate-200 focus-within:border-[#0F4C81] focus-within:ring-1 focus-within:ring-[#0F4C81] bg-white transition-all">
                <div className="flex items-center gap-1.5 pr-2 mr-2 border-r border-slate-200 text-sm font-semibold text-slate-700 shrink-0">
                  <span className="text-base select-none">🇳🇵</span>
                  <span>+977</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter Your Phone"
                  className="w-full bg-transparent text-sm placeholder:text-slate-400 focus:outline-none font-mono tabular-nums"
                />
              </div>
            ) : (
              /* Email input */
              <div className="flex items-center h-13 px-4 rounded-xl border border-slate-200 focus-within:border-[#0F4C81] focus-within:ring-1 focus-within:ring-[#0F4C81] bg-white transition-all">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email or Username"
                  className="w-full bg-transparent text-sm placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Password Input matching Screenshot */}
          <div>
            <label className="block text-sm font-semibold text-[#1D2D50] mb-1.5">
              Password
            </label>
            <div className="flex items-center h-13 px-4 rounded-xl border border-slate-200 focus-within:border-[#0F4C81] focus-within:ring-1 focus-within:ring-[#0F4C81] bg-white transition-all">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full bg-transparent text-sm placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none ml-2"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password matching Screenshot */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#0F4C81] focus:ring-0 border-slate-300"
              />
              <span>Remember Me</span>
            </label>
            <button
              type="button"
              onClick={() => setErrorMsg('For security, please contact official support to reset credentials.')}
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              Forgot Password ?
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
              {errorMsg}
            </div>
          )}

          {infoMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
              {infoMsg}
            </div>
          )}

          {/* Switch Mode: Don't have an Account ? Signup Now matching Screenshot */}
          <div className="text-center text-xs text-slate-600 pt-3">
            {authMode === 'login' ? (
              <>
                Don't have an Account ?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMsg('');
                    setInfoMsg('');
                  }}
                  className="font-bold text-[#E53935] hover:underline ml-1"
                >
                  Signup Now
                </button>
              </>
            ) : (
              <>
                Already have an Account ?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMsg('');
                    setInfoMsg('');
                  }}
                  className="font-bold text-[#0F4C81] hover:underline ml-1"
                >
                  Login Now
                </button>
              </>
            )}
          </div>

          {/* Big Blue Button matching Screenshot */}
          <button
            type="submit"
            className="w-full h-13 rounded-xl bg-[#0052CC] hover:bg-[#0047B3] text-white font-bold text-base shadow-sm transition-all active:scale-[0.99] mt-2"
          >
            {authMode === 'login' ? 'Login' : 'Complete Signup'}
          </button>
        </form>
      </div>

      {/* Footer Security Badge */}
      <div className="text-center text-[11px] text-slate-400 py-2 border-t border-slate-100 flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
        <span className="font-semibold text-slate-600">ZX__ESPORTS Tournament Security · Zero Bot Policy</span>
      </div>
    </div>
  );
};
