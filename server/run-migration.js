import pool from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log('🔄 Running coaching framework migration...');

    const migrationSQL = fs.readFileSync(
      path.join(__dirname, 'migrations', '001_coaching_framework.sql'),
      'utf-8'
    );

    await pool.query(migrationSQL);

    console.log('✅ Migration completed successfully!');
    console.log('📊 Created tables:');
    console.log('   - age_groups (5 rows)');
    console.log('   - positions_enhanced (13 rows)');
    console.log('   - formations (2 rows)');
    console.log('   - phases (4 rows)');
    console.log('   - principles (10 rows)');
    console.log('   - action_patterns (10 rows)');
    console.log('   - courses (new structure)');
    console.log('   - modules');
    console.log('   - module_content');
    console.log('   - badges');
    console.log('   - learning_paths');
    console.log('   - philosophies (5 rows)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

runMigration();
