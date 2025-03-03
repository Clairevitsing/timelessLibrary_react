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

export type NewBookData = {
    title: string;
  ISBN: string;
    // Peut être une Date en mémoire ou une string lors de l'envoi à l'API
    publishedYear: string | Date;  
    description: string;
    image: string;
    available: boolean;
    authorIds: number[];  
    categoryId: number;
}

// Fonction utilitaire pour convertir une date en format YYYY-MM-DD pour l'API
export function formatDateForApi(date: Date | string | undefined): string | undefined {
    if (!date) return undefined;
    
    if (date instanceof Date) {
        return date.toISOString().split('T')[0];
    }
     // Déjà sous forme de string
    return date; 
}