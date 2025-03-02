import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../slices/cartSlice';
import LoanService from '../../services/LoanService';
import './LoanDetailsPage.css';
import { LoanDetailsState } from '../../models/Loan';



const LoanDetailsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loanId, setLoanId] = useState<number | null>(null);
  
  // Get state from navigation
  const state = location.state as LoanDetailsState;
  
  // Extract data from state
  const { books, user, loanDate, dueDate } = state || {};
  
  // If no state was passed, redirect back to cart
  useEffect(() => {
    if (!state) {
      navigate('/cart');
    }
  }, [state, navigate]);

  // Function to handle loan confirmation
  const handleConfirmLoan = async () => {
    if (!user || !books || books.length === 0) {
      setErrorMessage("Missing user or book information");
      return;
    }
    const userId = user.id || user.userName;

    if (!user.id) {
      setErrorMessage("Missing user ID");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      // Create loan data object
      const loanData = {
        userId: user.id,
        loanDate: loanDate,
        dueDate: dueDate,
        returnDate: null,
        bookIds: books.map(book => book.id)
      };
      
      // Use the LoanService to create the loan
      const response = await LoanService.createLoan(loanData);
      
      setLoanId(response.id);
      setSuccessMessage("Your books have been successfully borrowed!");
      
      // Clear cart after successful loan creation
      dispatch(clearCart());
    } catch (error: any) {
      console.error('Error creating loan:', error);
      setErrorMessage(error.response?.data?.error || "Failed to create loan. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If there's no data, show loading or redirect
  if (!state) {
    return <div>Loading...</div>;
  }

  return (
    <div className="loan-details-container">
      <h2>Loan Details</h2>
      
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      <div className="loan-info-section">
        <h3>Borrower Information</h3>
        <div className="info-grid">
          <div className="info-label">Name:</div>
          <div className="info-value">{user?.firstName || ''} {user?.lastName || ''}</div>
          
          <div className="info-label">Username:</div>
          <div className="info-value">{user?.userName || 'N/A'}</div>
          
          <div className="info-label">Email:</div>
          <div className="info-value">{user?.email || 'N/A'}</div>
          
          <div className="info-label">Loan Date:</div>
          <div className="info-value">{loanDate}</div>
          
          <div className="info-label">Due Date:</div>
          <div className="info-value">{dueDate}</div>
          
          <div className="info-label">Return Date:</div>
          <div className="info-value">Not returned yet</div>

          <div className="info-label">Total Books:</div>
         <div className="info-value">{books?.length || 0}</div>
        </div>
      </div>
      
      <div className="books-section">
        <h3>Books Being Borrowed</h3>
        <div className="book-list">
          {books?.map((book) => (
            <div key={book.id} className="book-item">
              <img src={book.image} alt={book.title} className="book-thumbnail" />
              <div className="book-details">
                <h4>{book.title}</h4>
                <p>ISBN: {book.ISBN}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {!loanId && (
        <div className="action-buttons">
          <button 
            className="back-button"
            onClick={() => navigate('/cart')}
          >
            Back to Cart
          </button>
          <button
            className="confirm-button"
            onClick={handleConfirmLoan}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Confirm Loan'}
          </button>
        </div>
      )}
      
      {loanId && (
        <div className="action-buttons">
          <button 
            className="home-button"
            onClick={() => navigate('/')}
          >
            Return to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default LoanDetailsPage;