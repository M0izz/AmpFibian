import React, { useState } from 'react';
import {
  ArrowRight,
  Sun,
  Droplets,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Building,
  TrendingDown,
  Award
} from 'lucide-react';

const CHAPTERS: Array<{ id: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'; label: string }> = [
  { id: 'A', label: 'Overview' },
  { id: 'B', label: 'How it works' },
  { id: 'C', label: 'Water' },
  { id: 'D', label: 'Packages' },
  { id: 'E', label: 'Compliance' },
  { id: 'F', label: 'Get started' }
];

const HERO_METRICS = [
  {
    icon: <Sun size={16} />,
    label: 'Thermal comfort',
    value: '-14.8 °C',
    color: 'var(--green-primary)',
    desc: 'Top-floor slab temperature drop during peak summer afternoons. Lowers HVAC power draw by up to 48%.'
  },
  {
    icon: <Droplets size={16} />,
    label: 'Water security',
    value: '58.4%',
    color: 'var(--water-blue)',
    desc: 'Non-potable domestic demand covered by on-site monsoon rainwater, reducing private tanker dependency.'
  },
  {
    icon: <DollarSign size={16} />,
    label: 'Financial return',
    value: '2.4 years',
    color: 'var(--amber-primary)',
    desc: 'Simple payback period from savings on municipal water and commercial electricity.'
  }
];

