import React from 'react';
import { Activity, ShieldCheck, Target, HeartPulse, Award, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">About SwasthyaConnect</h1>
        <p className="page-subtitle">National Initiative for Unified Healthcare Digitization</p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary)' }}>
          Platform Vision & Objectives
        </h2>
        <p style={{ lineHeight: '1.8', color: 'var(--text-dark)', marginBottom: '1rem' }}>
          Healthcare fragmentation across urban and rural India often leads to lost medical records, delayed emergency response, and lack of real-time epidemiological surveillance. <strong>SwasthyaConnect</strong> bridges this gap by offering a <strong>Unified Digital Health Platform</strong> that links patients, healthcare providers, and government monitoring systems under the Ayushman Bharat Digital Mission (ABDM) framework.
        </p>
      </div>

      <div className="grid-cols-3">
        <div className="card">
          <Target style={{ color: 'var(--primary)', marginBottom: '0.75rem' }} size={32} />
          <h3 className="card-title">Ayushman Bharat Alignment</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Issuing standardized 14-digit ABHA Health IDs to enable interoperable Electronic Health Records across hospitals nationwide.
          </p>
        </div>

        <div className="card">
          <HeartPulse style={{ color: 'var(--secondary)', marginBottom: '0.75rem' }} size={32} />
          <h3 className="card-title">AI Triage & Early Detection</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Automated symptom analysis that prioritizes high-risk patient emergencies and directs them to specialized clinical care.
          </p>
        </div>

        <div className="card">
          <Globe style={{ color: 'var(--success)', marginBottom: '0.75rem' }} size={32} />
          <h3 className="card-title">Government Analytics</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Real-time disease prevalence surveillance dashboards for municipal and national health policy decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
