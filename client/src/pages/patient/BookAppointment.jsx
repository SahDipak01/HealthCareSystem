import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, Stethoscope, AlertCircle } from 'lucide-react';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:30 AM');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/doctors/${doctorId}`)
      .then((res) => res.json())
      .then((data) => setDoctor(data));
  }, [doctorId]);

  const availableSlots = ['09:30 AM', '10:30 AM', '11:45 AM', '02:00 PM', '03:30 PM', '05:00 PM'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          doctor_id: parseInt(doctorId),
          date,
          time,
          symptoms
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit booking');

      navigate('/patient/appointments');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) return <div className="main-content"><p>Loading doctor information...</p></div>;

  return (
    <div className="main-content" style={{ maxWidth: '800px' }}>
      <div className="page-header">
        <h1 className="page-title">Book Consultation Appointment</h1>
        <p className="page-subtitle">Schedule a consultation with {doctor.name} ({doctor.specialty})</p>
      </div>

      <div className="card">
        {error && (
          <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Doctor Info Banner */}
          <div style={{ background: 'var(--primary-light)', padding: '1.25rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <Stethoscope style={{ color: 'var(--primary)' }} size={32} />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-hover)' }}>{doctor.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}>{doctor.specialty} • Consultation Fee: <strong>₹{doctor.fee}</strong></p>
            </div>
          </div>

          {/* Date Picker */}
          <div className="form-group">
            <label className="form-label">Select Preferred Date</label>
            <input
              type="date"
              className="form-input"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Time Slot Selection Chips */}
          <div className="form-group">
            <label className="form-label">Select Time Slot</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className="btn"
                  style={{
                    background: time === slot ? 'var(--primary)' : 'white',
                    color: time === slot ? 'white' : 'var(--text-dark)',
                    border: '1px solid var(--border-color)',
                    padding: '0.65rem',
                    fontSize: '0.85rem'
                  }}
                  onClick={() => setTime(slot)}
                >
                  <Clock size={14} /> {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms Input */}
          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label className="form-label">Primary Symptoms / Reason for Visit</label>
            <textarea
              className="form-textarea"
              rows="4"
              placeholder="Describe your health symptoms, duration, or any relevant medical history..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              required
            ></textarea>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.85rem' }} disabled={loading}>
              {loading ? 'Submitting Appointment...' : 'Confirm Appointment Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
