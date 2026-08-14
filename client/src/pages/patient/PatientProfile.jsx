import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Phone, MapPin, Heart, AlertCircle, Save, CheckCircle2 } from 'lucide-react';

const PatientProfile = () => {
  const { user, token } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dob, setDob] = useState('1995-04-12');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [height, setHeight] = useState('168');
  const [weight, setWeight] = useState('62');
  const [address, setAddress] = useState('Flat 402, Green Valley Heights, New Delhi');
  const [emergencyContact, setEmergencyContact] = useState('+91 98765 00000');
  const [allergies, setAllergies] = useState('Penicillin, Peanuts (Mild)');
  const [preExistingConditions, setPreExistingConditions] = useState('Mild Asthma');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;
    fetch('/api/patients/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          if (data.dob) setDob(data.dob);
          if (data.blood_group) setBloodGroup(data.blood_group);
          if (data.height) setHeight(data.height);
          if (data.weight) setWeight(data.weight);
          if (data.address) setAddress(data.address);
          if (data.emergency_contact) setEmergencyContact(data.emergency_contact);
          if (data.allergies) setAllergies(data.allergies);
          if (data.pre_existing_conditions) setPreExistingConditions(data.pre_existing_conditions);
        }
      });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/patients/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          phone,
          dob,
          blood_group: bloodGroup,
          height: parseFloat(height),
          weight: parseFloat(weight),
          address,
          emergency_contact: emergencyContact,
          allergies,
          pre_existing_conditions: preExistingConditions
        })
      });

      if (!res.ok) throw new Error('Failed to update profile');
      setMessage('Profile and health biometrics updated successfully!');
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
        <h1 className="page-title">Patient Profile & Biometrics</h1>
        <p className="page-subtitle">Manage personal information, blood group, allergies, and emergency contacts</p>
      </div>

      <div className="card">
        {message && (
          <div style={{ background: '#dcfce7', color: '#15803d', padding: '0.85rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <CheckCircle2 size={18} /> {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <h3 className="card-title" style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Personal Identification
          </h3>

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Contact</label>
              <input type="text" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
          </div>

          <h3 className="card-title" style={{ marginTop: '1.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Biometrics & Clinical Vitals
          </h3>

          <div className="grid-cols-4">
            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select className="form-select" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Height (cm)</label>
              <input type="number" className="form-input" value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input type="number" className="form-input" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input type="date" className="form-input" value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Residential Address</label>
            <input type="text" className="form-input" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div className="grid-cols-2" style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Known Allergies</label>
              <input type="text" className="form-input" placeholder="e.g. Penicillin, Pollen" value={allergies} onChange={(e) => setAllergies(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Emergency Helpline Contact</label>
              <input type="text" className="form-input" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '0.85rem' }} disabled={loading}>
            <Save size={18} /> {loading ? 'Saving Changes...' : 'Save Profile & Biometrics'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientProfile;
