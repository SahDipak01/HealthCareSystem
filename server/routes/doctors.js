import express from 'express';
import { dbGet, dbAll, dbRun } from '../db.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// List all doctors with search and filtering
router.get('/', async (req, res) => {
  try {
    const { search, specialty, city } = req.query;
    let sql = `
      SELECT d.*, u.name, u.email, u.phone
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ` AND (u.name LIKE ? OR d.specialty LIKE ? OR d.clinic_name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (specialty && specialty !== 'all') {
      sql += ` AND d.specialty LIKE ?`;
      params.push(`%${specialty}%`);
    }

    if (city && city !== 'all') {
      sql += ` AND d.city LIKE ?`;
      params.push(`%${city}%`);
    }

    sql += ` ORDER BY d.rating DESC`;

    const doctors = await dbAll(sql, params);
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch doctors list' });
  }
});

// Get single doctor details
router.get('/:id', async (req, res) => {
  try {
    const doctor = await dbGet(
      `SELECT d.*, u.name, u.email, u.phone
       FROM doctors d
       JOIN users u ON d.user_id = u.id
       WHERE d.id = ?`,
      [req.params.id]
    );

    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch doctor details' });
  }
});

// Doctor profile update
router.put('/profile', authenticateToken, requireRole('doctor'), async (req, res) => {
  try {
    const { name, phone, specialty, qualification, experience, clinic_name, city, fee, availability, bio } = req.body;

    if (name || phone) {
      await dbRun('UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone) WHERE id = ?', [name, phone, req.user.id]);
    }

    await dbRun(
      `UPDATE doctors SET
        specialty = COALESCE(?, specialty),
        qualification = COALESCE(?, qualification),
        experience = COALESCE(?, experience),
        clinic_name = COALESCE(?, clinic_name),
        city = COALESCE(?, city),
        fee = COALESCE(?, fee),
        availability = COALESCE(?, availability),
        bio = COALESCE(?, bio)
       WHERE user_id = ?`,
      [specialty, qualification, experience, clinic_name, city, fee, availability, bio, req.user.id]
    );

    res.json({ message: 'Doctor profile updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update doctor profile' });
  }
});

// Get unique patient list for a doctor
router.get('/my/patients', authenticateToken, requireRole('doctor'), async (req, res) => {
  try {
    let doctorId = req.user.doctorId;
    if (!doctorId) {
      const d = await dbGet('SELECT id FROM doctors WHERE user_id = ?', [req.user.id]);
      if (d) doctorId = d.id;
    }

    const patients = await dbAll(
      `SELECT DISTINCT p.*, u.name, u.email, u.phone
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       JOIN users u ON p.user_id = u.id
       WHERE a.doctor_id = ?`,
      [doctorId]
    );

    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch patient list' });
  }
});

export default router;
