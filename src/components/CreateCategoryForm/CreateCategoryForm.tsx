import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { createNewCategory } from '../../services/CategoryService';
import styles from './CreateCategoryForm.module.css';

type CategoryFormData = {
  name: string;
  description: string;
};

const categorySchema = Yup.object().shape({
  name: Yup.string()
    .required('Category name is required')
    .min(2, 'Category name must be at least 2 characters')
    .max(50, 'Category name must be at most 50 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(200, 'Description must be at most 200 characters')
});

const CreateCategoryForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const newCategory = await createNewCategory(data);
      setSubmitSuccess(true);
      reset();
      navigate(`/categories`);
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to create the category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
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
        <label>Description</label>
        <textarea 
          {...register('description')} 
          placeholder="Enter category description"
          className={errors.description ? styles.inputError : ''}
          rows={4}
        />
        {errors.description && <p className={styles.errorMessage}>{errors.description.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting ? 'Creating...' : 'Create Category'}
      </button>

      {submitError && <p className={styles.errorMessage}>{submitError}</p>}
      {submitSuccess && <p className={styles.successMessage}>Category successfully created!</p>}
    </form>
  );
};

export default CreateCategoryForm;