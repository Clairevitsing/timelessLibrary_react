import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";
import { UserProfile } from "../models/User";

// Définition de l'URL de base de l'API
const BASE_API_URL = "http://127.0.0.1:8000/api";


export const loginAPI = async (email: string, password: string): Promise<{ token: string, user?: UserProfile  | null } | null> => {
    try {
        console.log("Login request:", { email, password });

        const response = await axios.post<{ token: string }>(`${BASE_API_URL}/login_check`, {
            email: email, 
            password: password
        });

        if (!response.data || !response.data.token) {
            throw new Error("No token received from API");
        }

        // Configuration du token pour les futures requêtes
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        // Obtention des données utilisateur (si vous avez un endpoint /me)
        let userData = null;
        try {
            const userResponse = await axios.get<UserProfile>(`${BASE_API_URL}/me`);
            userData = userResponse.data;
        } catch (userError) {
            console.warn("Could not fetch user profile", userError);
        }

        console.log("Login success with user data:", { token: response.data.token, user: userData });
        return { ...response.data, user: userData }; 
    } catch (error: any) {
        console.error("Login failed:", error.response?.data || error.message);
        return null; 
    }
};


export const registerAPI = async (
    firstName: string,
    lastName: string,
    userName: string,
    phoneNumber: string,
    email: string,
    password: string,
    roles: string[],
    subStartDate: string,
    subEndDate: string
) => {
     try{
         const data = await axios.post<UserProfile>(BASE_API_URL + "/register", {
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            phoneNumber: phoneNumber,
            email: email,
             password: password,
             roles: roles,
             subStartDate: subStartDate,
             subEndDate:subEndDate

        });
        return data;
    } catch (error) {
        handleError(error);
    }
};