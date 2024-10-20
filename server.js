const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db.sql');

const app = express();

// Middleware
app.use(bodyParser.json());

// CRUD Routes

// Create a new user
app.post('/users', (req, res) => {
  const { name, email, phone } = req.body;
  const query = 'INSERT INTO students (name, email, phone) VALUES (?, ?, ?)';
  db.query(query, [name, email, phone], (err, result) => {
    if (err) throw err;
    res.json({ message: 'User created', userId: result.insertId });
  });
});

// Get all users
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM students';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});




// Get a single user by ID
app.get('/users/:id', (req, res) => {
    const query = 'SELECT * FROM students WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'No user found with that ID' });
      }
  
      res.json(results[0]);
    });
  });
  


// Update a user by ID
app.put('/users/:id', (req, res) => {
  const { name, email, phone } = req.body;
  const query = 'UPDATE students SET name = ?, email = ?, phone = ? WHERE id = ?';
  db.query(query, [name, email, phone, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'User updated' });
  });
});

// Delete a user by ID
app.delete('/users/:id', (req, res) => {
  const query = 'DELETE FROM students WHERE id = ?';
  db.query(query, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'User deleted' });
  });
});

// Start the server
const PORT = 2000;
app.listen(PORT, () => {
  console.log('Server running on http://localhost:3000');
});
