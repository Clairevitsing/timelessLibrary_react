import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage/HomePage";
import SearchPage from "../pages/SearchPage/SearchPage";
import BookPage from "../pages/BookPage/BookPage";
import Contact from "../pages/Contact/Contact";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import CategoryPage from "../pages/CategoryPage/CategoriesPage";
import BookDetail from "../components/BookDetail/BookDetail";
import BookCreateForm from "../pages/BookCreateForm/BookCreateForm";
import EditBookPage from "../pages/EditBookPage/EditBookPage";
import Cart from "../components/Cart/Cart";
import LoanDetails from "../components/Loan/LoanDetails";
import LoanDetailsPage from "../pages/LoanDetailsPage/LoanDetailsPage";
import CategoryBooks from "../components/CategoryBooks/CategoryBooks";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "search", element: <SearchPage /> },
            { path: "books", element: <BookPage /> },
            { path: "contact", element: <Contact /> },
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> },
            { path: "logout", element: <HomePage /> },
            { path: "cart", element: <Cart /> },  
            { path: "loanDetailsPage", element:<LoanDetailsPage />},
            { path: "loanDetails", element: <LoanDetails /> }, 
            { path: "books/:id", element: <BookDetail /> },
            { path: "books/:bookId/edit", element: <EditBookPage /> },
            { path: "books/new", element: <BookCreateForm /> },
            { path: "categories", element: <CategoryPage /> },
            { path: "categories/:categoryId/books", element: <CategoryBooks /> },
        ]
    }
]);
