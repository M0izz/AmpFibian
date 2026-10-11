import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Droplets,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Award,
  Zap,
  BarChart3,
  Layers,
  ChevronDown,
  Check
} from 'lucide-react';

const STATS = [
  { value: '−14.8°C', label: 'Peak Roof Surface Cooling', color: 'var(--green-primary)', sub: 'Eliminates peak afternoon solar heat gain' },
  { value: '58.4%', label: 'Non-Potable Water Met On-Site', color: 'var(--water-blue)', sub: 'Cuts costly private water tanker deliveries' },
  { value: '₹4.2L / yr', label: 'Average Utility Bill Savings', color: 'var(--amber-primary)', sub: 'Combined power & commercial water savings' },
  { value: '2.4 yrs', label: 'Simple Capital Payback', color: 'var(--green-primary)', sub: 'Calibrated with CPWD schedule of rates' },
];

const WORKFLOW_STEPS = [
  { 
    step: '01', 
    title: 'Input Building Profile', 
    desc: 'Enter rooftop area, occupant count, and structural parameters — or start with verified institutional presets.', 
    icon: Building2 
  },
  { 
    step: '02', 
    title: 'Deterministic Simulation', 
    desc: 'Our engine runs 365-day hourly heat flux conduction and rainfall mass-balance directly in your browser.', 
    icon: BarChart3 
  },
  { 
    step: '03', 
    title: 'Pareto-Optimal Packages', 
    desc: 'Review cost-screened options, complete bill of quantities, payback timelines, and audit-ready reports.', 
    icon: Layers 
  },
];

const PACKAGES = [
  {
    id: 'cool',
    tag: 'Heat-First Focus',
    name: 'High-Albedo Cool Coating',
    desc: 'Elastomeric SRI 104 cool roof coating. Rapid low-capex intervention with immediate indoor comfort improvement.',
    cost: '₹4,80,000',
    heatCut: '−14.8°C',
    waterReliability: '22%',
    payback: '1.4 yrs',
    color: 'var(--green-primary)',
    bg: 'var(--green-light)',
    border: 'var(--green-border)',
    features: ['Rapid 3-day roll-on installation', 'Immediate top-floor HVAC load cut', 'Zero structural dead-load addition']
  },
  {
    id: 'balanced',
    tag: 'Recommended · Pareto Knee',
    name: 'Cool Coat + 50kL RWH Tank Array',
    desc: 'Cool coating paired with ground-level modular rainwater harvesting tanks. The optimal multi-objective balance.',
    cost: '₹9,20,000',
    heatCut: '−14.8°C',
    waterReliability: '58.4%',
    payback: '2.4 yrs',
    color: 'var(--water-blue)',
    bg: 'var(--water-light)',
    border: 'var(--water-border)',
    isPopular: true,
    features: ['58% annual non-potable coverage', '48% top-floor slab conduction cut', 'Ground tanks avoid roof structural strain']
  },
  {
    id: 'solar',
    tag: 'Clean Energy Focus',
    name: 'Elevated Solar Canopy + RWH',
    desc: 'Overhead photovoltaic solar canopy providing clean power, rooftop shade, and rainwater collection channels.',
    cost: '₹14,20,000',
    heatCut: '−12.1°C',
    waterReliability: '41%',
    payback: '4.1 yrs',
    color: 'var(--amber-primary)',
    bg: 'var(--amber-light)',
    border: 'var(--amber-border)',
    features: ['38,500 kWh clean power per year', 'Generates green building carbon offsets', 'Channels water into first-flush filters']
  },
];

const COMPLIANCE_ITEMS = [
  { 
    code: 'IS 15797:2008', 
    title: 'Rainwater Harvesting Systems', 
    desc: 'Sizing standards for rooftop rainwater storage, first-flush diverters, and filtration media compliance.', 
    icon: Droplets, 
    color: 'var(--water-blue)' 
  },
  { 
    code: 'NBC 2016 Part 8', 
    title: 'National Building Code', 
    desc: 'Building physics envelope criteria, thermal transmittance thresholds, and structural load allowances.', 
    icon: Building2, 
    color: 'var(--green-primary)' 
  },
  { 
    code: 'GRIHA & IGBC', 
    title: 'Green Rating Points', 
    desc: 'Qualifies directly for Urban Heat Island Reduction and Sustainable Water Management credits.', 
    icon: Award, 
    color: 'var(--green-primary)' 
  },
  { 
    code: 'CPWD SSR 2023', 
    title: 'Schedule of Rates', 
    desc: 'Contractor pricing, labor costs, and material line items calibrated against official government public works rates.', 
    icon: DollarSign, 
    color: 'var(--amber-primary)' 
  },
];

