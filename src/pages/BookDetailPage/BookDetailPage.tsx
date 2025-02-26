import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBookDetails } from '../../services/BookService';
import { Book } from '../../models/Book';
import { useAuth } from '../../context/useAuth';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../../slices/cartSlice'; 
import { RootState } from '../../redux/store'; 

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

  if (loading) return <div className="text-center"><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!book) return <div>No book found</div>;

  return (
    <div className="container mt-4 d-flex justify-content-center align-items-center">

      <div className="card h-100 shadow-sm" style={{ width: '30rem',height:'auto' }}>
        
         <div className="px-3 pt-3">
                                <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <img 
                                        src={book.image} 
                                        className="img-fluid" 
                                        style={{ maxHeight: "100%", objectFit: "contain" }} 
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
        <div className="card-body">
          {/* Button logic based on book availability */}
            {
              !book.available ? (
                // If the book is unavailable, disable the button
                <button className="btn btn-secondary" disabled>
                  Unavailable
                </button>
              ) : !cartBookIds.includes(book.id) ? (
                // If the book is available and not in the cart, add it to the cart
                <button className="btn btn-primary" onClick={() => dispatch(addToCart(book.id))}>
                  Add to Cart
                </button>
              ) : (
                // If the book is available and already in the cart, remove it from the cart
                <button className="btn btn-danger" onClick={() => dispatch(removeFromCart(book.id))}>
                  Remove from Cart
                </button>
              )
            }

          {isAdmin && (
            <>
              <button onClick={() => navigate(`/edit-book/${book.id}`)} className="btn btn-secondary">
                Edit
              </button>
              <button onClick={() => navigate(`/delete-book/${book.id}`)} className="btn btn-danger">
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;