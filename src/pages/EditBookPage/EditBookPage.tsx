import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Book, NewBookData } from '../../models/Book';
import { fetchBookDetails, updateBook } from '../../services/BookService';
import { fetchCategories } from '../../services/CategoryService';
import { useNavigate, useParams } from 'react-router-dom';
import { Category } from '../../models/Category';
import { Author } from '../../models/Author';
import AuthorEditor from '../../components/AuthorEditor/AuthorEditor';
import { addNewAuthor, fetchAuthors } from '../../services/AuthorService';
import './EditBookPage.css';

// Type pour les données du formulaire
type BookFormData = {
  title: string;
  ISBN: string;
  publishedYear: string;
  description: string;
  image: string;
  available: boolean;
  categoryName: string; 
  authorIds: number[];
};

// Schéma de validation
const bookSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  ISBN: Yup.string().required('ISBN is required'),
  publishedYear: Yup.string().required('Publication year is required'),
  description: Yup.string().required('Description is required'),
  image: Yup.string().required('Image is required'),
  available: Yup.boolean().required('Availability is required'),
  categoryName: Yup.string().required('Category is required'),
  authorIds: Yup.array()
    .of(Yup.number().required('Valid author ID required'))
    .min(1, 'At least one author is required')
    .required('At least one author is required')
});

