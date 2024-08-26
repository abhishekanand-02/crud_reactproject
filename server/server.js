// server/server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// MySQL connection function
const createConnection = () => {
    return mysql.createConnection({
        host: 'localhost',         // Your MySQL host
        user: 'root',              // Your MySQL username
        password: 'passwd@05#', // Your MySQL password
        database: 'book_management', // Your MySQL database name
    });
};

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Book Management API');
});

// Get all books
app.get('/api/books', (req, res) => {
    const connection = createConnection();
    connection.query('SELECT * FROM books', (err, results) => {
        if (err) {
            console.error('Error fetching books:', err);
            return res.status(500).json({ error: 'Failed to fetch books' });
        }
        res.json(results);
    });
});

// Add a new book
app.post('/api/books', (req, res) => {
    const { name, author, description, price } = req.body;
    const connection = createConnection();
    connection.query(
        'INSERT INTO books (name, author, description, price) VALUES (?, ?, ?, ?)',
        [name, author, description, price],
        (err, result) => {
            if (err) {
                console.error('Error adding book:', err);
                return res.status(500).json({ error: 'Failed to add book' });
            }
            const newBookId = result.insertId;
            res.status(201).json({ id: newBookId, name, author, description, price });
        }
    );
});

// Update a book
app.put('/api/books/:id', (req, res) => {
    const { id } = req.params;
    const { name, author, description, price } = req.body;
    const connection = createConnection();
    connection.query(
        'UPDATE books SET name = ?, author = ?, description = ?, price = ? WHERE id = ?',
        [name, author, description, price, id],
        (err) => {
            if (err) {
                console.error('Error updating book:', err);
                return res.status(500).json({ error: 'Failed to update book' });
            }
            res.json({ id, name, author, description, price });
        }
    );
});

// Delete a book
app.delete('/api/books/:id', (req, res) => {
    const { id } = req.params;
    const connection = createConnection();
    connection.query('DELETE FROM books WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Error deleting book:', err);
            return res.status(500).json({ error: 'Failed to delete book' });
        }
        res.json({ deleted: true });
    });
});

// Start the server
const PORT = 5000; // Hardcoded port number
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
