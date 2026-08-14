import express from 'express';
import { dbGet, dbAll, dbRun } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Book new appointment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { doctor_id, date, time, symptoms } = req.body;

    if (!doctor_id || !date || !time) {
      return res.status(400).json({ error: 'Doctor ID, date, and time slot are required' });
    }

    // Resolve patient ID
    let patientId = req.user.patientId;
    if (!patientId) {
      const p = await dbGet('SELECT id FROM patients WHERE user_id = ?', [req.user.id]);
      if (!p) return res.status(400).json({ error: 'Patient profile not found for current user' });
      patientId = p.id;
    }

    const doctor = await dbGet(
      `SELECT d.*, u.name as doctor_name FROM doctors d JOIN users u ON d.user_id = u.id WHERE d.id = ?`,
      [doctor_id]
    );

    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

    const patientUser = await dbGet('SELECT name FROM users WHERE id = ?', [req.user.id]);

    const result = await dbRun(
      `INSERT INTO appointments (patient_id, doctor_id, patient_name, doctor_name, doctor_specialty, date, time, status, symptoms)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [
        patientId,
        doctor_id,
        patientUser.name,
        doctor.doctor_name,
        doctor.specialty,
        date,
        time,
        symptoms || 'General consultation'
      ]
    );

    // Create notification for patient
    await dbRun(
      `INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)`,
      [
        req.user.id,
        'Appointment Booked',
        `Your request for ${doctor.specialty} with ${doctor.doctor_name} on ${date} at ${time} is pending doctor confirmation.`,
        'info'
      ]
    );

    // Create notification for doctor
    await dbRun(
      `INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)`,
      [
        doctor.user_id,
        'New Appointment Request',
        `Patient ${patientUser.name} requested an appointment on ${date} at ${time}.`,
        'warning'
      ]
    );

    res.status(201).json({
      message: 'Appointment request submitted successfully',
      appointmentId: result.lastID
    });
  } catch (err) {
    console.error('Book appointment error:', err);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

// List appointments for current user (Patient / Doctor / Admin)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let sql = `SELECT * FROM appointments`;
    const params = [];

    if (req.user.role === 'patient') {
      let patientId = req.user.patientId;
      if (!patientId) {
        const p = await dbGet('SELECT id FROM patients WHERE user_id = ?', [req.user.id]);
        patientId = p ? p.id : null;
      }
      sql += ` WHERE patient_id = ?`;
      params.push(patientId);
    } else if (req.user.role === 'doctor') {
      let doctorId = req.user.doctorId;
      if (!doctorId) {
        const d = await dbGet('SELECT id FROM doctors WHERE user_id = ?', [req.user.id]);
        doctorId = d ? d.id : null;
      }
      sql += ` WHERE doctor_id = ?`;
      params.push(doctorId);
    }

    sql += ` ORDER BY date DESC, time DESC`;

    const appointments = await dbAll(sql, params);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Get single appointment details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const appointment = await dbGet('SELECT * FROM appointments WHERE id = ?', [req.params.id]);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointment details' });
  }
});

// Update appointment status (approved, completed, cancelled)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const appt = await dbGet('SELECT * FROM appointments WHERE id = ?', [req.params.id]);
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });

    await dbRun('UPDATE appointments SET status = ? WHERE id = ?', [status, req.params.id]);

    // Send notifications to patient
    const pat = await dbGet('SELECT user_id FROM patients WHERE id = ?', [appt.patient_id]);
    if (pat) {
      let msgType = 'info';
      if (status === 'approved') msgType = 'success';
      else if (status === 'cancelled') msgType = 'coral';

      await dbRun(
        `INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)`,
        [
          pat.user_id,
          `Appointment ${status.toUpperCase()}`,
          `Your appointment with ${appt.doctor_name} for ${appt.date} is now marked as ${status}.`,
          msgType
        ]
      );
    }

    res.json({ message: `Appointment status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update appointment status' });
  }
});

// Save consultation notes
router.put('/:id/consultation', authenticateToken, async (req, res) => {
  try {
    const { consultation_notes } = req.body;
    await dbRun('UPDATE appointments SET consultation_notes = ? WHERE id = ?', [consultation_notes, req.params.id]);
    res.json({ message: 'Consultation notes saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save consultation notes' });
  }
});

export default router;
