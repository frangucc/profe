import pool from './db.js';

async function resetOnboarding() {
  try {
    const result = await pool.query(`
      UPDATE player_profiles
      SET onboarding_completed = false
      WHERE user_id = (SELECT id FROM users WHERE email = 'player@profe.com')
      RETURNING *
    `);

    console.log('✅ Reset onboarding for player@profe.com');
    console.log('📋 Player can now complete the survey again');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetOnboarding();
