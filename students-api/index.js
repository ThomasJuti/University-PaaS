require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const studentsRouter = require('./routes/students');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'students-api' });
});

app.use('/students', studentsRouter);

const PORT = process.env.PORT || 3000;

async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Students table ready');
  } finally {
    client.release();
  }
}

async function start() {
  try {
    await initDB();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Students API running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

module.exports = { pool };