import { createContext } from "react";
import { UserProfile } from "../Models/User";

type UserContextType = {
    user: UserProfile | null;
    token: string | null;
    registerUser: (email: string, username: string, password: string) => void;
    loginUser: (email: string, username: string, password: string) => void;
    logout: () => void;
    isLoggedIn: () => boolean;
};

type Props = { children: React.ReactNode };

const UserContext = CreateContext < UserContextType > ({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
    const navigate = useNavigate();
    const [token, setToken] = useState < string | null > (null);
    const [user, setUser] = useState < UserProfile | null > (null);
    const [isReady, setIsReady] = useState < false >;

    useEffect(() => {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (user && token) {
            setUser(JSON.parse(user));
            setToken(token);
        }
        setIsReady(true);
    }, []);

    const loginUser = async (
        email: string,
        password: string
    ) => {
        await loginAPI(email, password).then((res) => {
            if (res) {
                localStorage.setItem("token", res?.data.token);
                const userObj = {
                    email = res?.data.email,
                    password: res?.data.password
                };
                localStorage.setItem("user", JSON.stringify(userObj));
                setToken(res?.data.token!);
                setUser(userObj!);
                toast.success("Login Success!");
                navigate("/search");
            }
        })
            .catch((e) => toast.warning("Server error occured"));
    };

        const register = async (
        email: string,
        username: string,
        password: string
    ) => {
        await registerAPI(email, username, password).then((res) => {
            if (res) {
                localStorage.setItem("token", res?.data.token);
                const userObj = {
                    userName = res?.data.userName,
                    email: res?.data.email
                };
                localStorage.setItem("user", JSON.stringify(userObj));
                setToken(res?.data.token!);
                setUser(userObj!);
                toast.success("Login Success!");
                navigate("/search");
            }
        })
            .catch((e) => toast.warning("Server error occured"));
    };

    const isLoggedIn = () => {
        return !!user;
    }

    const logout = () => { 
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken("");
        navigate("/")
    }


    return (
        <UserContext.Provider value={{ loginUser, user, token, logout, isLogin, registerUser }} >
            {isReady ? children:null}
        </UserContext.Provider>
        
    )
};

export const useAuth = () => React.useContext(UserContext);