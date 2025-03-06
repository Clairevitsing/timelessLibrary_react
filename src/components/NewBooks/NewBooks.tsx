import React, { useState, useEffect, useRef, useMemo } from 'react';
import { fetchNewBooks } from '../../services/BookService';
import { Book } from '../../models/Book';
import { useNavigate } from 'react-router-dom';
import styles from './NewBooks.module.css';

// Number of books visible at once
const booksPerView = 4;

const NewBooks: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadBooks = async () => {
            try {
                const fetchedBooks = await fetchNewBooks();
                setBooks(fetchedBooks);
            } catch {
                setError('Failed to load books');
            } finally {
                setIsLoading(false);
            }
        };
        loadBooks();
    }, []);

    // Only display the books within the current index range
    const visibleBooks = useMemo(() => books.slice(currentIndex, currentIndex + booksPerView), [books, currentIndex]);

    // Navigate to book details page
    const handleDetailsClick = (id: number) => navigate(`/books/${id}`);

    // Move to the next slide if possible
    const nextSlide = () => setCurrentIndex((prev) => Math.min(prev + 1, books.length - booksPerView));

    // Move to the previous slide if possible
    const prevSlide = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

    if (isLoading) return <div className="container text-center mt-5"><div className="spinner-border" role="status"></div></div>;
    if (error) return <div className="container alert alert-danger mt-5">{error}</div>;

    return (
        <div className={`container ${styles.newBooksContainer}`}>
            <div className={styles.headerContainer}>
                <h2>New Books</h2>
            </div>

            <div className="position-relative">
                {/* Left navigation arrow */}
                {currentIndex > 0 && (
                    <button className={`${styles.navigationButton} ${styles.prevButton}`} onClick={prevSlide} aria-label="Previous books">
                        <span className={styles.arrowIcon}>&lsaquo;</span>
                    </button>
                )}

                {/* Carousel container */}
                <div className={styles.carouselContainer}>
                    <div className={styles.booksRow}>
                        {visibleBooks.map((book) => (
                            <div key={book.id} className={styles.bookColumn}>
                                <div className={`card ${styles.bookCard}`}>
                                    {/* Book image */}
                                    <div className={styles.imageContainer}>
                                        <img 
                                            src={book.image || '/placeholder-book.jpg'} 
                                            className={styles.bookImage} 
                                            alt={book.title}
                                            onError={(e) => (e.currentTarget.src = '/placeholder-book.jpg')}
                                        />
                                    </div>
                                    {/* Book details */}
                                    <div className={styles.bookContent}>
                                        <h5 className={styles.bookTitle} title={book.title}>
                                            {book.title}
                                        </h5>
                                        <div className="card-header">Authors</div>
                                        <ul className={`list-unstyled ${styles.authorsList}`}>
                                            {book.authors.map((author) => (
                                                <li key={author.id} className={styles.authorName}>
                                                    {author.firstName} {author.lastName}
                                                </li>
                                            ))}
                                        </ul>
                                        <button className={`btn btn-primary ${styles.detailsButton}`} onClick={() => handleDetailsClick(book.id)}>
                                            Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right navigation arrow */}
                {currentIndex + booksPerView < books.length && (
                    <button className={`${styles.navigationButton} ${styles.nextButton}`} onClick={nextSlide} aria-label="Next books">
                        <span className={styles.arrowIcon}>&rsaquo;</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default NewBooks;
