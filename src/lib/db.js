import { Pool } from 'pg';

// Create a new pool using the connection string from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.PATTERN_DB_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon.tech
    sslmode: 'require'
  }
});

// Test the database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to the database');
    client.release();
  } catch (err) {
    console.error('Error connecting to the database:', err);
    // Don't throw here to allow the app to start
    // The actual API routes will handle connection errors
  }
};

// Test the connection when this module is loaded
testConnection();

export { pool };

// This is a server-side module, so we'll add a check to prevent client-side usage
if (typeof window !== 'undefined') {
  throw new Error('This module should only be used on the server side');
}
