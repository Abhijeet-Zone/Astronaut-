import React, { useState, useEffect, useCallback } from 'react';
import neuralBg from './new.png';
import './Dashboard.css';
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"


// Reusable component for the mini charts
const MiniChart = ({ barCount = 15 }) => (
  <div className="mini-chart">
    {Array.from({ length: barCount }).map((_, i) => (
      <div
        key={i}
        className="chart-line"
        style={{
          left: `${(i * 100) / (barCount - 1)}%`,
          height: `${Math.random() * 80 + 20}%`,
          animationDelay: `${i * 0.1}s`,
        }}
      />
    ))}
  </div>
);



// Reusable component for the pulse bars
const PulseBar = ({ barCount = 25 }) => (
  <div className="pulse-bar">
    {Array.from({ length: barCount }).map((_, i) => (
      <div
        key={i}
        className="bar"
        style={{
          left: `${(i * 100) / (barCount - 1)}%`,
          animationDelay: `${i * 0.05}s`,
        }}
      />
    ))}
  </div>
);


const MorseCodeDisplay = ({ onReplay, trigger }) => {
  const sosPattern = [1, 1, 1, 0, 2, 2, 2, 0, 1, 1, 1]; // 1: dot, 2: dash, 0: space

  return (
    <>
      <div className="flex justify-center gap-2 mb-4">
        {sosPattern.map((signal, index) => {
          let className = '';
          if (signal === 1) {
            className = 'w-2 h-2 bg-cyan-400 rounded-full';
          } else if (signal === 2) {
            className = 'w-6 h-2 bg-cyan-400 rounded-full';
          } else {
            className = 'w-2 h-2 opacity-30';
          }
          return (
            <div
              key={`${trigger}-${index}`} // Use trigger to re-render and restart animation
              className={className}
              style={{ animation: `blink 0.5s ease-in-out ${index * 0.3}s` }}
            />
          );
        })}
      </div>
      <button
        onClick={onReplay}
        className="w-full py-2 text-xs font-semibold bg-cyan-500/20 border border-cyan-300/40 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 tracking-wider"
      >
        REPLAY SOS
      </button>
    </>
  );
};


