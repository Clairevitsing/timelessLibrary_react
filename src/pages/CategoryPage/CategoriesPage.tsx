import React, { useEffect, useState } from 'react';
import { fetchCategories, deleteCategory } from '../../services/CategoryService';
import { fetchBooksByCategory } from '../../services/BookService';
import { Category } from '../../models/Category';
import { generateColor } from '../../utils/colorGenerator';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [bookCounts, setBookCounts] = useState<{ [key: number]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if user is an admin
  const isAdmin = user?.roles?.includes('ROLE_ADMIN') ?? false;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);

        // Fetch book counts for each category
        const bookCountPromises = categoriesData.map(async (category) => {
          try {
            const books = await fetchBooksByCategory(category.id);
            return { categoryId: category.id, count: books.length };
          } catch {
            return { categoryId: category.id, count: 0 };
          }
        });

        const bookCountResults = await Promise.all(bookCountPromises);
        const countsMap = bookCountResults.reduce((acc, result) => {
          acc[result.categoryId] = result.count;
          return acc;
        }, {} as { [key: number]: number });

        setBookCounts(countsMap);
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? `Failed to load categories: ${err.message}` 
          : 'Failed to load categories';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleDeleteCategory = async (categoryId: number) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await deleteCategory(categoryId);
      setCategories(categories.filter(category => category.id !== categoryId));
      // Remove the book count for the deleted category
      setBookCounts(prev => {
        const newCounts = { ...prev };
        delete newCounts[categoryId];
        return newCounts;
      });
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? `Failed to delete category: ${err.message}` 
        : 'Failed to delete category';
      setError(errorMessage);
    }
  };

  const renderLoadingState = () => (
    <div className="container py-5">
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading categories...</span>
        </div>
        <p className="mt-2">Loading categories...</p>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="container py-5">
      <div className="alert alert-danger d-flex align-items-center" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        <div>{error}</div>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="btn btn-sm btn-outline-danger ms-3"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );

  const renderCategoryCard = (category: Category) => {
    const backgroundColor = generateColor(category.name);
    const bookCount = bookCounts[category.id] || 0;

    return (
      <div key={category.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
        <div 
          className="card h-100 shadow-sm hover-shadow-lg transition-all"
          style={{ borderLeft: `5px solid ${backgroundColor}` }}
        >
          <div 
            className="card-header text-white text-center py-3"
            style={{ backgroundColor }}
          >
            <h2 className="card-title mb-0">{category.name}</h2>
          </div>
          <div className="card-body">
            <p className="card-text text-muted">
              {category.description || 'No description available'}
            </p>
            <div className="d-flex justify-content-between align-items-center">
              <span className="badge bg-secondary">
                {bookCount} Book{bookCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <div className="card-footer d-flex justify-content-between">
            <Link 
              to={`/categories/${category.id}/books`} 
              className={`btn btn-sm btn-info ${bookCount === 0 ? 'disabled' : ''}`}
              aria-label={`View ${bookCount} books in ${category.name} category`}
            >
              <i className="bi bi-book me-2"></i>
              Books {bookCount > 0 ? `(${bookCount})` : ''}
            </Link>
            {isAdmin && (
              <>
                <Link 
                  to={`/categories/${category.id}/edit`} 
                  className="btn btn-sm btn-warning"
                  aria-label={`Edit ${category.name} category`}
                >
                  <i className="bi bi-pencil me-2"></i>Edit
                </Link>
                <button 
                  onClick={() => handleDeleteCategory(category.id)}
                  className="btn btn-sm btn-danger"
                  aria-label={`Delete ${category.name} category`}
                  disabled={bookCount > 0}
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
    <div className="container py-5 text-center">
      <p>No categories found.</p>
      {isAdmin && (
        <Link 
          to="/categories/new" 
          className="btn btn-outline-primary"
          aria-label="Add new category"
        >
          <i className="bi bi-plus-circle me-2"></i>Add First Category
        </Link>
      )}
    </div>
  );

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="flex-grow-1 d-flex justify-content-center">
          <h1 className="text-center">All Categories</h1>
        </div>
        {isAdmin && (
          <div>
            <Link 
              to="/categories/new" 
              className="btn btn-primary"
              aria-label="Add new category"
            >
              <i className="bi bi-plus-circle me-2"></i>Add New Category
            </Link>
          </div>
        )}
      </div>

      {isLoading ? (
        renderLoadingState()
      ) : error ? (
        renderErrorState()
      ) : categories.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="row g-4">
          {categories.map(renderCategoryCard)}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;