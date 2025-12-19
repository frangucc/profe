-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('player', 'coach', 'admin', 'parent')),
  avatar VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player profiles table
CREATE TABLE IF NOT EXISTS player_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  age INTEGER,
  skill_level VARCHAR(50),
  primary_position VARCHAR(100),
  secondary_positions TEXT[], -- Array of positions
  joined_date DATE DEFAULT CURRENT_DATE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  goals_ambitions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Parent-player relationships
CREATE TABLE IF NOT EXISTS parent_players (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  player_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  relationship VARCHAR(50), -- 'mother', 'father', 'guardian', etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(parent_id, player_id)
);

-- Coach profiles table
CREATE TABLE IF NOT EXISTS coach_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  specialization VARCHAR(200),
  years_experience INTEGER,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  position VARCHAR(100),
  skill_level VARCHAR(50),
  duration VARCHAR(50),
  thumbnail VARCHAR(500),
  instructor_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  lesson_type VARCHAR(50), -- 'video', 'interactive', 'drill'
  duration VARCHAR(50),
  video_url VARCHAR(500),
  content TEXT,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Course enrollments
CREATE TABLE IF NOT EXISTS course_enrollments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_accessed TIMESTAMP,
  UNIQUE(user_id, course_id)
);

-- Lesson progress
CREATE TABLE IF NOT EXISTS lesson_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, lesson_id)
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_type VARCHAR(50), -- 'match', 'training', 'drill', 'highlights'
  upload_date DATE DEFAULT CURRENT_DATE,
  duration VARCHAR(50),
  thumbnail VARCHAR(500),
  video_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'analyzed'
  player_notes TEXT,
  acknowledged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coach comments on videos
CREATE TABLE IF NOT EXISTS video_comments (
  id SERIAL PRIMARY KEY,
  video_id INTEGER REFERENCES videos(id) ON DELETE CASCADE,
  coach_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  timestamp VARCHAR(20), -- e.g., "12:34"
  comment TEXT NOT NULL,
  comment_type VARCHAR(50), -- 'positive', 'improvement'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Training plans
CREATE TABLE IF NOT EXISTS training_plans (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  coach_id INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  week_starting DATE,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'archived'
  focus_areas TEXT[], -- Array of focus areas
  coach_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Training sessions
CREATE TABLE IF NOT EXISTS training_sessions (
  id SERIAL PRIMARY KEY,
  training_plan_id INTEGER REFERENCES training_plans(id) ON DELETE CASCADE,
  day_of_week VARCHAR(20),
  session_type VARCHAR(100),
  exercises TEXT[], -- Array of exercises
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User stats
CREATE TABLE IF NOT EXISTS user_stats (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  courses_enrolled INTEGER DEFAULT 0,
  courses_completed INTEGER DEFAULT 0,
  videos_uploaded INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  skills_improved INTEGER DEFAULT 0,
  last_activity DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Onboarding survey responses
CREATE TABLE IF NOT EXISTS survey_responses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  question_id VARCHAR(100),
  question_text TEXT,
  answer TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_player_profiles_user_id ON player_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON videos(user_id);
CREATE INDEX IF NOT EXISTS idx_training_plans_user_id ON training_plans(user_id);
