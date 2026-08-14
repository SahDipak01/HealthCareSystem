import express from 'express';
import { dbGet, dbAll, dbRun } from '../db.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get patient profile by user id or patient id
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const patient = await dbGet(
      `SELECT p.*, u.name, u.email, u.phone
       FROM patients p
       JOIN users u ON p.user_id = u.id
       WHERE p.user_id = ?`,
      [req.user.id]
    );

    if (!patient) return res.status(404).json({ error: 'Patient profile not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch patient profile' });
  }
});

// Update patient profile details
router.put('/profile', authenticateToken, requireRole('patient'), async (req, res) => {
  try {
    const { name, phone, dob, blood_group, height, weight, address, emergency_contact, allergies, pre_existing_conditions } = req.body;

    // Update user table
    if (name || phone) {
      await dbRun('UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone) WHERE id = ?', [name, phone, req.user.id]);
    }

    // Update patient table
    await dbRun(
      `UPDATE patients SET
        dob = COALESCE(?, dob),
        blood_group = COALESCE(?, blood_group),
        height = COALESCE(?, height),
        weight = COALESCE(?, weight),
        address = COALESCE(?, address),
        emergency_contact = COALESCE(?, emergency_contact),
        allergies = COALESCE(?, allergies),
        pre_existing_conditions = COALESCE(?, pre_existing_conditions)
       WHERE user_id = ?`,
      [dob, blood_group, height, weight, address, emergency_contact, allergies, pre_existing_conditions, req.user.id]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update patient profile' });
  }
});

// Get patient medical records
router.get('/records', authenticateToken, async (req, res) => {
  try {
    let patientId = req.user.patientId;
    if (!patientId && req.user.role === 'patient') {
      const p = await dbGet('SELECT id FROM patients WHERE user_id = ?', [req.user.id]);
      if (p) patientId = p.id;
    }

    // If query param patient_id provided (e.g. for doctor view)
    if (req.query.patient_id) {
      patientId = req.query.patient_id;
    }

    const records = await dbAll('SELECT * FROM medical_records WHERE patient_id = ? ORDER BY date DESC', [patientId]);
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch medical records' });
  }
});

// Upload/Add new medical report record
router.post('/records', authenticateToken, requireRole('patient', 'doctor'), async (req, res) => {
  try {
    const { title, record_type, doctor_name, date, file_url, description, patient_id } = req.body;

    let targetPatientId = patient_id;
    if (!targetPatientId && req.user.role === 'patient') {
      const p = await dbGet('SELECT id FROM patients WHERE user_id = ?', [req.user.id]);
      targetPatientId = p ? p.id : null;
    }

    if (!title || !record_type) {
      return res.status(400).json({ error: 'Title and record_type are required' });
    }

    const result = await dbRun(
      `INSERT INTO medical_records (patient_id, title, record_type, doctor_name, date, file_url, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        targetPatientId,
        title,
        record_type,
        doctor_name || 'Self Uploaded',
        date || new Date().toISOString().split('T')[0],
        file_url || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        description || ''
      ]
    );

    res.status(201).json({ message: 'Medical report saved successfully', id: result.lastID });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save medical report' });
  }
});

// Get digital prescriptions for patient
router.get('/prescriptions', authenticateToken, async (req, res) => {
  try {
    let patientId = req.user.patientId;
    if (!patientId && req.user.role === 'patient') {
      const p = await dbGet('SELECT id FROM patients WHERE user_id = ?', [req.user.id]);
      if (p) patientId = p.id;
    }

    if (req.query.patient_id) {
      patientId = req.query.patient_id;
    }

    const prescriptions = await dbAll('SELECT * FROM prescriptions WHERE patient_id = ? ORDER BY date DESC', [patientId]);
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
});

export default router;
