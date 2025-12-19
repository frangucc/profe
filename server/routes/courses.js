import express from 'express';
import pool from '../db.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all courses
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { position, level, enrolled } = req.query;
    const userId = req.user.id;

    let query = `
      SELECT c.*,
        u.first_name || ' ' || u.last_name as instructor_name,
        COALESCE(e.progress, 0) as progress,
        CASE WHEN e.id IS NOT NULL THEN true ELSE false END as enrolled,
        (SELECT COUNT(*) FROM lessons WHERE course_id = c.id) as modules
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      LEFT JOIN course_enrollments e ON c.id = e.course_id AND e.user_id = $1
      WHERE 1=1
    `;

    const params = [userId];
    let paramCount = 1;

    if (position) {
      paramCount++;
      query += ` AND c.position = $${paramCount}`;
      params.push(position);
    }

    if (level) {
      paramCount++;
      query += ` AND c.skill_level = $${paramCount}`;
      params.push(level);
    }

    if (enrolled === 'true') {
      query += ` AND e.id IS NOT NULL`;
    } else if (enrolled === 'false') {
      query += ` AND e.id IS NULL`;
    }

    query += ' ORDER BY c.created_at DESC';

    const result = await pool.query(query, params);
    res.json({ courses: result.rows });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Failed to get courses' });
  }
});

// Get course by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const courseResult = await pool.query(`
      SELECT c.*,
        u.first_name || ' ' || u.last_name as instructor_name,
        COALESCE(e.progress, 0) as progress,
        CASE WHEN e.id IS NOT NULL THEN true ELSE false END as enrolled
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      LEFT JOIN course_enrollments e ON c.id = e.course_id AND e.user_id = $1
      WHERE c.id = $2
    `, [userId, id]);

    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const course = courseResult.rows[0];

    // Get lessons
    const lessonsResult = await pool.query(`
      SELECT l.*,
        CASE WHEN lp.completed THEN true ELSE false END as completed
      FROM lessons l
      LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = $1
      WHERE l.course_id = $2
      ORDER BY l.order_index ASC
    `, [userId, id]);

    course.lessons = lessonsResult.rows;
    course.modules = lessonsResult.rows.length;

    res.json({ course });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Failed to get course' });
  }
});

// Enroll in course
router.post('/:id/enroll', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if already enrolled
    const existing = await pool.query(
      'SELECT * FROM course_enrollments WHERE user_id = $1 AND course_id = $2',
      [userId, id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    await pool.query(
      'INSERT INTO course_enrollments (user_id, course_id) VALUES ($1, $2)',
      [userId, id]
    );

    // Update stats
    await pool.query(
      'UPDATE user_stats SET courses_enrolled = courses_enrolled + 1 WHERE user_id = $1',
      [userId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Enroll in course error:', error);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
});

// Create course (admin/coach only)
router.post('/', authenticateToken, requireRole('admin', 'coach'), async (req, res) => {
  try {
    const { title, description, position, skill_level, duration, thumbnail } = req.body;
    const instructorId = req.user.id;

    const result = await pool.query(`
      INSERT INTO courses (title, description, position, skill_level, duration, thumbnail, instructor_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [title, description, position, skill_level, duration, thumbnail, instructorId]);

    res.json({ course: result.rows[0] });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

export default router;
