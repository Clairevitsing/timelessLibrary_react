import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { NewBookData, BookFormData } from '../../models/Book';
import { Category } from '../../models/Category';
import { AuthorFormData } from '../../models/Author';
import { createBook } from '../../services/BookService';
import { findOrCreateAuthor } from '../../services/AuthorService';
import { fetchCategories } from '../../services/CategoryService';
import styles from './CreateBookForm.module.css';



// Enhanced validation schema
const bookSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  ISBN: Yup.string().required('ISBN is required'),
  publishedYear: Yup.string().required('Published year is required'),
  description: Yup.string().required('Description is required'),
  image: Yup.string().required('Image is required'),
  available: Yup.boolean(),
  categoryName: Yup.string().required('Category is required'),
 authors: Yup.array()
    .of(
      Yup.object().shape({
        firstName: Yup.string()
          .trim()
          .required('Author first name is required')
          .min(2, 'First name must be at least 2 characters'),
        lastName: Yup.string()
          .trim()
          .required('Author last name is required')
          .min(2, 'Last name must be at least 2 characters'),
        biography: Yup.string()
          .trim()
          .required('Author biography is required')
          .min(10, 'Biography must be at least 10 characters'),
        birthDate: Yup.date()
          .required('Author birth date is required')
          .max(new Date(), 'Birth date cannot be in the future')
      })
    )
    .min(1, 'At least one author is required')
});

const CreateBookForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [currentBookId, setCurrentBookId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm<BookFormData>({
    resolver: yupResolver(bookSchema) as any,
    defaultValues: {
      available: false,
      authors: [{
        firstName: '',
        lastName: '',
        biography: '',
        birthDate: ''
      }],
      authorIds: [],
      categoryName: '',
    },
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
      // Find or create authors and get their IDs
        // Find or create the author, passing the current book's ID
      const authorIds = await Promise.all(
        data.authors.map(async (author) => {
          return await findOrCreateAuthor(
            author.firstName,
            author.lastName,
            author.biography,
            author.birthDate,
            currentBookId ? [currentBookId] : []
          );
        })
      );


      const selectedCategory = categories.find((cat) => cat.name === data.categoryName);
      if (!selectedCategory) throw new Error('Selected category not found');

      const newBookData: NewBookData = {
        ...data,
        publishedYear: data.publishedYear.split('T')[0],
        categoryId: selectedCategory.id,
        authorIds: authorIds, 
      };

      const newBook = await createBook(newBookData);
      setSubmitSuccess(true);
      reset();
      navigate(`/books/${newBook.id}`);
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to create the book.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
      <div className={styles.formGroup}>
        <label>Title</label>
        <input {...register('title')} placeholder="Title" />
        {errors.title && <p className={styles.errorMessage}>{errors.title.message}</p>}
      </div>
      <div className={styles.formGroup}>
        <label>ISBN</label>
        <input {...register('ISBN')} placeholder="ISBN" />
        {errors.ISBN && <p className={styles.errorMessage}>{errors.ISBN.message}</p>}
      </div>
      <div className={styles.formGroup}>
        <label>Published Year</label>
        <input type="date" {...register('publishedYear')} />
        {errors.publishedYear && <p className={styles.errorMessage}>{errors.publishedYear.message}</p>}
      </div>
      <div className={styles.formGroup}>
        <label>Description</label>
        <textarea {...register('description')} placeholder="Description" />
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
      <div className={styles.formGroup}>
  <label>Availability</label>
  <div className={styles.availabilityGroup}>
    <input type="checkbox" {...register('available')} id="availableCheckbox" />
    <label htmlFor="availableCheckbox">Available</label>
  </div>
</div>
      <div className={styles.formGroup}>
        <label>Category</label>
        {isLoadingCategories ? (
          <p>Loading categories...</p>
        ) : (
          <select {...register('categoryName')}>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        )}
        {errors.categoryName && <p className={styles.errorMessage}>{errors.categoryName.message}</p>}
      </div>
      <div className={styles.formGroup}>
        <label>Authors</label>
        <Controller
          name="authors"
          control={control}
          render={({ field }) => (
            <div className={styles.authorsContainer}>
              {field.value.map((author, index) => (
                <div key={index} className={styles.authorSection}>
                  <div className={styles.authorInputGroup}>
                    <div className={styles.nameInputs}>
                      <div className={styles.inputWrapper}>
                        <label>First Name</label>
                        <input
                          placeholder="First Name"
                          value={author.firstName}
                          onChange={(e) => {
                            const newAuthors = [...field.value];
                            newAuthors[index] = { ...newAuthors[index], firstName: e.target.value };
                            field.onChange(newAuthors);
                          }}
                        />
                        {errors.authors?.[index]?.firstName && (
                          <p className={styles.errorMessage}>
                            {errors.authors[index]?.firstName?.message}
                          </p>
                        )}
                      </div>
                      
                      <div className={styles.inputWrapper}>
                        <label>Last Name</label>
                        <input
                          placeholder="Last Name"
                          value={author.lastName}
                          onChange={(e) => {
                            const newAuthors = [...field.value];
                            newAuthors[index] = { ...newAuthors[index], lastName: e.target.value };
                            field.onChange(newAuthors);
                          }}
                        />
                        {errors.authors?.[index]?.lastName && (
                          <p className={styles.errorMessage}>
                            {errors.authors[index]?.lastName?.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className={styles.inputWrapper}>
                      <label>Biography</label>
                      <textarea
                        placeholder="Author Biography"
                        value={author.biography}
                        onChange={(e) => {
                          const newAuthors = [...field.value];
                          newAuthors[index] = { ...newAuthors[index], biography: e.target.value };
                          field.onChange(newAuthors);
                        }}
                      />
                      {errors.authors?.[index]?.biography && (
                        <p className={styles.errorMessage}>
                          {errors.authors[index]?.biography?.message}
                        </p>
                      )}
                    </div>

                    <div className={styles.inputWrapper}>
                      <label>Birth Date</label>
                      <input
                        type="date"
                        value={author.birthDate}
                        onChange={(e) => {
                          const newAuthors = [...field.value];
                          newAuthors[index] = { ...newAuthors[index], birthDate: e.target.value };
                          field.onChange(newAuthors);
                        }}
                      />
                      {errors.authors?.[index]?.birthDate && (
                        <p className={styles.errorMessage}>
                          {errors.authors[index]?.birthDate?.message}
                        </p>
                      )}
                    </div>

                    {index > 0 && (
                      <div className={styles.removeAuthorContainer}>
                        <button
                          type="button"
                          className={styles.removeAuthorButton}
                          onClick={() => {
                            const newAuthors = field.value.filter((_, i) => i !== index);
                            field.onChange(newAuthors);
                          }}
                        >
                          Remove Author
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              <div className={styles.buttonContainer}>
                <button
                  type="button"
                  className={styles.addAuthorButton}
                  onClick={() => field.onChange([
                    ...field.value, 
                    { 
                      firstName: '', 
                      lastName: '', 
                      biography: '', 
                      birthDate: '' 
                    }
                  ])}
                >
                  Add Another Author
                </button>
              </div>
            </div>
          )}
        />
        {errors.authors && <p className={styles.errorMessage}>{errors.authors.message}</p>}
      </div>
      <div className={styles.buttonContainer}>
    <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
        {isSubmitting ? 'Creating...' : 'Confirm Add New Book'}
    </button>
</div>

      {submitError && <p className={styles.errorMessage}>{submitError}</p>}
      {submitSuccess && <p className={styles.successMessage}>Book successfully created!</p>}
    </form>
  );
};

export default CreateBookForm;