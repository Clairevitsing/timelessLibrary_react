
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  fetchCategoryById, 
  updateCategory 
} from '../../services/CategoryService';
import styles from './EditCategoryForm.module.css';

// Assurez-vous que votre type Category est défini comme ceci
export type Category = {
  id: number;
  name: string;
  description?: string;
};

// Modifiez le schéma Yup pour inclure tous les champs
const categorySchema = Yup.object().shape({
  id: Yup.number().required('Category ID is required'),
  name: Yup.string()
    .required('Category name is required')
    .min(2, 'Category name must be at least 2 characters')
    .max(50, 'Category name must be at most 50 characters'),
  description: Yup.string()
    .optional()
    .max(200, 'Description must be at most 200 characters')
});

const EditCategoryForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Category>({
    resolver: yupResolver(categorySchema),
      defaultValues: {
    // Ajoutez une valeur par défaut pour id
      id: 0, 
      name: '',
      description: '',
    },
  });

  // Fetch category data when component mounts
  useEffect(() => {
    const loadCategory = async () => {
      try {
        setIsLoading(true);
        if (!id) {
          throw new Error('Category ID is required');
        }
        const category = await fetchCategoryById(parseInt(id));
        
        // Safely set form values
        setValue('id', category.id);
        setValue('name', category.name);
        
          // Utilisez l'opérateur nullish coalescing
        setValue('description', category.description ?? ''); 
      } catch (error: any) {
        setSubmitError(error.message || 'Failed to load category.');
        navigate('/categories');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategory();
  }, [id, navigate, setValue]);

  const onSubmit = async (data: Category) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await updateCategory(data.id, {
        name: data.name,
          
        // Gérez le cas où description est undefined
        description: data.description ?? '' 
      });
      
      setSubmitSuccess(true);
      navigate('/categories');
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to update the category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return <div>Loading category...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
      <h2>Edit Category</h2>
      
      <div className={styles.formGroup}>
        <label>Category Name</label>
        <input
          {...register('name')}
          placeholder="Enter category name"
          className={errors.name ? styles.inputError : ''}
        />
        {errors.name && <p className={styles.errorMessage}>{errors.name.message}</p>}
      </div>
      
      <div className={styles.formGroup}>
        <label>Description (Optional)</label>
        <textarea
          {...register('description')}
          placeholder="Enter category description"
          className={errors.description ? styles.inputError : ''}
          rows={4}
        />
        {errors.description && <p className={styles.errorMessage}>{errors.description.message}</p>}
      </div>
      
      <div className={styles.buttonGroup}>
        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? 'Updating...' : 'Update Category'}
        </button>
        
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => navigate('/categories')}
        >
          Cancel
        </button>
      </div>

      {submitError && <p className={styles.errorMessage}>{submitError}</p>}
      {submitSuccess && <p className={styles.successMessage}>Category successfully updated!</p>}
    </form>
  );
};

export default EditCategoryForm;