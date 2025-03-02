import React, { createContext, useState, useEffect, useContext } from "react";
import { UserProfile, UserDecodedToken } from "../models/User";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginAPI, registerAPI } from "../services/AuthService";
import { jwtDecode } from "jwt-decode"; 

type UserContextType = {
    user: UserProfile | null;
    token: string | null;
    registerUser: (firstName: string, lastName: string, userName: string, phoneNumber: string, email: string, password: string, roles: string[], subStartDate: string, subEndDate:string) => Promise<void>;
    loginUser: (email: string, password: string) => Promise<void>;
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


const loginUser = async (email: string, password: string): Promise<void> => {
    try {
        const res = await loginAPI(email, password);
        if (!res) {
            toast.error("Invalid credentials! Please try again.");
            return;
        }

        const { token, user } = res;
        
        try {
            const decodedToken = jwtDecode<UserDecodedToken>(token);
            console.log("Decoded Token:", decodedToken);

            // Si l'API renvoie un utilisateur, utilisez-le, sinon créez-en un à partir du token
            const userData: UserProfile = user || {
                id: decodedToken.id ?? undefined,
                firstName: decodedToken.firstName ?? "",  
                lastName: decodedToken.lastName ?? "",
                userName: decodedToken.userName ?? "",
                phoneNumber: "", 
                email: decodedToken.email ?? "",
                password: "",   
                roles: decodedToken.roles ?? [],
                subStartDate: "",
                subEndDate: ""
            };

            // Créez un objet combiné comme attendu par getUserFromToken()
            const userProfileData = {
                ...userData,
                token: token
            };

            // Stockez dans localStorage sous la clé 'userProfile'
            localStorage.setItem("userProfile", JSON.stringify(userProfileData));
            
            // Vous pouvez aussi conserver les clés individuelles si nécessaire
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(userData));

            setUser(userData);
            setToken(token);

            toast.success("Login Successful! Redirecting...");
            navigate("/", { replace: true });
            
        } catch (decodeError) {
            console.error("Failed to decode JWT:", decodeError);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("userProfile");
            setToken(null);
            toast.error("Session error. Please log in again.");
            throw new Error("JWT decode failed");
        }

    } catch (e) {
        console.error("Login error:", e);
        toast.error("Login failed! Please check your credentials.");
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