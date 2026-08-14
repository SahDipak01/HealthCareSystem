import express from 'express';
import { dbGet, dbAll, dbRun } from '../db.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Create digital prescription (Doctor only)
router.post('/', authenticateToken, requireRole('doctor'), async (req, res) => {
  try {
    const { appointment_id, patient_id, diagnosis, medicines, instructions } = req.body;

    if (!patient_id || !diagnosis || !medicines) {
      return res.status(400).json({ error: 'Patient ID, diagnosis, and medicines array are required' });
    }

    let doctorId = req.user.doctorId;
    if (!doctorId) {
      const d = await dbGet('SELECT id FROM doctors WHERE user_id = ?', [req.user.id]);
      doctorId = d ? d.id : null;
    }

    const doctor = await dbGet(
      `SELECT u.name as doctor_name FROM doctors d JOIN users u ON d.user_id = u.id WHERE d.id = ?`,
      [doctorId]
    );

    const patient = await dbGet(
      `SELECT u.name as patient_name, p.user_id FROM patients p JOIN users u ON p.user_id = u.id WHERE p.id = ?`,
      [patient_id]
    );

    const medicinesJson = typeof medicines === 'string' ? medicines : JSON.stringify(medicines);

    const result = await dbRun(
      `INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, patient_name, doctor_name, date, diagnosis, medicines_json, instructions)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        appointment_id || null,
        patient_id,
        doctorId,
        patient ? patient.patient_name : 'Patient',
        doctor ? doctor.doctor_name : req.user.name,
        new Date().toISOString().split('T')[0],
        diagnosis,
        medicinesJson,
        instructions || ''
      ]
    );

    // Also mark appointment as completed if appointment_id is linked
    if (appointment_id) {
      await dbRun("UPDATE appointments SET status = 'completed' WHERE id = ?", [appointment_id]);
    }

    // Send notification to patient
    if (patient) {
      await dbRun(
        `INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)`,
        [
          patient.user_id,
          'New Digital Prescription Issued',
          `${doctor ? doctor.doctor_name : 'Doctor'} issued a digital prescription for your recent visit.`,
          'success'
        ]
      );
    }

    res.status(201).json({
      message: 'Digital prescription created successfully',
      prescriptionId: result.lastID
    });
  } catch (err) {
    console.error('Prescription create error:', err);
    res.status(500).json({ error: 'Failed to create digital prescription' });
  }
});

// Get single prescription
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const prescription = await dbGet('SELECT * FROM prescriptions WHERE id = ?', [req.params.id]);
    if (!prescription) return res.status(404).json({ error: 'Prescription not found' });
    res.json(prescription);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch prescription details' });
  }
});

export default router;
