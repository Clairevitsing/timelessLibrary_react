import axios from 'axios';

// Define types for the parameters
interface BorrowBooksPayload {
    // Array of book IDs
    bookIds: number[]; 
  // Loan ID  
  loanId: number;     
}

const BASE_API_URL = 'http://127.0.0.1:8000/api/loans';

export const borrowBooks = async (bookIds: number[], loanId: number): Promise<any> => {
  try {
    // Prepare the request payload
    const payload: BorrowBooksPayload = {
      bookIds,
      loanId,
    };

    // Send the POST request to the backend
    const response = await axios.post(`${BASE_API_URL}/new`, payload);

    // If the request is successful, return the response data
    return response.data;
  } catch (error: any) {
    // Log the error for debugging
    console.error('Error borrowing books:', error);

    // Check if there's an error response from the server
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to borrow books');
    }

    // Throw a generic error if no specific response is available
    throw new Error('An unexpected error occurred');
  }
};


