const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'passwd@05#', // Replace with your MySQL root password
    database: 'book_management'
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Book Management API');
});

// Get all books
app.get('/api/books', (req, res) => {
    db.query('SELECT * FROM books', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

// Add a new book
app.post('/api/books', (req, res) => {
    const { name, author, description, price } = req.body;
    db.query('INSERT INTO books (name, author, description, price) VALUES (?, ?, ?, ?)', 
    [name, author, description, price], (err, results) => {
        if (err) {
            console.error('Error inserting book:', err);
            return res.status(500).json({ error: 'Failed to add book' });
        }
        res.status(201).json({ id: results.insertId, name, author, description, price });
    });
});

// Update a book
app.put('/api/books/:id', (req, res) => {
    const { id } = req.params;
    const { name, author, description, price } = req.body;
    db.query('UPDATE books SET name = ?, author = ?, description = ?, price = ? WHERE id = ?', 
    [name, author, description, price, id], (err, results) => {
        if (err) {
            console.error('Error updating book:', err);
            return res.status(500).json({ error: 'Failed to update book' });
        }
        res.json({ id, name, author, description, price });
    });
});

// Delete a book
app.delete('/api/books/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM books WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete book' });
        }
        res.json({ deleted: true });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
