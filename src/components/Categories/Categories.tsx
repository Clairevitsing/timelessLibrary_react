import React, { useEffect, useState } from 'react';
import { fetchCategories, deleteCategory } from '../../services/CategoryService';
import { fetchBooksByCategory } from '../../services/CategoryService';
import { Category } from '../../models/Category';
import { generateColor } from '../../utils/colorGenerator';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import styles from './Categories.module.css';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [bookCounts, setBookCounts] = useState<{ [key: number]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const isAdmin = user?.roles?.includes('ROLE_ADMIN') ?? false;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);

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
    <div className={styles.container}>
      <div className="text-center">
        <div className={`${styles.loadingSpinner} spinner-border`} role="status">
          <span className="visually-hidden">Loading categories...</span>
        </div>
        <p className="mt-2">Loading categories...</p>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className={styles.container}>
      <div className={`${styles.alert} ${styles.alertDanger} d-flex align-items-center`} role="alert">
        <div>{error}</div>
        <button 
          onClick={() => navigate('/dashboard')} 
          className={`${styles.btn} ${styles.btnDanger} ms-3`}
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
      <div key={category.id} className={styles.card} style={{ borderLeftColor: backgroundColor }}>
        <div className={styles.cardHeader} style={{ backgroundColor }}>
          <h2 className={styles.cardTitle}>{category.name}</h2>
        </div>
        <div className={styles.cardBody}>
          <p className={styles.cardText}>
            {category.description || 'No description available'}
          </p>
          <div className={styles.cardStats}>
            <span className={styles.badge}>
              {bookCount} Book{bookCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <div className={styles.cardFooter}>
          {/* Première ligne - Bouton Books */}
          <div className={styles.bookButton}>
            <Link  
              to={`/categories/${category.id}/books`}  
              className={`${styles.btn} ${styles.btnInfo} ${bookCount === 0 ? styles.disabled : ''}`} 
              aria-label={`View ${bookCount} books in ${category.name} category`} 
            > 
              Books {bookCount > 0 ? `(${bookCount})` : ''} 
            </Link>
          </div>

          {/* Deuxième ligne - Boutons Edit et Delete */}
          {isAdmin && (
            <div className={styles.adminButtons}>
              <Link  
                to={`/categories/${category.id}/edit`}  
                className={`${styles.btn} ${styles.btnWarning}`} 
                aria-label={`Edit ${category.name} category`} 
              >
                Edit
              </Link>
              <button  
                onClick={() => handleDeleteCategory(category.id)} 
                className={`${styles.btn} ${styles.btnDanger}`} 
                aria-label={`Delete ${category.name} category`} 
                disabled={bookCount > 0} 
              > 
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className={`${styles.container} text-center`}>
      <p>No categories found.</p>
      {isAdmin && (
        <Link 
          to="/categories/new" 
          className={`${styles.btn} ${styles.btnPrimary}`}
          aria-label="Add new category"
        >
          Add First Category
        </Link>
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>All Categories</h1>
        </div>
        {isAdmin && (
          <div>
            <Link 
              to="/categories/new" 
              className={`${styles.btn} ${styles.btnAdd}`}
              aria-label="Add new category"
            >
              Add New Category
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
        <div className={styles.cardGrid}>
          {categories.map(renderCategoryCard)}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
