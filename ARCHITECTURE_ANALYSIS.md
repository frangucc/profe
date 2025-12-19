# ProFe Architecture Analysis & Framework Integration Plan

## Current State: Dynamic vs Static

### ✅ DYNAMIC (Connected to Neon PostgreSQL)

**Authentication & User Management:**
- User registration and login
- JWT token authentication
- User profiles (players, coaches, admins)
- Player onboarding survey with goals/ambitions
- Profile updates (name, age, skill level, positions)

**Database Tables in Use:**
- `users` - Basic user info
- `player_profiles` - Player-specific data including onboarding_completed
- `coach_profiles` - Coach data
- `user_stats` - Player statistics
- `survey_responses` - Onboarding survey answers

### ❌ STATIC (Hardcoded Mock Data)

**Course System:**
- Course listings
- Course enrollments
- Lesson content
- Progress tracking
- **Source:** `/src/data/mockData.js`

**Video System:**
- Video uploads
- Video analysis/feedback
- Comments
- **Source:** `/src/data/mockData.js`

**Training Plans:**
- Weekly training sessions
- Exercise recommendations
- **Source:** `/src/data/mockData.js`

**Achievements:**
- Badges
- Milestones
- **Source:** `/src/data/mockData.js`

**Dashboard Stats:**
- Course enrollment counts
- Video uploads
- Day streaks
- Skills improved
- **Source:** `/src/data/mockData.js`

**Position & Skill Reference Data:**
- Position list (9 positions)
- Skill levels (4 levels)
- **Source:** `/src/data/mockData.js` (should stay static as reference data)

---

## Coaching Framework Analysis

Your framework is **exceptional** - it's a true soccer ontology that scales from youth foundation to elite professional play. Here's what makes it revolutionary:

### 🎯 Core Strengths

**1. Age-Based Cognitive Scaling**
- Most LMS platforms are one-size-fits-all
- Your framework intentionally **hides complexity** until players are cognitively ready
- Example: An 8-year-old sees "Beat the first defender", while a 19-year-old sees "Manipulate pressing structure"

**2. Multi-Dimensional Architecture**
Your 6 axes create a graph database of soccer knowledge:
```
AGE_GROUP × POSITION × FORMATION × PHASE × PRINCIPLE × ACTION = Content Node
```

This means a single drill can be tagged and discovered multiple ways:
- "Show me U14 center back defensive phase drills"
- "What are the J-runs for a 4-3-3 winger?"
- "How does 'depth' principle apply to a 10-year-old striker?"

**3. Phase-Based Role Definition**
Every position has 4 distinct identities (one per phase). This is **critical** and missing from most coaching apps.

---

## Proposed Database Schema

### Foundational Tables (The 6 Axes)

#### 1. Age Groups
```sql
CREATE TABLE age_groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL, -- 'Foundation', 'Expansion', 'Tactical', 'Pre-Elite', 'Elite'
  age_min INTEGER NOT NULL,
  age_max INTEGER NOT NULL,
  cognitive_focus TEXT NOT NULL, -- 'Self ↔ Ball ↔ Nearest Opponent'
  awareness_scope TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. Positions (Enhanced)
```sql
CREATE TABLE positions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE, -- 'Center Back', 'Defensive Midfielder', etc.
  abbreviation VARCHAR(10), -- 'CB', 'DM', etc.
  unit VARCHAR(50) NOT NULL, -- 'Defensive', 'Midfield', 'Attacking'
  sort_order INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. Formations
