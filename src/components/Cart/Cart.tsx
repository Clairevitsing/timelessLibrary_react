import React, { useEffect,useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { removeFromCart } from '../../slices/cartSlice';
import { fetchBooksAsync } from '../../slices/booksSlice';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { UserProfileToken } from '../../models/User';


const token = localStorage.getItem('token');
if (token) {
  const decoded = jwtDecode(token);
  const expDate = (decoded.exp ?? 0) * 1000; 
  const currentTime = Date.now();
  
  if (expDate < currentTime) {
    console.log("Token expired, redirecting to login...");
    // Rediriger l'utilisateur vers la page de login
    window.location.href = "/login";
  } else {
    console.log("Token is valid", decoded);
  }
}

const getUserFromToken = () => {
  // Récupérer le profil utilisateur depuis localStorage
  const userProfile: UserProfileToken | null = JSON.parse(localStorage.getItem('userProfile') || 'null');
  
  console.log('UserProfile from localStorage:', userProfile);

  if (userProfile?.token) {
    try {
      const decoded = (jwtDecode as any)(userProfile.token);
      
      // Vérifier l'expiration du token
      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        console.error('Token expired');
        localStorage.removeItem('userProfile');
        return null;
      }

      console.log('Decoded JWT Payload:', decoded);
      return decoded;
    } catch (error) {
      console.error('Failed to decode JWT', error);
      localStorage.removeItem('userProfile');
    }
  }
  
  return null;
};


const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Add state for user
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Récupérer les livres et les IDs du panier depuis Redux
  const books = useSelector((state: RootState) => state.books.books);
  const cartBookIds = useSelector((state: RootState) => state.cart.cartBookIds);
  const booksStatus = useSelector((state: RootState) => state.books.status);

  // Initialize state for book IDs, loan ID, and other states
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [bookIds, setBookIds] = useState<number[]>([]); 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loanId, setLoanId] = useState<number>(0); 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [successMessage, setSuccessMessage] = useState<string>('');

    // Vérification de l'authentification
  useEffect(() => {
    const userData = getUserFromToken();
    console.log('User data from token:', userData);

    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      console.log('No user data found, redirecting to login');
      setIsAuthenticated(false);
      // navigate('/login');
    }
  }, [navigate]);

  // Charger les livres si nécessaire
  useEffect(() => {
    if (booksStatus === 'idle') {
      dispatch(fetchBooksAsync());
    }
  }, [dispatch, booksStatus]);

   // Mettre à jour bookIds à chaque changement dans cartBookIds
  useEffect(() => {
    setBookIds(cartBookIds); 
  }, [cartBookIds]);


if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  // Filtrer les livres présents dans le panier
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

    // Ensure user object has the required properties
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
          {/* Submit Button */}
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




