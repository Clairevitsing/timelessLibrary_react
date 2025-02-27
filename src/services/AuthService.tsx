import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";
import { UserDecodedToken, UserProfile } from "../models/User";

// Définition de l'URL de base de l'API
const BASE_API_URL = "http://127.0.0.1:8000/api";


export const loginAPI = async (email: string, password: string): Promise<{ token: string } | undefined> => {
    try {
        console.log("Login request:", { email, password });

        const response = await axios.post<{ token: string }>(`${BASE_API_URL}/login_check`, {
            email: email, // ✅ Vérifier que l'API attend bien "email"
            password: password
        });

        if (!response.data || !response.data.token) {
            throw new Error("No token received from API");
        }

        console.log("Login success:", response.data);
        return response.data; // ✅ Retourne bien un objet avec { token }
    } catch (error: any) {
        if (error.response) {
            console.error("Login failed:", error.response.data);
        } else {
            console.error("Login error:", error.message);
        }
        return undefined; // ✅ Gestion explicite des erreurs
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