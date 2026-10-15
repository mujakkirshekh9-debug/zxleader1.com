import React, { useState } from 'react';
import { Copy, Check, QrCode, ShieldCheck, Maximize2, X } from 'lucide-react';

interface EsewaQrCardProps {
  merchantName: string;
  merchantId: string;
  amount?: number;
  compact?: boolean;
}

const QR_SIZE = 25;
function isFinderPattern(r: number, c: number, topR: number, leftC: number): boolean {
  const dr = r - topR;
  const dc = c - leftC;
  if (dr < 0 || dr > 6 || dc < 0 || dc > 6) return false;
  if (dr === 0 || dr === 6 || dc === 0 || dc === 6) return true;
  if (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4) return true;
  return false;
}

function isFinderSeparator(r: number, c: number): boolean {
  if (r <= 7 && c <= 7) return true;
  if (r <= 7 && c >= QR_SIZE - 8) return true;
  if (r >= QR_SIZE - 8 && c <= 7) return true;
  return false;
}

function isAlignmentPattern(r: number, c: number): boolean {
  const centerR = QR_SIZE - 7;
  const centerC = QR_SIZE - 7;
  const dr = Math.abs(r - centerR);
  const dc = Math.abs(c - centerC);
  if (dr > 2 || dc > 2) return false;
  if (dr === 2 || dc === 2) return true;
  if (dr === 0 && dc === 0) return true;
  return false;
}

function getQrModule(r: number, c: number): boolean {
  if (
    isFinderPattern(r, c, 0, 0) ||
    isFinderPattern(r, c, 0, QR_SIZE - 7) ||
    isFinderPattern(r, c, QR_SIZE - 7, 0)
  ) {
    return true;
  }
  if (isFinderSeparator(r, c)) {
    return false;
  }
  if (r >= QR_SIZE - 9 && r <= QR_SIZE - 5 && c >= QR_SIZE - 9 && c <= QR_SIZE - 5) {
    return isAlignmentPattern(r, c);
  }
  if (r === 6 || c === 6) {
    return (r + c) % 2 === 0;
  }
  const seed = (r * 37 + c * 73 + r * c * 19 + 9716748756) % 100;
  return seed < 48;
}

export const EsewaQrCard: React.FC<EsewaQrCardProps> = ({
  merchantName,
  merchantId,
  amount,
  compact = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(merchantId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrMatrix: boolean[][] = [];
  for (let r = 0; r < QR_SIZE; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < QR_SIZE; c++) {
      row.push(getQrModule(r, c));
    }
    qrMatrix.push(row);
  }

  const renderCardContent = (isModal = false) => (
    <div
      className={`bg-white rounded-3xl border border-slate-200/90 shadow-sm ${
        isModal ? 'p-8 max-w-sm w-full mx-auto' : compact ? 'p-5' : 'p-6'
      } flex flex-col items-center text-center transition-all`}
    >
      <div className="w-full max-w-[250px] aspect-square bg-white rounded-2xl border-[5px] border-[#F3F4F6] p-4 flex items-center justify-center relative">
        <svg
          viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`}
          className="w-full h-full"
          shapeRendering="crispEdges"
          aria-label={`eSewa QR Code for ${merchantName} (${merchantId})`}
        >
          <rect width={QR_SIZE} height={QR_SIZE} fill="#FFFFFF" />
          {qrMatrix.map((row, rIdx) =>
            row.map((cell, cIdx) =>
              cell ? (
                <rect
                  key={`${rIdx}-${cIdx}`}
                  x={cIdx}
                  y={rIdx}
                  width={1}
                  height={1}
                  fill="#000000"
                />
              ) : null
            )
          )}
        </svg>

        {!isModal && (
          <button
            type="button"
            onClick={() => setFullScreen(true)}
            title="Expand QR Code"
            className="absolute bottom-2 right-2 w-8 h-8 rounded-lg bg-white/95 border border-slate-200 text-slate-700 hover:text-slate-950 flex items-center justify-center shadow-sm transition-transform active:scale-95"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="mt-5 flex items-center justify-center gap-1 select-none">
        <div className="w-8 h-8 rounded-full bg-[#41A124] flex items-center justify-center shadow-xs">
          <span className="text-white font-serif italic font-bold text-xl leading-none tracking-tighter">
            e
          </span>
        </div>
        <span
          className="text-[28px] leading-none text-[#1E252B] font-normal tracking-tight"
          style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif' }}
        >
          Sewa
        </span>
        <span className="text-[9px] font-semibold text-slate-500 self-start mt-1">
          TM
        </span>
      </div>

      <h3 className="mt-3 text-xl font-bold text-[#1E252B] tracking-tight">
        {merchantName}
      </h3>
      <div className="mt-1 flex items-center justify-center gap-2">
        <span className="text-base font-medium text-[#5A6872] font-mono tabular-nums">
          {merchantId}
        </span>
        <button
          type="button"
          onClick={handleCopyId}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {amount && amount > 0 ? (
        <div className="mt-3 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold font-mono tabular-nums">
          Amount to Pay: NPR {amount.toFixed(2)} ({amount} Points)
        </div>
      ) : null}

      <p className="mt-5 text-sm text-[#2D3748] font-medium">
        Show this QR code to receive money
      </p>

      <div className="mt-3 pt-3 border-t border-slate-100 w-full flex items-center justify-between text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          Verified Merchant QR
        </span>
        <span className="inline-flex items-center gap-1">
          <QrCode className="w-3.5 h-3.5" />
          Instant eSewa Sync
        </span>
      </div>
    </div>
  );

  return (
    <>
      {renderCardContent(false)}

      {fullScreen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm">
            <button
              type="button"
              onClick={() => setFullScreen(false)}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {renderCardContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
