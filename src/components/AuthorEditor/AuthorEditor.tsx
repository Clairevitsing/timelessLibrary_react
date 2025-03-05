import React, { useState, useEffect } from 'react';
import { Author } from '../../models/Author';
import styles from './AuthorEditor.module.css';

export interface AuthorEditorProps {
  initialAuthor: Author | null;
  onSaveAuthor: (authorData: Omit<Author, 'id'>) => Promise<Author>;
  onCancel: () => void;
  className?: string;
}

const AuthorEditor: React.FC<AuthorEditorProps> = ({
  initialAuthor,
  onSaveAuthor,
  onCancel,
  className = ''
}) => {
  const [author, setAuthor] = useState<Author>(initialAuthor || { id: 0, firstName: '', lastName: '', birthDate: new Date(), biography: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialAuthor) {
      setAuthor(initialAuthor);
    }
  }, [initialAuthor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAuthor(prev => ({
      ...prev,
      [name]: name === 'birthDate' ? new Date(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { id, ...authorData } = author;
      await onSaveAuthor(authorData);
    } catch (err) {
      setError('Failed to save author. Please try again.');
      console.error('Error saving author:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

 const formatDate = (date: Date | string | null): string => {
  if (!date) return ""; 
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toISOString().split('T')[0];
  };
  
  return (
    <div className={`${styles.authorEditor} ${className}`}>
      <div>
        <div className="mb-3">
          <label className="block">First Name</label>
          <input
            type="text"
            name="firstName"
            value={author.firstName}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
        </div>

        <div className="mb-3">
          <label className="block">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={author.lastName}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
        </div>

        <div className="mb-3">
          <label className="block">Birth Date</label>
          <input
            type="date"
            name="birthDate"
            value={formatDate(author.birthDate)}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block">Biography</label>
          <textarea
            name="biography"
            value={author.biography}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>

        {error && <p className={styles.textRed}>{error}</p>}

        <div className="d-flex justify-content-center">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary me-3"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : author.id ? 'Update Author' : 'Add Author'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthorEditor;
