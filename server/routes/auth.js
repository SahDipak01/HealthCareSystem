import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbGet, dbRun } from '../db.js';
import { authenticateToken, JWT_SECRET } from '../middleware/auth.js';

const router = express.Router();

// Register new user (Patient or Doctor)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, specialty, qualification, experience, city, fee } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required' });
    }

    const existingUser = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRes = await dbRun(
      'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, phone || '']
    );
    const userId = userRes.lastID;

    // Handle role specific creation
    if (role === 'patient') {
      const abhaId = `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      await dbRun(
        'INSERT INTO patients (user_id, abha_id, blood_group, height, weight) VALUES (?, ?, ?, ?, ?)',
        [userId, abhaId, 'O+', 170, 68]
      );
    } else if (role === 'doctor') {
      await dbRun(
        `INSERT INTO doctors (user_id, specialty, qualification, experience, clinic_name, city, fee, avatar)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          specialty || 'General Physician',
          qualification || 'MBBS',
          experience ? parseInt(experience) : 5,
          'SwasthyaCare Clinic',
          city || 'New Delhi',
          fee ? parseFloat(fee) : 500,
          'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256'
        ]
      );
    }

    const token = jwt.sign({ id: userId, email, role, name }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: userId, name, email, role }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Get specific profile ID
    let patientId = null;
    let doctorId = null;

    if (user.role === 'patient') {
      const p = await dbGet('SELECT id FROM patients WHERE user_id = ?', [user.id]);
      if (p) patientId = p.id;
    } else if (user.role === 'doctor') {
      const d = await dbGet('SELECT id FROM doctors WHERE user_id = ?', [user.id]);
      if (d) doctorId = d.id;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name, patientId, doctorId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        patientId,
        doctorId
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get Current Logged In User
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await dbGet('SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let profileDetails = null;
    if (user.role === 'patient') {
      profileDetails = await dbGet('SELECT * FROM patients WHERE user_id = ?', [user.id]);
    } else if (user.role === 'doctor') {
      profileDetails = await dbGet('SELECT * FROM doctors WHERE user_id = ?', [user.id]);
    }

    res.json({ user, profile: profileDetails });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

export default router;
