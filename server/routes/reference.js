import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all age groups
router.get('/age-groups', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM age_groups ORDER BY age_min ASC
    `);
    res.json({ ageGroups: result.rows });
  } catch (error) {
    console.error('Get age groups error:', error);
    res.status(500).json({ error: 'Failed to get age groups' });
  }
});

// Get age group for specific age
router.get('/age-groups/for-age/:age', authenticateToken, async (req, res) => {
  try {
    const { age } = req.params;

    const result = await pool.query(`
      SELECT * FROM age_groups
      WHERE $1 BETWEEN age_min AND age_max
      LIMIT 1
    `, [age]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No age group found for this age' });
    }

    res.json({ ageGroup: result.rows[0] });
  } catch (error) {
    console.error('Get age group error:', error);
    res.status(500).json({ error: 'Failed to get age group' });
  }
});

// Get all positions
router.get('/positions', authenticateToken, async (req, res) => {
  try {
    const { unit } = req.query;

    let query = 'SELECT * FROM positions_enhanced';
    const params = [];

    if (unit) {
      query += ' WHERE unit = $1';
      params.push(unit);
    }

    query += ' ORDER BY sort_order ASC';

    const result = await pool.query(query, params);
    res.json({ positions: result.rows });
  } catch (error) {
    console.error('Get positions error:', error);
    res.status(500).json({ error: 'Failed to get positions' });
  }
});

// Get all formations
router.get('/formations', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM formations ORDER BY name ASC
    `);
    res.json({ formations: result.rows });
  } catch (error) {
    console.error('Get formations error:', error);
    res.status(500).json({ error: 'Failed to get formations' });
  }
});

// Get all phases
router.get('/phases', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM phases ORDER BY sort_order ASC
    `);
    res.json({ phases: result.rows });
  } catch (error) {
    console.error('Get phases error:', error);
    res.status(500).json({ error: 'Failed to get phases' });
  }
});

// Get all principles
router.get('/principles', authenticateToken, async (req, res) => {
  try {
    const { category } = req.query;

    let query = 'SELECT * FROM principles';
    const params = [];

    if (category) {
      query += ' WHERE category = $1';
      params.push(category);
    }

    query += ' ORDER BY category, name ASC';

    const result = await pool.query(query, params);
    res.json({ principles: result.rows });
  } catch (error) {
    console.error('Get principles error:', error);
    res.status(500).json({ error: 'Failed to get principles' });
  }
});

// Get all action patterns
router.get('/action-patterns', authenticateToken, async (req, res) => {
  try {
    const { type } = req.query;

    let query = 'SELECT * FROM action_patterns';
    const params = [];

    if (type) {
      query += ' WHERE type = $1';
      params.push(type);
    }

    query += ' ORDER BY name ASC';

    const result = await pool.query(query, params);
    res.json({ actionPatterns: result.rows });
  } catch (error) {
    console.error('Get action patterns error:', error);
    res.status(500).json({ error: 'Failed to get action patterns' });
  }
});

// Get all philosophies
router.get('/philosophies', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM philosophies ORDER BY name ASC
    `);
    res.json({ philosophies: result.rows });
  } catch (error) {
    console.error('Get philosophies error:', error);
    res.status(500).json({ error: 'Failed to get philosophies' });
  }
});

// Get position objectives by position, phase, and age group
router.get('/objectives', authenticateToken, async (req, res) => {
  try {
    const { position_id, phase_id, age_group_id } = req.query;

    let query = `
      SELECT
        ppo.*,
        p.name as position_name,
        ph.name as phase_name,
        ag.name as age_group_name
      FROM position_phase_objectives ppo
      JOIN positions_enhanced p ON ppo.position_id = p.id
      JOIN phases ph ON ppo.phase_id = ph.id
      JOIN age_groups ag ON ppo.age_group_id = ag.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (position_id) {
      query += ` AND ppo.position_id = $${paramIndex}`;
      params.push(position_id);
      paramIndex++;
    }

    if (phase_id) {
      query += ` AND ppo.phase_id = $${paramIndex}`;
      params.push(phase_id);
      paramIndex++;
    }

    if (age_group_id) {
      query += ` AND ppo.age_group_id = $${paramIndex}`;
      params.push(age_group_id);
      paramIndex++;
    }

    query += ' ORDER BY ag.age_min, ph.sort_order';

    const result = await pool.query(query, params);
    res.json({ objectives: result.rows });
  } catch (error) {
    console.error('Get objectives error:', error);
    res.status(500).json({ error: 'Failed to get objectives' });
  }
});

export default router;
