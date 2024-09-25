import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import Home from "./Pages/Home";
import Book from "./Pages/Book";
import BookItem from "./Components/BookItem/BookItem";
import BookCategory from "./Pages/BookCategory";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Contact from "./Pages/Contact";
import "./App.css";
import "./Context/useAuth"

function App() {
  return (
    <div>
      <UserProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <ToastContainer />
          <Route path="/book" element={<Book />} />
          <Route path="/books/:bookId" element={<BookItem />} />
          <Route path="category/voluptaten" element={<BookCategory />} />
          <Route path="category/evenist" element={<BookCategory />} />
          <Route path="category/porro" element={<BookCategory />} />
          <Route path="category/vel" element={<BookCategory />} />
          <Route path="category/quo" element={<BookCategory />} />
          <Route path="category/rerum" element={<BookCategory />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </UserProvider>
    </div>
  );
}

export default App;
