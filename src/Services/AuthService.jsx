import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";

// Define the base API URL as a constant
const BASE_API_URL = "http://127.0.0.1:8000/api";

// TypeScript interfaces for API responses
interface UserProfile {
    email: string;
    password?: string;
    userName?: string;
}

interface ApiResponse {
    data: {
        token: string;
        email: string;
        userName?: string;
    }
}

/**
 * Attempts to log in a user with the provided credentials.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns A promise resolving to the user's profile data including a token.
 */
export const loginAPI = async (email: string, password: string): Promise<ApiResponse> => {
    try {
        const response = await axios.post(`${BASE_API_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

/**
 * Registers a new user with the provided details.
 * @param email - The user's email.
 * @param username - The user's chosen username.
 * @param password - The user's chosen password.
 * @returns A promise resolving to the new user's profile data including a token.
 */
export const registerAPI = async (email: string, username: string, password: string): Promise<ApiResponse> => {
    try {
        const response = await axios.post(`${BASE_API_URL}/register`, { email, username, password });
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};
