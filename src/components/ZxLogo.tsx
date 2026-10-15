import React, { useState } from 'react';
import zxLogoImg from '../assets/images/zx_esports_logo_1792041894048.jpg';

interface ZxLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showGlow?: boolean;
}

const SIZE_MAP = {
  xs: 'w-8 h-8 rounded-xl',
  sm: 'w-10 h-10 rounded-2xl',
  md: 'w-12 h-12 rounded-2xl',
  lg: 'w-14 h-14 rounded-2xl',
  xl: 'w-20 h-20 rounded-3xl',
  hero: 'w-28 h-28 rounded-3xl',
};

export const ZxLogo: React.FC<ZxLogoProps> = ({
  className = '',
  size = 'md',
  showGlow = true,
}) => {
  const [imageError, setImageError] = useState(false);
  const sizeClasses = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <div
      className={`relative select-none shrink-0 overflow-hidden ${sizeClasses} ${
        showGlow ? 'shadow-[0_0_18px_rgba(6,182,212,0.45)]' : 'shadow-xs'
      } border-2 border-[#06B6D4]/50 bg-gradient-to-b from-white to-[#082032] flex items-center justify-center ${className}`}
    >
      {!imageError ? (
        <img
          src={zxLogoImg}
          alt="ZX__ESPORTS Logo"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover object-center scale-105"
        />
      ) : (
        /* Styled SVG fallback matching the anime ninja warrior with silver hair, mask & cyan glow */
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full bg-[#0A1624]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="cyanAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#0891B2" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0A1624" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="silverHair" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
          </defs>

          {/* Cyan Aura Background */}
          <circle cx="50" cy="50" r="46" fill="url(#cyanAura)" />

          {/* Black Vortex Ink Swirls */}
          <path
            d="M10,65 Q25,85 50,88 Q80,85 92,62 Q98,45 88,32 Q78,20 62,15 Q30,10 18,35 Q10,50 20,62 Q35,80 65,78"
            stroke="#020617"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M85,45 Q70,75 45,75 Q20,75 15,55"
            stroke="#22D3EE"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Armor Collar */}
          <path
            d="M30,72 L50,86 L70,72 L64,62 L36,62 Z"
            fill="#1E293B"
            stroke="#334155"
            strokeWidth="1.5"
          />
          {/* Glowing Cyan Chest Bars */}
          <rect x="44" y="66" width="3.5" height="11" rx="1.5" fill="#22D3EE" filter="drop-shadow(0 0 4px #22D3EE)" />
          <rect x="52.5" y="66" width="3.5" height="11" rx="1.5" fill="#22D3EE" filter="drop-shadow(0 0 4px #22D3EE)" />

          {/* Face Base */}
          <polygon points="35,42 65,42 58,64 42,64" fill="#E2E8F0" />

          {/* Black Ninja Mask */}
          <polygon points="34,48 66,48 57,66 43,66" fill="#0F172A" stroke="#1E293B" strokeWidth="1" />

          {/* Glowing White Eyes */}
          <polygon points="38,44 46,45 44,42" fill="#FFFFFF" filter="drop-shadow(0 0 3px #FFFFFF)" />
          <polygon points="62,44 54,45 56,42" fill="#FFFFFF" filter="drop-shadow(0 0 3px #FFFFFF)" />

          {/* Silver Spiky Hair */}
          <polygon points="50,14 43,30 35,22 36,36 28,32 32,44 48,34 50,22" fill="url(#silverHair)" />
          <polygon points="50,14 57,30 65,22 64,36 72,32 68,44 52,34 50,22" fill="url(#silverHair)" />
          <polygon points="50,10 46,26 50,28 54,26" fill="#FFFFFF" />
        </svg>
      )}

      {/* Subtle bottom badge for ZX */}
      <div className="absolute bottom-0 inset-x-0 h-3 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center">
        <span className="text-[8px] font-black text-cyan-300 tracking-wider">ZX</span>
      </div>
    </div>
  );
};
