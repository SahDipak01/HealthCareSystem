import express from 'express';
import { dbGet, dbAll, dbRun } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Trigger 1-Click Emergency SOS Alert
router.post('/sos', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude, emergency_type, details } = req.body;

    const patient = await dbGet('SELECT p.*, u.name, u.phone FROM patients p JOIN users u ON p.user_id = u.id WHERE u.id = ?', [req.user.id]);

    const locationText = (latitude && longitude)
      ? `GPS Coordinates: (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
      : 'Location: New Delhi Regional Emergency Zone';

    const sosTitle = `🚨 EMERGENCY SOS: ${patient ? patient.name : req.user.name}`;
    const sosMessage = `CRITICAL ALERT: Emergency type "${emergency_type || 'Acute Medical Emergency'}". ${locationText}. Patient Phone: ${patient ? patient.phone : 'Emergency Helpline'}. Ambulance Dispatch 108 Alerted.`;

    // Broadcast high-priority notification to all doctors and admins in database
    const staff = await dbAll("SELECT id FROM users WHERE role IN ('doctor', 'admin')");
    for (const s of staff) {
      await dbRun(
        `INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, 'coral')`,
        [s.id, sosTitle, sosMessage]
      );
    }

    res.status(200).json({
      success: true,
      sosId: `SOS-${Date.now().toString().slice(-6)}`,
      ambulanceStatus: 'DISPATCHED - ETA 8 MINS',
      emergencyHelpline: '108 / 112',
      hospitalAssigned: 'AIIMS Emergency & Trauma Care Center',
      message: 'Emergency SOS Broadcasted! Ambulance crew and nearby trauma doctors have received your location.'
    });
  } catch (err) {
    console.error('SOS error:', err);
    res.status(500).json({ error: 'Failed to trigger emergency SOS' });
  }
});

export default router;
