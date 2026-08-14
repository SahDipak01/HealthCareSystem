import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, Clock, Save, CheckCircle2 } from 'lucide-react';

const DoctorProfile = () => {
  const { user, token } = useAuth();
  const [specialty, setSpecialty] = useState('General Physician');
  const [qualification, setQualification] = useState('MBBS, MD');
  const [experience, setExperience] = useState('10');
  const [clinicName, setClinicName] = useState('City Health Care Clinic');
  const [city, setCity] = useState('New Delhi');
  const [fee, setFee] = useState('600');
  const [availability, setAvailability] = useState('Mon - Sat (10:00 AM - 04:00 PM)');
  const [bio, setBio] = useState('Experienced medical practitioner specializing in internal medicine, preventative health screenings, and holistic primary care.');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;
    fetch('/api/doctors/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          if (data.specialty) setSpecialty(data.specialty);
          if (data.qualification) setQualification(data.qualification);
          if (data.experience) setExperience(data.experience);
          if (data.clinic_name) setClinicName(data.clinic_name);
          if (data.city) setCity(data.city);
          if (data.fee) setFee(data.fee);
          if (data.availability) setAvailability(data.availability);
          if (data.bio) setBio(data.bio);
        }
      });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/doctors/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          specialty,
          qualification,
          experience: parseInt(experience),
          clinic_name: clinicName,
          city,
          fee: parseFloat(fee),
          availability,
          bio
        })
      });

      if (!res.ok) throw new Error('Failed to update doctor profile');
      setMessage('Doctor clinical profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content" style={{ maxWidth: '850px' }}>
      <div className="page-header">
        <h1 className="page-title">Doctor Profile & Practice Settings</h1>
        <p className="page-subtitle">Manage clinical specialty, consultation fee, and clinic working hours</p>
      </div>

      <div className="card">
        {message && (
          <div style={{ background: '#dcfce7', color: '#15803d', padding: '0.85rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <CheckCircle2 size={18} /> {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Medical Specialty</label>
              <input type="text" className="form-input" value={specialty} onChange={(e) => setSpecialty(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Degrees & Qualifications</label>
              <input type="text" className="form-input" value={qualification} onChange={(e) => setQualification(e.target.value)} required />
            </div>
          </div>

          <div className="grid-cols-3">
            <div className="form-group">
              <label className="form-label">Years of Experience</label>
              <input type="number" className="form-input" value={experience} onChange={(e) => setExperience(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Consultation Fee (₹)</label>
              <input type="number" className="form-input" value={fee} onChange={(e) => setFee(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Practice City Location</label>
              <input type="text" className="form-input" value={city} onChange={(e) => setCity(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Clinic / Hospital Facility Name</label>
            <input type="text" className="form-input" value={clinicName} onChange={(e) => setClinicName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Weekly Schedule & Working Hours</label>
            <input type="text" className="form-input" value={availability} onChange={(e) => setAvailability(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Physician Biography</label>
            <textarea className="form-textarea" rows="4" value={bio} onChange={(e) => setBio(e.target.value)} required></textarea>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={loading}>
            <Save size={18} /> {loading ? 'Saving Profile...' : 'Save Doctor Profile Settings'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfile;
