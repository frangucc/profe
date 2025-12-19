import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, userType, age, primaryPosition, skillLevel } = req.body;

    // Check if user exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`;
    const userResult = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, user_type, avatar) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, first_name, last_name, user_type, avatar',
      [email, passwordHash, firstName, lastName, userType, avatar]
    );

    const user = userResult.rows[0];

    // Create profile based on user type
    if (userType === 'player') {
      await pool.query(
        'INSERT INTO player_profiles (user_id, age, primary_position, skill_level, onboarding_completed) VALUES ($1, $2, $3, $4, false)',
        [user.id, age || null, primaryPosition || 'Central Midfielder', skillLevel || 'Beginner']
      );

      // Create user stats
      await pool.query(
        'INSERT INTO user_stats (user_id) VALUES ($1)',
        [user.id]
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ user, token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Get additional profile data
    let profile = null;
    if (user.user_type === 'player') {
      const profileResult = await pool.query(
        'SELECT * FROM player_profiles WHERE user_id = $1',
        [user.id]
      );
      profile = profileResult.rows[0];
    } else if (user.user_type === 'coach') {
      const profileResult = await pool.query(
        'SELECT * FROM coach_profiles WHERE user_id = $1',
        [user.id]
      );
      profile = profileResult.rows[0];
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password hash from response
    delete user.password_hash;

    res.json({
      user: { ...user, ...profile },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userResult = await pool.query(
      'SELECT id, email, first_name, last_name, user_type, avatar FROM users WHERE id = $1',
      [decoded.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Get profile data
    if (user.user_type === 'player') {
      const profileResult = await pool.query(
        'SELECT * FROM player_profiles WHERE user_id = $1',
        [user.id]
      );
      if (profileResult.rows.length > 0) {
        Object.assign(user, profileResult.rows[0]);
      }
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

export default router;
