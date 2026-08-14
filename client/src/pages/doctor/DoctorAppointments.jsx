import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/RiskBadge';
import { Calendar, CheckCircle2, XCircle, Stethoscope, FilePlus } from 'lucide-react';

const DoctorAppointments = () => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, [token]);

  const fetchAppointments = () => {
    setLoading(true);
    fetch('/api/appointments', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setAppointments(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  const handleUpdateStatus = async (id, newStatus) => {
    await fetch(`/api/appointments/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    fetchAppointments();
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Appointments Schedule Manager</h1>
        <p className="page-subtitle">Review appointment requests, confirm bookings, or complete consultation visits</p>
      </div>

      {loading ? (
        <p>Loading schedule...</p>
      ) : appointments.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Requested Date</th>
                <th>Slot Time</th>
                <th>Symptoms Intake</th>
                <th>Status</th>
                <th>Status Management</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td><strong>{a.patient_name}</strong></td>
                  <td>{a.date}</td>
                  <td>{a.time}</td>
                  <td style={{ maxWidth: '220px' }}>{a.symptoms}</td>
                  <td><StatusBadge status={a.status} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {a.status === 'pending' && (
                        <button onClick={() => handleUpdateStatus(a.id, 'approved')} className="btn btn-primary btn-sm">
                          <CheckCircle2 size={14} /> Confirm
                        </button>
                      )}

                      {a.status === 'approved' && (
                        <Link to={`/doctor/consultation/${a.id}`} className="btn btn-primary btn-sm">
                          <Stethoscope size={14} /> Start Consultation
                        </Link>
                      )}

                      {a.status !== 'cancelled' && a.status !== 'completed' && (
                        <button onClick={() => handleUpdateStatus(a.id, 'cancelled')} className="btn btn-secondary btn-sm" style={{ color: '#ef4444' }}>
                          <XCircle size={14} /> Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Calendar size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3>No appointments scheduled</h3>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
