import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  VolumeX
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  onNavigateToAssessment?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onNavigateToAssessment: _onNavigateToAssessment }) => {
  // Byotone Entrance Gating State
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [activeChapter, setActiveChapter] = useState<'A' | 'B' | 'C' | 'D' | 'E' | 'F'>('A');
  const [solarFlux, setSolarFlux] = useState<number>(840); // W/m² slider
  const [activePreset, setActivePreset] = useState<'cool' | 'balanced' | 'solar'>('balanced');

  // Canvas ref for Byotone organic dust/particle ring
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Initialize and animate particle ring
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle cloud configuration
    const PARTICLE_COUNT = 420;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radiusBase = 220 + Math.random() * 260;
      return {
        angle,
        speed: (0.0015 + Math.random() * 0.002) * (Math.random() > 0.5 ? 1 : -1),
        radiusBase,
        radiusJitter: (Math.random() - 0.5) * 45,
        size: 0.8 + Math.random() * 1.8,
        alpha: 0.15 + Math.random() * 0.65,
        hueShift: Math.random()
      };
    });

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw faint center glowing focal ring
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        140,
        centerX,
        centerY,
        420
      );
      glowGrad.addColorStop(0, 'rgba(110, 231, 183, 0.04)');
      glowGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.02)');
      glowGrad.addColorStop(1, 'rgba(17, 18, 21, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 440, 0, Math.PI * 2);
      ctx.fill();

      // Render dust particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.angle += p.speed;

        // Dynamic radius modulation based on solarFlux slider
        const fluxMod = (solarFlux - 840) * 0.08;
        const currentRadius = p.radiusBase + p.radiusJitter + Math.sin(frame * 0.01 + i) * 12 + fluxMod;

        const x = centerX + Math.cos(p.angle) * currentRadius * 1.15;
        const y = centerY + Math.sin(p.angle) * currentRadius * 0.72;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);

        // Palette transition: mint (#6ee7b7) to cyan (#7dd3fc)
        const isMint = p.hueShift > 0.4;
        ctx.fillStyle = isMint
          ? `rgba(110, 231, 183, ${p.alpha})`
          : `rgba(125, 211, 252, ${p.alpha * 0.8})`;

        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [solarFlux]);

  // Audio synthesis for Byotone ambient frequency (8.0 Hz / 432 Hz soothing drone)
  const toggleSound = () => {
    if (!soundEnabled) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // 108Hz harmonic base with slow modulation
        osc.type = 'sine';
        osc.frequency.setValueAtTime(108, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        oscillatorRef.current = osc;
        gainNodeRef.current = gain;
        setSoundEnabled(true);
      } catch (e) {
        console.warn('Audio not supported:', e);
      }
    } else {
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.6);
        setTimeout(() => {
          oscillatorRef.current?.stop();
          audioCtxRef.current?.close();
        }, 600);
      }
      setSoundEnabled(false);
    }
  };

  const handleEnterWithSound = () => {
    toggleSound();
    setHasEntered(true);
  };

  const handleEnterQuietly = () => {
    setHasEntered(true);
  };

  const scrollToChapter = (chapter: 'A' | 'B' | 'C' | 'D' | 'E' | 'F') => {
    setActiveChapter(chapter);
    const el = document.getElementById(`chapter-${chapter.toLowerCase()}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Calculated live metrics based on Solar Flux slider
  const baselineSolAirTemp = (36 + (solarFlux * 0.038)).toFixed(1);
  const coolSolAirTemp = (36 + (solarFlux * 0.011)).toFixed(1);
  const solAirDelta = (parseFloat(baselineSolAirTemp) - parseFloat(coolSolAirTemp)).toFixed(1);

  return (
    <div className="byotone-page">
      {/* Living Celestial Particle Ring Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          opacity: hasEntered ? 0.85 : 0.95,
          transition: 'opacity 1s ease'
        }}
      />

      {/* ════════════════════════════════════════════════════════════════
          BYOTONE ARRIVAL PRELOADER / GATING SCREEN
          ════════════════════════════════════════════════════════════════ */}
      {!hasEntered && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          background: 'radial-gradient(circle at 50% 50%, #15171c 0%, #0c0d10 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center'
        }}>
          {/* Byotone Brand Minimal Mark */}
          <div style={{
            width: '48px',
            height: '48px',
            marginBottom: '16px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg viewBox="0 0 48 48" width="48" height="48" fill="none">
              <path
                d="M10 24C10 16.268 16.268 10 24 10C31.732 10 38 16.268 38 24"
                stroke="#6EE7B7"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M16 24C16 19.5817 19.5817 16 24 16C28.4183 16 32 19.5817 32 24"
                stroke="#7DD3FC"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="2 3"
              />
              <circle cx="24" cy="24" r="3" fill="#6EE7B7" />
            </svg>
          </div>

          <div className="byotone-mono" style={{ fontSize: '0.85rem', color: '#ffffff', letterSpacing: '0.22em', marginBottom: '32px' }}>
            ROOFWISE • CLIMATEFIT
          </div>

          <h1 className="byotone-title-huge" style={{ maxWidth: '820px', marginBottom: '18px', color: '#6EE7B7' }}>
            EVIDENCE-BACKED ROOF RESILIENCE
          </h1>

          <p style={{
            maxWidth: '520px',
            fontSize: '1rem',
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: 1.6,
            marginBottom: '40px'
          }}>
            A spatial retrofit planning twin balancing heat attenuation, sol-air thermodynamics,
            and circular monsoon rainwater harvesting.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            {/* Byotone Orbit Button */}
            <button
              id="byotone-enter-sound-btn"
              onClick={handleEnterWithSound}
              className="byotone-btn-orbit"
              style={{ padding: '10px 28px 10px 14px' }}
            >
              <div className="byotone-orbit-dot-ring">
                <svg className="byotone-orbit-dot" width="20" height="20" viewBox="0 0 20 20">
                  <circle cx="10" cy="3" r="2" fill="#6EE7B7" />
                  <circle cx="16" cy="14" r="1.5" fill="#7DD3FC" />
                  <circle cx="4" cy="14" r="1.5" fill="#FDE047" />
                </svg>
              </div>
              <span>ENTER WITH TELEMETRY</span>
            </button>

            <button
              id="byotone-enter-quiet-btn"
              onClick={handleEnterQuietly}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.45)',
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                cursor: 'pointer',
                padding: '6px 16px',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#6EE7B7')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.45)')}
            >
              ENTER QUIETLY
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          PERSISTENT FIXED HEADER (BYOTONE CHAPTER PROGRESS NAV)
          ════════════════════════════════════════════════════════════════ */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '20px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(180deg, rgba(17, 18, 21, 0.9) 0%, rgba(17, 18, 21, 0) 100%)',
        backdropFilter: 'blur(8px)'
      }}>
        {/* Brand Mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid rgba(110, 231, 183, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(110, 231, 183, 0.06)'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12" stroke="#6EE7B7" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12" stroke="#7DD3FC" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2"/>
            </svg>
          </div>
          <div>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: '0.95rem',
              letterSpacing: '0.14em',
              color: '#ffffff'
            }}>
              ROOFWISE
            </span>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.65rem',
              color: '#6EE7B7',
              marginLeft: '8px',
              padding: '2px 6px',
              border: '1px solid rgba(110, 231, 183, 0.3)',
              borderRadius: '999px'
            }}>
              PHYSICS v1.2
            </span>
          </div>
        </div>

        {/* Byotone Chapter Nodes (A, B, C, D, E, F) */}
        <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="byotone-chapter-nav">
            {[
              { id: 'A', label: 'OVERVIEW' },
              { id: 'B', label: 'SOL-AIR PHYSICS' },
              { id: 'C', label: 'HYDRO HARVEST' },
              { id: 'D', label: 'PARETO OPTIMA' },
              { id: 'E', label: 'STANDARDS' },
              { id: 'F', label: 'WORKBENCH' }
            ].map((ch) => (
              <button
                key={ch.id}
                onClick={() => scrollToChapter(ch.id as 'A' | 'B' | 'C' | 'D' | 'E' | 'F')}
                className={`byotone-chapter-node ${activeChapter === ch.id ? 'active' : ''}`}
                title={ch.label}
              >
                <span>{ch.id}</span>
                <span className="byotone-chapter-label">{ch.label}</span>
              </button>
            ))}
          </div>

          <div style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.15)', margin: '0 8px' }} />

          <button
            id="byotone-nav-workbench-btn"
            onClick={onEnterApp}
            className="byotone-btn-orbit"
            style={{ padding: '6px 18px 6px 10px', fontSize: '0.75rem' }}
          >
            <div className="byotone-orbit-dot-ring" style={{ width: '22px', height: '22px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6EE7B7' }} />
            </div>
            <span>LAUNCH APP</span>
          </button>
        </nav>
      </header>

      {/* ════════════════════════════════════════════════════════════════
          PERSISTENT BOTTOM TELEMETRY BAR
          ════════════════════════════════════════════════════════════════ */}
      <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '14px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(0deg, rgba(17, 18, 21, 0.95) 0%, rgba(17, 18, 21, 0) 100%)',
        backdropFilter: 'blur(8px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        {/* Left Telemetry Signature */}
        <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>ENGINEERED FOR TROPICAL CLIMATES</span>
          <span style={{ color: '#6EE7B7' }}>⇄</span>
          <span>CLIMATEFIT DETERMINISTIC ENGINE</span>
        </div>

        {/* Center / Right Interactive Solar Flux & Telemetry */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* Interactive Solar Flux Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="byotone-mono" style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.65)' }}>
              SOLAR FLUX: <strong style={{ color: '#FDE047' }}>{solarFlux} W/m²</strong>
            </span>
            <input
              type="range"
              min="400"
              max="1100"
              step="20"
              value={solarFlux}
              onChange={(e) => setSolarFlux(Number(e.target.value))}
              style={{
                width: '90px',
                accentColor: '#6EE7B7',
                cursor: 'pointer'
              }}
            />
          </div>

          {/* Sol-Air Delta Tag */}
          <div className="byotone-mono" style={{ fontSize: '0.7rem', color: '#6EE7B7', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>ΔT ATTENUATION:</span>
            <span style={{
              background: 'rgba(110, 231, 183, 0.1)',
              padding: '2px 6px',
              border: '1px solid rgba(110, 231, 183, 0.3)',
              borderRadius: '4px',
              color: '#6EE7B7',
              fontWeight: 700
            }}>
              -{solAirDelta} °C
            </span>
          </div>

          {/* Sound / Frequency Monitor Toggle */}
          <button
            onClick={toggleSound}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '999px',
              padding: '4px 12px',
              color: soundEnabled ? '#6EE7B7' : 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.68rem'
            }}
          >
            {soundEnabled ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '14px' }}>
                <span className="byotone-wave-bar-1" style={{ width: '2px', background: '#6EE7B7', borderRadius: '1px' }} />
                <span className="byotone-wave-bar-2" style={{ width: '2px', background: '#6EE7B7', borderRadius: '1px' }} />
                <span className="byotone-wave-bar-3" style={{ width: '2px', background: '#6EE7B7', borderRadius: '1px' }} />
                <span className="byotone-wave-bar-4" style={{ width: '2px', background: '#6EE7B7', borderRadius: '1px' }} />
              </div>
            ) : (
              <VolumeX size={12} />
            )}
            <span>{soundEnabled ? '8.0 HZ AUDIO ACTIVE' : 'MUTE AUDIO'}</span>
          </button>
        </div>
      </footer>

      {/* ════════════════════════════════════════════════════════════════
          FLOATING TELEMETRY CORNER BRACKET TAGS
          ════════════════════════════════════════════════════════════════ */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
        <div className="byotone-telemetry-tag byotone-floating" style={{ top: '16%', left: '8%' }}>
          <span className="bracket-tl" />
          <span className="bracket-br" />
          0.85 SOLAR REFLECTANCE
        </div>

        <div className="byotone-telemetry-tag byotone-floating" style={{ top: '22%', right: '9%', animationDelay: '-2s' }}>
          <span className="bracket-tl" />
          <span className="bracket-br" />
          NBC 2016 CL.4 THERMAL INERTIA
        </div>

        <div className="byotone-telemetry-tag byotone-floating" style={{ top: '68%', left: '7%', animationDelay: '-4s' }}>
          <span className="bracket-tl" />
          <span className="bracket-br" />
          IS 15797 MONSOON RUNOFF C=0.90
        </div>

        <div className="byotone-telemetry-tag byotone-floating" style={{ top: '74%', right: '8%', animationDelay: '-3s' }}>
          <span className="bracket-tl" />
          <span className="bracket-br" />
          DETERMINISTIC PARETO FRONTIER
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          CHAPTER SECTIONS (A, B, C, D, E, F)
          ════════════════════════════════════════════════════════════════ */}
      <main style={{ position: 'relative', zIndex: 20, paddingTop: '100px', paddingBottom: '120px' }}>
        
        {/* ── CHAPTER A: THE INTRO / URBAN HEAT OVERLOAD ── */}
        <section id="chapter-a" style={{
          minHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '40px 24px',
          position: 'relative'
        }}>
          <div className="byotone-mono" style={{ fontSize: '0.8rem', color: '#6EE7B7', marginBottom: '20px', letterSpacing: '0.2em' }}>
            CHAPTER A • THE PLANETARY CONCRETE CRISIS
          </div>

          <h2 className="byotone-title-huge" style={{ maxWidth: '1000px', marginBottom: '24px' }}>
            THE URBAN ROOFTOP UNDER EXTREME THERMAL FLUX
          </h2>

          <p style={{
            maxWidth: '680px',
            fontSize: '1.15rem',
            lineHeight: 1.65,
            color: 'rgba(255, 255, 255, 0.72)',
            marginBottom: '40px'
          }}>
            In dense tropical and subtropical cities, uninsulated reinforced concrete (RCC) slabs
            superheat to <strong style={{ color: '#FDE047' }}>62°C</strong> under peak solar irradiance.
            Roofwise transforms exposed roofs into high-albedo shields and circular rainwater collectors
            grounded in deterministic engineering.
          </p>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <button
              onClick={() => scrollToChapter('B')}
              className="byotone-btn-orbit"
            >
              <div className="byotone-orbit-dot-ring">
                <ArrowRight size={14} color="#6EE7B7" />
              </div>
              <span>STEP INTO THE SCIENCE</span>
            </button>

            <button
              onClick={onEnterApp}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.8rem',
                color: 'rgba(255, 255, 255, 0.6)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.1em'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)')}
            >
              SKIP TO WORKBENCH →
            </button>
          </div>

          {/* Quick Real-Time Metric Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            maxWidth: '920px',
            width: '100%',
            marginTop: '80px'
          }}>
            <div className="byotone-card" style={{ padding: '24px', textAlign: 'left' }}>
              <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                SURFACE TEMPERATURE
              </div>
              <div className="byotone-title-medium" style={{ color: '#F87171', margin: '8px 0' }}>
                {baselineSolAirTemp}°C
              </div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                Baseline uninsulated RCC slab during peak noon hour.
              </div>
            </div>

            <div className="byotone-card" style={{ padding: '24px', textAlign: 'left' }}>
              <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                RETROFITTED SOL-AIR
              </div>
              <div className="byotone-title-medium" style={{ color: '#6EE7B7', margin: '8px 0' }}>
                {coolSolAirTemp}°C
              </div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                High-albedo coating (SRI 104) + 50mm XPS insulation.
              </div>
            </div>

            <div className="byotone-card" style={{ padding: '24px', textAlign: 'left' }}>
              <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                NET ATTENUATION
              </div>
              <div className="byotone-title-medium" style={{ color: '#7DD3FC', margin: '8px 0' }}>
                -{solAirDelta}°C
              </div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                Direct cooling load reduction for top floors.
              </div>
            </div>
          </div>
        </section>

        {/* ── CHAPTER B: SOL-AIR & ALBEDO PHYSICS ── */}
        <section id="chapter-b" style={{
          minHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '80px 24px',
          position: 'relative'
        }}>
          <div className="byotone-mono" style={{ fontSize: '0.8rem', color: '#6EE7B7', marginBottom: '20px', letterSpacing: '0.2em' }}>
            CHAPTER B • THERMODYNAMICS OF THE SLAB
          </div>

          <h2 className="byotone-title-huge" style={{ maxWidth: '960px', textAlign: 'center', marginBottom: '32px' }}>
            DEFLECTING SOLAR RADIATION BEFORE IT ENTERS
          </h2>

          <div style={{
            maxWidth: '1060px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'center'
          }}>
            {/* Visual Cross-Section Diagram */}
            <div className="byotone-card" style={{ padding: '36px' }}>
              <div className="byotone-mono" style={{ fontSize: '0.75rem', color: '#6EE7B7', marginBottom: '16px' }}>
                CROSS-SECTION TELEMETRY (ASHRAE 90.1 / NBC 2016)
              </div>

              {/* Interactive SVG Diagram */}
              <svg viewBox="0 0 400 240" width="100%" height="auto" style={{ overflow: 'visible' }}>
                {/* Sun & incident solar ray */}
                <circle cx="50" cy="30" r="16" fill="#FDE047" opacity="0.8" />
                <line x1="66" y1="42" x2="180" y2="100" stroke="#FDE047" strokeWidth="2.5" strokeDasharray="4 3" />
                
                {/* Reflected Solar Ray (85% Albedo) */}
                <line x1="180" y1="100" x2="280" y2="35" stroke="#6EE7B7" strokeWidth="2.5" />
                <text x="290" y="38" fill="#6EE7B7" fontSize="10" fontFamily="'Space Mono', monospace">
                  85% REFLECTED (SRI 104)
                </text>

                {/* Layer 1: High-Albedo Coating */}
                <rect x="40" y="100" width="320" height="12" rx="3" fill="#6EE7B7" opacity="0.8" />
                <text x="50" y="110" fill="#111215" fontSize="8" fontWeight="bold" fontFamily="'Space Mono', monospace">
                  HIGH-ALBEDO ELASTOMERIC COATING
                </text>

                {/* Layer 2: Extruded Polystyrene (XPS) */}
                <rect x="40" y="116" width="320" height="24" rx="3" fill="#38BDF8" opacity="0.4" />
                <text x="50" y="132" fill="#FFFFFF" fontSize="9" fontFamily="'Space Mono', monospace">
                  50mm XPS INSULATION (R-VALUE = 1.8 m²K/W)
                </text>

                {/* Layer 3: Waterproofing Membrane */}
                <rect x="40" y="144" width="320" height="8" rx="2" fill="#A855F7" opacity="0.5" />

                {/* Layer 4: Concrete RCC Slab */}
                <rect x="40" y="156" width="320" height="48" rx="4" fill="#374151" opacity="0.9" />
                <text x="50" y="185" fill="#E5E7EB" fontSize="10" fontFamily="'Space Mono', monospace">
                  150mm REINFORCED CONCRETE (RCC) SLAB
                </text>

                {/* Internal Heat Transfer Arrow */}
                <line x1="200" y1="208" x2="200" y2="232" stroke="#6EE7B7" strokeWidth="2" strokeDasharray="2 2" />
                <text x="215" y="225" fill="#6EE7B7" fontSize="9" fontFamily="'Space Mono', monospace">
                  CONDUCTIVE FLUX MINIMIZED
                </text>
              </svg>

              <div style={{
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px dashed rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.8rem',
                color: 'rgba(255, 255, 255, 0.65)'
              }}>
                <span>Overall U-Value: <strong style={{ color: '#FFFFFF' }}>0.48 W/m²K</strong></span>
                <span>Solar Heat Gain Coeff: <strong style={{ color: '#6EE7B7' }}>0.15</strong></span>
              </div>
            </div>

            {/* Scientific Explanation */}
            <div>
              <h3 className="byotone-title-medium" style={{ marginBottom: '20px', color: '#FFFFFF' }}>
                THE SOL-AIR EQUATION UNPACKED
              </h3>
              <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.72)', lineHeight: 1.7, marginBottom: '20px' }}>
                Standard energy modeling often overlooks the Sol-Air temperature—the effective outdoor temperature
                accounting for solar radiation and longwave radiative exchange with the sky:
              </p>

              <div style={{
                background: 'rgba(0, 0, 0, 0.35)',
                padding: '16px 20px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.85rem',
                color: '#6EE7B7',
                marginBottom: '24px'
              }}>
                T_sol = T_amb + (α · I_sol) / h_o - (ε · ΔR) / h_o
              </div>

              <p style={{ fontSize: '0.92rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.6, marginBottom: '32px' }}>
                By increasing solar reflectance (α drops from 0.75 to 0.15), the direct radiative heat input
                collapses by over 75%, attenuating heat transfer into occupied spaces beneath the roof.
              </p>

              <button
                onClick={() => scrollToChapter('C')}
                className="byotone-btn-orbit"
              >
                <div className="byotone-orbit-dot-ring">
                  <ArrowRight size={14} color="#6EE7B7" />
                </div>
                <span>EXPLORE MONSOON HYDRO HARVESTING</span>
              </button>
            </div>
          </div>
        </section>

        {/* ── CHAPTER C: MONSOON HYDRO HARVESTING ── */}
        <section id="chapter-c" style={{
          minHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '80px 24px',
          position: 'relative'
        }}>
          <div className="byotone-mono" style={{ fontSize: '0.8rem', color: '#7DD3FC', marginBottom: '20px', letterSpacing: '0.2em' }}>
            CHAPTER C • CIRCULAR HYDRO DYNAMICS
          </div>

          <h2 className="byotone-title-huge" style={{ maxWidth: '980px', textAlign: 'center', marginBottom: '28px' }}>
            TRANSFORMING MONSOON DELUGES INTO CLEAN RESERVES
          </h2>

          <p style={{
            maxWidth: '680px',
            fontSize: '1.05rem',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: 1.65,
            marginBottom: '48px'
          }}>
            Every square meter of roof can intercept over 1,400 liters of pristine rainwater annually.
            Roofwise calculates monthly hydro balances calibrated to IS 15797:2008 and CPWD intensity curves.
          </p>

          <div style={{
            maxWidth: '1060px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '28px'
          }}>
            <div className="byotone-card">
              <div className="byotone-mono" style={{ fontSize: '0.72rem', color: '#7DD3FC', marginBottom: '12px' }}>
                RUNOFF COEFFICIENTS (IS 15797)
              </div>
              <div className="byotone-title-big" style={{ color: '#FFFFFF', marginBottom: '12px' }}>
                C = 0.90
              </div>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.6 }}>
                High-efficiency smooth elastomeric finishes minimize retention losses and maximize yield compared
                to porous unsealed brick bat coba.
              </p>
            </div>

            <div className="byotone-card">
              <div className="byotone-mono" style={{ fontSize: '0.72rem', color: '#7DD3FC', marginBottom: '12px' }}>
                FIRST-FLUSH DIVERTER SIZING
              </div>
              <div className="byotone-title-big" style={{ color: '#FFFFFF', marginBottom: '12px' }}>
                1.5 mm
              </div>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.6 }}>
                Automatic diversion of initial airborne contaminants and dust guarantees turbidity below 5 NTU
                entering the storage tank.
              </p>
            </div>

            <div className="byotone-card">
              <div className="byotone-mono" style={{ fontSize: '0.72rem', color: '#7DD3FC', marginBottom: '12px' }}>
                NON-POTABLE OFFSET
              </div>
              <div className="byotone-title-big" style={{ color: '#6EE7B7', marginBottom: '12px' }}>
                58.4%
              </div>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.6 }}>
                Full coverage of top-floor flushing and cooling tower make-up demand across a standard 400 m² commercial roof.
              </p>
            </div>
          </div>

          <div style={{ marginTop: '48px' }}>
            <button
              onClick={() => scrollToChapter('D')}
              className="byotone-btn-orbit"
            >
              <div className="byotone-orbit-dot-ring">
                <ArrowRight size={14} color="#6EE7B7" />
              </div>
              <span>VIEW PARETO RETROFIT OPTIMA</span>
            </button>
          </div>
        </section>

        {/* ── CHAPTER D: MULTI-OBJECTIVE PARETO OPTIMA ── */}
        <section id="chapter-d" style={{
          minHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '80px 24px',
          position: 'relative'
        }}>
          <div className="byotone-mono" style={{ fontSize: '0.8rem', color: '#FDE047', marginBottom: '20px', letterSpacing: '0.2em' }}>
            CHAPTER D • COMPUTATIONAL OPTIMIZATION
          </div>

          <h2 className="byotone-title-huge" style={{ maxWidth: '980px', textAlign: 'center', marginBottom: '32px' }}>
            DETERMINISTIC RETROFIT FRONTIERS. NO GUESSWORK.
          </h2>

          <p style={{
            maxWidth: '680px',
            fontSize: '1.05rem',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: 1.65,
            marginBottom: '40px'
          }}>
            Every retrofit is a multi-dimensional tradeoff between upfront Capex, cooling load reduction,
            structural dead load limits, and embodied carbon.
          </p>

          {/* Interactive Preset Switcher */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '36px',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '6px',
            borderRadius: '999px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {[
              { key: 'cool', label: 'OPTION 1: COOL ROOF PIONEER' },
              { key: 'balanced', label: 'OPTION 2: CLIMATEFIT BALANCED' },
              { key: 'solar', label: 'OPTION 3: SOLAR + HARVEST' }
            ].map((p) => (
              <button
                key={p.key}
                onClick={() => setActivePreset(p.key as 'cool' | 'balanced' | 'solar')}
                style={{
                  padding: '8px 20px',
                  borderRadius: '999px',
                  border: 'none',
                  background: activePreset === p.key ? '#6EE7B7' : 'transparent',
                  color: activePreset === p.key ? '#111215' : 'rgba(255, 255, 255, 0.7)',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Selected Option Deep-Dive Card */}
          <div className="byotone-card" style={{ maxWidth: '880px', width: '100%', padding: '40px' }}>
            {activePreset === 'cool' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 className="byotone-title-medium" style={{ color: '#FFFFFF' }}>Cool Roof Pioneer</h3>
                  <span className="byotone-mono" style={{ color: '#6EE7B7', fontSize: '0.8rem' }}>FASTEST PAYBACK</span>
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, marginBottom: '24px' }}>
                  High-albedo elastomeric reflective barrier (SRI 104) applied directly to RCC slab. Minimal structural dead load, lowest capital expenditure.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>ESTIMATED CAPEX</div>
                    <div style={{ fontSize: '1.4rem', color: '#6EE7B7', fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>₹ 2,40,000</div>
                  </div>
                  <div>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>SOL-AIR REDUCTION</div>
                    <div style={{ fontSize: '1.4rem', color: '#7DD3FC', fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>-11.2 °C</div>
                  </div>
                  <div>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>SIMPLE PAYBACK</div>
                    <div style={{ fontSize: '1.4rem', color: '#FDE047', fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>2.4 YEARS</div>
                  </div>
                </div>
              </div>
            )}

            {activePreset === 'balanced' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 className="byotone-title-medium" style={{ color: '#FFFFFF' }}>ClimateFit Balanced (Recommended)</h3>
                  <span className="byotone-mono" style={{ color: '#6EE7B7', fontSize: '0.8rem' }}>OPTIMAL MULTI-CRITERIA</span>
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, marginBottom: '24px' }}>
                  Synergistic combination of 50mm XPS under-deck insulation, high-albedo topcoat, and a 20 kL rainwater harvesting reservoir with first-flush filtration.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>ESTIMATED CAPEX</div>
                    <div style={{ fontSize: '1.4rem', color: '#6EE7B7', fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>₹ 6,85,000</div>
                  </div>
                  <div>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>WATER COVERAGE</div>
                    <div style={{ fontSize: '1.4rem', color: '#7DD3FC', fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>58.4 %</div>
                  </div>
                  <div>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>SOL-AIR REDUCTION</div>
                    <div style={{ fontSize: '1.4rem', color: '#FDE047', fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>-14.8 °C</div>
                  </div>
                </div>
              </div>
            )}

            {activePreset === 'solar' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 className="byotone-title-medium" style={{ color: '#FFFFFF' }}>Solar PV + Micro-RWH</h3>
                  <span className="byotone-mono" style={{ color: '#FDE047', fontSize: '0.8rem' }}>ENERGY INTENSIVE</span>
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, marginBottom: '24px' }}>
                  Elevated canopy solar photovoltaic arrays providing shade to the roof while generating clean power, combined with downspout collection.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>ESTIMATED CAPEX</div>
                    <div style={{ fontSize: '1.4rem', color: '#6EE7B7', fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>₹ 14,20,000</div>
                  </div>
                  <div>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>ANNUAL GENERATION</div>
                    <div style={{ fontSize: '1.4rem', color: '#7DD3FC', fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>38,500 kWh</div>
                  </div>
                  <div>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>DEAD LOAD INCREASE</div>
                    <div style={{ fontSize: '1.4rem', color: '#F87171', fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>+32 kg/m²</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: '48px' }}>
            <button
              onClick={() => scrollToChapter('E')}
              className="byotone-btn-orbit"
            >
              <div className="byotone-orbit-dot-ring">
                <ArrowRight size={14} color="#6EE7B7" />
              </div>
              <span>VIEW REGULATORY STANDARDS</span>
            </button>
          </div>
        </section>

        {/* ── CHAPTER E: REGULATORY STANDARDS & TRUST ── */}
        <section id="chapter-e" style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '80px 24px',
          position: 'relative'
        }}>
          <div className="byotone-mono" style={{ fontSize: '0.8rem', color: '#6EE7B7', marginBottom: '20px', letterSpacing: '0.2em' }}>
            CHAPTER E • AUDITABLE COMPLIANCE
          </div>

          <h2 className="byotone-title-huge" style={{ maxWidth: '980px', textAlign: 'center', marginBottom: '32px' }}>
            EVIDENCE YOU CAN HAND TO MUNICIPAL AUDITORS
          </h2>

          <div style={{
            maxWidth: '1060px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px'
          }}>
            <div className="byotone-card">
              <div className="byotone-mono" style={{ fontSize: '0.7rem', color: '#6EE7B7', marginBottom: '8px' }}>
                INDIAN STANDARD
              </div>
              <div className="byotone-title-medium" style={{ color: '#FFFFFF', marginBottom: '12px' }}>
                IS 15797:2008
              </div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.6 }}>
                Roof rainwater harvesting guidelines for buildings, storage tank sizing, and filtration media specifications.
              </p>
            </div>

            <div className="byotone-card">
              <div className="byotone-mono" style={{ fontSize: '0.7rem', color: '#6EE7B7', marginBottom: '8px' }}>
                NATIONAL CODE
              </div>
              <div className="byotone-title-medium" style={{ color: '#FFFFFF', marginBottom: '12px' }}>
                NBC 2016 Part 8
              </div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.6 }}>
                Building services thermal performance requirements, thermal conductivity constraints, and overall envelope U-values.
              </p>
            </div>

            <div className="byotone-card">
              <div className="byotone-mono" style={{ fontSize: '0.7rem', color: '#6EE7B7', marginBottom: '8px' }}>
                INTERNATIONAL
              </div>
              <div className="byotone-title-medium" style={{ color: '#FFFFFF', marginBottom: '12px' }}>
                ASHRAE 90.1
              </div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.6 }}>
                Energy Standard for Buildings Except Low-Rise Residential, cool roof SRI baselines, and sol-air heat flow protocols.
              </p>
            </div>

            <div className="byotone-card">
              <div className="byotone-mono" style={{ fontSize: '0.7rem', color: '#6EE7B7', marginBottom: '8px' }}>
                COST SCHEDULES
              </div>
              <div className="byotone-title-medium" style={{ color: '#FFFFFF', marginBottom: '12px' }}>
                CPWD SSR 2023
              </div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.6 }}>
                Schedule of Rates for waterproofing, elastomeric membranes, piping, RCC works, and labor rate calibration.
              </p>
            </div>
          </div>
        </section>

        {/* ── CHAPTER F: LAUNCH WORKBENCH / CALL TO ACTION ── */}
        <section id="chapter-f" style={{
          minHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '80px 24px',
          position: 'relative'
        }}>
          <div className="byotone-mono" style={{ fontSize: '0.8rem', color: '#6EE7B7', marginBottom: '20px', letterSpacing: '0.2em' }}>
            CHAPTER F • YOUR DIGITAL RETROFIT TWIN
          </div>

          <h2 className="byotone-title-huge" style={{ maxWidth: '960px', marginBottom: '24px' }}>
            READY TO SIMULATE YOUR ROOFTOP?
          </h2>

          <p style={{
            maxWidth: '620px',
            fontSize: '1.15rem',
            color: 'rgba(255, 255, 255, 0.72)',
            lineHeight: 1.65,
            marginBottom: '48px'
          }}>
            Input your building geometry, select your climate zone, and inspect the Pareto frontier in seconds.
            All runs are privately partitioned and exportable.
          </p>

          <button
            id="byotone-launch-workbench-cta"
            onClick={onEnterApp}
            className="byotone-btn-orbit"
            style={{
              padding: '14px 36px 14px 18px',
              fontSize: '0.92rem'
            }}
          >
            <div className="byotone-orbit-dot-ring" style={{ width: '34px', height: '34px' }}>
              <svg className="byotone-orbit-dot" width="24" height="24" viewBox="0 0 20 20">
                <circle cx="10" cy="3" r="2" fill="#6EE7B7" />
                <circle cx="16" cy="14" r="1.5" fill="#7DD3FC" />
                <circle cx="4" cy="14" r="1.5" fill="#FDE047" />
              </svg>
            </div>
            <span>LAUNCH ROOFWISE WORKBENCH</span>
          </button>

          <div className="byotone-mono" style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.4)', marginTop: '40px', letterSpacing: '0.12em' }}>
            FREE TO EXPLORE • ZERO REGISTRATION REQUIRED • CRYPTOGRAPHIC ISOLATION
          </div>
        </section>

      </main>
    </div>
  );
};
