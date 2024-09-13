import React, { useState, useEffect } from 'react';
import './Books.css';

const Books = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getBooks = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch("http://127.0.0.1:8000/api/books/recent");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                if (data && data.books && Array.isArray(data.books)) {
                    setBooks(data.books);
                } else {
                    throw new Error('Unexpected data format');
                }
            } catch (error) {
                console.error("Error fetching books:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        getBooks();
    }, []);

    const chunkArray = (arr, size) => {
        return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
            arr.slice(i * size, i * size + size)
        );
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    const bookRows = chunkArray(books, 4);

    return (
        <div className="books-page">
            <h1 className="page-title">Recent Published Books</h1>
            <div className="books-container">
                {bookRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="book-row">
                        {row.map((book) => (
                            <div key={book.id} className="book-item">
                                <img src={book.image} alt={book.title} />
                                <h3>{book.title}</h3>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Books;