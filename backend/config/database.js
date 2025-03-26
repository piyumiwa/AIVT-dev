const { Pool } = require('pg');

// PostgreSQL connection configuration
const pool = new Pool({
  // user: 'postgres',
  // host: 'localhost',
  // database: 'aivtdb',
  // password: 'admin',
  // port: 5432
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Test the database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log('Connected to PostgreSQL at:', result.rows[0].now);
  });
});

module.exports = pool;