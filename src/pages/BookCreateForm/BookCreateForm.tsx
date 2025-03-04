import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { NewBookData, BookFormData } from '../../models/Book';
import { createNewBook } from '../../services/BookService';
import { fetchCategories } from '../../services/CategoryService';

type Category = { id: number; name: string };

const bookSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  ISBN: Yup.string().required('ISBN is required'),
  publishedYear: Yup.string().required('Published year is required'),
  description: Yup.string().required('Description is required'),
  image: Yup.string().required('Image is required'),
  available: Yup.boolean(),
  categoryName: Yup.string().required('Category is required'),
  authorIds: Yup.array().of(Yup.number().positive()).min(1, 'At least one author is required')
});

const BookCreateForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  
  const { register, handleSubmit, setValue, watch, control, formState: { errors }, reset } = useForm<BookFormData>({
    resolver: yupResolver(bookSchema),
    defaultValues: {
      available: false,
      authorIds: [],
      categoryName: '',
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        if (categoriesData.length > 0) setValue('categoryName', categoriesData[0].name);
      } catch (error: any) {
        setSubmitError(error.message || 'Failed to load categories.');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, [setValue]);

  const onSubmit = async (data: BookFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const selectedCategory = categories.find(cat => cat.name === data.categoryName);
      if (!selectedCategory) throw new Error('Selected category not found');

      const newBookData: NewBookData = {
        ...data,
        publishedYear: data.publishedYear.split('T')[0],
        categoryId: selectedCategory.id
      };

      const newBook = await createNewBook(newBookData);
      setSubmitSuccess(true);
      reset();
      navigate(`/books/${newBook.id}`);
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to create new book.');
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
        {errors.image && <p>{errors.image.message}</p>}
        {watch('image') && <img src={watch('image')} alt="Preview" style={{ maxWidth: '200px' }} />}
      </div>
      <div>
        <label>Availability</label>
        <input type="checkbox" {...register('available')} />
      </div>
      <div>
        <label>Category</label>
        {isLoadingCategories ? (
          <p>Loading categories...</p>
        ) : (
          <select {...register('categoryName')}>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        )}
        {errors.categoryName && <p>{errors.categoryName.message}</p>}
      </div>
      <div>
        <label>Author IDs (comma-separated)</label>
        <Controller
          name="authorIds"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              onChange={e => {
                const parsedIds = e.target.value
                  .split(',')
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
        {isSubmitting ? 'Creating...' : 'Create Book'}
      </button>

      {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
      {submitSuccess && <p style={{ color: 'green' }}>Book created successfully!</p>}
    </form>
  );
};

export default BookCreateForm;

