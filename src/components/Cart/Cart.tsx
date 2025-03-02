import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { removeFromCart } from '../../slices/cartSlice';
import { fetchBooksAsync } from '../../slices/booksSlice';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { UserProfileToken } from '../../models/User';
import './Cart.css';

// ✅ Fonction améliorée pour récupérer l'utilisateur depuis le token
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
    
    // Return the decoded user with necessary properties
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

  // ✅ États pour gérer l'authentification
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ Récupération des livres et du panier
  const books = useSelector((state: RootState) => state.books.books);
  const cartBookIds = useSelector((state: RootState) => state.cart.cartBookIds);
  const booksStatus = useSelector((state: RootState) => state.books.status);

  // ✅ États supplémentaires
  const [bookIds, setBookIds] = useState<number[]>([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // ✅ Vérification de l'authentification au chargement
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

  // ✅ Charger les livres si nécessaire
  useEffect(() => {
    if (booksStatus === 'idle') {
      dispatch(fetchBooksAsync());
    }
  }, [dispatch, booksStatus]);

  // ✅ Mettre à jour les IDs des livres dans le panier
  useEffect(() => {
    setBookIds(cartBookIds);
  }, [cartBookIds]);

  // ✅ Redirection si l'utilisateur n'est pas authentifié
  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  // ✅ Filtrer les livres présents dans le panier
  const cartBookData = books.filter((book) => cartBookIds.includes(book.id));

  const handleRemove = (id: number) => {
    dispatch(removeFromCart(id));
  };

const handleConfirmBorrowing = () => {
  if (!user) {
    console.error('User not found');
    navigate('/login');
    return;
  }

  console.log("User before navigation:", user);

  const loanDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(loanDate.getDate() + 14);

  // Pass the decoded user object directly
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
    <div className="cart-container">
    {booksStatus === 'loading' && <div>Loading books...</div>}
    {booksStatus === 'failed' && <div>Error loading books</div>}

    {cartBookData.length > 0 ? (
      <div className="cart-content">
        <div className="cart-items">
          {cartBookData.map((book) => (
            <div key={book.id} className="cart-item">
              <img className="item-image" src={book.image} alt={book.title} />
              <div className="item-info">
                <h4>{book.title}</h4>
                <p>{book.ISBN}</p>
                <button className="remove-btn" onClick={() => handleRemove(book.id)}>❌ Remove</button>
              </div>
            </div>
          ))}
        </div>

      <div className="cart-summary">
        <h3>Your Borrowing Summary</h3>
        <p>Total Items: {cartBookData.length}</p>
        <button className="validate-btn" onClick={handleConfirmBorrowing}>
          📚 Confirm Borrowing
        </button>
      </div>
      </div>
    ) : (
      <div className="empty-cart">
        <p>Your cart is empty.</p>
        <p>You have not added any items yet.</p>
      </div>
        )}
  </div>
);

};

export default Cart;





