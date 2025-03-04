import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchBooksByCategory, deleteBook } from '../../services/BookService';
import { fetchCategoryById } from '../../services/CategoryService';
import { Book } from '../../models/Book';
import { Category } from '../../models/Category';
import { useAuth } from '../../context/useAuth';
import styles from './CategoryBooks.module.css';

const CategoryBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { categoryId } = useParams<{ categoryId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.roles?.includes('ROLE_ADMIN') ?? false;

  useEffect(() => {
    const loadCategoryAndBooks = async () => {
      if (!categoryId) {
        setError('No category ID provided');
        setIsLoading(false);
        return;
      }

      try {
        const categoryData = await fetchCategoryById(parseInt(categoryId, 10));
        setCategory(categoryData);

        const booksData = await fetchBooksByCategory(parseInt(categoryId, 10));
        setBooks(booksData);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? `Failed to load category or books: ${err.message}` 
          : 'Failed to load category or books';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoryAndBooks();
  }, [categoryId]);

  const handleDeleteBook = async (bookId: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(bookId);
        setBooks(books.filter(book => book.id !== bookId)); 
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? `Failed to delete book: ${err.message}` 
          : 'Failed to delete book';
        setError(errorMessage);
      }
    }
  };

  const renderLoadingState = () => (
    <div className={styles.container}>
      <div className="text-center">
        <div className={`spinner-border ${styles.loadingSpinner}`} role="status">
          <span className="visually-hidden">Loading books...</span>
        </div>
        <p className="mt-2">Loading books in category...</p>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className={styles.container}>
      <div className={`alert alert-danger d-flex align-items-center`} role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        <div>{error}</div>
        <button 
          onClick={() => navigate('/categories')} 
          className="btn btn-sm btn-outline-danger ms-3"
        >
          Back to Categories
        </button>
      </div>
    </div>
  );

  const renderBookCard = (book: Book) => {
    return (
      <div key={book.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
        <div className={`card h-100 ${styles.bookCard}`}>
          <div className="px-3 pt-3">
            <div className="book-image-container text-center">
              <img 
                src={book.image || '/placeholder-book.jpg'} 
                className={`img-fluid ${styles.bookImage}`} 
                alt={book.title} 
                onError={(e) => {
                  const imgElement = e.target as HTMLImageElement;
                  imgElement.src = '/placeholder-book.jpg';
                }}
              />
            </div>
          </div>     
          <div className="card-body">
            <h2 className={`card-title mb-0 ${styles.bookTitle}`}>{book.title}</h2>
            <div className="mb-3">
              <strong>Authors:</strong>
              {book.authors && book.authors.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {book.authors.map((author) => (
                    <li key={author.id} className="list-group-item px-0">
                      {author.firstName} {author.lastName}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No authors listed</p>
              )}
            </div>
            <p className="card-text">
              <strong>ISBN:</strong> {book.ISBN || 'N/A'}
            </p>
          </div>
          <div className="card-footer d-flex justify-content-between">
            <Link 
              to={`/books/${book.id}`} 
              className="btn btn-sm btn-info"
              aria-label="View book details"
            >
              <i className="bi bi-eye me-2"></i>View
            </Link>
            {isAdmin && (
              <>
                <Link 
                  to={`/books/${book.id}/edit`} 
                  className="btn btn-sm btn-warning"
                  aria-label="Edit book"
                >
                  <i className="bi bi-pencil me-2"></i>Edit
                </Link>
                <button 
                  onClick={() => handleDeleteBook(book.id)} 
                  className="btn btn-sm btn-danger"
                  aria-label="Delete book"
                >
                  <i className="bi bi-trash me-2"></i>Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className={styles.emptyState}>
      <p>No books found in this category.</p>
      {isAdmin && (
        <Link 
          to={`/books/new?categoryId=${categoryId}`} 
          className="btn btn-outline-primary"
          aria-label="Add first book to category"
        >
          <i className="bi bi-plus-circle me-2"></i>Add First Book
        </Link>
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="flex-grow-1 d-flex justify-content-center">
          <h1 className={`text-center ${styles.categoryTitle}`}>
            Books in Category {category ? category.name : 'Loading...'}
          </h1>
        </div>
        {isAdmin && (
          <div>
            <Link 
              to={`/books/new?categoryId=${categoryId}`} 
              className="btn btn-primary"
              aria-label="Add new book to category"
            >
              <i className="bi bi-plus-circle me-2"></i>Add New Book
            </Link>
          </div>
        )}
      </div>

      {isLoading ? (
        renderLoadingState()
      ) : error ? (
        renderErrorState()
      ) : books.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="row g-4">
          {books.map(renderBookCard)}
        </div>
      )}
    </div>
  );
};

export default CategoryBooks;