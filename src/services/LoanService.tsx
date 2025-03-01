import axios from "axios";
import { CreateLoanRequest, LoanResponse, Loan } from "../models/Loan";

const BASE_API_URL = "http://127.0.0.1:8000/api/loans";

class LoanService {
  /** Crée un nouvel emprunt avec les livres associés */
  async createLoan(loanData: CreateLoanRequest): Promise<LoanResponse> {
    try {
      const response = await axios.post(`${BASE_API_URL}/new`, loanData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error creating loan:", error.response?.data || error.message);
      throw error;
    }
  }

  /** Récupère tous les emprunts d'un utilisateur */
  async getUserLoans(userId: number): Promise<Loan[]> {
    try {
      const response = await axios.get(`${BASE_API_URL}/user/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching user loans:", error.response?.data || error.message);
      throw error;
    }
  }

  /** Récupère un emprunt spécifique par son ID */
  async getLoanById(loanId: number): Promise<Loan> {
    try {
      const response = await axios.get(`${BASE_API_URL}/${loanId}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching loan #${loanId}:`, error.response?.data || error.message);
      throw error;
    }
  }

  /** Met à jour un emprunt (ex: retour de livres) */
  async updateLoan(loanId: number, loanData: Partial<CreateLoanRequest>): Promise<LoanResponse> {
    try {
      const response = await axios.put(`${BASE_API_URL}/${loanId}/edit`, loanData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error: any) {
      console.error(`Error updating loan #${loanId}:`, error.response?.data || error.message);
      throw error;
    }
  }

  /** Marque les livres comme retournés */
  async returnBooks(loanId: number): Promise<LoanResponse> {
    try {
      const returnDate = new Date().toISOString().split("T")[0];
      const response = await axios.put(`${BASE_API_URL}/${loanId}/edit`, { returnDate }, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error: any) {
      console.error(`Error returning books for loan #${loanId}:`, error.response?.data || error.message);
      throw error;
    }
  }
}

export default new LoanService();