// Fonction pour supprimer un auteur
export const deleteAuthor = async (authorId: number): Promise<boolean> => {
  try {
    const response = await fetch(`/api/authors/${authorId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete author');
    }

    return true;
  } catch (error) {
    console.error('Error deleting author:', error);
    throw error;
  }
};

const EditBookPage = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [book, setBook] = useState<Book | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState<Author | null>(null);
  const [bookAuthors, setBookAuthors] = useState<Author[]>([]);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<BookFormData>({
    resolver: yupResolver(bookSchema),
    defaultValues: {
      title: '',
      ISBN: '',
      publishedYear: '',
      description: '',
      image: '',
      available: false,
      categoryName: '',
      authorIds: [],
    }
  });

  const navigate = useNavigate();
  const watchAuthorIds = watch('authorIds');

  // Chargement des catégories et auteurs
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const [categoriesData, authorsData] = await Promise.all([
          fetchCategories(),
          fetchAuthors()
        ]);
        
        setCategories(categoriesData);
        setAuthors(authorsData);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setSubmitError('Unable to load categories or authors. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Chargement des détails du livre
  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) return;
      
      try {
        setIsLoading(true);
        const bookData = await fetchBookDetails(parseInt(bookId, 10));
        setBook(bookData);
        
        if (bookData.authors) {
          setBookAuthors(bookData.authors);
        }
        
        const formattedDate = bookData.publishedYear 
          ? bookData.publishedYear.toISOString().split('T')[0]
          : '';

        const authorIds = bookData.authors 
          ? bookData.authors.map(author => author.id) 
          : [];

        setValue('title', bookData.title);
        setValue('ISBN', bookData.ISBN);
        setValue('publishedYear', formattedDate);
        setValue('description', bookData.description);
        setValue('image', bookData.image);
        setValue('available', bookData.available);
        setValue('categoryName', bookData.category?.name || '');
        setValue('authorIds', authorIds);
      } catch (error) {
        console.error('Error loading book details:', error);
        setSubmitError('Unable to load book details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [bookId, setValue]);

  // Gestion de la sauvegarde d'un auteur
  const handleSaveAuthor = async (authorData: Omit<Author, 'id'>): Promise<Author> => {
    try {
      const savedAuthor = await addNewAuthor(authorData);
      
      setAuthors(prevAuthors => [...prevAuthors, savedAuthor]);
      
      const updatedAuthorIds = [...watchAuthorIds];
      if (!updatedAuthorIds.includes(savedAuthor.id)) {
        updatedAuthorIds.push(savedAuthor.id);
        setValue('authorIds', updatedAuthorIds, { shouldValidate: true });
      }
      
      setBookAuthors(prev => [...prev, savedAuthor]);
      
      setShowAuthorForm(false);
      setCurrentAuthor(null);
      
      return savedAuthor;
    } catch (error) {
      console.error('Error saving author:', error);
      throw new Error('Failed to save author');
    }
  };

  // Gestion de l'édition d'un auteur
  const handleEditAuthor = (author: Author) => {
    setCurrentAuthor(author);
    setShowAuthorForm(true);
  };

  // Gestion de la soumission du formulaire
  const onSubmit = async (data: BookFormData) => {
    if (!bookId) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const selectedCategory = categories.find(cat => cat.name === data.categoryName);
      if (!selectedCategory) {
        throw new Error('Invalid category');
      }

      const updatedBookData: Partial<NewBookData> = {
        title: data.title,
        ISBN: data.ISBN,
        publishedYear: new Date(data.publishedYear),
        description: data.description,
        image: data.image,
        available: data.available,
        categoryId: selectedCategory.id, 
        authorIds: data.authorIds,
      };
      
      const updatedBook = await updateBook(parseInt(bookId, 10), updatedBookData);
      console.log('Book updated:', updatedBook);
      setSubmitSuccess(true);
      
      setTimeout(() => {
        navigate(`/books/${updatedBook.id}`);
      }, 1500);
    } catch (error) {
      console.error('Error updating book:', error);
      setSubmitError('Failed to update book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Affichage des auteurs du livre
  const renderBookAuthors = () => {
    if (bookAuthors.length === 0) {
      return (
        <div className="no-authors">No authors associated with this book</div>
      );
    }
    
    return (
      <div className="book-authors">
        <h4 className="authors-title">Book Authors:</h4>
        <div className="authors-list">
          {bookAuthors.map(author => (
            <div key={author.id} className="author-card">
              <div className="author-info">
                <div className="author-name">{author.firstName} {author.lastName}</div>
                {author.biography && (
                  <div className="author-bio">{author.biography.substring(0, 50)}...</div>
                )}
              </div>
              <div className="author-actions">
                <button
                  type="button"
                  onClick={() => handleEditAuthor(author)}
                  className="btn-edit-author"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Création d'un auteur vide
  const createEmptyAuthor = (): Author => {
    return {
      id: 0,
      firstName: '',
      lastName: '',
      biography: ''
    };
  };

  if (isLoading) {
    return <div className="loading-message">Loading book details...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="edit-book-form">
      <h2 className="page-title">Edit Book: {book?.title}</h2>
      
      <div className="form-group">
        <label className="form-label">Title</label>
        <input 
          {...register('title')} 
          placeholder="Title" 
          className="form-input"
        />
        {errors.title && <p className="error-message">{errors.title.message}</p>}
      </div>
      
      <div className="form-group">
        <label className="form-label">ISBN</label>
        <input 
          {...register('ISBN')} 
          placeholder="ISBN" 
          className="form-input"
        />
        {errors.ISBN && <p className="error-message">{errors.ISBN.message}</p>}
      </div>
      
      <div className="form-group">
        <label className="form-label">Publication Year</label>
        <input 
          type="date" 
          {...register('publishedYear')} 
          className="form-input"
        />
        {errors.publishedYear && <p className="error-message">{errors.publishedYear.message}</p>}
      </div>
      
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea 
          {...register('description')} 
          placeholder="Description" 
          className="form-textarea"
        />
        {errors.description && <p className="error-message">{errors.description.message}</p>}
      </div>
      
      <div className="form-group">
        <label className="form-label">Image</label>
        <input
          type="file"
          accept="image/*"
          className="form-input-file"
          onChange={e => {
            const file = e.target.files ? e.target.files[0] : null;
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setValue('image', reader.result as string);
              };
              reader.onerror = () => {
                console.error('Error reading file.');
                setSubmitError('An error occurred while reading the file.');
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        {errors.image && <p className="error-message">{errors.image.message}</p>}
        {watch('image') && (
          <img src={watch('image')} alt="Preview" className="image-preview" />
        )}
      </div>
      
      <div className="form-group checkbox-group">
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            {...register('available')}
            className="form-checkbox"
          />
          <span>Available</span>
        </label>
      </div>
      
      <div className="form-group">
        <label className="form-label">Category</label>
        <select 
          {...register('categoryName')}
          className="form-select"
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryName && <p className="error-message">{errors.categoryName.message}</p>}
      </div>
      
      <div className="authors-section">
        <h3 className="section-title">Authors</h3>
        
        {/* Affichage des auteurs du livre */}
        {renderBookAuthors()}
        
        {/* Formulaire d'ajout/édition d'auteur */}
        {showAuthorForm ? (
          <div className="author-form-container">
            <h4 className="form-subtitle">
              {currentAuthor ? 'Edit Author' : 'Add Author'}
            </h4>
            <AuthorEditor
              initialAuthor={currentAuthor || createEmptyAuthor()}
              onSaveAuthor={handleSaveAuthor}
              onCancel={() => {
                setShowAuthorForm(false);
                setCurrentAuthor(null);
              }}
            />
          </div>
        ) : (
          <div className="add-author-container">
            <button
              type="button"
              className="btn-add-author"
              onClick={() => {
                setCurrentAuthor(null);
                setShowAuthorForm(true);
              }}
            >
              + Add New Author
            </button>
          </div>
        )}
        
        {errors.authorIds && <p className="error-message">{errors.authorIds.message}</p>}
      </div>
      
      <button 
        type="submit" 
        disabled={isSubmitting}
        className={`btn-submit ${isSubmitting ? 'btn-submitting' : ''}`}
      >
        {isSubmitting ? 'Updating...' : 'Update Book'}
      </button>

      {submitError && <p className="error-notification">{submitError}</p>}
      {submitSuccess && <p className="success-notification">Book updated successfully!</p>}
    </form>
  );
};

export default EditBookPage;