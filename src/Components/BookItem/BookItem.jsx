import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function BookItem() {
  // Get the book ID from the URL parameter
  const { bookId } = useParams(); 
  const [book, setBook] = useState(null);
  // Used for navigation after delete
  const navigate = useNavigate(); 

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/books/${bookId}`)
      .then(response => response.json())
      .then(data => setBook(data))
      .catch(error => console.error('Failed to fetch book details:', error));
  }, [bookId]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      fetch(`http://127.0.0.1:8000/api/books/${bookId}`, { method: 'DELETE' })
        .then(response => {
          if (response.ok) {
            alert('Book deleted successfully!');
            navigate('/'); 
          } else {
            throw new Error('Failed to delete the book');
          }
        })
        .catch(error => alert('Error deleting book:', error));
    }
  };

  const handleEdit = () => {
    navigate(`/books/edit/${bookId}`); 
  };

  if (!book) {
    return <div className="book-loading">Loading...</div>; 
  }

  return (
    <div className="book-item-container"> 
      <h1>{book.title}</h1>
      <img src={book.image} alt={`${book.title} cover`} />
      <p>Category: {book.category.name}</p>
      <p>Description: {book.description}</p>
      <div>Authors: {book.authors.map(author => (
        <p key={author.id}>{author.firstName} {author.lastName}</p>
      ))}</div>
      <p>Published: {new Date(book.publishedYear).toLocaleDateString()}</p>
      <p>ISBN: {book.ISBN}</p>
      <p>Available: {book.available ? 'Yes' : 'No'}</p>
      <button onClick={handleEdit} className="btn btn-primary">Edit</button>
      <button onClick={handleDelete} className="btn btn-danger">Delete</button>
    </div>
  );
}

export default BookItem;
