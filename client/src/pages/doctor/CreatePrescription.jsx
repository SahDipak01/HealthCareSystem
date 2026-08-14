import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Pill, Plus, Trash2, CheckCircle2, FilePlus } from 'lucide-react';

const CreatePrescription = () => {
  const { appointmentId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [patientId, setPatientId] = useState(1);
  const [diagnosis, setDiagnosis] = useState('');
  const [instructions, setInstructions] = useState('');
  const [medicines, setMedicines] = useState([
    { name: 'Paracetamol 500mg', dosage: '1 tablet after meals (1-0-1)', duration: '5 days' }
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (appointmentId) {
      fetch(`/api/appointments/${appointmentId}`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => res.json())
        .then((data) => {
          setAppointment(data);
          setPatientId(data.patient_id);
          if (data.symptoms) setDiagnosis(`Diagnosis for ${data.symptoms}`);
        });
    }
  }, [appointmentId, token]);

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '1 tablet twice daily', duration: '3 days' }]);
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          appointment_id: appointmentId ? parseInt(appointmentId) : null,
          patient_id: patientId,
          diagnosis,
          medicines,
          instructions
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to issue prescription');

      navigate('/doctor/dashboard');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content" style={{ maxWidth: '850px' }}>
      <div className="page-header">
        <h1 className="page-title">Issue Digital E-Prescription</h1>
        <p className="page-subtitle">
          {appointment ? `Patient: ${appointment.patient_name} • Appointment #${appointment.id}` : 'Create standalone digital prescription'}
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Clinical Diagnosis / Condition</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Acute Viral Bronchitis / Upper Respiratory Infection"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="card-title" style={{ fontSize: '1.05rem' }}>Prescribed Medicines</h3>
              <button type="button" onClick={handleAddMedicine} className="btn btn-secondary btn-sm">
                <Plus size={16} /> Add Medicine
              </button>
            </div>

            {medicines.map((m, idx) => (
              <div key={idx} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '0.75rem' }}>
                <div className="grid-cols-3" style={{ alignItems: 'flex-end' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Medicine Name & Strength</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Amoxicillin 500mg"
                      value={m.name}
                      onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Dosage Schedule</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 1 cap twice daily after meals"
                      value={m.dosage}
                      onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                      <label className="form-label">Duration</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 7 days"
                        value={m.duration}
                        onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                        required
                      />
                    </div>

                    {medicines.length > 1 && (
                      <button type="button" onClick={() => handleRemoveMedicine(idx)} className="btn btn-secondary btn-sm" style={{ color: '#ef4444', height: '42px', marginTop: 'auto' }}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="form-group">
            <label className="form-label">Dietary & Lifestyle Instructions</label>
            <textarea
              className="form-textarea"
              rows="3"
              placeholder="e.g. Drink warm fluids, avoid cold food items, take adequate rest for 3 days..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={loading}>
            <FilePlus size={18} /> {loading ? 'Issuing Prescription...' : 'Sign & Issue Digital Prescription'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePrescription;
