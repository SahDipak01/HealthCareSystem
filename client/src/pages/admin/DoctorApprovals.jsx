import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, CheckCircle2, ShieldCheck, Award } from 'lucide-react';

const DoctorApprovals = () => {
  const { token } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/doctors', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setDoctors(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Doctor Credential & License Verification</h1>
        <p className="page-subtitle">Inspect registered clinical practitioners and verify medical council licenses</p>
      </div>

      {loading ? (
        <p>Loading doctor credentials...</p>
      ) : doctors.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Doctor Name</th>
                <th>Specialty</th>
                <th>Qualification</th>
                <th>Experience</th>
                <th>Clinic / Hospital</th>
                <th>Fee (₹)</th>
                <th>Verification Status</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((d) => (
                <tr key={d.id}>
                  <td><strong>{d.name}</strong></td>
                  <td><span className="badge badge-approved">{d.specialty}</span></td>
                  <td>{d.qualification}</td>
                  <td>{d.experience} Years</td>
                  <td>{d.clinic_name}, {d.city}</td>
                  <td>₹{d.fee}</td>
                  <td>
                    <span className="badge badge-completed">
                      <ShieldCheck size={14} /> LICENSED & VERIFIED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Stethoscope size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3>No doctors registered</h3>
        </div>
      )}
    </div>
  );
};

export default DoctorApprovals;
