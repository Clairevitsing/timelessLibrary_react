import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { removeFromCart } from '../../slices/cartSlice';
import { fetchBooksAsync } from '../../slices/booksSlice';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { UserProfileToken } from '../../models/User';
import styles from './Cart.module.css'; // Import CSS Module
import { Button, Card, Container, Row, Col, Alert } from 'react-bootstrap'; // Import Bootstrap components

// Function to retrieve user data from the token stored in localStorage
const getUserFromToken = () => {
  const storedProfile = localStorage.getItem('userProfile');

  if (!storedProfile) {
    console.warn('No user profile found in localStorage.');
    return null;
  }

  try {
    const userProfile: UserProfileToken = JSON.parse(storedProfile);
    console.log('Retrieved userProfile from localStorage:', userProfile);

    if (!userProfile?.token) {
      console.error('Token not found in userProfile.');
      return null;
    }

    const decoded = jwtDecode(userProfile.token) as any;

    if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
      console.error('Token is expired.');
      localStorage.removeItem('userProfile');
      return null;
    }

    console.log('Decoded user:', decoded);

    return {
      id: decoded.userId,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      userName: decoded.userName,
      email: decoded.email,
      roles: decoded.roles,
      token: userProfile.token,
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    localStorage.removeItem('userProfile');
    return null;
  }
};

const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // State to manage user authentication
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch books and cart data from Redux store
  const books = useSelector((state: RootState) => state.books.books);
  const cartBookIds = useSelector((state: RootState) => state.cart.cartBookIds);
  const booksStatus = useSelector((state: RootState) => state.books.status);

  // Additional states for loading, error, and success messages
  const [bookIds, setBookIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Check user authentication on component mount
  useEffect(() => {
    const userData = getUserFromToken();

    if (userData) {
      console.log('User is authenticated:', userData);
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      console.warn('User is NOT authenticated, redirecting to login.');
      setIsAuthenticated(false);
      navigate('/login');
    }
  }, [navigate]);

  // Fetch books if not already loaded
  useEffect(() => {
    if (booksStatus === 'idle') {
      dispatch(fetchBooksAsync());
    }
  }, [dispatch, booksStatus]);

  // Update book IDs in the cart
  useEffect(() => {
    setBookIds(cartBookIds);
  }, [cartBookIds]);

  // Redirect if user is not authenticated
  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  // Filter books that are in the cart
  const cartBookData = books.filter((book) => cartBookIds.includes(book.id));

  // Handle removing a book from the cart
  const handleRemove = (id: number) => {
    dispatch(removeFromCart(id));
  };

  // Handle confirming borrowing
  const handleConfirmBorrowing = () => {
    if (!user) {
      console.error('User not found');
      navigate('/login');
      return;
    }

    const loanDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(loanDate.getDate() + 14);

    // Navigate to loan details page with book and user data
    navigate('/loanDetailsPage', {
      state: {
        books: cartBookData,
        user: user,
        loanDate: loanDate.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
      },
    });
  };

  return (
    <div className={styles.cartContainer}>
    {booksStatus === 'loading' && <div>Loading books...</div>}
    {booksStatus === 'failed' && <div>Error loading books</div>}

    {cartBookData.length > 0 ? (
        <div className={styles.cartContent}>
            <div className={styles.cartItems}>
                {cartBookData.map((book) => (
                    <div key={book.id} className={styles.cartItem}>
                        <img className={styles.itemImage} src={book.image} alt={book.title} />
                        <div className={styles.itemInfo}>
                            <h4>{book.title}</h4>
                            <p>{book.ISBN}</p>
                        </div>
                        <button className={styles.removeBtn} onClick={() => handleRemove(book.id)}>
                            ❌ Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className={styles.cartSummary}>
                <h3>Your Borrowing Summary</h3>
                <p>Total Items: {cartBookData.length}</p>
                <button className={styles.validateBtn} onClick={handleConfirmBorrowing}>
                    📚 Confirm Borrowing
                </button>
            </div>
        </div>
    ) : (
        <div className={styles.emptyCart}>
            <p>Your cart is empty.</p>
            <p>You have not added any items yet.</p>
        </div>
    )}
</div>

  );
};

export default Cart;





