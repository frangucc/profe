import express from 'express';
import pool from '../db.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all courses with filters
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { position, age_group, level, phase } = req.query;
    const userId = req.user.id;

    let query = `
      SELECT
        c.*,
        p.name as position_name,
        ag.name as age_group_name,
        f.name as formation_name,
        ph.name as phase_name,
        u.first_name || ' ' || u.last_name as instructor_name,
        COALESCE(e.progress, 0) as progress,
        CASE WHEN e.id IS NOT NULL THEN true ELSE false END as enrolled,
        (SELECT COUNT(*) FROM modules WHERE course_id = c.id) as modules
      FROM courses c
      LEFT JOIN positions_enhanced p ON c.position_id = p.id
      LEFT JOIN age_groups ag ON c.age_group_id = ag.id
      LEFT JOIN formations f ON c.formation_id = f.id
      LEFT JOIN phases ph ON c.phase_id = ph.id
      LEFT JOIN users u ON c.created_by = u.id
      LEFT JOIN course_enrollments e ON c.id = e.course_id AND e.user_id = $1
      WHERE c.published = true
    `;

    const params = [userId];
    let paramIndex = 2;

    if (position) {
      query += ` AND c.position_id = $${paramIndex}`;
      params.push(position);
      paramIndex++;
    }

    if (age_group) {
      query += ` AND c.age_group_id = $${paramIndex}`;
      params.push(age_group);
      paramIndex++;
    }

    if (level) {
      query += ` AND c.level = $${paramIndex}`;
      params.push(level);
      paramIndex++;
    }

    if (phase) {
      query += ` AND c.phase_id = $${paramIndex}`;
      params.push(phase);
      paramIndex++;
    }

    query += ` ORDER BY c.created_at DESC`;

    const result = await pool.query(query, params);
    res.json({ courses: result.rows });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Failed to get courses' });
  }
});

// Get single course with modules
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const courseResult = await pool.query(`
      SELECT
        c.*,
        p.name as position_name,
        ag.name as age_group_name,
        f.name as formation_name,
        ph.name as phase_name,
        u.first_name || ' ' || u.last_name as instructor_name,
        COALESCE(e.progress, 0) as progress,
        CASE WHEN e.id IS NOT NULL THEN true ELSE false END as enrolled
      FROM courses c
      LEFT JOIN positions_enhanced p ON c.position_id = p.id
      LEFT JOIN age_groups ag ON c.age_group_id = ag.id
      LEFT JOIN formations f ON c.formation_id = f.id
      LEFT JOIN phases ph ON c.phase_id = ph.id
      LEFT JOIN users u ON c.created_by = u.id
      LEFT JOIN course_enrollments e ON c.id = e.course_id AND e.user_id = $1
      WHERE c.id = $2
    `, [userId, id]);

    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const course = courseResult.rows[0];

    // Get modules with content
    const modulesResult = await pool.query(`
      SELECT
        m.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', mc.id,
              'content_type', mc.content_type,
              'title', mc.title,
              'content_url', mc.content_url,
              'duration_minutes', mc.duration_minutes,
              'sort_order', mc.sort_order,
              'completed', COALESCE(mp.completed, false)
            ) ORDER BY mc.sort_order
          ) FILTER (WHERE mc.id IS NOT NULL),
          '[]'
        ) as content
      FROM modules m
      LEFT JOIN module_content mc ON m.id = mc.module_id
      LEFT JOIN module_progress mp ON mc.id = mp.content_id AND mp.user_id = $1
      WHERE m.course_id = $2
      GROUP BY m.id
      ORDER BY m.sort_order
    `, [userId, id]);

    course.modules = modulesResult.rows;
    course.lessons = modulesResult.rows; // For backwards compatibility

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

    await pool.query(`
      INSERT INTO course_enrollments (user_id, course_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, course_id) DO NOTHING
    `, [userId, id]);

    // Update stats
    await pool.query(`
      UPDATE user_stats
      SET courses_enrolled = courses_enrolled + 1
      WHERE user_id = $1
    `, [userId]);

    res.json({ success: true });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
});