interface LandingPageProps {
  onEnterApp: () => void;
  onNavigateToAssessment?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onNavigateToAssessment: _onNavigateToAssessment }) => {
  const [activeChapter, setActiveChapter] = useState<'A' | 'B' | 'C' | 'D' | 'E' | 'F'>('A');
  const [activePreset, setActivePreset] = useState<'cool' | 'balanced' | 'solar'>('balanced');

  // Customer Interactive ROI & Value Simulator state
  const [roofArea, setRoofArea] = useState<number>(600); // m²
  const [monthlyPowerBill, setMonthlyPowerBill] = useState<number>(120000); // INR

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
      {/* Static ambient glow (replaces animated particles) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '0 0 auto 0',
          height: '720px',
          background: 'radial-gradient(ellipse 60% 55% at 50% 0%, rgba(62, 207, 142, 0.08), transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: '56px',
        padding: '0 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(9, 9, 11, 0.72)',
        backdropFilter: 'blur(14px) saturate(1.4)',
        borderBottom: '1px solid var(--border-default)'
      }}>
        <button
          onClick={() => scrollToChapter('A')}
          aria-label="Roofwise home"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '7px',
            background: 'var(--green-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--on-accent)',
            fontWeight: 700,
            fontSize: '0.85rem'
          }}>
            R
          </div>
          <span style={{ fontWeight: 600, fontSize: '0.98rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
            Roofwise
          </span>
        </button>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="landing-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '2px', marginRight: '8px' }}>
            {CHAPTERS.filter((ch) => ch.id !== 'A' && ch.id !== 'F').map((ch) => (
              <button
                key={ch.id}
                onClick={() => scrollToChapter(ch.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  color: activeChapter === ch.id ? 'var(--text-main)' : 'var(--text-muted)',
                  transition: 'color 0.15s ease'
                }}
              >
                {ch.label}
              </button>
            ))}
          </div>
          <button
            id="byotone-nav-workbench-btn"
            onClick={onEnterApp}
            className="btn btn-primary"
            style={{ padding: '7px 14px', fontSize: '0.82rem' }}
          >
            <span>Launch workbench</span>
            <ArrowRight size={14} />
          </button>
        </nav>
      </header>

      {/* ════════════════════════════════════════════════════════════════
          PRODUCT CHAPTERS (Customer-Centric & Actionable)
          ════════════════════════════════════════════════════════════════ */}
      <main style={{ position: 'relative', zIndex: 20, paddingTop: '56px', paddingBottom: '80px' }}>
        
        {/* ── CHAPTER A: HERO ── */}
        <section id="chapter-a" style={{
          minHeight: 'calc(100vh - 56px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '72px 24px 56px',
          position: 'relative'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 12px',
            borderRadius: '999px',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-default)',
            marginBottom: '28px',
            fontSize: '0.78rem',
            fontWeight: 500,
            color: 'var(--text-secondary)'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green-primary)' }} />
            Deterministic roof simulation · IS 15797 · NBC 2016
          </div>

          <h1 className="byotone-title-huge" style={{ maxWidth: '860px', marginBottom: '24px' }}>
            Cut top-floor heat and capture rainwater,{' '}
            <span style={{ color: 'var(--text-muted)' }}>with numbers you can audit.</span>
          </h1>

          <p style={{
            maxWidth: '620px',
            fontSize: '1.08rem',
            lineHeight: 1.65,
            color: 'var(--text-muted)',
            marginBottom: '36px'
          }}>
            Roofwise plans, simulates and optimizes cool-roof insulation and rainwater harvesting
            for your building, then shows the cost, savings and payback behind every recommendation.
          </p>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={onEnterApp}
              className="btn btn-primary"
              style={{ padding: '11px 22px', fontSize: '0.92rem' }}
            >
              <span>Launch workbench</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => scrollToChapter('B')}
              className="btn btn-secondary"
              style={{ padding: '11px 22px', fontSize: '0.92rem' }}
            >
              <span>How it works</span>
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
            maxWidth: '1040px',
            width: '100%',
            marginTop: '72px'
          }}>
            {HERO_METRICS.map((m) => (
              <div key={m.label} className="byotone-card" style={{ padding: '24px', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: m.color }}>
                  {m.icon}
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 500 }}>{m.label}</span>
                </div>
                <div style={{
                  fontSize: '2.25rem',
                  fontWeight: 600,
                  letterSpacing: '-0.035em',
                  lineHeight: 1,
                  marginBottom: '14px',
                  color: 'var(--text-main)'
                }}>
                  {m.value}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {m.desc}
                </div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: '16px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Illustrative figures. Run your own roof in the workbench for building-specific results.
          </p>
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
              <div className="byotone-mono" style={{ fontSize: '0.75rem', color: '#4FA3D9', fontWeight: 700, marginBottom: '8px' }}>
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
                    <span className="byotone-mono" style={{ color: '#4FA3D9', fontWeight: 700 }}>
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
                      accentColor: '#4FA3D9',
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
                    <span className="byotone-mono" style={{ color: '#3ECF8E', fontWeight: 700 }}>
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
                      accentColor: '#3ECF8E',
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
                    <div style={{ fontSize: '1.4rem', color: '#3ECF8E', fontWeight: 800, fontFamily: "var(--font-sans)" }}>
                      ₹ {annualCoolingSavings.toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      CLEAN WATER HARVESTED
                    </div>
                    <div style={{ fontSize: '1.4rem', color: '#4FA3D9', fontWeight: 800, fontFamily: "var(--font-sans)" }}>
                      {(annualWaterLiters / 1000).toFixed(0)} kL / yr
                    </div>
                  </div>

                  <div>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      WATER TANKERS SAVED
                    </div>
                    <div style={{ fontSize: '1.4rem', color: '#E5A23A', fontWeight: 800, fontFamily: "var(--font-sans)" }}>
                      {tankerTripsSaved} Trips
                    </div>
                  </div>

                  <div>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      ESTIMATED PAYBACK
                    </div>
                    <div style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 800, fontFamily: "var(--font-sans)" }}>
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
          <div className="byotone-mono" style={{ fontSize: '0.8rem', color: '#3ECF8E', marginBottom: '16px', letterSpacing: '0.15em', fontWeight: 700 }}>
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
                <span className="byotone-mono" style={{ fontSize: '0.75rem', color: '#3ECF8E', fontWeight: 700 }}>
                  3-LAYER SHIELD ARCHITECTURE
                </span>
                <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                  ASHRAE 90.1 COMPLIANT
                </span>
              </div>

              {/* Clean Product Architecture SVG */}
              <svg viewBox="0 0 400 230" width="100%" style={{ height: "auto", display: "block" }}>
                {/* Sun & reflected ray */}
                <circle cx="50" cy="25" r="16" fill="#E5A23A" opacity="0.85" />
                <line x1="66" y1="36" x2="180" y2="90" stroke="#E5A23A" strokeWidth="2.5" strokeDasharray="4 3" />
                
                {/* 85% Albedo Reflection */}
                <line x1="180" y1="90" x2="280" y2="30" stroke="#3ECF8E" strokeWidth="3" />
                <text x="290" y="32" fill="#3ECF8E" fontSize="11" fontWeight="bold" fontFamily="var(--font-sans)">
                  85% Solar Heat Reflected
                </text>

                {/* Layer 1: High-SRI Coating */}
                <rect x="40" y="90" width="320" height="14" rx="4" fill="#3ECF8E" />
                <text x="50" y="101" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="var(--font-sans)">
                  1. High-SRI Elastomeric Reflective Barrier (SRI 104)
                </text>

                {/* Layer 2: 50mm XPS Board */}
                <rect x="40" y="108" width="320" height="24" rx="4" fill="#4FA3D9" opacity="0.85" />
                <text x="50" y="124" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="var(--font-sans)">
                  2. 50mm XPS High-Density Insulation (R-Value 1.8 m²K/W)
                </text>

                {/* Layer 3: Waterproofing Membrane */}
                <rect x="40" y="136" width="320" height="10" rx="3" fill="#6366F1" opacity="0.75" />
                <text x="50" y="144" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="var(--font-sans)">
                  3. Polyurethane Waterproofing (Zero Seepage)
                </text>

                {/* Existing Concrete Slab */}
                <rect x="40" y="150" width="320" height="48" rx="4" fill="#334155" />
                <text x="50" y="178" fill="#CBD5E1" fontSize="10" fontWeight="600" fontFamily="var(--font-sans)">
                  Existing Reinforced Concrete (RCC) Slab
                </text>

                {/* Internal Comfort Indicator */}
                <text x="120" y="215" fill="#3ECF8E" fontSize="10" fontWeight="bold" fontFamily="var(--font-sans)">
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
                <span>Reflectance: <strong style={{ color: '#3ECF8E' }}>0.85 Albedo</strong></span>
              </div>
            </div>

            {/* Product Explanations */}
            <div>
              <h3 className="byotone-title-medium" style={{ marginBottom: '16px', color: '#FFFFFF' }}>
                Why Traditional Roofs Trap Excessive Heat
              </h3>
              <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '20px' }}>
                Exposed concrete acts as a massive thermal battery. Throughout the day, the slab absorbs solar irradiance,
                reaching up to <strong style={{ color: '#F0645F' }}>62°C</strong>. At night, it radiates that heat downwards into your rooms,
                forcing air conditioning units to run continuously at peak power.
              </p>

              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3ECF8E', fontWeight: 700, marginBottom: '6px' }}>
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
          <div className="byotone-mono" style={{ fontSize: '0.8rem', color: '#4FA3D9', marginBottom: '16px', letterSpacing: '0.15em', fontWeight: 700 }}>
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
            <div className="byotone-card" style={{ borderTop: '3px solid #4FA3D9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Droplets size={18} color="#4FA3D9" />
                <span className="byotone-mono" style={{ fontSize: '0.75rem', color: '#4FA3D9', fontWeight: 700 }}>
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

            <div className="byotone-card" style={{ borderTop: '3px solid #4FA3D9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <ShieldCheck size={18} color="#4FA3D9" />
                <span className="byotone-mono" style={{ fontSize: '0.75rem', color: '#4FA3D9', fontWeight: 700 }}>
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

            <div className="byotone-card" style={{ borderTop: '3px solid #3ECF8E' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <TrendingDown size={18} color="#3ECF8E" />
                <span className="byotone-mono" style={{ fontSize: '0.75rem', color: '#3ECF8E', fontWeight: 700 }}>
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
          <div className="byotone-mono" style={{ fontSize: '0.8rem', color: '#E5A23A', marginBottom: '16px', letterSpacing: '0.15em', fontWeight: 700 }}>
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
                    ? 'linear-gradient(135deg, #4FA3D9 0%, #3ECF8E 100%)'
                    : 'transparent',
                  color: activePreset === p.key ? '#FFFFFF' : 'var(--text-muted)',
                  fontFamily: "var(--font-sans)",
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
                    <div style={{ fontSize: '1.3rem', color: '#3ECF8E', fontWeight: 800 }}>₹ 2,40,000</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px' }}>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>HEAT REDUCTION</div>
                    <div style={{ fontSize: '1.3rem', color: '#4FA3D9', fontWeight: 800 }}>-11.2 °C</div>
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
                    <div style={{ fontSize: '1.3rem', color: '#3ECF8E', fontWeight: 800 }}>₹ 6,85,000</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px' }}>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>WATER INDEPENDENCE</div>
                    <div style={{ fontSize: '1.3rem', color: '#4FA3D9', fontWeight: 800 }}>58.4 %</div>
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
                    <div style={{ fontSize: '1.3rem', color: '#3ECF8E', fontWeight: 800 }}>₹ 14,20,000</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px' }}>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>ANNUAL POWER GENERATION</div>
                    <div style={{ fontSize: '1.3rem', color: '#4FA3D9', fontWeight: 800 }}>38,500 kWh</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px' }}>
                    <div className="byotone-mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>DEAD LOAD CHANGE</div>
                    <div style={{ fontSize: '1.3rem', color: '#E5A23A', fontWeight: 800 }}>+32 kg/m²</div>
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
          <div className="byotone-mono" style={{ fontSize: '0.8rem', color: '#3ECF8E', marginBottom: '16px', letterSpacing: '0.15em', fontWeight: 700 }}>
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
                <Award size={18} color="#3ECF8E" />
                <span className="byotone-mono" style={{ fontSize: '0.72rem', color: '#3ECF8E', fontWeight: 700 }}>
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
                <Building size={18} color="#4FA3D9" />
                <span className="byotone-mono" style={{ fontSize: '0.72rem', color: '#4FA3D9', fontWeight: 700 }}>
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
                <ShieldCheck size={18} color="#3ECF8E" />
                <span className="byotone-mono" style={{ fontSize: '0.72rem', color: '#3ECF8E', fontWeight: 700 }}>
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
                <DollarSign size={18} color="#E5A23A" />
                <span className="byotone-mono" style={{ fontSize: '0.72rem', color: '#E5A23A', fontWeight: 700 }}>
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
          <div className="byotone-mono" style={{ fontSize: '0.8rem', color: '#4FA3D9', marginBottom: '16px', letterSpacing: '0.15em', fontWeight: 700 }}>
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
