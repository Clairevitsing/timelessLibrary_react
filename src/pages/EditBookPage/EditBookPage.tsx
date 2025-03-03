import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Book, NewBookData, formatDateForApi } from '../../models/Book';
import { fetchBookDetails, updateBook } from '../../services/BookService';
import { useNavigate, useParams } from 'react-router-dom';

// Define specific type for the form that matches the Yup schema
type BookFormData = {
  title: string;
  ISBN: string;
  publishedYear: string;
  description: string;
  image: string;
  available: boolean;
  categoryId: number;
  authorIds: number[];
};

const bookSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  ISBN: Yup.string().required('ISBN is required'),
  publishedYear: Yup.string().required('Published year is required'),
  description: Yup.string().required('Description is required'),
  image: Yup.string().required('Image is required'),
  available: Yup.boolean().required('Availability is required'),
  categoryId: Yup.number()
    .required('Category ID is required')
    .integer('Category ID must be an integer')
    .min(1, 'Category ID must be at least 1'),
  authorIds: Yup.array()
    .of(Yup.number().required('Valid author ID is required'))
    .required('At least one author is required')
});

const EditBookPage = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [book, setBook] = useState<Book | null>(null);
  
  const { register, handleSubmit, setValue, watch, control, formState: { errors }, reset } = useForm<BookFormData>({
    resolver: yupResolver(bookSchema),
    defaultValues: {
      title: '',
      ISBN: '',
      publishedYear: '',
      description: '',
      image: '',
      available: false,
      categoryId: 0,
      authorIds: [],
    }
  });

  const navigate = useNavigate();

  // Fetch book details on component mount
  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) return;
      
      try {
        setIsLoading(true);
        const bookData = await fetchBookDetails(parseInt(bookId, 10));
        setBook(bookData);
        
        // Format the date to YYYY-MM-DD for the date input
        const formattedDate = bookData.publishedYear 
          ? bookData.publishedYear.toISOString().split('T')[0]
          : '';

        // Extract author IDs from the book's authors array
        const authorIds = bookData.authors 
          ? bookData.authors.map(author => author.id) 
          : [];

        // Set form values
        setValue('title', bookData.title);
        setValue('ISBN', bookData.ISBN);
        setValue('publishedYear', formattedDate);
        setValue('description', bookData.description);
        setValue('image', bookData.image);
        setValue('available', bookData.available);
        setValue('categoryId', bookData.category?.id || 0);
        setValue('authorIds', authorIds);
      } catch (error) {
        console.error('Error fetching book details:', error);
        setSubmitError('Failed to load book details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [bookId, setValue]);

  // Ensure to set up form fields properly
  useEffect(() => {
    register('authorIds');
  }, [register]);
  
  const onSubmit = async (data: BookFormData) => {
    if (!bookId) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Convert form data to NewBookData format
      const updatedBookData: Partial<NewBookData> = {
        ...data,
        publishedYear: new Date(data.publishedYear),
      };
      
      const updatedBook = await updateBook(parseInt(bookId, 10), updatedBookData);
      console.log('Book updated:', updatedBook);
      setSubmitSuccess(true);
      
      // Navigate back to book details after successful update
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

  if (isLoading) {
    return <div>Loading book details...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Edit Book: {book?.title}</h2>
      
      <div>
        <label>Title</label>
        <input {...register('title')} placeholder="Title" />
        {errors.title && <p>{errors.title.message}</p>}
      </div>
      
      <div>
        <label>ISBN</label>
        <input {...register('ISBN')} placeholder="ISBN" />
        {errors.ISBN && <p>{errors.ISBN.message}</p>}
      </div>
      
      <div>
        <label>Published Year</label>
        <input type="date" {...register('publishedYear')} />
        {errors.publishedYear && <p>{errors.publishedYear.message}</p>}
      </div>
      
      <div>
        <label>Description</label>
        <textarea {...register('description')} placeholder="Description" />
        {errors.description && <p>{errors.description.message}</p>}
      </div>
      
      <div>
        <label>Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => {
            const file = e.target.files ? e.target.files[0] : null;
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setValue('image', reader.result as string);
              };
              reader.onerror = () => {
                console.error('Error occurred while reading the file.');
                setSubmitError('An error occurred while reading the file.');
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        {errors.image && <p>{errors.image.message}</p>}
        {watch('image') && (
          <img src={watch('image')} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
        )}
      </div>
      
      <div>
        <label>Availability</label>
        <input type="checkbox" {...register('available')} />
      </div>
      
      <div>
        <label>Category ID</label>
        <input type="number" {...register('categoryId')} placeholder="Category ID" />
        {errors.categoryId && <p>{errors.categoryId.message}</p>}
      </div>
      
      <div>
        <label>Author IDs (comma-separated)</label>
        <Controller
          name="authorIds"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              onChange={(e) => {
                const value = e.target.value;
                const parsedIds = value.split(',')
                  .map(id => parseInt(id.trim(), 10))
                  .filter(id => !isNaN(id));
                field.onChange(parsedIds);
              }}
              value={Array.isArray(field.value) ? field.value.join(', ') : ''}
              placeholder="Author IDs"
            />
          )}
        />
        {errors.authorIds && <p>{errors.authorIds.message}</p>}
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Updating...' : 'Update Book'}
      </button>

      {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
      {submitSuccess && <p style={{ color: 'green' }}>Book updated successfully!</p>}
    </form>
  );
};

export default EditBookPage;