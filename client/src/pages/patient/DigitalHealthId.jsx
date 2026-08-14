import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CreditCard, QrCode, ShieldCheck, Download, Printer, User } from 'lucide-react';

const DigitalHealthId = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetch('/api/patients/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setProfile(data));
  }, [token]);

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Digital Health ID (ABHA) Card</h1>
        <p className="page-subtitle">Ayushman Bharat Digital Mission (ABDM) Interoperable Healthcare Identification</p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Printable ABHA Card View */}
        <div
          className="card"
          style={{
            width: '100%',
            maxWidth: '520px',
            background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 60%, #0284c7 100%)',
            color: 'white',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1 }}>
            <ShieldCheck size={200} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ShieldCheck size={32} />
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>SwasthyaConnect ABHA</h3>
                <p style={{ fontSize: '0.75rem', opacity: 0.85 }}>National Digital Health Authority</p>
              </div>
            </div>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700 }}>
              VERIFIED CITIZEN
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2rem' }}>
            {/* Fake QR code visualization */}
            <div style={{ background: 'white', padding: '0.75rem', borderRadius: '12px', color: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <QrCode size={100} />
              <span style={{ fontSize: '0.65rem', fontWeight: 700, marginTop: '0.25rem' }}>SCAN TO VERIFY</span>
            </div>

            <div>
              <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>FULL NAME</p>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem' }}>{user?.name}</h3>

              <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>ABHA NUMBER</p>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.08em', color: '#ccfbf1' }}>
                {profile?.abha_id || '91-8492-3849-1029'}
              </h4>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1rem', fontSize: '0.85rem' }}>
            <div>
              <span style={{ opacity: 0.8, fontSize: '0.75rem' }}>BLOOD GROUP</span>
              <p style={{ fontWeight: 700 }}>{profile?.blood_group || 'O+'}</p>
            </div>
            <div>
              <span style={{ opacity: 0.8, fontSize: '0.75rem' }}>DATE OF BIRTH</span>
              <p style={{ fontWeight: 700 }}>{profile?.dob || '1995-04-12'}</p>
            </div>
            <div>
              <span style={{ opacity: 0.8, fontSize: '0.75rem' }}>GENDER</span>
              <p style={{ fontWeight: 700 }}>FEMALE</p>
            </div>
          </div>
        </div>

        {/* Info & Action Card */}
        <div className="card" style={{ flex: 1, minWidth: '300px' }}>
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>ABHA Health Card Rights & Features</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', color: 'var(--text-dark)', fontSize: '0.95rem', marginBottom: '2rem' }}>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <ShieldCheck style={{ color: 'var(--primary)' }} size={20} />
              Unified record sharing across hospitals, diagnostics labs, and telehealth clinics.
            </li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <ShieldCheck style={{ color: 'var(--primary)' }} size={20} />
              100% End-to-end encrypted medical data privacy with explicit consent control.
            </li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <ShieldCheck style={{ color: 'var(--primary)' }} size={20} />
              Accepted at all AIIMS, Apollo, Max Healthcare, and government primary health centers.
            </li>
          </ul>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => window.print()} className="btn btn-primary">
              <Printer size={18} /> Print Health Card
            </button>
            <button onClick={() => alert('ABHA Digital Card Download Started!')} className="btn btn-secondary">
              <Download size={18} /> Download PDF Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalHealthId;
