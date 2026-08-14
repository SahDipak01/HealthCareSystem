import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Activity, ShieldAlert, BarChart, Download, FileText } from 'lucide-react';

const HealthReports = () => {
  const { token } = useAuth();
  const [reports, setReports] = useState(null);

  useEffect(() => {
    fetch('/api/admin/reports', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setReports(data));
  }, [token]);

  return (
    <div className="main-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Disease Prevalence & Epidemiological Reports</h1>
          <p className="page-subtitle">Government health monitoring, disease outbreak metrics, and clinical statistics</p>
        </div>
        <button onClick={() => window.print()} className="btn btn-primary">
          <Download size={18} /> Export Government Report (PDF)
        </button>
      </div>

      <div className="grid-cols-2" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '1.25rem' }}>Top Medical Disease Categories (Active Cases)</h3>
          {reports?.diseasePrevalence ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reports.diseasePrevalence.map((d, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.9rem', fontWeight: 600 }}>
                    <span>{d.category}</span>
                    <span style={{ color: 'var(--primary)' }}>{d.cases} cases ({d.percentage}%)</span>
                  </div>
                  <div style={{ background: '#e2e8f0', height: '10px', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ background: 'var(--primary)', height: '100%', width: `${d.percentage * 2}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Loading disease analytics...</p>
          )}
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>Public Health Directives & Recommendations</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
            <li style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <strong style={{ color: 'var(--primary)' }}>Seasonal Influenza Advisory:</strong> High concentration of upper respiratory tract complaints noted in urban zones. Primary health centers alerted.
            </li>
            <li style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <strong style={{ color: 'var(--secondary)' }}>Cardiovascular Screening Drive:</strong> Hypertension screening expansion proposed for citizens above 45 years.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HealthReports;
