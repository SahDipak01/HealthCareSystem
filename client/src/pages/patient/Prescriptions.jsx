import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Pill, Printer, FileText, CheckCircle2 } from 'lucide-react';

const Prescriptions = () => {
  const { token } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/patients/prescriptions', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setPrescriptions(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Digital Prescriptions</h1>
        <p className="page-subtitle">Verified e-prescriptions issued by consulting physicians</p>
      </div>

      {loading ? (
        <p>Loading prescriptions...</p>
      ) : prescriptions.length > 0 ? (
        <div className="grid-cols-2">
          {prescriptions.map((p) => {
            let medicines = [];
            try {
              medicines = typeof p.medicines_json === 'string' ? JSON.parse(p.medicines_json) : p.medicines_json;
            } catch (e) {
              medicines = [];
            }

            return (
              <div key={p.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{p.diagnosis}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>Prescribed by {p.doctor_name}</p>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Date: {p.date}</span>
                </div>

                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-dark)' }}>
                  Prescribed Medicines & Dosage:
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  {medicines.map((m, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong style={{ fontSize: '0.9rem' }}>{m.name}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 600 }}>{m.duration}</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dosage: {m.dosage}</p>
                    </div>
                  ))}
                </div>

                {p.instructions && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dark)', background: '#fffbe6', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.25rem', border: '1px solid #ffe58f' }}>
                    <strong>Special Advice:</strong> {p.instructions}
                  </p>
                )}

                <button onClick={() => window.print()} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                  <Printer size={14} /> Print Digital Prescription
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Pill size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3>No digital prescriptions found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>After completing a doctor consultation, your digital prescription will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default Prescriptions;
