import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchBookDetails, deleteBook } from '../../services/BookService';
import { Book } from '../../models/Book';
import { useAuth } from '../../context/useAuth';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../../slices/cartSlice'; 
import { RootState } from '../../redux/store'; 
import './BookDetail.css'; 

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes('ROLE_ADMIN') ?? false;

  const { cartBookIds } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const loadBookDetails = async () => {
      if (!id) {
        setError('No book ID provided');
        setLoading(false);
        return;
      }

      try {
        const bookData = await fetchBookDetails(parseInt(id, 10));
        setBook(bookData);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load book details';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadBookDetails();
  }, [id]);

  const handleDeleteBook = async () => {
    if (id && window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(parseInt(id, 10));
        navigate('/books');
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? `Failed to delete book: ${err.message}` 
          : 'Failed to delete book';
        setError(errorMessage);
      }
    }
  };

  const renderLoadingState = () => (
    <div className="book-detail-container">
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading book details...</p>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="book-detail-container">
      <div className="alert alert-danger d-flex align-items-center" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        <div>{error}</div>
        <Link to="/books" className="btn btn-sm btn-outline-danger ms-3">Back to Books</Link>
      </div>
    </div>
  );

  const renderBookActions = () => {
    if (!book) return null;

    return (
      <div className="card-body user-actions d-flex justify-content-center gap-2">
        {!book.available ? (
          <button className="btn btn-secondary" disabled>
            Unavailable
          </button>
        ) : !cartBookIds.includes(book.id) ? (
          <button 
            className="btn btn-primary" 
            onClick={() => dispatch(addToCart(book.id))}
            aria-label="Add book to cart"
          >
            <i className="bi bi-cart-plus me-2"></i>Add to Cart
          </button>
        ) : (
          <button 
            className="btn btn-danger" 
            onClick={() => dispatch(removeFromCart(book.id))}
            aria-label="Remove book from cart"
          >
            <i className="bi bi-cart-dash me-2"></i>Remove from Cart
          </button>
        )}
      </div>
    );
  };

  const renderAdminActions = () => {
    if (!book || !isAdmin) return null;

    return (
      <div className="card-body admin-actions d-flex justify-content-center gap-2">
        <button 
          onClick={() => navigate(`/books/${book.id}/edit`)} 
          className="btn btn-secondary"
          aria-label="Edit book"
        >
          <i className="bi bi-pencil me-2"></i>Edit
        </button>
        <button 
          onClick={handleDeleteBook} 
          className="btn btn-danger"
          aria-label="Delete book"
        >
          <i className="bi bi-trash me-2"></i>Delete
        </button>
      </div>
    );
  };

  if (loading) return renderLoadingState();
  if (error) return renderErrorState();
  if (!book) return renderLoadingState();

  return (
    <div className="book-detail-container">
      <div className="container mt-4 d-flex justify-content-center align-items-center">
        <div className="card h-100 shadow-sm book-card">
          <div className="px-3 pt-3">
            <div className="book-image-container text-center">
              <img 
                src={book.image || '/placeholder-book.jpg'} 
                className="img-fluid book-image max-height-300" 
                alt={book.title} 
                onError={(e) => {
                  const imgElement = e.target as HTMLImageElement;
                  imgElement.src = '/placeholder-book.jpg';
                }}
              />
            </div>
          </div>

          <div className="card-body">
            <h5 className="card-title">{book.title}</h5>
            <p className="card-text">{book.description || 'No description available.'}</p>
            <p className="card-text">
              <strong>Status:</strong>{' '}
              <span className={`badge ${book.available ? 'bg-success' : 'bg-warning'}`}>
                {book.available ? 'Available' : 'Unavailable'}
              </span>
            </p>
          </div>

          <div className="book-details">
            <div className="card-header">Authors</div>
            <ul className="list-group list-group-flush">
              {book.authors.length > 0 ? (
                book.authors.map((author) => (
                  <li key={author.id} className="list-group-item">
                    {author.firstName} {author.lastName}
                  </li>
                ))
              ) : (
                <li className="list-group-item text-muted">No authors listed</li>
              )}
            </ul>
          </div>
          
          {renderBookActions()}
          {renderAdminActions()}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;