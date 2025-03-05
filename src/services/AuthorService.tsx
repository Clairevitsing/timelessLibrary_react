
import axios from 'axios';
import { Author,AuthorSearchParams, AuthorCreationData } from '../models/Author';

const BASE_API_URL = "http://127.0.0.1:8000/api/authors";

export const fetchAuthors = async (): Promise<Author[]> => {
  try {
    const response = await axios.get(BASE_API_URL);
    
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('No author data found in response or incorrect response format');
    }
    
    return response.data.map((authorData: any): Author => ({
      id: authorData.id,
      firstName: authorData.firstName,
      lastName: authorData.lastName,
      birthDate: authorData.birthDate ? new Date(authorData.birthDate) : null,
      biography: authorData.biography
    }));
  } catch (error) {
    console.error('Error fetching authors:', error);
    throw new Error('Failed to fetch authors');
  }
};

export const fetchAuthorById = async (authorId: number): Promise<Author> => {
  try {
    const response = await axios.get(`${BASE_API_URL}/${authorId}`);
    
    if (!response.data) {
      throw new Error('No author data found');
    }
    
    return {
      id: response.data.id,
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      birthDate: response.data.birthDate ? new Date(response.data.birthDate) : null,
      biography: response.data.biography
    };
  } catch (error) {
    console.error(`Error fetching author ${authorId}:`, error);
    throw new Error('Failed to fetch author');
  }
};



export const updateAuthor = async (authorId: number, authorData: Omit<Author, 'id'>): Promise<Author> => {
  try {
    const response = await axios.put(`${BASE_API_URL}/${authorId}`, authorData);
    
    if (!response.data) {
      throw new Error('No author data returned after update');
    }
    
    return {
      id: response.data.id,
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      birthDate: response.data.birthDate ? new Date(response.data.birthDate) : null,
      biography: response.data.biography
    };
  } catch (error) {
    console.error(`Error updating author ${authorId}:`, error);
    throw new Error('Failed to update author');
  }
};


export const searchAuthors = async (
  params: AuthorSearchParams
): Promise<Author[]> => {
  try {
    // Validate input parameters
    if (!params.firstName && !params.lastName) {
      console.warn('Search parameters are empty');
      return [];
    }

    // Prepare clean query parameters
    const cleanParams: Record<string, string> = {};

    // Add non-empty parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        cleanParams[key] = typeof value === 'string' 
          ? value.trim() 
          : value instanceof Date 
            ? value.toISOString().split('T')[0]
            : String(value);
      }
    });

    // Make the API request
    const response = await axios.get<Author[]>(`${BASE_API_URL}/search`, {
      params: cleanParams,
      timeout: 5000
    });

    // Validate and return response
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error searching authors:', error);
    return [];
  }
};

// Updated find or create method
export const findOrCreateAuthor = async (
  firstName: string,
  lastName: string,
  biography: string = '', 
  birthDate: string = '',
  bookIds: number[] = [] 
): Promise<number> => {
  try {
    // Search parameters
    const searchParams: AuthorSearchParams = {
      firstName,
      lastName,
      biography,
      birthDate
    };

    // Search for existing authors
    const existingAuthors = await searchAuthors(searchParams);

    // If author exists, return first match
    if (existingAuthors.length > 0) {
      return existingAuthors[0].id;
    }

    // If no author found, create new author
    const newAuthorData: AuthorCreationData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      biography: biography?.trim() || `Biography for ${firstName} ${lastName}`,
      birthDate: birthDate ? new Date(birthDate) : null,
      bookIds: bookIds 
    };

    // Create the new author
    const createdAuthor = await addNewAuthor(newAuthorData);

    return createdAuthor.id;
  } catch (error) {
    console.error('Error finding or creating author:', error);
    throw new Error(`Failed to find or create author: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};


export const addNewAuthor = async (
  authorData: Omit<Author, 'id'> & { bookIds?: number[] }
): Promise<Author> => {
  try {
    // Default to empty array if no book IDs provided
    const bookIds = authorData.bookIds || [];

    const postData = {
      firstName: authorData.firstName.trim(),
      lastName: authorData.lastName.trim(),
      biography: authorData.biography 
        ? authorData.biography.trim() 
        : `Biography for ${authorData.firstName} ${authorData.lastName}`,
      birthDate: authorData.birthDate 
        ? (authorData.birthDate instanceof Date 
          ? authorData.birthDate.toISOString().split('T')[0] 
          : new Date(authorData.birthDate).toISOString().split('T')[0])
        : null,
      bookIds: bookIds
    };

    const response = await axios.post(`${BASE_API_URL}/new`, postData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return {
      id: Number(response.data.id),
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      birthDate: response.data.birthDate ? new Date(response.data.birthDate) : null,
      biography: response.data.biography
    };
  } catch (error) {
    console.error('Error adding new author:', error);
    throw error;
  }
};


export const deleteAuthor = async (id: number): Promise<void> => {
  const response = await fetch(`${BASE_API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete author');
  }
};
