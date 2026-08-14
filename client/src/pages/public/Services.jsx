import React from 'react';
import { CreditCard, Bot, Video, FileText, Pill, Stethoscope, Shield, Search } from 'lucide-react';

const Services = () => {
  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Digital Health Services</h1>
        <p className="page-subtitle">Comprehensive solutions for citizens, clinical doctors, and healthcare administrators</p>
      </div>

      <div className="grid-cols-2">
        <div className="card">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ padding: '0.75rem', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '12px' }}>
              <CreditCard size={28} />
            </div>
            <div>
              <h3 className="card-title">Digital Health ID (ABHA)</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                Instant creation of verified national digital health card numbers with printable QR code verification.
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ padding: '0.75rem', background: '#e0e7ff', color: 'var(--secondary)', borderRadius: '12px' }}>
              <Bot size={28} />
            </div>
            <div>
              <h3 className="card-title">AI Symptom & Risk Assessor</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                Rule-based clinical symptom risk analysis providing instant Low, Medium, or High risk categorization.
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ padding: '0.75rem', background: '#dcfce7', color: 'var(--success)', borderRadius: '12px' }}>
              <Video size={28} />
            </div>
            <div>
              <h3 className="card-title">HD Teleconsultation</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                Virtual face-to-face video consultation room connecting patients directly with certified clinical specialists.
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ padding: '0.75rem', background: '#fef3c7', color: '#b45309', borderRadius: '12px' }}>
              <Pill size={28} />
            </div>
            <div>
              <h3 className="card-title">Digital E-Prescriptions</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                Doctor e-signatures, structured dosages, duration instructions, and automatic pharmacy export formats.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
