import React, { useEffect, useState} from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { NewBookData } from '../../models/Book';
import { createNewBook } from '../../services/BookService';
import { useNavigate } from 'react-router-dom';

const bookSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  ISBN: Yup.string().required('ISBN is required'),
  publishedYear: Yup.string().required('Published year is required'),
  description: Yup.string().required('Description is required'),
  image: Yup.string().required('Image is required'), 
  // image: Yup.string().url('Must be a valid URL').required('Image URL is required'),
  available: Yup.boolean().required('Availability is required'),
  categoryId: Yup.number()
    .required('Category ID is required')
    .integer('Category ID must be an integer')
    .min(1, 'Category ID must be at least 1'),
    authorIds: Yup.array()
        .of(Yup.number().required('Valid author ID is required'))
        .required('At least one author is required')
});



const BookCreateForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { register, handleSubmit,  setValue, watch, control, formState: { errors },reset } = useForm<NewBookData>({
    resolver: yupResolver(bookSchema),
      defaultValues: {
        // Ensure booleans are initialized
        available: false, 
            // Ensure arrays are initialized
        authorIds: [], 
    }
  });

    // Ensure to set up form fields properly, especially for handling arrays or multiple values
    useEffect(() => {
      // This is necessary if authorIds is handled specially, like checkboxes
    register('authorIds');  
  }, [register]);

  const navigate = useNavigate();
    
    const onSubmit = async (data: NewBookData) => {
    
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

      try {
      const formattedData = {
      ...data,
      publishedYear: new Date(data.publishedYear).toISOString().split('T')[0],
    };
      const newBook = await createNewBook(formattedData);
      console.log('New book created:', newBook);
      setSubmitSuccess(true);
      reset(); // Reset the form after successful submission
      navigate(`/book/${newBook.id}`); // Navigate to the new book's detail page
    } catch (error) {
      console.error('Error creating book:', error);
      setSubmitError('Failed to create new book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
    


  return (
     <form onSubmit={handleSubmit(onSubmit)}>
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
  <img src={watch('image')} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
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
        {/* <input {...register('authorIds')} placeholder="Author IDs" /> */}
        {errors.authorIds && <p>{errors.authorIds.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Book'}
      </button>

      {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
      {submitSuccess && <p style={{ color: 'green' }}>Book created successfully!</p>}
    </form>
  );
};

export default BookCreateForm;