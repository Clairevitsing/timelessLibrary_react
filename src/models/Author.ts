import { Book } from './Book';

export type Author ={
  id: number;
  firstName: string;
  lastName: string;
  birthDate: Date | null;
  biography: string;
  books?: Book[];
}

export type AuthorFormData = {
  firstName: string;
  lastName: string;
  biography: string;
  birthDate: string;
}

// New type for search parameters
export type AuthorSearchParams = {
  firstName?: string;
  lastName?: string;
  biography?: string;
  birthDate?: string | Date;
}

// Type for creating a new author (omitting ID)
export type AuthorCreationData = Omit<Author, 'id'> & {
  // Optional for creation
  // books?: Book[]; 
   bookIds: number[];
}

// Optional: Type for API response during author creation
export type AuthorCreationResponse = {
  id: number;
  message?: string;
} & Author;
