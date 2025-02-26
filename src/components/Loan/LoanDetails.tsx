import React from 'react';
import { useLocation } from 'react-router-dom';

interface BorrowingDetailsProps {
  state: {
    userInfo: {
      firstname: string;
      lastname: string;
      email: string;
    };
    loanInfo: {
      loanDate: string;
      dueDate: string;
      totalItems: number;
    };
    books: Array<{ id: number; title: string; ISBN: string; image: string }>;
  };
}

const LoanDetails: React.FC = () => {
  const location = useLocation();
  const { userInfo, loanInfo, books } = location.state as BorrowingDetailsProps['state'];

  return (
    <div className="borrowing-details">
      <h2>Borrowing Details</h2>
      <h3>User Information</h3>
      <p><strong>Name:</strong> {userInfo.firstname} {userInfo.lastname}</p>
      <p><strong>Email:</strong> {userInfo.email}</p>

      <h3>Loan Information</h3>
      <p><strong>Loan Date:</strong> {loanInfo.loanDate}</p>
      <p><strong>Due Date:</strong> {loanInfo.dueDate}</p>
      <p><strong>Total Items:</strong> {loanInfo.totalItems}</p>

      <h3>Books</h3>
      {books.map((book) => (
        <div key={book.id} className="book-item">
          <img src={book.image} alt={book.title} width="50" />
          <div>
            <p><strong>Title:</strong> {book.title}</p>
            <p><strong>ISBN:</strong> {book.ISBN}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoanDetails;
