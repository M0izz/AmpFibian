import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Sun,
  Droplets,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  VolumeX,
  Sparkles,
  Building,
  TrendingDown,
  Award
} from 'lucide-react';

const CHAPTERS: Array<{ id: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'; label: string }> = [
  { id: 'A', label: 'OVERVIEW' },
  { id: 'B', label: 'COOL ROOF' },
  { id: 'C', label: 'WATER SAVINGS' },
  { id: 'D', label: 'PACKAGES' },
  { id: 'E', label: 'COMPLIANCE' },
  { id: 'F', label: 'START' }
];

interface LandingPageProps {
  onEnterApp: () => void;
  onNavigateToAssessment?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onNavigateToAssessment: _onNavigateToAssessment }) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [activeChapter, setActiveChapter] = useState<'A' | 'B' | 'C' | 'D' | 'E' | 'F'>('A');
  const [activePreset, setActivePreset] = useState<'cool' | 'balanced' | 'solar'>('balanced');

  // Customer Interactive ROI & Value Simulator state
  const [roofArea, setRoofArea] = useState<number>(600); // m²
  const [monthlyPowerBill, setMonthlyPowerBill] = useState<number>(120000); // INR

  // Canvas ref for celestial particle ring (harmonious blue & green)
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

    const PARTICLE_COUNT = 380;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radiusBase = 220 + Math.random() * 260;
      return {
        angle,
        speed: (0.0012 + Math.random() * 0.0018) * (Math.random() > 0.5 ? 1 : -1),
        radiusBase,
        radiusJitter: (Math.random() - 0.5) * 40,
        size: 0.9 + Math.random() * 1.8,
        alpha: 0.2 + Math.random() * 0.65,
        isBlue: Math.random() > 0.5
      };
    });

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Ambient radial biophilic glow: Blue & Green
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        120,
        centerX,
        centerY,
        460
      );
      glowGrad.addColorStop(0, 'rgba(14, 165, 233, 0.03)');
      glowGrad.addColorStop(0.4, 'rgba(16, 185, 129, 0.03)');
      glowGrad.addColorStop(1, 'rgba(10, 14, 23, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 480, 0, Math.PI * 2);
      ctx.fill();

      // Render living particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.angle += p.speed;

        const currentRadius = p.radiusBase + p.radiusJitter + Math.sin(frame * 0.01 + i) * 10;
        const x = centerX + Math.cos(p.angle) * currentRadius * 1.15;
        const y = centerY + Math.sin(p.angle) * currentRadius * 0.72;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);

        // Harmonious pairing: Vibrant Azure (#38BDF8) & Emerald Mint (#34D399)
        ctx.fillStyle = p.isBlue
          ? `rgba(56, 189, 248, ${p.alpha})`
          : `rgba(52, 211, 153, ${p.alpha})`;

        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Audio synthesis for Byotone ambient frequency
  const toggleSound = () => {
    if (!soundEnabled) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(128, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 2);

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
        gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.5);
        setTimeout(() => {
          oscillatorRef.current?.stop();
          audioCtxRef.current?.close();
        }, 500);
      }
      setSoundEnabled(false);
    }
  };

  const scrollToChapter = (chapter: 'A' | 'B' | 'C' | 'D' | 'E' | 'F') => {
    setActiveChapter(chapter);
    const el = document.getElementById(`chapter-${chapter.toLowerCase()}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Dynamic customer savings calculation
  const annualCoolingSavings = Math.round(monthlyPowerBill * 12 * 0.22); // 22% overall building cooling energy cut
  const annualWaterLiters = Math.round(roofArea * 1350 * 0.88); // 1350mm rainfall, 0.88 runoff C
  const tankerTripsSaved = Math.round(annualWaterLiters / 10000); // 10,000L per private tanker
  const estimatedCapex = Math.round(roofArea * 1150); // ~₹1150/m² for turnkey cool roof + RWH
  const paybackYears = (estimatedCapex / (annualCoolingSavings + (tankerTripsSaved * 1800))).toFixed(1);

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
          opacity: 0.85
        }}
      />

      {/* ════════════════════════════════════════════════════════════════
          PERSISTENT FIXED HEADER (Harmonious Azure & Emerald)
          ════════════════════════════════════════════════════════════════ */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '16px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(180deg, rgba(10, 14, 23, 0.95) 0%, rgba(10, 14, 23, 0) 100%)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        {/* Brand Mark with Blue/Green Gradient */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '1.1rem',
            boxShadow: '0 2px 12px rgba(16, 185, 129, 0.3)'
          }}>
            R
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: '1.2rem',
                letterSpacing: '-0.02em',
                color: '#FFFFFF'
              }}>
                Roofwise
              </span>
              <span className="byotone-mono" style={{
                fontSize: '0.65rem',
                color: '#34D399',
                padding: '2px 6px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '6px',
                fontWeight: 700
              }}>
                v1.2 PRO
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1 }}>
              Thermal & Rainwater Retrofit Twins
            </div>
          </div>
        </div>

        {/* Chapter Progress Nav Bar */}
        <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="byotone-chapter-nav">
              {CHAPTERS.map((ch) => {
                const isActive = activeChapter === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => scrollToChapter(ch.id)}
                    className={`byotone-chapter-node ${isActive ? 'active' : ''}`}
                    style={{
                      borderColor: isActive ? '#10B981' : 'rgba(255, 255, 255, 0.18)',
                      background: isActive ? 'linear-gradient(135deg, #0EA5E9, #10B981)' : '#111827',
                      color: isActive ? '#FFFFFF' : 'var(--text-muted)'
                    }}
                    aria-label={`Jump to ${ch.label}`}
                  >
                    <span>{ch.id}</span>
                  </button>
                );
              })}
            </div>

            {/* Clean Inline Active Chapter Badge (Zero Overlap) */}
            <div style={{
              fontSize: '0.74rem',
              color: '#38BDF8',
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              background: 'rgba(14, 165, 233, 0.1)',
              border: '1px solid rgba(14, 165, 233, 0.25)',
              padding: '4px 10px',
              borderRadius: '6px',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap'
            }}>
              {CHAPTERS.find(c => c.id === activeChapter)?.label}
            </div>
          </div>

          <div style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.12)', margin: '0 4px' }} />

          <button
            id="byotone-nav-workbench-btn"
            onClick={onEnterApp}
            className="btn btn-primary"
            style={{
              padding: '8px 20px',
              fontSize: '0.82rem',
              borderRadius: '999px'
            }}
          >
            <span>LAUNCH WORKBENCH</span>
            <ArrowRight size={14} />
          </button>
        </nav>
      </header>

      {/* ════════════════════════════════════════════════════════════════
          PERSISTENT LIVE BOTTOM TELEMETRY BAR
          ════════════════════════════════════════════════════════════════ */}
      <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '12px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(0deg, rgba(10, 14, 23, 0.98) 0%, rgba(10, 14, 23, 0.85) 100%)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {/* Left: Product Trust Signature */}
        <div className="byotone-mono" style={{
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ color: '#38BDF8', fontWeight: 600 }}>CLIMATEFIT ENGINE</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
          <span>DETERMINISTIC MASS & ENERGY BALANCE</span>
          <span style={{ color: '#10B981' }}>⇄</span>
          <span>NBC 2016 & IS 15797</span>
        </div>

        {/* Right: Quick Value Readout & Audio Control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="byotone-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', gap: '14px' }}>
            <span>TOP-FLOOR HEAT: <strong style={{ color: '#34D399' }}>-14.8°C</strong></span>
            <span>RAIN HARVEST: <strong style={{ color: '#38BDF8' }}>58.4% COVERAGE</strong></span>
          </div>

          <button
            onClick={toggleSound}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '999px',
              padding: '4px 12px',
              color: soundEnabled ? '#34D399' : 'var(--text-dim)',
              cursor: 'pointer',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem'
            }}
          >
            {soundEnabled ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '14px' }}>
                <span className="byotone-wave-bar-1" style={{ width: '2px', background: '#38BDF8', borderRadius: '1px' }} />
                <span className="byotone-wave-bar-2" style={{ width: '2px', background: '#34D399', borderRadius: '1px' }} />
                <span className="byotone-wave-bar-3" style={{ width: '2px', background: '#38BDF8', borderRadius: '1px' }} />
                <span className="byotone-wave-bar-4" style={{ width: '2px', background: '#34D399', borderRadius: '1px' }} />
              </div>
            ) : (
              <VolumeX size={12} />
            )}
            <span>{soundEnabled ? 'AMBIENT AUDIO ON' : 'MUTE'}</span>
          </button>
        </div>
      </footer>

      {/* ════════════════════════════════════════════════════════════════
          PRODUCT CHAPTERS (Customer-Centric & Actionable)
          ════════════════════════════════════════════════════════════════ */}
      <main style={{ position: 'relative', zIndex: 20, paddingTop: '90px', paddingBottom: '110px' }}>
        
        {/* ── CHAPTER A: HERO & THE VALUE PROPOSITION ── */}
        <section id="chapter-a" style={{
          minHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '40px 24px',
          position: 'relative'
        }}>
          {/* Blue-Green Header Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(16, 185, 129, 0.12) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            marginBottom: '24px'
          }}>
            <Sparkles size={14} color="#38BDF8" />
            <span className="byotone-mono" style={{ fontSize: '0.75rem', color: '#F8FAFC', fontWeight: 600 }}>
              AI-FREE DETERMINISTIC ROOF SIMULATION
            </span>
          </div>

          <h1 className="byotone-title-huge" style={{ maxWidth: '980px', marginBottom: '24px' }}>
            STOP LOSING COOLING TO <br />
            <span className="byotone-gradient-text">SCORCHING ROOFS.</span>
          </h1>

          <p style={{
            maxWidth: '680px',
            fontSize: '1.18rem',
            lineHeight: 1.65,
            color: 'var(--text-muted)',
            marginBottom: '40px'
          }}>
            Roofwise plans, simulates, and optimizes turnkey cool-roof insulation and rainwater harvesting systems.
            Protect top-floor tenants from 62°C concrete heat and capture clean water—with audited financial payback.
          </p>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={onEnterApp}
              className="btn btn-primary"
              style={{
                padding: '12px 32px',
                fontSize: '0.95rem',
                borderRadius: '999px'
              }}
            >
              <span>LAUNCH SIMULATION WORKBENCH</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => scrollToChapter('B')}
              className="btn btn-secondary"
              style={{
                padding: '12px 28px',
                fontSize: '0.92rem',
                borderRadius: '999px'
              }}
            >
              <span>EXPLORE PRODUCT FEATURES</span>
            </button>
          </div>

          {/* 3 Core Value Metric Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            maxWidth: '1040px',
            width: '100%',
            marginTop: '70px'
          }}>
            <div className="byotone-card" style={{ padding: '28px', textAlign: 'left', borderLeft: '3px solid #10B981' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
                  <Sun size={20} />
                </div>
                <div className="byotone-mono" style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 700 }}>
                  THERMAL COMFORT
                </div>
              </div>
              <div className="byotone-title-big" style={{ color: '#FFFFFF', marginBottom: '8px' }}>
                -14.8 °C
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                Top-floor slab temperature drop during peak summer afternoons. Lowers HVAC power draw by up to 48%.
              </div>
            </div>

            <div className="byotone-card" style={{ padding: '28px', textAlign: 'left', borderLeft: '3px solid #0EA5E9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(14, 165, 233, 0.15)', color: '#38BDF8' }}>
                  <Droplets size={20} />
                </div>
                <div className="byotone-mono" style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: 700 }}>
                  WATER SECURITY
                </div>
              </div>
              <div className="byotone-title-big" style={{ color: '#FFFFFF', marginBottom: '8px' }}>
                58.4 %
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                Non-potable domestic demand covered entirely by on-site monsoon rainwater, ending private tanker dependency.
              </div>
            </div>

            <div className="byotone-card" style={{ padding: '28px', textAlign: 'left', borderLeft: '3px solid #F59E0B' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24' }}>
                  <DollarSign size={20} />
                </div>
                <div className="byotone-mono" style={{ fontSize: '0.75rem', color: '#FBBF24', fontWeight: 700 }}>
                  FINANCIAL ROI
                </div>
              </div>
              <div className="byotone-title-big" style={{ color: '#FFFFFF', marginBottom: '8px' }}>
                2.4 Years
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                Simple payback period. Generates verifiable cash savings on municipal water and commercial electric utilities.
              </div>
            </div>
          </div>
        </section>

        {/* ── INTERACTIVE CUSTOMER VALUE SIMULATOR ── */}
        <section style={{
          padding: '60px 24px',
          maxWidth: '1100px',
          margin: '0 auto',
          position: 'relative'
        }}>
          <div className="byotone-card" style={{
            padding: '40px',
            background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.85) 0%, rgba(15, 23, 42, 0.85) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div className="byotone-mono" style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: 700, marginBottom: '8px' }}>
                INTERACTIVE RETROFIT CALCULATOR
              </div>
              <h2 className="byotone-title-big">
                ESTIMATE YOUR BUILDING'S <span className="byotone-gradient-text">SAVINGS</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
                Slide your roof area and current electricity costs to see instant climate & utility impact.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '40px',
              alignItems: 'center'
            }}>
              {/* Sliders Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      Roof Surface Area:
                    </span>
                    <span className="byotone-mono" style={{ color: '#38BDF8', fontWeight: 700 }}>
                      {roofArea} m² ({(roofArea * 10.76).toLocaleString()} sq ft)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="3000"
                    step="50"
                    value={roofArea}
                    onChange={(e) => setRoofArea(Number(e.target.value))}
                    style={{
                      width: '100%',
                      accentColor: '#0EA5E9',
                      cursor: 'pointer'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    <span>200 m² (Small Villa / Hostel)</span>
                    <span>3,000 m² (Commercial Campus)</span>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      Monthly Electricity Bill:
                    </span>
                    <span className="byotone-mono" style={{ color: '#34D399', fontWeight: 700 }}>
                      ₹ {monthlyPowerBill.toLocaleString()} / mo
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30000"
                    max="500000"
                    step="10000"
                    value={monthlyPowerBill}
                    onChange={(e) => setMonthlyPowerBill(Number(e.target.value))}
                    style={{
                      width: '100%',
                      accentColor: '#10B981',
                      cursor: 'pointer'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    <span>₹ 30,000</span>
                    <span>₹ 5,00,000</span>
                  </div>
                </div>
              </div>

              {/* Instant Output Display */}
              <div style={{
                background: 'rgba(10, 14, 23, 0.7)',
                padding: '28px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '24px' }}>
                  <div>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      ESTIMATED ANNUAL POWER SAVED
                    </div>
                    <div style={{ fontSize: '1.4rem', color: '#34D399', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
                      ₹ {annualCoolingSavings.toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      CLEAN WATER HARVESTED
                    </div>
                    <div style={{ fontSize: '1.4rem', color: '#38BDF8', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
                      {(annualWaterLiters / 1000).toFixed(0)} kL / yr
                    </div>
                  </div>

                  <div>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      WATER TANKERS SAVED
                    </div>
                    <div style={{ fontSize: '1.4rem', color: '#FBBF24', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
                      {tankerTripsSaved} Trips
                    </div>
                  </div>

                  <div>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      ESTIMATED PAYBACK
                    </div>
                    <div style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
                      {paybackYears} Years
                    </div>
                  </div>
                </div>

                <button
                  onClick={onEnterApp}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    fontSize: '0.9rem'
                  }}
                >
                  <span>RUN FULL SIMULATION FOR THIS BUILDING</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── CHAPTER B: HOW THE COOL ROOF WORKS (PRODUCT CLARITY) ── */}
        <section id="chapter-b" style={{
          minHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px 24px',
          position: 'relative'
        }}>
          <div className="byotone-mono" style={{ fontSize: '0.8rem', color: '#34D399', marginBottom: '16px', letterSpacing: '0.15em', fontWeight: 700 }}>
            CHAPTER B • THERMAL ATTENUATION SHIELD
          </div>

          <h2 className="byotone-title-huge" style={{ maxWidth: '960px', textAlign: 'center', marginBottom: '28px' }}>
            KEEP TOP FLOORS NATURALLY COOL. <br />
            <span className="byotone-gradient-green">STOP SLAB SUPERHEATING.</span>
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
            <div className="byotone-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <span className="byotone-mono" style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 700 }}>
                  3-LAYER SHIELD ARCHITECTURE
                </span>
                <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                  ASHRAE 90.1 COMPLIANT
                </span>
              </div>

              {/* Clean Product Architecture SVG */}
              <svg viewBox="0 0 400 230" width="100%" height="auto">
                {/* Sun & reflected ray */}
                <circle cx="50" cy="25" r="16" fill="#F59E0B" opacity="0.85" />
                <line x1="66" y1="36" x2="180" y2="90" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="4 3" />
                
                {/* 85% Albedo Reflection */}
                <line x1="180" y1="90" x2="280" y2="30" stroke="#34D399" strokeWidth="3" />
                <text x="290" y="32" fill="#34D399" fontSize="11" fontWeight="bold" fontFamily="'Plus Jakarta Sans', sans-serif">
                  85% Solar Heat Reflected
                </text>

                {/* Layer 1: High-SRI Coating */}
                <rect x="40" y="90" width="320" height="14" rx="4" fill="#10B981" />
                <text x="50" y="101" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="'Plus Jakarta Sans', sans-serif">
                  1. High-SRI Elastomeric Reflective Barrier (SRI 104)
                </text>

                {/* Layer 2: 50mm XPS Board */}
                <rect x="40" y="108" width="320" height="24" rx="4" fill="#0EA5E9" opacity="0.85" />
                <text x="50" y="124" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="'Plus Jakarta Sans', sans-serif">
                  2. 50mm XPS High-Density Insulation (R-Value 1.8 m²K/W)
                </text>

                {/* Layer 3: Waterproofing Membrane */}
                <rect x="40" y="136" width="320" height="10" rx="3" fill="#6366F1" opacity="0.75" />
                <text x="50" y="144" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="'Plus Jakarta Sans', sans-serif">
                  3. Polyurethane Waterproofing (Zero Seepage)
                </text>

                {/* Existing Concrete Slab */}
                <rect x="40" y="150" width="320" height="48" rx="4" fill="#334155" />
                <text x="50" y="178" fill="#CBD5E1" fontSize="10" fontWeight="600" fontFamily="'Plus Jakarta Sans', sans-serif">
                  Existing Reinforced Concrete (RCC) Slab
                </text>

                {/* Internal Comfort Indicator */}
                <text x="120" y="215" fill="#34D399" fontSize="10" fontWeight="bold" fontFamily="'Plus Jakarta Sans', sans-serif">
                  ✓ Occupied Rooms Below Stay 6–9°C Cooler
                </text>
              </svg>

              <div style={{
                marginTop: '18px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.82rem',
                color: 'var(--text-muted)'
              }}>
                <span>Overall Slab U-Value: <strong style={{ color: '#FFFFFF' }}>0.48 W/m²K</strong></span>
                <span>Reflectance: <strong style={{ color: '#34D399' }}>0.85 Albedo</strong></span>
              </div>
            </div>

            {/* Product Explanations */}
            <div>
              <h3 className="byotone-title-medium" style={{ marginBottom: '16px', color: '#FFFFFF' }}>
                Why Traditional Roofs Trap Excessive Heat
              </h3>
              <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '20px' }}>
                Exposed concrete acts as a massive thermal battery. Throughout the day, the slab absorbs solar irradiance,
                reaching up to <strong style={{ color: '#F87171' }}>62°C</strong>. At night, it radiates that heat downwards into your rooms,
                forcing air conditioning units to run continuously at peak power.
              </p>

              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34D399', fontWeight: 700, marginBottom: '6px' }}>
                  <CheckCircle2 size={16} />
                  <span>The Roofwise Solution</span>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  By deflecting 85% of solar rays at the surface and blocking heat conduction with XPS insulation,
                  indoor temperatures stabilize immediately without requiring costly roof demolition.
                </p>
              </div>

              <button
                onClick={() => scrollToChapter('C')}
                className="btn btn-secondary"
                style={{ borderRadius: '999px', padding: '10px 24px' }}
              >
                <span>SEE WATER HARVESTING BENEFITS</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* ── CHAPTER C: MONSOON RAINWATER HARVESTING ── */}
        <section id="chapter-c" style={{
          minHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px 24px',
          position: 'relative'
        }}>
          <div className="byotone-mono" style={{ fontSize: '0.8rem', color: '#38BDF8', marginBottom: '16px', letterSpacing: '0.15em', fontWeight: 700 }}>
            CHAPTER C • MONSOON WATER SECURITY
          </div>

          <h2 className="byotone-title-huge" style={{ maxWidth: '980px', textAlign: 'center', marginBottom: '24px' }}>
            ELIMINATE RELIANCE ON <br />
            <span className="byotone-gradient-blue">PRIVATE WATER TANKERS.</span>
          </h2>

          <p style={{
            maxWidth: '680px',
            fontSize: '1.08rem',
            textAlign: 'center',
            color: 'var(--text-muted)',
            lineHeight: 1.65,
            marginBottom: '44px'
          }}>
            Tropical monsoons dump hundreds of thousands of liters of free water on your rooftop.
            Roofwise engineers precision storage arrays and first-flush diverters to supply non-potable needs all year round.
          </p>

          <div style={{
            maxWidth: '1060px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            <div className="byotone-card" style={{ borderTop: '3px solid #0EA5E9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Droplets size={18} color="#38BDF8" />
                <span className="byotone-mono" style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: 700 }}>
                  90% CAPTURE EFFICIENCY
                </span>
              </div>
              <div className="byotone-title-big" style={{ color: '#FFFFFF', marginBottom: '8px' }}>
                Runoff C = 0.90
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Smooth elastomeric surfaces minimize puddle retention and maximize clean water yield directly into your cisterns.
              </p>
            </div>

            <div className="byotone-card" style={{ borderTop: '3px solid #0EA5E9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <ShieldCheck size={18} color="#38BDF8" />
                <span className="byotone-mono" style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: 700 }}>
                  AUTOMATIC PURITY
                </span>
              </div>
              <div className="byotone-title-big" style={{ color: '#FFFFFF', marginBottom: '8px' }}>
                First-Flush Diverter
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Initial airborne dust and leaves are automatically diverted before collection begins, maintaining clean, clear water.
              </p>
            </div>

            <div className="byotone-card" style={{ borderTop: '3px solid #10B981' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <TrendingDown size={18} color="#34D399" />
                <span className="byotone-mono" style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 700 }}>
                  ZERO TANKER SHORTAGES
                </span>
              </div>
              <div className="byotone-title-big" style={{ color: '#FFFFFF', marginBottom: '8px' }}>
                58% Domestic Offset
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Guarantees continuous supply for toilet flushing, HVAC chiller towers, and garden maintenance across dry spells.
              </p>
            </div>
          </div>

          <div style={{ marginTop: '40px' }}>
            <button
              onClick={() => scrollToChapter('D')}
              className="btn btn-secondary"
              style={{ borderRadius: '999px', padding: '10px 24px' }}
            >
              <span>COMPARE RETROFIT PACKAGES</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </section>

        {/* ── CHAPTER D: RETROFIT OPTIONS & PACKAGES ── */}
        <section id="chapter-d" style={{
          minHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px 24px',
          position: 'relative'
        }}>
          <div className="byotone-mono" style={{ fontSize: '0.8rem', color: '#F59E0B', marginBottom: '16px', letterSpacing: '0.15em', fontWeight: 700 }}>
            CHAPTER D • TAILORED PACKAGES
          </div>

          <h2 className="byotone-title-huge" style={{ maxWidth: '980px', textAlign: 'center', marginBottom: '28px' }}>
            CHOOSE THE PACKAGE FOR <br />
            <span className="byotone-gradient-text">YOUR BUDGET & PRIORITIES</span>
          </h2>

          {/* Interactive Preset Buttons */}
          <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '32px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '6px',
            borderRadius: '999px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {[
              { key: 'cool', label: 'OPTION 1: COOL ROOF PIONEER' },
              { key: 'balanced', label: 'OPTION 2: CLIMATEFIT BALANCED (RECOMMENDED)' },
              { key: 'solar', label: 'OPTION 3: SOLAR PV + RWH' }
            ].map((p) => (
              <button
                key={p.key}
                onClick={() => setActivePreset(p.key as 'cool' | 'balanced' | 'solar')}
                style={{
                  padding: '10px 22px',
                  borderRadius: '999px',
                  border: 'none',
                  background: activePreset === p.key
                    ? 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)'
                    : 'transparent',
                  color: activePreset === p.key ? '#FFFFFF' : 'var(--text-muted)',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Deep-Dive Package Card */}
          <div className="byotone-card" style={{ maxWidth: '920px', width: '100%', padding: '36px' }}>
            {activePreset === 'cool' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 className="byotone-title-medium" style={{ color: '#FFFFFF' }}>Cool Roof Pioneer</h3>
                  <span className="badge badge-green">FASTEST PAYBACK (2.4 YRS)</span>
                </div>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
                  High-albedo elastomeric coating applied directly over cleaned existing waterproofing.
                  Ideal for buildings seeking the lowest upfront capital and fastest temperature drop without plumbing changes.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px' }}>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>ESTIMATED COST</div>
                    <div style={{ fontSize: '1.3rem', color: '#34D399', fontWeight: 800 }}>₹ 2,40,000</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px' }}>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>HEAT REDUCTION</div>
                    <div style={{ fontSize: '1.3rem', color: '#38BDF8', fontWeight: 800 }}>-11.2 °C</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px' }}>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>INSTALLATION DURATION</div>
                    <div style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 800 }}>4 Days</div>
                  </div>
                </div>
              </div>
            )}

            {activePreset === 'balanced' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 className="byotone-title-medium" style={{ color: '#FFFFFF' }}>ClimateFit Balanced</h3>
                  <span className="badge badge-blue">RECOMMENDED SWEET SPOT</span>
                </div>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
                  The gold standard combination: 50mm XPS under-deck insulation, high-albedo topcoat, and a 20 kL modular rainwater tank array.
                  Maximizes utility savings on both power and water while staying safely within structural load limits.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px' }}>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>ESTIMATED COST</div>
                    <div style={{ fontSize: '1.3rem', color: '#34D399', fontWeight: 800 }}>₹ 6,85,000</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px' }}>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>WATER INDEPENDENCE</div>
                    <div style={{ fontSize: '1.3rem', color: '#38BDF8', fontWeight: 800 }}>58.4 %</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px' }}>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>HEAT REDUCTION</div>
                    <div style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 800 }}>-14.8 °C</div>
                  </div>
                </div>
              </div>
            )}

            {activePreset === 'solar' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 className="byotone-title-medium" style={{ color: '#FFFFFF' }}>Solar PV + Micro-RWH</h3>
                  <span className="badge badge-amber">ENERGY INTENSIVE</span>
                </div>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
                  Elevated solar canopy generating on-site solar electricity, providing roof shade, and channeling downspouts into rainwater filters.
                  Best for buildings with dedicated energy transition budgets.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px' }}>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>ESTIMATED COST</div>
                    <div style={{ fontSize: '1.3rem', color: '#34D399', fontWeight: 800 }}>₹ 14,20,000</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px' }}>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>ANNUAL POWER GENERATION</div>
                    <div style={{ fontSize: '1.3rem', color: '#38BDF8', fontWeight: 800 }}>38,500 kWh</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px' }}>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>DEAD LOAD CHANGE</div>
                    <div style={{ fontSize: '1.3rem', color: '#FBBF24', fontWeight: 800 }}>+32 kg/m²</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── CHAPTER E: STANDARDS & AUDIT COMPLIANCE ── */}
        <section id="chapter-e" style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px 24px',
          position: 'relative'
        }}>
          <div className="byotone-mono" style={{ fontSize: '0.8rem', color: '#34D399', marginBottom: '16px', letterSpacing: '0.15em', fontWeight: 700 }}>
            CHAPTER E • AUDIT-READY COMPLIANCE
          </div>

          <h2 className="byotone-title-huge" style={{ maxWidth: '980px', textAlign: 'center', marginBottom: '32px' }}>
            TRUSTED FOR MUNICIPAL & GREEN APPROVALS
          </h2>

          <div style={{
            maxWidth: '1060px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px'
          }}>
            <div className="byotone-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Award size={18} color="#34D399" />
                <span className="byotone-mono" style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 700 }}>
                  IS 15797:2008
                </span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                Rainwater Standards
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Certified storage tank sizing, first-flush diverter volume, and filtration media compliance for building permits.
              </p>
            </div>

            <div className="byotone-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Building size={18} color="#38BDF8" />
                <span className="byotone-mono" style={{ fontSize: '0.72rem', color: '#38BDF8', fontWeight: 700 }}>
                  NBC 2016 PART 8
                </span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                National Building Code
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Guaranteed thermal envelope insulation, structural dead-load boundaries, and energy conservation code adherence.
              </p>
            </div>

            <div className="byotone-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <ShieldCheck size={18} color="#34D399" />
                <span className="byotone-mono" style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 700 }}>
                  GRIHA & IGBC
                </span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                Green Building Points
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Earn direct points for Heat Island Reduction (roof category) and on-site water harvesting credits.
              </p>
            </div>

            <div className="byotone-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <DollarSign size={18} color="#FBBF24" />
                <span className="byotone-mono" style={{ fontSize: '0.72rem', color: '#FBBF24', fontWeight: 700 }}>
                  CPWD SSR 2023
                </span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                Schedule of Rates
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                All contractor cost estimates are calibrated against government Schedule of Rates for material and labor honesty.
              </p>
            </div>
          </div>
        </section>

        {/* ── CHAPTER F: READY TO LAUNCH WORKBENCH ── */}
        <section id="chapter-f" style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '60px 24px',
          position: 'relative'
        }}>
          <div className="byotone-mono" style={{ fontSize: '0.8rem', color: '#38BDF8', marginBottom: '16px', letterSpacing: '0.15em', fontWeight: 700 }}>
            CHAPTER F • DIGITAL RETROFIT TWIN
          </div>

          <h2 className="byotone-title-huge" style={{ maxWidth: '920px', marginBottom: '20px' }}>
            READY TO SIMULATE YOUR ROOF?
          </h2>

          <p style={{
            maxWidth: '600px',
            fontSize: '1.12rem',
            color: 'var(--text-muted)',
            lineHeight: 1.65,
            marginBottom: '40px'
          }}>
            Input your building dimensions, select your climate zone, and view Pareto-optimal retrofit packages in seconds.
          </p>

          <button
            id="byotone-launch-workbench-cta"
            onClick={onEnterApp}
            className="btn btn-primary"
            style={{
              padding: '16px 40px',
              fontSize: '1.05rem',
              borderRadius: '999px',
              boxShadow: '0 8px 30px rgba(16, 185, 129, 0.35)'
            }}
          >
            <span>LAUNCH ROOFWISE WORKBENCH NOW</span>
            <ArrowRight size={18} />
          </button>

          <div className="byotone-mono" style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '36px', letterSpacing: '0.1em' }}>
            NO SIGN-UP REQUIRED • INSTANT CLIENT-SIDE SIMULATION • PRIVATE ANONYMOUS SESSIONS
          </div>
        </section>

      </main>
    </div>
  );
};
