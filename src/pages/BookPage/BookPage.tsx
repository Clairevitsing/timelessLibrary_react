import React, { useState, useEffect } from 'react';
import { Form, FormControl, Button } from 'react-bootstrap';
import { fetchBooks } from '../../services/BookService';
import { Book } from '../../models/Book';
import { useNavigate } from 'react-router-dom'; 
import './BookPage.css';
import Pagination from 'react-bootstrap/Pagination';
import { Link } from 'react-router-dom';

const BookPage = () => {
    // States to store books, current page, loading status, and errors
    const [allBooks, setAllBooks] = useState<Book[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    // Number of books per page
    const booksPerPage = 12;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetching books on component mount
    useEffect(() => {
        fetchBooks().then(books => {
            setAllBooks(books);
            setIsLoading(false);
        }).catch(error => {
            console.error('Error loading books:', error);
            setError(`Failed to load books: ${error.message || JSON.stringify(error)}`);
            setIsLoading(false);
        });
    }, []);

    // Calculations for pagination
    const lastIndex = currentPage * booksPerPage;
    const firstIndex = lastIndex - booksPerPage;
    const currentBooks = allBooks.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(allBooks.length / booksPerPage);
    const numbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    

    // Handlers for navigating to book details
    const handleDetailsClick = (id: number) => {
         // Navigate to the book detail page
         navigate(`/book/${id}`); 
    };

    // Pagination navigation handlers
    const prePage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const changePage = (id: number) => {
        setCurrentPage(id);
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Handling loading and error states
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Displaying when no books are found
    if (!allBooks.length) {
        return <p>No books found!</p>;
    }

    // HTML and Bootstrap structure for displaying books and pagination
    return (
        <>
        <div className="search-container">
            <Form className="search-form d-flex">
                <FormControl type="search" placeholder="Search" className="me-2" aria-label="Search" />
                <Button variant="outline-success" type="submit">Search</Button>
            </Form>
        </div>
        <div className="addBook">
            <Link to="/book/new" className="btn btn-primary">
            Add New Book
            </Link>        
        </div> 
        <div className="container mt-4">
            <h2>All the Books</h2>
            <div className="row">
            {currentBooks.map(book => (
                <div key={book.id} className="col-sm-6 col-md-4 col-lg-3 mb-3">
                    <div className="card">
                        <div className="px-5 pt-3">
                    <img src={book.image || 'default-book-image.jpg'} className="card-img-top" alt={book.title} />
                            </div>
                    <div className="card-body">
                    <h5 className="card-title">{book.title}</h5>
                    <ul>
                        {book.authors.map(author => (
                        <li key={author.id}>{author.firstName} {author.lastName}</li>
                        ))}
                    </ul>
                    <button className="btn btn-primary" onClick={() => handleDetailsClick(book.id)}>Details</button>
                    </div>
                </div>
                </div>
            ))}
                    </div>
                    <Pagination className="justify-content-center">
                        <Pagination.Item onClick={prePage} disabled={currentPage === 1}>Prev</Pagination.Item>
                        {numbers.map(n => (
                            <Pagination.Item key={n} active={n === currentPage} onClick={() => changePage(n)}>
                                {n}
                            </Pagination.Item>
                        ))}
                        <Pagination.Item onClick={nextPage} disabled={currentPage === totalPages}>Next</Pagination.Item>
                    </Pagination>
                </div>
                
        </>
  );
};

export default BookPage;