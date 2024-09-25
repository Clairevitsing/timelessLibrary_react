import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './CSS/Book.css';  

const BooksList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/books')
      .then(response => response.json())
      .then(data => setBooks(data))
      .catch(error => console.error('Error fetching books:', error));
  }, []);

  return (
    <div>
      <h1 className="text-center titre text-white">All the Books</h1>
      <section className="container mt-5">
        <div className="row d-flex justify-content-center">
          {books.map(book => (
            <div key={book.id} className="col-md-4 mb-4">
              <div className="card mb-4 book">
                <img src={book.image} className="card-img-top" alt={`${book.title} cover`} />
                <div className="card-body">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="card-text">{book.description.slice(0, 100)}...</p>
                  <Link to={`/books/${book.id}`} className="btn btn-primary">See More</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BooksList;


