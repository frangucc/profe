import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to Neon PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on database client', err);
  process.exit(-1);
});

// Initialize database schema
export async function initializeDatabase() {
  try {
    const schemaSQL = fs.readFileSync(`${__dirname}/schema.sql`, 'utf-8');
    await pool.query(schemaSQL);
    console.log('✅ Database schema initialized');

    // Seed initial data if needed
    await seedInitialData();
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

// Seed initial data
async function seedInitialData() {
  try {
    // Check if we have any users
    const result = await pool.query('SELECT COUNT(*) FROM users');
    const userCount = parseInt(result.rows[0].count);

    if (userCount > 0) {
      console.log('✅ Database already has data, skipping seed');
      return;
    }

    console.log('📝 Seeding initial data...');

    // Hash passwords
    const saltRounds = 10;

    // Create demo users
    const demoPassword = await bcrypt.hash('player123', saltRounds);
    const coachPassword = await bcrypt.hash('coach123', saltRounds);
    const adminPassword = await bcrypt.hash('admin123', saltRounds);

    const userInserts = `
      INSERT INTO users (email, password_hash, first_name, last_name, user_type, avatar) VALUES
      ('player@profe.com', $1, 'Marcus', 'Silva', 'player', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus'),
      ('coach@profe.com', $2, 'Sarah', 'Johnson', 'coach', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'),
      ('admin@profe.com', $3, 'Admin', 'User', 'admin', NULL)
      RETURNING id, user_type;
    `;

    const userResult = await pool.query(userInserts, [demoPassword, coachPassword, adminPassword]);
    const [player, coach, admin] = userResult.rows;

    // Create player profile
    await pool.query(`
      INSERT INTO player_profiles (user_id, age, skill_level, primary_position, secondary_positions, onboarding_completed)
      VALUES ($1, 16, 'Intermediate', 'Central Midfielder', ARRAY['Attacking Midfielder', 'Defensive Midfielder'], true)
    `, [player.id]);

    // Create coach profile
    await pool.query(`
      INSERT INTO coach_profiles (user_id, specialization, years_experience, bio)
      VALUES ($1, 'Midfield Play', 12, 'Experienced coach specializing in midfield development')
    `, [coach.id]);

    // Create sample courses
    const courseInserts = `
      INSERT INTO courses (title, description, position, skill_level, duration, thumbnail, instructor_id) VALUES
      ('Midfield Fundamentals', 'Master the basics of central midfield play including positioning, passing, and vision.', 'Central Midfielder', 'Beginner', '4 weeks', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400', $1),
      ('Advanced Pressing Techniques', 'Learn how to press effectively as a midfielder and win the ball back in dangerous areas.', 'Central Midfielder', 'Advanced', '3 weeks', 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400', $1),
      ('Attacking Midfielder Playmaking', 'Develop your creativity and decision-making in the final third.', 'Attacking Midfielder', 'Intermediate', '5 weeks', 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400', $1)
      RETURNING id;
    `;

    const courseResult = await pool.query(courseInserts, [coach.id]);

    // Create lessons for first course
    const course1Id = courseResult.rows[0].id;
    await pool.query(`
      INSERT INTO lessons (course_id, title, description, lesson_type, duration, order_index) VALUES
      ($1, 'Introduction to Central Midfield', 'Overview of the central midfield role', 'video', '15 min', 1),
      ($1, 'Positioning Between Lines', 'Finding space between defensive and attacking lines', 'video', '20 min', 2),
      ($1, 'First Touch & Ball Control', 'Developing technical skills for midfield play', 'interactive', '25 min', 3)
    `, [course1Id]);

    // Enroll player in first course
    await pool.query(`
      INSERT INTO course_enrollments (user_id, course_id, progress)
      VALUES ($1, $2, 65)
    `, [player.id, course1Id]);

    // Create user stats
    await pool.query(`
      INSERT INTO user_stats (user_id, courses_enrolled, videos_uploaded, current_streak, skills_improved)
      VALUES ($1, 2, 3, 8, 12)
    `, [player.id]);

    console.log('✅ Initial data seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}

export default pool;
