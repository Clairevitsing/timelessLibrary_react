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
    publishedYear: string;
    description: string;
    image: string;
    available: boolean;
    authorIds: number[];  
    categoryId: number; 
}