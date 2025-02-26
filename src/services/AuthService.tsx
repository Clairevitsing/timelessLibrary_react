import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";
import { UserProfileToken, UserProfile } from "../models/User";

// Define the base API URL as a constant
const BASE_API_URL = "http://127.0.0.1:8000/api";


export const loginAPI = async (email: string, password: string) => {
    try {
        const data = await axios.post<UserProfileToken>(BASE_API_URL + "/login_check", {
            email: email,
            password: password
        });
        return data;
    } catch (error) {
        handleError(error);
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