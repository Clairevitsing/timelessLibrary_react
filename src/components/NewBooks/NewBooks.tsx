import React, { useState, useEffect, useRef } from 'react';
import { fetchNewBooks } from '../../services/BookService';
import { Book } from '../../models/Book';
import { useNavigate } from 'react-router-dom';

const NewBooks: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    
    // Number of books to display at once
    const booksPerView = 4;
    
    useEffect(() => {
        fetchNewBooks().then(books => {
            setBooks(books);
            setIsLoading(false);
        }).catch(error => {
            setError('Failed to load books');
            setIsLoading(false);
        });
    }, []);
    
    if (isLoading) return <div className="container text-center mt-5"><div className="spinner-border" role="status"></div></div>;
    if (error) return <div className="container alert alert-danger mt-5">{error}</div>;
    
    const handleDetailsClick = (id: number) => {
        navigate(`/book/${id}`);
    };
    
    const nextSlide = () => {
        if (currentIndex + booksPerView < books.length) {
            setCurrentIndex(prevIndex => prevIndex + 1);
        }
    };
    
    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prevIndex => prevIndex - 1);
        }
    };
    
    // Calculate if arrows should be visible
    const canGoBack = currentIndex > 0;
    const canGoForward = currentIndex + booksPerView < books.length;
    
    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>New Books</h2>
            </div>
            
            <div className="position-relative">
                {/* Left navigation arrow */}
                {canGoBack && (
                    <button 
                        className="position-absolute top-50 start-0 translate-middle-y z-1 bg-white rounded-circle border-0 shadow" 
                        style={{ 
                            width: '40px', 
                            height: '40px', 
                            marginLeft: '-20px', 
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onClick={prevSlide}
                    >
                        <span style={{ fontSize: '1.5rem' }}>&lsaquo;</span>
                    </button>
                )}
                
                {/* Carousel container */}
                <div ref={carouselRef} className="overflow-hidden">
                    <div 
                        className="row flex-nowrap" 
                        style={{ 
                            transform: `translateX(-${currentIndex * (100 / booksPerView)}%)`,
                            transition: 'transform 0.5s ease'
                        }}
                    >
                        {books.map(book => (
                            <div key={book.id} className="col-3 px-2">
                                <div className="card h-100 shadow-sm">
                                    <div className="px-3 pt-3">
                                        <div style={{ 
                                            height: "200px", 
                                            display: "flex", 
                                            alignItems: "center", 
                                            justifyContent: "center" 
                                        }}>
                                            <img 
                                                src={book.image} 
                                                className="img-fluid" 
                                                style={{ maxHeight: "100%", objectFit: "contain" }} 
                                                alt={book.title} 
                                            />
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title text-truncate" title={book.title}>{book.title}</h5>
                                        <ul className="list-unstyled">
                                            {book.authors.map(author => (
                                                <li key={author.id} className="text-truncate">
                                                    {author.firstName} {author.lastName}
                                                </li>
                                            ))}
                                        </ul>
                                        <button 
                                            className="btn btn-primary mt-2 w-100" 
                                            onClick={() => handleDetailsClick(book.id)}
                                        >
                                            Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Right navigation arrow */}
                {canGoForward && (
                    <button 
                        className="position-absolute top-50 end-0 translate-middle-y z-1 bg-white rounded-circle border-0 shadow" 
                        style={{ 
                            width: '40px', 
                            height: '40px', 
                            marginRight: '-20px', 
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onClick={nextSlide}
                    >
                        <span style={{ fontSize: '1.5rem' }}>&rsaquo;</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default NewBooks;