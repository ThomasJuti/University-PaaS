const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await req.pool.query(`
      SELECT e.id, e.student_id, e.course_id, e.enrolled_at, s.name as student_name, c.name as course_name
      FROM enrollments e
      LEFT JOIN students s ON e.student_id = s.id
      LEFT JOIN courses c ON e.course_id = c.id
      ORDER BY e.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { student_id, course_id } = req.body;
    if (!student_id || !course_id) {
      return res.status(400).json({ error: 'student_id and course_id are required' });
    }

    const studentsServiceUrl = process.env.STUDENTS_SERVICE_URL || 'http://localhost:3000';
    let studentExists = false;
    try {
      const response = await fetch(`${studentsServiceUrl}/students/${student_id}`);
      if (response.ok) {
        studentExists = true;
      }
    } catch (fetchError) {
      console.error('Error validating student:', fetchError);
      return res.status(503).json({ error: 'Unable to validate student - students service unavailable' });
    }

    if (!studentExists) {
      return res.status(404).json({ error: `Student with id ${student_id} does not exist` });
    }

    const courseCheck = await req.pool.query('SELECT id FROM courses WHERE id = $1', [course_id]);
    if (courseCheck.rows.length === 0) {
      return res.status(404).json({ error: `Course with id ${course_id} does not exist` });
    }

    const result = await req.pool.query(
      'INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) RETURNING *',
      [student_id, course_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Student already enrolled in this course' });
    }
    console.error('Error creating enrollment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;