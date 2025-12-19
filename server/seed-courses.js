import pool from './db.js';

async function seedCourses() {
  try {
    console.log('🌱 Seeding sample courses...');

    // Get reference IDs
    const positionsResult = await pool.query('SELECT id, name FROM positions_enhanced');
    const ageGroupsResult = await pool.query('SELECT id, name FROM age_groups');
    const phasesResult = await pool.query('SELECT id, name FROM phases');
    const formationsResult = await pool.query('SELECT id, name FROM formations');
    const adminResult = await pool.query("SELECT id FROM users WHERE user_type = 'admin' LIMIT 1");

    const positions = Object.fromEntries(positionsResult.rows.map(r => [r.name, r.id]));
    const ageGroups = Object.fromEntries(ageGroupsResult.rows.map(r => [r.name, r.id]));
    const phases = Object.fromEntries(phasesResult.rows.map(r => [r.name, r.id]));
    const formations = Object.fromEntries(formationsResult.rows.map(r => [r.name, r.id]));
    const adminId = adminResult.rows[0]?.id || 1;

    // Course 1: Center Back Fundamentals (Foundation)
    const course1 = await pool.query(`
      INSERT INTO courses (
        title, description, position_id, age_group_id, phase_id,
        level, duration_weeks, thumbnail_url, created_by, published
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
      RETURNING id
    `, [
      'Center Back Fundamentals',
      'Master the basics of playing center back including positioning, defending 1v1, and building from the back',
      positions['Center Back'],
      ageGroups['Foundation'],
      phases['Defensive'],
      'Bronze',
      4,
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
      adminId
    ]);

    // Module 1 for Course 1
    const module1 = await pool.query(`
      INSERT INTO modules (course_id, title, description, objective, sort_order)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `, [
      course1.rows[0].id,
      'Staying Goal-Side',
      'Learn the fundamental defensive positioning principle',
      'Always position yourself between the attacker and your goal',
      1
    ]);

    await pool.query(`
      INSERT INTO module_content (module_id, content_type, title, content_url, duration_minutes, sort_order)
      VALUES
        ($1, 'video', 'What is Goal-Side Positioning?', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 8, 1),
        ($1, 'drill', 'Goal-Side Shadow Drill', null, 15, 2),
        ($1, 'quiz', 'Goal-Side Quiz', null, 5, 3)
    `, [module1.rows[0].id]);

    // Module 2 for Course 1
    const module2 = await pool.query(`
      INSERT INTO modules (course_id, title, description, objective, sort_order)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `, [
      course1.rows[0].id,
      'First Touch & Body Shape',
      'Learn how to receive the ball under pressure',
      'Control the ball with proper body shape to see the field',
      2
    ]);

    await pool.query(`
      INSERT INTO module_content (module_id, content_type, title, content_url, duration_minutes, sort_order)
      VALUES
        ($1, 'video', 'Open Body Shape Receiving', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 10, 1),
        ($1, 'interactive', 'Body Shape Simulator', null, 12, 2),
        ($1, 'drill', 'Pressure Receiving Drill', null, 15, 3)
    `, [module2.rows[0].id]);

    console.log('  ✅ Created "Center Back Fundamentals" (Foundation)');

    // Course 2: Midfield Vision & Scanning (Expansion)
    const course2 = await pool.query(`
      INSERT INTO courses (
        title, description, position_id, age_group_id, phase_id,
        level, duration_weeks, thumbnail_url, created_by, published
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
      RETURNING id
    `, [
      'Midfield Vision & Scanning',
      'Develop your awareness and decision-making as a central midfielder',
      positions['Central Midfielder'],
      ageGroups['Expansion'],
      phases['Attacking'],
      'Silver',
      5,
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400',
      adminId
    ]);

    const module3 = await pool.query(`
      INSERT INTO modules (course_id, title, description, objective, sort_order)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `, [
      course2.rows[0].id,
      'Scanning Before Receiving',
      'Learn to check your shoulders before getting the ball',
      'Scan the field to identify 2-4 nearby players before receiving',
      1
    ]);

    await pool.query(`
      INSERT INTO module_content (module_id, content_type, title, content_url, duration_minutes, sort_order)
      VALUES
        ($1, 'video', 'Why Scan? The 2-Second Advantage', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 12, 1),
        ($1, 'drill', 'Scan & Turn Drill', null, 20, 2),
        ($1, 'scenario', 'Decision Making Under Pressure', null, 15, 3)
    `, [module3.rows[0].id]);

    console.log('  ✅ Created "Midfield Vision & Scanning" (Expansion)');

    // Course 3: Attacking Midfielder Playmaking (Tactical)
    const course3 = await pool.query(`
      INSERT INTO courses (
        title, description, position_id, age_group_id, phase_id,
        level, duration_weeks, thumbnail_url, created_by, published
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
      RETURNING id
    `, [
      'Attacking Midfielder Playmaking',
      'Master the art of creating chances from the #10 position',
      positions['Attacking Midfielder'],
      ageGroups['Tactical'],
      phases['Attacking'],
      'Gold',
      6,
      'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400',
      adminId
    ]);

    const module4 = await pool.query(`
      INSERT INTO modules (course_id, title, description, objective, sort_order)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `, [
      course3.rows[0].id,
      'Finding Space in the Hole',
      'Learn to position between lines and receive in dangerous areas',
      'Identify and exploit space between defensive and midfield lines',
      1
    ]);

    await pool.query(`
      INSERT INTO module_content (module_id, content_type, title, content_url, duration_minutes, sort_order)
      VALUES
        ($1, 'video', 'The Art of Playing Between Lines', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 15, 1),
        ($1, 'video', 'Analyzing World-Class #10s', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 18, 2),
        ($1, 'drill', 'Half-Space Movement Drill', null, 25, 3)
    `, [module4.rows[0].id]);

    console.log('  ✅ Created "Attacking Midfielder Playmaking" (Tactical)');

    // Create some sample badges
    console.log('\n🏆 Creating sample badges...');

    await pool.query(`
      INSERT INTO badges (name, description, category, tier, points, criteria)
      VALUES
        ('First Steps', 'Complete your first course module', 'Cognitive', 'Bronze', 10, '{"modules_completed": 1}'),
        ('Scanning Master I', 'Complete Midfield Vision & Scanning course', 'Cognitive', 'Bronze', 50, '{"course_id": ${course2.rows[0].id}}'),
        ('Defender Foundation', 'Complete Center Back Fundamentals', 'Defensive', 'Bronze', 50, '{"course_id": ${course1.rows[0].id}}'),
        ('Line Breaker', 'Score 80% or higher on 5 quizzes', 'Tactical', 'Silver', 100, '{"quiz_scores": {"count": 5, "min_score": 80}}'),
        ('Dedicated Learner', 'Maintain a 7-day learning streak', 'Social', 'Silver', 75, '{"streak_days": 7}'),
        ('Course Champion', 'Complete 3 courses', 'Tactical', 'Gold', 200, '{"courses_completed": 3}')
      ON CONFLICT (name) DO NOTHING
    `);

    console.log('  ✅ Created 6 sample badges');

    console.log('\n✅ Seed completed successfully!');
    console.log('\n📚 Sample courses created:');
    console.log('   1. Center Back Fundamentals (Foundation/Bronze)');
    console.log('   2. Midfield Vision & Scanning (Expansion/Silver)');
    console.log('   3. Attacking Midfielder Playmaking (Tactical/Gold)');
    console.log('\n🏆 6 badges created ranging from Bronze to Gold');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seedCourses();
