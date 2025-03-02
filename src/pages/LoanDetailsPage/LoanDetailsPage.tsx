import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../slices/cartSlice';
import LoanService from '../../services/LoanService';
import './LoanDetailsPage.css';
import { LoanDetailsState } from '../../models/Loan';
import jsPDF from 'jspdf';

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

  // Memoized userId to avoid unnecessary recalculations
  const userId: number | null = useMemo(() => {
    // S'assure que userId est soit un number soit null
    return user?.id ?? null; 
  }, [user]);

  // Redirect to cart if no state is provided
  useEffect(() => {
    if (!state) navigate('/cart', { replace: true });
  }, [state, navigate]);

  // Function to handle loan confirmation
  const handleConfirmLoan = async () => {
    if (!userId) {
      setErrorMessage("Missing user ID");
      return;
    }

    if (!books || books.length === 0) {
      setErrorMessage("No books selected");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Create loan data object
      const loanData = {
        // userId est maintenant toujours un number
        userId: userId, 
        loanDate,
        dueDate,
        returnDate: null,
        bookIds: books.map(book => book.id),
      };

      // Call LoanService to create the loan
      const response = await LoanService.createLoan(loanData);

      setLoanId(response.id);
      setSuccessMessage("Your books have been successfully borrowed!");

      // Clear cart after successful loan creation
      dispatch(clearCart());
    } catch (error: any) {
      console.error('Error creating loan:', error);
      setErrorMessage(error.response?.data?.error || error.message || "Failed to create loan. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = () => {
  if (!books || !user) {
    setErrorMessage("No loan details to download");
    return;
  }

  // Créer un nouveau document PDF
  const doc = new jsPDF();
  
  // Configuration de style
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("LOAN DETAILS", 105, 20, { align: "center" });
  
  // Ligne de séparation
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(20, 25, 190, 25);
  
  // Informations de l'emprunteur
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Borrower Information", 20, 35);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  
  // Données d'emprunteur
  const borrowerInfo = [
    `Name: ${user.firstName || ''} ${user.lastName || ''}`,
    `Username: ${user.userName || 'N/A'}`,
    `Email: ${user.email || 'N/A'}`,
    `Loan Date: ${loanDate}`,
    `Due Date: ${dueDate}`,
    `Return Date: Not returned yet`,
    `Total Books: ${books.length || 0}`
  ];
  
  let yPosition = 45;
  borrowerInfo.forEach(info => {
    doc.text(info, 25, yPosition);
    yPosition += 8;
  });
  
  // Ligne de séparation
  doc.line(20, yPosition, 190, yPosition);
  yPosition += 10;
  
  // Livres empruntés
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Books Being Borrowed", 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  
  // Liste des livres
  books.forEach((book, index) => {
    // Vérifier si on a besoin d'une nouvelle page
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFont("helvetica", "bold");
    doc.text(`${index + 1}. ${book.title}`, 25, yPosition);
    yPosition += 8;
    
    doc.setFont("helvetica", "normal");
    doc.text(`ISBN: ${book.ISBN}`, 30, yPosition);
    yPosition += 12;
  });
  
  // Ajout du numéro de prêt s'il existe
  if (loanId) {
    yPosition += 5;
    doc.setFont("helvetica", "bold");
    doc.text(`Loan ID: ${loanId}`, 20, yPosition);
  }
  
  // Pied de page avec date de génération
  const today = new Date().toLocaleDateString();
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text(`Generated on: ${today}`, 20, 285);
  
  // Télécharger le PDF
  doc.save(`loan-details-${new Date().toISOString().split('T')[0]}.pdf`);
};
  
  return (
    <div className="loan-details-page">
    <div className="loan-details-container">
      <h2>Loan Details</h2>

      {errorMessage && (
        <div className="error-message" aria-live="polite">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="success-message" aria-live="polite">
          {successMessage}
        </div>
      )}

      <div className="loan-info-section">
        <h3>Borrower Information</h3>
        <div className="info-grid">
          <div className="info-label">Name:</div>
          <div className="info-value">{user?.firstName} {user?.lastName}</div>

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

      {!loanId ? (
        <div className="action-buttons">
          <button
            className="back-button"
            onClick={() => navigate('/cart')}
            disabled={isSubmitting}
          >
            Back to Cart
          </button>
          <button
            className="confirm-button"
            onClick={handleConfirmLoan}
            disabled={isSubmitting || (books?.length === 0)}
          >
            {isSubmitting ? 'Processing...' : 'Confirm Loan'}
          </button>
          <button
            className="download-button"
            onClick={handleDownload}
            disabled={!books || books.length === 0}
            >
            Download
          </button>
        </div>
      ) : (
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
      </div>
  );
};

export default LoanDetailsPage;

