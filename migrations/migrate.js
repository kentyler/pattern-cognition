// migrations/migrate.js
import 'dotenv/config';
import pg from 'pg';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection
const pool = new Pool({
  connectionString: process.env.PATTERN_DB_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function getCurrentVersion() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version BIGINT PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    const result = await pool.query(
      'SELECT MAX(version) as version FROM schema_migrations'
    );
    return Number(result.rows[0].version) || 0;
  } catch (error) {
    console.error('Error getting current migration version:', error);
    throw error;
  }
}

async function getMigrationFiles() {
  const files = await fs.readdir(__dirname);
  return files
    .filter(file => file.endsWith('.sql'))
    .sort()
    .map(file => ({
      version: parseInt(file.split('_')[0], 10),
      name: path.basename(file, '.sql'),
      path: path.join(__dirname, file)
    }));
}

async function runMigration(version, name, filePath) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Read and execute the migration SQL file
    const sql = await fs.readFile(filePath, 'utf8');
    await client.query(sql);
    
    // Record the migration in schema_migrations
    // Make sure this matches your actual table structure
    await client.query(
      'INSERT INTO schema_migrations (version, name) VALUES ($1, $2)',
      [version, name]
    );
    
    await client.query('COMMIT');
    console.log(`✅ Applied migration ${version}: ${name}`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`❌ Failed to apply migration ${version}: ${name}`, error.message);
    throw error;
  } finally {
    client.release();
  }
}

async function migrate() {
  try {
    const currentVersion = await getCurrentVersion();
    console.log(`Current database version: ${currentVersion}`);
    
    const migrations = await getMigrationFiles();
    const pendingMigrations = migrations.filter(m => m.version > currentVersion);
    
    if (pendingMigrations.length === 0) {
      console.log('✅ Database is up to date');
      return;
    }
    
    console.log(`Found ${pendingMigrations.length} migrations to apply`);
    
    for (const migration of pendingMigrations) {
      console.log(`Applying migration ${migration.version}: ${migration.name}...`);
      await runMigration(migration.version, migration.name, migration.path);
    }
    
    console.log('✅ All migrations applied successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migrations if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  migrate().catch(console.error);
}

export { getCurrentVersion, migrate };