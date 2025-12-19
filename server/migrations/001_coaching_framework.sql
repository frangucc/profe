-- ProFe Coaching Framework Migration
-- Implements the 6-axis ontology: Age × Position × Formation × Phase × Principle × Action

-- ============================================================================
-- FOUNDATIONAL TABLES (The 6 Axes)
-- ============================================================================

-- 1. AGE GROUPS
CREATE TABLE IF NOT EXISTS age_groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  age_min INTEGER NOT NULL,
  age_max INTEGER NOT NULL,
  cognitive_focus TEXT NOT NULL,
  awareness_scope TEXT NOT NULL,
  ignore_complexity TEXT, -- What to intentionally hide at this age
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. POSITIONS (Enhanced)
CREATE TABLE IF NOT EXISTS positions_enhanced (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  abbreviation VARCHAR(10),
  unit VARCHAR(50) NOT NULL CHECK (unit IN ('Defensive', 'Midfield', 'Attacking')),
  sort_order INTEGER,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. FORMATIONS
CREATE TABLE IF NOT EXISTS formations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  archetype VARCHAR(100),
  structure JSONB, -- {"defense": ["RB", "RCB", "LCB", "LB"], ...}
  diagram_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. PHASES
CREATE TABLE IF NOT EXISTS phases (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  abbreviation VARCHAR(10),
  description TEXT,
  sort_order INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. PRINCIPLES
CREATE TABLE IF NOT EXISTS principles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Attacking', 'Defensive')),
  definition TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. ACTION PATTERNS
CREATE TABLE IF NOT EXISTS action_patterns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  type VARCHAR(50) NOT NULL, -- 'RUN_TYPE', 'PASS_TYPE', 'DECISION'
  description TEXT NOT NULL,
  purpose TEXT,
  trigger_condition TEXT,
  expected_outcome TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- CONTENT TABLES (What Attaches to the Axes)
-- ============================================================================

-- POSITION × PHASE × AGE OBJECTIVES
CREATE TABLE IF NOT EXISTS position_phase_objectives (
  id SERIAL PRIMARY KEY,
  position_id INTEGER NOT NULL REFERENCES positions_enhanced(id) ON DELETE CASCADE,
  phase_id INTEGER NOT NULL REFERENCES phases(id) ON DELETE CASCADE,
  age_group_id INTEGER NOT NULL REFERENCES age_groups(id) ON DELETE CASCADE,
  primary_objective TEXT NOT NULL,
  secondary_objectives TEXT[],
  cognitive_complexity INTEGER CHECK (cognitive_complexity BETWEEN 1 AND 5),
  key_concepts TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(position_id, phase_id, age_group_id)
);

-- ENHANCED COURSES TABLE (drop old, create new)
DROP TABLE IF EXISTS course_enrollments CASCADE;
DROP TABLE IF EXISTS lesson_progress CASCADE;
DROP TABLE IF EXISTS courses CASCADE;

CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  position_id INTEGER REFERENCES positions_enhanced(id),
  age_group_id INTEGER REFERENCES age_groups(id),
  formation_id INTEGER REFERENCES formations(id) NULL,
  phase_id INTEGER REFERENCES phases(id) NULL,
  level VARCHAR(50) DEFAULT 'Bronze', -- 'Bronze', 'Silver', 'Gold', 'Elite'
  duration_weeks INTEGER,
  thumbnail_url VARCHAR(500),
  created_by INTEGER REFERENCES users(id),
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MODULES (Within Courses)
CREATE TABLE IF NOT EXISTS modules (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  objective TEXT NOT NULL,
  concept TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MODULE CONTENT (Videos, Drills, Quizzes, etc.)
CREATE TABLE IF NOT EXISTS module_content (
  id SERIAL PRIMARY KEY,
  module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('video', 'drill', 'quiz', 'scenario', 'reading', 'interactive')),
  title VARCHAR(255) NOT NULL,
  content_url VARCHAR(500),
  content_data JSONB, -- Flexible storage for quizzes, drills, etc.
  duration_minutes INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PATTERN CATALOG (Playbook Generator)
CREATE TABLE IF NOT EXISTS pattern_catalog (
  id SERIAL PRIMARY KEY,
  action_pattern_id INTEGER NOT NULL REFERENCES action_patterns(id),
  position_id INTEGER REFERENCES positions_enhanced(id),
  formation_id INTEGER REFERENCES formations(id) NULL,
  phase_id INTEGER NOT NULL REFERENCES phases(id),
  age_group_id INTEGER NOT NULL REFERENCES age_groups(id),
  diagram_url VARCHAR(500),
  video_url VARCHAR(500),
  instructions TEXT,
  coaching_points TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- GAMIFICATION TABLES
-- ============================================================================

-- BADGES
CREATE TABLE IF NOT EXISTS badges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Cognitive', 'Tactical', 'Defensive', 'Attacking', 'Playbook', 'Social')),
  tier VARCHAR(20) CHECK (tier IN ('Bronze', 'Silver', 'Gold', 'Elite')),
  icon_url VARCHAR(500),
  criteria JSONB, -- {"courses_completed": 5, "quiz_avg_score": 80}
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PLAYER BADGES (Earned)
CREATE TABLE IF NOT EXISTS player_badges (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id INTEGER NOT NULL REFERENCES badges(id),
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, badge_id)
);

-- ============================================================================
-- LEARNING PATH TABLES
-- ============================================================================

-- LEARNING PATHS (Personalized Curriculum)
CREATE TABLE IF NOT EXISTS learning_paths (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  position_id INTEGER NOT NULL REFERENCES positions_enhanced(id),
  age_group_id INTEGER NOT NULL REFERENCES age_groups(id),
  current_course_id INTEGER REFERENCES courses(id) NULL,
  completed_courses INTEGER[] DEFAULT '{}',
  recommended_courses INTEGER[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- COURSE ENROLLMENTS (Recreated)
CREATE TABLE IF NOT EXISTS course_enrollments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  UNIQUE(user_id, course_id)
);

-- MODULE PROGRESS
CREATE TABLE IF NOT EXISTS module_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  content_id INTEGER REFERENCES module_content(id) ON DELETE CASCADE NULL,
  completed BOOLEAN DEFAULT FALSE,
  quiz_score INTEGER NULL,
  time_spent_minutes INTEGER DEFAULT 0,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, module_id, content_id)
);

-- ============================================================================
-- PHILOSOPHY LAYER
-- ============================================================================

CREATE TABLE IF NOT EXISTS philosophies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  core_values TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add philosophy references to content
ALTER TABLE courses ADD COLUMN IF NOT EXISTS philosophy_id INTEGER REFERENCES philosophies(id) NULL;
ALTER TABLE pattern_catalog ADD COLUMN IF NOT EXISTS philosophy_id INTEGER REFERENCES philosophies(id) NULL;

-- ============================================================================
-- ENHANCED PLAYER PROFILES
-- ============================================================================

ALTER TABLE player_profiles
ADD COLUMN IF NOT EXISTS formation_familiarity INTEGER[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS phase_strengths JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS cognitive_level INTEGER DEFAULT 1 CHECK (cognitive_level BETWEEN 1 AND 5),
ADD COLUMN IF NOT EXISTS learning_path_id INTEGER REFERENCES learning_paths(id) NULL,
ADD COLUMN IF NOT EXISTS total_courses_completed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_badges_earned INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_streak_days INTEGER DEFAULT 0;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_courses_position ON courses(position_id);
CREATE INDEX IF NOT EXISTS idx_courses_age_group ON courses(age_group_id);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_modules_course ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_module_content_module ON module_content(module_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_player_badges_user ON player_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_pattern_catalog_position ON pattern_catalog(position_id);
CREATE INDEX IF NOT EXISTS idx_pattern_catalog_age ON pattern_catalog(age_group_id);

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Age Groups
INSERT INTO age_groups (name, age_min, age_max, cognitive_focus, awareness_scope, ignore_complexity) VALUES
('Foundation', 6, 9, 'Self ↔ Ball ↔ Nearest Opponent', 'Ball + nearest defender', 'Team shape, rotations, far-side space'),
('Expansion', 10, 13, 'Local Space (2–4 players)', '2–4 nearest players', 'Far-side weak space, micro tricks obsession'),
('Tactical', 14, 16, 'Units & Lines', 'Lines & compactness', 'Micro tricks obsession, individual hero bias'),
('Pre-Elite', 17, 18, 'Team Structure', 'Team patterns', 'Individual hero bias, anything unintentional'),
('Elite', 19, 99, 'Whole-Field Game Model', 'Game model & opponents', 'Anything unintentional')
ON CONFLICT (name) DO NOTHING;

-- Positions (Canonical Set)
INSERT INTO positions_enhanced (name, abbreviation, unit, sort_order, description) VALUES
-- Defensive Unit
('Goalkeeper', 'GK', 'Defensive', 1, 'Last line of defense, ball distribution'),
('Center Back', 'CB', 'Defensive', 2, 'Central defender, organize defensive line'),
('Left Center Back', 'LCB', 'Defensive', 3, 'Left-sided center back'),
('Right Center Back', 'RCB', 'Defensive', 4, 'Right-sided center back'),
('Full Back', 'FB', 'Defensive', 5, 'Wide defender, overlap in attack'),
('Wing Back', 'WB', 'Defensive', 6, 'Attacking full back in 3-back system'),
-- Midfield Unit
('Defensive Midfielder', 'DM', 'Midfield', 7, 'Shield defense, distribute from deep (6)'),
('Central Midfielder', 'CM', 'Midfield', 8, 'Box-to-box midfielder (8)'),
('Attacking Midfielder', 'AM', 'Midfield', 9, 'Create chances, operate in hole (10)'),
-- Attacking Unit
('Winger', 'W', 'Attacking', 10, 'Wide forward, beat defenders 1v1'),
('Striker', 'ST', 'Attacking', 11, 'Central forward, score goals (9)'),
('Second Striker', 'SS', 'Attacking', 12, 'Support striker, link play'),
('Inside Forward', 'IF', 'Attacking', 13, 'Cut inside from wide, score goals')
ON CONFLICT (name) DO NOTHING;

-- Phases
INSERT INTO phases (name, abbreviation, description, sort_order) VALUES
('Attacking', 'ATT', 'In possession, building attacks', 1),
('Attacking Transition', 'A-TR', 'Regain → Immediate attack', 2),
('Defensive', 'DEF', 'Out of possession, organized defense', 3),
('Defensive Transition', 'D-TR', 'Loss → Immediate pressure/recovery', 4)
ON CONFLICT (name) DO NOTHING;

-- Principles
INSERT INTO principles (name, category, definition) VALUES
-- Attacking Principles
('Width', 'Attacking', 'Stretch the defense horizontally to create space'),
('Depth', 'Attacking', 'Stretch the defense vertically, create passing lanes'),
('Support', 'Attacking', 'Provide passing options around the ball'),
('Mobility', 'Attacking', 'Move to create space and confuse markers'),
('Penetration', 'Attacking', 'Break defensive lines with passes or dribbles'),
-- Defensive Principles
('Pressure', 'Defensive', 'Apply direct pressure on the ball carrier'),
('Cover', 'Defensive', 'Support the presser, prevent through balls'),
('Balance', 'Defensive', 'Maintain defensive shape, protect weak side'),
('Compactness', 'Defensive', 'Reduce space between lines, stay connected'),
('Control', 'Defensive', 'Manage defensive positioning and timing')
ON CONFLICT (name) DO NOTHING;

-- Formations
INSERT INTO formations (name, description, archetype, structure) VALUES
('4-3-3', 'Four defenders, three midfielders, three forwards', 'Positional Play Base',
 '{"defense": ["RB", "RCB", "LCB", "LB"], "midfield": ["DM", "CM", "CM"], "attack": ["RW", "ST", "LW"]}'),
('3-5-2', 'Three center backs, five midfielders, two strikers', 'Relational / Vertical Base',
 '{"defense": ["RCB", "CB", "LCB"], "midfield": ["RWB", "LWB", "DM", "CM"], "attack": ["AM", "ST", "ST"]}')
ON CONFLICT (name) DO NOTHING;

-- Action Patterns (Core Run Types)
INSERT INTO action_patterns (name, type, description, purpose, trigger_condition, expected_outcome) VALUES
('U-Run', 'RUN_TYPE', 'Drop deep, receive, turn and drive forward', 'Create space for third-man', 'Defender steps to press', 'Disorganize back line'),
('J-Run', 'RUN_TYPE', 'Curved run behind defensive line', 'Exploit space in behind', 'Defender ball-watching', 'Receive in dangerous area'),
('L-Run', 'RUN_TYPE', 'Check to ball, then explode away', 'Create separation from marker', 'Defender follows check', 'Open passing lane'),
('Double Movement', 'RUN_TYPE', 'Fake one direction, go the other', 'Lose marker', 'Defender commits early', 'Free to receive'),
('Blindside Run', 'RUN_TYPE', 'Run from defender''s blind spot', 'Arrive unmarked', 'Defender focused on ball', 'Open shot/cross'),
('Decoy Run', 'RUN_TYPE', 'Run to pull defender out of position', 'Create space for teammate', 'Defender tracks run', 'Open space created'),
('Third-Man Run', 'RUN_TYPE', 'Late run into space created by others', 'Arrive unmarked in final third', 'Defense focused on first two attackers', 'Receive in dangerous area'),
('Overlap', 'RUN_TYPE', 'Wide player runs outside teammate', 'Create 2v1, stretch defense', 'Defender commits to ball carrier', 'Space outside or inside'),
('Underlap', 'RUN_TYPE', 'Run inside and behind teammate', 'Create central threat', 'Defender stays wide', 'Central penetration'),
('Cross-Over', 'RUN_TYPE', 'Switch positions with teammate', 'Confuse markers', 'Defenders stick to zones', 'Mismatch created')
ON CONFLICT (name) DO NOTHING;

-- Philosophies
INSERT INTO philosophies (name, description, core_values) VALUES
('Positional Play', 'Maintain positional structure, create numerical superiority, circulate possession',
 ARRAY['Superiority', 'Positioning', 'Patience']),
('Relationism', 'Vertical, direct play emphasizing relationships between players',
 ARRAY['Verticality', 'Relationships', 'Speed']),
('Direct Play', 'Quick transitions, fewer touches, exploit space early',
 ARRAY['Directness', 'Transitions', 'Efficiency']),
('High Press', 'Aggressive pressing high up the pitch to win ball early',
 ARRAY['Intensity', 'Recovery', 'Aggression']),
('Low Block', 'Compact defensive shape, counter-attack on transitions',
 ARRAY['Compactness', 'Discipline', 'Counter-attack'])
ON CONFLICT (name) DO NOTHING;

-- Sample Position × Phase × Age Objectives (Center Back Examples)
DO $$
DECLARE
  cb_id INTEGER;
  att_id INTEGER;
  def_id INTEGER;
  found_id INTEGER;
  exp_id INTEGER;
  tact_id INTEGER;
  pre_id INTEGER;
  elite_id INTEGER;
BEGIN
  -- Get IDs
  SELECT id INTO cb_id FROM positions_enhanced WHERE name = 'Center Back';
  SELECT id INTO att_id FROM phases WHERE name = 'Attacking';
  SELECT id INTO def_id FROM phases WHERE name = 'Defensive';
  SELECT id INTO found_id FROM age_groups WHERE name = 'Foundation';
  SELECT id INTO exp_id FROM age_groups WHERE name = 'Expansion';
  SELECT id INTO tact_id FROM age_groups WHERE name = 'Tactical';
  SELECT id INTO pre_id FROM age_groups WHERE name = 'Pre-Elite';
  SELECT id INTO elite_id FROM age_groups WHERE name = 'Elite';

  -- Center Back - Attacking Phase
  INSERT INTO position_phase_objectives (position_id, phase_id, age_group_id, primary_objective, cognitive_complexity) VALUES
  (cb_id, att_id, found_id, 'Beat first defender with pass or dribble', 1),
  (cb_id, att_id, exp_id, 'Identify pressure level and passing options', 2),
  (cb_id, att_id, tact_id, 'Break first line with progressive passes', 3),
  (cb_id, att_id, pre_id, 'Manipulate pressing structure with movement', 4),
  (cb_id, att_id, elite_id, 'Control tempo & space distribution', 5)
  ON CONFLICT (position_id, phase_id, age_group_id) DO NOTHING;

  -- Center Back - Defensive Phase
  INSERT INTO position_phase_objectives (position_id, phase_id, age_group_id, primary_objective, cognitive_complexity) VALUES
  (cb_id, def_id, found_id, 'Stay goal-side of attacker', 1),
  (cb_id, def_id, exp_id, 'Delay and channel attacker to weaker foot', 2),
  (cb_id, def_id, tact_id, 'Coordinate defensive line, manage offside trap', 3),
  (cb_id, def_id, pre_id, 'Manage depth, compactness, and offside line', 4),
  (cb_id, def_id, elite_id, 'Control compactness and pressing triggers', 5)
  ON CONFLICT (position_id, phase_id, age_group_id) DO NOTHING;
END $$;

COMMIT;
