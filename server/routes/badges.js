import express from 'express';
import pool from '../db.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all badges
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT
        b.*,
        CASE WHEN pb.id IS NOT NULL THEN true ELSE false END as earned,
        pb.earned_at
      FROM badges b
      LEFT JOIN player_badges pb ON b.id = pb.badge_id AND pb.user_id = $1
      ORDER BY b.category, b.tier, b.name
    `, [userId]);

    res.json({ badges: result.rows });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({ error: 'Failed to get badges' });
  }
});

// Get player's earned badges
router.get('/earned', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT b.*, pb.earned_at
      FROM player_badges pb
      JOIN badges b ON pb.badge_id = b.id
      WHERE pb.user_id = $1
      ORDER BY pb.earned_at DESC
    `, [userId]);

    res.json({ badges: result.rows });
  } catch (error) {
    console.error('Get earned badges error:', error);
    res.status(500).json({ error: 'Failed to get earned badges' });
  }
});

// Award badge to player (system/admin only)
router.post('/:badgeId/award', authenticateToken, async (req, res) => {
  try {
    const { badgeId } = req.params;
    const { user_id } = req.body;
    const targetUserId = user_id || req.user.id;

    // Check if already earned
    const existing = await pool.query(
      'SELECT * FROM player_badges WHERE user_id = $1 AND badge_id = $2',
      [targetUserId, badgeId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Badge already earned' });
    }

    await pool.query(`
      INSERT INTO player_badges (user_id, badge_id)
      VALUES ($1, $2)
    `, [targetUserId, badgeId]);

    // Update player profile badge count
    await pool.query(`
      UPDATE player_profiles
      SET total_badges_earned = total_badges_earned + 1
      WHERE user_id = $1
    `, [targetUserId]);

    res.json({ success: true });
  } catch (error) {
    console.error('Award badge error:', error);
    res.status(500).json({ error: 'Failed to award badge' });
  }
});

// Create badge (admin only)
router.post('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { name, description, category, tier, icon_url, criteria, points } = req.body;

    const result = await pool.query(`
      INSERT INTO badges (name, description, category, tier, icon_url, criteria, points)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [name, description, category, tier, icon_url, criteria, points || 0]);

    res.json({ badge: result.rows[0] });
  } catch (error) {
    console.error('Create badge error:', error);
    res.status(500).json({ error: 'Failed to create badge' });
  }
});

export default router;
