import React, { useState, useEffect } from 'react';
import { Author } from '../../models/Author';

export interface AuthorEditorProps {
  initialAuthor: Author;
  onSaveAuthor: (authorData: Omit<Author, "id">) => Promise<Author>;
  onCancel: () => void;
  className?: string;
}

const AuthorEditor: React.FC<AuthorEditorProps> = ({
  initialAuthor,
  onSaveAuthor,
  onCancel,
  className = ''
}) => {
  const [author, setAuthor] = useState<Author>(initialAuthor);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update local state when initialAuthor changes
  useEffect(() => {
    setAuthor(initialAuthor);
  }, [initialAuthor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAuthor(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Omit the id when sending to onSaveAuthor
      const { id, ...authorData } = author;
      await onSaveAuthor(authorData);
    } catch (err) {
      setError('Failed to save author. Please try again.');
      console.error('Error saving author:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`author-editor ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            value={author.firstName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={author.lastName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Biography</label>
          <textarea
            name="biography"
            value={author.biography}
            onChange={handleChange}
            className="w-full p-2 border rounded h-24"
          />
        </div>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 border rounded hover:bg-gray-100"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : author.id ? 'Update Author' : 'Add Author'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthorEditor;