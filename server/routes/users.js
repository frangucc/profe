import express from 'express';
import pool from '../db.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const userResult = await pool.query(
      'SELECT id, email, first_name, last_name, user_type, avatar FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Get additional data based on user type
    if (user.user_type === 'player') {
      const profileResult = await pool.query(
        'SELECT * FROM player_profiles WHERE user_id = $1',
        [userId]
      );

      const statsResult = await pool.query(
        'SELECT * FROM user_stats WHERE user_id = $1',
        [userId]
      );

      if (profileResult.rows.length > 0) {
        Object.assign(user, profileResult.rows[0]);
      }

      if (statsResult.rows.length > 0) {
        user.stats = statsResult.rows[0];
      }
    } else if (user.user_type === 'coach') {
      const profileResult = await pool.query(
        'SELECT * FROM coach_profiles WHERE user_id = $1',
        [userId]
      );

      if (profileResult.rows.length > 0) {
        Object.assign(user, profileResult.rows[0]);
      }
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, age, skill_level, primary_position, secondary_positions } = req.body;

    // Update user table
    if (firstName || lastName) {
      await pool.query(
        'UPDATE users SET first_name = COALESCE($1, first_name), last_name = COALESCE($2, last_name), updated_at = CURRENT_TIMESTAMP WHERE id = $3',
        [firstName, lastName, userId]
      );
    }

    // Update player profile if exists
    if (req.user.user_type === 'player') {
      await pool.query(`
        UPDATE player_profiles
        SET age = COALESCE($1, age),
            skill_level = COALESCE($2, skill_level),
            primary_position = COALESCE($3, primary_position),
            secondary_positions = COALESCE($4, secondary_positions),
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $5
      `, [age, skill_level, primary_position, secondary_positions, userId]);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get all users (admin only)
router.get('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.email, u.first_name, u.last_name, u.user_type, u.avatar, u.created_at,
        pp.age, pp.skill_level, pp.primary_position,
        cp.specialization, cp.years_experience
      FROM users u
      LEFT JOIN player_profiles pp ON u.id = pp.user_id
      LEFT JOIN coach_profiles cp ON u.id = cp.user_id
      ORDER BY u.created_at DESC
    `);

    res.json({ users: result.rows });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Get dashboard stats
router.get('/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const statsResult = await pool.query(
      'SELECT * FROM user_stats WHERE user_id = $1',
      [userId]
    );

    const achievementsResult = await pool.query(
      'SELECT * FROM achievements WHERE user_id = $1 ORDER BY achieved_at DESC LIMIT 3',
      [userId]
    );

    const enrolledCoursesResult = await pool.query(`
      SELECT c.*, e.progress
      FROM course_enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = $1
      ORDER BY e.last_accessed DESC
    `, [userId]);

    res.json({
      stats: statsResult.rows[0] || {},
      achievements: achievementsResult.rows,
      enrolledCourses: enrolledCoursesResult.rows
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
});

export default router;
