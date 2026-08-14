import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Stethoscope, Bot, CreditCard, Users, ArrowRight, HeartPulse, Video, FileText } from 'lucide-react';

const Home = () => {
  return (
    <div className="main-content">
      {/* Hero Section */}
      <section className="hero">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', padding: '0.35rem 0.85rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem' }}>
            <Activity size={16} /> Unified Digital Health Platform
          </div>
          <h1 className="hero-title">Unified Digital Health & Care Portal</h1>
          <p className="hero-subtitle">
            Seamlessly integrating Electronic Health Records (ABHA ID), Doctor Consultations, AI Symptom Assessment, and Government Health Surveillance into one accessible platform.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', background: 'white', color: 'var(--primary)' }}>
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/services" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
              Explore Platform Features
            </Link>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '20px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', width: '100%', maxWidth: '380px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Instant Demo Login Access</h3>
          <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '1.5rem' }}>
            Test role-based portals with pre-seeded demo accounts:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/login" className="btn" style={{ background: 'rgba(255,255,255,0.9)', color: '#0f172a', justifyContent: 'flex-start' }}>
              <Users size={18} style={{ color: 'var(--primary)' }} /> Sign In as Patient
            </Link>
            <Link to="/login" className="btn" style={{ background: 'rgba(255,255,255,0.9)', color: '#0f172a', justifyContent: 'flex-start' }}>
              <Stethoscope size={18} style={{ color: 'var(--secondary)' }} /> Sign In as Doctor
            </Link>
            <Link to="/login" className="btn" style={{ background: 'rgba(255,255,255,0.9)', color: '#0f172a', justifyContent: 'flex-start' }}>
              <ShieldCheck size={18} style={{ color: '#ef4444' }} /> Sign In as Admin / Gov
            </Link>
          </div>
        </div>
      </section>

      {/* Core Platform Modules */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-dark)' }}>Platform Architecture Modules</h2>
        <p style={{ color: 'var(--text-muted)' }}>Empowering citizens, doctors, and health officials with connected tools.</p>
      </div>

      <div className="grid-cols-3" style={{ marginBottom: '4rem' }}>
        <div className="card">
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <CreditCard size={26} />
          </div>
          <h3 className="card-title">Digital Health ID (ABHA)</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
            Unified national health account linking all medical diagnostic reports, prescriptions, and immunizations securely.
          </p>
        </div>

        <div className="card">
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0e7ff', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Bot size={26} />
          </div>
          <h3 className="card-title">AI Health-Risk Assistant</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
            Enter symptoms for intelligent, instant risk stratification (Low / Medium / High) and guided triage next steps.
          </p>
        </div>

        <div className="card">
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dcfce7', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Video size={26} />
          </div>
          <h3 className="card-title">Teleconsultation Portal</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
            Real-time digital consultation booking, virtual video sessions, and instant doctor e-prescriptions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
