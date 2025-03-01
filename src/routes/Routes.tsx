import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage/HomePage";
import SearchPage from "../pages/SearchPage/SearchPage";
import BookPage from "../pages/BookPage/BookPage";
import Contact from "../pages/Contact/Contact";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import CategoryPage from "../pages/CategoryPage/CategoryPage";
import BookDetailPage from "../pages/BookDetailPage/BookDetailPage";
import BookCreateForm from "../pages/BookCreateForm/BookCreateForm";
import BookEditPage from "../pages/BookEditPage/BookEditPage";
import Cart from "../components/Cart/Cart";
import LoanDetails from "../components/Loan/LoanDetails";
import LoanDetailsPage from "../pages/LoanDetailsPage/LoanDetailsPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "search", element: <SearchPage /> },
            { path: "book", element: <BookPage /> },
            { path: "contact", element: <Contact /> },
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> },
            { path: "logout", element: <HomePage /> },
            { path: "cart", element: <Cart /> },  
            { path: "loanDetailsPage", element:<LoanDetailsPage />},
            { path: "loanDetails", element: <LoanDetails /> }, 
            { path: "book/:id", element: <BookDetailPage /> },
            { path: "book/edit", element: <BookEditPage /> },
            { path: "book/new", element: <BookCreateForm /> },
        ]
    }
]);
