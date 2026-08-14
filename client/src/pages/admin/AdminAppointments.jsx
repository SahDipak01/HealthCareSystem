import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/RiskBadge';
import { Calendar, ClipboardList } from 'lucide-react';

const AdminAppointments = () => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/appointments', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setAppointments(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">National Consultation Audit Log</h1>
        <p className="page-subtitle">Complete log of all patient-doctor consultation bookings across the platform</p>
      </div>

      {loading ? (
        <p>Loading appointments log...</p>
      ) : appointments.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Doctor Name</th>
                <th>Specialty</th>
                <th>Date & Time</th>
                <th>Intake Symptoms</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td><strong>{a.patient_name}</strong></td>
                  <td>{a.doctor_name}</td>
                  <td>{a.doctor_specialty}</td>
                  <td>{a.date} at {a.time}</td>
                  <td style={{ maxWidth: '240px' }}>{a.symptoms}</td>
                  <td><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <ClipboardList size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3>No appointments recorded</h3>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;
