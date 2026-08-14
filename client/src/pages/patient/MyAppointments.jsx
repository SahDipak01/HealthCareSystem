import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/RiskBadge';
import { Calendar, Clock, Video, XCircle, FileText } from 'lucide-react';

const MyAppointments = () => {
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

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    await fetch(`/api/appointments/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: 'cancelled' })
    });

    fetchAppointments();
  };

  return (
    <div className="main-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">My Appointments</h1>
          <p className="page-subtitle">Track your scheduled doctor consultations and consultation history</p>
        </div>
        <Link to="/patient/doctors" className="btn btn-primary">
          <Calendar size={18} /> Book New Appointment
        </Link>
      </div>

      {loading ? (
        <p>Loading appointments...</p>
      ) : appointments.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Doctor Name</th>
                <th>Specialty</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Symptoms</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td><strong>{a.doctor_name}</strong></td>
                  <td>{a.doctor_specialty}</td>
                  <td>{a.date} at {a.time}</td>
                  <td><StatusBadge status={a.status} /></td>
                  <td style={{ maxWidth: '240px' }}>{a.symptoms}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {(a.status === 'approved' || a.status === 'pending') && (
                        <Link to={`/patient/teleconsult/${a.id}`} className="btn btn-primary btn-sm">
                          <Video size={14} /> Teleconsult
                        </Link>
                      )}

                      {a.status !== 'cancelled' && a.status !== 'completed' && (
                        <button onClick={() => handleCancel(a.id)} className="btn btn-secondary btn-sm" style={{ color: '#ef4444' }}>
                          <XCircle size={14} /> Cancel
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
          <h3>No appointments found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>You haven't booked any consultation appointments yet.</p>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
