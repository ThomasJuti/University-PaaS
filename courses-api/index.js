require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const coursesRouter = require('./routes/courses');
const enrollmentsRouter = require('./routes/enrollments');

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
  res.json({ status: 'ok', service: 'courses-api' });
});

app.use('/courses', coursesRouter);
app.use('/enrollments', enrollmentsRouter);

const PORT = process.env.PORT || 3001;

async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id SERIAL PRIMARY KEY,
        student_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, course_id),
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      )
    `);
    console.log('Courses and enrollments tables ready');
  } finally {
    client.release();
  }
}

async function start() {
  try {
    await initDB();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Courses API running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

module.exports = { pool };