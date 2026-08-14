import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, FilePlus, Save, CheckCircle2, Video } from 'lucide-react';

const Consultation = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch(`/api/appointments/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        setAppointment(data);
        if (data.consultation_notes) setNotes(data.consultation_notes);
      });
  }, [id, token]);

  const handleSaveNotes = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/appointments/${id}/consultation`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ consultation_notes: notes })
      });

      if (!res.ok) throw new Error('Failed to save notes');
      setSuccess('Consultation notes saved successfully!');
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!appointment) return <div className="main-content"><p>Loading consultation record...</p></div>;

  return (
    <div className="main-content" style={{ maxWidth: '900px' }}>
      <div className="page-header">
        <h1 className="page-title">Active Clinical Consultation</h1>
        <p className="page-subtitle">Patient: <strong>{appointment.patient_name}</strong> • Scheduled Date: {appointment.date} ({appointment.time})</p>
      </div>

      <div className="grid-cols-2" style={{ alignItems: 'flex-start' }}>
        {/* Patient Symptoms Banner */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>Patient Reported Intake Symptoms</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-dark)' }}>{appointment.symptoms || 'General wellness consultation'}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to={`/patient/teleconsult/${appointment.id}`} className="btn btn-primary">
              <Video size={18} /> Enter HD Virtual Consultation Room
            </Link>
            <Link to={`/doctor/prescriptions/new/${appointment.id}`} className="btn btn-secondary">
              <FilePlus size={18} /> Issue Digital Prescription
            </Link>
          </div>
        </div>

        {/* Doctor Clinical Notes Editor */}
        <div className="card">
          {success && (
            <div style={{ background: '#dcfce7', color: '#15803d', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} /> {success}
            </div>
          )}

          <h3 className="card-title" style={{ marginBottom: '1rem' }}>Doctor Examination & Notes</h3>
          <form onSubmit={handleSaveNotes}>
            <div className="form-group">
              <label className="form-label">Clinical Observations & Vitals</label>
              <textarea
                className="form-textarea"
                rows="8"
                placeholder="Document patient blood pressure, respiratory sounds, tentative diagnosis, and follow-up clinical instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              <Save size={18} /> {loading ? 'Saving Notes...' : 'Save Consultation Record'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Consultation;
