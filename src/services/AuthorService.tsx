import axios from 'axios';
import { Author } from '../models/Author';

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

export const addNewAuthor = async (authorData: Omit<Author, 'id'>): Promise<Author> => {
  try {
    const response = await axios.post(BASE_API_URL, authorData);
    
    if (!response.data) {
      throw new Error('No author data returned after creation');
    }
    
    return {
      id: response.data.id,
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      birthDate: response.data.birthDate ? new Date(response.data.birthDate) : null,
      biography: response.data.biography
    };
  } catch (error) {
    console.error('Error adding new author:', error);
    throw new Error('Failed to add new author');
  }
};