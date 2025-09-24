import React from 'react';

function Header({ onDemo, onRandomize }) {
  return (
    <header className="px-6 lg:px-10 pt-6 w-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 64 64" aria-hidden="true">
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            <circle cx="32" cy="32" r="28" fill="none" stroke="url(#g)" strokeWidth="2" />
            <path d="M16 40 Q32 20 48 40" fill="none" stroke="#6ee7ff" strokeWidth="2" />
            <circle cx="32" cy="28" r="3" fill="#6ee7ff" />
          </svg>
          <div>
            <h1 className="head text-xl md:text-2xl neon">ASTRONAUT FATIGUE</h1>
            <p className="text-xs text-slate-400">Powered Analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onDemo} className="btn">Demo Input</button>
          <button onClick={onRandomize} className="btn">Randomize</button>
        </div>
      </div>
      <div className="mt-4 h-2 w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(34,211,238,.5), transparent)', filter: 'drop-shadow(0 0 6px #67e8f9)' }}></div>
    </header>
  );
}

export default Header;