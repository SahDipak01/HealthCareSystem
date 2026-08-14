import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Search, CreditCard, ShieldCheck } from 'lucide-react';

const PatientRegistry = () => {
  const { token } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/patients', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setPatients(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">National Patient Registry</h1>
        <p className="page-subtitle">Centralized database of citizens registered with Ayushman Bharat ABHA Health IDs</p>
      </div>

      {loading ? (
        <p>Loading patient registry...</p>
      ) : patients.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>ABHA Health ID</th>
                <th>Email Contact</th>
                <th>Phone Number</th>
                <th>Blood Group</th>
                <th>Registered Date</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.name}</strong></td>
                  <td>
                    <span className="badge badge-completed" style={{ fontFamily: 'monospace' }}>
                      <CreditCard size={14} /> {p.abha_id || '91-8492-3849-1029'}
                    </span>
                  </td>
                  <td>{p.email}</td>
                  <td>{p.phone || '+91 98765 43210'}</td>
                  <td><strong>{p.blood_group || 'O+'}</strong></td>
                  <td>{p.created_at ? p.created_at.split('T')[0] : '2026-08-14'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Users size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3>No patient records found</h3>
        </div>
      )}
    </div>
  );
};

export default PatientRegistry;