// Mark content as complete
router.post('/content/:contentId/complete', authenticateToken, async (req, res) => {
  try {
    const { contentId } = req.params;
    const userId = req.user.id;
    const { quiz_score } = req.body;

    // Get module_id from content
    const contentResult = await pool.query(
      'SELECT module_id FROM module_content WHERE id = $1',
      [contentId]
    );

    if (contentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }

    const moduleId = contentResult.rows[0].module_id;

    await pool.query(`
      INSERT INTO module_progress (user_id, module_id, content_id, completed, quiz_score, completed_at)
      VALUES ($1, $2, $3, true, $4, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, module_id, content_id)
      DO UPDATE SET completed = true, quiz_score = $4, completed_at = CURRENT_TIMESTAMP
    `, [userId, moduleId, contentId, quiz_score]);

    // Update course enrollment progress
    const courseResult = await pool.query(`
      SELECT m.course_id
      FROM modules m
      WHERE m.id = $1
    `, [moduleId]);

    if (courseResult.rows.length > 0) {
      const courseId = courseResult.rows[0].course_id;

      // Calculate progress
      const progressResult = await pool.query(`
        SELECT
          COUNT(mc.id) as total_content,
          COUNT(mp.id) FILTER (WHERE mp.completed = true) as completed_content
        FROM modules m
        JOIN module_content mc ON m.id = mc.module_id
        LEFT JOIN module_progress mp ON mc.id = mp.content_id AND mp.user_id = $1
        WHERE m.course_id = $2
      `, [userId, courseId]);

      const { total_content, completed_content } = progressResult.rows[0];
      const progress = total_content > 0 ? Math.round((completed_content / total_content) * 100) : 0;

      await pool.query(`
        UPDATE course_enrollments
        SET progress = $1, last_accessed = CURRENT_TIMESTAMP,
            completed_at = CASE WHEN $1 >= 100 THEN CURRENT_TIMESTAMP ELSE NULL END
        WHERE user_id = $2 AND course_id = $3
      `, [progress, userId, courseId]);

      // If course completed, update player profile
      if (progress >= 100) {
        await pool.query(`
          UPDATE player_profiles
          SET total_courses_completed = total_courses_completed + 1
          WHERE user_id = $1
        `, [userId]);
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Mark complete error:', error);
    res.status(500).json({ error: 'Failed to mark content as complete' });
  }
});

// Create course (admin only)
router.post('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const {
      title,
      description,
      position_id,
      age_group_id,
      formation_id,
      phase_id,
      level,
      duration_weeks,
      thumbnail_url
    } = req.body;

    const result = await pool.query(`
      INSERT INTO courses (
        title, description, position_id, age_group_id, formation_id, phase_id,
        level, duration_weeks, thumbnail_url, created_by, published
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)
      RETURNING *
    `, [
      title, description, position_id, age_group_id, formation_id, phase_id,
      level, duration_weeks, thumbnail_url, req.user.id
    ]);

    res.json({ course: result.rows[0] });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Add module to course (admin only)
router.post('/:id/modules', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, objective, concept, sort_order } = req.body;

    const result = await pool.query(`
      INSERT INTO modules (course_id, title, description, objective, concept, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [id, title, description, objective, concept, sort_order || 0]);

    res.json({ module: result.rows[0] });
  } catch (error) {
    console.error('Create module error:', error);
    res.status(500).json({ error: 'Failed to create module' });
  }
});

// Add content to module (admin only)
router.post('/modules/:moduleId/content', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { content_type, title, content_url, content_data, duration_minutes, sort_order } = req.body;

    const result = await pool.query(`
      INSERT INTO module_content (
        module_id, content_type, title, content_url, content_data, duration_minutes, sort_order
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [moduleId, content_type, title, content_url, content_data, duration_minutes, sort_order || 0]);

    res.json({ content: result.rows[0] });
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({ error: 'Failed to create content' });
  }
});

export default router;
