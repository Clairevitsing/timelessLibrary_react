import React, { createContext, useState, useEffect, useContext } from "react";
import { UserProfile, UserProfileToken } from "../models/User";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginAPI, registerAPI } from "../services/AuthService";

type UserContextType = {
    user: UserProfile | null;
    token: string | null;
    registerUser: (firstName: string, lastName: string, userName: string, phoneNumber: string, email: string, password: string, roles: string[], subStartDate: string, subEndDate:string) => Promise<void>;
    loginUser: (userName:string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoggedIn: () => boolean;
};

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);


export const UserProvider: React.FC<Props> = ({ children }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
        setIsReady(true);
    }, []);

    const loginUser = async (userName: string, email: string, password: string) => {
        try {
            const res = await loginAPI(email, password);
            if (res && res.data) {
                const userData: UserProfileToken = res.data;
                localStorage.setItem("token", userData.token);
                const userObj: UserProfile = {
                    email: userData.email,
                    password: userData.password,
                    // These fields are not provided by loginAPI
                    firstName: "",  
                    lastName: "",   
                    userName:userData.userName,   
                    phoneNumber: "",
                    roles: [""],
                    subStartDate: "",
                    subEndDate: ""
                };
                localStorage.setItem("user", JSON.stringify(userObj));
                setToken(userData.token);
                setUser(userObj);
                toast.success("Login Success!");
                navigate("/");
            }
        } catch (e) {
            toast.warning("Server error occurred");
        }
    };
    const registerUser = async (
        firstName: string,
        lastName: string,
        userName: string,
        phoneNumber: string,
        email: string,
        password: string,
        roles: string[],
        subStartDate: string,
        subEndDate:string
    ) => {
        try {
            const res = await registerAPI(firstName, lastName, userName, phoneNumber, email, password, roles, subStartDate, subEndDate);
            if (res && res.data) {
                const userData: UserProfile = res.data;
                localStorage.setItem("token", "dummy_token"); 
                localStorage.setItem("user", JSON.stringify(userData));
                setToken("dummy_token"); 
                setUser(userData);
                toast.success("Registration Success!");
                navigate("/search");
            }
        } catch (e) {
            toast.warning("Server error occurred");
        }
    };

    // const isLoggedIn = () => {
    //     return !!user;
    // }

    const logout = () => { 
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
      

     // Providing feedback to the user
    toast.info("You've been logged out successfully.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
        
    navigate("/")
    }

    const isLoggedIn = (): boolean => !!user;
   

    return (
        <UserContext.Provider value={{ loginUser, registerUser, user, token, logout, isLoggedIn }}>
            {isReady ? children : null}
        </UserContext.Provider>
    );
};

export const useAuth = () => useContext(UserContext);