interface LandingPageProps {
  onEnterApp: () => void;
  onNavigateToAssessment?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onEnterApp, 
  onNavigateToAssessment: _onNavigateToAssessment 
}) => {
  const [roofArea, setRoofArea] = useState<number>(600);
  const [monthlyPowerBill, setMonthlyPowerBill] = useState<number>(120000);
  const [selectedPkg, setSelectedPkg] = useState<string>('balanced');
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Customer savings dynamic calculations
  const annualCoolingSavings = Math.round(monthlyPowerBill * 12 * 0.22);
  const annualWaterLiters = Math.round(roofArea * 1350 * 0.88);
  const tankerTripsSaved = Math.round(annualWaterLiters / 10000);
  const estimatedCapex = Math.round(roofArea * 1150);
  const paybackYears = (estimatedCapex / (annualCoolingSavings + (tankerTripsSaved * 1800))).toFixed(1);

  return (
    <div style={{ background: 'var(--bg-app)', color: 'var(--text-main)', fontFamily: 'var(--font-sans)', overflowX: 'hidden' }}>

      {/* ─── STICKY HEADER ────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 36px',
        background: scrolled ? 'rgba(9, 9, 11, 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-default)' : 'none',
        transition: 'all 0.25s ease'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'var(--green-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--on-accent)',
            boxShadow: '0 0 12px rgba(62, 207, 142, 0.3)'
          }}>
            <ShieldCheck size={18} strokeWidth={2.4} />
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
            Roofwise
          </span>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a href="#how-it-works" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}
             onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
             onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>
            How It Works
          </a>
          <a href="#roi-simulator" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}
             onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
             onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>
            ROI Simulator
          </a>
          <a href="#packages" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}
             onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
             onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>
            Packages
          </a>
          <a href="#compliance" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}
             onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
             onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>
            Standards
          </a>
          <button
            id="landing-header-cta"
            onClick={onEnterApp}
            className="btn btn-primary"
            style={{
              padding: '8px 18px',
              fontSize: '0.84rem',
              borderRadius: '999px',
              marginLeft: '8px'
            }}
          >
            Launch Workbench <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* ─── HERO SECTION ─────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '100px 24px 70px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Soft background ambient glow */}
        <div aria-hidden="true" style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '520px',
          background: 'radial-gradient(ellipse at center, rgba(62, 207, 142, 0.12) 0%, rgba(79, 163, 217, 0.08) 45%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Eyebrow badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '999px',
          background: 'var(--green-light)',
          border: '1px solid var(--green-border)',
          color: 'var(--green-primary)',
          fontSize: '0.78rem',
          fontWeight: 600,
          marginBottom: '28px',
          letterSpacing: '0.02em'
        }}>
          <Zap size={13} />
          Deterministic Climate Resilience & Rooftop Intelligence
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(2.8rem, 5.8vw, 5.2rem)',
          fontWeight: 700,
          letterSpacing: '-0.04em',
          lineHeight: 1.05,
          maxWidth: '960px',
          marginBottom: '24px',
          color: 'var(--text-main)'
        }}>
          Make every{' '}
          <span style={{
            background: 'linear-gradient(135deg, var(--green-primary) 0%, var(--water-blue) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            rooftop
          </span>{' '}
          work smarter.
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
          color: 'var(--text-secondary)',
          maxWidth: '680px',
          lineHeight: 1.65,
          marginBottom: '40px'
        }}>
          Transform Indian campus buildings into climate-resilient water and cooling assets. 
          Run 365-day thermal and rainfall simulations to get Pareto-optimal retrofit packages in seconds.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '64px' }}>
          <button
            id="hero-launch-workbench-btn"
            onClick={onEnterApp}
            className="btn btn-primary"
            style={{
              padding: '14px 34px',
              fontSize: '1rem',
              borderRadius: '999px',
              boxShadow: '0 0 35px rgba(62, 207, 142, 0.28)'
            }}
          >
            Launch Free Workbench
            <ArrowRight size={16} />
          </button>
          <a
            href="#roi-simulator"
            className="btn btn-secondary"
            style={{
              padding: '14px 26px',
              fontSize: '1rem',
              borderRadius: '999px',
              textDecoration: 'none'
            }}
          >
            Estimate Savings
          </a>
        </div>

        {/* 4 Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '14px',
          maxWidth: '1060px',
          width: '100%'
        }}>
          {STATS.map((s) => (
            <div key={s.label} className="card" style={{
              padding: '22px 20px',
              background: 'rgba(15, 15, 18, 0.75)',
              backdropFilter: 'blur(10px)',
              textAlign: 'left'
            }}>
              <div style={{
                fontSize: 'clamp(1.6rem, 2.5vw, 2rem)',
                fontWeight: 700,
                color: s.color,
                letterSpacing: '-0.03em',
                marginBottom: '4px'
              }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                {s.label}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', opacity: 0.4 }}>
          <ChevronDown size={20} />
        </div>
      </section>

      {/* ─── HOW IT WORKS SECTION ─────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '90px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--green-primary)', textTransform: 'uppercase', marginBottom: '10px' }}>
            Workflow
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '14px' }}>
            From rooftop specs to contract-ready plan
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
            Three simple steps powered by client-side physics. No complex setup or cloud logins.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '22px' }}>
          {WORKFLOW_STEPS.map(({ step, title, desc, icon: Icon }, idx) => (
            <div key={step} className="card" style={{ padding: '32px 28px', position: 'relative' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: idx === 1 ? 'var(--water-light)' : 'var(--green-light)',
                border: `1px solid ${idx === 1 ? 'var(--water-border)' : 'var(--green-border)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: idx === 1 ? 'var(--water-blue)' : 'var(--green-primary)',
                marginBottom: '20px'
              }}>
                <Icon size={20} />
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.1em', marginBottom: '8px' }}>
                STEP {step}
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '10px', letterSpacing: '-0.02em' }}>
                {title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── INTERACTIVE ROI SIMULATOR ────────────────────────────── */}
      <section id="roi-simulator" style={{
        padding: '90px 24px',
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-default)',
        borderBottom: '1px solid var(--border-default)'
      }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--water-blue)', textTransform: 'uppercase', marginBottom: '10px' }}>
              Financial Simulator
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '12px' }}>
              Estimate your campus rooftop savings
            </h2>
            <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto' }}>
              Adjust rooftop area and current power costs to see real-world utility reductions.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'center' }}>
            {/* Sliders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Rooftop Area</label>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--green-primary)' }}>{roofArea} m²</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={2000}
                  step={50}
                  value={roofArea}
                  onChange={(e) => setRoofArea(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--green-primary)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                  <span>100 m² (Hostel block)</span>
                  <span>2,000 m² (Academic complex)</span>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Monthly Power Bill</label>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--water-blue)' }}>₹{(monthlyPowerBill / 1000).toFixed(0)}k / mo</span>
                </div>
                <input
                  type="range"
                  min={20000}
                  max={500000}
                  step={10000}
                  value={monthlyPowerBill}
                  onChange={(e) => setMonthlyPowerBill(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--water-blue)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                  <span>₹20,000</span>
                  <span>₹5,00,000</span>
                </div>
              </div>

              <div style={{
                fontSize: '0.78rem',
                color: 'var(--text-dim)',
                lineHeight: 1.5,
                padding: '12px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)'
              }}>
                Calculations calibrated against Mumbai rainfall records (1,350mm median), 0.88 runoff coefficient, and CPWD rate schedules.
              </div>
            </div>

            {/* Output Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
              <div className="card" style={{ padding: '20px', background: 'var(--bg-subtle)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--green-primary)', marginBottom: '4px' }}>
                  ₹{(annualCoolingSavings / 1000).toFixed(0)}k
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '2px' }}>Annual Cooling Cut</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>22% reduction in top-floor HVAC consumption</div>
              </div>

              <div className="card" style={{ padding: '20px', background: 'var(--bg-subtle)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--water-blue)', marginBottom: '4px' }}>
                  {(annualWaterLiters / 1000).toFixed(0)} kL
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '2px' }}>Rainwater Harvested</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Per monsoon cycle</div>
              </div>

              <div className="card" style={{ padding: '20px', background: 'var(--bg-subtle)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--water-blue)', marginBottom: '4px' }}>
                  {tankerTripsSaved} Trips
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '2px' }}>Tankers Avoided</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Eliminates emergency private water tankers</div>
              </div>

              <div className="card" style={{ padding: '20px', background: 'var(--bg-subtle)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--amber-primary)', marginBottom: '4px' }}>
                  {paybackYears} Years
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '2px' }}>Estimated Payback</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Combined power & water utility savings</div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <button
              id="roi-run-workbench-cta"
              onClick={onEnterApp}
              className="btn btn-primary"
              style={{ padding: '12px 28px', borderRadius: '999px', fontSize: '0.92rem' }}
            >
              Run Full Assessment for This Building <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ─── RETROFIT PACKAGES SECTION ────────────────────────────── */}
      <section id="packages" style={{ padding: '90px 24px', maxWidth: '1140px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--green-primary)', textTransform: 'uppercase', marginBottom: '10px' }}>
            Engine Options
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '14px' }}>
            Engineered packages for every budget
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto' }}>
            Compare upfront costs, thermal cut, and water autonomy side-by-side.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {PACKAGES.map((pkg) => {
            const isSelected = selectedPkg === pkg.id;
            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedPkg(pkg.id)}
                className="card"
                style={{
                  padding: '30px 26px',
                  cursor: 'pointer',
                  position: 'relative',
                  border: isSelected ? `1px solid ${pkg.color}` : '1px solid var(--border-default)',
                  background: isSelected ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                  boxShadow: isSelected ? `0 0 25px rgba(62, 207, 142, 0.15)` : 'var(--shadow-sm)',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: pkg.color,
                    background: pkg.bg,
                    border: `1px solid ${pkg.border}`,
                    borderRadius: '999px',
                    padding: '3px 10px'
                  }}>
                    {pkg.tag}
                  </span>
                  {isSelected && <CheckCircle2 size={18} style={{ color: pkg.color }} />}
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                  {pkg.name}
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '22px' }}>
                  {pkg.desc}
                </p>

                {/* Key Metrics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '22px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Capex</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: pkg.color }}>{pkg.cost}</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Payback</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--amber-primary)' }}>{pkg.payback}</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Surface Temp</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--green-primary)' }}>{pkg.heatCut}</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Water Coverage</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--water-blue)' }}>{pkg.waterReliability}</div>
                  </div>
                </div>

                {/* Feature checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {pkg.features.map((feat) => (
                    <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <Check size={14} style={{ color: pkg.color, flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            id="packages-open-workbench"
            onClick={onEnterApp}
            className="btn btn-primary"
            style={{ padding: '12px 28px', borderRadius: '999px', fontSize: '0.92rem' }}
          >
            Explore Full Bill of Quantities in Workbench <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* ─── STANDARDS & AUDIT COMPLIANCE ─────────────────────────── */}
      <section id="compliance" style={{
        padding: '90px 24px',
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-default)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--water-blue)', textTransform: 'uppercase', marginBottom: '10px' }}>
              Verification
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '12px' }}>
              Built for campus engineering & municipal approvals
            </h2>
            <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto' }}>
              Every calculation is backed by verified Indian standards and structural safety parameters.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {COMPLIANCE_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.code} className="card" style={{ padding: '24px', background: 'var(--bg-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Icon size={16} style={{ color: item.color }} />
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: item.color, letterSpacing: '0.04em' }}>
                      {item.code}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.02rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FINAL CALL TO ACTION ─────────────────────────────────── */}
      <section style={{
        padding: '110px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '350px',
          background: 'radial-gradient(ellipse at center, rgba(62, 207, 142, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          color: 'var(--green-primary)',
          textTransform: 'uppercase',
          marginBottom: '14px'
        }}>
          Instant Access
        </div>

        <h2 style={{
          fontSize: 'clamp(2.2rem, 4vw, 3.6rem)',
          fontWeight: 700,
          letterSpacing: '-0.04em',
          marginBottom: '18px',
          color: 'var(--text-main)'
        }}>
          Ready to simulate your rooftop?
        </h2>

        <p style={{
          fontSize: '1.05rem',
          color: 'var(--text-secondary)',
          maxWidth: '540px',
          margin: '0 auto 36px',
          lineHeight: 1.65
        }}>
          Input your building parameters or explore the IIT Mumbai hostel dataset in the interactive workbench.
        </p>

        <button
          id="landing-bottom-cta-launch"
          onClick={onEnterApp}
          className="btn btn-primary"
          style={{
            padding: '16px 42px',
            fontSize: '1.05rem',
            borderRadius: '999px',
            boxShadow: '0 0 45px rgba(62, 207, 142, 0.3)'
          }}
        >
          Launch Roofwise Workbench Now
          <ArrowRight size={18} />
        </button>

        <div style={{ marginTop: '22px', fontSize: '0.76rem', color: 'var(--text-dim)', letterSpacing: '0.04em' }}>
          No sign-up required · 100% private local execution · Instant reports
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid var(--border-default)',
        background: 'var(--bg-surface)',
        padding: '24px 36px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        fontSize: '0.8rem',
        color: 'var(--text-dim)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            background: 'var(--green-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--on-accent)'
          }}>
            <ShieldCheck size={14} strokeWidth={2.4} />
          </div>
          <strong style={{ color: 'var(--text-main)', fontWeight: 600 }}>Roofwise</strong>
          <span>— Evidence-backed roof retrofit planning.</span>
        </div>
        <div>
          Deterministic Engine v1.2.0 · Standards: IS 15797 / NBC 2016 Part 8
        </div>
      </footer>
    </div>
  );
};
