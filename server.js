const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db.sql');

const app = express();

// Middleware
app.use(bodyParser.json());

// CRUD Routes

// Create a new user
app.post('/users', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const query = 'INSERT INTO students (name, email, phone) VALUES (?, ?, ?)';
    db.query(query, [name, email, phone], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'User created', userId: result.insertId });
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET API to check if the server is working
app.get('/', async (req, res) => {
  try {
    res.send('Express Server is Working...');
  } catch (error) {
    console.error('Error checking server status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    const query = 'SELECT * FROM students';
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a single user by ID
app.get('/users/:id', async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a user by ID
app.put('/users/:id', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const query = 'UPDATE students SET name = ?, email = ?, phone = ? WHERE id = ?';
    db.query(query, [name, email, phone, req.params.id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'User updated' });
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a user by ID
app.delete('/users/:id', async (req, res) => {
  try {
    const query = 'DELETE FROM students WHERE id = ?';
    db.query(query, [req.params.id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'User deleted' });
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const PORT = 2000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
