import { Book } from './Book';
import { UserDecodedToken } from './User';

export interface CreateLoanRequest {
  userId: number;
  loanDate: string;
  dueDate: string;
  returnDate: string | null;
  bookIds: number[];
}

export interface LoanResponse {
  id: number;
  message: string;
}

export interface Loan {
  id: number;
  loanDate: string;
  dueDate: string;
  returnDate: string | null;
  userId: number;
  books: {
    id: number;
    title: string;
    ISBN: string;
    image: string;
  }[];
}

export interface LoanDetailsState {
  books: Book[];
  user: UserDecodedToken;
  loanDate: string;
  dueDate: string;
}
