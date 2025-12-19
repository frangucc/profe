import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get survey questions
router.get('/questions', authenticateToken, async (req, res) => {
  try {
    const questions = [
      {
        id: 'age',
        question: 'How old are you?',
        type: 'number',
        required: true
      },
      {
        id: 'primary_position',
        question: 'What is your primary position?',
        type: 'select',
        options: [
          'Goalkeeper',
          'Center Back',
          'Full Back',
          'Wing Back',
          'Defensive Midfielder',
          'Central Midfielder',
          'Attacking Midfielder',
          'Winger',
          'Striker'
        ],
        required: true
      },
      {
        id: 'skill_level',
        question: 'How would you rate your current skill level?',
        type: 'select',
        options: ['Beginner', 'Intermediate', 'Advanced', 'Professional'],
        required: true
      },
      {
        id: 'secondary_positions',
        question: 'What other positions would you like to learn?',
        type: 'multiselect',
        options: [
          'Goalkeeper',
          'Center Back',
          'Full Back',
          'Wing Back',
          'Defensive Midfielder',
          'Central Midfielder',
          'Attacking Midfielder',
          'Winger',
          'Striker'
        ],
        required: false
      },
      {
        id: 'training_frequency',
        question: 'How often do you currently train?',
        type: 'select',
        options: ['1-2 times per week', '3-4 times per week', '5-6 times per week', 'Daily'],
        required: true
      },
      {
        id: 'team_level',
        question: 'What level do you play at?',
        type: 'select',
        options: ['Recreational', 'School Team', 'Club Team', 'Academy', 'Semi-Professional', 'Professional'],
        required: true
      },
      {
        id: 'goals_ambitions',
        question: 'Tell us about your soccer dreams and ambitions! Where do you see yourself in 5 years? What drives you to play? What are your biggest goals?',
        type: 'textarea',
        placeholder: 'Share your passion, dreams, and what motivates you to become a better player. There are no wrong answers - we want to understand YOUR unique journey and aspirations!',
        required: true,
        rows: 6
      }
    ];

    res.json({ questions });
  } catch (error) {
    console.error('Get survey questions error:', error);
    res.status(500).json({ error: 'Failed to get survey questions' });
  }
});

// Submit survey responses
router.post('/submit', authenticateToken, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { responses } = req.body;
    const userId = req.user.id;

    // Update player profile
    const {
      age,
      primary_position,
      skill_level,
      secondary_positions,
      goals_ambitions
    } = responses;

    await client.query(`
      UPDATE player_profiles
      SET age = $1,
          primary_position = $2,
          skill_level = $3,
          secondary_positions = $4,
          goals_ambitions = $5,
          onboarding_completed = true,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $6
    `, [
      age,
      primary_position,
      skill_level,
      secondary_positions || [],
      goals_ambitions,
      userId
    ]);

    // Store all survey responses
    for (const [questionId, answer] of Object.entries(responses)) {
      const questionText = getQuestionText(questionId);
      const answerText = Array.isArray(answer) ? answer.join(', ') : answer.toString();

      await client.query(`
        INSERT INTO survey_responses (user_id, question_id, question_text, answer)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id) DO UPDATE
        SET answer = EXCLUDED.answer, created_at = CURRENT_TIMESTAMP
      `, [userId, questionId, questionText, answerText]);
    }

    await client.query('COMMIT');

    res.json({ success: true, message: 'Survey submitted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Submit survey error:', error);
    res.status(500).json({ error: 'Failed to submit survey' });
  } finally {
    client.release();
  }
});

// Helper function to get question text by ID
function getQuestionText(questionId) {
  const questions = {
    age: 'How old are you?',
    primary_position: 'What is your primary position?',
    skill_level: 'How would you rate your current skill level?',
    secondary_positions: 'What other positions would you like to learn?',
    training_frequency: 'How often do you currently train?',
    team_level: 'What level do you play at?',
    goals_ambitions: 'Tell us about your soccer dreams and ambitions!'
  };
  return questions[questionId] || questionId;
}

export default router;
