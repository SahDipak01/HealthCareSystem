import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity, User, Mail, Lock, Phone, Stethoscope, Building } from 'lucide-react';

const Register = () => {
  const [role, setRole] = useState('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  // Doctor specific state
  const [specialty, setSpecialty] = useState('General Physician');
  const [qualification, setQualification] = useState('MBBS, MD');
  const [experience, setExperience] = useState('8');
  const [city, setCity] = useState('New Delhi');
  const [fee, setFee] = useState('500');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name,
        email,
        password,
        role,
        phone,
        specialty,
        qualification,
        experience,
        city,
        fee
      };

      const newUser = await register(payload);
      if (newUser.role === 'patient') navigate('/patient/dashboard');
      else if (newUser.role === 'doctor') navigate('/doctor/dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 140px)', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '540px' }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <Activity style={{ color: 'var(--primary)', margin: '0 auto 0.5rem auto' }} size={36} />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Create SwasthyaConnect Account</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join India's unified digital healthcare network</p>
          </div>

          {error && (
            <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              {error}
            </div>
          )}

          {/* Role selector tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '0.35rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
            <button
              type="button"
              className="btn"
              style={{ flex: 1, background: role === 'patient' ? 'white' : 'transparent', color: role === 'patient' ? 'var(--primary)' : 'var(--text-muted)', boxShadow: role === 'patient' ? 'var(--shadow-sm)' : 'none' }}
              onClick={() => setRole('patient')}
            >
              <User size={16} /> Register as Patient
            </button>
            <button
              type="button"
              className="btn"
              style={{ flex: 1, background: role === 'doctor' ? 'white' : 'transparent', color: role === 'doctor' ? 'var(--secondary)' : 'var(--text-muted)', boxShadow: role === 'doctor' ? 'var(--shadow-sm)' : 'none' }}
              onClick={() => setRole('doctor')}
            >
              <Stethoscope size={16} /> Register as Doctor
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" placeholder="e.g. Dr. Ramesh Gupta" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" placeholder="name@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="text" className="form-input" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {role === 'doctor' && (
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--secondary)' }}>Doctor Clinical Details</h4>
                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Medical Specialty</label>
                    <select className="form-select" value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
                      <option value="General Physician">General Physician</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Neurology">Neurology</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Qualification</label>
                    <input type="text" className="form-input" placeholder="MBBS, MD" value={qualification} onChange={(e) => setQualification(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Experience (Years)</label>
                    <input type="number" className="form-input" value={experience} onChange={(e) => setExperience(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Consultation Fee (₹)</label>
                    <input type="number" className="form-input" value={fee} onChange={(e) => setFee(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Already registered? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
