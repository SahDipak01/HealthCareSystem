import React from 'react';
import { Activity } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '3rem 2rem', marginTop: 'auto', borderTop: '1px solid #1e293b' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>
            <Activity style={{ color: '#0d9488' }} /> SwasthyaConnect
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
            Next-generation Unified Digital Health Platform for Electronic Health Records, Teleconsultation, and AI Symptom Assessment.
          </p>
        </div>

        <div>
          <h4 style={{ color: 'white', marginBottom: '1rem' }}>Quick Portals</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
            <li>ABHA Digital Health ID Generator</li>
            <li>AI Symptom & Health-Risk Calculator</li>
            <li>Doctor Appointment & Consultation Scheduling</li>
            <li>Digital Electronic Health Records (EHR)</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'white', marginBottom: '1rem' }}>Support & Emergency</h4>
          <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>National Health Toll-Free: <strong>1800-11-4477</strong></p>
          <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Emergency Ambulance: <strong>108 / 112</strong></p>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '1rem' }}>
            © 2026 SwasthyaConnect Digital Health Network. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
