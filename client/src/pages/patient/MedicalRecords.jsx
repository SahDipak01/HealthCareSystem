import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FileText, Upload, Download, Eye, FileCheck } from 'lucide-react';

const MedicalRecords = () => {
  const { token } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/patients/records', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setRecords(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="main-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Electronic Medical Records (EHR)</h1>
          <p className="page-subtitle">Centralized medical history, lab reports, and diagnostic scans</p>
        </div>
        <Link to="/patient/upload-report" className="btn btn-primary">
          <Upload size={18} /> Upload New Report
        </Link>
      </div>

      {loading ? (
        <p>Loading medical records...</p>
      ) : records.length > 0 ? (
        <div className="grid-cols-2">
          {records.map((r) => (
            <div key={r.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.6rem', borderRadius: '10px' }}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{r.title}</h3>
                    <span className="badge badge-completed" style={{ marginTop: '0.25rem' }}>{r.record_type}</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.date}</span>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                <strong>Attending Doctor:</strong> {r.doctor_name || 'Self Uploaded'}
              </p>
              <p style={{ color: 'var(--text-dark)', fontSize: '0.9rem', marginBottom: '1.25rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                {r.description || 'No additional summary notes.'}
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <a href={r.file_url || '#'} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                  <Eye size={14} /> View File PDF
                </a>
                <a href={r.file_url || '#'} download className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                  <Download size={14} /> Download
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <FileCheck size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3>No medical records uploaded yet</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Click "Upload New Report" to save lab test results into your ABHA vault.</p>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;
