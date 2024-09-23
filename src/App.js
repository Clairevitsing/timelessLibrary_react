import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import Home from "./Pages/Home";
import Book from "./Pages/Book";
import BookItem from "./Components/BookItem/BookItem";
import BookCategory from "./Pages/BookCategory";
import LoginSignup from "./Pages/LoginSignup";
import Signup from "./Pages/Signup";
import Contact from "./Pages/Contact";
import "./App.css";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<Book />} />
          <Route path="/books/:bookId" element={<BookItem />} />
          <Route path="category/voluptaten" element={<BookCategory />} />
          <Route path="category/evenist" element={<BookCategory />} />
          <Route path="category/porro" element={<BookCategory />} />
          <Route path="category/vel" element={<BookCategory />} />
          <Route path="category/quo" element={<BookCategory />} />
          <Route path="category/rerum" element={<BookCategory />} />
          <Route path="/loginSignup" element={<LoginSignup />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
