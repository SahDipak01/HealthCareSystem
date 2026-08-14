import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Users, FileText, ArrowRight, CreditCard, Search } from 'lucide-react';

const PatientList = () => {
  const { token } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/doctors/my/patients', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setPatients(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Assigned Patient Directory</h1>
        <p className="page-subtitle">Inspect patient EHR profiles, medical history, and past consultations</p>
      </div>

      {loading ? (
        <p>Loading patient directory...</p>
      ) : patients.length > 0 ? (
        <div className="grid-cols-3">
          {patients.map((p) => (
            <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.75rem', borderRadius: '50%', fontWeight: 800 }}>
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{p.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ABHA ID: {p.abha_id}</p>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-dark)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
                  <div>Blood: <strong>{p.blood_group || 'O+'}</strong></div>
                  <div>Allergies: <strong>{p.allergies || 'None'}</strong></div>
                </div>
              </div>

              <Link to={`/doctor/patients/${p.id}`} className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                <FileText size={14} /> Open Full EHR Profile
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Users size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3>No assigned patients yet</h3>
        </div>
      )}
    </div>
  );
};

export default PatientList;
