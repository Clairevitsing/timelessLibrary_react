
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryBooks = ({ category }) => {

    const [categoryData, setCategoryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const response = await axios.get('/api/categories/1');
                setCategoryData(response.data);
                setLoading(false);
            } catch (err) {
                setError('An error occurred while fetching the data.');
                setLoading(false);
            }
        };

        fetchCategoryData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!categoryData) return <div>No data available.</div>;

    return (
        <div className="category-books">
            <h1>{category.name}</h1>

            <h2>Books in this category</h2>
            {category.books.length === 0 ? (
                <p>No books found in this category.</p>
            ) : (
                <ul className="book-list">
                    {category.books.map((book) => (
                        <li key={book.id} className="book-item">
                            <img src={book.image} alt={book.title} className="book-cover" />
                            <h3>{book.title}</h3>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CategoryBooks;