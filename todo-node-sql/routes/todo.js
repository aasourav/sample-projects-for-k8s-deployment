// routes/todo.js
const express = require('express');
const router = express.Router();
const connection = require('../db/connection');

// Create a new TODO
router.post('/create', (req, res) => {
  const { title } = req.body;
    console.log("THTILE: ",req.body)
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const query = 'INSERT INTO todos (title, is_done) VALUES (?, ?)';
  connection.query(query, [title, false], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'TODO created successfully', id: result.insertId });
  });
});

// Get all TODOs
router.get('/list', (req, res) => {
  const query = 'SELECT * FROM todos';
  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Mark TODO as done
router.put('/done/:id', (req, res) => {
  const { id } = req.params;
  const query = 'UPDATE todos SET is_done = ? WHERE id = ?';
  
  connection.query(query, [true, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'TODO marked as done' });
  });
});

// Delete a TODO
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM todos WHERE id = ?';
  
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'TODO deleted successfully' });
  });
});

module.exports = router;
