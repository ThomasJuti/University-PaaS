const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await req.pool.query('SELECT * FROM students ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await req.pool.query('SELECT * FROM students WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'name and email are required' });
    }
    const result = await req.pool.query(
      'INSERT INTO students (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    if (!name && !email) {
      return res.status(400).json({ error: 'name or email required' });
    }
    const fields = [];
    const values = [];
    let paramCount = 1;
    if (name) {
      fields.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (email) {
      fields.push(`email = $${paramCount++}`);
      values.push(email);
    }
    values.push(id);
    const result = await req.pool.query(
      `UPDATE students SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await req.pool.query('DELETE FROM students WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted', student: result.rows[0] });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;