```sql
CREATE TABLE formations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE, -- '4-3-3', '3-5-2'
  description TEXT,
  archetype VARCHAR(100), -- 'Positional Play Base', 'Vertical Base'
  structure JSONB, -- {"defense": ["RB", "RCB", "LCB", "LB"], "midfield": [...]}
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. Phases
```sql
CREATE TABLE phases (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE, -- 'Attacking', 'Attacking Transition', 'Defensive', 'Defensive Transition'
  abbreviation VARCHAR(10), -- 'ATT', 'A-TR', 'DEF', 'D-TR'
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. Principles
```sql
CREATE TABLE principles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE, -- 'Width', 'Depth', 'Pressure', etc.
  category VARCHAR(50) NOT NULL, -- 'Attacking', 'Defensive'
  definition TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 6. Actions/Patterns
```sql
CREATE TABLE action_patterns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL, -- 'U-Run', 'J-Run', 'Third-Man Run'
  type VARCHAR(50) NOT NULL, -- 'RUN_TYPE', 'PASS_TYPE', 'DECISION'
  description TEXT NOT NULL,
  purpose TEXT, -- 'Create space for third-man'
  trigger TEXT, -- 'Defender steps'
  outcome TEXT, -- 'Disorganize back line'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Content Tables (What Attaches to the Axes)

#### Position × Phase × Age Objectives
```sql
CREATE TABLE position_phase_objectives (
  id SERIAL PRIMARY KEY,
  position_id INTEGER REFERENCES positions(id),
  phase_id INTEGER REFERENCES phases(id),
  age_group_id INTEGER REFERENCES age_groups(id),
  primary_objective TEXT NOT NULL,
  secondary_objectives TEXT[],
  cognitive_complexity INTEGER, -- 1-5 scale
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(position_id, phase_id, age_group_id)
);
```

#### Courses (Enhanced LMS)
```sql
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  position_id INTEGER REFERENCES positions(id),
  age_group_id INTEGER REFERENCES age_groups(id),
  formation_id INTEGER REFERENCES formations(id) NULL, -- Optional
  phase_id INTEGER REFERENCES phases(id) NULL, -- Optional
  level VARCHAR(50), -- 'Bronze', 'Silver', 'Gold', 'Elite'
  duration_weeks INTEGER,
  thumbnail_url VARCHAR(500),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Modules (Within Courses)
```sql
CREATE TABLE modules (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  objective TEXT NOT NULL,
  concept TEXT,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Module Content
```sql
CREATE TABLE module_content (
  id SERIAL PRIMARY KEY,
  module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE,
  content_type VARCHAR(50) NOT NULL, -- 'video', 'drill', 'quiz', 'scenario', 'reading'
  title VARCHAR(255) NOT NULL,
  content_url VARCHAR(500), -- For videos, PDFs, etc.
  content_data JSONB, -- For quizzes, drills, etc.
  duration_minutes INTEGER,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Pattern Catalog (Playbook Generator)
```sql
CREATE TABLE pattern_catalog (
  id SERIAL PRIMARY KEY,
  action_pattern_id INTEGER REFERENCES action_patterns(id),
  position_id INTEGER REFERENCES positions(id),
  formation_id INTEGER REFERENCES formations(id) NULL,
  phase_id INTEGER REFERENCES phases(id),
  age_group_id INTEGER REFERENCES age_groups(id),
  diagram_url VARCHAR(500), -- SVG or image of the pattern
  video_url VARCHAR(500), -- Demonstration
  instructions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Gamification Tables

#### Badges
```sql
CREATE TABLE badges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE, -- 'Scanning Master I', 'Line Breaker'
  description TEXT,
  category VARCHAR(50) NOT NULL, -- 'Cognitive', 'Tactical', 'Defensive', 'Playbook'
  tier VARCHAR(20), -- 'Bronze', 'Silver', 'Gold', 'Elite'
  icon_url VARCHAR(500),
  criteria JSONB, -- Requirements to earn
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Player Badges (Earned)
```sql
CREATE TABLE player_badges (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  badge_id INTEGER REFERENCES badges(id),
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, badge_id)
);
```

### Enhanced Player Profile

#### Update player_profiles table
```sql
ALTER TABLE player_profiles
ADD COLUMN formation_familiarity INTEGER[] DEFAULT '{}', -- Array of formation IDs
ADD COLUMN phase_strengths JSONB DEFAULT '{}', -- {attacking: 75, defensive: 60, ...}
ADD COLUMN cognitive_level INTEGER DEFAULT 1, -- 1-5 based on age/progress
ADD COLUMN learning_path_id INTEGER REFERENCES learning_paths(id) NULL;
```

#### Learning Paths (Personalized Curriculum)
```sql
CREATE TABLE learning_paths (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  position_id INTEGER REFERENCES positions(id),
  age_group_id INTEGER REFERENCES age_groups(id),
  current_course_id INTEGER REFERENCES courses(id) NULL,
  completed_courses INTEGER[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Philosophy Layer (Multi-Coaching Style Support)

```sql
CREATE TABLE philosophies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE, -- 'Positional Play', 'Relationism', 'Direct Play'
  description TEXT,
  core_values TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tag content with philosophy
ALTER TABLE courses ADD COLUMN philosophy_id INTEGER REFERENCES philosophies(id) NULL;
ALTER TABLE pattern_catalog ADD COLUMN philosophy_id INTEGER REFERENCES philosophies(id) NULL;
```

---

## Implementation Plan

### Phase 1: Foundation (Weeks 1-2)
**Goal:** Build the 6-axis spine

1. ✅ Create seed data SQL script with:
   - 5 age groups (Foundation to Elite)
   - 13 canonical positions
   - 2 formations (4-3-3, 3-5-2)
   - 4 phases
   - 10 principles (5 attacking, 5 defensive)
   - 10 core action patterns (U/J/L runs, etc.)

2. ✅ Migrate existing courses table to new structure
3. ✅ Create modules and module_content tables
4. ✅ Build position_phase_objectives for all positions × phases × ages (sample set)

### Phase 2: Content Migration (Weeks 3-4)
**Goal:** Replace mock data with dynamic content

1. ✅ Update API routes to fetch courses from database
2. ✅ Build admin CMS for creating courses/modules/content
3. ✅ Migrate 3 sample courses from mockData to database
4. ✅ Update frontend components to use real data

### Phase 3: Gamification (Week 5)
**Goal:** Make it fun and engaging

1. ✅ Create badges system
2. ✅ Build badge earning logic (triggered by course completion, quiz scores, etc.)
3. ✅ Update player profile to show badges
4. ✅ Add progression indicators (Bronze → Elite)

### Phase 4: Intelligent Content Delivery (Week 6)
**Goal:** Age-appropriate, personalized learning

1. ✅ Build content filtering based on player age
2. ✅ Create learning path generation algorithm
3. ✅ Implement cognitive complexity scaling
4. ✅ Build "recommended for you" system

### Phase 5: Playbook Generator (Week 7-8)
**Goal:** Interactive pattern library

1. ✅ Build pattern catalog interface
2. ✅ Add diagram rendering (SVG patterns)
3. ✅ Filter patterns by position/formation/phase
4. ✅ Allow coaches to create custom patterns

---

## Why This Architecture Works

### 1. **Scalability**
- Add new positions, formations, principles without schema changes
- Content grows through tags, not hardcoding

### 2. **Personalization**
- Every player sees content filtered by their age, position, and skill level
- Learning paths auto-generate based on profile

### 3. **Coach Flexibility**
- Multiple coaching philosophies coexist
- Coaches can create custom patterns and courses

### 4. **AI-Ready**
- JSONB fields allow flexible data structures
- Graph-like relationships perfect for ML content recommendations
- Cognitive complexity scoring enables adaptive learning

### 5. **Mirrors Human Learning**
- Age-based progression prevents overwhelming young players
- Principles stay constant, but expression changes with age
- Gamification maintains engagement through long-term development

---

## Next Steps

**Immediate Actions:**
1. ✅ Review and approve this architecture
2. ✅ Create migration SQL scripts
3. ✅ Build seed data for the 6 axes
4. ✅ Update API layer to support new tables
5. ✅ Start with Phase 1 implementation

**Questions to Answer:**
1. Which 3-5 courses should we migrate first as proof of concept?
2. What badge tiers matter most for initial launch?
3. Do you want philosophy filtering in V1, or save for V2?
4. Should we build pattern diagrams ourselves, or use a library?

---

## Technical Notes

### Database Type
- **PostgreSQL** (Neon) ✅ Perfect choice
- Supports JSONB for flexible data
- Array types for multi-select fields
- Foreign keys for referential integrity

### Frontend State Management
- Consider upgrading to **React Query** or **SWR** for server state
- Current Context API works, but caching will help with complex data

### Content Delivery
- Use **Cloudflare R2** or **AWS S3** for video/image storage
- CDN for fast global delivery

### Search & Discovery
- Consider **PostgreSQL full-text search** for course/pattern discovery
- Or integrate **Algolia** for instant search

---

**This is a world-class architecture for soccer education. It's not just an app—it's a knowledge graph of the beautiful game.**