function Dashboard() {
      const navigate = useNavigate();

  const [morseTrigger, setMorseTrigger] = useState(0);

  const replayMorse = useCallback(() => {
    setMorseTrigger(count => count + 1);
  }, []);

  useEffect(() => {
    const interval = setInterval(replayMorse, 8000);
    return () => clearInterval(interval);
  }, [replayMorse]);

  return (
    <>
      <video
        autoPlay
        muted
        loop
        playsInline
        id="bgVideo"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: -3,
        }}
      >
        <source src="/dash.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="animated-bg"></div>

      <header className="main-header " style={{ position: 'relative', overflow: 'hidden' }}>
        <style>{`
          .hero-wrap { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 10px; }
          .header-ribbon {
            position: absolute; inset: auto 0 0 0; height: 40px;
            background: radial-gradient(60% 100% at 50% 0%, rgba(56,189,248,.14), rgba(2,6,23,0));
            filter: blur(8px);
            pointer-events: none;
          }
          /* Aurora + stars background, scoped to header */
          .hero-aurora {
            position: absolute; inset: -20% -10% auto -10%; height: 220px; z-index: 1;
            background:
              radial-gradient(70% 140% at 20% 50%, rgba(56,189,248,.28), rgba(56,189,248,0) 60%),
              radial-gradient(70% 140% at 80% 40%, rgba(168,85,247,.26), rgba(168,85,247,0) 60%),
              conic-gradient(from 180deg at 50% 50%, rgba(59,130,246,.18), rgba(16,185,129,.14), rgba(59,130,246,.18));
            filter: blur(28px) saturate(130%);
            animation: auroraShift 18s ease-in-out infinite alternate;
          }
          .hero-stars {
            position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: .65;
            background-image:
              radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,.5) 99%, rgba(255,255,255,0) 100%),
              radial-gradient(1px 1px at 30% 80%, rgba(255,255,255,.45) 99%, rgba(255,255,255,0) 100%),
              radial-gradient(1px 1px at 60% 40%, rgba(255,255,255,.40) 99%, rgba(255,255,255,0) 100%),
              radial-gradient(1px 1px at 85% 70%, rgba(255,255,255,.35) 99%, rgba(255,255,255,0) 100%);
            background-repeat: repeat;
            background-size: 800px 200px;
            animation: starDrift 36s linear infinite;
          }
          @keyframes auroraShift { from { transform: translateY(0) translateX(0); } to { transform: translateY(10px) translateX(12px); } }
          @keyframes starDrift { from { background-position: 0 0; } to { background-position: -800px 0; } }
          .hero-title {
            background: linear-gradient(180deg, #e0f4ff 0%, #9bd7ff 45%, #6ac2ff 100%);
            -webkit-background-clip: text; background-clip: text; color: transparent;
            text-shadow: 0 2px 18px rgba(56,189,248,.25);
            letter-spacing: .3em;
          }
          .badges { display: flex; gap: 10px; }
          .badge {
            padding: 6px 10px; border-radius: 10px; font-size: 10px; font-weight: 700;
            text-transform: uppercase; letter-spacing: .08em;
            background: linear-gradient(180deg, rgba(34,211,238,.16), rgba(34,211,238,.06));
            border: 1px solid rgba(103,232,249,.25); color: #a5f3fc;
            box-shadow: inset 0 0 12px rgba(34,211,238,.06), 0 2px 8px rgba(0,0,0,.25);
          }
          .ticker { display: flex; align-items: center; gap: 12px; color: #cbd5e1; font-size: 11px; opacity: .9; }
          .tick-dot { width: 6px; height: 6px; border-radius: 999px; background: #22c55e; box-shadow: 0 0 10px #22c55e; }
          .divider { width: 1px; height: 10px; background: rgba(148,163,184,.35); }
        `}</style>
        <div className="hero-aurora"></div>
        <div className="hero-stars"></div>
        <div className="hero-wrap">
          <div className="logo"></div>
          <h1 className="hero-title font-['Orbitron'] text-3xl font-bold mb-1" style={{ textAlign: 'center' }}>ASTRO-IGNIS</h1>
          <div className="badges">
            <span className="badge">Quantum Sync</span>
            <span className="badge">Online</span>
            <span className="badge">v3.1.2</span>
          </div>
          <div className="ticker">
            <span className="tick-dot" /> Live Telemetry
            <span className="divider" /> Uptime 99.98%
            <span className="divider" /> Latency 23ms
          </div>
          <div className="header-ribbon" />
        </div>
      </header>

      <div className="scene-3d w-screen ">
        <div className="cube-container">
          {/* Top Row */}
          <article className="panel frame-top-left flex flex-col" onClick={() => navigate("/Astrofategue")}>
            <div className="panel-header">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold tracking-wide">ASTRO EXPLOIS</h3>
                <span className="chip">EXP</span>
              </div>
              <div className="text-xs opacity-80 mt-1 flex items-center justify-center gap-2">
                <span role="img" aria-label="astronaut fatigue" className="text-xl">🧑‍🚀💤</span>
                <span>ASTRONAUT FATIGUE</span>
              </div>
            </div>
            <div className="panel-content flex-grow" >
              <div className="flex justify-between items-center mb-4">
                <div className="sphere">
                  <span className="ping" style={{ top: '25%', left: '35%' }}></span>
                </div>
                <div className="text-xs space-y-2">
                  <div className="flex justify-between gap-6">
                    <span className="opacity-70">Pulse:</span>
                    <span className="text-cyan-300 font-semibold">72 bpm</span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span className="opacity-70">Fatigue:</span>
                    <span className="text-yellow-300 font-semibold">Moderate</span>
                  </div>
                </div>
              </div>
              <MiniChart />
            </div>
          </article>

          <article className="panel frame-top-center-left flex flex-col" onClick={() => navigate("/health")}>
            <div className="panel-header">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold tracking-wide">HEALTH ISSUE</h3>
                <span className="chip">MED</span>
              </div>
            </div>
            <div className="panel-content flex-grow">
              <div className="flex justify-between items-center mb-4">
                <div className="status-ring">
                  <div className="absolute inset-4  flex items-center justify-center">
                    <span className="text-red-300 text-xl font-bold  text-xl font-bold">🩺👨‍⚕️🩻💉💊😷</span>
                  </div>
                </div>
                <div className="text-xs space-y-2">
                  <div className="flex justify-between gap-4">
                    <span className="opacity-70">SpO₂:</span>
                    <span className="text-red-300 font-semibold">94%</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="opacity-70">Temp:</span>
                    <span className="text-yellow-300 font-semibold">37.8°C</span>
                  </div>
                </div>
              </div>
              <PulseBar />
            </div>
          </article>

          <article className="panel frame-top-center-right flex flex-col" >
            <div className="panel-header">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold tracking-wide">MORSE CODE</h3>
                <span className="chip">SIG</span>
              </div>
            </div>
            <div className="panel-content flex-grow">
              <div className="text-center mb-4">
                <div className="text-xl font-bold text-cyan-300 mb-2">256<span className="text-sm opacity-70">Hz</span></div>
                <div className="text-xs opacity-70 uppercase tracking-wider">Emergency Signal</div>
              </div>
              <MorseCodeDisplay onReplay={replayMorse} trigger={morseTrigger} />
            </div>
          </article>

        
          {/* Middle Row */}
          <article className="panel frame-middle-left flex flex-col" onClick={() => navigate("/spavenova")}>
            <div className="panel-header">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold tracking-wide">STUDY ANALYSIS SPACE MONO</h3>
                <span className="chip">ANA</span>
              </div>
            </div>
            <div className="panel-content flex-grow">
              <div className="grid grid-cols-4 gap-3 text-xs mb-4">
                <div className="text-center">
                  <div className="text-cyan-300 font-bold text-lg">2847</div>
                  <div className="opacity-60 uppercase tracking-wider">Data</div>
                </div>
                <div className="text-center">
                  <div className="text-green-300 font-bold text-lg">1204</div>
                  <div className="opacity-60 uppercase tracking-wider">Valid</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-300 font-bold text-lg">643</div>
                  <div className="opacity-60 uppercase tracking-wider">Queue</div>
                </div>
                <div className="text-center">
                  <div className="text-red-300 font-bold text-lg">12</div>
                  <div className="opacity-60 uppercase tracking-wider">Error</div>
                </div>
              </div>
            </div>
          </article>

          <article className="panel frame-middle-center flex flex-col">
            <div className="panel-header">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold tracking-wide">NEURAL ACTIVITY MONITOR</h3>
                <span className="chip">NEU</span>
              </div>
            </div>
            <div
              className="panel-content flex-grow"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(2,6,23,.35), rgba(2,6,23,.35)), url(${neuralBg})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                borderRadius: '10px'
              }}
            >
              <div className="flex justify-center mb-4">
                <div className="status-ring" style={{ height: '70px', width: '70px', overflow: 'hidden', borderRadius: '9999px' }}>
                  <div className="absolute inset-1 flex items-center justify-center">
                    <img src={neuralBg} alt="Neural Activity" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                </div>
              </div>
              <div className="wave-form" style={{ height: '90px' }}></div>
            </div>
          </article>

          <article className="panel frame-middle-right flex flex-col" onClick={() => navigate("/equipment")}>
            <div className="panel-header">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold tracking-wide">EQUIPMENT MALFUNCTION</h3>
                <span className="chip">ERR</span>
              </div>
            </div>
            <div className="panel-content flex-grow">
              <div className="flex justify-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/30 border-2 border-green-400 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                </div>
                <div className="w-10 h-10 bg-red-500/30 border-2 border-red-400 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-red-400 rounded-full animate-pulse"></div>
                </div>
                <div className="w-10 h-10 bg-green-500/30 border-2 border-green-400 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                </div>
              </div>
              <div className="text-center mb-3">
                <div className="text-red-300 text-xs mb-2 font-semibold uppercase tracking-wider">Actuator Fault</div>
                <button className="px-4 py-2 text-xs font-semibold bg-red-500/20 border border-red-300/40 rounded-lg hover:bg-red-500/30 transition-all duration-300 tracking-wider">
                  ACKNOWLEDGE
                </button>
              </div>
              <PulseBar />
            </div>
          </article>

          {/* Bottom Row */}
        

          <article className="panel frame-bottom-center-left flex flex-col" onClick={() => navigate("/physico")}>
            <div className="panel-header">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold tracking-wide">PSYCHOLOGICAL</h3>
                <span className="chip">PSY</span>
              </div>
            </div>
            <div className="panel-content flex-grow">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-cyan-300">225K</div>
                <div className="text-xs opacity-70 uppercase tracking-wider mb-1">Stress Index</div>
                <div className="text-xs text-green-300 font-semibold">25.3 AVG</div>
              </div>
              <div className="wave-form" style={{ height: '40px' }}></div>
            </div>
          </article>

          <article className="panel frame-bottom-center-right flex flex-col" onClick={() => navigate("/communication")}>
            <div className="panel-header">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold tracking-wide">COMMUNICATION</h3>
                <span className="chip">COM</span>
              </div>
            </div>
            <div className="panel-content flex-grow">
              <div className="flex justify-center mb-4">
                <div className="status-ring" style={{ width: '70px', height: '70px' }}>
                  <div className="absolute inset-4  flex items-center justify-center">
                    <span className="text-cyan-300 text-xl">📡</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-green-300 font-semibold mb-1">SIGNAL STRONG</div>
                <div className="text-xs opacity-70">89% Quality</div>
              </div>
            </div>
          </article>

          <article className="panel frame-bottom-right flex flex-col" onClick={() => navigate("/FoodStorage")}>
            <div className="panel-header">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold tracking-wide">Food & Waste Management</h3>
                <span className="chip">COM</span>
              </div>
            </div>
            <div className="panel-content flex-grow">
              <div className="flex justify-center mb-4">
                <div className="status-ring" style={{ width: '70px', height: '70px' }}>
                  <div className="absolute inset-4  flex items-center justify-center">
                    <span className="text-cyan-300 text-xl">📦📦📦</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-green-300 font-semibold mb-1">SYSTEM ONLINE</div>
                <div className="text-xs opacity-70">89% Quality</div>
              </div>
            </div>
          </article>

         
        </div>
      </div>
    </>
  );

}

export default Dashboard;