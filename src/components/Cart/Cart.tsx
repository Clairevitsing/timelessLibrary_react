import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { removeFromCart } from '../../slices/cartSlice';
import { fetchBooksAsync } from '../../slices/booksSlice';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { UserProfileToken } from '../../models/User';

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
    return decoded;
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

    const loanDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(loanDate.getDate() + 14);

    navigate('/loanDetails', {
      state: {
        books: cartBookData,
        user: {
          firstname: user.firstname || 'N/A',
          lastname: user.lastname || 'N/A',
          email: user.email || 'N/A',
        },
        loanDate: loanDate.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
      },
    });
  };

  return (
    <div className="cart">
      {booksStatus === 'loading' && <div>Loading books...</div>}
      {booksStatus === 'failed' && <div>Error loading books</div>}

      {cartBookData.length > 0 ? (
        <div className="cart-book">
          <h3 className="header">Items in Cart</h3>
          {cartBookData.map((book) => (
            <div key={book.id} className="row mb-3">
              <img className="item-image" src={book.image} alt={book.title} />
              <div className="item-info ms-3">
                <h4>{book.title}</h4>
                <p className="text-truncate">{book.ISBN}</p>
                <button
                  className="btn btn-danger"
                  onClick={() => handleRemove(book.id)}
                >
                  <i className="bi bi-trash-fill" /> Remove Item
                </button>
              </div>
            </div>
          ))}
          <h4 className="mt-3">Total Items: {cartBookData.length}</h4>

          <button
            className="btn btn-success mt-3"
            onClick={handleConfirmBorrowing}
            style={{ width: '100%' }}
            disabled={loading || cartBookData.length === 0} 
          >
            {loading ? 'Processing...' : 'Confirm'}
          </button>
          {successMessage && <div className="mt-3">{successMessage}</div>}
          {error && <div className="mt-3 text-danger">{error}</div>}
        </div>
      ) : (
        <div className="text-center empty-cart">
          <i className="bi bi-cart3" style={{ fontSize: '2rem' }} />
          <p>Your cart is empty.</p>
          <p>You have not added any items to your cart.</p>
        </div>
      )}
    </div>
  );
};

export default Cart;





