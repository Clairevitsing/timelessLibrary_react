import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBookDetails, deleteBook } from '../../services/BookService';
import { Book } from '../../models/Book';
import { useAuth } from '../../context/useAuth';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../../slices/cartSlice'; 
import { RootState } from '../../redux/store'; 
import './BookDetailPage.css'; 

const BookDetailPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const isAdmin = user && Array.isArray(user.roles) && user.roles.includes('ROLE_ADMIN');

  const { cartBookIds } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchBookDetails(parseInt(id))
        .then(data => {
          setBook(data);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to load book details');
          setLoading(false);
        });
    }
  }, [id]);

  const handleDeleteBook = async () => {
    if (id && window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(parseInt(id));
        // Redirige vers la page des livres après suppression
        navigate('/books');
      } catch (err) {
        setError('Failed to delete book');
      }
    }
  };

  if (loading) return (
    <div className="book-detail-container">
      <div className="text-center">
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Loading...
      </div>
    </div>
  );
  
  if (error) return (
    <div className="book-detail-container">
      <div className="alert alert-danger">{error}</div>
    </div>
  );
  
  if (!book) return (
    <div className="book-detail-container">
      <div>No book found</div>
    </div>
  );

  return (
    <div className="book-detail-container">
      <div className="container mt-4 d-flex justify-content-center align-items-center">
        <div className="card h-100 shadow-sm book-card">
          <div className="px-3 pt-3">
            <div className="book-image-container">
              <img 
                src={book.image} 
                className="img-fluid book-image" 
                alt={book.title} 
              />
            </div>
          </div>

          <div className="card-body">
            <h5 className="card-title">{book.title}</h5>
            <p className="card-text">{book.description}</p>
            <p className="card-text">
              <strong>Status:</strong>
              <span className={`badge ${book.available ? 'bg-success' : 'bg-warning'}`}>
                {book.available ? 'Available' : 'Unavailable'}
              </span>
            </p>
          </div>
          <ul className="list-group list-group-flush">
            {book.authors.map((author) => (
              <li key={author.id} className="list-group-item">
                {author.firstName} {author.lastName}
              </li>
            ))}
          </ul>
          
          {/* Section des boutons utilisateur (centrée) */}
          <div className="card-body user-actions">
            {!book.available ? (
              <button className="btn btn-secondary" disabled>
                Unavailable
              </button>
            ) : !cartBookIds.includes(book.id) ? (
              <button className="btn btn-primary" onClick={() => dispatch(addToCart(book.id))}>
                Add to Cart
              </button>
            ) : (
              <button className="btn btn-danger" onClick={() => dispatch(removeFromCart(book.id))}>
                Remove from Cart
              </button>
            )}
          </div>
          
          {/* Section des boutons administrateur (si l'utilisateur est admin) */}
          {isAdmin && (
            <div className="card-body admin-actions">
              <button onClick={() => navigate(`/books/${book.id}/edit`)} className="btn btn-secondary">
                Edit
              </button>
              <button onClick={handleDeleteBook} className="btn btn-danger">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
