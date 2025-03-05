import { Author } from './Author';
import { Category } from './Category';

export type Book = {
  id: number;
  title: string;
  ISBN: string;
  publishedYear: Date;
  description: string;
  image: string;
  available: boolean;
  authors: Author[];
  category?: Category;  
}

export interface BookFormData {
  title: string;
  ISBN: string;
  publishedYear: string;
  description: string;
  image: string;
  available: boolean;
  categoryName: string;
  authors: Author[];
  authorIds?: number[];
}

export interface NewBookData extends Omit<BookFormData, 'authors' | 'categoryName'> {
  categoryId: number;
  authorIds?: number[];
}

/**
 * Formats a date for API compatibility
 * @param date - Date to be formatted (Date object, string, or undefined)
 * @returns Formatted date string in YYYY-MM-DD format or undefined
 */
export function formatDateForApi(date: Date | string | undefined): string | undefined {
    if (!date) return undefined;
   
    if (date instanceof Date) {
        return date.toISOString().split('T')[0];
    }
     
    // If already a string, return as is (assuming it's already in correct format)
    return date;
}

