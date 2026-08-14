import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, FileText, Pill, ArrowLeft, Download, ShieldCheck } from 'lucide-react';

const PatientDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [records, setRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/patients/records?patient_id=${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setRecords(Array.isArray(data) ? data : []));

    fetch(`/api/patients/prescriptions?patient_id=${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setPrescriptions(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [id, token]);

  return (
    <div className="main-content">
      <Link to="/doctor/patients" className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Patient Directory
      </Link>

      <div className="page-header">
        <h1 className="page-title">Patient Electronic Health Record (EHR)</h1>
        <p className="page-subtitle">Patient File ID #{id}</p>
      </div>

      <div className="grid-cols-2">
        {/* Uploaded Diagnostic Reports */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>Uploaded Medical Test Scans</h3>
          {records.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {records.map((r) => (
                <div key={r.id} style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ fontSize: '0.95rem' }}>{r.title}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.date}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Category: {r.record_type}</p>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.35rem' }}>{r.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No test scans uploaded for this patient.</p>
          )}
        </div>

        {/* Issued Prescriptions */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>Prescription History</h3>
          {prescriptions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {prescriptions.map((p) => (
                <div key={p.id} style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ fontSize: '0.95rem' }}>{p.diagnosis}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.date}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--primary)', marginTop: '0.25rem' }}>Doctor: {p.doctor_name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No past prescriptions found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
