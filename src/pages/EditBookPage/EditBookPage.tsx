import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { Book, NewBookData, BookFormData, formatDateForApi } from '../../models/Book';
import { Category } from '../../models/Category';
import { Author } from '../../models/Author';
import { fetchBookDetails, updateBook } from '../../services/BookService';
import { fetchCategories } from '../../services/CategoryService';
import { 
  fetchAuthors, 
  updateAuthor, 
  findOrCreateAuthor, 
  fetchAuthorById,
  deleteAuthor as deleteAuthorService 
} from '../../services/AuthorService';
import AuthorEditor from '../../components/AuthorEditor/AuthorEditor';
import styles from './EditBookPage.module.css';

// Validation schema
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

// Custom type to resolve typing issues
interface EditBookFormData extends Omit<BookFormData, 'authors'> {
  authorIds: number[];
}

const EditBookPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [book, setBook] = useState<Book | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [bookAuthors, setBookAuthors] = useState<Author[]>([]);

  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState<Author | null>(null);

  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    formState: { errors } 
  } = useForm<EditBookFormData>({
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

   // Edit author handler
  const handleEditAuthor = (author: Author) => {
    setCurrentAuthor(author);
    setShowAuthorForm(true);
  };

  const handleDeleteAuthor = async (authorId: number): Promise<void> => {
    if (bookAuthors.length <= 1) {
      setSubmitError('Cannot remove the last author');
      return;
    }

    try {
      await deleteAuthorService(authorId);
      setBookAuthors(prev => prev.filter(author => author.id !== authorId));
      const currentAuthorIds = watch('authorIds');
      setValue('authorIds', currentAuthorIds.filter(id => id !== authorId));
    } catch (error) {
      setSubmitError('Failed to delete author');
    }
  };

  const handleSaveAuthor = async (authorData: Omit<Author, 'id'>): Promise<Author> => {
    try {
      if (currentAuthor?.id) {
        const updatedAuthor = await updateAuthor(currentAuthor.id, authorData);
        setAuthors(prev => prev.map(author => author.id === currentAuthor.id ? updatedAuthor : author));
        setBookAuthors(prev => prev.map(author => author.id === currentAuthor.id ? updatedAuthor : author));
        return updatedAuthor;
      }

      const authorId = await findOrCreateAuthor(authorData.firstName, authorData.lastName, authorData.biography || '', authorData.birthDate?.toISOString().split('T')[0] || '', bookId ? [parseInt(bookId, 10)] : []);
      const savedAuthor = await fetchAuthorById(authorId);

      setAuthors(prev => [...prev, savedAuthor].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i));
      setBookAuthors(prev => [...prev, savedAuthor].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i));

      const currentAuthorIds = watch('authorIds');
      if (!currentAuthorIds.includes(savedAuthor.id)) {
        setValue('authorIds', [...currentAuthorIds, savedAuthor.id]);
      }
      return savedAuthor;
    } catch (error) {
      setSubmitError('Failed to save author');
      throw new Error('Failed to save author');
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const [categoriesData, authorsData] = await Promise.all([fetchCategories(), fetchAuthors()]);
        setCategories(categoriesData);
        setAuthors(authorsData);
      } catch (error) {
        setSubmitError('Unable to load categories or authors. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

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

        const formattedDate = bookData.publishedYear ? bookData.publishedYear.toISOString().split('T')[0] : '';
        const authorIds = bookData.authors ? bookData.authors.map(author => author.id) : [];

        setValue('title', bookData.title);
        setValue('ISBN', bookData.ISBN);
        setValue('publishedYear', formattedDate);
        setValue('description', bookData.description);
        setValue('image', bookData.image);
        setValue('available', bookData.available);
        setValue('categoryName', bookData.category?.name || '');
        setValue('authorIds', authorIds);
      } catch (error) {
        setSubmitError('Unable to load book details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [bookId, setValue]);

  const onSubmit = async (data: EditBookFormData) => {
    if (!bookId) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const selectedCategory = categories.find(cat => cat.name === data.categoryName);
      if (!selectedCategory) {
        throw new Error('Invalid category');
      }

      const finalAuthorIds = await Promise.all(
        data.authorIds.map(async (authorId) => {
          try {
            await fetchAuthorById(authorId);
            return authorId;
          } catch {
            const existingAuthor = bookAuthors.find(a => a.id === authorId);
            if (existingAuthor) {
              return await findOrCreateAuthor(existingAuthor.firstName, existingAuthor.lastName, existingAuthor.biography || '', existingAuthor.birthDate?.toISOString().split('T')[0] || '');
            }
            throw new Error(`Invalid author ID: ${authorId}`);
          }
        })
      );

      const updatedBookData: Partial<NewBookData> = {
        title: data.title,
        ISBN: data.ISBN,
        publishedYear: formatDateForApi(data.publishedYear) || '',
        description: data.description,
        image: data.image,
        available: data.available,
        categoryId: selectedCategory.id,
        authorIds: finalAuthorIds,
      };

      const updatedBook = await updateBook(parseInt(bookId, 10), updatedBookData);
      setSubmitSuccess(true);

      setTimeout(() => {
        navigate(`/books/${updatedBook.id}`);
      }, 1500);
    } catch (error) {
      setSubmitError('Failed to update book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderBookAuthors = () => {
    if (bookAuthors.length === 0) {
      return <div className={styles.noAuthors}>No authors associated with this book</div>;
    }
   
      return (
    <div className={styles.bookAuthors}>
      <h4 className={styles.authorsTitle}>Book Authors:</h4>
      <div className={styles.authorsList}>
        {bookAuthors.map(author => (
          <div key={author.id} className={styles.authorCard}>
            <div className={styles.authorInfo}>
              <div className={styles.authorName}>{author.firstName} {author.lastName}</div>
              {author.biography && (
                <div className={styles.authorBio}>{author.biography.substring(0, 50)}...</div>
              )}
            </div>
            <div className={styles.authorActions}>
              <button
                type="button"
                onClick={() => handleEditAuthor(author)}
                className={styles.btnEditAuthor}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDeleteAuthor(author.id)}
                className={styles.btnDeleteAuthor}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    );
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.editBookForm}>
      <h2 className={styles.pageTitle}>Edit Book: {book?.title}</h2>
      {/* Form Fields */}
      <div className={`form-group ${styles.formGroup}`}>
        <label className={styles.formLabel}>Title</label>
        <input {...register('title')} placeholder="Title" className={`form-control ${styles.formInput}`} />
        {errors.title && <p className={styles.errorMessage}>{errors.title.message}</p>}
      </div>
      <div className={`form-group ${styles.formGroup}`}>
        <label className={styles.formLabel}>ISBN</label>
        <input {...register('ISBN')} placeholder="ISBN" className={`form-control ${styles.formInput}`} />
        {errors.ISBN && <p className={styles.errorMessage}>{errors.ISBN.message}</p>}
      </div>
      <div className={`form-group ${styles.formGroup}`}>
        <label className={styles.formLabel}>Publication Year</label>
        <input type="date" {...register('publishedYear')} className={`form-control ${styles.formInput}`} />
        {errors.publishedYear && <p className={styles.errorMessage}>{errors.publishedYear.message}</p>}
      </div>
      <div className={`form-group ${styles.formGroup}`}>
        <label className={styles.formLabel}>Description</label>
        <textarea {...register('description')} placeholder="Description" className={`form-control ${styles.formTextarea}`} />
        {errors.description && <p className={styles.errorMessage}>{errors.description.message}</p>}
      </div>
      <div className={styles.formGroup}>
        <label>Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                if (reader.result) setValue('image', reader.result.toString());
              };
              reader.onerror = () => setSubmitError('An error occurred while reading the file.');
              reader.readAsDataURL(file);
            }
          }}
        />
        {errors.image && <p className={styles.errorMessage}>{errors.image.message}</p>}
        {watch('image') && <img src={watch('image')} alt="Preview" className={styles.previewImage} />}
      </div>
            <div className={`form-group ${styles.formGroup}`}>
        <label className={styles.formLabel}>Availability</label>
        <div className="form-check">
          <input
            type="checkbox"
            {...register('available')}
            className={`form-check-input ${styles.formCheckbox}`}
            id="availableCheckbox"
          />
          <label htmlFor="availableCheckbox">Available</label>
        </div>
        {errors.available && <p className={styles.errorMessage}>{errors.available.message}</p>}
      </div>

      <div className={`form-group ${styles.formGroup}`}>
        <label className={styles.formLabel}>Category</label>
        <select {...register('categoryName')} className={`form-control ${styles.formSelect}`}>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryName && <p className={styles.errorMessage}>{errors.categoryName.message}</p>}
      </div>

      <div className={`form-group ${styles.formGroup}`}>
        <label className={styles.formLabel}>Authors</label>
        {renderBookAuthors()}
        <button
          type="button"
          onClick={() => setShowAuthorForm(true)}
          className={`btn btn-primary ${styles.btnAddAuthor}`}
        >
          Add Author
        </button>
      </div>

      {showAuthorForm && (
        <AuthorEditor
            initialAuthor={currentAuthor} 
            onSaveAuthor={handleSaveAuthor} 
            onCancel={() => setShowAuthorForm(false)} 
          />
      )}

      <div className={styles.formActions}>
        <button type="submit" disabled={isSubmitting} className={`btn btn-primary ${styles.btnSubmit}`}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
        {submitError && <div className={styles.errorMessage}>{submitError}</div>}
        {submitSuccess && <div className={styles.successMessage}>Book updated successfully!</div>}
      </div>
    </form>
  );
};

export default EditBookPage;