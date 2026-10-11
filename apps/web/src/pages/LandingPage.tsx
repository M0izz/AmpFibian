import React, { useState } from 'react';
import {
  ArrowRight,
  Droplets,
  Flame,
  Scale,
  FileText,
  Building,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Layers
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  onNavigateToAssessment?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onNavigateToAssessment }) => {
  const [activeTab, setActiveTab] = useState<'recommended' | 'baseline' | 'solar_heavy'>('recommended');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
      
      {/* ── TOP NAV BAR ── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-default)',
        transition: 'all 0.2s ease'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '68px',
          padding: '0 20px'
        }}>
          {/* Brand Mark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #176B4D 0%, #0F4934 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.15rem',
              boxShadow: '0 2px 6px rgba(23, 107, 77, 0.3)'
            }}>
              R
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                  Roofwise
                </span>
                <span className="badge badge-green" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                  v1.2
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1 }}>
                Make every rooftop work smarter.
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '28px', fontSize: '0.88rem', fontWeight: 500 }}>
            <a href="#problem" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.15s' }}>
              The Problem
            </a>
            <a href="#how-it-works" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.15s' }}>
              How It Works
            </a>
            <a href="#demo-preview" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.15s' }}>
              Simulation Engine
            </a>
            <a href="#case-study" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.15s' }}>
              Case Study
            </a>
            <a href="#standards" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.15s' }}>
              Standards
            </a>
          </nav>

          {/* Action Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              id="landing-nav-enter-app-btn"
              onClick={onEnterApp}
              className="btn btn-primary"
              style={{
                padding: '9px 18px',
                fontSize: '0.88rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(23, 107, 77, 0.25)'
              }}
            >
              Open Workbench
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* ── § 1.1 HERO SECTION ── */}
      <section style={{
        padding: '72px 0 56px 0',
        background: 'linear-gradient(180deg, #F9FAF7 0%, #F1F4EE 100%)',
        borderBottom: '1px solid var(--border-default)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle background grid pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(23, 107, 77, 0.08) 1px, transparent 0)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none',
          opacity: 0.6
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
            gap: '48px',
            alignItems: 'center'
          }}>
            {/* Left Column: Headlines & Call to Actions */}
            <div className="animate-slide-up">
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#E6EFEA',
                border: '1px solid #BCE0CD',
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--green-primary)',
                marginBottom: '20px'
              }}>
                <Sparkles size={14} />
                <span>Deterministic Roof-Retrofit Decision Engine</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.4rem, 4.2vw, 3.4rem)',
                fontWeight: 800,
                lineHeight: 1.12,
                letterSpacing: '-0.03em',
                color: 'var(--text-main)',
                marginBottom: '18px'
              }}>
                Make every rooftop work <span style={{ color: 'var(--green-primary)' }}>smarter</span>.
              </h1>

              <p style={{
                fontSize: '1.15rem',
                lineHeight: 1.55,
                color: 'var(--text-secondary)',
                marginBottom: '32px',
                maxWidth: '540px'
              }}>
                Evidence-backed retrofit decisions for heat resilience and rainwater harvesting — balanced under real area, live-load, and budget constraints in under 60 seconds.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
                <button
                  id="landing-hero-cta-primary-btn"
                  onClick={onNavigateToAssessment || onEnterApp}
                  className="btn btn-primary"
                  style={{
                    padding: '13px 26px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-md)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 4px 14px rgba(23, 107, 77, 0.3)'
                  }}
                >
                  Start Your Assessment
                  <ArrowRight size={18} />
                </button>

                <a
                  href="#how-it-works"
                  id="landing-hero-cta-secondary-btn"
                  className="btn btn-secondary"
                  style={{
                    padding: '13px 22px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  See How It Works
                  <ChevronDown size={18} />
                </a>
              </div>

              {/* Trust & Engineering Strip */}
              <div style={{
                paddingTop: '24px',
                borderTop: '1px solid var(--border-default)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)' }}>
                  Standardized Against:
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {['IS 15797', 'NBC 2016', 'ASHRAE 90.1', 'Maharashtra PWD SSR 2023-24'].map(tag => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-default)',
                        borderRadius: '4px',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: High-End Architectural Visual with Floating Metric Callouts */}
            <div style={{ position: 'relative' }}>
              <div
                className="hover-lift"
                style={{
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-default)',
                  boxShadow: '0 20px 40px -15px rgba(24, 33, 29, 0.15)',
                  background: 'var(--bg-surface)'
                }}
              >
                <img
                  src="/assets/roofwise_hero.jpg"
                  alt="Architectural Cutaway of Rooftop Retrofit showing Cool Roof Reflectance and Rainwater Harvesting System"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'cover'
                  }}
                />

                {/* Floating Metric 1: Heat Flux Reduction */}
                <div style={{
                  position: 'absolute',
                  top: '18px',
                  left: '18px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(8px)',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #BFE2CB',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#E8F4EC',
                    color: 'var(--green-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Flame size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--green-primary)', lineHeight: 1.1 }}>
                      −48.3%
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      Peak Thermal Conduction (123.8 → 64.0 W/m²)
                    </div>
                  </div>
                </div>

                {/* Floating Metric 2: Rainwater Harvesting */}
                <div style={{
                  position: 'absolute',
                  bottom: '18px',
                  right: '18px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(8px)',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #BCD9E6',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#EAF4F8',
                    color: 'var(--water-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Droplets size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--water-blue)', lineHeight: 1.1 }}>
                      68.4%
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      Monsoon Demand Met (3,780 kL/yr)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── § 1.2 THE PROBLEM STATEMENT ── */}
      <section id="problem" style={{ padding: '80px 0', background: 'var(--bg-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 52px auto' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--green-primary)' }}>
              Climate Vulnerability In Indian Metros
            </span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.02em', marginTop: '8px', color: 'var(--text-main)' }}>
              Commercial rooftops are failing under dual climate extremes
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '12px' }}>
              Most facilities teams treat heat mitigation and water security as separate problems with separate budgets. That leads to sub-optimal, costly retrofits.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {/* Card 1: Heat */}
            <div className="card hover-lift" style={{ padding: '32px', borderLeft: '4px solid #C05621' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: '#FFF5F0',
                color: '#C05621',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Flame size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-main)' }}>
                Rooftop slabs reach 55°C in May
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Bare RCC slabs absorb intense solar radiation, transmitting high conductive heat directly into top-floor occupied rooms. Cooling loads surge by 20–35%, while occupant discomfort spikes.
              </p>
              <div style={{ marginTop: '20px', fontSize: '0.82rem', fontWeight: 600, color: '#C05621' }}>
                Impact: High cooling expenditure & tenant fatigue
              </div>
            </div>

            {/* Card 2: Water */}
            <div className="card hover-lift" style={{ padding: '32px', borderLeft: '4px solid var(--water-blue)' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: '#EAF4F8',
                color: 'var(--water-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Droplets size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-main)' }}>
                Mumbai: 2,640mm rain. Zero harvested.
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Commercial properties draw thousands of liters from municipal lines and private water tankers daily, while torrential monsoon rainfall floods urban stormwater gutters without being captured.
              </p>
              <div style={{ marginTop: '20px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--water-blue)' }}>
                Impact: High water tanker bills & reliance on stressed grids
              </div>
            </div>

            {/* Card 3: The Trade-off */}
            <div className="card hover-lift" style={{ padding: '32px', borderLeft: '4px solid var(--green-primary)' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: '#E8F4EC',
                color: 'var(--green-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Scale size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-main)' }}>
                Every rupee for cooling = one less for tanks
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Roof area is strictly finite. Slab structural load capacities are limited. Budget caps are hard. Without a multi-variable engine, decision-makers overpay for uncoordinated retrofits.
              </p>
              <div style={{ marginTop: '20px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--green-primary)' }}>
                Impact: Sub-optimal ROI & wasted rooftop capacity
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── § 1.3 HOW IT WORKS (4 STEPS) ── */}
      <section id="how-it-works" style={{ padding: '80px 0', background: 'var(--bg-app)', borderTop: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 52px auto' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--green-primary)' }}>
              Engineered Methodology
            </span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.02em', marginTop: '8px', color: 'var(--text-main)' }}>
              How Roofwise evaluates your building
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '12px' }}>
              Deterministic physics and optimization — no generic sustainability averages, no hand-wavy carbon scores.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                step: '01',
                title: 'Building Geometry & Constraints',
                desc: 'Enter roof footprint, slab material (150mm RCC), allowable structural live load (kg/m²), occupancy, and budget ceiling.',
                icon: Building
              },
              {
                step: '02',
                title: 'Coupled Physics Simulation',
                desc: 'Runs 365-day daily rainfall balance using IMD meteorological data alongside 1D transient slab conductive heat flux equations.',
                icon: Layers
              },
              {
                step: '03',
                title: 'Pareto Optimization Frontier',
                desc: 'Permutes feasible combinations of cool coatings, XPS insulation, and RWH tanks, pruning non-viable packages under hard physical limits.',
                icon: Scale
              },
              {
                step: '04',
                title: 'Actionable Engineering BOQ',
                desc: 'Delivers itemized Bill of Quantities using verified Maharashtra PWD SSR rates, payback schedule, and printable client reports.',
                icon: FileText
              }
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="card" style={{ padding: '28px', position: 'relative' }}>
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    color: 'var(--green-primary)',
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>STEP {item.step}</span>
                    <Icon size={20} color="var(--text-dim)" />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-main)' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── § 1.4 LIVE DEMO PREVIEW (INTERACTIVE ENGINE SNAPSHOT) ── */}
      <section id="demo-preview" style={{ padding: '80px 0', background: 'var(--bg-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px auto' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--green-primary)' }}>
              Interactive Engine Preview
            </span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.02em', marginTop: '8px', color: 'var(--text-main)' }}>
              Real simulation results for 1,200 m² Mumbai Hostel
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '12px' }}>
              Toggle between packages to inspect how physical trade-offs affect heat flux, water security, and financial return.
            </p>
          </div>

          {/* Interactive Package Switcher Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
            {[
              { id: 'recommended', label: 'Balanced (Recommended)', badge: 'Optimal Pareto' },
              { id: 'baseline', label: 'Current Baseline', badge: 'Unmitigated' },
              { id: 'solar_heavy', label: 'High-Cooling Focus', badge: 'Max Thermal' },
            ].map(tab => (
              <button
                key={tab.id}
                id={`preview-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '9px 18px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: activeTab === tab.id ? '2px solid var(--green-primary)' : '1px solid var(--border-default)',
                  background: activeTab === tab.id ? '#E8F4EC' : 'var(--bg-surface)',
                  color: activeTab === tab.id ? 'var(--green-primary)' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{tab.label}</span>
                <span style={{
                  fontSize: '0.7rem',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  background: activeTab === tab.id ? 'var(--green-primary)' : 'var(--bg-subtle)',
                  color: activeTab === tab.id ? '#FFFFFF' : 'var(--text-muted)'
                }}>
                  {tab.badge}
                </span>
              </button>
            ))}
          </div>

          {/* Snapshot Display Card */}
          <div className="card" style={{ padding: '36px', maxWidth: '1040px', margin: '0 auto', boxShadow: 'var(--shadow-md)' }}>
            {/* Recommendation Banner */}
            <div style={{
              background: activeTab === 'recommended' ? 'linear-gradient(135deg, #176B4D 0%, #115039 100%)' : '#2A3630',
              color: '#FFFFFF',
              padding: '20px 24px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.85, fontWeight: 600 }}>
                  {activeTab === 'recommended' ? 'Primary Engineering Recommendation' : 'Scenario Package Inspection'}
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '2px' }}>
                  {activeTab === 'recommended' && 'Package B: High-Albedo SRI 104 + 50kL Modular Cistern'}
                  {activeTab === 'baseline' && 'Baseline: 150mm Bare Reinforced Concrete Slab'}
                  {activeTab === 'solar_heavy' && 'Package C: Double XPS Insulation + 25kL Compact Cistern'}
                </div>
                <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '4px' }}>
                  {activeTab === 'recommended' && 'Satisfies 100% of structural load caps while capturing maximum monsoon precipitation.'}
                  {activeTab === 'baseline' && 'High conductive peak thermal flux with 0% monsoon rainwater retained.'}
                  {activeTab === 'solar_heavy' && 'Substantial heat flux suppression, but constrained water retention.'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#FFFFFF', padding: '6px 12px', fontSize: '0.82rem' }}>
                  {activeTab === 'recommended' ? 'Feasible & Non-Dominated' : activeTab === 'baseline' ? 'Existing State' : 'Feasible (Higher Cost)'}
                </span>
              </div>
            </div>

            {/* 4 KPI Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '32px'
            }}>
              <div style={{ padding: '18px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>CONDUCTIVE HEAT FLUX</div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: activeTab === 'baseline' ? '#C05621' : 'var(--green-primary)', marginTop: '4px' }}>
                  {activeTab === 'recommended' && '64.0 W/m²'}
                  {activeTab === 'baseline' && '123.8 W/m²'}
                  {activeTab === 'solar_heavy' && '52.1 W/m²'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {activeTab === 'recommended' && '−48.3% peak reduction'}
                  {activeTab === 'baseline' && 'Baseline unmitigated'}
                  {activeTab === 'solar_heavy' && '−57.9% peak reduction'}
                </div>
              </div>

              <div style={{ padding: '18px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>MONSOON WATER HARVESTED</div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: activeTab === 'baseline' ? 'var(--text-muted)' : 'var(--water-blue)', marginTop: '4px' }}>
                  {activeTab === 'recommended' && '68.4%'}
                  {activeTab === 'baseline' && '0.0%'}
                  {activeTab === 'solar_heavy' && '41.2%'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {activeTab === 'recommended' && '3,780 kL / year harvested'}
                  {activeTab === 'baseline' && '100% municipal reliance'}
                  {activeTab === 'solar_heavy' && '2,270 kL / year harvested'}
                </div>
              </div>

              <div style={{ padding: '18px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>CAPITAL EXPENDITURE</div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                  {activeTab === 'recommended' && '₹4,01,200'}
                  {activeTab === 'baseline' && '₹0'}
                  {activeTab === 'solar_heavy' && '₹5,85,000'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {activeTab === 'recommended' && 'Under ₹5.0L budget cap'}
                  {activeTab === 'baseline' && 'No upfront investment'}
                  {activeTab === 'solar_heavy' && 'Above ₹5.0L budget cap'}
                </div>
              </div>

              <div style={{ padding: '18px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>PAYBACK PERIOD</div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: activeTab === 'recommended' ? 'var(--green-primary)' : 'var(--text-main)', marginTop: '4px' }}>
                  {activeTab === 'recommended' && '3.8 Years'}
                  {activeTab === 'baseline' && '—'}
                  {activeTab === 'solar_heavy' && '5.4 Years'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {activeTab === 'recommended' && 'Water savings + AC drop'}
                  {activeTab === 'baseline' && 'Recurring tanker losses'}
                  {activeTab === 'solar_heavy' && 'Longer amortisation'}
                </div>
              </div>
            </div>

            {/* Overlaid Conversion Call-To-Action */}
            <div style={{
              background: '#F0F5F2',
              border: '1px dashed #A5CEB9',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--green-primary)' }}>
                  This is your building's retrofit potential.
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Run a live assessment with your exact roof dimensions, utility tariffs, and occupancy.
                </div>
              </div>

              <button
                id="preview-run-real-assessment-btn"
                onClick={onNavigateToAssessment || onEnterApp}
                className="btn btn-primary"
                style={{
                  padding: '10px 20px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                Run Assessment on Your Building
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── § 1.5 SOCIAL PROOF & VALIDATION CASE STUDY ── */}
      <section id="case-study" style={{ padding: '80px 0', background: 'var(--bg-app)', borderTop: '1px solid var(--border-default)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
            gap: '44px',
            alignItems: 'center'
          }}>
            <div>
              <span className="badge badge-green" style={{ marginBottom: '14px' }}>
                Field-Validated Benchmark
              </span>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)', marginBottom: '16px' }}>
                Mumbai Hostel, Andheri East
              </h2>
              <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                A 5-story student hostel with a 1,200 m² RCC roof slab suffering from top-floor heat distress in April–May and severe water rationing during dry months.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
                {[
                  { title: 'Finite Live-Load Capacity', text: '150 kg/m² structural cap prevented heavy soil green roofs.' },
                  { title: 'Strict CapEx Limit', text: 'Hard budget ceiling of ₹5.00 Lakhs.' },
                  { title: 'Verified Solution', text: 'High-albedo SRI 104 elastomeric membrane + 50 kL modular cistern.' },
                ].map(item => (
                  <div key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <CheckCircle2 size={18} color="var(--green-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{item.title}:</strong>
                      <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginLeft: '6px' }}>{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                display: 'flex',
                gap: '24px'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)' }}>MEASURED CAPEX</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>₹4.01 Lakhs</div>
                </div>
                <div style={{ borderLeft: '1px solid var(--border-default)', paddingLeft: '24px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)' }}>THERMAL FLUX DROP</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--green-primary)' }}>−48.3%</div>
                </div>
                <div style={{ borderLeft: '1px solid var(--border-default)', paddingLeft: '24px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)' }}>MONSOON HARVEST</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--water-blue)' }}>68.4%</div>
                </div>
              </div>
            </div>

            {/* Comparison Table Card */}
            <div className="card" style={{ padding: '28px' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-main)' }}>
                Before vs. After Specification
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-default)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 0', color: 'var(--text-muted)', fontWeight: 600 }}>Parameter</th>
                    <th style={{ padding: '10px 12px', color: '#C05621', fontWeight: 600 }}>Baseline Slab</th>
                    <th style={{ padding: '10px 0', color: 'var(--green-primary)', fontWeight: 600 }}>Retrofitted</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { param: 'Solar Reflectance Index (SRI)', before: '25 (Bare RCC)', after: '104 (Cool Coating)' },
                    { param: 'Peak Slab Temp (May)', before: '56.4 °C', after: '38.2 °C' },
                    { param: 'Conductive Peak Flux', before: '123.8 W/m²', after: '64.0 W/m²' },
                    { param: 'Annual Water Harvested', before: '0 kL', after: '3,780 kL' },
                    { param: 'Structural Load Impact', before: '0 kg/m²', after: '42 kg/m² (Well under limit)' },
                    { param: 'Annual Utility Savings', before: '₹0', after: '₹1,05,500 / yr' },
                  ].map((row, i) => (
                    <tr key={row.param} style={{ borderBottom: '1px solid var(--border-subtle)', background: i % 2 === 0 ? 'var(--bg-subtle)' : 'transparent' }}>
                      <td style={{ padding: '10px 8px', fontWeight: 500 }}>{row.param}</td>
                      <td style={{ padding: '10px 12px', color: '#8A3B14' }}>{row.before}</td>
                      <td style={{ padding: '10px 8px', fontWeight: 600, color: 'var(--green-primary)' }}>{row.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button
                  id="case-study-open-report-btn"
                  onClick={onEnterApp}
                  className="btn btn-secondary"
                  style={{ width: '100%', fontSize: '0.85rem', fontWeight: 600 }}
                >
                  Inspect Full Engineering Report in Workbench
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── § 1.6 TESTIMONIAL & ACADEMIC CITATIONS ── */}
      <section id="standards" style={{ padding: '72px 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-default)' }}>
        <div className="container">
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontStyle: 'italic', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '24px' }}>
              “Most energy audit tools spit out standard solar panels without looking at slab temperature or monsoon collection. Roofwise is the first platform that actually couples thermal dynamics with water tanks under real structural capacity constraints.”
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--green-primary)' }}>
              Senior Facilities Directorate
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Western Region Institutional Campus Infrastructure
            </div>

            <div style={{
              marginTop: '48px',
              padding: '24px',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              textAlign: 'left'
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '10px' }}>
                Academic & Standards Provenance
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <div>• <strong>IMD Santacruz Station:</strong> 10-year hourly precipitation dataset (2015 dry, 2020 median, 2019 wet)</div>
                <div>• <strong>IS 15797:2008:</strong> Indian Standard for High-Reflectance Cool Roof Coatings on concrete</div>
                <div>• <strong>BEE Guidelines:</strong> Bureau of Energy Efficiency commercial cool roof weathering adjustments</div>
                <div>• <strong>Maharashtra PWD:</strong> Standard Schedule of Rates (SSR 2023-24) civil procurement items</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── § 1.7 FOOTER ── */}
      <footer style={{
        marginTop: 'auto',
        background: '#141C18',
        color: '#D4DDD7',
        padding: '56px 0 28px 0',
        borderTop: '1px solid #23302A'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '36px',
            marginBottom: '44px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '6px',
                  background: 'var(--green-primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.95rem'
                }}>
                  R
                </div>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                  Roofwise
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#97A89F', lineHeight: 1.5, marginBottom: '16px' }}>
                Make every rooftop work smarter. Deterministic decision engine for heat resilience and rainwater harvesting.
              </p>
              <div style={{ fontSize: '0.75rem', color: '#6A7D73' }}>
                FastAPI Backend connected on port 8005
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Application
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
                <button
                  id="footer-btn-overview"
                  onClick={onEnterApp}
                  style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: '#B3C4BA', cursor: 'pointer' }}
                >
                  Decision Overview
                </button>
                <button
                  id="footer-btn-assessment"
                  onClick={onNavigateToAssessment || onEnterApp}
                  style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: '#B3C4BA', cursor: 'pointer' }}
                >
                  Building Assessment Wizard
                </button>
                <button
                  id="footer-btn-compare"
                  onClick={onEnterApp}
                  style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: '#B3C4BA', cursor: 'pointer' }}
                >
                  Package Comparison
                </button>
                <button
                  id="footer-btn-evidence"
                  onClick={onEnterApp}
                  style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: '#B3C4BA', cursor: 'pointer' }}
                >
                  Evidence & Assumptions Register
                </button>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Engine & Compliance
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: '#B3C4BA' }}>
                <span>IS 15797 / IS 3792 Verified</span>
                <span>Maharashtra PWD SSR Rate Models</span>
                <span>Transient 1D Fourier Heat Conduction</span>
                <span>365-Day Daily Rainfall Mass Balance</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Deployment
              </div>
              <p style={{ fontSize: '0.82rem', color: '#97A89F', lineHeight: 1.5, marginBottom: '12px' }}>
                AWS-native user isolation architecture with Cognito cryptographic identities, DynamoDB multi-tenancy, and private S3 reports.
              </p>
              <button
                id="footer-btn-start-now"
                onClick={onEnterApp}
                className="btn btn-primary"
                style={{ width: '100%', fontSize: '0.84rem', padding: '9px 14px' }}
              >
                Launch Workbench →
              </button>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid #23302A',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.76rem',
            color: '#6A7D73'
          }}>
            <div>
              © 2026 Roofwise. All calculation engines deterministic.
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <span>Privacy & Isolation (Cognito)</span>
              <span>Terms of Assessment</span>
              <span>Open Source Core</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
