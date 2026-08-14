import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Award, Clock, Calendar, CheckCircle2, ArrowLeft } from 'lucide-react';

const DoctorDetails = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/doctors/${id}`)
      .then((res) => res.json())
      .then((data) => setDoctor(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="main-content"><p>Loading doctor profile...</p></div>;
  if (!doctor) return <div className="main-content"><p>Doctor not found.</p></div>;

  return (
    <div className="main-content">
      <Link to="/patient/doctors" className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Doctor Directory
      </Link>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <img
            src={doctor.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256'}
            alt={doctor.name}
            style={{ width: '120px', height: '120px', borderRadius: '16px', objectFit: 'cover' }}
          />

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{doctor.name}</h1>
                <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1rem', marginTop: '0.2rem' }}>{doctor.specialty}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{doctor.qualification}</p>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem 1.5rem', borderRadius: '12px', textAlign: 'right', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CONSULTATION FEE</span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>₹{doctor.fee}</h2>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#b45309' }}>
                <Star size={16} fill="#f59e0b" stroke="#f59e0b" />
                <span style={{ fontWeight: 700 }}>{doctor.rating}</span> ({doctor.review_count} patient reviews)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
                <Award size={16} /> {doctor.experience} Years Experience
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
                <MapPin size={16} /> {doctor.clinic_name}, {doctor.city}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-cols-2">
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>Physician Biography & Specialty Focus</h3>
          <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.95rem' }}>
            {doctor.bio || 'Senior medical practitioner dedicated to providing evidence-based healthcare, preventative screenings, and personalized patient management.'}
          </p>

          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '1.5rem', marginBottom: '0.75rem' }}>Working Clinic Hours</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            <Clock size={18} style={{ color: 'var(--primary)' }} />
            <span>{doctor.availability || 'Mon-Sat (10:00 AM - 04:00 PM)'}</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 className="card-title" style={{ marginBottom: '1rem' }}>Book Consultation Slot</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Choose a convenient date and time slot for either virtual teleconsultation or direct in-clinic visit.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--success)' }} /> Instant Booking Confirmation
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--success)' }} /> ABHA Digital Health Record Sync
              </div>
            </div>
          </div>

          <Link to={`/patient/book/${doctor.id}`} className="btn btn-primary" style={{ padding: '0.85rem', textAlign: 'center' }}>
            <Calendar size={18} /> Proceed to Book Appointment
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
