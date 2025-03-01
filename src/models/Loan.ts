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