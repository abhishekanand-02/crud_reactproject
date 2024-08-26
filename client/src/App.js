import React, { useState, useEffect } from 'react';
import './App.css'; // Importing CSS file

function App() {
    const [books, setBooks] = useState([]);
    const [name, setName] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [currentBookId, setCurrentBookId] = useState(null);

    // Fetch books from the backend when the component mounts
    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/books'); // Use the correct API endpoint
            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }
            const data = await response.json();
            setBooks(data);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const addBook = async () => {
        if (!name || !author || !description || !price) {
            alert('Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, author, description, price }),
            });

            if (!response.ok) {
                throw new Error('Failed to add book');
            }

            const newBook = await response.json();
            setBooks([...books, newBook]);
            resetForm();
        } catch (error) {
            console.error('Error adding book:', error);
        }
    };

    const updateBook = async () => {
        if (!name || !author || !description || !price) {
            alert('Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/books/${currentBookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, author, description, price }),
            });

            if (!response.ok) {
                throw new Error('Failed to update book');
            }

            const updatedBook = await response.json();
            setBooks(books.map(book => (book.id === currentBookId ? updatedBook : book)));
            resetForm();
        } catch (error) {
            console.error('Error updating book:', error);
        }
    };

    const deleteBook = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/books/${id}`, { method: 'DELETE' });
            setBooks(books.filter(book => book.id !== id));
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    const editBook = (book) => {
        setName(book.name);
        setAuthor(book.author);
        setDescription(book.description);
        setPrice(book.price);
        setCurrentBookId(book.id);
        setEditMode(true);
    };

    const resetForm = () => {
        setName('');
        setAuthor('');
        setDescription('');
        setPrice('');
        setCurrentBookId(null);
        setEditMode(false);
    };

    return (
        <div className="container">
            <h1>Book Management Web Application</h1>
            <input
                type="text"
                placeholder="Book Name"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Author"
                value={author}
                onChange={e => setAuthor(e.target.value)}
            />
            <textarea
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
            <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={price}
                onChange={e => setPrice(e.target.value)}
            />

            <button onClick={editMode ? updateBook : addBook}>
                {editMode ? 'Update Book' : 'Add Book'}
            </button>
            <ul>
                {books.map(book => (
                    <li key={book.id} className="book-item">
                        <div className="book-info">
                            {book.name} by {book.author} - ${book.price}
                        </div>
                        <div className="book-actions">
                            <button className="update-btn" onClick={() => editBook(book)}>Update</button>
                            <button className="delete-btn" onClick={() => deleteBook(book.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
